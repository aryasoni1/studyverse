import { supabase } from "@/lib/supabase";
import type {
  DashboardData,
  DashboardStats,
  ActivityItem,
  TaskItem,
  NotificationItem,
  LeaderboardEntry,
  Achievement,
  ProgressData,
} from "../types/dashboardTypes";

export class DashboardApi {
  /**
   * Fetch comprehensive dashboard data
   */
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const [
        stats,
        recentActivity,
        upcomingTasks,
        notifications,
        leaderboard,
        achievements,
        progressData,
      ] = await Promise.all([
        this.getStats(),
        this.getRecentActivity(),
        this.getUpcomingTasks(),
        this.getNotifications(),
        this.getLeaderboard(),
        this.getAchievements(),
        this.getProgressData(),
      ]);

      return {
        stats,
        recentActivity,
        upcomingTasks,
        notifications,
        leaderboard,
        achievements,
        progressData,
      };
    } catch (error: unknown) {
      console.error("Error fetching dashboard data:", error);
      throw new Error("Failed to load dashboard data");
    }
  }

  /**
   * Get user statistics
   */
  static async getStats(): Promise<DashboardStats> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data: userStats, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user stats:", error);
      // Return default stats if none exist
      return {
        learningStreak: 0,
        hoursStudied: 0,
        skillsMastered: 0,
        communityRank: 0,
        dailyGoalProgress: 0,
        roadmapProgress: 0,
        totalPoints: 0,
        level: 1,
      };
    }

    // Calculate roadmap progress
    const { data: roadmaps } = await supabase
      .from("roadmaps")
      .select("progress")
      .eq("user_id", user.id);

    const avgRoadmapProgress = roadmaps?.length
      ? roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0) /
        roadmaps.length
      : 0;

    return {
      learningStreak: userStats.current_streak || 0,
      hoursStudied: userStats.total_hours_studied || 0,
      skillsMastered: userStats.skills_mastered || 0,
      communityRank: userStats.community_rank || 0,
      dailyGoalProgress: 0, // TODO: Implement daily goals
      roadmapProgress: Math.round(avgRoadmapProgress),
      totalPoints: userStats.points_earned || 0,
      level: userStats.level_current || 1,
    };
  }

  /**
   * Get recent activity
   */
  static async getRecentActivity(): Promise<ActivityItem[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // Get recent completed tasks
    const { data: tasks } = await supabase
      .from("tasks")
      .select("id, title, completed_at, skill_id")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false })
      .limit(5);

    // Get recent notes
    const { data: notes } = await supabase
      .from("notes")
      .select("id, title, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const activities: ActivityItem[] = [];

    // Add task activities
    tasks?.forEach((task) => {
      activities.push({
        id: `task-${task.id}`,
        type: "task_completed",
        title: "Task Completed",
        description: task.title,
        timestamp: task.completed_at,
        icon: "CheckCircle",
        metadata: { taskId: task.id, skillId: task.skill_id },
      });
    });

    // Add note activities
    notes?.forEach((note) => {
      activities.push({
        id: `note-${note.id}`,
        type: "note_created",
        title: "Note Created",
        description: note.title,
        timestamp: note.created_at,
        icon: "FileText",
        metadata: { noteId: note.id },
      });
    });

    // Sort by timestamp and return latest 10
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  }

  /**
   * Get upcoming tasks
   */
  static async getUpcomingTasks(): Promise<TaskItem[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .in("status", ["pending", "in_progress"])
      .order("due_date", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching upcoming tasks:", error);
      return [];
    }

    return tasks || [];
  }

  /**
   * Get notifications
   */
  static async getNotifications(): Promise<NotificationItem[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return notifications || [];
  }

  /**
   * Get leaderboard
   */
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data: leaderboard, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("rank", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }

    return leaderboard || [];
  }

  /**
   * Get user achievements
   */
  static async getAchievements(): Promise<Achievement[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: userAchievements, error } = await supabase
      .from("user_achievements")
      .select(
        `
        unlocked_at,
        progress,
        achievements (
          id,
          name,
          description,
          type,
          icon_url,
          badge_color,
          points,
          criteria
        )
      `
      )
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return (
      (
        userAchievements as Array<{
          unlocked_at: string;
          progress: number;
          achievements: Achievement | Achievement[];
        }> | null
      )?.map((ua) => {
        const achievement = Array.isArray(ua.achievements)
          ? ua.achievements[0]
          : ua.achievements;
        return {
          ...achievement,
          unlocked_at: ua.unlocked_at,
          progress: ua.progress,
        };
      }) || []
    );
  }

  /**
   * Get progress data for charts
   */
  static async getProgressData(): Promise<ProgressData[]> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // Get study sessions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: sessions, error } = await supabase
      .from("pomodoro_sessions")
      .select("started_at, duration, completed_at")
      .eq("user_id", user.id)
      .gte("started_at", thirtyDaysAgo.toISOString())
      .not("completed_at", "is", null);

    if (error) {
      console.error("Error fetching progress data:", error);
      return [];
    }

    // Group by date and sum duration
    const progressMap = new Map<string, number>();

    sessions?.forEach((session) => {
      const date = new Date(session.started_at).toISOString().split("T")[0];
      const duration = session.duration || 0;
      progressMap.set(date, (progressMap.get(date) || 0) + duration);
    });

    // Convert to array and fill missing dates
    const progressData: ProgressData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      progressData.push({
        date: dateStr,
        value: progressMap.get(dateStr) || 0,
      });
    }

    return progressData;
  }

  /**
   * Mark notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  static async createTask(
    task: Omit<TaskItem, "id" | "created_at">
  ): Promise<TaskItem> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        ...task,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw error;
    }

    return data;
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(
    taskId: string,
    status: TaskItem["status"]
  ): Promise<void> {
    const updates: any = { status };

    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates
   */
  static subscribeToUpdates(
    userId: string,
    onStatsUpdate: (stats: DashboardStats) => void,
    onActivityUpdate: (activity: ActivityItem[]) => void,
    onTasksUpdate: (tasks: TaskItem[]) => void,
    onNotificationsUpdate: (notifications: NotificationItem[]) => void
  ) {
    // Subscribe to user stats changes
    const statsSubscription = supabase
      .channel("user_stats_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_stats",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const stats = await this.getStats();
          onStatsUpdate(stats);
        }
      )
      .subscribe();

    // Subscribe to task changes
    const tasksSubscription = supabase
      .channel("tasks_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const [tasks, activity] = await Promise.all([
            this.getUpcomingTasks(),
            this.getRecentActivity(),
          ]);
          onTasksUpdate(tasks);
          onActivityUpdate(activity);
        }
      )
      .subscribe();

    // Subscribe to notification changes
    const notificationsSubscription = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          const notifications = await this.getNotifications();
          onNotificationsUpdate(notifications);
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      statsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }
}
