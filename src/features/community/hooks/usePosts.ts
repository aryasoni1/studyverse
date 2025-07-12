import { useState, useEffect, useCallback } from "react";
import {
  Post,
  FilterOptions,
  PaginationOptions,
} from "../types/communityTypes";
import { communityApi } from "../api/communityApi";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
    hasMore: true,
  });

  const loadPosts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : pagination.page;
        const response = await communityApi.getPosts(filters, {
          ...pagination,
          page: currentPage,
        });

        if (reset) {
          setPosts(response.posts);
        } else {
          setPosts((prev) => [...prev, ...response.posts]);
        }

        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.hasMore, loading]);

  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const refreshPosts = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadPosts(true);
  }, [loadPosts]);

  const updatePostInList = useCallback((updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }, []);

  const addPost = useCallback((newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  // Load posts when filters change
  useEffect(() => {
    loadPosts(true);
  }, [filters]);

  // Load more posts when page changes
  useEffect(() => {
    if (pagination.page > 1) {
      loadPosts(false);
    }
  }, [pagination.page]);

  return {
    posts,
    loading,
    error,
    filters,
    pagination,
    loadMore,
    updateFilters,
    refreshPosts,
    updatePostInList,
    addPost,
  };
};
