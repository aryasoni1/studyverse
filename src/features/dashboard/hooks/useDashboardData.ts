import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DashboardApi } from "../api/dashboardApi";
import { useAuth } from "@/features/auth/components/AuthProvider";
import type { DashboardState, TaskItem } from "../types/dashboardTypes";
import { supabase } from "@/lib/supabase";

export function useDashboardData() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  /**
   * Load dashboard data
   */
  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await DashboardApi.getDashboardData();

      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to load dashboard data",
        },
      }));
      toast.error("Failed to load dashboard data");
    }
  }, [user]);

  /**
   * Refresh data
   */
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  /**
   * Mark notification as read
   */
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await DashboardApi.markNotificationAsRead(notificationId);

      // Update local state
      setState((prev) => {
        if (!prev.data) return prev;

        return {
          ...prev,
          data: {
            ...prev.data,
            notifications: prev.data.notifications.map((n) =>
              n.id === notificationId ? { ...n, is_read: true } : n
            ),
          },
        };
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  }, []);

  /**
   * Create a new task
   */
  const createTask = useCallback(
    async (task: Omit<TaskItem, "id" | "created_at">) => {
      try {
        const newTask = await DashboardApi.createTask(task);

        // Update local state
        setState((prev) => {
          if (!prev.data) return prev;

          return {
            ...prev,
            data: {
              ...prev.data,
              upcomingTasks: [newTask, ...prev.data.upcomingTasks],
            },
          };
        });

        toast.success("Task created successfully");
        return newTask;
      } catch (error) {
        console.error("Error creating task:", error);
        toast.error("Failed to create task");
        throw error;
      }
    },
    []
  );

  /**
   * Update task status
   */
  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskItem["status"]) => {
      try {
        await DashboardApi.updateTaskStatus(taskId, status);

        // Update local state
        setState((prev) => {
          if (!prev.data) return prev;

          return {
            ...prev,
            data: {
              ...prev.data,
              upcomingTasks: prev.data.upcomingTasks.map((task) =>
                task.id === taskId ? { ...task, status } : task
              ),
            },
          };
        });

        toast.success(
          `Task ${status === "completed" ? "completed" : "updated"}`
        );
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task");
      }
    },
    []
  );

  /**
   * Set up real-time subscriptions
   */
  useEffect(() => {
    if (!user || !user.id) {
      console.log("User not authenticated, skipping realtime subscriptions");
      return;
    }

    // Check if user is actually authenticated with Supabase
    supabase.auth
      .getUser()
      .then(({ data: { user: supabaseUser } }) => {
        if (!supabaseUser) {
          console.log(
            "Supabase user not authenticated, skipping realtime subscriptions"
          );
          return;
        }

        const cleanup = DashboardApi.subscribeToUpdates(
          user.id,
          // Stats update
          (stats) => {
            setState((prev) => {
              if (!prev.data) return prev;
              return {
                ...prev,
                data: { ...prev.data, stats },
              };
            });
          },
          // Activity update
          (recentActivity) => {
            setState((prev) => {
              if (!prev.data) return prev;
              return {
                ...prev,
                data: { ...prev.data, recentActivity },
              };
            });
          },
          // Tasks update
          (upcomingTasks) => {
            setState((prev) => {
              if (!prev.data) return prev;
              return {
                ...prev,
                data: { ...prev.data, upcomingTasks },
              };
            });
          },
          // Notifications update
          (notifications) => {
            setState((prev) => {
              if (!prev.data) return prev;
              return {
                ...prev,
                data: { ...prev.data, notifications },
              };
            });
          }
        );

        return cleanup;
      })
      .catch((error) => {
        console.error(
          "Error checking authentication for realtime subscriptions:",
          error
        );
      });
  }, [user]);

  /**
   * Load data on mount and user change
   */
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setState({
        data: null,
        loading: false,
        error: null,
        lastUpdated: null,
      });
    }
  }, [user, loadData]);

  return {
    ...state,
    refresh,
    markNotificationAsRead,
    createTask,
    updateTaskStatus,
  };
}
