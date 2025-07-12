import { useState } from "react";
import { Plus, Search, Filter, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreateRoadmapDialog } from "./CreateRoadmapDialog";
import { RoadmapCard } from "./RoadmapCard";
import { useRoadmaps } from "../hooks/useRoadmaps";
import type {
  Roadmap,
  CreateRoadmapData,
  RoadmapTask,
} from "../types/roadmapTypes";
import { RoadmapTimelineView } from "./RoadmapTimelineView";

export function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "roadmap">("calendar");
  const [timelineView, setTimelineView] = useState<"day" | "week" | "month">(
    "week"
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const {
    roadmaps,
    loading,
    hasMore,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap,
    loadMore,
  } = useRoadmaps();

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    const matchesSearch =
      roadmap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "public" && roadmap.isPublic) ||
      (activeTab === "private" && !roadmap.isPublic);

    return matchesSearch && matchesTab;
  });

  const handleCreateRoadmap = async (data: Partial<Roadmap>) => {
    try {
      await createRoadmap(data as CreateRoadmapData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <PageHeader
        title="Learning Roadmaps"
        description="Plan, track, and achieve your learning goals with structured roadmaps"
        actions={null}
      />

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          onClick={() => setViewMode("calendar")}
        >
          Calendar
        </Button>
        <Button
          variant={viewMode === "roadmap" ? "default" : "outline"}
          onClick={() => setViewMode("roadmap")}
        >
          Roadmap
        </Button>
      </div>

      {viewMode === "calendar" ? (
        <div className="mb-8">
          {/* Calendar controls */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant={timelineView === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimelineView("day")}
            >
              Day
            </Button>
            <Button
              variant={timelineView === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimelineView("week")}
            >
              Week
            </Button>
            <Button
              variant={timelineView === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimelineView("month")}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
          {/* Calendar view - TODO: pass real tasks and handlers if available */}
          <RoadmapTimelineView
            tasks={[]}
            timelineView={timelineView}
            currentDate={currentDate}
            onTaskSelect={() => {}}
            onTaskCreate={async () => Promise.resolve({} as RoadmapTask)}
            searchQuery={searchQuery}
          />
        </div>
      ) : (
        <div className="mb-8">
          {/* Filters and Search */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                <TabsTrigger value="private">Private</TabsTrigger>
              </TabsList>

              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Roadmap
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search roadmaps..."
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

            <TabsContent value="all" className="mt-0">
              <RoadmapGrid
                roadmaps={filteredRoadmaps}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onUpdate={updateRoadmap}
                onDelete={deleteRoadmap}
              />
            </TabsContent>

            <TabsContent value="public" className="mt-0">
              <RoadmapGrid
                roadmaps={filteredRoadmaps}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onUpdate={updateRoadmap}
                onDelete={deleteRoadmap}
              />
            </TabsContent>

            <TabsContent value="private" className="mt-0">
              <RoadmapGrid
                roadmaps={filteredRoadmaps}
                loading={loading}
                hasMore={hasMore}
                onLoadMore={loadMore}
                onUpdate={updateRoadmap}
                onDelete={deleteRoadmap}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <CreateRoadmapDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRoadmap}
      />
    </div>
  );
}

interface RoadmapGridProps {
  roadmaps: Roadmap[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onUpdate: (id: string, updates: Partial<Roadmap>) => Promise<Roadmap>;
  onDelete: (id: string) => Promise<void>;
}

function RoadmapGrid({
  roadmaps,
  loading,
  hasMore,
  onLoadMore,
  onUpdate,
  onDelete,
}: RoadmapGridProps) {
  if (loading && roadmaps.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-12">
        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No roadmaps found</h3>
        <p className="text-muted-foreground mb-4">
          Create your first learning roadmap to get started.
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Roadmap
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button variant="outline" onClick={onLoadMore} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
