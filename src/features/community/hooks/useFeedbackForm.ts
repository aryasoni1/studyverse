import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PostFormData } from "../types/communityTypes";
import { communityApi } from "../api/communityApi";
import { toast } from "sonner";

const postFormSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters")
    .max(2000, "Content must be less than 2000 characters"),
  category: z.enum(["feedback", "bug", "feature", "announcement"]),
  tags: z
    .array(z.string())
    .min(1, "Please add at least one tag")
    .max(5, "Maximum 5 tags allowed"),
});

export const useFeedbackForm = (onSuccess?: (post: any) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "feedback",
      tags: [],
    },
  });

  const loadAvailableTags = async () => {
    try {
      const tags = await communityApi.getAvailableTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true);

      const newPost = await communityApi.createPost({
        ...data,
        status: "open",
        priority: "medium",
      });

      toast.success("Your post has been submitted successfully!");
      form.reset();
      onSuccess?.(newPost);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit post. Please try again."
      );
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCustomTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    if (!currentTags.includes(tag) && currentTags.length < 5) {
      form.setValue("tags", [...currentTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return {
    form,
    isSubmitting,
    availableTags,
    onSubmit: form.handleSubmit(onSubmit),
    addCustomTag,
    removeTag,
    loadAvailableTags,
  };
};
