import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MapPin, Star } from "lucide-react";
import { ProblemFilters } from "../types/problems";

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProblemFilters;
  onFiltersChange: (filters: ProblemFilters) => void;
  onSearch: (query: string) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onSearch(searchQuery);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: ProblemFilters = {
      domain: [],
      tags: [],
      status: [],
      timeline: "",
      difficulty: [],
      priority: [],
      remoteOnly: false,
      mentorshipAvailable: false,
      featured: false,
    };
    setLocalFilters(resetFilters);
    setSearchQuery("");
  };

  const domains = [
    "Healthcare",
    "Education",
    "Business",
    "Technology",
    "Environment",
    "Finance",
  ];
  const difficulties = ["beginner", "intermediate", "advanced", "expert"];
  const priorities = ["low", "medium", "high", "urgent"];
  const statuses = ["looking-for-team", "in-progress", "completed"];
  const timelines = ["1 month", "2 months", "3 months", "6 months", "1 year"];

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
                <div className="flex items-center space-x-2">
                  <Search className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Advanced Search
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Keywords
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problems, skills, or descriptions..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Domain Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Domain
                  </label>
                  <div className="space-y-2">
                    {domains.map((domain) => (
                      <label key={domain} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.domain.includes(domain)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocalFilters((prev) => ({
                                ...prev,
                                domain: [...prev.domain, domain],
                              }));
                            } else {
                              setLocalFilters((prev) => ({
                                ...prev,
                                domain: prev.domain.filter((d) => d !== domain),
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {domain}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Status
                  </label>
                  <div className="space-y-2">
                    {statuses.map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.status.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocalFilters((prev) => ({
                                ...prev,
                                status: [...prev.status, status],
                              }));
                            } else {
                              setLocalFilters((prev) => ({
                                ...prev,
                                status: prev.status.filter((s) => s !== status),
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status.replace("-", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <label key={difficulty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.difficulty.includes(difficulty)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocalFilters((prev) => ({
                                ...prev,
                                difficulty: [...prev.difficulty, difficulty],
                              }));
                            } else {
                              setLocalFilters((prev) => ({
                                ...prev,
                                difficulty: prev.difficulty.filter(
                                  (d) => d !== difficulty
                                ),
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {difficulty}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level
                  </label>
                  <div className="space-y-2">
                    {priorities.map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.priority.includes(priority)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLocalFilters((prev) => ({
                                ...prev,
                                priority: [...prev.priority, priority],
                              }));
                            } else {
                              setLocalFilters((prev) => ({
                                ...prev,
                                priority: prev.priority.filter(
                                  (p) => p !== priority
                                ),
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline Filter */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  value={localFilters.timeline}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      timeline: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any timeline</option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Filters */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Special Filters
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.remoteOnly}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          remoteOnly: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <MapPin className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Remote work only
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.mentorshipAvailable}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          mentorshipAvailable: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Star className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Mentorship available
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={localFilters.featured}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Star className="w-4 h-4 ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Featured projects only
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset All
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
