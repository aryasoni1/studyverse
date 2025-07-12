import { useState, useEffect } from "react";
import { Users, Clock, Globe, Lock, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudyRoomCard } from "../types/discoveryTypes";

export function StudyRoomExplorer() {
  // const [studyRooms, setStudyRooms] = useState<StudyRoomCard[]>([]); // Unused until discoveryApi is implemented
  const studyRooms: StudyRoomCard[] = []; // TODO: Replace with real data when API is available
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "live" | "scheduled">("all");

  useEffect(() => {
    loadStudyRooms();
  }, []);

  const loadStudyRooms = async () => {
    setLoading(true);
    try {
      // TODO: Implement discoveryApi.searchContent when available
      // const response = await discoveryApi.searchContent({
      //   query: "",
      //   type: "studyroom",
      // });
      // setStudyRooms(
      //   response.results.filter(
      //     (item: any) => item.type === "studyroom"
      //   ) as StudyRoomCard[]
      // );
    } catch (error) {
      console.error("Failed to load study rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = studyRooms.filter((room) => {
    switch (filter) {
      case "live":
        return room.isLive;
      case "scheduled":
        return !room.isLive;
      default:
        return true;
    }
  });

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Study Room Explorer</h2>
          <Badge variant="secondary">{filteredRooms.length} rooms</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Rooms
        </Button>
        <Button
          variant={filter === "live" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("live")}
          className="flex items-center gap-1"
        >
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          Live Now
        </Button>
        <Button
          variant={filter === "scheduled" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("scheduled")}
        >
          Scheduled
        </Button>
      </div>

      {/* Study Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card
            key={room.id}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${room.isLive ? "bg-green-500" : "bg-gray-400"}`}
                  ></div>
                  <Badge variant={room.isLive ? "default" : "secondary"}>
                    {room.isLive ? "Live" : "Scheduled"}
                  </Badge>
                  {room.isPublic ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {room.currentUsers}/{room.maxUsers}
                </div>
              </div>

              <CardTitle className="group-hover:text-purple-600 transition-colors">
                {room.title}
              </CardTitle>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Topic */}
                <div className="flex items-center gap-2 p-2 bg-accent rounded-lg">
                  <span className="text-sm font-medium">Topic:</span>
                  <span className="text-sm text-muted-foreground">
                    {room.topic}
                  </span>
                </div>

                {/* Time Information */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {room.isLive ? (
                    <span>
                      Started at{" "}
                      {room.startTime ? formatTime(room.startTime) : "N/A"}
                    </span>
                  ) : (
                    <span>
                      {room.startTime ? formatDate(room.startTime) : "N/A"} at{" "}
                      {room.startTime ? formatTime(room.startTime) : "N/A"}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {room.tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {room.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Join Button */}
                <Button
                  className="w-full"
                  disabled={room.currentUsers >= room.maxUsers}
                  variant={room.isLive ? "default" : "outline"}
                >
                  {room.isLive ? (
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Join Live Session
                    </div>
                  ) : (
                    "Reserve Spot"
                  )}
                </Button>

                {/* Author and Stats */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={room.author.avatar} />
                      <AvatarFallback className="text-xs">
                        {room.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {room.author.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{room.views} views</span>
                    <span>{room.likes} likes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No study rooms found</h3>
          <p className="text-muted-foreground">
            {filter === "live"
              ? "No live sessions at the moment"
              : filter === "scheduled"
                ? "No scheduled sessions"
                : "Try adjusting your filters"}
          </p>
        </div>
      )}
    </div>
  );
}
