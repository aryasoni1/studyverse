import { useState, useEffect } from "react";
import { Play, Pause, Square, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { PomodoroSession, StudyRoom } from "../types/studyRoomTypes";

interface PomodoroTimerProps {
  sessions: PomodoroSession[];
  roomSettings: StudyRoom["room_settings"];
  onStartSession: (
    duration: number,
    breakDuration: number,
    targetCycles: number
  ) => Promise<PomodoroSession>;
  onUpdateSession: (
    sessionId: string,
    updates: Partial<PomodoroSession>
  ) => Promise<PomodoroSession>;
}

export function PomodoroTimer({
  sessions,
  roomSettings,
  onStartSession,
  onUpdateSession,
}: PomodoroTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<"focus" | "break">("focus");

  // Safely extract durations from roomSettings (which is Record<string, unknown>)
  function getNumberSetting(key: string, fallback: number): number {
    const value = roomSettings[key];
    if (typeof value === "number" && !isNaN(value)) return value;
    if (typeof value === "string" && !isNaN(Number(value)))
      return Number(value);
    return fallback;
  }

  const [settings, setSettings] = useState({
    focusDuration: getNumberSetting("pomodoro_duration", 25),
    breakDuration: getNumberSetting("break_duration", 5),
    targetCycles: 4,
  });

  const activeSession = sessions.find((s) => !s.completed_at);
  const totalTime =
    currentPhase === "focus"
      ? settings.focusDuration * 60
      : settings.breakDuration * 60;
  const progress =
    totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Switch phases
            if (currentPhase === "focus") {
              setCurrentPhase("break");
              setTimeLeft(settings.breakDuration * 60);
            } else {
              setCurrentPhase("focus");
              setTimeLeft(settings.focusDuration * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase, settings]);

  const handleStart = async () => {
    if (!activeSession) {
      try {
        await onStartSession(
          settings.focusDuration,
          settings.breakDuration,
          settings.targetCycles
        );
        setTimeLeft(settings.focusDuration * 60);
        setCurrentPhase("focus");
      } catch {
        return;
      }
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = async () => {
    setIsRunning(false);
    setTimeLeft(0);
    setCurrentPhase("focus");

    if (activeSession) {
      await onUpdateSession(activeSession.id, {
        completed_at: new Date().toISOString(),
      });
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(settings.focusDuration * 60);
    setCurrentPhase("focus");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pomodoro Timer</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
                <DialogDescription>
                  Customize your Pomodoro timer settings.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Focus Duration</Label>
                    <span className="text-sm font-medium">
                      {settings.focusDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[settings.focusDuration]}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        focusDuration: value[0],
                      }))
                    }
                    min={5}
                    max={60}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Break Duration</Label>
                    <span className="text-sm font-medium">
                      {settings.breakDuration} min
                    </span>
                  </div>
                  <Slider
                    value={[settings.breakDuration]}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        breakDuration: value[0],
                      }))
                    }
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Target Cycles</Label>
                    <span className="text-sm font-medium">
                      {settings.targetCycles}
                    </span>
                  </div>
                  <Slider
                    value={[settings.targetCycles]}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        targetCycles: value[0],
                      }))
                    }
                    min={1}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex-1 p-6">
        <div className="text-center space-y-6">
          {/* Phase Indicator */}
          <div className="flex justify-center">
            <Badge
              variant={currentPhase === "focus" ? "default" : "secondary"}
              className="text-sm px-4 py-1"
            >
              {currentPhase === "focus" ? "Focus Time" : "Break Time"}
            </Badge>
          </div>

          {/* Timer Circle */}
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
            <div
              className={cn(
                "absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000",
                currentPhase === "focus"
                  ? "border-t-primary border-r-primary"
                  : "border-t-green-500 border-r-green-500"
              )}
              style={{
                transform: `rotate(${(progress / 100) * 360}deg)`,
                borderImage:
                  currentPhase === "focus"
                    ? "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary))) 1"
                    : "linear-gradient(90deg, #10b981, #10b981) 1",
              }}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold font-mono">
                  {formatTime(
                    timeLeft ||
                      (currentPhase === "focus"
                        ? settings.focusDuration * 60
                        : settings.breakDuration * 60)
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {Math.round(progress)}% complete
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {currentPhase === "focus" ? "Focus" : "Break"} Session Progress
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button onClick={handleStart} className="px-8">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" className="px-8">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}

            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button onClick={handleStop} variant="destructive">
              <Square className="h-4 w-4" />
            </Button>
          </div>

          {/* Session Info */}
          {activeSession && (
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">
                Cycle {activeSession.completed_cycles + 1} of{" "}
                {activeSession.target_cycles}
              </div>
              <div className="flex justify-center gap-2">
                {Array.from({ length: activeSession.target_cycles }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-3 h-3 rounded-full",
                      i < activeSession.completed_cycles
                        ? "bg-primary"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
