import { useState, useRef, useCallback } from "react";
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  Roadmap,
  MindmapNode,
  CreateNodeData,
} from "../types/roadmapTypes";

interface RoadmapMindmapViewProps {
  roadmap: Roadmap;
  nodes: MindmapNode[];
  onNodeSelect: (node: MindmapNode) => void;
  onNodeUpdate: (
    id: string,
    updates: Partial<MindmapNode>
  ) => Promise<MindmapNode>;
  onNodeCreate: (data: CreateNodeData) => Promise<MindmapNode>;
  searchQuery: string;
}

const statusColors = {
  not_started: "border-gray-500 bg-gray-500/10",
  in_progress: "border-blue-500 bg-blue-500/10",
  completed: "border-green-500 bg-green-500/10",
  blocked: "border-red-500 bg-red-500/10",
};

const priorityColors = {
  low: "border-l-gray-400",
  medium: "border-l-yellow-400",
  high: "border-l-orange-400",
  urgent: "border-l-red-400",
};

export function RoadmapMindmapView({
  roadmap,
  nodes,
  onNodeSelect,
  onNodeUpdate,
  onNodeCreate,
  searchQuery,
}: RoadmapMindmapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes based on search query
  const filteredNodes = nodes.filter(
    (node) =>
      !searchQuery ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Get root nodes
  const rootNodes = filteredNodes.filter((node) => !node.parentId);

  // Get children of a node
  const getChildren = useCallback(
    (nodeId: string) => {
      return filteredNodes.filter((node) => node.parentId === nodeId);
    },
    [filteredNodes]
  );

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle node expansion
  const toggleNodeExpansion = async (node: MindmapNode) => {
    await onNodeUpdate(node.id, { isExpanded: !node.isExpanded });
  };

  // Handle node creation
  const handleCreateChild = async (parentNode: MindmapNode) => {
    const newNodeData: CreateNodeData = {
      title: "New Node",
      description: "",
      type: "leaf",
      parentId: parentNode.id,
      priority: "medium",
      tags: [],
    };

    await onNodeCreate(newNodeData);
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Render node component
  const renderNode = (node: MindmapNode, level = 0) => {
    const children = getChildren(node.id);
    const hasChildren = children.length > 0;

    return (
      <div key={node.id} className="flex flex-col">
        <div className="flex items-center gap-4">
          {/* Connector line for non-root nodes */}
          {level > 0 && <div className="w-8 h-px bg-border" />}

          {/* Node card */}
          <Card
            className={cn(
              "min-w-[200px] cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
              statusColors[node.status],
              priorityColors[node.priority],
              "border-l-4"
            )}
            onClick={() => onNodeSelect(node)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm truncate flex-1">
                  {node.title}
                </h3>

                <div className="flex items-center gap-1 ml-2">
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNodeExpansion(node);
                      }}
                    >
                      {node.isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                  {!hasChildren && (
                    <span className="text-xs text-muted-foreground ml-2">
                      • leaf
                    </span>
                  )}
                </div>
              </div>

              {node.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {node.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusColors[node.status])}
                >
                  {node.status.replace("_", " ")}
                </Badge>

                {node.progress > 0 && (
                  <span className="text-xs font-medium">{node.progress}%</span>
                )}
              </div>

              {node.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {node.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {node.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{node.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {node.dueDate && (
                <div className="text-xs text-muted-foreground mt-2">
                  Due: {new Date(node.dueDate).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Render children */}
        {hasChildren && node.isExpanded && (
          <div className="ml-8 mt-4 space-y-4">
            {children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
        {/* Add Child Node button */}
        <button
          className="text-primary px-2 py-1 text-xs rounded hover:bg-primary/10 text-left w-fit mt-2 ml-8"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateChild(node);
          }}
        >
          + Add item
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Controls */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleZoom(0.1)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(-0.1)}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={resetView}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mindmap canvas */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 p-8"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          {filteredNodes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No nodes yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first mindmap node to get started.
                </p>
                <Button
                  onClick={() => {
                    const newRootData: CreateNodeData = {
                      title: roadmap.title,
                      description: roadmap.description,
                      type: "root",
                      priority: "high",
                      tags: [],
                    };
                    onNodeCreate(newRootData);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Root Node
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Button
                className="mb-4"
                onClick={() => {
                  const newRootData: CreateNodeData = {
                    title: "Root Node",
                    description: "",
                    type: "root",
                    priority: "high",
                    tags: [],
                  };
                  onNodeCreate(newRootData);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Root Node
              </Button>
              {rootNodes.map((node) => renderNode(node))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t p-4 bg-muted/20">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-gray-500 bg-gray-500/10" />
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-blue-500 bg-blue-500/10" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-green-500 bg-green-500/10" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-red-500 bg-red-500/10" />
            <span>Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
