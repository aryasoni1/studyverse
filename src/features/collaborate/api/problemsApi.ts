import { supabase } from '@/lib/supabase';
import type { Problem, ProblemFilters, TeamMember, Task, TaskSubmission } from '../types/problems';

// Mock data for demonstration
const mockProblems: Problem[] = [
  {
    id: "1",
    title: "AI-Powered Post-Surgery Recovery Tracker",
    description:
      "Develop an intelligent mobile application that uses machine learning to track patient recovery progress after orthopedic surgeries. The app should monitor pain levels, mobility improvements, medication adherence, and predict potential complications before they become serious.",
    impact:
      "Reduce post-surgery complications by 35% and improve patient satisfaction scores. Help 10,000+ patients annually recover faster with personalized care plans.",
    tags: [
      "Healthcare",
      "AI/ML",
      "Mobile App",
      "Patient Care",
      "Predictive Analytics",
    ],
    domain: "Healthcare",
    status: "looking-for-team",
    priority: "high",
    difficulty: "advanced",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    deadline: "2024-06-15T23:59:59Z",
    owner: {
      id: "doc1",
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      profession: "Orthopedic Surgeon",
      verified: true,
      rating: 4.9,
      completedProjects: 3,
    },
    team: [],
    requirements: [
      "React Native",
      "TensorFlow/PyTorch",
      "HIPAA Compliance",
      "Real-time Analytics",
      "Cloud Infrastructure",
    ],
    timeline: "4-6 months",
    budget: "$15,000",
    solutions: [],
    progress: [],
    likes: 47,
    views: 234,
    applications: 12,
    featured: true,
    mentorshipAvailable: true,
    remoteOnly: false,
    skillsNeeded: [
      { skill: "React Native", level: "advanced", required: true },
      { skill: "Machine Learning", level: "intermediate", required: true },
      { skill: "Healthcare APIs", level: "intermediate", required: false },
      { skill: "UI/UX Design", level: "advanced", required: true },
    ],
    tasks: [
      {
        id: "task1",
        title: "HIPAA Compliance & Security Architecture",
        description:
          "Design and implement comprehensive security measures to ensure HIPAA compliance for patient data protection",
        category: "backend",
        difficulty: "expert",
        estimatedHours: 20,
        skillsRequired: [
          "HIPAA Compliance",
          "Data Encryption",
          "Security Architecture",
          "Healthcare Regulations",
        ],
        dependencies: [],
        status: "open",
        priority: "critical",
        deliverables: [
          "Security architecture document",
          "Encryption implementation",
          "HIPAA compliance checklist",
          "Privacy policy",
        ],
        acceptanceCriteria: [
          "All patient data encrypted at rest and in transit",
          "Access controls implemented",
          "Audit logging system active",
          "HIPAA risk assessment completed",
        ],
        createdAt: "2024-01-15T10:00:00Z",
        points: 250,
      },
      {
        id: "task2",
        title: "Machine Learning Model Development",
        description:
          "Develop predictive ML models for recovery tracking and complication prediction",
        category: "backend",
        difficulty: "advanced",
        estimatedHours: 32,
        skillsRequired: [
          "Python",
          "TensorFlow",
          "Scikit-learn",
          "Medical Data Analysis",
        ],
        dependencies: ["task1"],
        status: "open",
        priority: "high",
        deliverables: [
          "Trained ML models",
          "Model validation reports",
          "API endpoints for predictions",
          "Model documentation",
        ],
        acceptanceCriteria: [
          "Models achieve >85% accuracy",
          "Real-time prediction capability",
          "Models handle edge cases",
          "Performance benchmarks documented",
        ],
        createdAt: "2024-01-15T10:00:00Z",
        points: 300,
      },
    ],
    aiGenerated: true,
  },
  {
    id: "2",
    title: "Smart Parent-Teacher Communication Hub",
    description:
      "Create a comprehensive platform that revolutionizes communication between educators and parents. Features include real-time progress tracking, automated homework reminders, virtual parent-teacher conferences, and AI-powered insights into student learning patterns.",
    impact:
      "Increase parent engagement by 60% and improve student academic performance. Serve 50+ schools and 10,000+ families.",
    tags: [
      "Education",
      "Communication",
      "Web Platform",
      "Real-time",
      "Analytics",
    ],
    domain: "Education",
    status: "in-progress",
    priority: "medium",
    difficulty: "intermediate",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
    deadline: "2024-05-30T23:59:59Z",
    owner: {
      id: "teacher1",
      name: "Ms. Elena Rodriguez",
      avatar:
        "https://images.pexels.com/photos/3747463/pexels-photo-3747463.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      profession: "High School Principal",
      verified: true,
      rating: 4.8,
      completedProjects: 5,
    },
    team: [
      {
        id: "dev1",
        name: "Alex Kumar",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        role: "developer",
        skills: ["React", "Node.js", "PostgreSQL", "WebRTC"],
        joinedAt: "2024-01-12T10:00:00Z",
        contribution: "Full-stack development and real-time features",
        hoursCommitted: 25,
        rating: 4.7,
        status: "active",
        tasksCompleted: 3,
        pointsEarned: 450,
      },
      {
        id: "des1",
        name: "Maya Patel",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        role: "designer",
        skills: ["UI/UX", "Figma", "User Research", "Prototyping"],
        joinedAt: "2024-01-13T15:30:00Z",
        contribution: "User experience design and research",
        hoursCommitted: 20,
        rating: 4.9,
        status: "active",
        tasksCompleted: 2,
        pointsEarned: 350,
      },
    ],
    requirements: [
      "React",
      "Real-time Chat",
      "Video Conferencing",
      "Calendar Integration",
      "Mobile Responsive",
    ],
    timeline: "4 months",
    budget: "$8,000",
    solutions: [],
    progress: [
      {
        id: "p1",
        stage: "idea",
        title: "Requirements Gathering Complete",
        description:
          "Conducted stakeholder interviews with 15 teachers and 30 parents. Defined core features and user personas.",
        completedAt: "2024-01-14T16:00:00Z",
        completedBy: "Maya Patel",
        milestone: true,
      },
      {
        id: "p2",
        stage: "design",
        title: "UI/UX Design Phase Complete",
        description:
          "Created comprehensive wireframes, user flows, and high-fidelity prototypes. Conducted usability testing with 10 users.",
        completedAt: "2024-01-18T12:00:00Z",
        completedBy: "Maya Patel",
        milestone: true,
      },
    ],
    likes: 89,
    views: 456,
    applications: 8,
    featured: false,
    mentorshipAvailable: true,
    remoteOnly: true,
    skillsNeeded: [
      { skill: "React", level: "intermediate", required: true },
      { skill: "Node.js", level: "intermediate", required: true },
      { skill: "WebRTC", level: "beginner", required: false },
    ],
    tasks: [
      {
        id: "task7",
        title: "Real-time Messaging System",
        description:
          "Implement secure real-time messaging between parents and teachers",
        category: "backend",
        difficulty: "intermediate",
        estimatedHours: 16,
        skillsRequired: ["WebSocket", "Node.js", "Real-time Systems"],
        dependencies: [],
        status: "completed",
        priority: "high",
        deliverables: [
          "WebSocket implementation",
          "Message encryption",
          "Typing indicators",
          "Message history",
        ],
        acceptanceCriteria: [
          "Messages delivered in real-time",
          "End-to-end encryption",
          "Message persistence",
          "Typing indicators work",
        ],
        createdAt: "2024-01-10T14:30:00Z",
        points: 200,
      },
      {
        id: "task8",
        title: "Video Conferencing Integration",
        description:
          "Integrate video calling functionality for virtual parent-teacher conferences",
        category: "frontend",
        difficulty: "advanced",
        estimatedHours: 24,
        skillsRequired: ["WebRTC", "React", "Video APIs"],
        dependencies: ["task7"],
        status: "in-progress",
        priority: "high",
        deliverables: [
          "Video calling interface",
          "Screen sharing",
          "Recording capability",
          "Calendar integration",
        ],
        acceptanceCriteria: [
          "HD video quality",
          "Screen sharing works",
          "Meetings can be recorded",
          "Calendar sync functional",
        ],
        createdAt: "2024-01-10T14:30:00Z",
        points: 300,
      },
    ],
    aiGenerated: true,
  },
  {
    id: "3",
    title: "Blockchain-Based Supply Chain Transparency",
    description:
      "Build a revolutionary supply chain tracking system using blockchain technology to provide complete transparency from farm to table.",
    impact:
      "Increase consumer trust by 80% and help 500+ small farmers get fair prices for their products.",
    tags: [
      "Blockchain",
      "Supply Chain",
      "Sustainability",
      "Web3",
      "Transparency",
    ],
    domain: "Technology",
    status: "completed",
    priority: "high",
    difficulty: "expert",
    createdAt: "2023-11-01T09:00:00Z",
    updatedAt: "2024-01-05T17:45:00Z",
    deadline: "2024-01-31T23:59:59Z",
    owner: {
      id: "owner1",
      name: "David Thompson",
      avatar:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      profession: "Supply Chain Director",
      verified: true,
      rating: 4.7,
      completedProjects: 7,
    },
    team: [
      {
        id: "dev2",
        name: "Sophie Chen",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
        role: "developer",
        skills: ["Solidity", "Web3.js", "React", "Node.js"],
        joinedAt: "2023-11-05T11:00:00Z",
        contribution: "Blockchain development and smart contracts",
        hoursCommitted: 40,
        rating: 4.9,
        status: "completed",
        tasksCompleted: 5,
        pointsEarned: 800,
      },
    ],
    requirements: [
      "Blockchain Development",
      "Smart Contracts",
      "Web3 Integration",
    ],
    timeline: "3 months",
    budget: "$25,000",
    solutions: [
      {
        id: "sol1",
        title: "FarmTrace - Complete Supply Chain Solution",
        description:
          "Comprehensive blockchain-based platform with mobile app for farmers, web dashboard for retailers, and consumer-facing transparency portal.",
        type: "final",
        mediaUrls: [],
        githubUrl: "https://github.com/example/farmtrace",
        liveUrl: "https://farmtrace-demo.com",
        submittedBy: "Sophie Chen",
        submittedAt: "2024-01-05T17:45:00Z",
        feedback: [],
        votes: 47,
        featured: true,
      },
    ],
    progress: [],
    likes: 156,
    views: 1247,
    applications: 25,
    featured: true,
    mentorshipAvailable: false,
    remoteOnly: true,
    skillsNeeded: [
      { skill: "Blockchain", level: "expert", required: true },
      { skill: "Smart Contracts", level: "advanced", required: true },
    ],
    tasks: [], // Completed project, tasks archived
    aiGenerated: true,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const problemsApi = {
  async getProblems(filters?: ProblemFilters): Promise<Problem[]> {
    try {
      // Try to fetch from Supabase
      let query = supabase.from('problems').select('*');
      
      if (filters?.domain?.length) {
        query = query.in('domain', filters.domain);
      }
      
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      
      if (filters?.difficulty?.length) {
        query = query.in('difficulty', filters.difficulty);
      }
      
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }
      
      if (filters?.tags?.length) {
        query = query.contains('tags', filters.tags);
      }
      
      if (filters?.remoteOnly) {
        query = query.eq('remote_only', true);
      }
      
      if (filters?.mentorshipAvailable) {
        query = query.eq('mentorship_available', true);
      }
      
      if (filters?.featured) {
        query = query.eq('featured', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Transform data to match our Problem interface
        return data.map(item => ({
          ...item,
          // Add any transformations needed
        })) as Problem[];
      }
      
      // If no data in Supabase, return mock data
      await delay(500);
      return mockProblems;
    } catch (error) {
      console.error("Error fetching problems:", error);
      // Return mock data as fallback
      await delay(500);
      return mockProblems;
    }
  },

  async getProblem(id: string): Promise<Problem | null> {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        // Transform data to match our Problem interface
        return data as unknown as Problem;
      }
      
      // If no data in Supabase, return mock data
      await delay(300);
      return mockProblems.find(p => p.id === id) || null;
    } catch (error) {
      console.error("Error fetching problem:", error);
      // Return mock data as fallback
      await delay(300);
      return mockProblems.find(p => p.id === id) || null;
    }
  },

  async createProblem(data: Partial<Problem>): Promise<Problem> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      // Prepare data for insertion
      const problemData = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.user?.id || 'anonymous',
        likes: 0,
        views: 0,
        applications: 0,
      };
      
      const { data: result, error } = await supabase
        .from('problems')
        .insert(problemData)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (result) {
        return result as unknown as Problem;
      }
      
      // If insertion fails, create a mock problem
      await delay(500);
      const newProblem: Problem = {
        id: Date.now().toString(),
        title: data.title || "Untitled Problem",
        description: data.description || "",
        impact: data.impact || "",
        tags: data.tags || [],
        domain: data.domain || "Technology",
        status: data.status || "looking-for-team",
        priority: data.priority || "medium",
        difficulty: data.difficulty || "intermediate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          id: "current-user",
          name: "Current User",
          avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
          profession: data.owner?.profession || "Professional",
          verified: false,
          rating: 4.5,
          completedProjects: 0,
        },
        team: [],
        requirements: data.requirements || [],
        timeline: data.timeline || "3 months",
        budget: data.budget,
        solutions: [],
        progress: [],
        likes: 0,
        views: 0,
        applications: 0,
        featured: false,
        mentorshipAvailable: data.mentorshipAvailable || false,
        remoteOnly: data.remoteOnly || false,
        skillsNeeded: data.skillsNeeded || [],
        tasks: [],
        aiGenerated: data.aiGenerated || false,
      };
      
      // Add to mock data
      mockProblems.push(newProblem);
      return newProblem;
    } catch (error) {
      console.error("Error creating problem:", error);
      
      // Create a mock problem as fallback
      await delay(500);
      const newProblem: Problem = {
        id: Date.now().toString(),
        title: data.title || "Untitled Problem",
        description: data.description || "",
        impact: data.impact || "",
        tags: data.tags || [],
        domain: data.domain || "Technology",
        status: data.status || "looking-for-team",
        priority: data.priority || "medium",
        difficulty: data.difficulty || "intermediate",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: {
          id: "current-user",
          name: "Current User",
          avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
          profession: data.owner?.profession || "Professional",
          verified: false,
          rating: 4.5,
          completedProjects: 0,
        },
        team: [],
        requirements: data.requirements || [],
        timeline: data.timeline || "3 months",
        budget: data.budget,
        solutions: [],
        progress: [],
        likes: 0,
        views: 0,
        applications: 0,
        featured: false,
        mentorshipAvailable: data.mentorshipAvailable || false,
        remoteOnly: data.remoteOnly || false,
        skillsNeeded: data.skillsNeeded || [],
        tasks: [],
        aiGenerated: data.aiGenerated || false,
      };
      
      // Add to mock data
      mockProblems.push(newProblem);
      return newProblem;
    }
  },

  async addTasksToProblem(problemId: string, tasks: Task[]): Promise<Task[]> {
    try {
      // Try to add tasks to Supabase
      const tasksWithProblemId = tasks.map(task => ({
        ...task,
        problem_id: problemId
      }));
      
      const { data, error } = await supabase
        .from('problem_tasks')
        .insert(tasksWithProblemId)
        .select();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        return data as unknown as Task[];
      }
      
      // If insertion fails, update mock data
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.tasks = [...problem.tasks, ...tasks];
        return tasks;
      }
      
      throw new Error("Problem not found");
    } catch (error) {
      console.error("Error adding tasks:", error);
      
      // Update mock data as fallback
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.tasks = [...problem.tasks, ...tasks];
        return tasks;
      }
      
      throw new Error("Problem not found");
    }
  },

  async joinTeam(problemId: string, member: TeamMember): Promise<TeamMember> {
    try {
      // Try to add team member to Supabase
      const { data, error } = await supabase
        .from('problem_team_members')
        .insert({
          problem_id: problemId,
          user_id: member.id,
          name: member.name,
          avatar: member.avatar,
          role: member.role,
          skills: member.skills,
          joined_at: new Date().toISOString(),
          contribution: member.contribution,
        })
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        return data as unknown as TeamMember;
      }
      
      // If insertion fails, update mock data
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.team.push(member);
        problem.applications += 1;
        return member;
      }
      
      throw new Error("Problem not found");
    } catch (error) {
      console.error("Error joining team:", error);
      
      // Update mock data as fallback
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.team.push(member);
        problem.applications += 1;
        return member;
      }
      
      throw new Error("Problem not found");
    }
  },

  async claimTask(problemId: string, taskId: string): Promise<Task> {
    try {
      // Try to update task in Supabase
      const { data, error } = await supabase
        .from('problem_tasks')
        .update({
          status: 'claimed',
          assigned_to: {
            id: 'current-user',
            name: 'Current User',
            avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            claimedAt: new Date().toISOString(),
          }
        })
        .eq('id', taskId)
        .eq('problem_id', problemId)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        return data as unknown as Task;
      }
      
      // If update fails, update mock data
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        const task = problem.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'claimed';
          task.assignedTo = {
            id: 'current-user',
            name: 'Current User',
            avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            claimedAt: new Date().toISOString(),
          };
          return task;
        }
      }
      
      throw new Error("Task not found");
    } catch (error) {
      console.error("Error claiming task:", error);
      
      // Update mock data as fallback
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        const task = problem.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'claimed';
          task.assignedTo = {
            id: 'current-user',
            name: 'Current User',
            avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            claimedAt: new Date().toISOString(),
          };
          return task;
        }
      }
      
      throw new Error("Task not found");
    }
  },

  async submitTaskWork(
    problemId: string,
    taskId: string,
    submission: Omit<TaskSubmission, "id" | "submittedAt" | "status">
  ): Promise<Task> {
    try {
      // Try to update task in Supabase
      const submissionData = {
        id: Date.now().toString(),
        ...submission,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      
      const { data, error } = await supabase
        .from('problem_tasks')
        .update({
          status: 'review',
          submittedWork: submissionData
        })
        .eq('id', taskId)
        .eq('problem_id', problemId)
        .select()
        .single();
        
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      if (data) {
        return data as unknown as Task;
      }
      
      // If update fails, update mock data
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        const task = problem.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'review';
          task.submittedWork = {
            id: Date.now().toString(),
            ...submission,
            submittedAt: new Date().toISOString(),
            status: 'submitted',
          };
          return task;
        }
      }
      
      throw new Error("Task not found");
    } catch (error) {
      console.error("Error submitting task work:", error);
      
      // Update mock data as fallback
      await delay(300);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        const task = problem.tasks.find(t => t.id === taskId);
        if (task) {
          task.status = 'review';
          task.submittedWork = {
            id: Date.now().toString(),
            ...submission,
            submittedAt: new Date().toISOString(),
            status: 'submitted',
          };
          return task;
        }
      }
      
      throw new Error("Task not found");
    }
  },

  async likeProblem(problemId: string): Promise<void> {
    try {
      // Try to update likes in Supabase
      const { data: user } = await supabase.auth.getUser();
      
      // Check if user already liked the problem
      const { data: existingLike } = await supabase
        .from('problem_likes')
        .select()
        .eq('problem_id', problemId)
        .eq('user_id', user.user?.id || 'anonymous')
        .single();
        
      if (existingLike) {
        // Unlike
        await supabase
          .from('problem_likes')
          .delete()
          .eq('problem_id', problemId)
          .eq('user_id', user.user?.id || 'anonymous');
          
        // Decrement likes count
        await supabase.rpc('decrement_problem_likes', { problem_id: problemId });
      } else {
        // Like
        await supabase
          .from('problem_likes')
          .insert({
            problem_id: problemId,
            user_id: user.user?.id || 'anonymous',
          });
          
        // Increment likes count
        await supabase.rpc('increment_problem_likes', { problem_id: problemId });
      }
    } catch (error) {
      console.error("Error liking problem:", error);
      
      // Update mock data as fallback
      await delay(200);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.likes += 1;
      }
    }
  },

  async viewProblem(problemId: string): Promise<void> {
    try {
      // Try to update views in Supabase
      await supabase.rpc('increment_problem_views', { problem_id: problemId });
    } catch (error) {
      console.error("Error updating problem views:", error);
      
      // Update mock data as fallback
      await delay(100);
      const problem = mockProblems.find(p => p.id === problemId);
      if (problem) {
        problem.views += 1;
      }
    }
  },
};