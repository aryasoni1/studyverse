export interface BaseContent {
  id: string;
  title: string;
  description?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export interface NoteCard extends BaseContent {
  type: "note";
  preview: string;
  subject?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readingTime: number; // in minutes
  isPublic: boolean;
  isFavorite: boolean;
  wordCount: number;
}

export interface RoadmapCard extends BaseContent {
  type: "roadmap";
  totalSteps: number;
  completedSteps: number;
  estimatedTime?: string; // e.g., "4 weeks"
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  isPublic: boolean;
}

export interface StudyRoomCard extends BaseContent {
  type: "studyroom";
  isLive: boolean;
  currentUsers: number;
  maxUsers: number;
  topic?: string;
  startTime?: string;
  endTime?: string;
  isPublic: boolean;
}

export type SearchResult = NoteCard | RoadmapCard | StudyRoomCard;

export interface DiscoveryFilter {
  topics: string[];
  difficulty: ("beginner" | "intermediate" | "advanced")[];
  contentType: ("note" | "roadmap" | "studyroom")[];
  sortBy: "recent" | "popular" | "trending" | "recommended";
  duration?: {
    min: number;
    max: number;
  };
}

export interface Recommendation {
  id: string;
  content: SearchResult;
  reason: string;
  confidence: number;
}

export interface DiscoveryState {
  searchQuery: string;
  filters: DiscoveryFilter;
  results: SearchResult[];
  trending: SearchResult[];
  recommended: Recommendation[];
  isLoading: boolean;
  hasMore: boolean;
  error?: string;
}

export interface SearchParams {
  query: string;
  filters: Partial<DiscoveryFilter>;
  page: number;
  limit: number;
}
