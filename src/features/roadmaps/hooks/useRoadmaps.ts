import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RoadmapsApi } from "../api/roadmapsApi";
import type {
  Roadmap,
  CreateRoadmapData,
  RoadmapStats,
} from "../types/roadmapTypes";

interface UseRoadmapsState {
  roadmaps: Roadmap[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total: number;
}

export function useRoadmaps() {
  const [state, setState] = useState<UseRoadmapsState>({
    roadmaps: [],
    loading: true,
    error: null,
    hasMore: true,
    page: 1,
    total: 0,
  });

  const loadRoadmaps = useCallback(async (page = 1, append = false) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await RoadmapsApi.getRoadmaps(page, 10);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          roadmaps: append
            ? [...prev.roadmaps, ...response.data.data]
            : response.data.data,
          hasMore: response.data.hasMore,
          page: response.data.page,
          total: response.data.total,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.error || "Failed to load roadmaps",
          loading: false,
        }));
      }
    } catch {
      setState((prev) => ({ ...prev, error: "Failed to fetch roadmaps" }));
    }
  }, []);

  const createRoadmap = useCallback(async (data: CreateRoadmapData) => {
    try {
      const response = await RoadmapsApi.createRoadmap(data);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          roadmaps: [response.data, ...prev.roadmaps],
          total: prev.total + 1,
        }));

        toast.success("Roadmap created successfully!");
        return response.data;
      } else {
        toast.error(response.error || "Failed to create roadmap");
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      throw error;
    }
  }, []);

  const updateRoadmap = useCallback(
    async (id: string, updates: Partial<Roadmap>) => {
      try {
        const response = await RoadmapsApi.updateRoadmap(id, updates);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            roadmaps: prev.roadmaps.map((roadmap) =>
              roadmap.id === id ? response.data : roadmap
            ),
          }));

          toast.success("Roadmap updated successfully!");
          return response.data;
        } else {
          toast.error(response.error || "Failed to update roadmap");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    []
  );

  const deleteRoadmap = useCallback(async (id: string) => {
    try {
      const response = await RoadmapsApi.deleteRoadmap(id);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          roadmaps: prev.roadmaps.filter((roadmap) => roadmap.id !== id),
          total: prev.total - 1,
        }));

        toast.success("Roadmap deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete roadmap");
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      throw error;
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      loadRoadmaps(state.page + 1, true);
    }
  }, [state.loading, state.hasMore, state.page, loadRoadmaps]);

  const refresh = useCallback(() => {
    loadRoadmaps(1, false);
  }, [loadRoadmaps]);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  return {
    ...state,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    loadMore,
    refresh,
  };
}

export function useRoadmapStats(roadmapId: string) {
  const [stats, setStats] = useState<RoadmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await RoadmapsApi.getRoadmapStats(roadmapId);

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to load stats");
      }
    } catch {
      setError("Failed to fetch roadmap stats");
    } finally {
      setLoading(false);
    }
  }, [roadmapId]);

  useEffect(() => {
    if (roadmapId) {
      loadStats();
    }
  }, [roadmapId, loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
  };
}
