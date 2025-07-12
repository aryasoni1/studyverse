import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Target,
  Award,
  ExternalLink,
  Github,
  Heart,
  Eye,
  Clock,
  DollarSign,
  MapPin,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  List,
  Code,
} from "lucide-react";
import { Problem } from "../types/problems";
import { formatDistanceToNow } from "date-fns";
import { useInView } from "react-intersection-observer";

interface EnhancedProblemCardProps {
  problem: Problem;
  onView: (problem: Problem) => void;
  onJoin: (problem: Problem) => void;
  onViewTasks: (problem: Problem) => void;
  onLike?: (problemId: string) => void;
}

export const EnhancedProblemCard: React.FC<EnhancedProblemCardProps> = ({
  problem,
  onView,
  onJoin,
  onViewTasks,
  onLike,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "looking-for-team":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        );
      case "intermediate":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        );
      case "advanced":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
        );
      case "expert":
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(problem.id);
  };

  const getProgressPercentage = () => {
    if (problem.status === "completed") return 100;
    if (problem.status === "looking-for-team") return 0;
    if (problem.tasks.length === 0)
      return Math.min((problem.progress.length / 5) * 100, 90);

    const completedTasks = problem.tasks.filter(
      (t) => t.status === "completed"
    ).length;
    return Math.min((completedTasks / problem.tasks.length) * 100, 90);
  };

  const availableTasks = problem.tasks.filter(
    (t) => t.status === "open"
  ).length;
  const totalTasks = problem.tasks.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      {/* Featured Badge */}
      {problem.featured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              Featured Project
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={problem.owner.avatar}
                alt={problem.owner.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {problem.owner.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {problem.owner.name}
                </h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">
                    {problem.owner.rating}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {problem.owner.profession}
              </p>
              <p className="text-xs text-gray-400">
                {problem.owner.completedProjects} projects completed
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(problem.status)}`}
            >
              {problem.status.replace("-", " ")}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(problem.priority)}`}
            >
              {problem.priority}
            </span>
          </div>
        </div>

        {/* AI Generated Badge */}
        {problem.aiGenerated && (
          <div className="mb-4 flex items-center space-x-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              AI Task Breakdown Available
            </span>
          </div>
        )}

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {problem.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {problem.description}
          </p>
        </div>

        {/* Impact */}
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              Expected Impact
            </span>
          </div>
          <p className="text-sm text-purple-700 line-clamp-2">
            {problem.impact}
          </p>
        </div>

        {/* Task Summary */}
        {totalTasks > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Tasks Available
                </span>
              </div>
              <span className="text-sm text-blue-700">
                {availableTasks}/{totalTasks} open
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-blue-700">
              <span>
                {problem.tasks.filter((t) => t.category === "frontend").length}{" "}
                Frontend
              </span>
              <span>
                {problem.tasks.filter((t) => t.category === "backend").length}{" "}
                Backend
              </span>
              <span>
                {problem.tasks.filter((t) => t.category === "design").length}{" "}
                Design
              </span>
              <span>
                {problem.tasks.filter((t) => t.category === "testing").length}{" "}
                Testing
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar (for in-progress projects) */}
        {problem.status === "in-progress" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm text-gray-600">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{problem.timeline}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{problem.team.length} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 capitalize">
              {problem.difficulty}
            </span>
            {getDifficultyIcon(problem.difficulty)}
          </div>
          {problem.budget && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{problem.budget}</span>
            </div>
          )}
        </div>

        {/* Special Indicators */}
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.remoteOnly && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              <MapPin className="w-3 h-3" />
              <span>Remote</span>
            </span>
          )}
          {problem.mentorshipAvailable && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              <Star className="w-3 h-3" />
              <span>Mentorship</span>
            </span>
          )}
          {problem.deadline && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              <AlertTriangle className="w-3 h-3" />
              <span>
                Deadline: {new Date(problem.deadline).toLocaleDateString()}
              </span>
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{problem.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Team Avatars */}
        {problem.team.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Team:</span>
              <div className="flex -space-x-2">
                {problem.team.slice(0, 4).map((member, index) => (
                  <motion.img
                    key={member.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover hover:scale-110 transition-transform cursor-pointer"
                    title={`${member.name} - ${member.role} (${member.tasksCompleted} tasks, ${member.pointsEarned} pts)`}
                  />
                ))}
                {problem.team.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{problem.team.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Solutions (for completed projects) */}
        {problem.status === "completed" && problem.solutions.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="font-medium text-green-900">
                    Solution Delivered
                  </h4>
                </div>
                <p className="text-sm text-green-700">
                  {problem.solutions[0].title}
                </p>
                {problem.solutions[0].votes > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {problem.solutions[0].votes} votes
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                {problem.solutions[0].githubUrl && (
                  <a
                    href={problem.solutions[0].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4 text-green-600" />
                  </a>
                )}
                {problem.solutions[0].liveUrl && (
                  <a
                    href={problem.solutions[0].liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>{problem.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{problem.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{problem.applications} applied</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs">
              {formatDistanceToNow(new Date(problem.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onView(problem)}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            View Details
          </button>

          {totalTasks > 0 && (
            <button
              onClick={() => onViewTasks(problem)}
              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
            >
              <Code className="w-4 h-4" />
              <span>Tasks ({availableTasks})</span>
            </button>
          )}

          {problem.status === "looking-for-team" && (
            <button
              onClick={() => onJoin(problem)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Join Team
            </button>
          )}

          {problem.status === "in-progress" && (
            <button
              onClick={() => onView(problem)}
              className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
            >
              View Progress
            </button>
          )}

          {problem.status === "completed" && (
            <button
              onClick={() => onView(problem)}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              View Results
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
