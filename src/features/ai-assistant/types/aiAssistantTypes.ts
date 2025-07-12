export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: string;
  user_id: string;
  chat_session_id: string;
  type?: "text" | "code" | "image" | "video";
  metadata?: {
    language?: string;
    fileName?: string;
    fileSize?: number;
    duration?: number;
  };
  videoUrl?: string;
  conversationUrl?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  is_archived: boolean;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface AIAssistantState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  settings: ChatSettings;
}

export interface VideoResponse {
  id: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  title?: string;
  description?: string;
}

export interface TavusResponse {
  id: string;
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
}
