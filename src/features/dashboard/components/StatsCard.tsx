import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number;
    max?: number;
    label?: string;
  };
  className?: string;
  gradient?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  className,
  gradient
}: StatsCardProps) {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      gradient && 'bg-gradient-to-br',
      className
    )}>
      {gradient && (
        <div className={cn('absolute inset-0 opacity-10', gradient)} />
      )}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          'h-8 w-8 rounded-lg flex items-center justify-center',
          gradient ? 'bg-white/20' : 'bg-muted'
        )}>
          {icon}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className="flex items-center space-x-1 text-xs">
              <span className={cn(
                'font-medium',
                trend.isPositive !== false ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive !== false ? '+' : ''}{trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
          
          {progress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {progress.label || 'Progress'}
                </span>
                <span className="font-medium">
                  {progress.value}{progress.max ? `/${progress.max}` : '%'}
                </span>
              </div>
              <Progress 
                value={progress.max ? (progress.value / progress.max) * 100 : progress.value} 
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}