export interface Roadmap {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number; // in hours
  progress: number; // 0-100
  status: "not_started" | "in_progress" | "completed" | "paused";
  isPublic: boolean;
  isTemplate: boolean;
  templateId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  userId: string;
}

export interface RoadmapTask {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  startTime: string;
  endTime: string;
  date: string;
  duration: number; // in minutes
  tags: string[];
  notes?: string;
  dependencies?: string[];
  resources?: TaskResource[];
  createdAt: string;
  updatedAt: string;
}

export interface MindmapNode {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  type: "root" | "branch" | "leaf";
  parentId?: string;
  children: string[];
  position: { x: number; y: number };
  status: NodeStatus;
  priority: TaskPriority;
  dueDate?: string;
  progress: number; // 0-100
  tags: string[];
  metadata: Record<string, unknown>;
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResource {
  id: string;
  title: string;
  url: string;
  type: "article" | "video" | "course" | "book" | "tool";
}

export type TaskCategory =
  | "study"
  | "break"
  | "admin"
  | "meeting"
  | "exercise"
  | "routine"
  | "project"
  | "reading";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type NodeStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "blocked";

export type ViewMode = "timeline" | "mindmap";

export type TimelineView = "day" | "week" | "month";

export interface RoadmapFilters {
  status?: TaskStatus[];
  category?: TaskCategory[];
  priority?: TaskPriority[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface RoadmapStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalHours: number;
  completedHours: number;
  averageTaskDuration: number;
  categoryBreakdown: Record<TaskCategory, number>;
  progressByWeek: Array<{
    week: string;
    completed: number;
    total: number;
  }>;
}

export interface CreateRoadmapData {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: number;
  isPublic: boolean;
  tags: string[];
  templateId?: string;
}

export interface CreateTaskData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  date: string;
  startTime: string;
  endTime: string;
  tags: string[];
  notes?: string;
  resources?: Omit<TaskResource, "id">[];
}

export interface CreateNodeData {
  title: string;
  description: string;
  type: "root" | "branch" | "leaf";
  parentId?: string;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
}

export interface RoadmapApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
