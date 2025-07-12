export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface ResumeSection {
  id: string;
  type:
    | "personal"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "awards";
  title: string;
  content: unknown;
  order: number;
  visible: boolean;
}

export interface Resume {
  id: string;
  template: "modern" | "classic" | "minimal";
  sections: ResumeSection[];
  lastUpdated: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  posted_date: string;
  application_deadline?: string;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  job?: Job;
  status: "pending" | "reviewed" | "interviewed" | "offered" | "rejected";
  applied_at: string;
  updated_at: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  bio?: string;
  portfolioUrl: string;
}
