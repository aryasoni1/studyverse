import React, { useState } from "react";
import {
  Zap,
  Loader,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Task } from "../types/problems";

interface AITaskGeneratorProps {
  domain: string;
  onTasksGenerated: (tasks: Task[]) => void;
}

export const AITaskGenerator: React.FC<AITaskGeneratorProps> = ({
  domain,
  onTasksGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<Task[]>([]);

  const generateTasks = async () => {
    setIsGenerating(true);

    // Simulate AI task generation based on problem description and domain
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const tasks = generateTasksBasedOnDomain(domain);
    setGeneratedTasks(tasks);
    setIsGenerating(false);
    onTasksGenerated(tasks);
  };

  const generateTasksBasedOnDomain = (domain: string): Task[] => {
    const baseId = Date.now();

    // AI-like task generation based on domain and description
    const commonTasks: Partial<Task>[] = [
      {
        title: "Project Setup & Architecture Planning",
        description:
          "Set up the project structure, choose technology stack, and create development environment",
        category: "backend",
        difficulty: "intermediate",
        estimatedHours: 8,
        skillsRequired: ["Project Management", "System Architecture"],
        priority: "high",
        deliverables: [
          "Project repository",
          "Architecture document",
          "Development setup guide",
        ],
        acceptanceCriteria: [
          "Repository is created and accessible",
          "Tech stack is documented",
          "Local development environment works",
        ],
        points: 100,
      },
      {
        title: "UI/UX Design & Wireframes",
        description:
          "Create user interface designs, wireframes, and user experience flow",
        category: "design",
        difficulty: "intermediate",
        estimatedHours: 12,
        skillsRequired: ["UI/UX Design", "Figma", "User Research"],
        priority: "high",
        deliverables: ["Wireframes", "High-fidelity designs", "Design system"],
        acceptanceCriteria: [
          "All screens are designed",
          "User flow is clear",
          "Design is responsive",
        ],
        points: 150,
      },
    ];

    // Domain-specific tasks
    let domainTasks: Partial<Task>[] = [];

    if (domain === "Healthcare") {
      domainTasks = [
        {
          title: "HIPAA Compliance Implementation",
          description:
            "Implement security measures and data protection to ensure HIPAA compliance",
          category: "backend",
          difficulty: "advanced",
          estimatedHours: 16,
          skillsRequired: ["Security", "HIPAA", "Data Encryption"],
          priority: "critical",
          deliverables: [
            "Security audit report",
            "Encryption implementation",
            "Privacy policy",
          ],
          acceptanceCriteria: [
            "Data is encrypted at rest and in transit",
            "Access controls are implemented",
            "Audit logs are maintained",
          ],
          points: 200,
        },
        {
          title: "Medical Data Integration",
          description: "Integrate with medical databases and healthcare APIs",
          category: "backend",
          difficulty: "advanced",
          estimatedHours: 20,
          skillsRequired: [
            "API Integration",
            "Healthcare Standards",
            "Database Design",
          ],
          priority: "high",
          deliverables: [
            "API integration",
            "Data mapping",
            "Integration tests",
          ],
          acceptanceCriteria: [
            "APIs are successfully integrated",
            "Data flows correctly",
            "Error handling is robust",
          ],
          points: 180,
        },
      ];
    } else if (domain === "Education") {
      domainTasks = [
        {
          title: "Learning Management System Integration",
          description:
            "Integrate with existing LMS platforms and educational tools",
          category: "backend",
          difficulty: "intermediate",
          estimatedHours: 14,
          skillsRequired: [
            "LMS APIs",
            "Educational Standards",
            "Data Synchronization",
          ],
          priority: "medium",
          deliverables: [
            "LMS integration",
            "Grade sync functionality",
            "User authentication",
          ],
          acceptanceCriteria: [
            "LMS data syncs correctly",
            "Grades are updated in real-time",
            "Single sign-on works",
          ],
          points: 140,
        },
        {
          title: "Student Progress Analytics",
          description:
            "Build analytics dashboard to track student progress and performance",
          category: "frontend",
          difficulty: "intermediate",
          estimatedHours: 18,
          skillsRequired: ["Data Visualization", "Analytics", "React/Vue"],
          priority: "medium",
          deliverables: [
            "Analytics dashboard",
            "Progress charts",
            "Performance reports",
          ],
          acceptanceCriteria: [
            "Dashboard shows real-time data",
            "Charts are interactive",
            "Reports can be exported",
          ],
          points: 160,
        },
      ];
    } else if (domain === "Technology") {
      domainTasks = [
        {
          title: "API Development & Documentation",
          description: "Build RESTful APIs with comprehensive documentation",
          category: "backend",
          difficulty: "intermediate",
          estimatedHours: 16,
          skillsRequired: ["REST APIs", "OpenAPI", "Node.js/Python"],
          priority: "high",
          deliverables: [
            "API endpoints",
            "API documentation",
            "Postman collection",
          ],
          acceptanceCriteria: [
            "All endpoints are functional",
            "Documentation is complete",
            "APIs follow REST standards",
          ],
          points: 150,
        },
        {
          title: "Database Design & Implementation",
          description: "Design and implement scalable database schema",
          category: "backend",
          difficulty: "advanced",
          estimatedHours: 12,
          skillsRequired: [
            "Database Design",
            "SQL",
            "Performance Optimization",
          ],
          priority: "high",
          deliverables: [
            "Database schema",
            "Migration scripts",
            "Performance benchmarks",
          ],
          acceptanceCriteria: [
            "Schema supports all features",
            "Queries are optimized",
            "Data integrity is maintained",
          ],
          points: 140,
        },
      ];
    }

    const additionalTasks: Partial<Task>[] = [
      {
        title: "Frontend Development",
        description: "Implement the user interface based on designs",
        category: "frontend",
        difficulty: "intermediate",
        estimatedHours: 24,
        skillsRequired: ["React/Vue/Angular", "CSS", "JavaScript"],
        priority: "high",
        deliverables: [
          "Responsive web application",
          "Component library",
          "Cross-browser compatibility",
        ],
        acceptanceCriteria: [
          "UI matches designs",
          "Application is responsive",
          "Works on all major browsers",
        ],
        points: 200,
      },
      {
        title: "Testing & Quality Assurance",
        description: "Write comprehensive tests and perform quality assurance",
        category: "testing",
        difficulty: "intermediate",
        estimatedHours: 16,
        skillsRequired: ["Testing Frameworks", "QA", "Automation"],
        priority: "medium",
        deliverables: ["Unit tests", "Integration tests", "Test reports"],
        acceptanceCriteria: [
          "Code coverage > 80%",
          "All tests pass",
          "Critical bugs are fixed",
        ],
        points: 120,
      },
      {
        title: "Deployment & DevOps",
        description: "Set up deployment pipeline and production environment",
        category: "deployment",
        difficulty: "advanced",
        estimatedHours: 10,
        skillsRequired: ["DevOps", "CI/CD", "Cloud Platforms"],
        priority: "medium",
        deliverables: [
          "Deployment pipeline",
          "Production environment",
          "Monitoring setup",
        ],
        acceptanceCriteria: [
          "Automated deployment works",
          "Application is live",
          "Monitoring is active",
        ],
        points: 130,
      },
      {
        title: "Documentation & User Guide",
        description: "Create comprehensive documentation and user guides",
        category: "documentation",
        difficulty: "beginner",
        estimatedHours: 8,
        skillsRequired: ["Technical Writing", "Documentation Tools"],
        priority: "low",
        deliverables: [
          "User manual",
          "Developer documentation",
          "Video tutorials",
        ],
        acceptanceCriteria: [
          "Documentation is complete",
          "Instructions are clear",
          "Examples are provided",
        ],
        points: 80,
      },
    ];

    const allTasks = [...commonTasks, ...domainTasks, ...additionalTasks];

    return allTasks.map((task, index) => ({
      id: `${baseId + index}`,
      title: task.title!,
      description: task.description!,
      category: task.category!,
      difficulty: task.difficulty!,
      estimatedHours: task.estimatedHours!,
      skillsRequired: task.skillsRequired!,
      dependencies: index > 0 ? [`${baseId + index - 1}`] : [],
      status: "open" as const,
      priority: task.priority!,
      deliverables: task.deliverables!,
      acceptanceCriteria: task.acceptanceCriteria!,
      createdAt: new Date().toISOString(),
      points: task.points!,
    }));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          AI Task Breakdown
        </h3>
      </div>

      <p className="text-gray-600 mb-4">
        Let our AI analyze your problem and automatically break it down into
        manageable tasks with clear deliverables and skill requirements.
      </p>

      {!isGenerating && generatedTasks.length === 0 && (
        <button
          onClick={generateTasks}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Generate Tasks with AI</span>
        </button>
      )}

      {isGenerating && (
        <div className="flex items-center space-x-3 py-8">
          <Loader className="w-6 h-6 text-purple-600 animate-spin" />
          <div>
            <p className="font-medium text-gray-900">
              Analyzing your problem...
            </p>
            <p className="text-sm text-gray-600">
              AI is breaking down tasks based on domain expertise
            </p>
          </div>
        </div>
      )}

      {generatedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Successfully generated {generatedTasks.length} tasks!
            </span>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">
              Generated Tasks Preview:
            </h4>
            <div className="space-y-2">
              {generatedTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">{task.title}</span>
                  <span className="text-gray-500">
                    ({task.estimatedHours}h)
                  </span>
                </div>
              ))}
              {generatedTasks.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{generatedTasks.length - 3} more tasks...
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  AI-Generated Tasks
                </p>
                <p className="text-sm text-blue-700">
                  These tasks are automatically generated based on your problem
                  description and domain. You can modify, add, or remove tasks
                  as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
