import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { StudyRoomApi } from "../api/studyRoomApi";
import { useUser } from "@/features/auth/hooks/useUser";
import type {
  StudyRoom,
  StudyRoomMessage,
  StudyTask,
  PomodoroSession,
  CreateStudyRoomData,
  JoinRoomData,
  StudyRoomFilters,
} from "../types/studyRoomTypes";

interface UseStudyRoomsState {
  rooms: StudyRoom[];
  loading: boolean;
  error: string | null;
}

export function useStudyRooms(filters?: StudyRoomFilters) {
  const { user } = useUser();
  const [state, setState] = useState<UseStudyRoomsState>({
    rooms: [],
    loading: true,
    error: null,
  });

  const loadRooms = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const rooms = await StudyRoomApi.getStudyRooms(filters);
      setState((prev) => ({ ...prev, rooms, loading: false }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load study rooms";
      setState((prev) => ({ ...prev, error: message, loading: false }));
      toast.error(message);
    }
  }, [filters]);

  const createRoom = useCallback(async (data: CreateStudyRoomData) => {
    try {
      const room = await StudyRoomApi.createStudyRoom(data);
      setState((prev) => ({
        ...prev,
        rooms: [room, ...prev.rooms],
      }));
      toast.success("Study room created successfully!");
      return room;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create room";
      toast.error(message);
      throw error;
    }
  }, []);

  const joinRoom = useCallback(async (data: JoinRoomData) => {
    try {
      const room = await StudyRoomApi.joinStudyRoom(data);
      toast.success(`Joined ${room.name} successfully!`);
      return room;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to join room";
      toast.error(message);
      throw error;
    }
  }, []);

  const leaveRoom = useCallback(
    async (roomId: string) => {
      try {
        if (!user?.id) throw new Error("User not authenticated");
        await StudyRoomApi.leaveStudyRoom(roomId, user.id);
        toast.success("Left room successfully");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to leave room";
        toast.error(message);
        throw error;
      }
    },
    [user]
  );

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    ...state,
    createRoom,
    joinRoom,
    leaveRoom,
    refresh: loadRooms,
  };
}

interface UseStudyRoomState {
  room: StudyRoom | null;
  messages: StudyRoomMessage[];
  tasks: StudyTask[];
  pomodoroSessions: PomodoroSession[];
  loading: boolean;
  error: string | null;
}

export function useStudyRoom(roomId: string) {
  const { user } = useUser();
  const [state, setState] = useState<UseStudyRoomState>({
    room: null,
    messages: [],
    tasks: [],
    pomodoroSessions: [],
    loading: true,
    error: null,
  });

  const loadRoomData = useCallback(async () => {
    if (!roomId) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [room, messages, tasks, pomodoroSessions] = await Promise.all([
        StudyRoomApi.getStudyRoom(roomId),
        StudyRoomApi.getRoomMessages(roomId),
        StudyRoomApi.getRoomTasks(roomId),
        StudyRoomApi.getActivePomodoroSessions(roomId),
      ]);

      setState((prev) => ({
        ...prev,
        room,
        messages,
        tasks,
        pomodoroSessions,
        loading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load room data";
      setState((prev) => ({ ...prev, error: message, loading: false }));
      toast.error(message);
    }
  }, [roomId]);

  const sendMessage = useCallback(
    async (message: string) => {
      try {
        if (!user?.id) throw new Error("User not authenticated");
        const newMessage = await StudyRoomApi.sendMessage(
          roomId,
          message,
          "text",
          user.id
        );
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send message";
        toast.error(message);
      }
    },
    [roomId, user]
  );

  const createTask = useCallback(
    async (taskData: Partial<StudyTask>) => {
      try {
        const task = await StudyRoomApi.createTask(roomId, taskData);
        setState((prev) => ({
          ...prev,
          tasks: [...prev.tasks, task],
        }));
        toast.success("Task created successfully!");
        return task;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create task";
        toast.error(message);
        throw error;
      }
    },
    [roomId]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<StudyTask>) => {
      try {
        const updatedTask = await StudyRoomApi.updateTask(taskId, updates);
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) =>
            task.id === taskId ? updatedTask : task
          ),
        }));
        toast.success("Task updated successfully!");
        return updatedTask;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update task";
        toast.error(message);
        throw error;
      }
    },
    []
  );

  const startPomodoro = useCallback(
    async (duration: number, breakDuration: number, targetCycles: number) => {
      try {
        if (!user?.id) throw new Error("User not authenticated");
        const session = await StudyRoomApi.startPomodoroSession(
          roomId,
          duration,
          breakDuration,
          targetCycles,
          user.id
        );
        setState((prev) => ({
          ...prev,
          pomodoroSessions: [...prev.pomodoroSessions, session],
        }));
        toast.success("Pomodoro session started!");
        return session;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to start Pomodoro";
        toast.error(message);
        throw error;
      }
    },
    [roomId, user]
  );

  const updatePomodoro = useCallback(
    async (sessionId: string, updates: Partial<PomodoroSession>) => {
      try {
        const updatedSession = await StudyRoomApi.updatePomodoroSession(
          sessionId,
          updates
        );
        setState((prev) => ({
          ...prev,
          pomodoroSessions: prev.pomodoroSessions.map((session) =>
            session.id === sessionId ? updatedSession : session
          ),
        }));
        return updatedSession;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to update Pomodoro";
        toast.error(message);
        throw error;
      }
    },
    []
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId) return;

    const cleanup = StudyRoomApi.subscribeToRoom(roomId, {
      onMessage: (message) => {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      },
      onTaskUpdate: (task) => {
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.some((t) => t.id === task.id)
            ? prev.tasks.map((t) => (t.id === task.id ? task : t))
            : [...prev.tasks, task],
        }));
      },
      onPomodoroUpdate: (session) => {
        setState((prev) => ({
          ...prev,
          pomodoroSessions: prev.pomodoroSessions.some(
            (s) => s.id === session.id
          )
            ? prev.pomodoroSessions.map((s) =>
                s.id === session.id ? session : s
              )
            : [...prev.pomodoroSessions, session],
        }));
      },
    });

    return cleanup;
  }, [roomId]);

  useEffect(() => {
    loadRoomData();
  }, [loadRoomData]);

  return {
    ...state,
    sendMessage,
    createTask,
    updateTask,
    startPomodoro,
    updatePomodoro,
    refresh: loadRoomData,
  };
}
