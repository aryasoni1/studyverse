import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  StickyNote,
  Users,
  Bot,
  Compass,
  BookOpen,
  Briefcase,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarItems = [
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
    items: [{ href: "/app/ai-assistant", label: "AI Assistant", icon: Bot }],
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 border-r bg-muted/20 hidden lg:block">
      <ScrollArea className="h-full py-6">
        <div className="px-3 space-y-6">
          {sidebarItems.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.href);

                  return (
                    <Button
                      key={item.href}
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        isActive && "bg-secondary text-secondary-foreground"
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-auto p-3">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/app/account">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
