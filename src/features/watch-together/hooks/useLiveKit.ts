import { useState, useEffect, useCallback, useRef } from "react";

// Local type definitions (not exported from studyRoomTypes)
interface LiveKitParticipant {
  identity: string;
  name: string;
  isLocal: boolean;
  isSpeaking: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
}

interface LiveKitConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  participants: LiveKitParticipant[];
  localParticipant?: LiveKitParticipant;
  error?: string;
}

export function useLiveKit(roomId: string, participantName?: string) {
  const [connectionState, setConnectionState] =
    useState<LiveKitConnectionState>({
      isConnected: false,
      isConnecting: false,
      participants: [],
    });

  const roomRef = useRef<unknown>(null);
  const tokenRef = useRef<string | null>(null);

  const connect = useCallback(async () => {
    if (connectionState.isConnecting || connectionState.isConnected) return;

    try {
      setConnectionState((prev: LiveKitConnectionState) => ({
        ...prev,
        isConnecting: true,
        error: undefined,
      }));

      // Get LiveKit token
      try {
        const tokenData = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/livekit-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              room_id: roomId,
              participant_name: participantName,
              permissions: {
                canPublish: true,
                canSubscribe: true,
                canPublishData: true,
              },
            }),
          }
        ).then((res) => {
          if (!res.ok) throw new Error("Failed to get token");
          return res.json();
        });

        tokenRef.current = tokenData.token;
      } catch {
        console.log("Failed to get token, using mock token instead");
        // Use mock token if API fails
        tokenRef.current = "mock-token";
      }

      // For now, simulate connection since we don't have actual LiveKit
      // In production, you would use the LiveKit SDK here
      setTimeout(() => {
        setConnectionState((prev: LiveKitConnectionState) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          participants: [
            {
              identity: "local-user",
              name: participantName || "You",
              isLocal: true,
              isSpeaking: false,
              audioEnabled: true,
              videoEnabled: false,
              screenShareEnabled: false,
            },
          ],
          localParticipant: {
            identity: "local-user",
            name: participantName || "You",
            isLocal: true,
            isSpeaking: false,
            audioEnabled: true,
            videoEnabled: false,
            screenShareEnabled: false,
          },
        }));
      }, 1000);
    } catch (error) {
      console.error("LiveKit connection error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to connect to room";
      setConnectionState((prev: LiveKitConnectionState) => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
    }
  }, [
    roomId,
    participantName,
    connectionState.isConnecting,
    connectionState.isConnected,
  ]);

  const disconnect = useCallback(() => {
    if (
      roomRef.current &&
      typeof roomRef.current === "object" &&
      "disconnect" in roomRef.current &&
      typeof (roomRef.current as { disconnect: () => void }).disconnect ===
        "function"
    ) {
      (roomRef.current as { disconnect: () => void }).disconnect();
      roomRef.current = null;
    }

    setConnectionState({
      isConnected: false,
      isConnecting: false,
      participants: [],
    });
  }, []);

  const toggleAudio = useCallback(async () => {
    // In production, this would toggle the local participant's audio
    setConnectionState((prev: LiveKitConnectionState) => ({
      ...prev,
      participants: prev.participants.map((p: LiveKitParticipant) =>
        p.isLocal ? { ...p, audioEnabled: !p.audioEnabled } : p
      ),
      localParticipant: prev.localParticipant
        ? {
            ...prev.localParticipant,
            audioEnabled: !prev.localParticipant.audioEnabled,
          }
        : undefined,
    }));
  }, []);

  const toggleVideo = useCallback(async () => {
    // In production, this would toggle the local participant's video
    setConnectionState((prev: LiveKitConnectionState) => ({
      ...prev,
      participants: prev.participants.map((p: LiveKitParticipant) =>
        p.isLocal ? { ...p, videoEnabled: !p.videoEnabled } : p
      ),
      localParticipant: prev.localParticipant
        ? {
            ...prev.localParticipant,
            videoEnabled: !prev.localParticipant.videoEnabled,
          }
        : undefined,
    }));
  }, []);

  const toggleScreenShare = useCallback(async () => {
    // In production, this would toggle screen sharing
    setConnectionState((prev: LiveKitConnectionState) => ({
      ...prev,
      participants: prev.participants.map((p: LiveKitParticipant) =>
        p.isLocal ? { ...p, screenShareEnabled: !p.screenShareEnabled } : p
      ),
      localParticipant: prev.localParticipant
        ? {
            ...prev.localParticipant,
            screenShareEnabled: !prev.localParticipant.screenShareEnabled,
          }
        : undefined,
    }));
  }, []);

  // Simulate adding a participant for demo purposes
  const addDemoParticipant = useCallback(() => {
    const randomId = Math.floor(Math.random() * 1000);
    const newParticipant: LiveKitParticipant = {
      identity: `user-${randomId}`,
      name: `User ${randomId}`,
      isLocal: false,
      isSpeaking: false,
      audioEnabled: Math.random() > 0.5,
      videoEnabled: Math.random() > 0.7,
      screenShareEnabled: false,
    };

    setConnectionState((prev: LiveKitConnectionState) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
  }, []);

  // Add a demo participant every 5 seconds for testing
  useEffect(() => {
    if (connectionState.isConnected) {
      const interval = setInterval(() => {
        if (connectionState.participants.length < 4) {
          addDemoParticipant();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [
    connectionState.isConnected,
    connectionState.participants.length,
    addDemoParticipant,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...connectionState,
    connect,
    disconnect,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  };
}
