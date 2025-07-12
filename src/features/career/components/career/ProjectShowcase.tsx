import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { useProjects } from "../../hooks/useProjects";
import { Project } from "../../types/careerTypes";

export function ProjectShowcase() {
  const { projects, loading, createProject, updateProject, deleteProject } =
    useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleCreateProject = async (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    await createProject(data);
  };

  const handleUpdateProject = async (
    data: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
      setEditingProject(undefined);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-muted/50 rounded-lg animate-pulse w-48" />
          <div className="h-10 bg-muted/50 rounded-lg animate-pulse w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-80 bg-muted/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">My Projects</h2>
          <p className="text-muted-foreground">
            Showcase your work and build your portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={() => setShowForm(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 bg-muted/50 rounded-2xl flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground/70" />
          </div>
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed">
            Start building your portfolio by adding your first project. Showcase
            your skills and experience to potential employers.
          </p>
          <Button onClick={() => setShowForm(true)} className="rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        open={showForm}
        onOpenChange={setShowForm}
        project={editingProject}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
      />
    </div>
  );
}
