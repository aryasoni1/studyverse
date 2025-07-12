import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CreateRoadmapData } from "../types/roadmapTypes";

const createRoadmapSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedDuration: z
    .number()
    .min(1, "Duration must be at least 1 hour")
    .max(1000, "Duration must be less than 1000 hours"),
  isPublic: z.boolean(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
});

type FormData = z.infer<typeof createRoadmapSchema>;

interface CreateRoadmapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateRoadmapData) => Promise<void>;
}

export function CreateRoadmapDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateRoadmapDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createRoadmapSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "beginner",
      estimatedDuration: 40,
      isPublic: false,
      tags: [],
    },
  });

  const watchedTags = watch("tags");
  const watchedIsPublic = watch("isPublic");

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      setNewTag("");
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
      setNewTag("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Roadmap</DialogTitle>
          <DialogDescription>
            Create a structured learning path to achieve your goals.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Frontend Development Mastery"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this roadmap covers and what learners will achieve..."
              rows={3}
              {...register("description")}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Difficulty and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select
                value={watch("difficulty")}
                onValueChange={(
                  value: "beginner" | "intermediate" | "advanced"
                ) => setValue("difficulty", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.difficulty && (
                <p className="text-sm text-destructive">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">
                Estimated Duration (hours) *
              </Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="1"
                max="1000"
                {...register("estimatedDuration", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              {errors.estimatedDuration && (
                <p className="text-sm text-destructive">
                  {errors.estimatedDuration.message}
                </p>
              )}
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
                onKeyPress={handleKeyPress}
                disabled={isSubmitting || watchedTags.length >= 10}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={
                  !newTag.trim() ||
                  watchedTags.includes(newTag.trim()) ||
                  watchedTags.length >= 10 ||
                  isSubmitting
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
                      disabled={isSubmitting}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="isPublic" className="text-base font-medium">
                Make this roadmap public
              </Label>
              <p className="text-sm text-muted-foreground">
                Public roadmaps can be discovered and used by other learners
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={watchedIsPublic}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Roadmap"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
