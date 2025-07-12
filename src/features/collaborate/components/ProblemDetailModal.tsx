import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Users,
  Target,
  Award,
  ExternalLink,
  Github,
  Clock,
  DollarSign,
} from "lucide-react";
import { Problem } from "../types/problems";
import { formatDistanceToNow } from "date-fns";

interface ProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onJoin: (problem: Problem) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  isOpen,
  onClose,
  problem,
  onJoin,
}) => {
  if (!problem) return null;

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

  const getProgressPercentage = () => {
    if (problem.status === "completed") return 100;
    if (problem.status === "looking-for-team") return 0;
    return Math.min((problem.progress.length / 5) * 100, 90); // Max 90% for in-progress
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={problem.owner.avatar}
                    alt={problem.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {problem.owner.name}
                      </h3>
                      {problem.owner.verified && (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{problem.owner.profession}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Posted{" "}
                          {formatDistanceToNow(new Date(problem.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(problem.status)}`}
                      >
                        {getStatusText(problem.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {problem.title}
                </h1>
                <p className="text-gray-700 leading-relaxed">
                  {problem.description}
                </p>
              </div>

              {/* Impact */}
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Expected Impact
                  </span>
                </div>
                <p className="text-purple-700">{problem.impact}</p>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Timeline</span>
                  </div>
                  <p className="text-gray-700">
                    {problem.timeline || "Not specified"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Team Size</span>
                  </div>
                  <p className="text-gray-700">{problem.team.length} members</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Budget</span>
                  </div>
                  <p className="text-gray-700">
                    {problem.budget || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {problem.status !== "looking-for-team" && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      Project Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Technical Requirements
                </h3>
                <div className="space-y-2">
                  {problem.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              {problem.team.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Current Team
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {problem.team.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {member.name}
                          </h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {member.role}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.skills.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Timeline */}
              {problem.progress.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Progress Timeline
                  </h3>
                  <div className="space-y-4">
                    {problem.progress.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {milestone.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {milestone.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed by {milestone.completedBy} •{" "}
                            {formatDistanceToNow(
                              new Date(milestone.completedAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solutions */}
              {problem.solutions.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Solutions</h3>
                  <div className="space-y-4">
                    {problem.solutions.map((solution) => (
                      <div
                        key={solution.id}
                        className="p-4 bg-green-50 rounded-lg border border-green-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-green-900">
                            {solution.title}
                          </h4>
                          <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                            {solution.type}
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mb-3">
                          {solution.description}
                        </p>
                        <div className="flex items-center space-x-3">
                          {solution.githubUrl && (
                            <a
                              href={solution.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              <span className="text-sm">View Code</span>
                            </a>
                          )}
                          {solution.liveUrl && (
                            <a
                              href={solution.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {problem.status === "looking-for-team" && (
                  <button
                    onClick={() => onJoin(problem)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join Team
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
