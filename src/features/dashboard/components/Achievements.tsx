import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Star, Users, Target, Zap } from "lucide-react";
import type { Achievement } from "../types/dashboardTypes";

interface AchievementsProps {
  achievements: Achievement[];
  loading?: boolean;
}

const achievementIcons = {
  streak: Zap,
  skill_mastery: Star,
  community: Users,
  milestone: Target,
  special: Trophy,
};

const achievementTypeLabels = {
  streak: "Streak",
  skill_mastery: "Skill",
  community: "Community",
  milestone: "Milestone",
  special: "Special",
};

export function Achievements({ achievements, loading }: AchievementsProps) {
  const unlockedAchievements = achievements.filter((a) => a.unlocked_at);
  const inProgressAchievements = achievements.filter(
    (a) => !a.unlocked_at && a.progress !== undefined
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 animate-pulse"
              >
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>

          <Badge variant="secondary">
            {unlockedAchievements.length} / {achievements.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No achievements yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Keep learning to unlock achievements!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Unlocked ({unlockedAchievements.length})
                  </h4>
                  <div className="space-y-3">
                    {unlockedAchievements.map((achievement) => {
                      const IconComponent =
                        achievementIcons[achievement.type] || Trophy;

                      return (
                        <div
                          key={achievement.id}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800"
                        >
                          {/* Achievement Icon */}
                          <div
                            className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: achievement.badge_color }}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>

                          {/* Achievement Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">
                                {achievement.name}
                              </h4>

                              <Badge variant="outline" className="text-xs">
                                {achievementTypeLabels[achievement.type]}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                +{achievement.points} XP
                              </span>

                              {achievement.unlocked_at && (
                                <span className="text-muted-foreground">
                                  • Unlocked{" "}
                                  {new Date(
                                    achievement.unlocked_at
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* In Progress Achievements */}
              {inProgressAchievements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    In Progress ({inProgressAchievements.length})
                  </h4>
                  <div className="space-y-3">
                    {inProgressAchievements.map((achievement) => {
                      const IconComponent =
                        achievementIcons[achievement.type] || Trophy;
                      const progressValue = achievement.progress || 0;

                      return (
                        <div
                          key={achievement.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          {/* Achievement Icon */}
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-muted-foreground" />
                          </div>

                          {/* Achievement Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm text-muted-foreground">
                                {achievement.name}
                              </h4>

                              <Badge variant="outline" className="text-xs">
                                {achievementTypeLabels[achievement.type]}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">
                                  {progressValue}%
                                </span>
                              </div>
                              <Progress value={progressValue} className="h-2" />
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">
                              +{achievement.points} XP when unlocked
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
