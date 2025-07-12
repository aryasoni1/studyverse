import { useMemo } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  getDay,
  getDate,
} from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RoadmapTask, CreateTaskData } from "../types/roadmapTypes";

interface RoadmapTimelineViewProps {
  tasks: RoadmapTask[];
  timelineView: "day" | "week" | "month";
  currentDate: Date;
  onTaskSelect: (task: RoadmapTask | null) => void;
  onTaskCreate: (data: CreateTaskData) => Promise<RoadmapTask>;
  searchQuery: string;
}

const categoryColors = {
  study: "bg-blue-500",
  break: "bg-green-500",
  admin: "bg-orange-500",
  meeting: "bg-purple-500",
  exercise: "bg-red-500",
  routine: "bg-gray-500",
  project: "bg-pink-500",
  reading: "bg-teal-500",
};

export function RoadmapTimelineView({
  tasks,
  timelineView,
  currentDate,
  onTaskSelect,
  onTaskCreate,
  searchQuery,
}: RoadmapTimelineViewProps) {
  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [tasks, searchQuery]);

  // Generate time slots (7 AM to 9 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

  // Generate week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  // Month view days
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [currentDate]);

  // Calculate task height based on duration
  const getTaskHeight = (task: RoadmapTask) => {
    const duration = task.duration / 60; // Convert minutes to hours
    return Math.max(duration * 60, 40); // Minimum 40px height
  };

  // Calculate task position
  const getTaskPosition = (task: RoadmapTask) => {
    const startHour = parseInt(task.startTime.split(":")[0]);
    const startMinute = parseInt(task.startTime.split(":")[1]);
    const topOffset = (startHour - 7) * 60 + startMinute; // 7 AM is 0
    return topOffset;
  };

  const handleTaskClick = (task: RoadmapTask) => {
    onTaskSelect(task);
  };

  const handleSlotClick = (date: Date, timeSlot: string) => {
    // Create new task at this slot
    const newTaskData: CreateTaskData = {
      title: "New Task",
      description: "",
      category: "study",
      priority: "medium",
      date: format(date, "yyyy-MM-dd"),
      startTime: timeSlot,
      endTime: `${parseInt(timeSlot.split(":")[0]) + 1}:00`,
      tags: [],
      notes: "",
    };

    onTaskCreate(newTaskData);
  };

  // Render view based on timelineView
  let calendarContent;
  if (timelineView === "day") {
    // Day view: show only one column for the selected day
    calendarContent = (
      <div className="flex-1 overflow-auto">
        <div
          className="grid grid-cols-2 min-h-full"
          style={{ gridTemplateColumns: "80px 1fr" }}
        >
          {/* Time column */}
          <div className="border-r bg-muted/20 w-20">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-16 border-b p-2 text-xs text-muted-foreground"
              >
                {time}
              </div>
            ))}
          </div>
          {/* Day column */}
          <div className="border-r last:border-r-0 relative">
            {timeSlots.map((time, timeIndex) => (
              <div
                key={timeIndex}
                className="h-16 border-b relative group hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => handleSlotClick(currentDate, time)}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {/* Render tasks for the day */}
            {filteredTasks
              .filter((task) => task.date === format(currentDate, "yyyy-MM-dd"))
              .map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "absolute left-1 right-1 rounded-md p-2 cursor-pointer transition-all hover:shadow-md z-10",
                    categoryColors[task.category],
                    "text-white text-xs"
                  )}
                  style={{
                    top: `${getTaskPosition(task)}px`,
                    height: `${getTaskHeight(task)}px`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                >
                  <div className="font-medium truncate">{task.title}</div>
                  <div className="text-xs opacity-90 mt-1">
                    {task.startTime} - {task.endTime}
                  </div>
                  {task.tags.length > 0 && (
                    <div className="text-xs opacity-75 truncate">
                      {task.tags.join(", ")}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  } else if (timelineView === "month") {
    // Month view: show a 7-column grid for all days in the month
    const firstDayOfWeek = getDay(startOfMonth(currentDate));
    calendarContent = (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 gap-0 border rounded-lg overflow-hidden">
          {/* Weekday headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
            <div
              key={i}
              className="p-2 bg-muted/50 border-r last:border-r-0 text-center"
            >
              <div className="text-xs font-medium">{day}</div>
            </div>
          ))}
          {/* Month days */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div
              key={"empty-" + i}
              className="p-2 bg-muted/10 border-r last:border-r-0"
            />
          ))}
          {monthDays.map((day, i) => (
            <div
              key={i}
              className="p-2 border-r last:border-r-0 min-h-[80px] align-top relative"
            >
              <div
                className={cn(
                  "text-xs font-medium",
                  isSameDay(day, new Date()) && "text-blue-500"
                )}
              >
                {getDate(day)}
              </div>
              {/* Render tasks for this day */}
              {filteredTasks
                .filter((task) => task.date === format(day, "yyyy-MM-dd"))
                .map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "mt-1 rounded-md p-1 cursor-pointer transition-all hover:shadow-md z-10",
                      categoryColors[task.category],
                      "text-white text-xs"
                    )}
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    // Default to week view
    calendarContent = (
      <div className="flex-1 overflow-auto">
        <div
          className="grid grid-cols-8 min-h-full"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          {/* Time column */}
          <div className="border-r bg-muted/20 w-20">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-16 border-b p-2 text-xs text-muted-foreground"
              >
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r last:border-r-0 relative">
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={timeIndex}
                  className="h-16 border-b relative group hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => handleSlotClick(day, time)}
                >
                  {/* Add task button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Render tasks */}
              {filteredTasks
                .filter((task) => task.date === format(day, "yyyy-MM-dd"))
                .map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-md p-2 cursor-pointer transition-all hover:shadow-md z-10",
                      categoryColors[task.category],
                      "text-white text-xs"
                    )}
                    style={{
                      top: `${getTaskPosition(task)}px`,
                      height: `${getTaskHeight(task)}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task);
                    }}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                    <div className="text-xs opacity-90 mt-1">
                      {task.startTime} - {task.endTime}
                    </div>
                    {task.tags.length > 0 && (
                      <div className="text-xs opacity-75 truncate">
                        {task.tags.join(", ")}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Main calendar view only, sidebar removed */}
      <div className="flex-1 flex flex-col">
        {/* Week header */}
        {timelineView === "week" && (
          <div className="border-b p-3">
            <div
              className="grid grid-cols-8 gap-0 border rounded-lg overflow-hidden"
              style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
            >
              {/* Time column header */}
              <div className="p-2 bg-muted/50 border-r w-20">
                <div className="text-xs font-medium">Time</div>
              </div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="p-2 bg-muted/50 border-r last:border-r-0 text-center"
                >
                  <div className="text-xs font-medium">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold mt-1",
                      isSameDay(day, new Date()) && "text-blue-500"
                    )}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {timelineView === "day" && (
          <div className="border-b p-3">
            <div
              className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden"
              style={{ gridTemplateColumns: "80px 1fr" }}
            >
              <div className="p-2 bg-muted/50 border-r w-20">
                <div className="text-xs font-medium">Time</div>
              </div>
              <div className="p-2 bg-muted/50 border-r last:border-r-0 text-center">
                <div className="text-xs font-medium">
                  {format(currentDate, "EEE")}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold mt-1",
                    isSameDay(currentDate, new Date()) && "text-blue-500"
                  )}
                >
                  {format(currentDate, "d")}
                </div>
              </div>
            </div>
          </div>
        )}
        {timelineView === "month" && (
          <div className="border-b p-3">
            <div className="grid grid-cols-7 gap-0 border rounded-lg overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, i) => (
                  <div
                    key={i}
                    className="p-2 bg-muted/50 border-r last:border-r-0 text-center"
                  >
                    <div className="text-xs font-medium">{day}</div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {calendarContent}
      </div>
    </div>
  );
}
