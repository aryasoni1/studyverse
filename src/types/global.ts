// Global type definitions for the application

export interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  avatar_url?: string;
  subscription_tier?: "free" | "premium";
  usage_count?: number;
  usage_limit?: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  progress: number;
  estimated_duration: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  duration: number;
  topic: string;
  notes?: string;
  started_at: string;
  completed_at?: string;
}

export interface APIResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}
