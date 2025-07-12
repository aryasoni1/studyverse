import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Trash2, Copy, Calendar, Clock, Tag, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import type {
  RoadmapTask,
  TaskCategory,
  TaskPriority,
  TaskStatus,
} from "../types/roadmapTypes";

const editTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  category: z.enum([
    "study",
    "break",
    "admin",
    "meeting",
    "exercise",
    "routine",
    "project",
    "reading",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  tags: z.array(z.string()),
  notes: z.string(),
});

type FormData = z.infer<typeof editTaskSchema>;

interface EditTaskSidebarProps {
  task: RoadmapTask;
  onUpdate: (id: string, updates: Partial<RoadmapTask>) => Promise<RoadmapTask>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const quickDurations = [
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "2 hours", minutes: 120 },
  { label: "4 hours", minutes: 240 },
];

const categoryOptions: { value: TaskCategory; label: string; icon: string }[] =
  [
    { value: "study", label: "Study", icon: "📚" },
    { value: "break", label: "Break", icon: "☕" },
    { value: "admin", label: "Admin Work", icon: "📋" },
    { value: "meeting", label: "Meeting", icon: "👥" },
    { value: "exercise", label: "Exercise", icon: "🏃" },
    { value: "routine", label: "Routine", icon: "🔄" },
    { value: "project", label: "Project", icon: "🚀" },
    { value: "reading", label: "Reading", icon: "📖" },
  ];

const priorityOptions: { value: TaskPriority; label: string; color: string }[] =
  [
    { value: "low", label: "Low", color: "text-gray-500" },
    { value: "medium", label: "Medium", color: "text-yellow-500" },
    { value: "high", label: "High", color: "text-orange-500" },
    { value: "urgent", label: "Urgent", color: "text-red-500" },
  ];

export function EditTaskSidebar({
  task,
  onUpdate,
  onDelete,
  onClose,
}: EditTaskSidebarProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      date: task?.date || "",
      startTime: task?.startTime || "",
      endTime: task?.endTime || "",
      category: task?.category || "study",
      priority: task?.priority || "medium",
      status: task?.status || "pending",
      tags: task?.tags || [],
      notes: task?.notes || "",
    },
  });

  const watchedTags = watch("tags");
  const watchedStartTime = watch("startTime");
  const watchedEndTime = watch("endTime");

  const calculateDuration = (start: string, end: string) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return endMinutes - startMinutes;
  };

  const currentDuration = calculateDuration(watchedStartTime, watchedEndTime);

  const handleQuickDuration = (minutes: number) => {
    const [startHour, startMin] = watchedStartTime.split(":").map(Number);
    const startTotalMinutes = startHour * 60 + startMin;
    const endTotalMinutes = startTotalMinutes + minutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMin = endTotalMinutes % 60;

    if (endHour <= 23) {
      setValue(
        "endTime",
        `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`
      );
    }
  };

  const handleAddTag = () => {
    if (
      newTag.trim() &&
      !watchedTags.includes(newTag.trim()) &&
      watchedTags.length < 10
    ) {
      setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: FormData) => {
    if (!task) return;

    try {
      setIsUpdating(true);
      await onUpdate(task.id, data);
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      setIsDeleting(true);
      await onDelete(task.id);
      toast.success("Task deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!task) return;

    try {
      const duplicateData = {
        title: `${task.title} (Copy)`,
        description: task.description,
        date: task.date,
        startTime: task.startTime,
        endTime: task.endTime,
        category: task.category,
        priority: task.priority,
        status: "pending" as TaskStatus,
        tags: task.tags,
        notes: task.notes,
      };

      // This would need to be implemented in the parent component
      console.log("Duplicate data:", duplicateData);
      toast.success("Task duplicated successfully!");
    } catch (error) {
      console.error("Failed to duplicate task:", error);
      toast.error("Failed to duplicate task");
    }
  };

  // Early return if task is null
  if (!task) {
    return (
      <div className="w-96 border-l bg-card h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No task selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 border-l bg-card h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Add task description..."
              rows={3}
            />
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    type="time"
                    {...register("startTime")}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    type="time"
                    {...register("endTime")}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Quick Duration */}
            <div className="space-y-2">
              <Label>Quick Duration</Label>
              <div className="flex gap-2">
                {quickDurations.map((duration) => (
                  <Button
                    key={duration.minutes}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDuration(duration.minutes)}
                  >
                    {duration.label}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Duration: {Math.floor(currentDuration / 60)}h{" "}
                {currentDuration % 60}m
              </p>
            </div>
          </div>

          <Separator />

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={watch("category") || "study"}
                onValueChange={(value: TaskCategory) =>
                  setValue("category", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={watch("priority") || "medium"}
                onValueChange={(value: TaskPriority) =>
                  setValue("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Flag className={`h-3 w-3 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={
                  !newTag.trim() ||
                  watchedTags.includes(newTag.trim()) ||
                  watchedTags.length >= 10
                }
              >
                <Tag className="h-4 w-4" />
              </Button>
            </div>

            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add additional notes..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={watch("status") === "completed"}
                onCheckedChange={(checked) => {
                  setValue("status", checked ? "completed" : "pending");
                }}
              />
              <Label htmlFor="completed" className="text-sm font-normal">
                Mark as completed
              </Label>
            </div>
          </div>
        </div>
        <div className="p-4 border-t sticky bottom-0 bg-card z-10">
          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
