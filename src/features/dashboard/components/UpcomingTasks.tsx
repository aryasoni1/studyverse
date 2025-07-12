import { useState } from 'react';
import { formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Plus, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskItem } from '../types/dashboardTypes';

interface UpcomingTasksProps {
  tasks: TaskItem[];
  loading?: boolean;
  onTaskStatusChange?: (taskId: string, status: TaskItem['status']) => void;
  onAddTask?: () => void;
}

const priorityColors = {
  1: 'bg-gray-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-orange-500',
  5: 'bg-red-500'
};

const priorityLabels = {
  1: 'Low',
  2: 'Normal',
  3: 'Medium',
  4: 'High',
  5: 'Critical'
};

export function UpcomingTasks({ 
  tasks, 
  loading, 
  onTaskStatusChange, 
  onAddTask 
}: UpcomingTasksProps) {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    if (!onTaskStatusChange) return;
    
    setCompletingTasks(prev => new Set(prev).add(taskId));
    
    try {
      await onTaskStatusChange(taskId, completed ? 'completed' : 'pending');
    } finally {
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    
    if (isToday(date)) {
      return { text: 'Today', color: 'text-orange-600', urgent: true };
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'text-blue-600', urgent: false };
    } else if (isPast(date)) {
      return { text: 'Overdue', color: 'text-red-600', urgent: true };
    } else {
      return { 
        text: formatDistanceToNow(date, { addSuffix: true }), 
        color: 'text-muted-foreground', 
        urgent: false 
      };
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tasks
          </CardTitle>
          
          {onAddTask && (
            <Button size="sm" onClick={onAddTask}>
              <Plus className="h-4 w-4 mr-1" />
              Add Task
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming tasks.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add a task to get started!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {tasks.map((task) => {
                const isCompleting = completingTasks.has(task.id);
                const isCompleted = task.status === 'completed';
                const dueInfo = task.due_date ? formatDueDate(task.due_date) : null;
                
                return (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-start space-x-3 p-3 rounded-lg border transition-all',
                      'hover:shadow-md hover:border-primary/20',
                      isCompleted && 'opacity-60 bg-muted/50'
                    )}
                  >
                    <div className="flex items-center pt-0.5">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={(checked) => 
                          handleTaskComplete(task.id, checked as boolean)
                        }
                        disabled={isCompleting}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          'font-medium text-sm',
                          isCompleted && 'line-through text-muted-foreground'
                        )}>
                          {task.title}
                        </h4>
                        
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            'text-xs text-white',
                            priorityColors[task.priority]
                          )}
                        >
                          {priorityLabels[task.priority]}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-xs">
                        {dueInfo && (
                          <div className={cn('flex items-center gap-1', dueInfo.color)}>
                            {dueInfo.urgent ? (
                              <AlertTriangle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            <span>{dueInfo.text}</span>
                          </div>
                        )}
                        
                        {task.estimated_duration && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{task.estimated_duration}m</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {isCompleting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}