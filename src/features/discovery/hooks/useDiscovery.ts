import { useState, useEffect, useCallback } from "react";
import { DiscoveryState, DiscoveryFilter } from "../types/discoveryTypes";
import { DiscoveryApi } from "../api/discoveryApi";

const initialFilters: DiscoveryFilter = {
  topics: [],
  difficulty: [],
  contentType: [],
  sortBy: "recent",
};

const initialState: DiscoveryState = {
  searchQuery: "",
  filters: initialFilters,
  results: [],
  trending: [],
  recommended: [],
  isLoading: false,
  hasMore: true,
  error: undefined,
};

export function useDiscovery() {
  const [state, setState] = useState<DiscoveryState>(initialState);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(state.searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [state.searchQuery]);

  // Load initial data
  useEffect(() => {
    loadTrendingContent();
    loadRecommendedContent();
  }, []);

  // Search when query or filters change
  useEffect(() => {
    if (debouncedQuery !== state.searchQuery) return;
    setCurrentPage(1);
    searchContent(true);
  }, [debouncedQuery, state.filters]);

  const searchContent = useCallback(
    async (reset = false) => {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

      try {
        const page = reset ? 1 : currentPage;
        const response = await DiscoveryApi.searchContent({
          query: state.searchQuery,
          filters: state.filters,
          page,
          limit: 12,
        });

        setState((prev) => ({
          ...prev,
          results: reset
            ? response.results
            : [...prev.results, ...response.results],
          hasMore: response.hasMore,
          isLoading: false,
        }));

        if (!reset) {
          setCurrentPage((prev) => prev + 1);
        }
      } catch {
        setState((prev) => ({
          ...prev,
          error: "Failed to fetch discovery data",
        }));
      }
    },
    [state.searchQuery, state.filters, currentPage]
  );

  const loadTrendingContent = useCallback(async () => {
    try {
      const trending = await DiscoveryApi.getTrending();
      setState((prev) => ({ ...prev, trending }));
    } catch (error) {
      console.error("Failed to load trending content:", error);
    }
  }, []);

  const loadRecommendedContent = useCallback(async () => {
    try {
      const recommended = await DiscoveryApi.getUserRecommendations();
      setState((prev) => ({ ...prev, recommended }));
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const updateFilters = useCallback((filters: Partial<DiscoveryFilter>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      results: [], // Reset results when filters change
      hasMore: true,
    }));
    setCurrentPage(1);
  }, []);

  const toggleFilter = useCallback(
    (filterType: keyof DiscoveryFilter, value: unknown) => {
      setState((prev) => {
        const currentValues = prev.filters[filterType] as unknown[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];

        return {
          ...prev,
          filters: { ...prev.filters, [filterType]: newValues },
          results: [],
          hasMore: true,
        };
      });
      setCurrentPage(1);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: initialFilters,
      results: [],
      hasMore: true,
    }));
    setCurrentPage(1);
  }, []);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      searchContent(false);
    }
  }, [searchContent, state.isLoading, state.hasMore]);

  return {
    ...state,
    updateSearchQuery,
    updateFilters,
    toggleFilter,
    clearFilters,
    loadMore,
    searchContent,
  };
}
