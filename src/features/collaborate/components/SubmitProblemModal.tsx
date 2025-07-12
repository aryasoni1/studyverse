import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { Problem } from "../types/problems";
import { AITaskGenerator } from "./AITaskGenerator";
import type { TaskPriority, TaskDifficulty } from "../types/problems";

interface SubmitProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    problemData: Omit<
      Problem,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "team"
      | "solutions"
      | "progress"
      | "likes"
      | "views"
      | "applications"
      | "tasks"
      | "aiGenerated"
    >
  ) => void;
}

const domains = [
  "Healthcare",
  "Education",
  "Business",
  "Technology",
  "Environment",
  "Finance",
];
const suggestedTags = [
  "Mobile App",
  "Web Platform",
  "AI/ML",
  "Data Analytics",
  "API",
  "UI/UX",
  "Database",
  "IoT",
  "Blockchain",
];

export const SubmitProblemModal: React.FC<SubmitProblemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    impact: string;
    domain: string;
    tags: string[];
    requirements: string[];
    timeline: string;
    budget: string;
    priority: TaskPriority;
    difficulty: TaskDifficulty;
    owner: {
      id: string;
      name: string;
      avatar: string;
      profession: string;
      verified: boolean;
      rating: number;
      completedProjects: number;
    };
  }>({
    title: "",
    description: "",
    impact: "",
    domain: "",
    tags: [],
    requirements: [""],
    timeline: "",
    budget: "",
    priority: "medium",
    difficulty: "intermediate",
    owner: {
      id: "current-user",
      name: "Current User",
      avatar:
        "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      profession: "",
      verified: false,
      rating: 4.5,
      completedProjects: 0,
    },
  });
  const [customTag, setCustomTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.domain ||
      !formData.owner.profession
    ) {
      return;
    }

    const problemData = {
      ...formData,
      status: "looking-for-team" as const,
      requirements: formData.requirements.filter((req) => req.trim() !== ""),
      mediaUrls: [],
      featured: false,
      mentorshipAvailable: false,
      remoteOnly: false,
      skillsNeeded: [],
    };

    onSubmit(problemData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      title: "",
      description: "",
      impact: "",
      domain: "",
      tags: [],
      requirements: [""],
      timeline: "",
      budget: "",
      priority: "medium",
      difficulty: "intermediate",
      owner: {
        id: "current-user",
        name: "Current User",
        avatar:
          "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        profession: "",
        verified: false,
        rating: 4.5,
        completedProjects: 0,
      },
    });
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToStep2 =
    formData.title &&
    formData.description &&
    formData.domain &&
    formData.owner.profession;
  const canProceedToStep3 = formData.impact;

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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Submit Your Problem
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step === currentStep
                            ? "bg-blue-600 text-white"
                            : step < currentStep
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Problem Title *
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Post-Surgery Medication Tracking App"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Profession *
                        </label>
                        <input
                          type="text"
                          value={formData.owner.profession}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              owner: {
                                ...prev.owner,
                                profession: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Orthopedic Surgeon"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain *
                        </label>
                        <select
                          value={formData.domain}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              domain: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select a domain</option>
                          {domains.map((domain) => (
                            <option key={domain} value={domain}>
                              {domain}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Problem Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the problem you need solved in detail..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Level
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              priority: e.target.value as TaskPriority,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level
                        </label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              difficulty: e.target.value as TaskDifficulty,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Impact & Details */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expected Impact *
                      </label>
                      <textarea
                        value={formData.impact}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            impact: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="What positive impact will this solution have? Include metrics if possible..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {suggestedTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              disabled={formData.tags.includes(tag)}
                              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                formData.tags.includes(tag)
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="Add custom tag"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addCustomTag())
                            }
                          />
                          <button
                            type="button"
                            onClick={addCustomTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                              >
                                <span>#{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:bg-blue-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeline
                        </label>
                        <select
                          value={formData.timeline}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              timeline: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select timeline</option>
                          <option value="1 month">1 month</option>
                          <option value="2 months">2 months</option>
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="1 year">1 year</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              budget: e.target.value,
                            }))
                          }
                          placeholder="e.g., $2,000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Requirements & AI Tasks */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technical Requirements
                      </label>
                      <div className="space-y-2">
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) =>
                                updateRequirement(index, e.target.value)
                              }
                              placeholder="e.g., React Native, HIPAA Compliance"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formData.requirements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addRequirement}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Requirement</span>
                        </button>
                      </div>
                    </div>

                    {/* AI Task Generator */}
                    {formData.description && formData.domain && (
                      <AITaskGenerator
                        domain={formData.domain}
                        onTasksGenerated={() => {}}
                      />
                    )}
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={
                          (currentStep === 1 && !canProceedToStep2) ||
                          (currentStep === 2 && !canProceedToStep3)
                        }
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Problem
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
