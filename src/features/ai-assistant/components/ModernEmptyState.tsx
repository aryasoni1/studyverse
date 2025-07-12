import { Map, FileText, Users, Video, Sparkles, Zap } from "lucide-react";

interface ModernEmptyStateProps {
  onStartChat: (message: string) => void;
}

export const ModernEmptyState: React.FC<ModernEmptyStateProps> = ({
  onStartChat,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-6xl mx-auto bg-background text-foreground transition-colors">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
          Welcome to AI Assistant
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed text-gray-600 dark:text-slate-300">
          Unlock your learning potential with AI-powered tools for personalized
          roadmaps, instant notes, smart summaries, seamless collaboration, and
          realistic interview practice.
        </p>
      </div>

      {/* Feature Grid - 2 rows, 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-5xl">
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <Map className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">
            Roadmap Generation
          </h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Get a step-by-step, AI-personalized learning path for any goal.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <FileText className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">
            Notes Generation
          </h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Turn any topic or transcript into clear, organized notes instantly.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <Sparkles className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">Summary</h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Summarize articles, lectures, or notes into key points in seconds.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <Users className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">
            Collaborate
          </h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Break down big problems into actionable tasks and collaborate with
            AI.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <Video className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">
            AI Interview
          </h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Practice interviews with AI (text or Tavus video) and get instant
            feedback.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 rounded-2xl bg-card border-card shadow-md">
          <Zap className="w-10 h-10 mb-3 text-purple-500" />
          <h3 className="text-lg font-bold mb-1 text-foreground">And More</h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Ask questions, get explanations, and accelerate your learning
            journey.
          </p>
        </div>
      </div>

      {/* Conversation Starters Section */}
      <div className="w-full max-w-3xl mx-auto mt-8">
        <div className="rounded-2xl bg-card border-card p-6 shadow flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Try these AI-powered prompts:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() =>
                onStartChat(
                  "Create a personalized roadmap to become a data scientist in 6 months."
                )
              }
              className="group p-4 rounded-xl border border-card bg-background hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Roadmap:
              </span>{" "}
              Create a personalized roadmap to become a data scientist in 6
              months.
            </button>
            <button
              onClick={() =>
                onStartChat(
                  "Generate detailed notes on React hooks for beginners."
                )
              }
              className="group p-4 rounded-xl border border-card bg-background hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Notes:
              </span>{" "}
              Generate detailed notes on React hooks for beginners.
            </button>
            <button
              onClick={() =>
                onStartChat(
                  "Summarize this article about neural networks in 5 key points."
                )
              }
              className="group p-4 rounded-xl border border-card bg-background hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Summary:
              </span>{" "}
              Summarize this article about neural networks in 5 key points.
            </button>
            <button
              onClick={() =>
                onStartChat(
                  "Break down the project of building a todo app into small actionable tasks."
                )
              }
              className="group p-4 rounded-xl border border-card bg-background hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-purple-600 dark:text-purple-400">
                Collaborate:
              </span>{" "}
              Break down the project of building a todo app into small
              actionable tasks.
            </button>
            <button
              onClick={() =>
                onStartChat(
                  "Give me a mock AI interview for a frontend developer role (text or Tavus video)."
                )
              }
              className="group p-4 rounded-xl border border-card bg-background hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-purple-600 dark:text-purple-400">
                AI Interview:
              </span>{" "}
              Give me a mock AI interview for a frontend developer role (text or
              Tavus video).
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
