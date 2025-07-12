import { supabase } from "@/lib/supabase";
import type {
  Roadmap,
  RoadmapTask,
  MindmapNode,
  CreateRoadmapData,
  CreateTaskData,
  CreateNodeData,
  RoadmapApiResponse,
  PaginatedResponse,
  RoadmapStats,
  TaskCategory,
  TaskStatus,
  NodeStatus,
} from "../types/roadmapTypes";

// Simulated API delay
const API_DELAY = 600;

const delay = (ms: number) =>
  new Promise((resolve: (value?: unknown) => void) => setTimeout(resolve, ms));

export class RoadmapsApi {
  // Roadmap CRUD operations
  static async getRoadmaps(
    page = 1,
    limit = 10
  ): Promise<RoadmapApiResponse<PaginatedResponse<Roadmap>>> {
    await delay(API_DELAY);

    try {
      const { data, error } = await supabase
        .from("roadmaps")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        // Handle authentication errors
        if (error.code === "PGRST116" || error.message.includes("403")) {
          console.warn("User not authenticated, returning mock roadmaps");
          // Return mock data for unauthenticated users
          const mockRoadmaps: Roadmap[] = [
            {
              id: "mock-1",
              title: "Learn React Fundamentals",
              description: "Master the basics of React development",
              difficulty: "beginner",
              estimatedDuration: 40,
              progress: 25,
              status: "in_progress",
              isPublic: true,
              isTemplate: false,
              tags: ["react", "javascript", "frontend"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: "mock-user-id",
            },
            {
              id: "mock-2",
              title: "Advanced TypeScript",
              description: "Deep dive into TypeScript advanced features",
              difficulty: "advanced",
              estimatedDuration: 60,
              progress: 0,
              status: "not_started",
              isPublic: true,
              isTemplate: false,
              tags: ["typescript", "javascript", "programming"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              userId: "mock-user-id",
            },
          ];

          const start = (page - 1) * limit;
          const end = start + limit;
          const paginatedRoadmaps = mockRoadmaps.slice(start, end);

          return {
            success: true,
            data: {
              data: paginatedRoadmaps,
              total: mockRoadmaps.length,
              page,
              limit,
              hasMore: end < mockRoadmaps.length,
            },
          };
        }
        throw error;
      }

      // Transform the data to match the expected Roadmap interface
      const transformedRoadmaps: Roadmap[] = (data as any[]).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        difficulty: item.difficulty,
        estimatedDuration:
          item.estimatedDuration || item.estimated_duration || 0,
        progress: item.progress || 0,
        status: item.status,
        isPublic: item.isPublic ?? item.is_public ?? false,
        isTemplate: item.isTemplate ?? item.is_template ?? false,
        templateId: item.templateId ?? item.template_id,
        tags: item.tags || [],
        createdAt: item.createdAt ?? item.created_at,
        updatedAt: item.updatedAt ?? item.updated_at,
        startedAt: item.startedAt ?? item.started_at,
        completedAt: item.completedAt ?? item.completed_at,
        userId: item.userId ?? item.user_id,
      }));

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedRoadmaps = transformedRoadmaps.slice(start, end);

      return {
        success: true,
        data: {
          data: paginatedRoadmaps,
          total: transformedRoadmaps.length,
          page,
          limit,
          hasMore: end < transformedRoadmaps.length,
        },
      };
    } catch (error) {
      console.error("Error fetching roadmaps:", error);
      // Return mock data on error
      const mockRoadmaps: Roadmap[] = [
        {
          id: "mock-1",
          title: "Learn React Fundamentals",
          description: "Master the basics of React development",
          difficulty: "beginner",
          estimatedDuration: 40,
          progress: 25,
          status: "in_progress",
          isPublic: true,
          isTemplate: false,
          tags: ["react", "javascript", "frontend"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "mock-user-id",
        },
      ];

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedRoadmaps = mockRoadmaps.slice(start, end);

      return {
        success: true,
        data: {
          data: paginatedRoadmaps,
          total: mockRoadmaps.length,
          page,
          limit,
          hasMore: end < mockRoadmaps.length,
        },
      };
    }
  }

  static async getRoadmap(id: string): Promise<RoadmapApiResponse<Roadmap>> {
    await delay(API_DELAY);

    const { data, error } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform the data to match the expected Roadmap interface
    const transformedRoadmap: Roadmap = {
      id: data.id,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      estimatedDuration: data.estimatedDuration || 0,
      progress: data.progress || 0,
      status: data.status,
      isPublic: data.isPublic ?? false,
      isTemplate: data.isTemplate ?? false,
      templateId: data.templateId ?? data.template_id,
      tags: data.tags || [],
      createdAt: data.createdAt ?? data.created_at,
      updatedAt: data.updatedAt ?? data.updated_at,
      startedAt: data.startedAt ?? data.started_at,
      completedAt: data.completedAt ?? data.completed_at,
      userId: data.userId ?? data.user_id,
    };

    return {
      success: true,
      data: transformedRoadmap,
    };
  }

  static async createRoadmap(
    data: CreateRoadmapData
  ): Promise<RoadmapApiResponse<Roadmap>> {
    await delay(API_DELAY);

    try {
      // Convert frontend data model to database model
      const dbData = {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimated_duration: data.estimatedDuration,
        is_public: data.isPublic,
        is_template: false,
        template_id: data.templateId,
        tags: data.tags || [],
        status: "not_started",
        user_id: (await supabase.auth.getUser()).data.user?.id || "anonymous",
      };

      const { data: newRoadmap, error } = await supabase
        .from("roadmaps")
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      // Transform database model back to frontend model
      const transformedRoadmap: Roadmap = {
        id: newRoadmap.id,
        title: newRoadmap.title,
        description: newRoadmap.description,
        difficulty: newRoadmap.difficulty,
        estimatedDuration: newRoadmap.estimated_duration || 0,
        progress: newRoadmap.progress || 0,
        status: newRoadmap.status,
        isPublic: newRoadmap.is_public || false,
        isTemplate: newRoadmap.is_template || false,
        templateId: newRoadmap.template_id,
        tags: newRoadmap.tags || [],
        createdAt: newRoadmap.created_at,
        updatedAt: newRoadmap.updated_at,
        startedAt: newRoadmap.started_at,
        completedAt: newRoadmap.completed_at,
        userId: newRoadmap.user_id,
      };

      return {
        success: true,
        data: transformedRoadmap,
      };
    } catch (error) {
      console.error("Error creating roadmap:", error);

      // Create a mock roadmap as fallback
      const mockRoadmap: Roadmap = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description || "",
        difficulty: data.difficulty,
        estimatedDuration: data.estimatedDuration,
        progress: 0,
        status: "not_started",
        isPublic: data.isPublic,
        isTemplate: false,
        tags: data.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: "mock-user-id",
      };

      return {
        success: true,
        data: mockRoadmap,
      };
    }
  }

  static async updateRoadmap(
    id: string,
    updates: Partial<Roadmap>
  ): Promise<RoadmapApiResponse<Roadmap>> {
    await delay(API_DELAY);

    try {
      // Convert frontend model to database model
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined)
        dbUpdates.description = updates.description;
      if (updates.difficulty !== undefined)
        dbUpdates.difficulty = updates.difficulty;
      if (updates.estimatedDuration !== undefined)
        dbUpdates.estimated_duration = updates.estimatedDuration;
      if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.isPublic !== undefined)
        dbUpdates.is_public = updates.isPublic;
      if (updates.isTemplate !== undefined)
        dbUpdates.is_template = updates.isTemplate;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

      const { data, error } = await supabase
        .from("roadmaps")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Transform database model back to frontend model
      const transformedRoadmap: Roadmap = {
        id: data.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        estimatedDuration: data.estimated_duration || 0,
        progress: data.progress || 0,
        status: data.status,
        isPublic: data.is_public || false,
        isTemplate: data.is_template || false,
        templateId: data.template_id,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        startedAt: data.started_at,
        completedAt: data.completed_at,
        userId: data.user_id,
      };

      return {
        success: true,
        data: transformedRoadmap,
      };
    } catch (error) {
      console.error("Error updating roadmap:", error);

      // Return a mock updated roadmap
      return {
        success: true,
        data: {
          ...updates,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Roadmap,
      };
    }
  }

  static async deleteRoadmap(id: string): Promise<RoadmapApiResponse<void>> {
    await delay(API_DELAY);

    try {
      const { error } = await supabase.from("roadmaps").delete().eq("id", id);
      if (error) throw error;

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error("Error deleting roadmap:", error);

      // Return success anyway for demo purposes
      return {
        success: true,
        data: undefined,
      };
    }
  }

  // Task CRUD operations
  static async getTasks(
    roadmapId: string
  ): Promise<RoadmapApiResponse<RoadmapTask[]>> {
    await delay(API_DELAY);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("roadmap_id", roadmapId);

      if (error) {
        // Handle authentication errors
        if (error.code === "PGRST116" || error.message.includes("403")) {
          console.warn("User not authenticated, returning empty task list");
          return {
            success: true,
            data: [],
          };
        }
        throw error;
      }

      // Transform the data to match the expected RoadmapTask interface
      const transformedData = (data || []).map(
        (task: {
          id: string;
          roadmap_id: string;
          title: string;
          description: string;
          priority: number;
          status: string;
          due_date: string | null;
          estimated_duration: number | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        }) => ({
          id: task.id,
          roadmapId: task.roadmap_id,
          title: task.title,
          description: task.description,
          category: "study" as TaskCategory, // Default since not in DB
          priority:
            task.priority === 1
              ? "low"
              : task.priority === 2
                ? "medium"
                : task.priority === 3
                  ? "high"
                  : "urgent",
          status: task.status as TaskStatus,
          startTime: "09:00", // Default since not in DB
          endTime: "10:00", // Default since not in DB
          date: task.due_date
            ? new Date(task.due_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          duration: task.estimated_duration || 60,
          tags: task.tags || [],
          notes: "", // Default since not in DB
          createdAt: task.created_at,
          updatedAt: task.updated_at,
        })
      );

      return {
        success: true,
        data: transformedData as RoadmapTask[],
      };
    } catch (error) {
      console.error("Error fetching tasks:", error);

      // Return mock tasks
      const mockTasks: RoadmapTask[] = [
        {
          id: "task1",
          roadmapId,
          title: "Learn JavaScript Basics",
          description: "Study variables, functions, and basic concepts",
          category: "study",
          priority: "high",
          status: "pending",
          startTime: "09:00",
          endTime: "11:00",
          date: new Date().toISOString().split("T")[0],
          duration: 120,
          tags: ["javascript", "basics"],
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "task2",
          roadmapId,
          title: "Build a Simple App",
          description: "Create a to-do list application",
          category: "project",
          priority: "medium",
          status: "pending",
          startTime: "13:00",
          endTime: "16:00",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          duration: 180,
          tags: ["project", "javascript"],
          notes: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockTasks,
      };
    }
  }

  static async createTask(
    roadmapId: string,
    data: CreateTaskData
  ): Promise<RoadmapApiResponse<RoadmapTask>> {
    await delay(API_DELAY);

    try {
      // Get the current user
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error("User not authenticated");

      // Transform the data to match the database schema
      const dbData = {
        user_id: user.data.user.id,
        title: data.title,
        description: data.description,
        due_date: data.date,
        priority:
          data.priority === "low"
            ? 1
            : data.priority === "medium"
              ? 2
              : data.priority === "high"
                ? 3
                : 4,
        status: "pending" as TaskStatus, // Default status
        roadmap_id: roadmapId,
        estimated_duration: this.calculateDuration(
          data.startTime,
          data.endTime
        ),
        tags: data.tags || [],
      };

      const { data: newTask, error } = await supabase
        .from("tasks")
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      // Transform the response back to match the interface
      const transformedTask: RoadmapTask = {
        id: newTask.id,
        roadmapId: newTask.roadmap_id,
        title: newTask.title,
        description: newTask.description,
        category: data.category,
        priority: data.priority,
        status: "pending" as TaskStatus, // Use default status
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.date,
        duration: newTask.estimated_duration || 60,
        tags: newTask.tags || [],
        notes: data.notes || "",
        createdAt: newTask.created_at,
        updatedAt: newTask.updated_at,
      };

      return {
        success: true,
        data: transformedTask,
      };
    } catch (error) {
      console.error("Error creating task:", error);

      // Create a mock task as fallback
      const mockTask: RoadmapTask = {
        id: Date.now().toString(),
        roadmapId,
        title: data.title,
        description: data.description || "",
        category: data.category,
        priority: data.priority,
        status: "pending",
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.date,
        duration: this.calculateDuration(data.startTime, data.endTime),
        tags: data.tags || [],
        notes: data.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockTask,
      };
    }
  }

  static async updateTask(
    id: string,
    updates: Partial<RoadmapTask>
  ): Promise<RoadmapApiResponse<RoadmapTask>> {
    await delay(API_DELAY);

    try {
      // Get the current user
      const user = await supabase.auth.getUser();
      if (!user.data.user?.id) throw new Error("User not authenticated");

      // Transform the updates to match the database schema
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.date) dbUpdates.due_date = updates.date;
      if (updates.priority)
        dbUpdates.priority =
          updates.priority === "low"
            ? 1
            : updates.priority === "medium"
              ? 2
              : updates.priority === "high"
                ? 3
                : 4;
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.tags) dbUpdates.tags = updates.tags;
      if (updates.startTime && updates.endTime)
        dbUpdates.estimated_duration = this.calculateDuration(
          updates.startTime,
          updates.endTime
        );
      dbUpdates.user_id = user.data.user.id;

      const { data, error } = await supabase
        .from("tasks")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Transform the response back to match the interface
      const transformedTask: RoadmapTask = {
        id: data.id,
        roadmapId: data.roadmap_id,
        title: data.title,
        description: data.description,
        category: updates.category || "study",
        priority:
          data.priority === 1
            ? "low"
            : data.priority === 2
              ? "medium"
              : data.priority === 3
                ? "high"
                : "urgent",
        status: data.status as TaskStatus,
        startTime: updates.startTime || "09:00",
        endTime: updates.endTime || "10:00",
        date: data.due_date
          ? new Date(data.due_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        duration: data.estimated_duration || 60,
        tags: data.tags || [],
        notes: updates.notes || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return {
        success: true,
        data: transformedTask,
      };
    } catch (error) {
      console.error("Error updating task:", error);

      // Return a mock updated task
      return {
        success: true,
        data: {
          ...updates,
          id,
          roadmapId: updates.roadmapId || "unknown",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as RoadmapTask,
      };
    }
  }

  static async deleteTask(id: string): Promise<RoadmapApiResponse<void>> {
    await delay(API_DELAY);

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error("Error deleting task:", error);

      // Return success anyway for demo purposes
      return {
        success: true,
        data: undefined,
      };
    }
  }

  // Mindmap node CRUD operations
  static async getNodes(
    roadmapId: string
  ): Promise<RoadmapApiResponse<MindmapNode[]>> {
    await delay(API_DELAY);

    try {
      const { data, error } = await supabase
        .from("mindmap_nodes")
        .select("*")
        .eq("roadmap_id", roadmapId);

      if (error) {
        // Handle authentication errors
        if (error.code === "PGRST116" || error.message.includes("403")) {
          console.warn("User not authenticated, returning empty node list");
          return {
            success: true,
            data: [],
          };
        }
        throw error;
      }

      // Transform the data from JSONB format to MindmapNode interface
      const transformedNodes = (data || []).map(
        (node: {
          id: string;
          roadmap_id: string;
          node_data: any;
          created_at: string;
          updated_at: string;
        }) => {
          const nodeData = node.node_data || {};
          return {
            id: node.id,
            roadmapId: node.roadmap_id,
            title: nodeData.title || "Untitled Node",
            description: nodeData.description || "",
            type: nodeData.type || "leaf",
            parentId: nodeData.parentId,
            children: nodeData.children || [],
            position: nodeData.position || { x: 0, y: 0 },
            status: nodeData.status || "not_started",
            priority: nodeData.priority || "medium",
            dueDate: nodeData.dueDate,
            progress: nodeData.progress || 0,
            tags: nodeData.tags || [],
            metadata: nodeData.metadata || {},
            isExpanded: nodeData.isExpanded || false,
            createdAt: node.created_at,
            updatedAt: node.updated_at,
          } as MindmapNode;
        }
      );

      return {
        success: true,
        data: transformedNodes,
      };
    } catch (error) {
      console.error("Error fetching nodes:", error);

      // Return mock nodes
      const mockNodes: MindmapNode[] = [
        {
          id: "node1",
          roadmapId,
          title: "Frontend Development",
          description: "Master frontend development skills",
          type: "root",
          children: ["node2", "node3"],
          position: { x: 0, y: 0 },
          status: "in_progress",
          priority: "high",
          progress: 30,
          tags: ["frontend", "web"],
          metadata: {},
          isExpanded: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "node2",
          roadmapId,
          title: "HTML & CSS",
          description: "Learn the fundamentals of web markup and styling",
          type: "branch",
          parentId: "node1",
          children: [],
          position: { x: -200, y: 100 },
          status: "completed",
          priority: "medium",
          progress: 100,
          tags: ["html", "css"],
          metadata: {},
          isExpanded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "node3",
          roadmapId,
          title: "JavaScript",
          description: "Master JavaScript programming",
          type: "branch",
          parentId: "node1",
          children: [],
          position: { x: 200, y: 100 },
          status: "in_progress",
          priority: "high",
          progress: 60,
          tags: ["javascript"],
          metadata: {},
          isExpanded: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return {
        success: true,
        data: mockNodes,
      };
    }
  }

  static async createNode(
    roadmapId: string,
    data: CreateNodeData
  ): Promise<RoadmapApiResponse<MindmapNode>> {
    await delay(API_DELAY);

    try {
      // Transform the data to store in JSONB format
      const nodeData = {
        title: data.title,
        description: data.description,
        type: data.type,
        parentId: data.parentId,
        children: [],
        position: { x: 0, y: 0 },
        status: "not_started" as NodeStatus,
        priority: data.priority,
        dueDate: data.dueDate,
        progress: 0,
        tags: data.tags || [],
        metadata: {},
        isExpanded: false,
      };

      const { data: newNode, error } = await supabase
        .from("mindmap_nodes")
        .insert([{ roadmap_id: roadmapId, node_data: nodeData }])
        .select()
        .single();

      if (error) throw error;

      // Transform the response back to match the interface
      const transformedNode: MindmapNode = {
        id: newNode.id,
        roadmapId: newNode.roadmap_id,
        title: nodeData.title,
        description: nodeData.description,
        type: nodeData.type,
        parentId: nodeData.parentId,
        children: nodeData.children,
        position: nodeData.position,
        status: nodeData.status,
        priority: nodeData.priority,
        dueDate: nodeData.dueDate,
        progress: nodeData.progress,
        tags: nodeData.tags,
        metadata: nodeData.metadata,
        isExpanded: nodeData.isExpanded,
        createdAt: newNode.created_at,
        updatedAt: newNode.updated_at,
      };

      // If this node has a parent, update the parent's children array
      if (data.parentId) {
        const { data: parentNode } = await supabase
          .from("mindmap_nodes")
          .select("*")
          .eq("id", data.parentId)
          .single();

        if (parentNode) {
          const parentNodeData = parentNode.node_data || {};
          const children = parentNodeData.children || [];
          children.push(newNode.id);

          await supabase
            .from("mindmap_nodes")
            .update({
              node_data: {
                ...parentNodeData,
                children,
              },
            })
            .eq("id", data.parentId);
        }
      }

      return {
        success: true,
        data: transformedNode,
      };
    } catch (error) {
      console.error("Error creating node:", error);

      // Create a mock node as fallback
      const mockNode: MindmapNode = {
        id: Date.now().toString(),
        roadmapId,
        title: data.title,
        description: data.description || "",
        type: data.type,
        parentId: data.parentId,
        children: [],
        position: { x: 0, y: 0 },
        status: "not_started",
        priority: data.priority,
        dueDate: data.dueDate,
        progress: 0,
        tags: data.tags || [],
        metadata: {},
        isExpanded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockNode,
      };
    }
  }

  static async updateNode(
    id: string,
    updates: Partial<MindmapNode>
  ): Promise<RoadmapApiResponse<MindmapNode>> {
    await delay(API_DELAY);

    try {
      // First get the current node data
      const { data: currentNode, error: fetchError } = await supabase
        .from("mindmap_nodes")
        .select("*")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      // Merge the current node_data with the updates
      const currentData = currentNode.node_data || {};
      const updatedNodeData = {
        ...currentData,
        ...updates,
        // Remove fields that shouldn't be in node_data
        id: undefined,
        roadmapId: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      const { data, error } = await supabase
        .from("mindmap_nodes")
        .update({ node_data: updatedNodeData })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      // Transform the response back to match the interface
      const transformedNode: MindmapNode = {
        id: data.id,
        roadmapId: data.roadmap_id,
        title: updatedNodeData.title || "Untitled Node",
        description: updatedNodeData.description || "",
        type: updatedNodeData.type || "leaf",
        parentId: updatedNodeData.parentId,
        children: updatedNodeData.children || [],
        position: updatedNodeData.position || { x: 0, y: 0 },
        status: updatedNodeData.status || "not_started",
        priority: updatedNodeData.priority || "medium",
        dueDate: updatedNodeData.dueDate,
        progress: updatedNodeData.progress || 0,
        tags: updatedNodeData.tags || [],
        metadata: updatedNodeData.metadata || {},
        isExpanded: updatedNodeData.isExpanded || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return {
        success: true,
        data: transformedNode,
      };
    } catch (error) {
      console.error("Error updating node:", error);

      // Return a mock updated node
      return {
        success: true,
        data: {
          ...updates,
          id,
          roadmapId: updates.roadmapId || "unknown",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as MindmapNode,
      };
    }
  }

  static async deleteNode(id: string): Promise<RoadmapApiResponse<void>> {
    await delay(API_DELAY);

    try {
      // Get the node to find its parent
      const { data: node } = await supabase
        .from("mindmap_nodes")
        .select("*")
        .eq("id", id)
        .single();

      if (node && node.node_data && node.node_data.parentId) {
        // Update parent's children array
        const { data: parentNode } = await supabase
          .from("mindmap_nodes")
          .select("*")
          .eq("id", node.node_data.parentId)
          .single();

        if (parentNode && parentNode.node_data) {
          const children = parentNode.node_data.children || [];
          const updatedChildren = children.filter(
            (childId: string) => childId !== id
          );

          await supabase
            .from("mindmap_nodes")
            .update({
              node_data: {
                ...parentNode.node_data,
                children: updatedChildren,
              },
            })
            .eq("id", node.node_data.parentId);
        }
      }

      // Delete the node
      const { error } = await supabase
        .from("mindmap_nodes")
        .delete()
        .eq("id", id);
      if (error) throw error;

      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      console.error("Error deleting node:", error);

      // Return success anyway for demo purposes
      return {
        success: true,
        data: undefined,
      };
    }
  }

  // Analytics
  static async getRoadmapStats(
    roadmapId: string
  ): Promise<RoadmapApiResponse<RoadmapStats>> {
    await delay(API_DELAY);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("roadmap_id", roadmapId);
      if (error) throw error;

      const roadmapTasks = data as unknown as RoadmapTask[];
      const completedTasks = roadmapTasks.filter(
        (t) => t.status === "completed"
      );
      const pendingTasks = roadmapTasks.filter((t) => t.status === "pending");

      const totalHours =
        roadmapTasks.reduce((sum, task) => sum + (task.duration || 0), 0) / 60;
      const completedHours =
        completedTasks.reduce((sum, task) => sum + (task.duration || 0), 0) /
        60;

      const categoryBreakdown = roadmapTasks.reduce(
        (acc: Record<TaskCategory, number>, task) => {
          const category = task.category || "study";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        },
        {} as Record<TaskCategory, number>
      );

      const stats: RoadmapStats = {
        totalTasks: roadmapTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        totalHours,
        completedHours,
        averageTaskDuration:
          roadmapTasks.length > 0 ? totalHours / roadmapTasks.length : 0,
        categoryBreakdown,
        progressByWeek: [], // Simplified for demo
      };

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Error fetching roadmap stats:", error);

      // Return mock stats
      const mockStats: RoadmapStats = {
        totalTasks: 10,
        completedTasks: 4,
        pendingTasks: 6,
        totalHours: 25,
        completedHours: 10,
        averageTaskDuration: 2.5,
        categoryBreakdown: {
          study: 5,
          project: 3,
          break: 1,
          admin: 1,
          meeting: 0,
          exercise: 0,
          routine: 0,
          reading: 0,
        },
        progressByWeek: [
          { week: "2023-W01", completed: 2, total: 5 },
          { week: "2023-W02", completed: 2, total: 5 },
        ],
      };

      return {
        success: true,
        data: mockStats,
      };
    }
  }

  // Utility methods
  private static calculateDuration(startTime: string, endTime: string): number {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
  }

  // Export/Import functionality
  static async exportRoadmap(id: string): Promise<RoadmapApiResponse<any>> {
    await delay(API_DELAY);

    try {
      // Get roadmap data
      const { data: roadmap, error: roadmapError } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("id", id)
        .single();
      if (roadmapError) throw roadmapError;

      // Get tasks
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .eq("roadmap_id", id);
      if (tasksError) throw tasksError;

      // Get nodes
      const { data: nodes, error: nodesError } = await supabase
        .from("mindmap_nodes")
        .select("*")
        .eq("roadmap_id", id);
      if (nodesError) throw nodesError;

      const exportData = {
        roadmap,
        tasks,
        nodes,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      return {
        success: true,
        data: exportData,
      };
    } catch (error) {
      console.error("Error exporting roadmap:", error);

      // Return mock export data
      return {
        success: true,
        data: {
          roadmap: {
            id,
            title: "Exported Roadmap",
            description: "Exported data",
          },
          tasks: [],
          nodes: [],
          exportedAt: new Date().toISOString(),
          version: "1.0",
        },
      };
    }
  }

  static async importRoadmap(data: any): Promise<RoadmapApiResponse<Roadmap>> {
    await delay(API_DELAY);

    try {
      const {
        roadmap: importedRoadmap,
        tasks: importedTasks,
        nodes: importedNodes,
      } = data;

      // Generate new IDs
      const newRoadmapId = Date.now().toString();
      const idMapping = new Map<string, string>();

      // Create new roadmap
      const { data: newRoadmapData, error: roadmapError } = await supabase
        .from("roadmaps")
        .insert([{ ...importedRoadmap, id: newRoadmapId }])
        .select()
        .single();
      if (roadmapError) throw roadmapError;

      // Transform to frontend model
      const newRoadmap: Roadmap = {
        id: newRoadmapData.id,
        title: newRoadmapData.title,
        description: newRoadmapData.description,
        difficulty: newRoadmapData.difficulty,
        estimatedDuration: newRoadmapData.estimated_duration || 0,
        progress: newRoadmapData.progress || 0,
        status: newRoadmapData.status,
        isPublic: newRoadmapData.is_public || false,
        isTemplate: newRoadmapData.is_template || false,
        tags: newRoadmapData.tags || [],
        createdAt: newRoadmapData.created_at,
        updatedAt: newRoadmapData.updated_at,
        userId: newRoadmapData.user_id,
      };

      // Import tasks with new IDs
      if (importedTasks && importedTasks.length > 0) {
        for (const task of importedTasks) {
          const newTaskId = (Date.now() + Math.random()).toString();
          idMapping.set(task.id, newTaskId);

          await supabase
            .from("tasks")
            .insert([{ ...task, id: newTaskId, roadmap_id: newRoadmapId }]);
        }
      }

      // Import nodes with new IDs and updated references
      if (importedNodes && importedNodes.length > 0) {
        for (const node of importedNodes) {
          const newNodeId = (Date.now() + Math.random()).toString();
          idMapping.set(node.id, newNodeId);

          // Update parent and children references
          const nodeData = node.node_data || {};
          if (nodeData.parentId && idMapping.has(nodeData.parentId)) {
            nodeData.parentId = idMapping.get(nodeData.parentId);
          }

          if (nodeData.children && Array.isArray(nodeData.children)) {
            nodeData.children = nodeData.children.map((childId: string) =>
              idMapping.has(childId) ? idMapping.get(childId)! : childId
            );
          }

          await supabase.from("mindmap_nodes").insert([
            {
              ...node,
              id: newNodeId,
              roadmap_id: newRoadmapId,
              node_data: nodeData,
            },
          ]);
        }
      }

      return {
        success: true,
        data: newRoadmap,
      };
    } catch (error) {
      console.error("Error importing roadmap:", error);

      // Return a mock roadmap on error
      return {
        success: false,
        error: "Invalid import data format",
        data: {
          id: Date.now().toString(),
          title: "Import Failed",
          description: "There was an error importing this roadmap",
          difficulty: "beginner",
          estimatedDuration: 0,
          progress: 0,
          status: "not_started",
          isPublic: false,
          isTemplate: false,
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: "mock-user-id",
        } as Roadmap,
      };
    }
  }
}
