import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Send, Loader2, Hash, BookOpen } from "lucide-react";
import { useFeedbackForm } from "../hooks/useFeedbackForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { communityApi } from "../api/communityApi";
import type { Post } from "../types/communityTypes";

interface PostFormProps {
  onPostCreated: (post: Post) => void;
  trigger?: React.ReactNode;
}

export const PostForm = ({ onPostCreated, trigger }: PostFormProps) => {
  const [open, setOpen] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  const {
    form,
    isSubmitting,
    availableTags,
    onSubmit,
    addCustomTag,
    removeTag,
    loadAvailableTags,
  } = useFeedbackForm((post) => {
    onPostCreated(post);
    setOpen(false);
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const selectedTags = watch("tags") || [];
  const category = watch("category");
  const title = watch("title");
  const content = watch("content");

  useEffect(() => {
    if (open) {
      loadAvailableTags();
      loadSkills();
    }
  }, [open, loadAvailableTags]);

  const loadSkills = async () => {
    try {
      const skillsData = await communityApi.getSkills();
      setSkills(skillsData.map((skill) => skill.id));
    } catch (error) {
      console.error("Failed to load skills:", error);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      addCustomTag(customTag.trim());
      setCustomTag("");
    }
  };

  const categoryOptions = [
    {
      value: "feedback",
      label: "💭 Feedback",
      description: "Share your thoughts and suggestions",
    },
    {
      value: "bug",
      label: "🐛 Bug Report",
      description: "Report issues or problems",
    },
    {
      value: "feature",
      label: "✨ Feature Request",
      description: "Request new features",
    },
    {
      value: "announcement",
      label: "📢 Announcement",
      description: "Official announcements",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Post
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Share your feedback, report bugs, or request features
          </p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    category === option.value
                      ? "ring-2 ring-indigo-500 bg-indigo-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    setValue("category", option.value as Post["category"])
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-lg">
                        {option.label.split(" ")[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">
                          {option.label.substring(2)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.category && (
              <p className="text-xs text-red-600">{errors.category.message}</p>
            )}
          </div>

          <Separator />

          {/* Related Skill (Optional) */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Related Skill (Optional)
              </Label>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a related skill..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific skill</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      <div className="flex items-center gap-2">
                        <span>{skill}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              {...register("title")}
              placeholder="Enter a clear, descriptive title..."
              className="text-base"
            />
            <div className="flex justify-between text-xs">
              <span className="text-red-600">
                {errors.title?.message || ""}
              </span>
              <span className="text-gray-500">{title?.length || 0}/100</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              {...register("content")}
              placeholder="Provide detailed information about your post. Be specific and include any relevant context..."
              className="min-h-32 text-base resize-none"
              rows={6}
            />
            <div className="flex justify-between text-xs">
              <span className="text-red-600">
                {errors.content?.message || ""}
              </span>
              <span className="text-gray-500">{content?.length || 0}/2000</span>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Tags
            </Label>

            {/* Add Custom Tag */}
            <div className="flex gap-2">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddCustomTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCustomTag}
                disabled={!customTag.trim() || selectedTags.length >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Popular Tags */}
            {availableTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Popular tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 12).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs hover:bg-indigo-50 hover:border-indigo-200"
                      onClick={() => addCustomTag(tag)}
                      disabled={
                        selectedTags.includes(tag) || selectedTags.length >= 5
                      }
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Tags */}
            <AnimatePresence>
              {selectedTags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-gray-600">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="default"
                          className="gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-3 w-3 p-0 hover:bg-red-100"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.tags && (
              <p className="text-xs text-red-600">{errors.tags.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
