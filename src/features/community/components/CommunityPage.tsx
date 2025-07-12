import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  Zap,
  TrendingUp,
  Users,
  MessageSquare,
  LogOut,
  Filter,
  Clock,
} from "lucide-react";
import { usePosts } from "../hooks/usePosts";
import { useUser } from "../../auth/hooks/useUser";
import { useAuth } from "../../auth/hooks/useAuth";
import { PostCard } from "./PostCard";
import { PostForm } from "./PostForm";
import { CategoryTabs } from "./CategoryTabs";
import { FilterSidebar } from "./FilterSidebar";
import { AdminActions } from "./AdminActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { communityApi } from "../api/communityApi";
import { toast } from "sonner";
import type { Post } from "../types/communityTypes";

export const CommunityPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const { user } = useUser();
  const { signOut } = useAuth();
  const isAdmin = false; // Default to false since role is not available

  const {
    posts,
    loading,
    filters,
    pagination,
    loadMore,
    updateFilters,
    refreshPosts,
    addPost,
  } = usePosts();

  useEffect(() => {
    loadAvailableTags();
  }, []);

  const loadAvailableTags = async () => {
    try {
      const tags = await communityApi.getAvailableTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({
      ...filters,
      category: category === "all" ? undefined : (category as Post["category"]),
    });
  };

  const handleReaction = async (postId: string) => {
    try {
      await communityApi.addReaction(postId);
      refreshPosts();
      toast.success("Reaction updated!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update reaction");
      } else {
        toast.error("Failed to update reaction");
      }
    }
  };

  const handleStatusChange = async (
    postId: string,
    status:
      | "open"
      | "under_review"
      | "planned"
      | "resolved"
      | "closed"
      | "in_progress"
      | "completed"
  ) => {
    try {
      await communityApi.updatePostStatus(postId, status);
      refreshPosts();
      toast.success("Post status updated!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update status");
      } else {
        toast.error("Failed to update status");
      }
    }
  };

  const handlePostCreated = (newPost: Post) => {
    addPost(newPost);
    loadAvailableTags();
    toast.success("Post created!");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const postCounts = posts.reduce(
    (acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
    },
    {
      label: "Active Users",
      value: "1.2k",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
    },
    {
      label: "This Week",
      value: Math.floor(posts.length * 0.3),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+23%",
    },
    {
      label: "Resolved",
      value: posts.filter((p) => p.status === "resolved").length,
      icon: Zap,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+15%",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h3>
          {/* Error message display removed: errorMessage variable no longer exists */}
          <Button onClick={refreshPosts} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">SF</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    SkillForge
                  </h1>
                  <p className="text-sm text-gray-500">Community Hub</p>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <Input
                  placeholder="Search discussions, ideas, and feedback..."
                  className="pl-12 pr-4 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl transition-all"
                  value={filters.search || ""}
                  onChange={(e) =>
                    updateFilters({
                      ...filters,
                      search: e.target.value || undefined,
                    })
                  }
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex"
              >
                <Filter className="h-4 w-4" />
              </Button>

              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="hidden md:flex"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}

              <PostForm
                onPostCreated={handlePostCreated}
                trigger={
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Post</span>
                  </Button>
                }
              />

              {/* Enhanced User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.avatarUrl || ""}
                        alt={user?.fullName || ""}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex flex-col space-y-2 p-4">
                    <p className="text-sm font-medium leading-none">
                      {user?.fullName || "Demo User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "demo@skillforge.com"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg"
            >
              <div className="px-4 py-4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    className="pl-10 rounded-lg"
                    value={filters.search || ""}
                    onChange={(e) =>
                      updateFilters({
                        ...filters,
                        search: e.target.value || undefined,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="justify-start"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Enhanced Stats Section */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs text-green-600 bg-green-50"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <FilterSidebar
              filters={filters}
              onFiltersChange={updateFilters}
              availableTags={availableTags}
            />

            {/* Admin Panel */}
            <AnimatePresence>
              {showAdminPanel && (
                <AdminActions
                  isVisible={showAdminPanel}
                  posts={posts}
                  onStatusChange={handleStatusChange}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Category Navigation */}
            <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Community Discussions
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Updated 2 min ago</span>
                  </div>
                </div>
                <CategoryTabs
                  activeCategory={filters.category || "all"}
                  onCategoryChange={handleCategoryChange}
                  postCounts={postCounts}
                />
              </CardContent>
            </Card>

            {/* Enhanced Posts List */}
            <div className="space-y-4">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <PostCard
                      post={post}
                      onReaction={handleReaction}
                      onStatusChange={isAdmin ? handleStatusChange : undefined}
                      isAdmin={isAdmin}
                      currentUserId={user?.id}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Enhanced Loading State */}
              {loading && posts.length === 0 && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Loading discussions
                      </h3>
                      <p className="text-sm text-gray-500">
                        Fetching the latest community posts...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Load More */}
              {pagination.hasMore && !loading && (
                <div className="flex justify-center pt-8">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl border-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      "Load More Posts"
                    )}
                  </Button>
                </div>
              )}

              {/* Enhanced Empty State */}
              {!loading && posts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Card className="max-w-md mx-auto border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-8">
                      <div className="h-24 w-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-12 w-12 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Start the conversation
                      </h3>
                      <p className="text-gray-500 mb-6 leading-relaxed">
                        Be the first to share your thoughts, feedback, or ideas
                        with the community.
                      </p>
                      <PostForm
                        onPostCreated={handlePostCreated}
                        trigger={
                          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Post
                          </Button>
                        }
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
