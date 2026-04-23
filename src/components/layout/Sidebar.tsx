import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  History,
  Wallet,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ExportButton } from '@/components/ExportButton';

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/add', label: 'Ajouter', icon: PlusCircle },
  { path: '/statistics', label: 'Statistiques', icon: BarChart3 },
  { path: '/history', label: 'Historique', icon: History },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-4 px-6 py-8">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-colored">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
            <TrendingUp className="w-3 h-3 text-success-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-sidebar-foreground">DepenseTrack</h1>
          <p className="text-sm text-muted-foreground">Gérez vos finances</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 divider" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Navigation
        </p>
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active',
                'opacity-0 animate-slide-in-right'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Theme Toggle and Export */}
      <div className="px-4 pb-2 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <span className="text-sm font-medium text-foreground">Thème</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <span className="text-sm font-medium text-foreground">Exporter</span>
          <ExportButton variant="ghost" size="icon" className="h-8 w-8" />
        </div>
      </div>

      {/* Footer Card */}
      <div className="p-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-accent to-accent/50 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Astuce IHM</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Le mode sombre améliore l'accessibilité et réduit la fatigue visuelle.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          Projet IHM © 2025
        </p>
      </div>
    </aside>
  );
};