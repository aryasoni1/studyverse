import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Pin,
  Archive,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Post } from "../types/communityTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface AdminActionsProps {
  isVisible: boolean;
  posts: Post[];
  onStatusChange: (postId: string, status: Post["status"]) => void;
  onBulkAction?: (action: string, postIds: string[]) => void;
}

export const AdminActions = ({
  isVisible,
  posts,
  onStatusChange,
  onBulkAction,
}: AdminActionsProps) => {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<Post["status"] | "">("");
  const [autoModeration, setAutoModeration] = useState(true);

  if (!isVisible) return null;

  const togglePostSelection = (postId: string) => {
    const newSelection = new Set(selectedPosts);
    if (newSelection.has(postId)) {
      newSelection.delete(postId);
    } else {
      newSelection.add(postId);
    }
    setSelectedPosts(newSelection);
  };

  const selectAllPosts = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map((p) => p.id)));
    }
  };

  const handleBulkStatusChange = () => {
    if (bulkStatus && selectedPosts.size > 0) {
      Array.from(selectedPosts).forEach((postId) => {
        onStatusChange(postId, bulkStatus);
      });
      toast.success(
        `Updated ${selectedPosts.size} posts to ${bulkStatus.replace("_", " ")}`
      );
      setSelectedPosts(new Set());
      setBulkStatus("");
    }
  };

  const handleBulkPin = () => {
    if (selectedPosts.size > 0) {
      onBulkAction?.("pin", Array.from(selectedPosts));
      toast.success(`Pinned ${selectedPosts.size} posts`);
      setSelectedPosts(new Set());
    }
  };

  const handleBulkArchive = () => {
    if (selectedPosts.size > 0) {
      onBulkAction?.("archive", Array.from(selectedPosts));
      toast.success(`Archived ${selectedPosts.size} posts`);
      setSelectedPosts(new Set());
    }
  };

  const statusCounts = posts.reduce(
    (acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const priorityCounts = posts.reduce(
    (acc, post) => {
      const priority = post.priority || "medium";
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">By Status</h4>
              <div className="space-y-1">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="capitalize">
                      {status.replace("_", " ")}
                    </span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">By Priority</h4>
              <div className="space-y-1">
                {Object.entries(priorityCounts).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between text-sm">
                    <span className="capitalize">{priority}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Auto-moderation</h4>
              <p className="text-xs text-muted-foreground">
                Automatically flag inappropriate content
              </p>
            </div>
            <Switch
              checked={autoModeration}
              onCheckedChange={setAutoModeration}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Flagged ({posts.filter((p) => p.priority === "urgent").length})
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Pin className="h-3 w-3" />
                Pinned ({posts.filter((p) => p.isPinned).length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Bulk Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={selectAllPosts}>
                {selectedPosts.size === posts.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              {selectedPosts.size > 0 && (
                <Badge variant="secondary">{selectedPosts.size} selected</Badge>
              )}
            </div>

            {selectedPosts.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="flex gap-2">
                  <Select
                    value={bulkStatus}
                    onValueChange={(value) =>
                      setBulkStatus(value as Post["status"] | "")
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={handleBulkStatusChange}
                    disabled={!bulkStatus}
                  >
                    Update
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkPin}
                    className="gap-1"
                  >
                    <Pin className="h-3 w-3" />
                    Pin
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkArchive}
                    className="gap-1"
                  >
                    <Archive className="h-3 w-3" />
                    Archive
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Post Selection List */}
            {posts.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-medium">Posts</h4>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className={`p-2 rounded border cursor-pointer transition-colors ${
                      selectedPosts.has(post.id)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => togglePostSelection(post.id)}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedPosts.has(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};
