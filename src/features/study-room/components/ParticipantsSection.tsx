import { Crown, Mic, MoreVertical, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { StudyRoomParticipant } from "../types/studyRoomTypes";

interface ParticipantsSectionProps {
  participants: StudyRoomParticipant[];
  host: { id: string; full_name: string; avatar_url?: string } | null;
}

export function ParticipantsSection({
  participants,
  host,
}: ParticipantsSectionProps) {
  const onlineParticipants = participants.filter((p) => p.status === "online");
  const offlineParticipants = participants.filter(
    (p) => p.status === "offline"
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Participants ({participants.length})
          </h3>
        </div>
      </div>

      {/* Participants List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Online Participants */}
          {onlineParticipants.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Online ({onlineParticipants.length})
              </h4>
              <div className="space-y-2">
                {onlineParticipants.map((participant) => (
                  <ParticipantItem
                    key={participant.id}
                    participant={participant}
                    isHost={participant.user_id === host?.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Offline Participants */}
          {offlineParticipants.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Offline ({offlineParticipants.length})
              </h4>
              <div className="space-y-2">
                {offlineParticipants.map((participant) => (
                  <ParticipantItem
                    key={participant.id}
                    participant={participant}
                    isHost={participant.user_id === host?.id}
                  />
                ))}
              </div>
            </div>
          )}

          {participants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No participants yet.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ParticipantItemProps {
  participant: StudyRoomParticipant;
  isHost: boolean;
}

function ParticipantItem({ participant, isHost }: ParticipantItemProps) {
  // Mock user data - in real app this would come from the participant object
  const user = {
    full_name: isHost ? "Host User" : `User ${participant.user_id.slice(-4)}`,
    avatar_url: undefined,
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
        </Avatar>

        {/* Status Indicator */}
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
            participant.status === "online" && "bg-green-500",
            participant.status === "offline" && "bg-gray-500"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{user.full_name}</span>

          {isHost && <Crown className="h-3 w-3 text-yellow-500" />}

          {participant.is_moderator && !isHost && (
            <Badge variant="secondary" className="text-xs">
              Mod
            </Badge>
          )}
        </div>

        {/* {participant.current_task && (
          <p className="text-xs text-muted-foreground truncate">
            Working on: {participant.current_task}
          </p>
        )} */}
      </div>

      {/* Media Status */}
      <div className="flex items-center gap-1">
        {/* Mock audio/video status */}
        <Mic className="h-3 w-3 text-green-500" />
        <VideoOff className="h-3 w-3 text-gray-500" />
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Profile</DropdownMenuItem>
          <DropdownMenuItem>Send Message</DropdownMenuItem>
          {participant.is_moderator && (
            <>
              <DropdownMenuItem>Mute</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Remove from Room
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
