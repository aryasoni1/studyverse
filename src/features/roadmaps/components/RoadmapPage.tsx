import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Map,
  Share,
  Download,
  Upload,
  Settings,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { RoadmapMindmapView } from "./RoadmapMindmapView";
import { EditMindmapNodeSidebar } from "./EditMindmapNodeSidebar";
import { useRoadmapEditor } from "../hooks/useRoadmapEditor";

export function RoadmapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery] = useState("");

  const {
    roadmap,
    nodes,
    loading,
    error,
    selectedNode,
    isNodeSidebarOpen,
    createNode,
    updateNode,
    deleteNode,
    selectNode,
    closeSidebars,
    exportRoadmap,
    importRoadmap,
  } = useRoadmapEditor(id ?? "");

  if (!id) {
    return <div>Roadmap not found</div>;
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importRoadmap(file);
      event.target.value = ""; // Reset input
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Roadmap not found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The requested roadmap could not be found."}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
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
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold">{roadmap.title}</h1>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <Badge variant="secondary">{roadmap.difficulty}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportRoadmap}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline" size="sm" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </Button>

              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground mt-2">{roadmap.description}</p>
        </div>
      </div>

      {/* Mindmap Only */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 transition-all duration-300">
          <RoadmapMindmapView
            roadmap={roadmap}
            nodes={nodes}
            onNodeSelect={selectNode}
            onNodeUpdate={updateNode}
            onNodeCreate={createNode}
            searchQuery={searchQuery}
          />
        </div>

        {/* Sidebars as overlays */}
        {isNodeSidebarOpen && selectedNode && (
          <div className="fixed top-0 right-0 h-full w-96 z-50 bg-background shadow-lg border-l">
            <EditMindmapNodeSidebar
              node={selectedNode}
              allNodes={nodes}
              onUpdate={updateNode}
              onDelete={deleteNode}
              onClose={closeSidebars}
            />
          </div>
        )}
      </div>
    </div>
  );
}
