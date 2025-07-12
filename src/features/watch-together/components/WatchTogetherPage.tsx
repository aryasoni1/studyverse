import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Play,
  Pause,
  Video,
  Globe,
  Lock,
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
import { CreateWatchRoomModal } from "./CreateWatchRoomModal";
import { useWatchRooms } from "../hooks/useWatchTogether";
import { cn } from "@/lib/utils";
import type {
  WatchRoom,
  CreateWatchRoomData,
} from "../types/watchTogetherTypes";

export function WatchTogetherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const { rooms, loading, error, createRoom, joinRoom, refresh } =
    useWatchRooms();

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "on-air" && room.status === "playing") ||
      (activeTab === "scheduled" && room.scheduled_start) ||
      (activeTab === "waiting" && room.status === "waiting") ||
      (activeTab === "ended" && room.status === "ended");

    return matchesSearch && matchesTab;
  });

  const handleCreateRoom = async (data: CreateWatchRoomData) => {
    try {
      const room = await createRoom(data);
      setIsCreateModalOpen(false);
      return room;
    } catch {
      // Error is handled in the hook
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate("/app/study-room")}>
          &larr; Back
        </Button>
      </div>
      <PageHeader
        title="Watch Together"
        description="Join synchronized video watching rooms or create your own movie night"
        actions={
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        }
      />

      {/* Hero Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Browse <span className="text-gradient">Watch Rooms</span>
            </h2>
            <p className="text-muted-foreground">
              Join live streams, scheduled shows, or create your own watch
              party!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
              <div className="text-2xl font-bold text-purple-600">
                {rooms.filter((r) => r.status === "playing").length}
              </div>
              <div className="text-sm text-muted-foreground">Live Now</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
              <div className="text-2xl font-bold text-blue-600">
                {rooms.filter((r) => r.status === "waiting").length}
              </div>
              <div className="text-sm text-muted-foreground">Waiting</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
              <div className="text-2xl font-bold text-green-600">
                {rooms.filter((r) => r.scheduled_start).length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 dark:bg-black/20">
              <div className="text-2xl font-bold text-orange-600">
                {rooms.reduce(
                  (sum, r) => sum + (r.participants?.length || 0),
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">Viewers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-auto grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="on-air">On-air</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="waiting">Waiting</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
              <TabsTrigger value="my-rooms">My Rooms</TabsTrigger>
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
            <WatchRoomGrid
              rooms={filteredRooms}
              loading={loading}
              onJoinRoom={joinRoom}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateWatchRoomModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateRoom}
      />
    </div>
  );
}

interface WatchRoomGridProps {
  rooms: WatchRoom[];
  loading: boolean;
  onJoinRoom: (roomId: string, password?: string) => Promise<void>;
}

function WatchRoomGrid({ rooms, loading, onJoinRoom }: WatchRoomGridProps) {
  const statusIcons = {
    waiting: Clock,
    playing: Play,
    paused: Pause,
    ended: Video,
  };

  const statusColors = {
    waiting: "text-yellow-500",
    playing: "text-green-500",
    paused: "text-orange-500",
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
        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No watch rooms found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first watch room to get started.
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
        const StatusIcon = statusIcons[room.status];
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
                      className={cn("h-4 w-4", statusColors[room.status])}
                    />
                    {room.is_public ? (
                      <Globe className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      YouTube
                    </Badge>
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

                {room.status === "playing" && (
                  <Badge className="bg-red-500 text-white animate-pulse">
                    LIVE
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {room.video_title && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Now playing: </span>
                  <span className="font-medium">{room.video_title}</span>
                </div>
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

                <div className="text-muted-foreground">
                  Host: {room.host?.full_name || "Unknown"}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={room.status === "playing" ? "default" : "secondary"}
                >
                  {room.status.replace("_", " ")}
                </Badge>

                <Button
                  size="sm"
                  onClick={() => onJoinRoom(room.id)}
                  disabled={!hasSpace}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  asChild
                >
                  <Link to={`/app/watch-together/${room.id}`}>
                    {hasSpace ? "Join Room" : "Full"}
                    <Play className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
