import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Share,
  Lock,
  Globe,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Roadmap } from "../types/roadmapTypes";

interface RoadmapCardProps {
  roadmap: Roadmap;
  onUpdate: (id: string, updates: Partial<Roadmap>) => Promise<Roadmap>;
  onDelete: (id: string) => Promise<void>;
}

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-500 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusColors = {
  not_started: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  paused: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const statusIcons = {
  not_started: Clock,
  in_progress: Play,
  completed: CheckCircle,
  paused: Pause,
};

export function RoadmapCard({ roadmap, onUpdate, onDelete }: RoadmapCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const StatusIcon = statusIcons[roadmap.status];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/roadmaps/${roadmap.id}`
      );
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await onUpdate(roadmap.id, { isPublic: !roadmap.isPublic });
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      // Error handled in parent
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(roadmap.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete roadmap:", error);
      // Error handled in parent
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    difficultyColors[roadmap.difficulty]
                  )}
                >
                  {roadmap.difficulty}
                </Badge>
                {roadmap.isPublic ? (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
              </div>

              <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                <Link to={`/app/roadmaps/${roadmap.id}`}>{roadmap.title}</Link>
              </CardTitle>

              <CardDescription className="line-clamp-2 mt-1">
                {roadmap.description}
              </CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/app/roadmaps/${roadmap.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisibility}>
                  {roadmap.isPublic ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Make Public
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{roadmap.progress}%</span>
            </div>
            <Progress value={roadmap.progress} className="h-2" />
          </div>

          {/* Status and Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4 text-muted-foreground" />
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[roadmap.status])}
              >
                {roadmap.status.replace("_", " ")}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{roadmap.estimatedDuration}h</span>
            </div>
          </div>

          {/* Tags */}
          {roadmap.tags &&
            Array.isArray(roadmap.tags) &&
            roadmap.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {roadmap.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {roadmap.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{roadmap.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Created{" "}
                {formatDistanceToNow(
                  new Date(
                    roadmap.createdAt ||
                      (roadmap as Roadmap & { created_at?: string })
                        .created_at ||
                      new Date()
                  ),
                  {
                    addSuffix: true,
                  }
                )}
              </span>
            </div>

            {roadmap.isPublic && (
              <Badge variant="outline" className="text-xs">
                Public
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Roadmap</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{roadmap.title}"? This action
              cannot be undone. All tasks and progress will be permanently lost.
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
    </>
  );
}
