import { useState, useEffect } from "react";
import { Project } from "../types/careerTypes";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: "1",
        title: "E-commerce Platform",
        description:
          "A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment integration.",
        tech_stack: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
        github_url: "https://github.com/user/ecommerce-platform",
        live_url: "https://ecommerce-platform.vercel.app",
        image_url:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
        status: "published",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z",
      },
      {
        id: "2",
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        tech_stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
        github_url: "https://github.com/user/task-manager",
        live_url: "https://task-manager-app.vercel.app",
        image_url:
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
        status: "published",
        created_at: "2023-12-01T00:00:00Z",
        updated_at: "2023-12-20T00:00:00Z",
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  const createProject = async (
    projectData: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updates, updated_at: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
  };

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
  };
}
