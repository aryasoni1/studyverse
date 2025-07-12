import { motion } from "framer-motion";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Megaphone,
  Grid3X3,
  TrendingUp,
} from "lucide-react";
import { Post } from "../types/communityTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeCategory: Post["category"] | "all";
  onCategoryChange: (category: Post["category"] | "all") => void;
  postCounts: Record<string, number>;
}

const categoryConfig = {
  all: {
    icon: Grid3X3,
    label: "All Posts",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    activeColor: "bg-gray-600",
    gradient: "from-gray-500 to-gray-600",
  },
  feedback: {
    icon: MessageSquare,
    label: "Feedback",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    activeColor: "bg-blue-600",
    gradient: "from-blue-500 to-blue-600",
  },
  bug: {
    icon: Bug,
    label: "Bug Reports",
    color: "text-red-600",
    bgColor: "bg-red-100",
    activeColor: "bg-red-600",
    gradient: "from-red-500 to-red-600",
  },
  feature: {
    icon: Lightbulb,
    label: "Feature Requests",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    activeColor: "bg-purple-600",
    gradient: "from-purple-500 to-purple-600",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcements",
    color: "text-green-600",
    bgColor: "bg-green-100",
    activeColor: "bg-green-600",
    gradient: "from-green-500 to-green-600",
  },
};

export const CategoryTabs = ({
  activeCategory,
  onCategoryChange,
  postCounts,
}: CategoryTabsProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = postCounts[key] || 0;
          const isActive = activeCategory === key;

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                onClick={() => onCategoryChange(key as any)}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap min-w-fit shadow-sm",
                  isActive
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl`
                    : `hover:${config.bgColor} ${config.color} hover:shadow-md bg-white border border-gray-200`
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{config.label}</span>

                {count > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className={cn(
                        "text-xs px-2.5 py-0.5 min-w-[28px] h-6 font-semibold",
                        isActive
                          ? "bg-white/20 text-white border-white/30 shadow-sm"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      )}
                    >
                      {count}
                    </Badge>
                  </motion.div>
                )}

                {/* Trending indicator for active categories */}
                {isActive && count > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="h-3 w-3 bg-orange-400 rounded-full border-2 border-white shadow-sm">
                      <TrendingUp className="h-2 w-2 text-white absolute top-0.5 left-0.5" />
                    </div>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
