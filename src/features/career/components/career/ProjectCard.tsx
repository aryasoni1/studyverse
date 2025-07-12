import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MoreHorizontal,
  Star,
  TrendingUp,
} from "lucide-react";
import { Project } from "../../types/careerTypes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onView?: (project: Project) => void;
  viewMode?: "grid" | "list";
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
  viewMode = "grid",
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(project.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <Card className="glass-effect card-hover animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex gap-4 flex-1">
              {project.image_url && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted/50 flex-shrink-0 shadow-sm">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer">
                      {project.title}
                    </h3>
                    {project.status === "published" && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.slice(0, 5).map((tech: string) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-xs font-medium bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.tech_stack?.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech_stack?.length - 5}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(project.updated_at)}</span>
                  </div>
                  <Badge
                    variant={
                      project.status === "published" ? "default" : "outline"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {project.github_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
                  asChild
                >
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {project.live_url && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
                  asChild
                >
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect">
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-effect">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{project.title}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group glass-effect card-hover overflow-hidden animate-scale-in">
      <CardHeader className="p-0">
        {project.image_url && (
          <div className="relative overflow-hidden bg-muted/50 aspect-video">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onView && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onView(project)}
                  className="bg-white/90 text-black hover:bg-white rounded-full shadow-lg"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              )}
            </div>
            {project.status === "published" && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech_stack?.slice(0, 4).map((tech: string) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs font-medium bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.tech_stack?.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.tech_stack.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(project.updated_at)}</span>
            </div>
            <Badge
              variant={project.status === "published" ? "default" : "outline"}
              className="text-xs"
            >
              {project.status}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between">
        <div className="flex gap-2">
          {project.github_url && (
            <Button
              size="sm"
              variant="ghost"
              className="h-9 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
              asChild
            >
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {project.live_url && (
            <Button
              size="sm"
              variant="ghost"
              className="h-9 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
              asChild
            >
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Demo
              </a>
            </Button>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(project)}
            className="h-9 w-9 p-0 rounded-full hover:bg-primary-50 dark:hover:bg-primary-950"
          >
            <Edit3 className="w-4 h-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-9 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-effect">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.title}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
