import { supabase } from "@/lib/supabase";
import type {
  WatchRoom,
  WatchRoomParticipant,
  WatchRoomMessage,
  CreateWatchRoomData,
  VideoSource,
  SyncEvent,
} from "../types/watchTogetherTypes";

// Mock data for demo mode
const mockWatchRooms: WatchRoom[] = [
  {
    id: "1",
    name: "Movie Night: Inception",
    description: "Let's watch and discuss Inception together",
    host_id: "user1",
    is_public: true,
    status: "playing",
    video_url: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    video_title: "Inception",
    video_duration: 8880, // 2h 28m in seconds
    current_time: 1200, // 20 minutes in
    max_participants: 20,
    room_settings: {
      allow_chat: true,
      auto_play: true,
      sync_threshold: 3,
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    host: {
      id: "user1",
      full_name: "Alex Johnson",
      avatar_url:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
    },
    participants: [
      {
        id: "p1",
        room_id: "1",
        user_id: "user1",
        joined_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        is_moderator: true,
        status: "online",
      },
      {
        id: "p2",
        room_id: "1",
        user_id: "user2",
        joined_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        is_moderator: false,
        status: "online",
      },
    ],
  },
  {
    id: "2",
    name: "Educational: Learn React",
    description: "Watch and discuss React tutorials together",
    host_id: "user2",
    is_public: true,
    status: "waiting",
    video_url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
    video_title: "React Crash Course",
    video_duration: 5400, // 1h 30m in seconds
    current_time: 0,
    max_participants: 15,
    room_settings: {
      allow_chat: true,
      auto_play: true,
      sync_threshold: 3,
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    host: {
      id: "user2",
      full_name: "Sarah Chen",
      avatar_url:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
    },
    participants: [
      {
        id: "p3",
        room_id: "2",
        user_id: "user2",
        joined_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        is_moderator: true,
        status: "online",
      },
    ],
  },
];

const mockMessages: Record<string, WatchRoomMessage[]> = {
  "1": [
    {
      id: "m1",
      room_id: "1",
      user_id: "user1",
      message: "Welcome to the Inception watch party!",
      message_type: "text",
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      user: {
        id: "user1",
        full_name: "Alex Johnson",
        avatar_url:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
      },
    },
    {
      id: "m2",
      room_id: "1",
      user_id: "user2",
      message: "Thanks for hosting! I've been wanting to watch this again.",
      message_type: "text",
      created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      user: {
        id: "user2",
        full_name: "Sarah Chen",
        avatar_url:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
      },
    },
  ],
  "2": [
    {
      id: "m3",
      room_id: "2",
      user_id: "user2",
      message: "Welcome to our React tutorial session!",
      message_type: "text",
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      user: {
        id: "user2",
        full_name: "Sarah Chen",
        avatar_url:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
      },
    },
  ],
};

export class WatchTogetherApi {
  /**
   * Get all watch rooms
   */
  static async getWatchRooms() {
    try {
      const { data, error } = await supabase
        .from("watch_rooms")
        .select(
          `
          *,
          participants:watch_room_participants(count),
          host:profiles!watch_rooms_host_id_fkey(id, full_name, avatar_url)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching watch rooms:", error);
      // Return mock data for demo
      return mockWatchRooms;
    }
  }

  /**
   * Get a specific watch room
   */
  static async getWatchRoom(roomId: string) {
    try {
      const { data, error } = await supabase
        .from("watch_rooms")
        .select(
          `
          *,
          participants:watch_room_participants(*,
            user:profiles(id, full_name, avatar_url)
          ),
          host:profiles!watch_rooms_host_id_fkey(id, full_name, avatar_url)
        `
        )
        .eq("id", roomId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching watch room:", error);
      // Return mock data for demo
      const mockRoom = mockWatchRooms.find((room) => room.id === roomId);
      if (!mockRoom) {
        throw new Error("Room not found");
      }
      return mockRoom;
    }
  }

  /**
   * Create a new watch room
   */
  static async createWatchRoom(data: CreateWatchRoomData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Parse video URL and extract metadata
      const videoData = await this.parseVideoUrl(data.video_url);

      // Clean up timestamp fields to ensure they're either valid ISO strings or null
      const cleanedScheduledStart =
        data.scheduled_start && data.scheduled_start.trim() !== ""
          ? data.scheduled_start
          : null;

      const roomData = {
        name: data.name,
        description: data.description,
        host_id: user.id,
        is_public: data.is_public,
        password_hash: data.password ? btoa(data.password) : null,
        status: "waiting" as const,
        video_url: videoData.url,
        video_title: videoData.title,
        video_duration: videoData.duration,
        current_time: 0,
        max_participants: data.max_participants,
        room_settings: data.room_settings,
        scheduled_start: cleanedScheduledStart,
      };

      const { data: room, error } = await supabase
        .from("watch_rooms")
        .insert(roomData)
        .select()
        .single();

      if (error) throw error;

      // Add creator as participant and moderator
      await supabase.from("watch_room_participants").insert({
        room_id: room.id,
        user_id: user.id,
        is_moderator: true,
        status: "online",
      });

      return room;
    } catch (error) {
      console.error("Error creating watch room:", error);

      // Create a mock room for demo
      const videoData = await this.parseVideoUrl(data.video_url);

      const newRoom: WatchRoom = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        host_id: "current-user",
        is_public: data.is_public,
        password_hash: data.password ? btoa(data.password) : undefined,
        status: "waiting",
        video_url: videoData.url,
        video_title: videoData.title || "Video",
        video_duration: videoData.duration || 0,
        current_time: 0,
        max_participants: data.max_participants,
        room_settings: data.room_settings,
        scheduled_start: data.scheduled_start || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host: {
          id: "current-user",
          full_name: "Current User",
          avatar_url:
            "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
        },
        participants: [
          {
            id: `p-${Date.now()}`,
            room_id: Date.now().toString(),
            user_id: "current-user",
            joined_at: new Date().toISOString(),
            is_moderator: true,
            status: "online",
          },
        ],
      };

      // Add to mock data
      mockWatchRooms.push(newRoom);
      mockMessages[newRoom.id] = [];

      return newRoom;
    }
  }

  /**
   * Join a watch room
   */
  static async joinWatchRoom(roomId: string, password?: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get room details
      const room = await this.getWatchRoom(roomId);

      // Check password if required
      if (
        room.password_hash &&
        (!password || btoa(password) !== room.password_hash)
      ) {
        throw new Error("Invalid password");
      }

      // Check if room has space
      const participantCount = room.participants?.length || 0;
      if (participantCount >= room.max_participants) {
        throw new Error("Room is full");
      }

      // Check if user is already in room
      const existingParticipant = room.participants?.find(
        (p: WatchRoomParticipant) => p.user_id === user.id
      );
      if (existingParticipant) {
        // Update status to online
        await supabase
          .from("watch_room_participants")
          .update({
            status: "online",
            left_at: null,
          })
          .eq("id", existingParticipant.id);
      } else {
        // Add as new participant
        await supabase.from("watch_room_participants").insert({
          room_id: roomId,
          user_id: user.id,
          is_moderator: false,
          status: "online",
        });
      }

      return room;
    } catch (error) {
      console.error("Error joining watch room:", error);

      // For demo, simulate joining the room
      const mockRoom = mockWatchRooms.find((room) => room.id === roomId);
      if (!mockRoom) {
        throw new Error("Room not found");
      }

      // Check password if required
      if (
        mockRoom.password_hash &&
        (!password || btoa(password) !== mockRoom.password_hash)
      ) {
        throw new Error("Invalid password");
      }

      // Check if room has space
      if (
        mockRoom.participants &&
        mockRoom.participants.length >= mockRoom.max_participants
      ) {
        throw new Error("Room is full");
      }

      // Add current user as participant if not already
      const existingParticipant = mockRoom.participants?.find(
        (p: WatchRoomParticipant) => p.user_id === "current-user"
      );
      if (!existingParticipant) {
        const newParticipant: WatchRoomParticipant = {
          id: `p-${Date.now()}`,
          room_id: mockRoom.id,
          user_id: "current-user",
          joined_at: new Date().toISOString(),
          is_moderator: false,
          status: "online",
        };

        mockRoom.participants = [
          ...(mockRoom.participants || []),
          newParticipant,
        ];
      } else {
        existingParticipant.status = "online";
        existingParticipant.left_at = undefined;
      }

      return mockRoom;
    }
  }

  /**
   * Leave a watch room
   */
  static async leaveWatchRoom(roomId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("watch_room_participants")
        .update({
          status: "offline",
          left_at: new Date().toISOString(),
        })
        .eq("room_id", roomId)
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error leaving watch room:", error);

      // For demo, simulate leaving the room
      const mockRoom = mockWatchRooms.find((room) => room.id === roomId);
      if (mockRoom && mockRoom.participants) {
        const participant = mockRoom.participants.find(
          (p: WatchRoomParticipant) => p.user_id === "current-user"
        );
        if (participant) {
          participant.status = "offline";
          participant.left_at = new Date().toISOString();
        }
      }
    }
  }

  /**
   * Update room playback state
   */
  static async updatePlaybackState(
    roomId: string,
    currentTime: number,
    isPlaying: boolean
  ) {
    try {
      const { error } = await supabase
        .from("watch_rooms")
        .update({
          current_time: currentTime,
          status: isPlaying ? "playing" : "paused",
          updated_at: new Date().toISOString(),
        })
        .eq("id", roomId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating playback state:", error);

      // For demo, update mock room
      const mockRoom = mockWatchRooms.find((room) => room.id === roomId);
      if (mockRoom) {
        mockRoom.current_time = currentTime;
        mockRoom.status = isPlaying ? "playing" : "paused";
        mockRoom.updated_at = new Date().toISOString();
      }
    }
  }

  /**
   * Send sync event
   */
  static async sendSyncEvent(roomId: string, event: Omit<SyncEvent, "userId">) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Broadcast sync event to other participants
      const channel = supabase.channel(`watch-room-${roomId}`);

      await channel.send({
        type: "broadcast",
        event: "sync",
        payload: {
          ...event,
          userId: user.id,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      console.error("Error sending sync event:", error);
      // For demo, we'll just log the error and continue
    }
  }

  /**
   * Get room messages
   */
  static async getRoomMessages(roomId: string, limit = 50) {
    try {
      const { data, error } = await supabase
        .from("watch_room_messages")
        .select(
          `
          *,
          user:profiles(id, full_name, avatar_url)
        `
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []).reverse();
    } catch (error) {
      console.error("Error fetching room messages:", error);
      // Return mock data for demo
      return mockMessages[roomId] || [];
    }
  }

  /**
   * Send a message to the room
   */
  static async sendMessage(
    roomId: string,
    message: string,
    messageType: WatchRoomMessage["message_type"] = "text"
  ) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("watch_room_messages")
        .insert({
          room_id: roomId,
          user_id: user.id,
          message,
          message_type: messageType,
        })
        .select(
          `
          *,
          user:profiles(id, full_name, avatar_url)
        `
        )
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error sending message:", error);

      // Create a mock message for demo
      const newMessage: WatchRoomMessage = {
        id: `m-${Date.now()}`,
        room_id: roomId,
        user_id: "current-user",
        message,
        message_type: messageType,
        created_at: new Date().toISOString(),
        user: {
          id: "current-user",
          full_name: "Current User",
          avatar_url:
            "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
        },
      };

      // Add to mock data
      if (!mockMessages[roomId]) {
        mockMessages[roomId] = [];
      }
      mockMessages[roomId].push(newMessage);

      return newMessage;
    }
  }

  /**
   * Parse video URL and extract metadata
   */
  static async parseVideoUrl(url?: string): Promise<VideoSource> {
    if (!url) {
      return {
        type: "url",
        url: "",
        title: "No video selected",
      };
    }

    // YouTube URL detection
    const youtubeRegex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];

      try {
        // Try to fetch video metadata from YouTube API
        // This would require a YouTube API key in production
        // For demo, we'll just return basic info
        return {
          type: "youtube",
          url: `https://www.youtube.com/watch?v=${videoId}`,
          title: "YouTube Video",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: 600, // Default 10 minutes
        };
      } catch (error) {
        console.error("Error fetching YouTube metadata:", error);
        return {
          type: "youtube",
          url: `https://www.youtube.com/watch?v=${videoId}`,
          title: "YouTube Video",
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
      }
    }

    // File upload or direct URL
    return {
      type: "url",
      url: url,
      title: "Video",
    };
  }

  /**
   * Subscribe to real-time updates for a room
   */
  static subscribeToRoom(
    roomId: string,
    callbacks: {
      onMessage?: (message: WatchRoomMessage) => void;
      onParticipantUpdate?: (participant: WatchRoomParticipant) => void;
      onSyncEvent?: (event: SyncEvent) => void;
      onPlaybackUpdate?: (room: Partial<WatchRoom>) => void;
    }
  ) {
    const subscriptions: Array<{ unsubscribe: () => void }> = [];

    // Subscribe to messages
    if (callbacks.onMessage) {
      const messageSubscription = supabase
        .channel(`watch-room-messages-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "watch_room_messages",
            filter: `room_id=eq.${roomId}`,
          },
          async (payload) => {
            try {
              // Fetch the complete message with user data
              const { data } = await supabase
                .from("watch_room_messages")
                .select(
                  `
                  *,
                  user:profiles(id, full_name, avatar_url)
                `
                )
                .eq("id", payload.new.id)
                .single();

              if (data) {
                callbacks.onMessage!(data);
              }
            } catch (error) {
              console.error("Error fetching message details:", error);

              // For demo, create a mock message with user data
              if (payload.new) {
                const mockUser = {
                  id: payload.new.user_id,
                  full_name:
                    payload.new.user_id === "current-user"
                      ? "Current User"
                      : "User " + payload.new.user_id,
                  avatar_url:
                    "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
                };

                callbacks.onMessage!({
                  id: payload.new.id,
                  room_id: payload.new.room_id,
                  user_id: payload.new.user_id,
                  message: payload.new.message,
                  message_type: payload.new.message_type,
                  created_at: payload.new.created_at,
                  ...payload.new,
                  user: mockUser,
                });
              }
            }
          }
        )
        .subscribe();

      subscriptions.push(messageSubscription);
    }

    // Subscribe to participant updates
    if (callbacks.onParticipantUpdate) {
      const participantSubscription = supabase
        .channel(`watch-room-participants-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "watch_room_participants",
            filter: `room_id=eq.${roomId}`,
          },
          (payload) => {
            callbacks.onParticipantUpdate!(payload.new as WatchRoomParticipant);
          }
        )
        .subscribe();

      subscriptions.push(participantSubscription);
    }

    // Subscribe to sync events
    if (callbacks.onSyncEvent) {
      const syncSubscription = supabase
        .channel(`watch-room-sync-${roomId}`)
        .on("broadcast", { event: "sync" }, (payload) => {
          callbacks.onSyncEvent!(payload.payload as SyncEvent);
        })
        .subscribe();

      subscriptions.push(syncSubscription);
    }

    // Subscribe to playback updates
    if (callbacks.onPlaybackUpdate) {
      const playbackSubscription = supabase
        .channel(`watch-room-playback-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "watch_rooms",
            filter: `id=eq.${roomId}`,
          },
          (payload) => {
            callbacks.onPlaybackUpdate!(payload.new as WatchRoom);
          }
        )
        .subscribe();

      subscriptions.push(playbackSubscription);
    }

    // Return cleanup function
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }
}
