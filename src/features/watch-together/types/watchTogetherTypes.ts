export interface WatchRoom {
  id: string;
  name: string;
  description?: string;
  host_id: string;
  is_public: boolean;
  password_hash?: string;
  status: "waiting" | "playing" | "paused" | "ended";
  scheduled_start?: string;
  video_url?: string;
  video_title?: string;
  video_duration?: number;
  current_time: number;
  max_participants: number;
  room_settings: {
    allow_chat?: boolean;
    auto_play?: boolean;
    sync_threshold?: number;
  };
  created_at: string;
  updated_at: string;
  host?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  participants?: WatchRoomParticipant[];
}

export interface WatchRoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string;
  is_moderator: boolean;
  status: "online" | "away" | "offline";
}

export interface WatchRoomMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  message_type: "text" | "system" | "reaction";
  created_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateWatchRoomData {
  name: string;
  description?: string;
  is_public: boolean;
  password?: string;
  scheduled_start?: string;
  video_url?: string;
  max_participants: number;
  room_settings: WatchRoom["room_settings"];
}

export interface VideoSource {
  type: "youtube" | "file" | "url";
  url: string;
  title?: string;
  duration?: number;
  thumbnail?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
}

export interface SyncEvent {
  type: "play" | "pause" | "seek" | "sync";
  timestamp: number;
  currentTime: number;
  userId: string;
}
