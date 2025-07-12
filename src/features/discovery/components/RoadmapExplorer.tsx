import { useState, useEffect } from "react";
import { Map, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DiscoveryApi } from "../api/discoveryApi";
import { RoadmapCard } from "../types/discoveryTypes";

export function RoadmapExplorer() {
  const [roadmaps, setRoadmaps] = useState<RoadmapCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    setLoading(true);
    try {
      const response = await DiscoveryApi.searchContent({
        query: "",
        filters: { contentType: ["roadmap"], sortBy: "popular" },
        page: 1,
        limit: 20,
      });
      setRoadmaps(
        response.results.filter(
          (item) => item.type === "roadmap"
        ) as RoadmapCard[]
      );
    } catch (error) {
      console.error("Failed to load roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(roadmaps.map((roadmap) => roadmap.category))),
  ];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const matchesCategory =
      selectedCategory === "all" || roadmap.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || roadmap.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
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
          <Map className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold">Roadmap Explorer</h2>
          <Badge variant="secondary">{filteredRoadmaps.length} roadmaps</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {difficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty === "all"
                ? "All Levels"
                : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoadmaps.map((roadmap) => {
          const progressPercentage =
            (roadmap.completedSteps / roadmap.totalSteps) * 100;

          return (
            <Card
              key={roadmap.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={
                          roadmap.difficulty === "beginner"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : roadmap.difficulty === "intermediate"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {roadmap.difficulty}
                      </Badge>
                      <Badge variant="secondary">{roadmap.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {roadmap.estimatedTime}
                  </div>
                </div>

                <CardTitle className="group-hover:text-emerald-600 transition-colors">
                  {roadmap.title}
                </CardTitle>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {roadmap.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {roadmap.completedSteps}/{roadmap.totalSteps} steps
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle className="h-3 w-3" />
                      {progressPercentage.toFixed(0)}% complete
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {roadmap.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {roadmap.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{roadmap.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      {progressPercentage > 0
                        ? "Continue Learning"
                        : "Start Roadmap"}
                    </Button>
                    <Button size="sm" variant="outline">
                      Preview
                    </Button>
                  </div>

                  {/* Author and Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={roadmap.author.avatar} />
                        <AvatarFallback className="text-xs">
                          {roadmap.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {roadmap.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{roadmap.views} views</span>
                      <span>{roadmap.likes} likes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRoadmaps.length === 0 && (
        <div className="text-center py-12">
          <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No roadmaps found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to find more learning paths
          </p>
        </div>
      )}
    </div>
  );
}
