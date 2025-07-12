import { create } from "zustand";
import type { ChatSession } from "@/features/ai-assistant/types/aiAssistantTypes";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  role: "user" | "assistant";
  conversationUrl?: string;
}

// Mock data for demonstration
const MOCK_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    user_id: "mock-user-123",
    title: "Getting Started with React",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 5,
    is_archived: false,
  },
  {
    id: "session-2",
    user_id: "mock-user-123",
    title: "TypeScript Best Practices",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 3,
    is_archived: false,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "session-1": [
    {
      id: "msg-1",
      user_id: "mock-user-123",
      content: "How do I get started with React?",
      created_at: new Date().toISOString(),
      role: "user",
    },
    {
      id: "msg-2",
      user_id: "ai-assistant",
      content: "React is a great choice! Here's how to get started...",
      created_at: new Date().toISOString(),
      role: "assistant",
    },
  ],
  "session-2": [
    {
      id: "msg-3",
      user_id: "mock-user-123",
      content: "What are some TypeScript best practices?",
      created_at: new Date().toISOString(),
      role: "user",
    },
  ],
};

interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;

  // Actions
  createSession: (title?: string) => Promise<ChatSession>;
  loadSession: (sessionId: string) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  sendMessage: (
    content: string,
    user_id: string,
    feature: string
  ) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  clearCurrentSession: () => void;
  fetchMessages: () => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentSession: null,
  sessions: [],
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingContent: "",

  createSession: async (title = "New Chat") => {
    console.log("ChatStore: Creating new session with hardcoded data...");

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      user_id: "mock-user-123",
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
      is_archived: false,
    };

    set((state) => ({
      currentSession: newSession,
      sessions: [newSession, ...state.sessions],
      messages: [],
    }));

    return newSession;
  },

  loadSession: async (sessionId: string) => {
    console.log("ChatStore: Loading session with hardcoded data:", sessionId);
    set({ isLoading: true });

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
    const messages = MOCK_MESSAGES[sessionId] || [];

    if (session) {
      set({
        currentSession: session,
        messages,
        isLoading: false,
      });
    } else {
      console.error("Session not found:", sessionId);
      set({ isLoading: false });
    }
  },

  loadSessions: async (userId: string) => {
    console.log(
      "ChatStore: Loading sessions with hardcoded data for user:",
      userId
    );

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    set({ sessions: MOCK_SESSIONS });
  },

  sendMessage: async (content: string, user_id: string, feature: string) => {
    const { currentSession } = get();
    if (!currentSession) {
      throw new Error("No active session");
    }

    // Map user input to variables based on feature
    let variables: Record<string, string> = {};
    switch (feature) {
      case "roadmap_generation":
      case "collaborate":
        variables = { goal: content };
        break;
      case "notes_generation":
        variables = { topic: content };
        break;
      case "summary":
        variables = { input_text: content };
        break;
      case "interview":
        variables = { role: content };
        break;
      case "ask":
      default:
        variables = { question: content };
        break;
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content,
      role: "user",
      created_at: new Date().toISOString(),
      user_id,
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      isStreaming: true,
    }));

    try {
      // Log the payload for debugging
      console.log("AI chat payload:", {
        feature,
        variables,
        session_id: currentSession.id,
      });
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          feature,
          variables,
          session_id: currentSession.id,
        },
      });

      if (error) {
        console.error("AI chat error:", error);
        throw new Error(`AI chat failed: ${error.message}`);
      }

      // Create AI response message
      if (
        feature === "interview_realtime" &&
        (data.conversationUrl || data.conversation_url)
      ) {
        console.log("interview_realtime data:", data);
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now()}-ai`,
          content:
            "Your real-time AI interview is ready! Click the button below to join.",
          role: "assistant",
          created_at: new Date().toISOString(),
          user_id: "ai",
          conversationUrl: data.conversationUrl || data.conversation_url,
        };
        set((state) => ({
          messages: [...state.messages, aiMessage],
          isLoading: false,
          isStreaming: false,
          streamingContent: "",
        }));
        return;
      }

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: data.response || "I'm sorry, I couldn't process your request.",
        role: "assistant",
        created_at: new Date().toISOString(),
        user_id: "ai",
      };

      set((state) => ({
        messages: [...state.messages, aiMessage],
        isLoading: false,
        isStreaming: false,
        streamingContent: "",
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        created_at: new Date().toISOString(),
        user_id: "ai",
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
        isStreaming: false,
        streamingContent: "",
      }));
      throw error;
    }
  },

  deleteSession: async (sessionId: string) => {
    console.log("ChatStore: Deleting session:", sessionId);

    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSession:
        state.currentSession?.id === sessionId ? null : state.currentSession,
      messages: state.currentSession?.id === sessionId ? [] : state.messages,
    }));
  },

  updateSessionTitle: async (sessionId: string, title: string) => {
    console.log("ChatStore: Updating session title:", sessionId, title);

    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, title, updated_at: new Date().toISOString() }
          : s
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? {
              ...state.currentSession,
              title,
              updated_at: new Date().toISOString(),
            }
          : state.currentSession,
    }));
  },

  clearCurrentSession: () => {
    set({
      currentSession: null,
      messages: [],
      streamingContent: "",
      isStreaming: false,
    });
  },

  fetchMessages: async () => {
    const { currentSession } = get();
    if (!currentSession) return;

    set({ isLoading: true });

    try {
      // Fetch messages from ai_chat_history table
      const { data, error } = await supabase
        .from("ai_chat_history")
        .select("*")
        .eq("session_id", currentSession.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch messages:", error);
        throw error;
      }

      // Convert ai_chat_history records to Message format
      const messages: ChatMessage[] = [];

      if (data) {
        data.forEach((record) => {
          // Add user message
          messages.push({
            id: `${record.id}-user`,
            content: record.message,
            role: "user",
            created_at: record.created_at,
            user_id: record.user_id,
          });

          // Add AI response
          messages.push({
            id: `${record.id}-ai`,
            content: record.response,
            role: "assistant",
            created_at: record.created_at,
            user_id: "ai",
          });
        });
      }

      set({ messages, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
