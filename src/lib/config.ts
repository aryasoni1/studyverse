// Comprehensive configuration for all services
export interface ServiceConfig {
  name: string;
  isConfigured: boolean;
  isConnected: boolean;
  error?: string;
}

export interface AppConfig {
  app: {
    name: string;
    url: string;
    environment: string;
  };
  supabase: ServiceConfig;
  livekit: ServiceConfig;
  tavus: ServiceConfig;
  gemini: ServiceConfig;
  openai: ServiceConfig;
}

// Environment variables validation
const getEnvVar = (key: string, required = false): string | undefined => {
  const value = import.meta.env[key];
  if (required && !value) {
    console.warn(`Missing required environment variable: ${key}`);
  }
  return value;
};

// Supabase configuration
export const supabaseConfig: ServiceConfig = {
  name: "Supabase",
  isConfigured: !!(
    getEnvVar("VITE_SUPABASE_URL") && getEnvVar("VITE_SUPABASE_ANON_KEY")
  ),
  isConnected: false,
};

// LiveKit configuration
export const livekitConfig: ServiceConfig = {
  name: "LiveKit",
  isConfigured: !!(
    getEnvVar("VITE_LIVEKIT_URL") &&
    getEnvVar("VITE_LIVEKIT_API_KEY") &&
    getEnvVar("VITE_LIVEKIT_API_SECRET")
  ),
  isConnected: false,
};

// Tavus configuration
export const tavusConfig: ServiceConfig = {
  name: "Tavus",
  isConfigured: !!getEnvVar("VITE_TAVUS_API_KEY"),
  isConnected: false,
};

// Gemini configuration
export const geminiConfig: ServiceConfig = {
  name: "Gemini",
  isConfigured: !!getEnvVar("VITE_GEMINI_API_KEY"),
  isConnected: false,
};

// OpenAI configuration
export const openaiConfig: ServiceConfig = {
  name: "OpenAI",
  isConfigured: !!getEnvVar("VITE_OPENAI_API_KEY"),
  isConnected: false,
};

// Main app configuration
export const appConfig: AppConfig = {
  app: {
    name: getEnvVar("VITE_APP_NAME", true) || "SkillForge",
    url: getEnvVar("VITE_APP_URL", true) || "http://localhost:5173",
    environment: import.meta.env.MODE || "development",
  },
  supabase: supabaseConfig,
  livekit: livekitConfig,
  tavus: tavusConfig,
  gemini: geminiConfig,
  openai: openaiConfig,
};

// Configuration validation
export const validateConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!appConfig.supabase.isConfigured) {
    errors.push("Supabase configuration is missing");
  }

  if (!appConfig.livekit.isConfigured) {
    errors.push("LiveKit configuration is missing");
  }

  if (!appConfig.tavus.isConfigured) {
    errors.push("Tavus configuration is missing");
  }

  if (!appConfig.gemini.isConfigured) {
    errors.push("Gemini configuration is missing");
  }

  if (!appConfig.openai.isConfigured) {
    errors.push("OpenAI configuration is missing");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Service connection testers
export const testSupabaseConnection = async (): Promise<ServiceConfig> => {
  try {
    const { supabase } = await import("./supabase");
    const { error } = await supabase.from("profiles").select("count").limit(1);

    if (error) throw error;

    return {
      ...supabaseConfig,
      isConnected: true,
    };
  } catch (error) {
    return {
      ...supabaseConfig,
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const testLiveKitConnection = async (): Promise<ServiceConfig> => {
  try {
    // Get current user session for proper authentication
    const { supabase } = await import("./supabase");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        ...livekitConfig,
        isConnected: false,
        error: "No authenticated user session found",
      };
    }

    // Test LiveKit connection by attempting to get a token with real user auth
    const response = await fetch(
      `${getEnvVar("VITE_SUPABASE_URL")}/functions/v1/livekit-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          room_id: "test-room",
          participant_name: "test-user",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText);

      // If the error is "Study room not found", that means authentication worked
      // but the room doesn't exist, which is expected for a test
      if (errorData.error === "Study room not found") {
        return {
          ...livekitConfig,
          isConnected: true,
        };
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      ...livekitConfig,
      isConnected: true,
    };
  } catch (error) {
    return {
      ...livekitConfig,
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const testTavusConnection = async (): Promise<ServiceConfig> => {
  try {
    const { tavusService } = await import("../features/ai-assistant/lib/tavus");
    await tavusService.listAvatars();

    return {
      ...tavusConfig,
      isConnected: true,
    };
  } catch (error) {
    return {
      ...tavusConfig,
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const testGeminiConnection = async (): Promise<ServiceConfig> => {
  try {
    const apiKey = getEnvVar("VITE_GEMINI_API_KEY");
    if (!apiKey) throw new Error("Gemini API key not configured");

    // Test Gemini API with a simple request using the correct model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hello, this is a test message.",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "Gemini API error");
    }

    return {
      ...geminiConfig,
      isConnected: true,
    };
  } catch (error) {
    return {
      ...geminiConfig,
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const testOpenAIConnection = async (): Promise<ServiceConfig> => {
  try {
    const apiKey = getEnvVar("VITE_OPENAI_API_KEY");
    if (!apiKey) throw new Error("OpenAI API key not configured");

    // Test OpenAI API with a simple request
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return {
      ...openaiConfig,
      isConnected: true,
    };
  } catch (error) {
    return {
      ...openaiConfig,
      isConnected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Test all connections
export const testAllConnections = async (): Promise<AppConfig> => {
  const [supabase, livekit, tavus, gemini, openai] = await Promise.allSettled([
    testSupabaseConnection(),
    testLiveKitConnection(),
    testTavusConnection(),
    testGeminiConnection(),
    testOpenAIConnection(),
  ]);

  return {
    ...appConfig,
    supabase:
      supabase.status === "fulfilled"
        ? supabase.value
        : { ...supabaseConfig, isConnected: false, error: "Test failed" },
    livekit:
      livekit.status === "fulfilled"
        ? livekit.value
        : { ...livekitConfig, isConnected: false, error: "Test failed" },
    tavus:
      tavus.status === "fulfilled"
        ? tavus.value
        : { ...tavusConfig, isConnected: false, error: "Test failed" },
    gemini:
      gemini.status === "fulfilled"
        ? gemini.value
        : { ...geminiConfig, isConnected: false, error: "Test failed" },
    openai:
      openai.status === "fulfilled"
        ? openai.value
        : { ...openaiConfig, isConnected: false, error: "Test failed" },
  };
};