import prompts from "@/features/ai-assistant/api/prompts.config.json";

// Set the default Gemini model here. You can change this to any available model.
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  };
}

export interface GeminiModelsResponse {
  models: Array<{
    name: string;
    displayName: string;
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_BASE_URL;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<GeminiResponse> {
    const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  private async makeModelsRequest(): Promise<GeminiModelsResponse> {
    const url = `${this.baseUrl}/models?key=${this.apiKey}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async generateText(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    } = {}
  ): Promise<string> {
    try {
      const {
        temperature = 0.7,
        maxTokens = 1000,
        model = DEFAULT_GEMINI_MODEL,
      } = options;

      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      };

      const response = await this.makeRequest(
        `/models/${model}:generateContent`,
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      );

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No response generated");
      }

      return response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini text generation error:", error);
      throw new Error("Failed to generate text with Gemini");
    }
  }

  async generateEducationalResponse(
    question: string,
    context?: {
      skill?: string;
      topic?: string;
      userLevel?: string;
    }
  ): Promise<{
    answer: string;
    explanation: string;
    examples: string[];
    resources: Array<{
      title: string;
      description: string;
      url?: string;
    }>;
  }> {
    try {
      const contextPrompt = context
        ? `Context: Skill: ${context.skill || "General"}, Topic: ${
            context.topic || "General"
          }, User Level: ${context.userLevel || "Beginner"}\n\n`
        : "";

      const prompt = `${contextPrompt}Question: ${question}

Please provide a comprehensive educational response that includes:
1. A clear and accurate answer
2. A detailed explanation
3. Practical examples
4. Recommended learning resources

Format your response as JSON with the following structure:
{
  "answer": "Clear answer here",
  "explanation": "Detailed explanation here",
  "examples": ["Example 1", "Example 2", "Example 3"],
  "resources": [
    {
      "title": "Resource Title",
      "description": "Resource description",
      "url": "Optional URL"
    }
  ]
}`;

      const response = await this.generateText(prompt, {
        temperature: 0.3,
        maxTokens: 2000,
      });

      try {
        const parsed = JSON.parse(response);
        return {
          answer: parsed.answer || "No answer provided",
          explanation: parsed.explanation || "No explanation provided",
          examples: parsed.examples || [],
          resources: parsed.resources || [],
        };
      } catch {
        // If JSON parsing fails, return a structured response
        return {
          answer: response,
          explanation: "Response provided as text",
          examples: [],
          resources: [],
        };
      }
    } catch (error) {
      console.error("Gemini educational response error:", error);
      throw new Error("Failed to generate educational response");
    }
  }

  async generateCodeExplanation(
    code: string,
    language: string
  ): Promise<{
    explanation: string;
    breakdown: string[];
    suggestions: string[];
  }> {
    try {
      const prompt = `Please explain this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. A clear explanation of what the code does
2. A line-by-line breakdown
3. Suggestions for improvement

Format as JSON:
{
  "explanation": "Overall explanation",
  "breakdown": ["Line 1: ...", "Line 2: ..."],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}`;

      const response = await this.generateText(prompt, {
        temperature: 0.2,
        maxTokens: 1500,
      });

      try {
        const parsed = JSON.parse(response);
        return {
          explanation: parsed.explanation || "No explanation provided",
          breakdown: parsed.breakdown || [],
          suggestions: parsed.suggestions || [],
        };
      } catch {
        return {
          explanation: response,
          breakdown: [],
          suggestions: [],
        };
      }
    } catch (error) {
      console.error("Gemini code explanation error:", error);
      throw new Error("Failed to generate code explanation");
    }
  }

  async listModels(): Promise<Array<{ name: string; displayName: string }>> {
    try {
      const response = await this.makeModelsRequest();
      return response.models || [];
    } catch (error) {
      console.error("Gemini models list error:", error);
      throw new Error("Failed to list Gemini models");
    }
  }
}

export const geminiService = new GeminiService();

/**
 * Replace variables in a prompt template with actual values.
 * @param template The prompt template string (e.g., 'Hello {{name}}')
 * @param variables An object of variable replacements (e.g., { name: 'Arya' })
 */
function fillPrompt(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || "");
}

/**
 * Generate a Gemini response using a named prompt from prompts.config.json
 * @param feature The feature key (e.g., 'roadmap_generation')
 * @param variables The variables to fill in the prompt
 * @param options Gemini generation options (optional)
 */
export async function generateWithPrompt(
  feature: keyof typeof prompts,
  variables: Record<string, string>,
  options: { temperature?: number; maxTokens?: number; model?: string } = {}
): Promise<string> {
  const promptConfig = prompts[feature];
  if (!promptConfig)
    throw new Error(`Prompt config not found for feature: ${feature}`);
  const userPrompt = fillPrompt(promptConfig.user_prompt, variables);
  const systemPrompt = promptConfig.system_prompt;
  // Concatenate system and user prompt for Gemini
  const finalPrompt = `${systemPrompt}\n\n${userPrompt}`;
  const gemini = new GeminiService();
  return await gemini.generateText(finalPrompt, options);
}
