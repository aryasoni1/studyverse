import { supabase, hasValidSupabaseConfig } from "@/lib/supabase";
import { Project, Job, Application } from "../types/careerTypes";

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description:
      "Full-stack web application built with React and Node.js featuring user authentication, payment processing, and inventory management.",
    tech_stack: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
    github_url: "https://github.com/example/ecommerce",
    live_url: "https://example-ecommerce.com",
    image_url:
      "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "published",
    created_at: "2024-01-15",
    updated_at: "2024-01-20",
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, team collaboration features, and advanced filtering.",
    tech_stack: ["Vue.js", "Firebase", "Vuetify", "WebSocket"],
    github_url: "https://github.com/example/taskmanager",
    live_url: "https://example-tasks.com",
    image_url:
      "https://images.pexels.com/photos/3584994/pexels-photo-3584994.jpeg?auto=compress&cs=tinysrgb&w=600",
    status: "published",
    created_at: "2024-02-01",
    updated_at: "2024-02-05",
  },
];

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    job_type: "full-time",
    salary: "$80,000 - $120,000",
    description:
      "We are looking for a passionate Frontend Developer to join our team...",
    requirements: [
      "3+ years experience",
      "React expertise",
      "TypeScript knowledge",
    ],
    skills: ["React", "TypeScript", "CSS", "Git"],
    posted_date: "2024-01-10",
    application_deadline: "2024-02-15",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    job_type: "full-time",
    salary: "$90,000 - $140,000",
    description: "Join our growing team as a Full Stack Engineer...",
    requirements: [
      "5+ years experience",
      "Node.js and React",
      "Database design",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "AWS"],
    posted_date: "2024-01-12",
    application_deadline: "2024-02-20",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CareerApi = {
  async getProjects() {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) throw error;
    return data as Project[];
  },

  createProject: async (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> => {
    await delay(500);
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockProjects.push(newProject);
    return newProject;
  },

  updateProject: async (
    id: string,
    updates: Partial<Project>
  ): Promise<Project> => {
    await delay(500);
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProjects[index] = {
        ...mockProjects[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return mockProjects[index];
    }
    throw new Error("Project not found");
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockProjects.findIndex((p) => p.id === id);
    if (index !== -1) {
      mockProjects.splice(index, 1);
    }
  },

  // Jobs API
  getJobs: async (filters?: {
    search?: string;
    job_type?: string;
    location?: string;
  }): Promise<Job[]> => {
    await delay(500);
    let filteredJobs = [...mockJobs];

    if (filters?.search) {
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.job_type) {
      filteredJobs = filteredJobs.filter(
        (job) => job.job_type === filters.job_type
      );
    }

    if (filters?.location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    return filteredJobs;
  },

  getJob: async (id: string): Promise<Job | null> => {
    await delay(300);
    return mockJobs.find((job) => job.id === id) || null;
  },

  // Applications API
  getApplications: async (): Promise<Application[]> => {
    if (!hasValidSupabaseConfig()) {
      await delay(500);
      return []; // Mock empty for now
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          *,
          job:jobs(*)
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;

      // Transform data to match our Application interface
      return (data || []).map((item) => ({
        id: item.id,
        job_id: item.job_id,
        user_id: item.user_id,
        status: item.status,
        applied_at: item.applied_at,
        updated_at: item.updated_at,
      }));
    } catch (error) {
      console.error("Error fetching applications:", error);
      return []; // Return empty array on error
    }
  },

  applyToJob: async (jobId: string): Promise<Application> => {
    if (!hasValidSupabaseConfig()) {
      await delay(500);
      const job = mockJobs.find((j) => j.id === jobId);
      if (!job) throw new Error("Job not found");

      return {
        id: Date.now().toString(),
        job_id: jobId,
        user_id: "mock-user",
        status: "pending",
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // First, get the job details
      const { data: job, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (jobError) throw jobError;
      if (!job) throw new Error("Job not found");

      // Create the application
      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          user_id: user.id,
          status: "applied",
          applied_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        job_id: data.job_id,
        user_id: data.user_id,
        status: data.status,
        applied_at: data.applied_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error("Error applying to job:", error);

      // Fallback to mock data
      const job = mockJobs.find((j) => j.id === jobId);
      if (!job) throw new Error("Job not found");

      return {
        id: Date.now().toString(),
        job_id: jobId,
        user_id: "mock-user",
        status: "pending",
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  updateApplicationStatus: async (
    id: string,
    status: Application["status"]
  ): Promise<Application> => {
    if (!hasValidSupabaseConfig()) {
      await delay(500);
      // Mock implementation
      return {
        id: Date.now().toString(),
        job_id: id,
        user_id: "mock-user",
        status,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update the application status
      const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user can only update their own applications
        .select(
          `
          *,
          job:jobs(*)
        `
        )
        .single();

      if (error) throw error;
      if (!data) throw new Error("Application not found");

      return {
        id: data.id,
        job_id: data.job_id,
        user_id: data.user_id,
        status: data.status,
        applied_at: data.applied_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error("Error updating application status:", error);
      throw new Error("Failed to update application status");
    }
  },
};
