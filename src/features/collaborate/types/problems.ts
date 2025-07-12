export interface Problem {
  id: string;
  title: string;
  description: string;
  impact: string;
  tags: string[];
  domain: string;
  status: "looking-for-team" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
    profession: string;
    verified: boolean;
    rating: number;
    completedProjects: number;
  };
  team: TeamMember[];
  requirements: string[];
  timeline: string;
  budget?: string;
  mediaUrls?: string[];
  solutions: Solution[];
  progress: ProjectProgress[];
  likes: number;
  views: number;
  applications: number;
  featured: boolean;
  mentorshipAvailable: boolean;
  remoteOnly: boolean;
  skillsNeeded: SkillRequirement[];
  tasks: Task[];
  aiGenerated: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category:
    | "frontend"
    | "backend"
    | "design"
    | "research"
    | "testing"
    | "documentation"
    | "deployment"
    | "marketing";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedHours: number;
  skillsRequired: string[];
  dependencies: string[]; // Task IDs that must be completed first
  status: "open" | "claimed" | "in-progress" | "review" | "completed";
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
    claimedAt: string;
  };
  priority: "low" | "medium" | "high" | "critical";
  deliverables: string[];
  acceptanceCriteria: string[];
  submittedWork?: TaskSubmission;
  createdAt: string;
  dueDate?: string;
  points: number; // Gamification points for completing this task
}

export interface TaskSubmission {
  id: string;
  description: string;
  files: string[];
  githubUrl?: string;
  liveUrl?: string;
  submittedAt: string;
  feedback?: TaskFeedback[];
  status: "submitted" | "approved" | "needs-revision" | "rejected";
}

export interface TaskFeedback {
  id: string;
  content: string;
  rating: number;
  author: string;
  createdAt: string;
  type: "approval" | "revision" | "rejection";
}

export interface SkillRequirement {
  skill: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  required: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role:
    | "developer"
    | "designer"
    | "researcher"
    | "pm"
    | "marketer"
    | "data-scientist"
    | "qa";
  skills: string[];
  joinedAt: string;
  contribution: string;
  hoursCommitted: number;
  rating: number;
  status: "active" | "inactive" | "completed";
  tasksCompleted: number;
  pointsEarned: number;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  type: "idea" | "prototype" | "mvp" | "final";
  mediaUrls: string[];
  githubUrl?: string;
  liveUrl?: string;
  submittedBy: string;
  submittedAt: string;
  feedback: Feedback[];
  votes: number;
  featured: boolean;
}

export interface Feedback {
  id: string;
  content: string;
  rating: number;
  author: string;
  createdAt: string;
  helpful: number;
}

export interface ProjectProgress {
  id: string;
  stage: "idea" | "design" | "development" | "testing" | "launch";
  title: string;
  description: string;
  completedAt: string;
  completedBy: string;
  attachments?: string[];
  milestone: boolean;
}

export type ProblemFilters = {
  domain: string[];
  tags: string[];
  status: string[];
  timeline: string;
  difficulty: string[];
  priority: string[];
  remoteOnly: boolean;
  mentorshipAvailable: boolean;
  featured: boolean;
};

export interface Notification {
  id: string;
  type:
    | "team_join"
    | "progress_update"
    | "solution_submitted"
    | "project_completed"
    | "mention"
    | "task_claimed"
    | "task_completed";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskDifficulty = "beginner" | "intermediate" | "advanced";
