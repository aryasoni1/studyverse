import React from "react";
import {
  FileText,
  Video,
  Map,
  Brain,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

interface StudyVerseEmptyStateRealisticProps {
  onStartChat: (message: string) => void;
  activeFeature: string;
}

export const StudyVerseEmptyStateRealistic: React.FC<
  StudyVerseEmptyStateRealisticProps
> = ({ onStartChat, activeFeature }) => {
  const { isDarkMode } = useThemeStore();

  const getFeatureContent = () => {
    switch (activeFeature) {
      case "notes-summary":
        return {
          title: "Notes Summary AI",
          subtitle: "Transform your notes into clear insights",
          description:
            "Upload your notes or paste text to get AI-powered summaries, key points extraction, and study guides.",
          icon: FileText,
          color: isDarkMode
            ? "from-green-500 to-emerald-600"
            : "from-green-400 to-emerald-500",
          quickStarters: [
            {
              icon: FileText,
              title: "Summarize Notes",
              description: "Get key points from your notes",
              prompt:
                "Please summarize these lecture notes on quantum physics and highlight the main concepts",
              color: isDarkMode
                ? "from-green-400 to-emerald-600"
                : "from-green-300 to-emerald-500",
            },
            {
              icon: Brain,
              title: "Extract Key Points",
              description: "Identify important information",
              prompt:
                "Extract the key points from my biology notes about cellular respiration",
              color: isDarkMode
                ? "from-blue-400 to-cyan-600"
                : "from-blue-300 to-cyan-500",
            },
            {
              icon: BookOpen,
              title: "Create Study Guide",
              description: "Generate comprehensive guides",
              prompt:
                "Create a study guide from my history notes about World War II",
              color: isDarkMode
                ? "from-purple-400 to-pink-600"
                : "from-purple-300 to-pink-500",
            },
            {
              icon: Target,
              title: "Quiz Questions",
              description: "Generate practice questions",
              prompt:
                "Create quiz questions based on my chemistry notes about organic compounds",
              color: isDarkMode
                ? "from-orange-400 to-red-600"
                : "from-orange-300 to-red-500",
            },
          ],
        };

      case "mock-interview":
        return {
          title: "AI Mock Interview",
          subtitle: "Practice with realistic AI interviews",
          description:
            "Get personalized interview practice with AI-powered feedback and video responses for comprehensive preparation.",
          icon: Video,
          color: isDarkMode
            ? "from-blue-500 to-indigo-600"
            : "from-blue-400 to-indigo-500",
          quickStarters: [
            {
              icon: Video,
              title: "Technical Interview",
              description: "Coding and system design",
              prompt:
                "Start a technical interview for a software engineer position focusing on algorithms",
              color: isDarkMode
                ? "from-blue-400 to-cyan-600"
                : "from-blue-300 to-cyan-500",
            },
            {
              icon: Brain,
              title: "Behavioral Interview",
              description: "Soft skills assessment",
              prompt:
                "Practice behavioral interview questions for a product manager role",
              color: isDarkMode
                ? "from-purple-400 to-pink-600"
                : "from-purple-300 to-pink-500",
            },
            {
              icon: Target,
              title: "Case Study",
              description: "Problem-solving scenarios",
              prompt:
                "Give me a business case study interview for a consulting position",
              color: isDarkMode
                ? "from-green-400 to-emerald-600"
                : "from-green-300 to-emerald-500",
            },
            {
              icon: Zap,
              title: "Industry Specific",
              description: "Tailored to your field",
              prompt:
                "Simulate a data science interview with machine learning questions",
              color: isDarkMode
                ? "from-orange-400 to-yellow-600"
                : "from-orange-300 to-yellow-500",
            },
          ],
        };

      case "roadmap-generation":
        return {
          title: "Learning Roadmap AI",
          subtitle: "Create personalized learning paths",
          description:
            "Generate comprehensive roadmaps tailored to your goals, skill level, and timeline with AI-powered recommendations.",
          icon: Map,
          color: isDarkMode
            ? "from-purple-500 to-pink-600"
            : "from-purple-400 to-pink-500",
          quickStarters: [
            {
              icon: Map,
              title: "Career Roadmap",
              description: "Path to your dream job",
              prompt:
                "Create a roadmap to become a full-stack developer in 6 months",
              color: isDarkMode
                ? "from-blue-400 to-purple-600"
                : "from-blue-300 to-purple-500",
            },
            {
              icon: Brain,
              title: "Skill Development",
              description: "Master specific skills",
              prompt:
                "Design a learning path for machine learning and data science",
              color: isDarkMode
                ? "from-green-400 to-blue-600"
                : "from-green-300 to-blue-500",
            },
            {
              icon: Target,
              title: "Certification Prep",
              description: "Prepare for certifications",
              prompt:
                "Create a study roadmap for AWS Solutions Architect certification",
              color: isDarkMode
                ? "from-purple-400 to-pink-600"
                : "from-purple-300 to-pink-500",
            },
            {
              icon: Zap,
              title: "Quick Learning",
              description: "Intensive short courses",
              prompt:
                "Build a 30-day roadmap to learn React and modern web development",
              color: isDarkMode
                ? "from-orange-400 to-red-600"
                : "from-orange-300 to-red-500",
            },
          ],
        };

      default:
        return {
          title: "StudyVerse AI",
          subtitle: "Your intelligent learning companion",
          description:
            "Choose a feature from the sidebar to get started with AI-powered learning assistance.",
          icon: Brain,
          color: isDarkMode
            ? "from-blue-500 to-purple-600"
            : "from-blue-400 to-purple-500",
          quickStarters: [],
        };
    }
  };

  const content = getFeatureContent();

  const exampleQuestions = [
    "How do I summarize complex academic papers effectively?",
    "What are the best strategies for technical interviews?",
    "Create a learning roadmap for becoming a data scientist",
    "Help me prepare for behavioral interview questions",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative mb-8">
          <div
            className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg",
              `bg-gradient-to-br ${content.color}`,
              isDarkMode ? "shadow-blue-500/20" : "shadow-blue-500/15"
            )}
          >
            <content.icon className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1
          className={cn(
            "text-5xl font-bold mb-4",
            isDarkMode
              ? "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
          )}
        >
          {content.title}
        </h1>
        <p
          className={cn(
            "text-xl mb-4",
            isDarkMode ? "text-slate-400" : "text-slate-600"
          )}
        >
          {content.subtitle}
        </p>
        <p
          className={cn(
            "text-lg max-w-3xl mx-auto leading-relaxed",
            isDarkMode ? "text-slate-500" : "text-slate-500"
          )}
        >
          {content.description}
        </p>
      </div>

      {/* Quick Starters Grid */}
      {content.quickStarters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-7xl">
          {content.quickStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => onStartChat(starter.prompt)}
              className={cn(
                "group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg text-left relative overflow-hidden",
                isDarkMode
                  ? "bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50"
                  : "bg-white/60 backdrop-blur-sm border-slate-200/50 hover:bg-white/80 hover:border-slate-300/50"
              )}
            >
              {/* Subtle glow effect */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  isDarkMode
                    ? "bg-gradient-to-br from-blue-500/5 to-transparent"
                    : "bg-gradient-to-br from-blue-500/3 to-transparent"
                )}
              />

              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 shadow-md",
                  `bg-gradient-to-br ${starter.color}`
                )}
              >
                <starter.icon className="w-6 h-6 text-white" />
              </div>
              <h3
                className={cn(
                  "text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors",
                  isDarkMode
                    ? "text-white group-hover:text-blue-400"
                    : "text-slate-900"
                )}
              >
                {starter.title}
              </h3>
              <p
                className={cn(
                  "text-sm mb-4",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}
              >
                {starter.description}
              </p>
              <div
                className={cn(
                  "flex items-center text-sm font-medium group-hover:text-blue-600",
                  isDarkMode
                    ? "text-blue-400 group-hover:text-blue-300"
                    : "text-blue-500"
                )}
              >
                Try it now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Example Questions */}
      <div className="w-full max-w-5xl">
        <h3
          className={cn(
            "text-xl font-semibold mb-6 text-center",
            isDarkMode ? "text-slate-300" : "text-slate-700"
          )}
        >
          Popular questions in StudyVerse:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onStartChat(question)}
              className={cn(
                "group p-4 text-left rounded-xl border transition-all duration-200 hover:shadow-md",
                isDarkMode
                  ? "bg-slate-800/30 backdrop-blur-sm border-slate-700/30 hover:bg-slate-700/40 hover:border-slate-600/40"
                  : "bg-white/40 backdrop-blur-sm border-slate-200/40 hover:bg-white/60 hover:border-slate-300/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "group-hover:text-blue-600 transition-colors",
                    isDarkMode
                      ? "text-slate-300 group-hover:text-blue-400"
                      : "text-slate-700"
                  )}
                >
                  {question}
                </span>
                <Brain
                  className={cn(
                    "w-4 h-4 group-hover:text-blue-600 transition-colors",
                    isDarkMode
                      ? "text-slate-500 group-hover:text-blue-400"
                      : "text-slate-400"
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Highlight */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            icon: Zap,
            title: "AI-Powered",
            description: "Advanced AI for personalized learning experiences",
          },
          {
            icon: Target,
            title: "Goal-Oriented",
            description: "Focused tools to achieve your learning objectives",
          },
          {
            icon: Brain,
            title: "Interactive",
            description: "Engaging interface with real-time feedback",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className={cn(
              "text-center p-6 rounded-2xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-700/30"
                : "bg-white/30 border-slate-200/30"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border",
                isDarkMode
                  ? "bg-slate-700/50 border-slate-600/50"
                  : "bg-slate-100/50 border-slate-200/50"
              )}
            >
              <feature.icon
                className={cn(
                  "w-6 h-6",
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                )}
              />
            </div>
            <h4
              className={cn(
                "text-lg font-semibold mb-2",
                isDarkMode ? "text-white" : "text-slate-900"
              )}
            >
              {feature.title}
            </h4>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-slate-400" : "text-slate-600"
              )}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
