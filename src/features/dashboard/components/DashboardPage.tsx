import { Flame, TrendingUp, Target, Users, Zap, Brain } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ActivityFeed } from "./ActivityFeed";
import { ProgressChart } from "./ProgressChart";
import { UpcomingTasks } from "./UpcomingTasks";
import { Notifications } from "./Notifications";
import { Leaderboard } from "./Leaderboard";
import { Achievements } from "./Achievements";
import { useDashboardData } from "../hooks/useDashboardData";
import { useAuth } from "@/features/auth/components/AuthProvider";

export function DashboardPage() {
  const { user } = useAuth();
  const {
    data,
    loading,
    error,
    refresh,
    markNotificationAsRead,
    updateTaskStatus,
  } = useDashboardData();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const userName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.email ? user.email.split("@")[0] : "there");

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Keep up the great work on your learning journey.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Refresh data"
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-8 w-8" />
              <span className="text-xl font-semibold">Start AI Chat</span>
            </div>
            <p className="text-purple-100 mb-4">
              Get instant help from our AI assistant
            </p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8" />
              <span className="text-xl font-semibold">Join Study Room</span>
            </div>
            <p className="text-blue-100 mb-4">
              Study together with other learners
            </p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Join Room
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-8 w-8" />
              <span className="text-xl font-semibold">Take Notes</span>
            </div>
            <p className="text-green-100 mb-4">
              Capture your learning insights
            </p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              New Note
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Streak"
          value={`${stats?.learningStreak || 0} days`}
          subtitle="Keep your streak alive!"
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          trend={{
            value: 12,
            label: "from last week",
            isPositive: true,
          }}
          gradient="from-orange-500 to-red-500"
        />

        <StatsCard
          title="Roadmap Progress"
          value={`${stats?.roadmapProgress || 0}%`}
          subtitle="complete"
          icon={<Target className="h-4 w-4 text-blue-500" />}
          progress={{
            value: stats?.roadmapProgress || 0,
            label: "Overall progress",
          }}
          gradient="from-blue-500 to-cyan-500"
        />

        <StatsCard
          title="Daily Goal"
          value={`${stats?.dailyGoalProgress || 0}%`}
          subtitle="of goal reached"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          progress={{
            value: stats?.dailyGoalProgress || 0,
            label: "Today's progress",
          }}
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2">
          <ProgressChart data={data?.progressData || []} loading={loading} />
        </div>

        {/* Activity Feed */}
        <ActivityFeed
          activities={data?.recentActivity || []}
          loading={loading}
        />

        {/* Upcoming Tasks */}
        <UpcomingTasks
          tasks={data?.upcomingTasks || []}
          loading={loading}
          onTaskStatusChange={updateTaskStatus}
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications */}
        <Notifications
          notifications={data?.notifications || []}
          loading={loading}
          onMarkAsRead={markNotificationAsRead}
        />

        {/* Leaderboard */}
        <Leaderboard
          leaderboard={data?.leaderboard || []}
          loading={loading}
          currentUserId={user?.id}
        />

        {/* Achievements */}
        <Achievements
          achievements={data?.achievements || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
