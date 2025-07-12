import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Bookmark,
  Eye,
  Clock,
  Users,
  BookOpen,
  Map,
} from "lucide-react";
import { SearchResult } from "../types/discoveryTypes";

interface DiscoveryCardProps {
  content: SearchResult;
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onOpen?: (content: SearchResult) => void;
}

const getContentIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "note":
      return <BookOpen className="h-3.5 w-3.5" />;
    case "roadmap":
      return <Map className="h-3.5 w-3.5" />;
    case "studyroom":
      return <Users className="h-3.5 w-3.5" />;
    default:
      return null;
  }
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    case "intermediate":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
    case "advanced":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export function DiscoveryCard({
  content,
  onLike,
  onBookmark,
  onOpen,
}: DiscoveryCardProps) {
  const renderContentSpecific = () => {
    switch (content.type) {
      case "note":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {content.preview}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {content.readingTime} min read
            </div>
          </div>
        );

      case "roadmap":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {content.completedSteps}/{content.totalSteps} steps
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(content.completedSteps / content.totalSteps) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated time: {content.estimatedTime}
            </p>
          </div>
        );

      case "studyroom":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${content.isLive ? "bg-emerald-500" : "bg-muted-foreground"}`}
                ></div>
                <span className="text-sm font-medium text-foreground">
                  {content.isLive ? "Live now" : "Scheduled"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                {content.currentUsers}/{content.maxUsers}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Topic: {content.topic}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 cursor-pointer border-border bg-card">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getContentIcon(content.type)}
            <span className="capitalize font-medium">{content.type}</span>
            {"difficulty" in content && (
              <Badge
                variant="outline"
                className={`text-xs ${getDifficultyColor(content.difficulty)}`}
              >
                {content.difficulty}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(content.id);
            }}
            className="h-7 w-7 p-0 hover:bg-accent"
          >
            <Bookmark
              className={`h-3.5 w-3.5 ${content.isBookmarked ? "fill-current text-primary" : "text-muted-foreground"}`}
            />
          </Button>
        </div>

        <h3
          className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors text-foreground"
          onClick={() => onOpen?.(content)}
        >
          {content.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {content.description}
        </p>
      </CardHeader>

      <CardContent className="pb-4">
        {renderContentSpecific()}

        <div className="flex flex-wrap gap-1 mt-4">
          {content.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs h-5 px-2 bg-muted text-muted-foreground border-0"
            >
              {tag}
            </Badge>
          ))}
          {content.tags.length > 3 && (
            <Badge
              variant="secondary"
              className="text-xs h-5 px-2 bg-muted text-muted-foreground border-0"
            >
              +{content.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t border-border">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-5 w-5">
              <AvatarImage src={content.author.avatar} />
              <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                {content.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {content.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {content.views}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLike?.(content.id);
              }}
              className="h-5 p-0 flex items-center gap-1 hover:text-rose-500 transition-colors"
            >
              <Heart
                className={`h-3 w-3 ${content.isLiked ? "fill-current text-rose-500" : ""}`}
              />
              {content.likes}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
