import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Brain,
  Map,
  Target,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { QuickAction } from '../types/dashboardTypes';

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'ai-chat',
      title: 'Start AI Chat',
      description: 'Get instant help from AI',
      icon: 'Brain',
      gradient: 'from-purple-500 to-pink-500',
      action: () => navigate('/app/ai-assistant')
    },
    {
      id: 'study-room',
      title: 'Join Study Room',
      description: 'Study with others',
      icon: 'Users',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/app/study-room')
    },
    {
      id: 'take-notes',
      title: 'Take Notes',
      description: 'Capture your learning',
      icon: 'BookOpen',
      gradient: 'from-green-500 to-emerald-500',
      action: () => navigate('/app/notes')
    },
    {
      id: 'roadmaps',
      title: 'View Roadmaps',
      description: 'Follow learning paths',
      icon: 'Map',
      gradient: 'from-orange-500 to-red-500',
      action: () => navigate('/app/roadmaps')
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Connect with learners',
      icon: 'MessageSquare',
      gradient: 'from-indigo-500 to-purple-500',
      action: () => navigate('/app/community')
    },
    {
      id: 'set-goal',
      title: 'Set Goal',
      description: 'Define your targets',
      icon: 'Target',
      gradient: 'from-teal-500 to-blue-500',
      action: () => {
        // TODO: Open goal setting modal
        console.log('Set goal clicked');
      }
    }
  ];

  const iconComponents = {
    Brain,
    Users,
    BookOpen,
    Map,
    MessageSquare,
    Target,
    Zap
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const IconComponent = iconComponents[action.icon as keyof typeof iconComponents] || Zap;
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  'h-auto p-4 flex flex-col items-center gap-3 relative overflow-hidden',
                  'hover:scale-105 transition-all duration-200',
                  'group border-2 hover:border-primary/20'
                )}
                onClick={action.action}
                disabled={action.disabled}
              >
                {/* Gradient background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity',
                  action.gradient
                )} />
                
                {/* Icon with gradient background */}
                <div className={cn(
                  'h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  'group-hover:scale-110 transition-transform duration-200',
                  action.gradient
                )}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="text-center space-y-1 relative z-10">
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}