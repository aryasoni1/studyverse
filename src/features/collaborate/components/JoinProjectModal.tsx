import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code, Palette, Search, Users, Megaphone } from "lucide-react";
import { Problem, TeamMember } from "../types/problems";

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (member: TeamMember) => void;
  problem: Problem | null;
}

const roles = [
  {
    id: "developer",
    name: "Developer",
    icon: Code,
    description: "Build the technical solution",
  },
  {
    id: "designer",
    name: "Designer",
    icon: Palette,
    description: "Create user interface and experience",
  },
  {
    id: "researcher",
    name: "Researcher",
    icon: Search,
    description: "Conduct user research and analysis",
  },
  {
    id: "pm",
    name: "Project Manager",
    icon: Users,
    description: "Coordinate team and project timeline",
  },
  {
    id: "marketer",
    name: "Marketer",
    icon: Megaphone,
    description: "Develop marketing and growth strategy",
  },
];

export const JoinProjectModal: React.FC<JoinProjectModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  problem,
}) => {
  const [formData, setFormData] = useState({
    role: "",
    skills: "",
    motivation: "",
    experience: "",
    availability: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !formData.skills || !formData.motivation) {
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: "Current User", // In real app, get from auth
      avatar:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      role: formData.role as TeamMember["role"],
      skills: formData.skills.split(",").map((s) => s.trim()),
      joinedAt: new Date().toISOString(),
      contribution: formData.motivation,
      hoursCommitted: 0,
      rating: 0,
      status: "active",
      tasksCompleted: 0,
      pointsEarned: 0,
    };

    onJoin(member);
    onClose();

    // Reset form
    setFormData({
      role: "",
      skills: "",
      motivation: "",
      experience: "",
      availability: "",
    });
  };

  const selectedRole = roles.find((role) => role.id === formData.role);

  return (
    <AnimatePresence>
      {isOpen && problem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Join Project Team
                  </h2>
                  <p className="text-gray-600 mt-1">{problem.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Your Role *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <motion.div
                          key={role.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.role === role.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, role: role.id }))
                          }
                        >
                          <div className="flex items-center space-x-3">
                            <Icon
                              className={`w-6 h-6 ${
                                formData.role === role.id
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            />
                            <div>
                              <h3
                                className={`font-medium ${
                                  formData.role === role.id
                                    ? "text-blue-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {role.name}
                              </h3>
                              <p
                                className={`text-sm ${
                                  formData.role === role.id
                                    ? "text-blue-700"
                                    : "text-gray-600"
                                }`}
                              >
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Skills *
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        skills: e.target.value,
                      }))
                    }
                    placeholder="e.g., React, Node.js, PostgreSQL (separate with commas)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    List your skills separated by commas
                  </p>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to join this project? *
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        motivation: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your motivation and how you can contribute..."
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your relevant experience or similar projects..."
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your availability</option>
                    <option value="5-10 hours/week">5-10 hours/week</option>
                    <option value="10-20 hours/week">10-20 hours/week</option>
                    <option value="20+ hours/week">20+ hours/week</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>

                {/* Project Requirements Match */}
                {selectedRole && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Project Requirements
                    </h4>
                    <div className="space-y-2">
                      {problem.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join Team
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
