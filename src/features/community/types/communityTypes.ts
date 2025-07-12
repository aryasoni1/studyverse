export interface User {
  id: string;
  name: string;
  avatar: string;
  role: "user" | "admin" | "moderator";
  badge?: string;
}

export interface Reaction {
  id: string;
  type: "like" | "helpful" | "love" | "dislike" | "celebrate" | "insightful";
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: "feedback" | "bug" | "feature" | "announcement" | "discussion";
  status:
    | "open"
    | "under_review"
    | "planned"
    | "resolved"
    | "closed"
    | "in_progress"
    | "completed";
  tags: string[];
  author: User;
  timestamps: {
    created: string;
    updated: string;
  };
  engagement: {
    comments: Comment[];
    reactions: Reaction[];
  };
  isPinned?: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface PostFormData {
  title: string;
  content: string;
  category: Post["category"];
  tags: string[];
}

export interface FilterOptions {
  category?: Post["category"];
  status?: Post["status"];
  tags?: string[];
  search?: string;
  sortBy?: "newest" | "oldest" | "popular" | "commented";
}

export interface PaginationOptions {
  page: number;
  limit: number;
  hasMore: boolean;
}
