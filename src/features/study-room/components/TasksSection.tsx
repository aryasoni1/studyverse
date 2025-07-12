import { useState } from "react";
import { Plus, CheckCircle, Circle, Clock, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StudyTask } from "../types/studyRoomTypes";

interface TasksSectionProps {
  tasks: StudyTask[];
  onCreateTask: (task: Partial<StudyTask>) => Promise<StudyTask>;
  onUpdateTask: (
    taskId: string,
    updates: Partial<StudyTask>
  ) => Promise<StudyTask>;
}

export function TasksSection({
  tasks,
  onCreateTask,
  onUpdateTask,
}: TasksSectionProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as StudyTask["priority"],
    estimated_duration: 30,
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await onCreateTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        estimated_duration: newTask.estimated_duration,
        status: "pending",
      });

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        estimated_duration: 30,
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error handled in parent
    }
  };

  const handleToggleTask = async (task: StudyTask) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await onUpdateTask(task.id, { status: newStatus });
  };

  const priorityColors = {
    low: "text-gray-500",
    medium: "text-yellow-500",
    high: "text-orange-500",
  };

  const statusIcons = {
    pending: Circle,
    in_progress: Clock,
    completed: CheckCircle,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Study Tasks</h3>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a task to help organize your study session.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Title</Label>
                  <Input
                    id="task-title"
                    placeholder="What do you need to do?"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Add more details..."
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: StudyTask["priority"]) =>
                        setNewTask((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="5"
                      max="480"
                      value={newTask.estimated_duration}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          estimated_duration: parseInt(e.target.value) || 30,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    disabled={!newTask.title.trim()}
                  >
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add tasks to organize your study session.
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const StatusIcon = statusIcons[task.status];

              return (
                <div
                  key={task.id}
                  className={cn(
                    "p-3 border rounded-lg transition-all hover:shadow-sm",
                    task.status === "completed" && "opacity-60 bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleToggleTask(task)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={cn(
                            "font-medium text-sm",
                            task.status === "completed" && "line-through"
                          )}
                        >
                          {task.title}
                        </h4>

                        <Flag
                          className={cn(
                            "h-3 w-3",
                            priorityColors[task.priority]
                          )}
                        />
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>

                        {task.estimated_duration && (
                          <Badge variant="secondary" className="text-xs">
                            {task.estimated_duration}m
                          </Badge>
                        )}

                        <StatusIcon
                          className={cn(
                            "h-3 w-3",
                            task.status === "completed" && "text-green-500",
                            task.status === "in_progress" && "text-blue-500",
                            task.status === "pending" && "text-gray-500"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
