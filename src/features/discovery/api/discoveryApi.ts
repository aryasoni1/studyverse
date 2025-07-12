import {
  SearchResult,
  SearchParams,
  NoteCard,
  RoadmapCard,
  StudyRoomCard,
} from "../types/discoveryTypes";
import { supabase } from "@/lib/supabase";

const mapNote = (item: Record<string, unknown>): NoteCard => ({
  id: item.id as string,
  title: item.title as string,
  description: (item.content as string)?.slice(0, 120) || "",
  author: {
    id: item.user_id as string,
    name: (item.author_name as string) || "Unknown",
    avatar: (item.author_avatar as string) || undefined,
  },
  tags: (item.tags as string[]) || [],
  createdAt: item.created_at as string,
  updatedAt: item.updated_at as string,
  likes: (item.like_count as number) || 0,
  views: (item.view_count as number) || 0,
  isBookmarked: (item.is_favorite as boolean) || false,
  isLiked: false, // You may want to check user-specific likes
  type: "note",
  preview: (item.content as string)?.slice(0, 200) || "",
  subject: (item.skill_id as string) || undefined,
  difficulty:
    (item.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
  readingTime: (item.reading_time as number) || 0,
  isPublic: item.is_public as boolean,
  isFavorite: (item.is_favorite as boolean) || false,
  wordCount: (item.word_count as number) || 0,
});

const mapRoadmap = (item: Record<string, unknown>): RoadmapCard => ({
  id: item.id as string,
  title: item.title as string,
  description: (item.description as string) || "",
  author: {
    id: item.user_id as string,
    name: (item.author_name as string) || "Unknown",
    avatar: (item.author_avatar as string) || undefined,
  },
  tags: (item.tags as string[]) || [],
  createdAt: item.created_at as string,
  updatedAt: item.updated_at as string,
  likes: 0, // Add like logic if available
  views: 0, // Add view logic if available
  isBookmarked: false,
  isLiked: false,
  type: "roadmap",
  totalSteps: (item.total_steps as number) || 0,
  completedSteps: (item.completed_steps as number) || 0,
  estimatedTime: item.estimated_duration
    ? `${item.estimated_duration as number} hours`
    : undefined,
  difficulty:
    (item.difficulty as "beginner" | "intermediate" | "advanced") || "beginner",
  category: (item.category as string) || "",
  isPublic: item.is_public as boolean,
});

const mapStudyRoom = (item: Record<string, unknown>): StudyRoomCard => ({
  id: item.id as string,
  title: item.name as string,
  description: (item.description as string) || "",
  author: {
    id: item.host_id as string,
    name: (item.author_name as string) || "Unknown",
    avatar: (item.author_avatar as string) || undefined,
  },
  tags: [],
  createdAt: item.created_at as string,
  updatedAt: item.updated_at as string,
  likes: 0,
  views: 0,
  isBookmarked: false,
  isLiked: false,
  type: "studyroom",
  isLive: item.status === "active",
  currentUsers: (item.current_users as number) || 0,
  maxUsers: (item.max_participants as number) || 10,
  topic: (item.topic as string) || undefined,
  startTime: (item.actual_start as string) || undefined,
  endTime: (item.actual_end as string) || undefined,
  isPublic: item.is_public as boolean,
});

function getSortColumn(sortBy: string) {
  switch (sortBy) {
    case "popular":
      return "view_count";
    case "trending":
      return "view_count";
    case "recent":
    default:
      return "created_at";
  }
}

export const DiscoveryApi = {
  async getNotes({
    page = 1,
    limit = 12,
    filters = {},
    query = "",
  }: Partial<SearchParams> = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let notesQuery = supabase
      .from("notes")
      .select("*", { count: "exact" })
      .eq("is_public", true)
      .range(from, to);
    if (query) {
      notesQuery = notesQuery.ilike("title", `%${query}%`);
    }
    if (filters.difficulty && filters.difficulty.length > 0) {
      notesQuery = notesQuery.in("difficulty", filters.difficulty);
    }
    if (filters.topics && filters.topics.length > 0) {
      notesQuery = notesQuery.overlaps("tags", filters.topics);
    }
    notesQuery = notesQuery.order(getSortColumn(filters.sortBy || "recent"), {
      ascending: false,
    });
    const { data, error, count } = await notesQuery;
    if (error) throw new Error("Failed to fetch notes");
    return {
      results: (data || []).map(mapNote),
      hasMore: count ? to + 1 < count : false,
    };
  },
  async getRoadmaps({
    page = 1,
    limit = 12,
    filters = {},
    query = "",
  }: Partial<SearchParams> = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let roadmapsQuery = supabase
      .from("roadmaps")
      .select("*", { count: "exact" })
      .eq("is_public", true)
      .range(from, to);
    if (query) {
      roadmapsQuery = roadmapsQuery.ilike("title", `%${query}%`);
    }
    if (filters.difficulty && filters.difficulty.length > 0) {
      roadmapsQuery = roadmapsQuery.in("difficulty", filters.difficulty);
    }
    if (filters.topics && filters.topics.length > 0) {
      roadmapsQuery = roadmapsQuery.overlaps("tags", filters.topics);
    }
    roadmapsQuery = roadmapsQuery.order(
      getSortColumn(filters.sortBy || "recent"),
      { ascending: false }
    );
    const { data, error, count } = await roadmapsQuery;
    if (error) throw new Error("Failed to fetch roadmaps");
    return {
      results: (data || []).map(mapRoadmap),
      hasMore: count ? to + 1 < count : false,
    };
  },
  async getStudyRooms({
    page = 1,
    limit = 12,
    filters = {},
    query = "",
  }: Partial<SearchParams> = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    let studyRoomsQuery = supabase
      .from("study_rooms")
      .select("*", { count: "exact" })
      .eq("is_public", true)
      .range(from, to);
    if (query) {
      studyRoomsQuery = studyRoomsQuery.ilike("name", `%${query}%`);
    }
    if (filters.topics && filters.topics.length > 0) {
      studyRoomsQuery = studyRoomsQuery.overlaps("topic", filters.topics);
    }
    studyRoomsQuery = studyRoomsQuery.order(
      getSortColumn(filters.sortBy || "recent"),
      { ascending: false }
    );
    const { data, error, count } = await studyRoomsQuery;
    if (error) throw new Error("Failed to fetch study rooms");
    return {
      results: (data || []).map(mapStudyRoom),
      hasMore: count ? to + 1 < count : false,
    };
  },

  async searchContent({
    query = "",
    filters = {},
    page = 1,
    limit = 12,
  }: SearchParams) {
    // Aggregate results from all selected content types
    const contentTypes =
      filters.contentType && filters.contentType.length > 0
        ? filters.contentType
        : ["note", "roadmap", "studyroom"];
    let results: SearchResult[] = [];
    let hasMore = false;
    for (const type of contentTypes) {
      if (type === "note") {
        const { results: noteResults, hasMore: noteHasMore } =
          await this.getNotes({ page, limit, filters, query });
        results = results.concat(noteResults);
        hasMore = hasMore || noteHasMore;
      } else if (type === "roadmap") {
        const { results: roadmapResults, hasMore: roadmapHasMore } =
          await this.getRoadmaps({ page, limit, filters, query });
        results = results.concat(roadmapResults);
        hasMore = hasMore || roadmapHasMore;
      } else if (type === "studyroom") {
        const { results: roomResults, hasMore: roomHasMore } =
          await this.getStudyRooms({ page, limit, filters, query });
        results = results.concat(roomResults);
        hasMore = hasMore || roomHasMore;
      }
    }
    // Optionally sort/merge results here if needed
    return { results, hasMore };
  },

  async getTrending() {
    // Fetch trending notes and roadmaps by view_count
    const { results: notes } = await this.getNotes({
      page: 1,
      limit: 5,
      filters: { sortBy: "trending" },
    });
    const { results: roadmaps } = await this.getRoadmaps({
      page: 1,
      limit: 5,
      filters: { sortBy: "trending" },
    });
    return [...notes, ...roadmaps];
  },

  async getUserRecommendations() {
    // For demo: fetch random notes and roadmaps as recommendations
    const { results: notes } = await this.getNotes({ page: 1, limit: 5 });
    const { results: roadmaps } = await this.getRoadmaps({ page: 1, limit: 5 });
    // You can add a recommendation engine here
    return [...notes, ...roadmaps].map((item) => ({
      id: item.id,
      content: item,
      reason: "Popular in your topics",
      confidence: 0.8,
    }));
  },
};
