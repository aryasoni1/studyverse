import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Star, Users, Zap } from "lucide-react";
import { Problem } from "../types/problems";

interface SkillMatcherProps {
  problems: Problem[];
  userSkills?: string[];
}

export const SkillMatcher: React.FC<SkillMatcherProps> = ({
  problems,
  userSkills = [],
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills);

  // Extract all skills from problems
  const allSkills = Array.from(
    new Set(problems.flatMap((p) => p.skillsNeeded.map((s) => s.skill)))
  );

  // Calculate skill match percentage
  const calculateMatch = (problem: Problem): number => {
    if (selectedSkills.length === 0) return 0;

    const requiredSkills = problem.skillsNeeded
      .filter((s) => s.required)
      .map((s) => s.skill);
    const optionalSkills = problem.skillsNeeded
      .filter((s) => !s.required)
      .map((s) => s.skill);

    const requiredMatches = requiredSkills.filter((skill) =>
      selectedSkills.includes(skill)
    ).length;
    const optionalMatches = optionalSkills.filter((skill) =>
      selectedSkills.includes(skill)
    ).length;

    const requiredScore =
      requiredSkills.length > 0
        ? (requiredMatches / requiredSkills.length) * 70
        : 70;
    const optionalScore =
      optionalSkills.length > 0
        ? (optionalMatches / optionalSkills.length) * 30
        : 30;

    return Math.round(requiredScore + optionalScore);
  };

  // Get recommended problems based on skill match
  const getRecommendedProblems = () => {
    return problems
      .filter((p) => p.status === "looking-for-team")
      .map((p) => ({ ...p, matchScore: calculateMatch(p) }))
      .filter((p) => p.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const recommendedProblems = getRecommendedProblems();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Target className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Smart Project Matcher
        </h3>
      </div>

      {/* Skill Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Select Your Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {allSkills.slice(0, 15).map((skill) => (
            <motion.button
              key={skill}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSkills.includes(skill)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {skill}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recommended Projects */}
      {selectedSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Recommended Projects ({recommendedProblems.length})
          </h4>

          {recommendedProblems.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No matching projects found</p>
              <p className="text-sm text-gray-400">
                Try selecting different skills
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendedProblems.map((problem) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-gray-900 line-clamp-1">
                      {problem.title}
                    </h5>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {problem.matchScore}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {problem.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{problem.team.length} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span className="capitalize">{problem.difficulty}</span>
                      </div>
                    </div>

                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        problem.matchScore >= 80
                          ? "bg-green-100 text-green-800"
                          : problem.matchScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {problem.matchScore >= 80
                        ? "Perfect Match"
                        : problem.matchScore >= 60
                          ? "Good Match"
                          : "Potential Match"}
                    </div>
                  </div>

                  {/* Required Skills */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {problem.skillsNeeded.slice(0, 4).map((skillReq) => (
                        <span
                          key={skillReq.skill}
                          className={`px-2 py-1 rounded text-xs ${
                            selectedSkills.includes(skillReq.skill)
                              ? "bg-purple-100 text-purple-800"
                              : skillReq.required
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {skillReq.skill}
                          {skillReq.required &&
                            !selectedSkills.includes(skillReq.skill) &&
                            " *"}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSkills.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">
            Select your skills to get personalized project recommendations
          </p>
          <p className="text-sm text-gray-400">
            We'll match you with projects that fit your expertise
          </p>
        </div>
      )}
    </div>
  );
};
