// Career-related type definitions

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  content: string;
  template: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary_range?: string;
  job_type: "full-time" | "part-time" | "contract" | "internship";
  remote: boolean;
  posted_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_id?: string;
  cover_letter?: string;
  status: "pending" | "reviewed" | "interviewed" | "offered" | "rejected";
  applied_at: string;
  updated_at: string;
}
