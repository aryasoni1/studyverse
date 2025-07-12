import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { Calendar, Flag, Tag, Trash2, X } from "lucide-react";
import type {
  MindmapNode,
  TaskPriority,
  NodeStatus,
} from "../types/roadmapTypes";

const editNodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["not_started", "in_progress", "completed", "blocked"]),
  progress: z.number().min(0).max(100),
  dueDate: z.string().optional(),
  tags: z.array(z.string()),
});

type FormData = z.infer<typeof editNodeSchema>;

interface EditMindmapNodeSidebarProps {
  node: MindmapNode;
  allNodes: MindmapNode[];
  onUpdate: (id: string, updates: Partial<MindmapNode>) => Promise<MindmapNode>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] =
  [
    { value: "low", label: "Low", color: "text-gray-500" },
    { value: "medium", label: "Medium", color: "text-yellow-500" },
    { value: "high", label: "High", color: "text-orange-500" },
    { value: "urgent", label: "Urgent", color: "text-red-500" },
  ];

const statusOptions: { value: NodeStatus; label: string; color: string }[] = [
  { value: "not_started", label: "Not Started", color: "text-gray-500" },
  { value: "in_progress", label: "In Progress", color: "text-blue-500" },
  { value: "completed", label: "Completed", color: "text-green-500" },
  { value: "blocked", label: "Blocked", color: "text-red-500" },
];

export function EditMindmapNodeSidebar({
  node,
  allNodes,
  onUpdate,
  onDelete,
  onClose,
}: EditMindmapNodeSidebarProps) {
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
    resolver: zodResolver(editNodeSchema),
    defaultValues: {
      title: node?.title || "",
      description: node?.description || "",
      priority: node?.priority || "medium",
      status: node?.status || "not_started",
      progress: node?.progress || 0,
      dueDate: node?.dueDate || "",
      tags: node?.tags || [],
    },
  });

  const watchedTags = watch("tags");
  const watchedProgress = watch("progress");
  const watchedStatus = watch("status");

  // Get parent and children info
  const parentNode = allNodes.find((n) => n.id === node?.parentId);
  const childNodes = allNodes.filter((n) => n.parentId === node?.id);

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

  const handleProgressChange = (value: number) => {
    setValue("progress", value);

    // Auto-update status based on progress
    if (value === 0 && watchedStatus !== "blocked") {
      setValue("status", "not_started");
    } else if (value > 0 && value < 100 && watchedStatus !== "blocked") {
      setValue("status", "in_progress");
    } else if (value === 100) {
      setValue("status", "completed");
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!node) return;

    try {
      setIsUpdating(true);
      await onUpdate(node.id, data);
      toast.success("Node updated successfully!");
    } catch (error) {
      console.error("Failed to update node:", error);
      toast.error("Failed to update node");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!node) return;

    if (childNodes.length > 0) {
      toast.error(
        "Cannot delete node with children. Delete child nodes first."
      );
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(node.id);
      toast.success("Node deleted successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to delete node:", error);
      toast.error("Failed to delete node");
    } finally {
      setIsDeleting(false);
    }
  };

  // Early return if node is null
  if (!node) {
    return (
      <div className="w-96 border-l bg-card h-full flex flex-col overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit Node</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">No node selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 border-l bg-card h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Node</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting || childNodes.length > 0}
              className="text-destructive hover:text-destructive"
              title={
                childNodes.length > 0
                  ? "Cannot delete node with children"
                  : "Delete node"
              }
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
          {/* Node Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Type: {node.type}</span>
              {parentNode && (
                <>
                  <span>•</span>
                  <span>Parent: {parentNode.title}</span>
                </>
              )}
            </div>
            {childNodes.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Children: {childNodes.length} node
                {childNodes.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <Separator />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Node Title *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter node title"
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
              placeholder="Add node description..."
              rows={3}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watch("status") || "not_started"}
                onValueChange={(value: NodeStatus) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full bg-current ${option.color}`}
                        />
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

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Progress</Label>
              <span className="text-sm font-medium">{watchedProgress}%</span>
            </div>
            <Progress value={watchedProgress} className="h-2" />
            <div className="flex gap-2">
              {[0, 25, 50, 75, 100].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleProgressChange(value)}
                  className="flex-1"
                >
                  {value}%
                </Button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
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

          {/* Children Nodes */}
          {childNodes.length > 0 && (
            <div className="space-y-2">
              <Label>Child Nodes ({childNodes.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {childNodes.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="text-sm truncate">{child.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {child.progress}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} className="flex-1">
              {isUpdating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
