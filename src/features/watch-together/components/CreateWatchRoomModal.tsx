import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Upload,
  Globe,
  Lock,
  MessageSquare,
  Play as PlayIcon,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { CreateWatchRoomData } from "../types/watchTogetherTypes";

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  is_public: z.boolean(),
  password: z.string().optional(),
  scheduled_start: z.string().optional(),
  video_url: z.string().url("Please enter a valid URL").optional(),
  max_participants: z
    .number()
    .min(2, "Minimum 2 participants")
    .max(100, "Maximum 100 participants"),
  allow_chat: z.boolean(),
  auto_play: z.boolean(),
  sync_threshold: z.number().min(1).max(10),
});

type FormData = z.infer<typeof createRoomSchema>;

interface CreateWatchRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateWatchRoomData) => Promise<void>;
}

export function CreateWatchRoomModal({
  open,
  onOpenChange,
  onSubmit,
}: CreateWatchRoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoSource, setVideoSource] = useState<"youtube" | "file">("youtube");

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
      is_public: true,
      password: "",
      video_url: "",
      max_participants: 20,
      allow_chat: true,
      auto_play: true,
      sync_threshold: 3,
    },
  });

  const watchedIsPublic = watch("is_public");
  const watchedMaxParticipants = watch("max_participants");
  const watchedSyncThreshold = watch("sync_threshold");
  const watchedVideoUrl = watch("video_url");

  const onFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Clean up the scheduled_start field to ensure it's either a valid string or null
      const cleanedScheduledStart =
        data.scheduled_start && data.scheduled_start.trim() !== ""
          ? data.scheduled_start
          : undefined;

      const roomData: CreateWatchRoomData = {
        name: data.name,
        description: data.description,
        is_public: data.is_public,
        password: data.password,
        scheduled_start: cleanedScheduledStart,
        video_url: data.video_url,
        max_participants: data.max_participants,
        room_settings: {
          allow_chat: data.allow_chat,
          auto_play: data.auto_play,
          sync_threshold: data.sync_threshold,
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a new room</DialogTitle>
          <DialogDescription>
            Set up a synchronized video watching experience for you and your
            friends.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Video Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                {watchedVideoUrl ? (
                  <div className="text-center text-white">
                    <div className="text-lg font-semibold mb-2">
                      Video Preview
                    </div>
                    <div className="text-sm opacity-75">
                      {watchedVideoUrl.includes("youtube")
                        ? "YouTube Video"
                        : "Video URL"}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="text-lg font-semibold mb-2">
                      Video Preview
                    </div>
                    <div className="text-sm">No video selected</div>
                  </div>
                )}
              </div>

              {watchedVideoUrl && (
                <div className="text-center">
                  <div className="font-medium">
                    {watch("name") || "Untitled Room"}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <span>R+</span>
                    <span>HD</span>
                    <span>Movie</span>
                    <span>1h 6m</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Room Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Movie Night with Friends"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  You can change its name or just leave it by default
                </p>
              </div>

              {/* Start Options */}
              <div className="space-y-3">
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1">
                    Start by time
                  </Button>
                  <Button type="button" variant="default" className="flex-1">
                    Start manual
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This room will be automatically started, please schedule it
                </p>
                <Input
                  type="datetime-local"
                  placeholder="Start Time"
                  {...register("scheduled_start")}
                  disabled={isSubmitting}
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Video Sources */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Sources</Label>
              <p className="text-sm text-muted-foreground">
                Chosen source will be played in your room
              </p>
            </div>

            <Tabs
              value={videoSource}
              onValueChange={(value: string) =>
                setVideoSource(value as "youtube" | "file")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">File Upload</TabsTrigger>
                <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
              </TabsList>

              <TabsContent value="youtube" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    {...register("video_url")}
                    disabled={isSubmitting}
                  />
                  {errors.video_url && (
                    <p className="text-sm text-destructive">
                      {errors.video_url.message}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Choose File
                  </Button>
                  <input type="file" className="hidden" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Room Settings */}
          <div className="space-y-4">
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
                    : "With OFF, only who has the link can see this room"}
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
                max={100}
                step={1}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            {/* Sync Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Sync Threshold (seconds)</Label>
                <span className="text-sm font-medium">
                  {watchedSyncThreshold}s
                </span>
              </div>
              <Slider
                value={[watchedSyncThreshold]}
                onValueChange={(value) => setValue("sync_threshold", value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                How much time difference to allow before forcing synchronization
              </p>
            </div>

            {/* Other Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <Label htmlFor="allow_chat">Allow Chat</Label>
                </div>
                <Switch
                  id="allow_chat"
                  checked={watch("allow_chat")}
                  onCheckedChange={(checked) => setValue("allow_chat", checked)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayIcon className="h-4 w-4" />
                  <Label htmlFor="auto_play">Auto Play</Label>
                </div>
                <Switch
                  id="auto_play"
                  checked={watch("auto_play")}
                  onCheckedChange={(checked) => setValue("auto_play", checked)}
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
