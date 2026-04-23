import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  History,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  { path: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { path: '/add', label: 'Ajouter', icon: PlusCircle },
  { path: '/statistics', label: 'Stats', icon: BarChart3 },
  { path: '/history', label: 'Historique', icon: History },
];

export const MobileNav = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border px-2 py-3 z-50 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground active:scale-95'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-all duration-300',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-colored' 
                  : 'hover:bg-accent'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                'text-[11px] font-semibold',
                isActive && 'text-primary'
              )}>
              {item.label}
              </span>
            </NavLink>
          );
        })}
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300 text-muted-foreground active:scale-95"
          aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
        >
          <div className={cn(
            'p-2 rounded-xl transition-all duration-300',
            'hover:bg-accent'
          )}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <span className="text-[11px] font-semibold">
            {isDark ? 'Clair' : 'Sombre'}
          </span>
        </button>
      </div>
    </nav>
  );
};