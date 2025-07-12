import { useState, useEffect, useCallback, useRef } from "react";
import {
  Room,
  Track,
  createLocalVideoTrack,
  createLocalAudioTrack,
  RemoteParticipant,
  LocalParticipant,
  TrackPublication,
  Track as LiveKitTrack,
  RoomEvent,
} from "livekit-client";
import { StudyRoomApi } from "../api/studyRoomApi";

// Define a type for participant info used in the UI
export interface LiveKitParticipantInfo {
  identity: string;
  name: string;
  isLocal: boolean;
  videoTrack?: LiveKitTrack;
  audioTrack?: LiveKitTrack;
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenShareEnabled: boolean;
}

export function useLiveKit(roomId: string, participantName?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<LiveKitParticipantInfo[]>(
    []
  );
  const roomRef = useRef<Room | null>(null);

  // Connect to LiveKit and publish camera/mic
  const connectToRoom = useCallback(async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);

    try {
      // 1. Get token from your backend
      const { token } = await StudyRoomApi.getLiveKitToken(
        roomId,
        participantName
      );

      // 2. Get LiveKit server URL from Vite env
      const wsUrl = import.meta.env.VITE_LIVEKIT_WS_URL;
      if (!wsUrl) {
        throw new Error(
          "VITE_LIVEKIT_WS_URL is not set in your environment variables."
        );
      }

      // 3. Connect to LiveKit server
      const room = new Room();
      await room.connect(wsUrl, token);

      // 4. Publish camera and mic
      const videoTrack = await createLocalVideoTrack();
      const audioTrack = await createLocalAudioTrack();
      await room.localParticipant.publishTrack(videoTrack);
      await room.localParticipant.publishTrack(audioTrack);

      // 5. Listen for participant events
      const updateParticipants = () => {
        setParticipants([
          {
            identity: room.localParticipant.identity,
            name: participantName || "You",
            isLocal: true,
            videoTrack: getTrack(room.localParticipant, Track.Source.Camera),
            audioTrack: getTrack(
              room.localParticipant,
              Track.Source.Microphone
            ),
            videoEnabled: room.localParticipant.isCameraEnabled,
            audioEnabled: room.localParticipant.isMicrophoneEnabled,
            screenShareEnabled: false,
          },
          ...Array.from(room.remoteParticipants.values()).map((p) => {
            const remote = p as RemoteParticipant;
            return {
              identity: remote.identity,
              name: remote.name || remote.identity,
              isLocal: false,
              videoTrack: getTrack(remote, Track.Source.Camera),
              audioTrack: getTrack(remote, Track.Source.Microphone),
              videoEnabled: remote.isCameraEnabled,
              audioEnabled: remote.isMicrophoneEnabled,
              screenShareEnabled: false,
            };
          }),
        ]);
      };

      room.on(RoomEvent.ParticipantConnected, updateParticipants);
      room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
      room.on(RoomEvent.TrackSubscribed, updateParticipants);
      room.on(RoomEvent.TrackUnsubscribed, updateParticipants);
      updateParticipants();

      roomRef.current = room;
      setIsConnected(true);
    } catch (error) {
      console.error("LiveKit connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [roomId, participantName, isConnected, isConnecting]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, []);

  // Helper to get a track from a participant
  function getTrack(
    participant: LocalParticipant | RemoteParticipant,
    source: Track.Source
  ): LiveKitTrack | undefined {
    const pub: TrackPublication | undefined =
      participant.getTrackPublication(source);
    return pub && pub.isSubscribed ? pub.track : undefined;
  }

  // Toggle local audio
  const toggleAudio = useCallback(() => {
    if (roomRef.current) {
      const local = roomRef.current.localParticipant;
      if (local.isMicrophoneEnabled) {
        local.setMicrophoneEnabled(false);
      } else {
        local.setMicrophoneEnabled(true);
      }
      // Update participants state
      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal ? { ...p, audioEnabled: !p.audioEnabled } : p
        )
      );
    }
  }, []);

  // Toggle local video
  const toggleVideo = useCallback(() => {
    if (roomRef.current) {
      const local = roomRef.current.localParticipant;
      if (local.isCameraEnabled) {
        local.setCameraEnabled(false);
      } else {
        local.setCameraEnabled(true);
      }
      // Update participants state
      setParticipants((prev) =>
        prev.map((p) =>
          p.isLocal ? { ...p, videoEnabled: !p.videoEnabled } : p
        )
      );
    }
  }, []);

  // Toggle local screen share (basic implementation)
  const toggleScreenShare = useCallback(() => {
    // This is a placeholder; implement screen share logic as needed
    // For now, just toggle a flag in participants state
    setParticipants((prev) =>
      prev.map((p) =>
        p.isLocal ? { ...p, screenShareEnabled: !p.screenShareEnabled } : p
      )
    );
  }, []);

  return {
    isConnected,
    isConnecting,
    participants,
    connect: connectToRoom,
    disconnect: () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
        setIsConnected(false);
        setParticipants([]);
      }
    },
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}
