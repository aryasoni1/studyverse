import { motion } from "framer-motion";
import {
  Trophy,
  ExternalLink,
  Github,
  Users,
  Calendar,
  Star,
} from "lucide-react";
import { Problem } from "../types/problems";
import { formatDistanceToNow } from "date-fns";

interface ProjectShowcaseProps {
  projects: Problem[];
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
}) => {
  const completedProjects = projects.filter((p) => p.status === "completed");
  const featuredProjects = completedProjects.filter((p) => p.featured);

  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <h2 className="text-4xl font-bold text-white">Project Showcase</h2>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Celebrating successful collaborations that turned real-world
            problems into innovative solutions
          </p>
        </motion.div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {project.solutions[0]?.mediaUrls?.[0] ? (
                    <img
                      src={project.solutions[0].mediaUrls[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Trophy className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Domain & Impact */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                      {project.domain}
                    </span>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {project.impact}
                    </p>
                  </div>

                  {/* Team Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {project.team.length + 1} members
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex items-center space-x-2 mb-4">
                    <img
                      src={project.owner.avatar}
                      alt={project.owner.name}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      title={`${project.owner.name} - Project Owner`}
                    />
                    {project.team.slice(0, 3).map((member) => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                        title={`${member.name} - ${member.role}`}
                      />
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +{project.team.length - 3}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Solution Links */}
                  {project.solutions.length > 0 && (
                    <div className="flex space-x-2">
                      {project.solutions[0].githubUrl && (
                        <a
                          href={project.solutions[0].githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          <span>Code</span>
                        </a>
                      )}
                      {project.solutions[0].liveUrl && (
                        <a
                          href={project.solutions[0].liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Demo</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
            <p className="text-white text-lg">
              No featured projects yet. Be the first to complete a project!
            </p>
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {completedProjects.length}
            </div>
            <div className="text-blue-100">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {projects.reduce((acc, p) => acc + p.team.length, 0)}
            </div>
            <div className="text-blue-100">Active Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {projects.reduce((acc, p) => acc + p.likes, 0)}
            </div>
            <div className="text-blue-100">Community Likes</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
