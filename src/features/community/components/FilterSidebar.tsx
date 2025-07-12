import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  X,
  ChevronDown,
  Tag,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { FilterOptions, Post } from "../types/communityTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
  className?: string;
}

export const FilterSidebar = ({
  filters,
  onFiltersChange,
  availableTags,
  className,
}: FilterSidebarProps) => {
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? undefined : (status as Post["status"]),
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as FilterOptions["sortBy"],
    });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    onFiltersChange({
      ...filters,
      tags: newTags.length > 0 ? newTags : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!(
    filters.status ||
    filters.tags?.length ||
    filters.sortBy
  );

  const quickFilters = [
    {
      label: "Recent",
      value: "newest",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Latest posts",
    },
    {
      label: "Popular",
      value: "popular",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Most liked",
    },
    {
      label: "Discussed",
      value: "commented",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Most comments",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Quick Filters */}
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {quickFilters.map((filter) => (
            <motion.div
              key={filter.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={filters.sortBy === filter.value ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start gap-3 h-12 transition-all group ${
                  filters.sortBy === filter.value
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg"
                    : `hover:${filter.bgColor} ${filter.color} hover:shadow-sm`
                }`}
                onClick={() => handleSortChange(filter.value)}
              >
                <div
                  className={`p-1.5 rounded-lg ${filters.sortBy === filter.value ? "bg-white/20" : filter.bgColor}`}
                >
                  <filter.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{filter.label}</div>
                  <div
                    className={`text-xs ${filters.sortBy === filter.value ? "text-white/80" : "text-gray-500"}`}
                  >
                    {filter.description}
                  </div>
                </div>
                {filters.sortBy === filter.value && (
                  <Star className="h-3 w-3 ml-auto" />
                )}
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Advanced Filters */}
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm overflow-hidden">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-blue-50">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-0 h-auto hover:bg-transparent"
              >
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4 text-indigo-600" />
                  Advanced Filters
                </CardTitle>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-indigo-100 text-indigo-700 animate-pulse"
                    >
                      {(filters.tags?.length || 0) + (filters.status ? 1 : 0)}
                    </Badge>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform text-gray-400 ${isFiltersOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-6 p-4">
              {/* Enhanced Status Filter */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                  Status
                </label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        All Status
                      </div>
                    </SelectItem>
                    <SelectItem value="open">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        Open
                      </div>
                    </SelectItem>
                    <SelectItem value="under_review">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                        Under Review
                      </div>
                    </SelectItem>
                    <SelectItem value="planned">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        Planned
                      </div>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-400"></div>
                        Resolved
                      </div>
                    </SelectItem>
                    <SelectItem value="closed">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Closed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Enhanced Tags Filter */}
              {availableTags.length > 0 && (
                <div className="space-y-3">
                  <Collapsible open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto text-sm font-medium text-gray-700 hover:bg-transparent"
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-indigo-600" />
                          Tags
                          {filters.tags && filters.tags.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-indigo-100 text-indigo-700"
                            >
                              {filters.tags.length}
                            </Badge>
                          )}
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform text-gray-400 ${isTagsOpen ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-3">
                      <div className="space-y-3">
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {availableTags.map((tag) => {
                            const isSelected = filters.tags?.includes(tag);
                            return (
                              <motion.div
                                key={tag}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  variant={isSelected ? "default" : "ghost"}
                                  size="sm"
                                  className={`w-full justify-start text-xs h-9 transition-all ${
                                    isSelected
                                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                                      : "hover:bg-indigo-50 hover:text-indigo-700"
                                  }`}
                                  onClick={() => toggleTag(tag)}
                                >
                                  <div
                                    className={`h-2 w-2 rounded-full mr-2 ${
                                      isSelected ? "bg-white" : "bg-indigo-400"
                                    }`}
                                  ></div>
                                  <span className="truncate">{tag}</span>
                                  {isSelected && (
                                    <Zap className="h-3 w-3 ml-auto" />
                                  )}
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {/* Enhanced Clear Filters */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full gap-2 h-10 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <X className="h-3 w-3" />
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Enhanced Active Filters Display */}
      <AnimatePresence>
        {(filters.tags?.length || filters.status) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
                  Active Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {filters.status && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-white/80 text-indigo-700 border border-indigo-200 shadow-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                        {filters.status.replace("_", " ")}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100 rounded-full"
                          onClick={() => handleStatusChange("all")}
                        >
                          <X className="h-2.5 w-2.5 text-red-500" />
                        </Button>
                      </Badge>
                    </motion.div>
                  )}

                  {filters.tags?.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-white/80 text-purple-700 border border-purple-200 shadow-sm"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100 rounded-full"
                          onClick={() => toggleTag(tag)}
                        >
                          <X className="h-2.5 w-2.5 text-red-500" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Card */}
      <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Community Pulse
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Active Today</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              +24%
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">New Posts</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              12
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Resolved</span>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              8
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
