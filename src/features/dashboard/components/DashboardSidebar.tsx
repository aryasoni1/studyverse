import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Compass,
  Map,
  StickyNote,
  BookOpen,
  Users,
  Briefcase,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/app/discovery", label: "Discovery", icon: Compass },
    ],
  },
  {
    title: "Learning",
    items: [
      { href: "/app/roadmaps", label: "Roadmaps", icon: Map },
      { href: "/app/notes", label: "Notes", icon: StickyNote },
      { href: "/app/study-room", label: "Study Room", icon: BookOpen },
      { href: "/app/collaborate", label: "Collaborate", icon: Users },
    ],
  },
  {
    title: "Social",
    items: [
      { href: "/app/community", label: "Community", icon: Users },
      { href: "/app/career", label: "Career", icon: Briefcase },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        href: "/app/ai-assistant",
        label: "AI Assistant",
        icon: Bot,
        badge: "AI",
      },
    ],
  },
];

export function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}) {
  const location = useLocation();

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen w-64 z-30 border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:shadow-lg"
        onClick={toggleCollapsed}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Sidebar Content */}
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg">SkillForge</span>
                <span className="text-xs text-muted-foreground">
                  Learning Platform
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={section.title}>
                {!isCollapsed && (
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      location.pathname === item.href ||
                      (item.href !== "/app/dashboard" &&
                        location.pathname.startsWith(item.href));

                    return (
                      <Button
                        key={item.href}
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 h-10",
                          isCollapsed && "justify-center px-2",
                          isActive &&
                            "bg-primary/10 text-primary border-primary/20 border"
                        )}
                        asChild
                      >
                        <Link to={item.href}>
                          <Icon
                            className={cn(
                              "h-4 w-4 flex-shrink-0",
                              isActive && "text-primary"
                            )}
                          />

                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="ml-auto bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      </Button>
                    );
                  })}
                </div>

                {sectionIndex < sidebarSections.length - 1 && !isCollapsed && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10",
              isCollapsed && "justify-center px-2"
            )}
            asChild
          >
            <Link to="/app/account">
              <Settings className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
