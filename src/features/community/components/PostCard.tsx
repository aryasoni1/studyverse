import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  ThumbsUp,
  HelpCircle,
  Pin,
  MoreVertical,
  Clock,
  Tag,
  Share2,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { Post } from "../types/communityTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  onReaction: (postId: string, type: "like" | "helpful" | "love") => void;
  onStatusChange?: (postId: string, status: Post["status"]) => void;
  isAdmin?: boolean;
  currentUserId?: string;
}

const categoryConfig: Record<
  string,
  { color: string; icon: string; bgColor: string; gradient: string }
> = {
  feedback: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "💭",
    bgColor: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  bug: {
    color: "bg-red-50 text-red-700 border-red-200",
    icon: "🐛",
    bgColor: "bg-red-500",
    gradient: "from-red-500 to-red-600",
  },
  feature: {
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: "✨",
    bgColor: "bg-purple-500",
    gradient: "from-purple-500 to-purple-600",
  },
  announcement: {
    color: "bg-green-50 text-green-700 border-green-200",
    icon: "📢",
    bgColor: "bg-green-500",
    gradient: "from-green-500 to-green-600",
  },
  discussion: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: "💬",
    bgColor: "bg-gray-500",
    gradient: "from-gray-500 to-gray-600",
  },
};

const statusConfig: Record<string, { color: string; dot: string }> = {
  open: {
    color: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  },
  under_review: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  planned: {
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-400",
  },
  resolved: {
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
  closed: {
    color: "bg-gray-50 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  in_progress: {
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-400",
  },
  completed: {
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-400",
  },
};

export const PostCard = ({
  post,
  onReaction,
  onStatusChange,
  isAdmin = false,
  currentUserId,
}: PostCardProps) => {
  const reactionCounts = post.engagement.reactions.reduce(
    (acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const userReaction = post.engagement.reactions.find(
    (r) => r.userId === currentUserId
  );
  const categoryInfo = categoryConfig[post.category];
  const statusInfo = statusConfig[post.status];

  const handleReaction = (type: "like" | "helpful" | "love") => {
    onReaction(post.id, type);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card
        className={cn(
          "bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden",
          post.isPinned &&
            "ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50/50 to-orange-50/50"
        )}
      >
        {/* Enhanced Header with Gradient */}
        <div
          className={cn("h-1 w-full bg-gradient-to-r", categoryInfo.gradient)}
        />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              {/* Enhanced Avatar */}
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                  <AvatarImage
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                    {post.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Enhanced Header Info */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    className={cn(categoryInfo.color, "font-medium")}
                    variant="outline"
                  >
                    <span className="mr-1.5">{categoryInfo.icon}</span>
                    {post.category}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                    <Badge
                      variant="outline"
                      className={cn(statusInfo.color, "text-xs")}
                    >
                      {post.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {post.isPinned && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                {/* Enhanced Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                  {post.title}
                </h3>

                {/* Enhanced Content Preview */}
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {post.content}
                </p>

                {/* Enhanced Tags */}
                {post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Tag className="h-3 w-3 text-gray-400" />
                    {post.tags.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600"
                      >
                        +{post.tags.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Enhanced Author and Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-900">
                        {post.author.name}
                      </span>
                      {post.author.badge && (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0 capitalize bg-indigo-50 text-indigo-700 border-indigo-200"
                        >
                          {post.author.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(post.timestamps.created), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  {/* Enhanced Engagement Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.engagement.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Actions Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Bookmark className="h-4 w-4" />
              </Button>

              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onStatusChange?.(post.id, "under_review")}
                    >
                      Mark Under Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange?.(post.id, "planned")}
                    >
                      Mark as Planned
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange?.(post.id, "resolved")}
                    >
                      Mark as Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Enhanced Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 gap-2 text-sm transition-all hover:bg-blue-50 rounded-lg",
                  userReaction?.type === "like" && "text-blue-600 bg-blue-50"
                )}
                onClick={() => handleReaction("like")}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">{reactionCounts.like || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 gap-2 text-sm transition-all hover:bg-green-50 rounded-lg",
                  userReaction?.type === "helpful" &&
                    "text-green-600 bg-green-50"
                )}
                onClick={() => handleReaction("helpful")}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="font-medium">
                  {reactionCounts.helpful || 0}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 gap-2 text-sm transition-all hover:bg-red-50 rounded-lg",
                  userReaction?.type === "love" && "text-red-600 bg-red-50"
                )}
                onClick={() => handleReaction("love")}
              >
                <Heart className="h-4 w-4" />
                <span className="font-medium">{reactionCounts.love || 0}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 text-sm hover:bg-gray-50 rounded-lg"
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 text-sm hover:bg-gray-50 rounded-lg"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-2 text-sm hover:bg-gray-50 rounded-lg"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
