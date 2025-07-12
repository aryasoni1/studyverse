import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Lock, Globe, Video, Mic } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CreateStudyRoomData } from "../types/studyRoomTypes";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  topic: z
    .string()
    .max(100, "Topic must be less than 100 characters")
    .optional(),
  max_participants: z
    .number()
    .min(2, "Minimum 2 participants")
    .max(50, "Maximum 50 participants"),
  is_public: z.boolean(),
  password: z.string().optional(),
  scheduled_start: z.string().optional(),
  scheduled_end: z.string().optional(),
  allow_video: z.boolean(),
  allow_audio: z.boolean(),
  allow_screen_share: z.boolean(),
  pomodoro_duration: z.number().min(5).max(60),
  break_duration: z.number().min(1).max(30),
});

type FormData = z.infer<typeof createRoomSchema>;

interface CreateStudyRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateStudyRoomData) => Promise<void>;
}

export function CreateStudyRoomModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateStudyRoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      topic: "",
      max_participants: 10,
      is_public: true,
      password: "",
      allow_video: true,
      allow_audio: true,
      allow_screen_share: true,
      pomodoro_duration: 25,
      break_duration: 5,
    },
  });

  const watchedIsPublic = watch("is_public");
  const watchedMaxParticipants = watch("max_participants");
  const watchedPomodoroDuration = watch("pomodoro_duration");
  const watchedBreakDuration = watch("break_duration");

  const onFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const roomData: CreateStudyRoomData = {
        name: data.name,
        description: data.description,
        topic: data.topic,
        max_participants: data.max_participants,
        is_public: data.is_public,
        password: data.password,
        scheduled_start: data.scheduled_start,
        scheduled_end: data.scheduled_end,
        room_settings: {
          allow_video: data.allow_video,
          allow_audio: data.allow_audio,
          allow_screen_share: data.allow_screen_share,
          pomodoro_duration: data.pomodoro_duration,
          break_duration: data.break_duration,
        },
      };

      await onSubmit(roomData);
      reset();
    } catch {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Study Room</DialogTitle>
          <DialogDescription>
            Set up a collaborative study space for focused learning.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Math Study Group"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What will you be studying in this room?"
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

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Calculus, Programming, History"
                {...register("topic")}
                disabled={isSubmitting}
              />
              {errors.topic && (
                <p className="text-sm text-destructive">
                  {errors.topic.message}
                </p>
              )}
            </div>
          </div>

          {/* Room Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Room Settings</h3>

            {/* Max Participants */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Maximum Participants</Label>
                <span className="text-sm font-medium">
                  {watchedMaxParticipants}
                </span>
              </div>
              <Slider
                value={[watchedMaxParticipants]}
                onValueChange={(value) =>
                  setValue("max_participants", value[0])
                }
                min={2}
                max={50}
                step={1}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {watchedIsPublic ? (
                    <Globe className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-orange-500" />
                  )}
                  <Label htmlFor="is_public" className="text-base font-medium">
                    {watchedIsPublic ? "Public Room" : "Private Room"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {watchedIsPublic
                    ? "Anyone can discover and join this room"
                    : "Only people with the link can join"}
                </p>
              </div>
              <Switch
                id="is_public"
                checked={watchedIsPublic}
                onCheckedChange={(checked) => setValue("is_public", checked)}
                disabled={isSubmitting}
              />
            </div>

            {/* Password Protection */}
            {!watchedIsPublic && (
              <div className="space-y-2">
                <Label htmlFor="password">Password (Optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter room password"
                  {...register("password")}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty for no password protection
                </p>
              </div>
            )}
          </div>

          {/* Media Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Settings</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <Label htmlFor="allow_video">Allow Video</Label>
                </div>
                <Switch
                  id="allow_video"
                  checked={watch("allow_video")}
                  onCheckedChange={(checked) =>
                    setValue("allow_video", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  <Label htmlFor="allow_audio">Allow Audio</Label>
                </div>
                <Switch
                  id="allow_audio"
                  checked={watch("allow_audio")}
                  onCheckedChange={(checked) =>
                    setValue("allow_audio", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Label htmlFor="allow_screen_share">Allow Screen Share</Label>
                </div>
                <Switch
                  id="allow_screen_share"
                  checked={watch("allow_screen_share")}
                  onCheckedChange={(checked) =>
                    setValue("allow_screen_share", checked)
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Pomodoro Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pomodoro Timer</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Focus Duration</Label>
                  <span className="text-sm font-medium">
                    {watchedPomodoroDuration} min
                  </span>
                </div>
                <Slider
                  value={[watchedPomodoroDuration]}
                  onValueChange={(value) =>
                    setValue("pomodoro_duration", value[0])
                  }
                  min={5}
                  max={60}
                  step={5}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Break Duration</Label>
                  <span className="text-sm font-medium">
                    {watchedBreakDuration} min
                  </span>
                </div>
                <Slider
                  value={[watchedBreakDuration]}
                  onValueChange={(value) =>
                    setValue("break_duration", value[0])
                  }
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
            </div>
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
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
