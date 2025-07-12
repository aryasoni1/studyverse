import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  FileText, 
  Trophy, 
  Clock, 
  Star,
  BookOpen,
  Target,
  Users
} from 'lucide-react';
import type { ActivityItem } from '../types/dashboardTypes';

interface ActivityFeedProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const activityIcons = {
  CheckCircle,
  FileText,
  Trophy,
  Clock,
  Star,
  BookOpen,
  Target,
  Users
};

const activityColors = {
  task_completed: 'bg-green-500',
  note_created: 'bg-blue-500',
  skill_completed: 'bg-purple-500',
  achievement_unlocked: 'bg-yellow-500',
  study_session: 'bg-orange-500'
};

const activityLabels = {
  task_completed: 'Task',
  note_created: 'Note',
  skill_completed: 'Skill',
  achievement_unlocked: 'Achievement',
  study_session: 'Study'
};

export function ActivityFeed({ activities, loading }: ActivityFeedProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted" />
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
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start learning to see your progress here!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {activities.map((activity) => {
                const IconComponent = activityIcons[activity.icon as keyof typeof activityIcons] || Star;
                const colorClass = activityColors[activity.type] || 'bg-gray-500';
                const label = activityLabels[activity.type] || 'Activity';
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3 group">
                    <div className={`h-8 w-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {activity.description}
                      </p>
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