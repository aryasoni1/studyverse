import { supabase } from "@/lib/supabase";
import type {
  StudyRoom,
  StudyRoomParticipant,
  StudyRoomMessage,
  StudyTask,
  PomodoroSession,
  CreateStudyRoomData,
  JoinRoomData,
  StudyRoomFilters,
} from "../types/studyRoomTypes";

export class StudyRoomApi {
  /**
   * Get all study rooms with optional filters
   */
  static async getStudyRooms(filters?: StudyRoomFilters): Promise<StudyRoom[]> {
    let query = supabase.from("study_rooms").select("*", { count: "exact" });
    if (filters) {
      if (filters.topic) query = query.eq("topic", filters.topic);
      if (filters.status) query = query.eq("status", filters.status);
      if (filters.is_public !== undefined)
        query = query.eq("is_public", filters.is_public);
      if (filters.host_id) query = query.eq("host_id", filters.host_id);
    }
    // Only fetch public rooms
    query = query.eq("is_public", true);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []) as StudyRoom[];
  }

  /**
   * Get a specific study room by ID
   */
  static async getStudyRoom(roomId: string): Promise<StudyRoom | null> {
    const { data, error } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", roomId)
      .single();
    if (error) throw new Error(error.message);
    return data as StudyRoom;
  }

  /**
   * Create a new study room
   */
  static async createStudyRoom(data: CreateStudyRoomData): Promise<StudyRoom> {
    const { data: created, error } = await supabase
      .from("study_rooms")
      .insert([{ ...data }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return created as StudyRoom;
  }

  /**
   * Join a study room
   */
  static async joinStudyRoom(data: JoinRoomData): Promise<StudyRoom> {
    // Add participant to study_room_participants
    const { error: joinError } = await supabase
      .from("study_room_participants")
      .upsert(
        [
          {
            room_id: data.room_id,
            user_id: data.user_id,
            is_moderator: false,
          },
        ],
        { onConflict: "room_id,user_id" }
      );
    if (joinError) throw new Error(joinError.message);
    // Return the room
    return (await this.getStudyRoom(data.room_id)) as StudyRoom;
  }

  /**
   * Leave a study room
   */
  static async leaveStudyRoom(roomId: string, userId?: string): Promise<void> {
    if (!userId) throw new Error("User ID required to leave room");
    const { error } = await supabase
      .from("study_room_participants")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  }

  /**
   * Get room messages
   */
  static async getRoomMessages(
    roomId: string,
    limit = 50
  ): Promise<StudyRoomMessage[]> {
    const { data, error } = await supabase
      .from("study_room_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data || []) as StudyRoomMessage[];
  }

  /**
   * Send a message to the room
   */
  static async sendMessage(
    roomId: string,
    message: string,
    messageType: StudyRoomMessage["message_type"] = "text",
    userId?: string
  ): Promise<StudyRoomMessage> {
    if (!userId) throw new Error("User ID required to send message");
    const { data, error } = await supabase
      .from("study_room_messages")
      .insert({
        room_id: roomId,
        user_id: userId,
        message,
        message_type: messageType,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as StudyRoomMessage;
  }

  /**
   * Get room tasks
   */
  static async getRoomTasks(roomId: string): Promise<StudyTask[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("roadmap_id", roomId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []) as StudyTask[];
  }

  /**
   * Create a task in the room
   */
  static async createTask(
    roomId: string,
    taskData: Partial<StudyTask>
  ): Promise<StudyTask> {
    const { data, error } = await supabase
      .from("tasks")
      .insert({ ...taskData, roadmap_id: roomId })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as StudyTask;
  }

  /**
   * Update task status
   */
  static async updateTask(
    taskId: string,
    updates: Partial<StudyTask>
  ): Promise<StudyTask> {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as StudyTask;
  }

  /**
   * Start a Pomodoro session
   */
  static async startPomodoroSession(
    roomId: string,
    duration: number,
    breakDuration: number,
    targetCycles: number,
    userId?: string
  ): Promise<PomodoroSession> {
    if (!userId) throw new Error("User ID required to start Pomodoro");
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .insert({
        room_id: roomId,
        user_id: userId,
        duration,
        break_duration: breakDuration,
        target_cycles: targetCycles,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PomodoroSession;
  }

  /**
   * Update Pomodoro session
   */
  static async updatePomodoroSession(
    sessionId: string,
    updates: Partial<PomodoroSession>
  ): Promise<PomodoroSession> {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .update(updates)
      .eq("id", sessionId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as PomodoroSession;
  }

  /**
   * Get active Pomodoro sessions for a room
   */
  static async getActivePomodoroSessions(
    roomId: string
  ): Promise<PomodoroSession[]> {
    const { data, error } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("room_id", roomId)
      .is("completed_at", null)
      .order("started_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as PomodoroSession[];
  }

  /**
   * Subscribe to real-time updates for a room
   */
  static subscribeToRoom(
    roomId: string,
    callbacks: {
      onMessage?: (message: StudyRoomMessage) => void;
      onParticipantUpdate?: (participant: StudyRoomParticipant) => void;
      onTaskUpdate?: (task: StudyTask) => void;
      onPomodoroUpdate?: (session: PomodoroSession) => void;
    }
  ) {
    // Example: subscribe to messages
    const messageSub = supabase
      .channel(`room-messages-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "study_room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (callbacks.onMessage && payload.new)
            callbacks.onMessage(payload.new as StudyRoomMessage);
        }
      )
      .subscribe();
    // Only subscribe to messages for now
    return () => {
      supabase.removeChannel(messageSub);
    };
  }

  /**
   * Generate LiveKit token for room
   */
  static async getLiveKitToken(roomId: string, participantName?: string) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const { data, error } = await supabase.functions.invoke("livekit-token", {
        body: {
          room_id: roomId,
          participant_name: participantName,
          permissions: {
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            canUpdateMetadata: false,
          },
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error getting LiveKit token:", error);
      // Return mock token for development
      return {
        token: "mock-token",
        room_name: "Study Room",
        participant_identity: "mock-user",
      };
    }
  }
}
