// Community-related type definitions

export interface Post {
  id: string;
  title: string;
  content: string;
  category: "feedback" | "bug" | "feature" | "announcement" | "discussion";
  status:
    | "open"
    | "under_review"
    | "planned"
    | "in_progress"
    | "completed"
    | "closed"
    | "resolved";
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    role: "user" | "admin" | "moderator";
    badge: "beginner" | "intermediate" | "advanced" | "team";
  };
  timestamps: {
    created: string;
    updated: string;
  };
  engagement: {
    comments: Comment[];
    reactions: Reaction[];
  };
  isPinned?: boolean;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: "user" | "admin" | "moderator";
    badge: "beginner" | "intermediate" | "advanced" | "team";
  };
  postId: string;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
}

export interface Reaction {
  id: string;
  type: "like" | "helpful" | "love" | "dislike" | "celebrate" | "insightful";
  userId: string;
  postId: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: "user" | "admin" | "moderator";
  badge?: "beginner" | "intermediate" | "advanced" | "team";
}

export interface FilterOptions {
  category?: string;
  status?: string;
  tags?: string[];
  author?: string;
  priority?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
  hasMore: boolean;
  total?: number;
}
