import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Users,
  Settings,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  MessageSquare,
  CheckSquare,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ChatSection } from "./ChatSection";
import { TasksSection } from "./TasksSection";
import { PomodoroTimer } from "./PomodoroTimer";
import { ParticipantsSection } from "./ParticipantsSection";
import { useStudyRoom } from "../hooks/useStudyRooms";
import { useLiveKit } from "../hooks/useLiveKit";
import { cn } from "@/lib/utils";
import type { LiveKitParticipantInfo } from "../hooks/useLiveKit";

function VideoTile({
  videoTrack,
}: {
  videoTrack?: import("livekit-client").Track;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoTrack) {
      console.log("Attaching video track", videoTrack);
      videoTrack.attach(videoRef.current);
      videoRef.current.muted = true;
      return () => {
        const ref = videoRef.current;
        if (ref) {
          videoTrack.detach(ref);
        }
      };
    }
  }, [videoTrack]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{ width: "100%", height: "100%", background: "#222" }}
    />
  );
}

export function StudyRoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");
  const [isConnected, setIsConnected] = useState(false);

  // Always call hooks first
  const {
    room,
    messages,
    tasks,
    pomodoroSessions,
    loading,
    error,
    sendMessage,
    createTask,
    updateTask,
    startPomodoro,
    updatePomodoro,
  } = useStudyRoom(id || "");

  const {
    isConnected: liveKitConnected,
    isConnecting,
    participants,
    connect,
    disconnect,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useLiveKit(id || "", room?.host?.full_name);

  const localParticipant = participants.find(
    (p: { isLocal: boolean }) => p.isLocal
  );

  useEffect(() => {
    if (room && !isConnected && !isConnecting) {
      setIsConnected(true);
      connect().catch((err: unknown) => {
        console.error("Failed to connect to LiveKit:", err);
        // Continue anyway - we'll use mock data
      });
    }
  }, [room, isConnected, isConnecting, connect]);

  const handleLeaveRoom = () => {
    disconnect();
    navigate("/app/study-room");
  };

  if (!id) {
    return <div>Room not found</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room not found</h2>
          <p className="text-muted-foreground mb-4">
            {error ? String(error) : "The requested room could not be found."}
          </p>
          <Button onClick={() => navigate("/app/study-room")}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleLeaveRoom}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Leave Room
              </Button>

              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{room.name}</h1>
                <Badge
                  variant={room.status === "active" ? "default" : "secondary"}
                >
                  {room.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Media Controls */}
              {Boolean(room.room_settings["allow_audio"]) && (
                <Button
                  variant={
                    localParticipant?.audioEnabled ? "default" : "destructive"
                  }
                  size="sm"
                  onClick={toggleAudio}
                >
                  {localParticipant?.audioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
              )}

              {Boolean(room.room_settings["allow_video"]) && (
                <Button
                  variant={
                    localParticipant?.videoEnabled ? "default" : "destructive"
                  }
                  size="sm"
                  onClick={toggleVideo}
                >
                  {localParticipant?.videoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              )}

              {Boolean(room.room_settings["allow_screen_share"]) && (
                <Button
                  variant={
                    localParticipant?.screenShareEnabled ? "default" : "outline"
                  }
                  size="sm"
                  onClick={toggleScreenShare}
                >
                  {localParticipant?.screenShareEnabled ? (
                    <Monitor className="h-4 w-4" />
                  ) : (
                    <MonitorOff className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Only show End Call button if NOT a permanent room */}
              {!(
                room.name === "Focus Room 1" || room.name === "Focus Room 2"
              ) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveRoom}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              )}

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {room.description && (
            <p className="text-muted-foreground mt-2">
              {String(room.description)}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 bg-gray-900 relative">
          {participants.length > 0 ? (
            <div
              className={cn(
                "grid gap-2 p-4 h-full",
                participants.length === 1 && "grid-cols-1",
                participants.length === 2 && "grid-cols-2",
                participants.length <= 4 && "grid-cols-2 grid-rows-2",
                participants.length > 4 && "grid-cols-3 auto-rows-fr"
              )}
            >
              {participants.map((participant: LiveKitParticipantInfo) => {
                console.log("Participant:", participant);
                return (
                  <div
                    key={participant.identity}
                    className="relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    {participant.videoEnabled && participant.videoTrack ? (
                      <VideoTile videoTrack={participant.videoTrack} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-white">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-2">
                          <span className="text-xl font-semibold">
                            {participant.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{participant.name}</span>
                      </div>
                    )}

                    {/* Participant Info */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <div
                        className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          participant.isLocal
                            ? "bg-blue-500 text-white"
                            : "bg-black/50 text-white"
                        )}
                      >
                        {participant.name} {participant.isLocal && "(You)"}
                      </div>

                      {!participant.audioEnabled && (
                        <div className="bg-red-500 p-1 rounded">
                          <MicOff className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Speaking indicator not implemented: participant.isSpeaking does not exist */}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">
                  Waiting for participants
                </h3>
                <p className="text-gray-400">
                  Share the room link to invite others
                </p>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <div className="absolute top-4 left-4">
            <div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                liveKitConnected
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              )}
            >
              {liveKitConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-card flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4 m-4">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="timer" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                Timer
              </TabsTrigger>
              <TabsTrigger value="people" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                People
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="chat" className="h-full m-0">
                <ChatSection messages={messages} onSendMessage={sendMessage} />
              </TabsContent>

              <TabsContent value="tasks" className="h-full m-0">
                <TasksSection
                  tasks={tasks}
                  onCreateTask={createTask}
                  onUpdateTask={updateTask}
                />
              </TabsContent>

              <TabsContent value="timer" className="h-full m-0">
                <PomodoroTimer
                  sessions={pomodoroSessions}
                  roomSettings={room.room_settings}
                  onStartSession={startPomodoro}
                  onUpdateSession={updatePomodoro}
                />
              </TabsContent>

              <TabsContent value="people" className="h-full m-0">
                <ParticipantsSection
                  participants={room.participants || []}
                  host={
                    room.host
                      ? { ...room.host, full_name: room.host.full_name || "" }
                      : null
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
