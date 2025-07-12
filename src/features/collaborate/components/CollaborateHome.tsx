import { motion } from "framer-motion";
import {
  Search,
  Bell,
  Filter,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { EnhancedProblemCard } from "../components/EnhancedProblemCard";
import { TagFilter } from "../components/TagFilter";
import { SubmitProblemModal } from "../components/SubmitProblemModal";
import { JoinProjectModal } from "../components/JoinProjectModal";
import { ProblemDetailModal } from "../components/ProblemDetailModal";
import { TaskBreakdownModal } from "../components/TaskBreakdownModal";
import { NotificationCenter } from "../components/NotificationCenter";
import { AdvancedSearch } from "../components/AdvancedSearch";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { SkillMatcher } from "../components/SkillMatcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { problemsApi } from "../api/problemsApi";
import type {
  Problem,
  ProblemFilters,
  TeamMember,
  Task,
  TaskSubmission,
} from "../types/problems";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useState, useEffect } from "react";

export const CollaborateHome: React.FC = () => {
  const [filters, setFilters] = useState<ProblemFilters>({
    domain: [],
    tags: [],
    status: [],
    timeline: "",
    difficulty: [],
    priority: [],
    remoteOnly: false,
    mentorshipAvailable: false,
    featured: false,
  });
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    problemsApi
      .getProblems(filters)
      .then((data) => setProblems(data))
      .catch(() => {
        // Optionally show a toast or log error
        // toast.error('Failed to fetch problems');
      })
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  const createProblem = async (data: Partial<Problem>) => {
    return await problemsApi.createProblem(data);
  };
  const addTasksToProblem = async (problemId: string, tasks: Task[]) => {
    return await problemsApi.addTasksToProblem(problemId, tasks);
  };
  const claimTask = async (problemId: string, taskId: string) => {
    return await problemsApi.claimTask(problemId, taskId);
  };
  const submitTaskWork = async (
    problemId: string,
    taskId: string,
    submission: Omit<TaskSubmission, "id" | "submittedAt" | "status">
  ) => {
    return await problemsApi.submitTaskWork(problemId, taskId, submission);
  };
  const joinTeam = async (problemId: string, member: TeamMember) => {
    return await problemsApi.joinTeam(problemId, member);
  };
  const likeProblem = async (problemId: string) => {
    return await problemsApi.likeProblem(problemId);
  };
  const viewProblem = async (problemId: string) => {
    return await problemsApi.viewProblem(problemId);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "deadline">(
    "newest"
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const filteredProblems = problems.filter(
    (problem: Problem) =>
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      problem.owner.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProblems = [...filteredProblems].sort(
    (a: Problem, b: Problem) => {
      switch (sortBy) {
        case "popular":
          return b.likes + b.views - (a.likes + a.views);
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    }
  );

  const handleViewProblem = async (problem: Problem) => {
    await viewProblem(problem.id);
    setSelectedProblem(problem);
    setShowDetailModal(true);
  };

  const handleViewTasks = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowTaskModal(true);
  };

  const handleJoinProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowJoinModal(true);
  };

  const handleSubmitProblem = async (problemData: Partial<Problem>) => {
    try {
      const newProblem = await createProblem(problemData);

      if (problemData.description && problemData.domain) {
        setTimeout(async () => {
          const aiTasks = generateAITasks();
          await addTasksToProblem(newProblem.id, aiTasks);
          toast.success(
            "🤖 AI has automatically broken down your problem into manageable tasks!"
          );
        }, 2000);
      }

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(
        "🎉 Problem submitted successfully! Your project is now live and ready for collaborators."
      );
    } catch {
      toast.error("Failed to submit problem. Please try again.");
    }
  };

  const handleJoinTeam = async (member: TeamMember) => {
    if (!selectedProblem) return;

    try {
      await joinTeam(selectedProblem.id, member);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(
        "🚀 Welcome to the team! You've successfully joined the project."
      );
      setShowJoinModal(false);
      setSelectedProblem(null);
    } catch {
      toast.error("Failed to join team. Please try again.");
    }
  };

  const handleClaimTask = async (taskId: string) => {
    if (!selectedProblem) return;

    try {
      await claimTask(selectedProblem.id, taskId);
      toast.success("🎯 Task claimed! You can now start working on it.");
    } catch {
      toast.error("Failed to claim task. Please try again.");
    }
  };

  const handleSubmitTaskWork = async (
    taskId: string,
    submission: Omit<TaskSubmission, "id" | "submittedAt" | "status">
  ) => {
    if (!selectedProblem) return;

    try {
      await submitTaskWork(selectedProblem.id, taskId, submission);
      toast.success(
        "📝 Work submitted for review! The project owner will review your submission."
      );
    } catch {
      toast.error("Failed to submit work. Please try again.");
    }
  };

  const handleLikeProblem = async (problemId: string) => {
    await likeProblem(problemId);
  };

  const handleAdvancedSearch = (query: string) => {
    setSearchQuery(query);
  };

  const generateAITasks = () => {
    const baseId = Date.now();

    const commonTasks = [
      {
        id: `${baseId}_1`,
        title: "Project Setup & Architecture",
        description:
          "Set up project structure, choose technology stack, and create development environment",
        category: "backend" as const,
        difficulty: "intermediate" as const,
        estimatedHours: 8,
        skillsRequired: ["Project Management", "System Architecture"],
        dependencies: [],
        status: "open" as const,
        priority: "high" as const,
        deliverables: [
          "Project repository",
          "Architecture document",
          "Development setup",
        ],
        acceptanceCriteria: [
          "Repository created",
          "Tech stack documented",
          "Environment works",
        ],
        createdAt: new Date().toISOString(),
        points: 100,
      },
      {
        id: `${baseId}_2`,
        title: "UI/UX Design & Wireframes",
        description:
          "Create user interface designs, wireframes, and user experience flow",
        category: "design" as const,
        difficulty: "intermediate" as const,
        estimatedHours: 12,
        skillsRequired: ["UI/UX Design", "Figma", "User Research"],
        dependencies: [`${baseId}_1`],
        status: "open" as const,
        priority: "high" as const,
        deliverables: ["Wireframes", "High-fidelity designs", "Design system"],
        acceptanceCriteria: [
          "All screens designed",
          "User flow clear",
          "Responsive design",
        ],
        createdAt: new Date().toISOString(),
        points: 150,
      },
      {
        id: `${baseId}_3`,
        title: "Frontend Development",
        description: "Implement the user interface based on designs",
        category: "frontend" as const,
        difficulty: "intermediate" as const,
        estimatedHours: 24,
        skillsRequired: ["React", "CSS", "JavaScript"],
        dependencies: [`${baseId}_2`],
        status: "open" as const,
        priority: "high" as const,
        deliverables: [
          "Responsive web app",
          "Component library",
          "Cross-browser compatibility",
        ],
        acceptanceCriteria: [
          "UI matches designs",
          "Responsive",
          "Works on all browsers",
        ],
        createdAt: new Date().toISOString(),
        points: 200,
      },
      {
        id: `${baseId}_4`,
        title: "Backend API Development",
        description: "Build server-side logic and database integration",
        category: "backend" as const,
        difficulty: "advanced" as const,
        estimatedHours: 20,
        skillsRequired: ["Node.js", "Database", "API Design"],
        dependencies: [`${baseId}_1`],
        status: "open" as const,
        priority: "high" as const,
        deliverables: ["REST API", "Database schema", "API documentation"],
        acceptanceCriteria: [
          "APIs functional",
          "Database optimized",
          "Documentation complete",
        ],
        createdAt: new Date().toISOString(),
        points: 180,
      },
      {
        id: `${baseId}_5`,
        title: "Testing & Quality Assurance",
        description: "Write tests and ensure quality",
        category: "testing" as const,
        difficulty: "intermediate" as const,
        estimatedHours: 16,
        skillsRequired: ["Testing", "QA", "Automation"],
        dependencies: [`${baseId}_3`, `${baseId}_4`],
        status: "open" as const,
        priority: "medium" as const,
        deliverables: ["Test suite", "Test reports", "Bug fixes"],
        acceptanceCriteria: [
          "Coverage >80%",
          "All tests pass",
          "No critical bugs",
        ],
        createdAt: new Date().toISOString(),
        points: 120,
      },
    ];

    return commonTasks;
  };

  const stats = {
    totalProblems: problems.length,
    activeProjects: problems.filter((p: Problem) => p.status === "in-progress")
      .length,
    completedProjects: problems.filter((p: Problem) => p.status === "completed")
      .length,
    totalMembers: problems.reduce(
      (acc: number, p: Problem) => acc + p.team.length,
      0
    ),
    availableTasks: problems.reduce(
      (acc: number, p: Problem) =>
        acc + p.tasks.filter((t: Task) => t.status === "open").length,
      0
    ),
  };

  const urgentProblems = problems.filter(
    (p: Problem) => p.priority === "urgent" && p.status === "looking-for-team"
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Enhanced Hero Section */}
      <div className="bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="heading-xl text-white">
                SkillForge{" "}
                <span className="text-gradient animate-gradient">
                  Collaborate
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed text-balance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Transform real-world challenges into innovative solutions. Connect
              with industry professionals, join collaborative teams, and build
              products that create meaningful impact across domains.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="default"
                size="lg"
                onClick={() => setShowSubmitModal(true)}
                className="shadow-glow hover:shadow-glow-lg"
              >
                Submit Problem
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowAdvancedSearch(true)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                Find Projects
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.totalProblems}
                </div>
                <div className="text-blue-100 text-sm">Active Problems</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.activeProjects}
                </div>
                <div className="text-blue-100 text-sm">In Progress</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.completedProjects}
                </div>
                <div className="text-blue-100 text-sm">Completed</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.totalMembers}
                </div>
                <div className="text-blue-100 text-sm">Contributors</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {stats.availableTasks}
                </div>
                <div className="text-blue-100 text-sm">Open Tasks</div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Project Showcase */}
      <ProjectShowcase projects={problems} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl">
              <Input
                placeholder="Search problems, skills, domains, or professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-4"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Advanced</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "popular" | "deadline")
                }
                className="input-primary py-3"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="deadline">By Deadline</option>
              </select>

              <Button
                variant="ghost"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
              </Button>
            </div>
          </div>

          {/* Urgent Projects Alert */}
          {urgentProblems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="notification-error rounded-lg p-4 mb-6 border"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-error-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {urgentProblems.length} urgent project
                  {urgentProblems.length > 1 ? "s" : ""} need immediate
                  attention
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-8 space-y-6">
              <TagFilter filters={filters} onFiltersChange={setFilters} />
              <SkillMatcher problems={problems} />
            </div>
          </div>

          {/* Problems Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_: unknown, i: number) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 skeleton rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 skeleton rounded w-24"></div>
                          <div className="h-3 skeleton rounded w-32"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 skeleton rounded"></div>
                        <div className="h-4 skeleton rounded w-3/4"></div>
                      </div>
                      <div className="h-20 skeleton rounded mb-4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 skeleton rounded w-20"></div>
                        <div className="h-8 skeleton rounded w-16"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : sortedProblems.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-secondary-400" />
                  </div>
                  <h3 className="heading-sm mb-2">No problems found</h3>
                  <p className="text-secondary-600 mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms or filters."
                      : "Be the first to submit a problem!"}
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Submit Problem
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-sm">
                    {sortedProblems.length} Project
                    {sortedProblems.length !== 1 ? "s" : ""} Found
                  </h2>
                  {searchQuery && (
                    <span className="text-sm text-secondary-500">
                      Results for "{searchQuery}"
                    </span>
                  )}
                </div>

                {/* Problems Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedProblems.map((problem, index) => (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EnhancedProblemCard
                        problem={problem}
                        onView={handleViewProblem}
                        onJoin={handleJoinProblem}
                        onViewTasks={handleViewTasks}
                        onLike={handleLikeProblem}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      <SubmitProblemModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitProblem}
      />

      <JoinProjectModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinTeam}
        problem={selectedProblem}
      />

      <ProblemDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        problem={selectedProblem}
        onJoin={handleJoinProblem}
      />

      <TaskBreakdownModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        problem={selectedProblem}
        onClaimTask={handleClaimTask}
        onSubmitWork={handleSubmitTaskWork}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleAdvancedSearch}
      />
    </div>
  );
};
