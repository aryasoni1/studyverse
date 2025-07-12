import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Trophy, 
  Clock, 
  Users, 
  Settings, 
  Brain,
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NotificationItem } from '../types/dashboardTypes';

interface NotificationsProps {
  notifications: NotificationItem[];
  loading?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onDismiss?: (notificationId: string) => void;
}

const notificationIcons = {
  achievement: Trophy,
  reminder: Clock,
  social: Users,
  system: Settings,
  ai_suggestion: Brain
};

const notificationColors = {
  achievement: 'text-yellow-500',
  reminder: 'text-blue-500',
  social: 'text-green-500',
  system: 'text-gray-500',
  ai_suggestion: 'text-purple-500'
};

export function Notifications({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onDismiss 
}: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No new notifications</p>
            <p className="text-sm text-muted-foreground mt-1">
              We'll notify you when something important happens!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {notifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type] || Bell;
                const iconColor = notificationColors[notification.type] || 'text-gray-500';
                const isExpired = notification.expires_at && new Date(notification.expires_at) < new Date();
                
                if (isExpired) return null;
                
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'flex items-start space-x-3 p-3 rounded-lg border transition-all cursor-pointer',
                      'hover:shadow-md hover:border-primary/20',
                      !notification.is_read && 'bg-primary/5 border-primary/20',
                      notification.action_url && 'hover:bg-muted/50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={cn('h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0')}>
                      <IconComponent className={cn('h-4 w-4', iconColor)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn(
                              'font-medium text-sm',
                              !notification.is_read && 'text-primary'
                            )}>
                              {notification.title}
                            </h4>
                            
                            {!notification.is_read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            
                            {notification.action_url && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        {onDismiss && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDismiss(notification.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
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