export interface DashboardStats {
  learningStreak: number;
  hoursStudied: number;
  skillsMastered: number;
  communityRank: number;
  dailyGoalProgress: number;
  roadmapProgress: number;
  totalPoints: number;
  level: number;
}

export interface ActivityItem {
  id: string;
  type:
    | "skill_completed"
    | "note_created"
    | "task_completed"
    | "achievement_unlocked"
    | "study_session";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  skill_id?: string;
  estimated_duration?: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  type: "achievement" | "reminder" | "social" | "system" | "ai_suggestion";
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

export interface LeaderboardEntry {
  id: string;
  full_name: string;
  avatar_url?: string;
  points_earned: number;
  skills_mastered: number;
  current_streak: number;
  rank: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: "streak" | "skill_mastery" | "community" | "milestone" | "special";
  icon_url?: string;
  badge_color: string;
  points: number;
  unlocked_at?: string;
  progress?: number;
  criteria: Record<string, string | number | boolean | undefined>;
}

export interface ProgressData {
  date: string;
  value: number;
  category?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  gradient: string;
  disabled?: boolean;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingTasks: TaskItem[];
  notifications: NotificationItem[];
  leaderboard: LeaderboardEntry[];
  achievements: Achievement[];
  progressData: ProgressData[];
}

export interface DashboardError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: DashboardError | null;
  lastUpdated: string | null;
}
