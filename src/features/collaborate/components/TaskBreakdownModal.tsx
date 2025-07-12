import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Code,
  Palette,
  Search,
  FileText,
  TestTube,
  Rocket,
  TrendingUp,
  Star,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { Problem, Task, TaskSubmission } from "../types/problems";
import { formatDistanceToNow } from "date-fns";

interface TaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onClaimTask: (taskId: string) => void;
  onSubmitWork: (
    taskId: string,
    submission: Omit<TaskSubmission, "id" | "submittedAt" | "status">
  ) => void;
}

const categoryIcons = {
  frontend: Code,
  backend: Code,
  design: Palette,
  research: Search,
  testing: TestTube,
  documentation: FileText,
  deployment: Rocket,
  marketing: TrendingUp,
};

const categoryColors = {
  frontend: "bg-blue-100 text-blue-800 border-blue-200",
  backend: "bg-green-100 text-green-800 border-green-200",
  design: "bg-purple-100 text-purple-800 border-purple-200",
  research: "bg-orange-100 text-orange-800 border-orange-200",
  testing: "bg-red-100 text-red-800 border-red-200",
  documentation: "bg-gray-100 text-gray-800 border-gray-200",
  deployment: "bg-yellow-100 text-yellow-800 border-yellow-200",
  marketing: "bg-pink-100 text-pink-800 border-pink-200",
};

export const TaskBreakdownModal: React.FC<TaskBreakdownModalProps> = ({
  isOpen,
  onClose,
  problem,
  onClaimTask,
  onSubmitWork,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    description: "",
    githubUrl: "",
    liveUrl: "",
    files: [] as string[],
  });

  if (!problem) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200";
      case "claimed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600";
      case "intermediate":
        return "text-yellow-600";
      case "advanced":
        return "text-orange-600";
      case "expert":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleClaimTask = (taskId: string) => {
    onClaimTask(taskId);
    setSelectedTask(null);
  };

  const handleSubmitWork = () => {
    if (!selectedTask || !submissionData.description) return;

    onSubmitWork(selectedTask.id, {
      description: submissionData.description,
      files: submissionData.files,
      githubUrl: submissionData.githubUrl || undefined,
      liveUrl: submissionData.liveUrl || undefined,
      feedback: [],
    });

    setShowSubmissionForm(false);
    setSubmissionData({
      description: "",
      githubUrl: "",
      liveUrl: "",
      files: [],
    });
    setSelectedTask(null);
  };

  const tasksByCategory = problem.tasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) acc[task.category] = [];
      acc[task.category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  const completedTasks = problem.tasks.filter(
    (t) => t.status === "completed"
  ).length;
  const totalTasks = problem.tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      AI Task Breakdown
                    </h2>
                    {problem.aiGenerated && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        AI Generated
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {problem.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Overall Progress: {completedTasks}/{totalTasks} tasks
                        completed
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1 }}
                      />
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
            </div>

            {/* Content */}
            <div className="flex h-[calc(90vh-120px)]">
              {/* Task List */}
              <div className="flex-1 overflow-y-auto p-6">
                {Object.entries(tasksByCategory).map(([category, tasks]) => {
                  const CategoryIcon =
                    categoryIcons[category as keyof typeof categoryIcons];
                  return (
                    <div key={category} className="mb-8">
                      <div className="flex items-center space-x-2 mb-4">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-900 capitalize">
                          {category} ({tasks.length})
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <motion.div
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedTask?.id === task.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900 flex-1">
                                {task.title}
                              </h5>
                              <div className="flex items-center space-x-2 ml-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}
                                >
                                  {task.status.replace("-", " ")}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[task.category]}`}
                                >
                                  {category}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {task.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{task.estimatedHours}h</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3" />
                                  <span
                                    className={getDifficultyColor(
                                      task.difficulty
                                    )}
                                  >
                                    {task.difficulty}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="w-3 h-3" />
                                  <span>{task.points} pts</span>
                                </div>
                              </div>

                              {task.assignedTo && (
                                <div className="flex items-center space-x-1">
                                  <img
                                    src={task.assignedTo.avatar}
                                    alt={task.assignedTo.name}
                                    className="w-4 h-4 rounded-full"
                                  />
                                  <span>{task.assignedTo.name}</span>
                                </div>
                              )}
                            </div>

                            {/* Skills Required */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {task.skillsRequired.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {task.skillsRequired.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                                  +{task.skillsRequired.length - 3}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Task Detail Panel */}
              {selectedTask && (
                <div className="w-96 border-l border-gray-200 bg-gray-50 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Task Details
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTask.status)}`}
                      >
                        {selectedTask.status.replace("-", " ")}
                      </span>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-2">
                      {selectedTask.title}
                    </h4>
                    <p className="text-gray-700 mb-4">
                      {selectedTask.description}
                    </p>

                    {/* Task Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Duration</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedTask.estimatedHours}h
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Points</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedTask.points}
                        </p>
                      </div>
                    </div>

                    {/* Skills Required */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Skills Required
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.skillsRequired.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Deliverables
                      </h5>
                      <ul className="space-y-1">
                        {selectedTask.deliverables.map((deliverable, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Acceptance Criteria */}
                    <div className="mb-6">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Acceptance Criteria
                      </h5>
                      <ul className="space-y-1">
                        {selectedTask.acceptanceCriteria.map(
                          (criteria, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-sm text-gray-700"
                            >
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                              <span>{criteria}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Dependencies */}
                    {selectedTask.dependencies.length > 0 && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Dependencies
                        </h5>
                        <div className="space-y-2">
                          {selectedTask.dependencies.map((depId) => {
                            const depTask = problem.tasks.find(
                              (t) => t.id === depId
                            );
                            return depTask ? (
                              <div
                                key={depId}
                                className="flex items-center space-x-2 text-sm"
                              >
                                <GitBranch className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">
                                  {depTask.title}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(depTask.status)}`}
                                >
                                  {depTask.status}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Assigned User */}
                    {selectedTask.assignedTo && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Assigned To
                        </h5>
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <img
                            src={selectedTask.assignedTo.avatar}
                            alt={selectedTask.assignedTo.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {selectedTask.assignedTo.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Claimed{" "}
                              {formatDistanceToNow(
                                new Date(selectedTask.assignedTo.claimedAt),
                                { addSuffix: true }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submitted Work */}
                    {selectedTask.submittedWork && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-900 mb-2">
                          Submitted Work
                        </h5>
                        <div className="bg-white p-4 rounded-lg border">
                          <p className="text-sm text-gray-700 mb-3">
                            {selectedTask.submittedWork.description}
                          </p>
                          <div className="flex space-x-2">
                            {selectedTask.submittedWork.githubUrl && (
                              <a
                                href={selectedTask.submittedWork.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                              >
                                <GitBranch className="w-4 h-4" />
                                <span>Code</span>
                              </a>
                            )}
                            {selectedTask.submittedWork.liveUrl && (
                              <a
                                href={selectedTask.submittedWork.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Demo</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {selectedTask.status === "open" && (
                        <button
                          onClick={() => handleClaimTask(selectedTask.id)}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Claim This Task
                        </button>
                      )}

                      {selectedTask.status === "claimed" &&
                        selectedTask.assignedTo?.id === "current-user" && (
                          <button
                            onClick={() => setShowSubmissionForm(true)}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Submit Work
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Form Modal */}
            <AnimatePresence>
              {showSubmissionForm && selectedTask && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Submit Your Work
                      </h3>
                      <button
                        onClick={() => setShowSubmissionForm(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          value={submissionData.description}
                          onChange={(e) =>
                            setSubmissionData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe what you've built and how it meets the requirements..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={submissionData.githubUrl}
                          onChange={(e) =>
                            setSubmissionData((prev) => ({
                              ...prev,
                              githubUrl: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://github.com/username/repo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Live Demo URL
                        </label>
                        <input
                          type="url"
                          value={submissionData.liveUrl}
                          onChange={(e) =>
                            setSubmissionData((prev) => ({
                              ...prev,
                              liveUrl: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://your-demo.com"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          onClick={() => setShowSubmissionForm(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmitWork}
                          disabled={!submissionData.description}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Work
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
