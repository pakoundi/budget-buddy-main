import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'highlight';
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  variant = 'default',
  className 
}: StatCardProps) => {
  const isHighlight = variant === 'highlight';

  return (
    <div 
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isHighlight 
          ? 'stat-card-highlight' 
          : 'stat-card',
        'opacity-0 animate-fade-in',
        className
      )}
    >
      {/* Background Pattern for Highlight */}
      {isHighlight && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20" />
          <div className="absolute -right-4 bottom-0 w-20 h-20 rounded-full bg-white/10" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <span className={cn(
            'text-sm font-medium',
            isHighlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </span>
          {icon && (
            <div className={cn(
              'icon-container icon-container-sm',
              isHighlight 
                ? 'bg-white/20 text-primary-foreground' 
                : 'bg-primary/10 text-primary'
            )}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <p className={cn(
            'text-3xl md:text-4xl font-bold tracking-tight',
            isHighlight ? 'text-primary-foreground' : 'text-foreground'
          )}>
            {value}
          </p>
          
          {subtitle && (
            <p className={cn(
              'text-sm',
              isHighlight ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
          
          {trend && (
            <div className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-2',
              trend.isPositive 
                ? 'bg-success/10 text-success' 
                : 'bg-destructive/10 text-destructive'
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};