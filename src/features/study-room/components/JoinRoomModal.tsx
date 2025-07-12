import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Users, Clock } from "lucide-react";
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
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { StudyRoom, JoinRoomData } from "../types/studyRoomTypes";
import { useAuthStore } from "@/store/authStore";

const joinRoomSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof joinRoomSchema>;

interface JoinRoomModalProps {
  room: StudyRoom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (data: JoinRoomData) => Promise<void>;
}

export function JoinRoomModal({
  room,
  open,
  onOpenChange,
  onJoin,
}: JoinRoomModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(joinRoomSchema),
  });

  const onFormSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onJoin({
        room_id: room.id,
        password: data.password,
        user_id: user?.id || "",
      });
      reset();
      onOpenChange(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Join Private Room
          </DialogTitle>
          <DialogDescription>
            This room requires a password to join.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Room Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h3 className="font-semibold">{room.name}</h3>
            {room.description && (
              <p className="text-sm text-muted-foreground">
                {room.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>
                  {room.participants?.length || 0}/{room.max_participants}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Active</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Room Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter room password"
                {...register("password")}
                disabled={isSubmitting}
                autoFocus
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
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
                    Joining...
                  </>
                ) : (
                  "Join Room"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
