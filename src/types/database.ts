// Database types based on Supabase schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          timezone: string;
          learning_goals: string[] | null;
          skills_interested: string[] | null;
          experience_level: "beginner" | "intermediate" | "advanced";
          preferred_language: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          timezone?: string;
          learning_goals?: string[] | null;
          skills_interested?: string[] | null;
          experience_level?: "beginner" | "intermediate" | "advanced";
          preferred_language?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          timezone?: string;
          learning_goals?: string[] | null;
          skills_interested?: string[] | null;
          experience_level?: "beginner" | "intermediate" | "advanced";
          preferred_language?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          post_type: string;
          skill_id: string | null;
          tags: string[];
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          like_count: number;
          comment_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          post_type?: string;
          skill_id?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          post_type?: string;
          skill_id?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          like_count?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          like_count: number;
          is_solution: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          like_count?: number;
          is_solution?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          parent_id?: string | null;
          content?: string;
          like_count?: number;
          is_solution?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string | null;
          comment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          estimated_hours: number;
          prerequisites: string[];
          tags: string[];
          icon_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category: string;
          difficulty: "beginner" | "intermediate" | "advanced";
          estimated_hours?: number;
          prerequisites?: string[];
          tags?: string[];
          icon_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: string;
          difficulty?: "beginner" | "intermediate" | "advanced";
          estimated_hours?: number;
          prerequisites?: string[];
          tags?: string[];
          icon_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced";
      task_status: "pending" | "in_progress" | "completed" | "cancelled";
      roadmap_status: "not_started" | "in_progress" | "completed" | "paused";
      study_room_status: "active" | "paused" | "ended";
      notification_type:
        | "achievement"
        | "reminder"
        | "social"
        | "system"
        | "ai_suggestion";
      achievement_type:
        | "streak"
        | "skill_mastery"
        | "community"
        | "milestone"
        | "special";
      plan_type: "free" | "pro" | "enterprise";
    };
  };
}
