import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle = ({ compact = false, className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2.5 rounded-xl transition-all duration-300',
          isDark 
            ? 'bg-primary/10 text-primary' 
            : 'bg-muted text-muted-foreground hover:bg-accent',
          className
        )}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 p-4 rounded-2xl bg-muted/50', className)}>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Mode sombre</p>
        <p className="text-xs text-muted-foreground">Accessibilité visuelle</p>
      </div>
      
      <button
        onClick={toggleTheme}
        className={cn(
          'relative w-14 h-8 rounded-full transition-colors duration-300',
          isDark ? 'bg-primary' : 'bg-muted'
        )}
        aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        role="switch"
        aria-checked={isDark}
      >
        {/* Track icons */}
        <span className={cn(
          'absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200',
          isDark ? 'opacity-100' : 'opacity-40'
        )}>
          <Moon className="w-4 h-4 text-primary-foreground" />
        </span>
        <span className={cn(
          'absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-200',
          isDark ? 'opacity-40' : 'opacity-100'
        )}>
          <Sun className="w-4 h-4 text-muted-foreground" />
        </span>
        
        {/* Thumb */}
        <span 
          className={cn(
            'absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center',
            isDark ? 'left-7' : 'left-1'
          )}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-warning" />
          )}
        </span>
      </button>
    </div>
  );
};