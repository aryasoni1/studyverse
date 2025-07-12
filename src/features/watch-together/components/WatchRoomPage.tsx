import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Maximize,
  Share,
  MessageSquare,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ChatSection } from "../components/ChatSection";
import { useWatchRoom } from "../hooks/useWatchTogether";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import YouTube, { YouTubePlayer } from "react-youtube";
import { cn } from "@/lib/utils";

export function WatchRoomPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();
  const {
    room,
    messages,
    playbackState,
    loading,
    error,
    sendMessage,
    sendSyncEvent,
  } = useWatchRoom(id || "");

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [localPlaybackState, setLocalPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    muted: false,
  });
  const playerRef = useRef<YouTubePlayer | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle play/pause using YouTube API
  const togglePlayPause = () => {
    if (playerRef.current) {
      if (localPlaybackState.isPlaying) {
        playerRef.current.pauseVideo();
        sendSyncEvent({
          type: "pause",
          timestamp: Date.now(),
          currentTime: playerRef.current.getCurrentTime(),
        });
      } else {
        playerRef.current.playVideo();
        sendSyncEvent({
          type: "play",
          timestamp: Date.now(),
          currentTime: playerRef.current.getCurrentTime(),
        });
      }
    }
  };

  // Seek to a specific time using YouTube API
  const handleSeek = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value[0], true);
      sendSyncEvent({
        type: "seek",
        timestamp: Date.now(),
        currentTime: value[0],
      });
    }
  };

  // Toggle mute using YouTube API
  const toggleMute = () => {
    if (playerRef.current) {
      if (localPlaybackState.muted) {
        playerRef.current.unMute();
        setLocalPlaybackState((prev) => ({ ...prev, muted: false }));
      } else {
        playerRef.current.mute();
        setLocalPlaybackState((prev) => ({ ...prev, muted: true }));
      }
    }
  };

  // Change volume using YouTube API
  const handleVolumeChange = (value: number[]) => {
    if (playerRef.current) {
      playerRef.current.setVolume(value[0] * 100);
      setLocalPlaybackState((prev) => ({
        ...prev,
        volume: value[0],
        muted: value[0] === 0,
      }));
    }
  };

  // Skip forward/backward using YouTube API
  const handleSkip = (seconds: number) => {
    if (playerRef.current) {
      const newTime = playerRef.current.getCurrentTime() + seconds;
      playerRef.current.seekTo(newTime, true);
      sendSyncEvent({
        type: "seek",
        timestamp: Date.now(),
        currentTime: newTime,
      });
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setIsControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 3000);
  };

  // Sync with server playback state
  useEffect(() => {
    if (!playerRef.current || !room) return;
    // Sync playback state
    if (playbackState.isPlaying && !localPlaybackState.isPlaying) {
      playerRef.current.playVideo();
    } else if (!playbackState.isPlaying && localPlaybackState.isPlaying) {
      playerRef.current.pauseVideo();
    }
    // Sync current time if difference is significant
    const timeDiff = Math.abs(
      playerRef.current.getCurrentTime() - playbackState.currentTime
    );
    if (timeDiff > (room.room_settings.sync_threshold || 3)) {
      playerRef.current.seekTo(playbackState.currentTime, true);
    }
  }, [playbackState, localPlaybackState.isPlaying, room]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // If room is in waiting state and current user is host
  const isHost = user && room && room.host?.id === user.id;
  const isWaiting = room && room.status === "waiting";

  function extractYouTubeId(url: string) {
    const match = url.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? match[1] : "";
  }

  // Early returns (after all hooks)
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Please log in to access this room.
      </div>
    );
  }
  if (!id) {
    return <div>Room not found</div>;
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  if (error || !room) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Room not found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The requested room could not be found."}
          </p>
          <Button onClick={() => navigate("/app/watch-together")}>
            Back to Rooms
          </Button>
        </div>
      </div>
    );
  }

  const handleStartNow = async () => {
    if (!room.id) return;
    await supabase
      .from("watch_rooms")
      .update({ status: "playing" })
      .eq("id", room.id);
    window.location.reload();
  };

  if (isWaiting && !isHost) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 bg-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/watch-together")}
            className="text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>
          <h1 className="text-lg font-semibold">{room.name}</h1>
          <div></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="h-24 w-24 rounded-full bg-gray-700 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Waiting for the host</h2>
            <p className="text-gray-400 mb-6">
              This show will be started by {room.host?.full_name || "the host"}.
              Hang tight!
            </p>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">
                Share this link to invite friends
              </p>
              <div className="bg-gray-800 p-3 rounded-lg text-sm overflow-hidden">
                {window.location.href}
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Start now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isWaiting && isHost) {
    return (
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <div className="flex items-center justify-between p-4 bg-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/watch-together")}
            className="text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>
          <h1 className="text-lg font-semibold">{room.name}</h1>
          <div></div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="h-24 w-24 rounded-full bg-gray-700 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
            <p className="text-gray-400 mb-6">
              You are the host. Click below to start the show for everyone!
            </p>
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">
                Share this link to invite friends
              </p>
              <div className="bg-gray-800 p-3 rounded-lg text-sm overflow-hidden">
                {window.location.href}
              </div>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleStartNow}
            >
              Start now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Back Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/watch-together")}
          className="text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rooms
        </Button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Container */}
        <div
          ref={videoContainerRef}
          className="flex-1 relative bg-black"
          onMouseMove={handleMouseMove}
        >
          {room.video_url && extractYouTubeId(room.video_url) ? (
            <YouTube
              videoId={extractYouTubeId(room.video_url)}
              opts={{
                width: "100%",
                height: "480",
                playerVars: {
                  autoplay: 0,
                  controls: 1,
                },
              }}
              onReady={(event: { target: YouTubePlayer }) => {
                playerRef.current = event.target;
                setLocalPlaybackState((prev) => ({
                  ...prev,
                  duration: event.target.getDuration(),
                  currentTime: event.target.getCurrentTime(),
                  isPlaying: event.target.getPlayerState() === 1,
                  volume: event.target.getVolume() / 100,
                  muted: event.target.isMuted(),
                }));
              }}
              onPlay={() =>
                setLocalPlaybackState((prev) => ({ ...prev, isPlaying: true }))
              }
              onPause={() =>
                setLocalPlaybackState((prev) => ({ ...prev, isPlaying: false }))
              }
              onStateChange={() => {
                // Optionally handle buffering, ended, etc.
              }}
            />
          ) : (
            <div className="text-white text-center">No video available</div>
          )}

          {/* Video Controls - shown on hover or when paused */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300",
              isControlsVisible || !localPlaybackState.isPlaying
                ? "opacity-100"
                : "opacity-0"
            )}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
              <div />
              <div className="text-white font-medium">{room.name}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/30">
                  {room.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                  onClick={() => setIsChatOpen(!isChatOpen)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Center Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
                onClick={togglePlayPause}
              >
                {localPlaybackState.isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>

            {/* Bottom Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Progress Bar */}
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm font-mono">
                  {formatTime(localPlaybackState.currentTime)}
                </span>
                <Slider
                  value={[localPlaybackState.currentTime]}
                  min={0}
                  max={localPlaybackState.duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-sm font-mono">
                  {formatTime(localPlaybackState.duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={togglePlayPause}
                  >
                    {localPlaybackState.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={() => handleSkip(-10)}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={() => handleSkip(10)}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white"
                      onClick={toggleMute}
                    >
                      {localPlaybackState.muted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>

                    <Slider
                      value={[
                        localPlaybackState.muted
                          ? 0
                          : localPlaybackState.volume,
                      ]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="w-24"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-white">
                    <Share className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                    onClick={toggleFullscreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && !isFullscreen && (
          <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-medium text-white">Chat</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-white h-8 w-8 p-0"
                onClick={() => setIsChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatSection
              messages={messages}
              onSendMessage={sendMessage}
              darkMode={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
