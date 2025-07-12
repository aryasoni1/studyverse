// API-specific type definitions

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
  skill_id?: string;
}

export interface CreateStudySessionRequest {
  topic: string;
  estimated_duration?: number;
}

export interface SearchRequest {
  query: string;
  filters?: {
    category?: string;
    difficulty?: string;
    type?: 'skills' | 'courses' | 'notes' | 'users';
  };
  limit?: number;
  page?: number;
}

export interface AIAssistantRequest {
  message: string;
  context?: {
    skill?: string;
    topic?: string;
    user_level?: string;
  };
}

export interface AIAssistantResponse {
  response: string;
  suggestions?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'course';
  }>;
}