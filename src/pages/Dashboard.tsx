import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Wallet, TrendingUp, Calendar, ArrowRight, PlusCircle, Sparkles, Receipt } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/StatCard';
import { ExpenseItem } from '@/components/ExpenseItem';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { CATEGORIES } from '@/types/expense';

const Dashboard = () => {
  const { expenses, isLoading, deleteExpense, updateExpense } = useExpenses();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Previous month for comparison
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    const monthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= monthStart && date <= monthEnd;
    });

    const prevMonthExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= prevMonthStart && date <= prevMonthEnd;
    });

    const weekExpenses = expenses.filter(e => {
      const date = new Date(e.date);
      return date >= weekStart && date <= weekEnd;
    });

    const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const prevMonthTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const weekTotal = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
    const transactionCount = monthExpenses.length;

    // Calculate trend
    const trendValue = prevMonthTotal > 0 
      ? Math.round(((monthTotal - prevMonthTotal) / prevMonthTotal) * 100)
      : 0;

    return { 
      monthTotal, 
      weekTotal, 
      transactionCount, 
      monthExpenses,
      trend: { value: Math.abs(trendValue), isPositive: trendValue <= 0 }
    };
  }, [expenses]);

  const recentExpenses = expenses.slice(0, 5);

  const categoryBreakdown = useMemo(() => {
    return CATEGORIES.map(cat => {
      const total = stats.monthExpenses
        .filter(e => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = stats.monthTotal > 0 ? (total / stats.monthTotal) * 100 : 0;
      return { ...cat, total, percentage };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);
  }, [stats.monthExpenses, stats.monthTotal]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span className="text-muted-foreground font-medium">Chargement...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Bienvenue
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground">
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          <Link 
            to="/add" 
            className="btn-primary shadow-lg hover:shadow-xl transition-shadow"
          >
            <PlusCircle className="w-5 h-5" />
            Nouvelle dépense
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            title="Dépenses du mois"
            value={`${stats.monthTotal.toFixed(2)} €`}
            subtitle={format(new Date(), 'MMMM yyyy', { locale: fr })}
            icon={<Wallet className="w-5 h-5" />}
            trend={stats.trend}
            variant="highlight"
            className="sm:col-span-2 lg:col-span-1"
          />
          <StatCard
            title="Cette semaine"
            value={`${stats.weekTotal.toFixed(2)} €`}
            subtitle="Lundi à Dimanche"
            icon={<Calendar className="w-5 h-5" />}
            className="delay-100"
          />
          <StatCard
            title="Transactions"
            value={stats.transactionCount.toString()}
            subtitle="Ce mois-ci"
            icon={<Receipt className="w-5 h-5" />}
            className="delay-200"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart - Takes 2 columns */}
          <div className="lg:col-span-2 card-elevated p-6 opacity-0 animate-fade-in delay-200">
            <div className="section-header">
              <h2 className="section-title">Répartition</h2>
            </div>
            <CategoryPieChart expenses={stats.monthExpenses} />
          </div>

          {/* Recent Expenses - Takes 3 columns */}
          <div className="lg:col-span-3 card-elevated p-6 opacity-0 animate-fade-in delay-300">
            <div className="section-header">
              <h2 className="section-title">Dépenses récentes</h2>
              <Link 
                to="/history" 
                className="btn-ghost text-sm"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {recentExpenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Receipt className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-2">
                  Aucune dépense enregistrée
                </p>
                <Link to="/add" className="btn-primary">
                  <PlusCircle className="w-4 h-4" />
                  Ajouter une dépense
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense, index) => (
                  <div 
                    key={expense.id}
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      onDelete={async (id: string) => {
                        try {
                          await deleteExpense(id);
                        } catch (error) {
                          console.error('Erreur lors de la suppression de la dépense :', error);
                        }
                      }}
                      onUpdate={async (id: string, data: {
                        amount: number;
                        category: string;
                        date: string;
                        comment?: string;
                      }) => {
                        try {
                          await updateExpense(id, {
                            ...data,
                            category: data.category as any // Conversion sûre car nous savons que c'est un CategoryType valide
                          });
                        } catch (error) {
                          console.error('Erreur lors de la mise à jour de la dépense :', error);
                          throw error; // Propager l'erreur pour la gérer dans le composant ExpenseItem
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Summary */}
        {categoryBreakdown.length > 0 && (
          <div className="card-elevated p-6 opacity-0 animate-fade-in delay-400">
            <div className="section-header">
              <h2 className="section-title">Top catégories</h2>
              <Link to="/statistics" className="btn-ghost text-sm">
                Détails
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryBreakdown.map((cat, index) => (
                <div 
                  key={cat.id}
                  className="group p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-accent hover:to-accent/50 border border-transparent hover:border-primary/10 transition-all duration-300 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(index + 5) * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-accent-foreground transition-colors">
                      {cat.label}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {cat.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {cat.total.toFixed(2)} €
                  </p>
                  {/* Progress bar */}
                  <div className="progress-bar mt-3">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${cat.percentage}%`,
                        backgroundColor: `hsl(var(--${cat.color}))`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;