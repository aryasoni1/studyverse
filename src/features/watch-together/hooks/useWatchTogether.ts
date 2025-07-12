import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WatchTogetherApi } from "../api/watchTogetherApi";
import type {
  WatchRoom,
  WatchRoomMessage,
  CreateWatchRoomData,
  PlaybackState,
  SyncEvent,
} from "../types/watchTogetherTypes";

interface UseWatchRoomsState {
  rooms: WatchRoom[];
  loading: boolean;
  error: string | null;
}

export function useWatchRooms() {
  const [state, setState] = useState<UseWatchRoomsState>({
    rooms: [],
    loading: true,
    error: null,
  });

  const loadRooms = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const rooms = await WatchTogetherApi.getWatchRooms();
      setState((prev) => ({ ...prev, rooms, loading: false }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load watch rooms";
      setState((prev) => ({ ...prev, error: message, loading: false }));
      toast.error(message);
    }
  }, []);

  const createRoom = useCallback(async (data: CreateWatchRoomData) => {
    try {
      const room = await WatchTogetherApi.createWatchRoom(data);
      setState((prev) => ({
        ...prev,
        rooms: [room, ...prev.rooms],
      }));
      toast.success("Watch room created successfully!");
      return room;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create room";
      toast.error(message);
      throw error;
    }
  }, []);

  const joinRoom = useCallback(async (roomId: string, password?: string) => {
    try {
      const room = await WatchTogetherApi.joinWatchRoom(roomId, password);
      toast.success(`Joined ${room.name} successfully!`);
      return room;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to join room";
      toast.error(message);
      throw error;
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    ...state,
    createRoom,
    joinRoom,
    refresh: loadRooms,
  };
}

interface UseWatchRoomState {
  room: WatchRoom | null;
  messages: WatchRoomMessage[];
  playbackState: PlaybackState;
  loading: boolean;
  error: string | null;
}

export function useWatchRoom(roomId: string) {
  const [state, setState] = useState<UseWatchRoomState>({
    room: null,
    messages: [],
    playbackState: {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      buffered: 0,
      volume: 1,
      muted: false,
    },
    loading: true,
    error: null,
  });

  const loadRoomData = useCallback(async () => {
    if (!roomId) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const [room, messages] = await Promise.all([
        WatchTogetherApi.getWatchRoom(roomId),
        WatchTogetherApi.getRoomMessages(roomId),
      ]);

      setState((prev) => ({
        ...prev,
        room,
        messages,
        playbackState: {
          ...prev.playbackState,
          isPlaying: room.status === "playing",
          currentTime: room.current_time || 0,
        },
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
        const newMessage = await WatchTogetherApi.sendMessage(roomId, message);
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
    [roomId]
  );

  const updatePlayback = useCallback(
    async (currentTime: number, isPlaying: boolean) => {
      try {
        await WatchTogetherApi.updatePlaybackState(
          roomId,
          currentTime,
          isPlaying
        );
        setState((prev) => ({
          ...prev,
          playbackState: {
            ...prev.playbackState,
            currentTime,
            isPlaying,
          },
        }));
      } catch (error) {
        console.error("Failed to update playback state:", error);
      }
    },
    [roomId]
  );

  const sendSyncEvent = useCallback(
    async (event: Omit<SyncEvent, "userId">) => {
      try {
        await WatchTogetherApi.sendSyncEvent(roomId, event);
      } catch (error) {
        console.error("Failed to send sync event:", error);
      }
    },
    [roomId]
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!roomId) return;

    const cleanup = WatchTogetherApi.subscribeToRoom(roomId, {
      onMessage: (message) => {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      },
      onSyncEvent: (event) => {
        setState((prev) => ({
          ...prev,
          playbackState: {
            ...prev.playbackState,
            currentTime: event.currentTime,
            isPlaying: event.type === "play",
          },
        }));
      },
      onPlaybackUpdate: (roomUpdate) => {
        setState((prev) => ({
          ...prev,
          room: prev.room ? { ...prev.room, ...roomUpdate } : null,
          playbackState: {
            ...prev.playbackState,
            currentTime:
              roomUpdate.current_time || prev.playbackState.currentTime,
            isPlaying: roomUpdate.status === "playing",
          },
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
    updatePlayback,
    sendSyncEvent,
    refresh: loadRoomData,
  };
}
