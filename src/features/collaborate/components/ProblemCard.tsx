import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Target,
  Award,
  ExternalLink,
  Github,
} from "lucide-react";
import { Problem } from "../types/problems";
import { formatDistanceToNow } from "date-fns";

interface ProblemCardProps {
  problem: Problem;
  onView: (problem: Problem) => void;
  onJoin: (problem: Problem) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onView,
  onJoin,
}) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "looking-for-team":
        return "Looking for Team";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={problem.owner.avatar}
              alt={problem.owner.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {problem.owner.name}
                </h4>
                {problem.owner.verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Award className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {problem.owner.profession}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(problem.status)}`}
          >
            {getStatusText(problem.status)}
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
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
          <p className="text-sm text-purple-700">{problem.impact}</p>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
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

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(problem.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{problem.team.length} members</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">{problem.timeline}</p>
            <p className="text-xs">Timeline</p>
          </div>
        </div>

        {/* Team Avatars */}
        {problem.team.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Team:</span>
              <div className="flex -space-x-2">
                {problem.team.slice(0, 4).map((member) => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    title={`${member.name} - ${member.role}`}
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
                <h4 className="font-medium text-green-900">
                  Solution Delivered
                </h4>
                <p className="text-sm text-green-700">
                  {problem.solutions[0].title}
                </p>
              </div>
              <div className="flex space-x-2">
                {problem.solutions[0].githubUrl && (
                  <a
                    href={problem.solutions[0].githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
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
                  >
                    <ExternalLink className="w-4 h-4 text-green-600" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => onView(problem)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            View Details
          </button>
          {problem.status === "looking-for-team" && (
            <button
              onClick={() => onJoin(problem)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Join Team
            </button>
          )}
          {problem.status === "in-progress" && (
            <button
              onClick={() => onView(problem)}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              View Progress
            </button>
          )}
          {problem.status === "completed" && (
            <button
              onClick={() => onView(problem)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Results
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
