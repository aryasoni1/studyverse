import { motion } from "framer-motion";
import { X, Filter } from "lucide-react";
import { ProblemFilters } from "../types/problems";

interface TagFilterProps {
  filters: ProblemFilters;
  onFiltersChange: (filters: ProblemFilters) => void;
}

const domains = [
  "Healthcare",
  "Education",
  "Business",
  "Technology",
  "Environment",
  "Finance",
];
const statuses = ["looking-for-team", "in-progress", "completed"];
const popularTags = [
  "Mobile App",
  "Web Platform",
  "AI/ML",
  "Data Analytics",
  "API",
  "UI/UX",
  "Database",
];

export const TagFilter: React.FC<TagFilterProps> = ({
  filters,
  onFiltersChange,
}) => {
  const toggleDomain = (domain: string) => {
    const newDomains = filters.domain.includes(domain)
      ? filters.domain.filter((d) => d !== domain)
      : [...filters.domain, domain];
    onFiltersChange({ ...filters, domain: newDomains });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      domain: [],
      tags: [],
      status: [],
      timeline: "",
      difficulty: [],
      priority: [],
      remoteOnly: false,
      mentorshipAvailable: false,
      featured: false,
    });
  };

  const hasActiveFilters =
    filters.domain.length > 0 ||
    filters.tags.length > 0 ||
    filters.status.length > 0;

  const getStatusLabel = (status: string) => {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Domain Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Domain</h4>
        <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <motion.button
              key={domain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDomain(domain)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.domain.includes(domain)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {domain}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.status.includes(status)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {getStatusLabel(status)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.tags.includes(tag)
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {filters.domain.map((domain) => (
              <span
                key={domain}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center space-x-1"
              >
                <span>{domain}</span>
                <button
                  onClick={() => toggleDomain(domain)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.status.map((status) => (
              <span
                key={status}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs flex items-center space-x-1"
              >
                <span>{getStatusLabel(status)}</span>
                <button
                  onClick={() => toggleStatus(status)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs flex items-center space-x-1"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:bg-teal-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
