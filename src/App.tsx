import { Routes, Route, useSearchParams } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth/components/AuthProvider";
import { LandingPage } from "./components/landing/LandingPage";
import { AuthPage } from "./features/auth/components/AuthPage";
import { LayoutPage } from "./components/layout/LayoutPage";
import { DashboardPage } from "./features/dashboard/components/DashboardPage";
import { NotesPage } from "./features/notes/components/NotesPage";
import { RoadmapsPage } from "./features/roadmaps/components/RoadmapsPage";
import { RoadmapPage } from "./features/roadmaps/components/RoadmapPage";
import { StudyRoomsListPage } from "./features/study-room/components/StudyRoomsListPage";
import { StudyRoomPage } from "./features/study-room/components/StudyRoomPage";
import { WatchTogetherPage } from "./features/watch-together/components/WatchTogetherPage";
import { WatchRoomPage } from "./features/watch-together/components/WatchRoomPage";
import { CommunityPage } from "./features/community/components/CommunityPage";
import { DiscoveryPage } from "./features/discovery/components/DiscoveryPage";
import { ModernChatPage } from "./features/ai-assistant/components/pages/ModernChatPage";
import { AccountLayout } from "./features/account/components/AccountLayout";
import { CareerLayout } from "./features/career/components/career/CareerLayout";
import { CollaborateHome } from "./features/collaborate/components/CollaborateHome";
import ConnectionTestPage from "./components/shared/ConnectionTestPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { StagewiseToolbar } from "@stagewise/toolbar-react";
import { ReactPlugin } from "@stagewise-plugins/react";

function App() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const autologin = searchParams.get("autologin");
  const password = searchParams.get("password") || "testpassword123";
  const { isAuthenticated, login, signup } = useAuthStore();

  useEffect(() => {
    useAuthStore.getState().initialize();
  }, []);

  useEffect(() => {
    async function autoLoginIfNeeded() {
      if (autologin === "true" && email && !isAuthenticated) {
        try {
          await login(email, password);
        } catch {
          // If login fails, try to sign up
          try {
            await signup(email, password);
          } catch {
            // Optionally handle signup error
          }
        }
      }
    }
    autoLoginIfNeeded();
    // Only run when autologin, email, or isAuthenticated changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autologin, email, password, isAuthenticated]);

  return (
    <>
      {import.meta.env.DEV && (
        <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      )}
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/test" element={<ConnectionTestPage />} />

            {/* Protected Routes */}
            <Route path="/app" element={<LayoutPage />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="notes/*" element={<NotesPage />} />
              <Route path="roadmaps" element={<RoadmapsPage />} />
              <Route path="roadmaps/:id" element={<RoadmapPage />} />
              <Route path="study-room" element={<StudyRoomsListPage />} />
              <Route path="study-room/:id" element={<StudyRoomPage />} />
              <Route path="watch-together" element={<WatchTogetherPage />} />
              <Route path="watch-together/:id" element={<WatchRoomPage />} />
              <Route path="collaborate" element={<CollaborateHome />} />
              <Route path="career/*" element={<CareerLayout />} />
              <Route path="community/*" element={<CommunityPage />} />
              <Route path="ai-assistant/*" element={<ModernChatPage />} />
              <Route path="discovery/*" element={<DiscoveryPage />} />
              <Route path="account/*" element={<AccountLayout />} />
            </Route>

            {/* Catch All */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                  404 - Page Not Found
                </div>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;
