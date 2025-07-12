import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { RoadmapsApi } from "../api/roadmapsApi";
import type {
  Roadmap,
  RoadmapTask,
  MindmapNode,
  CreateTaskData,
  CreateNodeData,
  RoadmapFilters,
} from "../types/roadmapTypes";

interface UseRoadmapEditorState {
  roadmap: Roadmap | null;
  tasks: RoadmapTask[];
  nodes: MindmapNode[];
  loading: boolean;
  error: string | null;
  filters: RoadmapFilters;
  selectedTask: RoadmapTask | null;
  selectedNode: MindmapNode | null;
  isTaskSidebarOpen: boolean;
  isNodeSidebarOpen: boolean;
}

export function useRoadmapEditor(roadmapId: string) {
  const [state, setState] = useState<UseRoadmapEditorState>({
    roadmap: null,
    tasks: [],
    nodes: [],
    loading: true,
    error: null,
    filters: {},
    selectedTask: null,
    selectedNode: null,
    isTaskSidebarOpen: false,
    isNodeSidebarOpen: false,
  });

  // Load roadmap data
  const loadRoadmapData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [roadmapResponse, tasksResponse, nodesResponse] = await Promise.all(
        [
          RoadmapsApi.getRoadmap(roadmapId),
          RoadmapsApi.getTasks(roadmapId),
          RoadmapsApi.getNodes(roadmapId),
        ]
      );

      if (
        roadmapResponse.success &&
        tasksResponse.success &&
        nodesResponse.success
      ) {
        setState((prev) => ({
          ...prev,
          roadmap: roadmapResponse.data,
          tasks: tasksResponse.data,
          nodes: nodesResponse.data,
          loading: false,
        }));
      } else {
        const error =
          roadmapResponse.error || tasksResponse.error || nodesResponse.error;
        setState((prev) => ({
          ...prev,
          error: error || "Failed to load roadmap data",
          loading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "An unexpected error occurred",
        loading: false,
      }));
    }
  }, [roadmapId]);

  // Task operations
  const createTask = useCallback(
    async (data: CreateTaskData) => {
      try {
        const response = await RoadmapsApi.createTask(roadmapId, data);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            tasks: [...prev.tasks, response.data],
            selectedTask: response.data,
            isTaskSidebarOpen: true,
            selectedNode: null,
            isNodeSidebarOpen: false,
          }));

          toast.success("Task created successfully!");
          return response.data;
        } else {
          toast.error(response.error || "Failed to create task");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    [roadmapId]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<RoadmapTask>) => {
      try {
        const response = await RoadmapsApi.updateTask(id, updates);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            tasks: prev.tasks.map((task) =>
              task.id === id ? response.data : task
            ),
            selectedTask:
              prev.selectedTask?.id === id ? response.data : prev.selectedTask,
          }));

          toast.success("Task updated successfully!");
          return response.data;
        } else {
          toast.error(response.error || "Failed to update task");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string) => {
    try {
      const response = await RoadmapsApi.deleteTask(id);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.filter((task) => task.id !== id),
          selectedTask: prev.selectedTask?.id === id ? null : prev.selectedTask,
          isTaskSidebarOpen:
            prev.selectedTask?.id === id ? false : prev.isTaskSidebarOpen,
        }));

        toast.success("Task deleted successfully!");
      } else {
        toast.error(response.error || "Failed to delete task");
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      throw error;
    }
  }, []);

  // Node operations
  const createNode = useCallback(
    async (data: CreateNodeData) => {
      try {
        const response = await RoadmapsApi.createNode(roadmapId, data);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            nodes: prev.nodes
              .map((node) =>
                node.id === data.parentId
                  ? { ...node, children: [...node.children, response.data.id] }
                  : node
              )
              .concat(response.data),
            selectedNode: response.data,
            isNodeSidebarOpen: true,
            selectedTask: null,
            isTaskSidebarOpen: false,
          }));

          toast.success("Node created successfully!");
          return response.data;
        } else {
          toast.error(response.error || "Failed to create node");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    [roadmapId]
  );

  const updateNode = useCallback(
    async (id: string, updates: Partial<MindmapNode>) => {
      try {
        const response = await RoadmapsApi.updateNode(id, updates);

        if (response.success) {
          setState((prev) => ({
            ...prev,
            nodes: prev.nodes.map((node) =>
              node.id === id ? response.data : node
            ),
            selectedNode:
              prev.selectedNode?.id === id ? response.data : prev.selectedNode,
          }));

          toast.success("Node updated successfully!");
          return response.data;
        } else {
          toast.error(response.error || "Failed to update node");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    []
  );

  const deleteNode = useCallback(
    async (id: string) => {
      try {
        const response = await RoadmapsApi.deleteNode(id);

        if (response.success) {
          // Reload nodes to get updated structure after deletion
          const nodesResponse = await RoadmapsApi.getNodes(roadmapId);
          if (nodesResponse.success) {
            setState((prev) => ({
              ...prev,
              nodes: nodesResponse.data,
              selectedNode:
                prev.selectedNode?.id === id ? null : prev.selectedNode,
              isNodeSidebarOpen:
                prev.selectedNode?.id === id ? false : prev.isNodeSidebarOpen,
            }));
          }

          toast.success("Node deleted successfully!");
        } else {
          toast.error(response.error || "Failed to delete node");
          throw new Error(response.error);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
        throw error;
      }
    },
    [roadmapId]
  );

  const setFilters = useCallback((filters: RoadmapFilters) => {
    setState((prev) => ({ ...prev, filters }));
  }, []);

  const selectTask = useCallback((task: RoadmapTask | null) => {
    setState((prev) => ({
      ...prev,
      selectedTask: task,
      isTaskSidebarOpen: true,
      selectedNode: null,
      isNodeSidebarOpen: false,
    }));
  }, []);

  const selectNode = useCallback((node: MindmapNode | null) => {
    setState((prev) => ({
      ...prev,
      selectedNode: node,
      isNodeSidebarOpen: true,
      selectedTask: null,
      isTaskSidebarOpen: false,
    }));
  }, []);

  const closeSidebars = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedTask: null,
      selectedNode: null,
      isTaskSidebarOpen: false,
      isNodeSidebarOpen: false,
    }));
  }, []);

  // Filtered tasks based on current filters
  const filteredTasks = useCallback(() => {
    let filtered = state.tasks;

    if (state.filters.status?.length) {
      filtered = filtered.filter((task) =>
        state.filters.status!.includes(task.status)
      );
    }

    if (state.filters.category?.length) {
      filtered = filtered.filter((task) =>
        state.filters.category!.includes(task.category)
      );
    }

    if (state.filters.priority?.length) {
      filtered = filtered.filter((task) =>
        state.filters.priority!.includes(task.priority)
      );
    }

    if (state.filters.tags?.length) {
      filtered = filtered.filter((task) =>
        state.filters.tags!.some((tag) => task.tags.includes(tag))
      );
    }

    if (state.filters.dateRange) {
      filtered = filtered.filter(
        (task) =>
          task.date >= state.filters.dateRange!.start &&
          task.date <= state.filters.dateRange!.end
      );
    }

    return filtered;
  }, [state.tasks, state.filters]);

  // Export/Import functionality
  const exportRoadmap = useCallback(async () => {
    try {
      const response = await RoadmapsApi.exportRoadmap(roadmapId);

      if (response.success) {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${state.roadmap?.title || "roadmap"}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Roadmap exported successfully!");
      } else {
        toast.error(response.error || "Failed to export roadmap");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  }, [roadmapId, state.roadmap?.title]);

  const importRoadmap = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await RoadmapsApi.importRoadmap(data);

      if (response.success) {
        toast.success("Roadmap imported successfully!");
        return response.data;
      } else {
        toast.error(response.error || "Failed to import roadmap");
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error("Invalid file format or corrupted data");
      throw error;
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    if (roadmapId) {
      loadRoadmapData();
    }
  }, [roadmapId, loadRoadmapData]);

  return {
    ...state,
    filteredTasks: filteredTasks(),
    createTask,
    updateTask,
    deleteTask,
    createNode,
    updateNode,
    deleteNode,
    setFilters,
    selectTask,
    selectNode,
    closeSidebars,
    exportRoadmap,
    importRoadmap,
    refresh: loadRoadmapData,
  };
}
