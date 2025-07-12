import { useState, useEffect } from "react";
import type { ElementType } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Lock,
  Globe,
  Play,
  Pause,
  CheckCircle,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreateStudyRoomModal } from "./CreateStudyRoomModal";
import { JoinRoomModal } from "./JoinRoomModal";
import { useStudyRooms } from "../hooks/useStudyRooms";
import { cn } from "@/lib/utils";
import type { StudyRoom } from "../types/studyRoomTypes";
import { useUser } from "@/features/auth/hooks/useUser";
import { toast } from "sonner";

export function StudyRoomsListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinRoomData, setJoinRoomData] = useState<{
    room: StudyRoom;
    isOpen: boolean;
  }>({
    room: {} as StudyRoom,
    isOpen: false,
  });
  const [creatingPermanentRooms, setCreatingPermanentRooms] = useState(false);

  const { rooms, loading, createRoom, joinRoom } = useStudyRooms();
  const { user } = useUser();
  const navigate = useNavigate();

  // Ensure Focus Room 1 and 2 exist in DB
  useEffect(() => {
    const ensurePermanentRooms = async () => {
      setCreatingPermanentRooms(true);
      const focusRoom1 = rooms.find((r) => r.name === "Focus Room 1");
      const focusRoom2 = rooms.find((r) => r.name === "Focus Room 2");
      if (!focusRoom1) {
        await createRoom({
          name: "Focus Room 1",
          is_public: true,
          max_participants: 10,
        });
      }
      if (!focusRoom2) {
        await createRoom({
          name: "Focus Room 2",
          is_public: true,
          max_participants: 10,
        });
      }
      setCreatingPermanentRooms(false);
    };
    if (!loading && rooms.length > 0) {
      ensurePermanentRooms();
    }
  }, [rooms, loading, createRoom]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.topic?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "public" && room.is_public) ||
      (activeTab === "private" && !room.is_public) ||
      (activeTab === "active" && room.status === "active");

    return matchesSearch && matchesTab;
  });

  const handleJoinRoom = async (room: StudyRoom) => {
    if (!user?.id) {
      toast.error("You must be logged in to join a room.");
      return;
    }
    if (room.password_hash) {
      setJoinRoomData({ room, isOpen: true });
    } else {
      try {
        const joinedRoom = await joinRoom({
          room_id: room.id,
          user_id: user.id,
        });
        if (joinedRoom) {
          navigate(`/app/study-room/${room.id}`);
        }
      } catch {
        // Error already handled in joinRoom
      }
    }
  };

  // Find permanent rooms by name
  const focusRoom1 = rooms.find((r) => r.name === "Focus Room 1");
  const focusRoom2 = rooms.find((r) => r.name === "Focus Room 2");

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <PageHeader
        title="Study Rooms"
        description="Join collaborative study spaces or create your own focus room"
        actions={
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        }
      />

      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold mb-2">
            Join a <span className="text-gradient">Focus Room</span>
          </h2>
          <p className="text-muted-foreground mb-6">
            The #1 Platform to Get Work Done. Join below, all rooms are open
            24/7!
          </p>

          {/* Quick Join Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Focus Room 1</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>
                    {focusRoom1 ? focusRoom1.participants?.length || 0 : 0}{" "}
                    online
                  </span>
                </div>
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => focusRoom1 && handleJoinRoom(focusRoom1)}
                  disabled={!focusRoom1 || creatingPermanentRooms}
                >
                  Join Room
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Focus Room 2</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>
                    {focusRoom2 ? focusRoom2.participants?.length || 0 : 0}{" "}
                    online
                  </span>
                </div>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={() => focusRoom2 && handleJoinRoom(focusRoom2)}
                  disabled={!focusRoom2 || creatingPermanentRooms}
                >
                  Join Room
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">WatchTogether</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>0 online</span>
                </div>
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600"
                  asChild
                >
                  <Link to="/app/watch-together">
                    Join Room
                    <Play className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-auto grid-cols-4">
              <TabsTrigger value="all">All Rooms</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="private">Private</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <StudyRoomGrid
              rooms={filteredRooms}
              loading={loading}
              onJoinRoom={handleJoinRoom}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Help Section */}
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
        <p className="text-muted-foreground">
          If you encounter any issues or have suggestions, let us know.
        </p>
      </div>

      <CreateStudyRoomModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={async (data) => {
          await createRoom(data);
        }}
      />

      <JoinRoomModal
        room={joinRoomData.room}
        open={joinRoomData.isOpen}
        onOpenChange={(open) =>
          setJoinRoomData((prev) => ({ ...prev, isOpen: open }))
        }
        onJoin={async (data) => {
          await joinRoom(data);
        }}
      />
    </div>
  );
}

interface StudyRoomGridProps {
  rooms: StudyRoom[];
  loading: boolean;
  onJoinRoom: (room: StudyRoom) => void;
}

function StudyRoomGrid({ rooms, loading, onJoinRoom }: StudyRoomGridProps) {
  const statusIcons: Record<string, ElementType> = {
    active: Play,
    scheduled: Pause,
    ended: CheckCircle,
  };

  const statusColors = {
    active: "text-green-500",
    scheduled: "text-yellow-500",
    ended: "text-gray-500",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No study rooms found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first study room to get started.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => {
        const StatusIcon = (statusIcons[room.status] ?? Play) as ElementType;
        const participantCount = room.participants?.length || 0;
        const hasSpace = participantCount < room.max_participants;

        return (
          <Card
            key={room.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <StatusIcon
                      className={cn(
                        "h-4 w-4",
                        statusColors[room.status] || "text-green-500"
                      )}
                    />
                    {room.is_public ? (
                      <Globe className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    {Boolean(
                      (room.room_settings as Record<string, unknown>)
                        .allow_video
                    ) && <Video className="h-3 w-3 text-muted-foreground" />}
                  </div>

                  <CardTitle className="text-lg font-semibold truncate">
                    {room.name}
                  </CardTitle>

                  {room.description && (
                    <CardDescription className="line-clamp-2 mt-1">
                      {room.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {room.topic && (
                <Badge variant="secondary" className="text-xs">
                  {room.topic}
                </Badge>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {participantCount}/{room.max_participants}
                  </span>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      hasSpace ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Host: {room.host?.full_name || "Unknown"}
                </div>

                <Button
                  size="sm"
                  onClick={() => onJoinRoom(room)}
                  disabled={!hasSpace}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {hasSpace ? "Join Room" : "Full"}
                  <Play className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
