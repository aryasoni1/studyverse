import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "../types/dashboardTypes";

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  loading?: boolean;
  currentUserId?: string;
}

const rankIcons = {
  1: Crown,
  2: Trophy,
  3: Medal,
};

const rankColors = {
  1: "text-yellow-500",
  2: "text-gray-400",
  3: "text-amber-600",
};

export function Leaderboard({
  leaderboard,
  loading,
  currentUserId,
}: LeaderboardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-6 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>

      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No leaderboard data</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start learning to see rankings!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {leaderboard.map((entry) => {
                const isCurrentUser = entry.id === currentUserId;
                const RankIcon =
                  rankIcons[entry.rank as keyof typeof rankIcons] || Award;
                const rankColor =
                  rankColors[entry.rank as keyof typeof rankColors] ||
                  "text-muted-foreground";

                return (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-all",
                      isCurrentUser && "bg-primary/10 border border-primary/20",
                      !isCurrentUser && "hover:bg-muted/50"
                    )}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8">
                      {entry.rank <= 3 ? (
                        <RankIcon className={cn("h-5 w-5", rankColor)} />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          #{entry.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={entry.avatar_url}
                        alt={entry.full_name}
                      />
                      <AvatarFallback>
                        {entry.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "font-medium text-sm truncate",
                            isCurrentUser && "text-primary"
                          )}
                        >
                          {entry.full_name || "Anonymous"}
                        </p>

                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{entry.points_earned} XP</span>
                        <span>•</span>
                        <span>{entry.skills_mastered} skills</span>
                        <span>•</span>
                        <span>{entry.current_streak} day streak</span>
                      </div>
                    </div>

                    {/* Points Badge */}
                    <Badge
                      variant={isCurrentUser ? "default" : "secondary"}
                      className="font-bold"
                    >
                      {entry.points_earned} XP
                    </Badge>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
