import React from "react";
import {
  Brain,
  Map,
  FileText,
  Briefcase,
  Video,
  Code,
  GraduationCap,
  Rocket,
  Sparkles,
  ArrowRight,
  Zap,
  Globe,
} from "lucide-react";

interface StudyVerseEmptyStateProps {
  onStartChat: (message: string) => void;
  activeFeature: string;
}

export const StudyVerseEmptyState: React.FC<StudyVerseEmptyStateProps> = ({
  onStartChat,
  activeFeature,
}) => {
  const getFeatureContent = () => {
    switch (activeFeature) {
      case "ai-chat":
        return {
          title: "AI Study Assistant",
          subtitle: "Your intelligent learning companion",
          description:
            "Get instant help with any subject, from math and science to literature and history. Ask questions, get explanations, and accelerate your learning journey.",
          quickStarters: [
            {
              icon: Brain,
              title: "Explain Concepts",
              description: "Break down complex topics",
              prompt:
                "Explain quantum physics in simple terms with real-world examples",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: Code,
              title: "Coding Help",
              description: "Debug and learn programming",
              prompt:
                "Help me understand React hooks and show me practical examples",
              color: "from-blue-400 to-cyan-600",
            },
            {
              icon: FileText,
              title: "Study Notes",
              description: "Create structured summaries",
              prompt:
                "Create comprehensive study notes on the American Civil War",
              color: "from-green-400 to-emerald-600",
            },
            {
              icon: Zap,
              title: "Quick Answers",
              description: "Get instant solutions",
              prompt: "Solve this calculus problem step by step: ∫(2x + 3)dx",
              color: "from-yellow-400 to-orange-600",
            },
          ],
        };

      case "roadmaps":
        return {
          title: "Learning Roadmaps",
          subtitle: "Structured paths to mastery",
          description:
            "Follow curated learning paths designed by experts. Track your progress and achieve your educational goals with personalized roadmaps.",
          quickStarters: [
            {
              icon: Code,
              title: "Web Development",
              description: "Frontend to fullstack journey",
              prompt:
                "Create a comprehensive web development roadmap from beginner to advanced",
              color: "from-blue-400 to-purple-600",
            },
            {
              icon: Brain,
              title: "Data Science",
              description: "Analytics and ML path",
              prompt:
                "Design a data science learning roadmap including Python, statistics, and machine learning",
              color: "from-green-400 to-blue-600",
            },
            {
              icon: GraduationCap,
              title: "Computer Science",
              description: "CS fundamentals track",
              prompt:
                "Build a computer science roadmap covering algorithms, data structures, and system design",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: Briefcase,
              title: "Career Prep",
              description: "Job-ready skills path",
              prompt:
                "Create a roadmap for landing a software engineering job in 6 months",
              color: "from-orange-400 to-red-600",
            },
          ],
        };

      case "ai-interviewer":
        return {
          title: "AI Interviewer",
          subtitle: "Practice with realistic AI interviews",
          description:
            "Prepare for job interviews with our AI-powered interviewer. Get personalized feedback and improve your interview skills with video responses.",
          quickStarters: [
            {
              icon: Video,
              title: "Technical Interview",
              description: "Coding and system design",
              prompt:
                "Start a technical interview for a senior software engineer position",
              color: "from-blue-400 to-cyan-600",
            },
            {
              icon: Briefcase,
              title: "Behavioral Interview",
              description: "Soft skills assessment",
              prompt:
                "Practice behavioral interview questions for a product manager role",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: Brain,
              title: "Case Study",
              description: "Problem-solving scenarios",
              prompt:
                "Give me a business case study interview for a consulting position",
              color: "from-green-400 to-emerald-600",
            },
            {
              icon: GraduationCap,
              title: "Academic Interview",
              description: "University admissions prep",
              prompt:
                "Simulate a graduate school admission interview for computer science",
              color: "from-orange-400 to-yellow-600",
            },
          ],
        };

      case "senior-engineer":
        return {
          title: "Senior Engineer AI",
          subtitle: "Learn from AI mentors",
          description:
            "Get guidance from AI senior engineers who can explain complex projects, review your code, and provide career advice with video explanations.",
          quickStarters: [
            {
              icon: Code,
              title: "Project Architecture",
              description: "System design guidance",
              prompt:
                "Explain how to architect a scalable e-commerce platform with microservices",
              color: "from-blue-400 to-purple-600",
            },
            {
              icon: Brain,
              title: "Code Review",
              description: "Best practices feedback",
              prompt:
                "Review my React component and suggest improvements for performance and maintainability",
              color: "from-green-400 to-cyan-600",
            },
            {
              icon: Rocket,
              title: "Career Guidance",
              description: "Professional development",
              prompt:
                "What skills should I focus on to become a senior software engineer?",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: Zap,
              title: "Problem Solving",
              description: "Complex challenges",
              prompt:
                "Walk me through solving a distributed systems problem with high availability",
              color: "from-orange-400 to-red-600",
            },
          ],
        };

      default:
        return {
          title: "StudyVerse AI",
          subtitle: "Your complete learning universe",
          description:
            "Access all study tools, AI assistants, and learning resources in one place. From roadmaps to interviews, we've got your educational journey covered.",
          quickStarters: [
            {
              icon: Brain,
              title: "AI Study Help",
              description: "Get instant answers",
              prompt: "Help me understand machine learning algorithms",
              color: "from-purple-400 to-pink-600",
            },
            {
              icon: Map,
              title: "Learning Path",
              description: "Structured roadmaps",
              prompt: "Create a learning roadmap for becoming a data scientist",
              color: "from-blue-400 to-cyan-600",
            },
            {
              icon: Video,
              title: "Interview Prep",
              description: "AI-powered practice",
              prompt:
                "Start a mock technical interview for a software engineer role",
              color: "from-green-400 to-emerald-600",
            },
            {
              icon: Code,
              title: "Project Guidance",
              description: "Senior engineer mentoring",
              prompt:
                "Explain how to build a full-stack web application from scratch",
              color: "from-orange-400 to-yellow-600",
            },
          ],
        };
    }
  };

  const content = getFeatureContent();

  const exampleQuestions = [
    "Explain the difference between machine learning and deep learning",
    "How do I prepare for a technical interview at Google?",
    "Create a study schedule for learning Python in 3 months",
    "What are the best practices for system design interviews?",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          {/* Cosmic rings */}
          <div
            className="absolute inset-0 w-32 h-32 border-2 border-purple-500/20 rounded-full animate-spin"
            style={{ animationDuration: "20s" }}
          />
          <div
            className="absolute inset-0 w-40 h-40 border border-pink-500/10 rounded-full animate-spin"
            style={{ animationDuration: "30s", animationDirection: "reverse" }}
          />
        </div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
          {content.title}
        </h1>
        <p className="text-xl text-purple-300 mb-4">{content.subtitle}</p>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          {content.description}
        </p>
      </div>

      {/* Quick Starters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-7xl">
        {content.quickStarters.map((starter, index) => (
          <button
            key={index}
            onClick={() => onStartChat(starter.prompt)}
            className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:bg-slate-700/50 hover:border-purple-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2 text-left relative overflow-hidden"
          >
            {/* Cosmic glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div
              className={`w-14 h-14 bg-gradient-to-br ${starter.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <starter.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {starter.title}
            </h3>
            <p className="text-slate-400 text-sm mb-4">{starter.description}</p>
            <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
              Explore now
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Example Questions */}
      <div className="w-full max-w-5xl">
        <h3 className="text-xl font-semibold text-purple-300 mb-6 text-center">
          Popular questions in the StudyVerse:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onStartChat(question)}
              className="group p-4 text-left bg-slate-800/30 backdrop-blur-sm border border-purple-500/20 rounded-xl hover:bg-slate-700/40 hover:border-purple-400/30 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  {question}
                </span>
                <Globe className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Universe Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          {
            icon: Rocket,
            title: "Infinite Learning",
            description:
              "Explore unlimited subjects across the knowledge universe",
          },
          {
            icon: Brain,
            title: "AI-Powered",
            description: "Advanced AI tutors and mentors guide your journey",
          },
          {
            icon: Sparkles,
            title: "Personalized",
            description: "Adaptive learning paths tailored to your goals",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="text-center p-6 bg-slate-800/30 rounded-2xl border border-purple-500/20"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <feature.icon className="w-7 h-7 text-purple-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              {feature.title}
            </h4>
            <p className="text-slate-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
