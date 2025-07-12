import { useState } from "react";
import { Search, Filter, Sparkles, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useDiscovery } from "../hooks/useDiscovery";
import { DiscoveryCard } from "./DiscoveryCard";
import { NoteLibrary } from "./NoteLibrary";
import { RoadmapExplorer } from "./RoadmapExplorer";
import { StudyRoomExplorer } from "./StudyRoomExplorer";

const availableTopics = [
  "react",
  "javascript",
  "typescript",
  "python",
  "machine-learning",
  "web-development",
  "data-science",
  "frontend",
  "backend",
  "ai",
];

const difficultyLevels = ["beginner", "intermediate", "advanced"] as const;
const sortOptions = [
  { value: "recent", label: "Recent" },
  { value: "popular", label: "Popular" },
  { value: "trending", label: "Trending" },
  { value: "recommended", label: "Recommended" },
] as const;

export function DiscoveryPage() {
  const discovery = useDiscovery();
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredResults =
    activeTab === "all"
      ? discovery.results
      : discovery.results.filter((item) => item.type === activeTab);

  const hasActiveFilters =
    discovery.filters.topics.length > 0 ||
    discovery.filters.difficulty.length > 0 ||
    discovery.filters.contentType.length > 0;

  const handleLoadMore = () => {
    discovery.loadMore();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Discover
                </h1>
                <p className="text-sm text-muted-foreground">
                  Explore learning content from the community
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for notes, roadmaps, study rooms, or videos..."
                value={discovery.searchQuery}
                onChange={(e) => discovery.updateSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border focus:border-primary/50"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-11 px-4 border-border"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {discovery.filters.topics.length +
                    discovery.filters.difficulty.length +
                    discovery.filters.contentType.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Sort by
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sortOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            discovery.filters.sortBy === option.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            discovery.updateFilters({ sortBy: option.value })
                          }
                          className="h-8 px-3 text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Topics */}
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableTopics.map((topic) => (
                        <Button
                          key={topic}
                          variant={
                            discovery.filters.topics.includes(topic)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            discovery.toggleFilter("topics", topic)
                          }
                          className="h-8 px-3 text-xs"
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="text-sm font-medium mb-3 block text-foreground">
                      Difficulty
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {difficultyLevels.map((level) => (
                        <Button
                          key={level}
                          variant={
                            discovery.filters.difficulty.includes(level)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            discovery.toggleFilter("difficulty", level)
                          }
                          className="h-8 px-3 text-xs capitalize"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="flex justify-end pt-2 border-t border-border">
                      <Button
                        variant="ghost"
                        onClick={discovery.clearFilters}
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trending and Recommended Sections */}
        {!discovery.searchQuery && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Trending */}
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-orange-500/10 rounded-md">
                    <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                  </div>
                  <span className="text-foreground">Trending Now</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discovery.trending.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.views} views
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended */}
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 bg-purple-500/10 rounded-md">
                    <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-500" />
                  </div>
                  <span className="text-foreground">Recommended for You</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {discovery.recommended.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 text-foreground">
                          {rec.content.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {rec.reason}
                        </p>
                      </div>
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium whitespace-nowrap">
                        {Math.round(rec.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted p-1 h-11">
            <TabsTrigger value="all" className="text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="note" className="text-sm">
              Notes
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="text-sm">
              Roadmaps
            </TabsTrigger>
            <TabsTrigger value="studyroom" className="text-sm">
              Study Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {discovery.isLoading && filteredResults.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-border">
                      <CardHeader>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-32 w-full" />
                      </CardContent>
                    </Card>
                  ))
                : filteredResults.map((item) => (
                    <DiscoveryCard key={item.id} content={item} />
                  ))}
            </div>

            {filteredResults.length > 0 && discovery.hasMore && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={discovery.isLoading}
                  variant="outline"
                  className="h-11 px-8"
                >
                  {discovery.isLoading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}

            {filteredResults.length === 0 &&
              !discovery.isLoading &&
              discovery.searchQuery && (
                <div className="text-center py-16">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">
                    No results found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="note">
            <NoteLibrary />
          </TabsContent>

          <TabsContent value="roadmap">
            <RoadmapExplorer />
          </TabsContent>

          <TabsContent value="studyroom">
            <StudyRoomExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
