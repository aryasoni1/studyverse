import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { useState } from "react";

export function LayoutPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <>
      <DashboardSidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
