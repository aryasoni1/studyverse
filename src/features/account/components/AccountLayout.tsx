import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  CreditCard,
  UserPlus,
  MessageSquare,
  User,
  Crown,
  Sparkles,
  Bell,
  Star,
  Target,
  Award,
  BookOpen,
  Activity,
} from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { SettingsPage } from "./SettingsPage";
import { BillingPage } from "./BillingPage";
import { InvitePage } from "./InvitePage";
import { FeedbackPage } from "./FeedbackPage";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountLayout() {
  const { user, subscription, loading } = useAccount();
  const [activeTab, setActiveTab] = useState("settings");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-4 w-96 mb-8" />
              <div className="flex items-center space-x-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "trialing":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "canceled":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "pro":
        return "bg-primary text-primary-foreground";
      case "enterprise":
        return "bg-orange-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "pro":
        return <Crown className="h-3 w-3" />;
      case "enterprise":
        return <Sparkles className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const tabConfig = [
    {
      id: "settings",
      label: "Profile",
      icon: Settings,
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
    },
    {
      id: "invites",
      label: "Network",
      icon: UserPlus,
    },
    {
      id: "feedback",
      label: "Feedback",
      icon: MessageSquare,
    },
  ];

  const stats = [
    { icon: BookOpen, label: "Courses", value: 127 },
    { icon: Award, label: "Certificates", value: 23 },
    { icon: Target, label: "Goals", value: 89 },
    { icon: Activity, label: "Streak", value: 45, suffix: "d" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">
                  Account
                </h1>
                <p className="text-muted-foreground">
                  Manage your profile and preferences
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button size="sm">
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </div>

            {/* Profile Card */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-muted text-lg font-medium">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {user?.name}
                    </h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={`${getPlanColor(subscription?.plan || "free")} text-xs font-medium flex items-center space-x-1`}
                      >
                        {getPlanIcon(subscription?.plan || "free")}
                        <span>
                          {subscription?.plan?.toUpperCase() || "FREE"}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(subscription?.status || "inactive")} text-xs font-medium`}
                      >
                        {subscription?.status?.toUpperCase() || "INACTIVE"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {stat.value}
                          {stat.suffix || ""}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4 bg-muted p-1 h-auto">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Content */}
            <div>
              <TabsContent value="settings" className="mt-6">
                <div className="animate-fade-in">
                  <SettingsPage />
                </div>
              </TabsContent>

              <TabsContent value="billing" className="mt-6">
                <div className="animate-fade-in">
                  <BillingPage />
                </div>
              </TabsContent>

              <TabsContent value="invites" className="mt-6">
                <div className="animate-fade-in">
                  <InvitePage />
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="mt-6">
                <div className="animate-fade-in">
                  <FeedbackPage />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
