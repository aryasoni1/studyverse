import { supabase } from "@/lib/supabase";
import {
  Post,
  Reaction,
  User,
  FilterOptions,
  PaginationOptions,
} from "@/types/communityTypes";
import { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LikeRow = Database["public"]["Tables"]["likes"]["Row"];
type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];

// Transform database row to frontend types
const transformPost = (
  postRow: PostRow & {
    profiles: ProfileRow;
    likes: LikeRow[];
    comments: (CommentRow & { profiles: ProfileRow })[];
    skills?: SkillRow | null;
  }
): Post => {
  const categoryMap: Record<string, Post["category"]> = {
    feedback: "feedback",
    bug: "bug",
    feature: "feature",
    announcement: "announcement",
    discussion: "feedback",
  };

  const getStatus = (): Post["status"] => {
    if (postRow.is_locked) return "closed";
    return "open";
  };

  return {
    id: postRow.id,
    title: postRow.title,
    content: postRow.content,
    category: categoryMap[postRow.post_type || "discussion"] || "feedback",
    status: getStatus(),
    tags: postRow.tags || [],
    author: {
      id: postRow.profiles.id,
      name: postRow.profiles.full_name || "Anonymous User",
      avatar: postRow.profiles.avatar_url || "",
      role: "user",
      badge: postRow.profiles.experience_level || undefined,
    },
    timestamps: {
      created: postRow.created_at || new Date().toISOString(),
      updated: postRow.updated_at || new Date().toISOString(),
    },
    engagement: {
      comments: postRow.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.profiles.id,
          name: comment.profiles.full_name || "Anonymous User",
          avatar: comment.profiles.avatar_url || "",
          role: "user",
          badge: comment.profiles.experience_level || undefined,
        },
        postId: comment.post_id,
        parentId: comment.parent_id || undefined,
        replies: [],
        createdAt: comment.created_at || new Date().toISOString(),
        updatedAt: comment.updated_at || new Date().toISOString(),
        reactions: [],
      })),
      reactions: postRow.likes.map((like) => ({
        id: like.id,
        type: "like" as const,
        userId: like.user_id,
        postId: like.post_id || "",
        createdAt: like.created_at || new Date().toISOString(),
      })),
    },
    isPinned: postRow.is_pinned || false,
    priority: "medium",
  };
};

export const communityApi = {
  async getPosts(
    filters: FilterOptions = {},
    pagination: PaginationOptions = { page: 1, limit: 10, hasMore: true }
  ): Promise<{ posts: Post[]; pagination: PaginationOptions }> {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    const posts = data as Post[];

    // Apply sorting
    const sortBy =
      "sortBy" in filters && filters.sortBy ? filters.sortBy : "newest";
    switch (sortBy) {
      case "oldest":
        posts.sort(
          (a, b) =>
            new Date(a.timestamps.created).getTime() -
            new Date(b.timestamps.created).getTime()
        );
        break;
      case "popular":
        posts.sort(
          (a, b) =>
            b.engagement.reactions.length - a.engagement.reactions.length
        );
        break;
      case "commented":
        posts.sort(
          (a, b) => b.engagement.comments.length - a.engagement.comments.length
        );
        break;
      default: // newest
        posts.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return (
            new Date(b.timestamps.created).getTime() -
            new Date(a.timestamps.created).getTime()
          );
        });
    }

    const filteredPosts = posts.filter((post) => {
      if (filters.category && filters.category !== "all") {
        if (post.category !== filters.category) return false;
      }
      if (
        "search" in filters &&
        typeof filters.search === "string" &&
        filters.search
      ) {
        const searchLower = filters.search.toLowerCase();
        if (
          typeof post.title === "string" &&
          typeof post.content === "string" &&
          !post.title.toLowerCase().includes(searchLower) &&
          !post.content.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!filters.tags.some((tag) => post.tags.includes(tag))) {
          return false;
        }
      }
      return true;
    });

    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedPosts = filteredPosts.slice(
      startIndex,
      startIndex + pagination.limit
    );
    const hasMore = startIndex + pagination.limit < filteredPosts.length;

    return {
      posts: paginatedPosts,
      pagination: { ...pagination, hasMore },
    };
  },

  async createPost(
    postData: Omit<Post, "id" | "author" | "timestamps" | "engagement">
  ): Promise<Post> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to create posts");
    }

    const typeMap: Record<Post["category"], string> = {
      feedback: "discussion",
      bug: "bug",
      feature: "feature",
      announcement: "announcement",
      discussion: "Discussion",
    };

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: postData.title,
        content: postData.content,
        post_type: typeMap[postData.category] || "discussion",
        tags: postData.tags,
        user_id: user.id,
        is_pinned: postData.isPinned || false,
        view_count: 0,
        like_count: 0,
        comment_count: 0,
      })
      .select(
        `
        *,
        profiles!posts_user_id_fkey(*),
        likes!likes_post_id_fkey(*),
        comments!comments_post_id_fkey(*, profiles!comments_user_id_fkey(*)),
        skills(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }

    return transformPost(data);
  },

  async updatePostStatus(
    postId: string,
    status: Post["status"]
  ): Promise<Post> {
    const updates: Record<string, unknown> = {};
    if (status === "closed") {
      updates.is_locked = true;
    } else if (status === "open") {
      updates.is_locked = false;
    }

    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", postId)
      .select(
        `
        *,
        profiles!posts_user_id_fkey(*),
        likes!likes_post_id_fkey(*),
        comments!comments_post_id_fkey(*, profiles!comments_user_id_fkey(*)),
        skills(*)
      `
      )
      .single();

    if (error) {
      throw new Error(`Failed to update post status: ${error.message}`);
    }

    return transformPost(data);
  },

  async addReaction(postId: string): Promise<Reaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to add reactions");
    }

    const { data: existingLike } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .single();

    if (existingLike) {
      await supabase.from("likes").delete().eq("id", existingLike.id);

      throw new Error("Reaction removed");
    }

    const { data, error } = await supabase
      .from("likes")
      .insert({
        user_id: user.id,
        post_id: postId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }

    return {
      id: data.id,
      type: "like",
      userId: data.user_id,
      postId: data.post_id || "",
      createdAt: data.created_at || new Date().toISOString(),
    };
  },

  async removeReaction(postId: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User must be authenticated to remove reactions");
    }

    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId);

    if (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  },

  async getAvailableTags(): Promise<string[]> {
    const { data, error } = await supabase.from("posts").select("tags");

    if (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }

    const allTags = data.flatMap((post) => post.tags || []);
    return Array.from(new Set(allTags)).sort();
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile) return null;

    return {
      id: profile.id,
      name: profile.full_name || "Anonymous User",
      avatar: profile.avatar_url || "",
      role: "user",
      badge: profile.experience_level || undefined,
    };
  },

  async getSkills(): Promise<SkillRow[]> {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }

    return data || [];
  },
};
