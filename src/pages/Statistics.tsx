import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { AppLayout } from '@/components/layout/AppLayout';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { CATEGORIES } from '@/types/expense';
import { cn } from '@/lib/utils';

const Statistics = () => {
  const { expenses, isLoading } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthExpenses = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    
    return expenses.filter(e => {
      const date = new Date(e.date);
      return date >= start && date <= end;
    });
  }, [expenses, selectedMonth]);

  const categoryStats = useMemo(() => {
    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return CATEGORIES.map(cat => {
      const catTotal = monthExpenses
        .filter(e => e.category === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      
      return {
        ...cat,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        count: monthExpenses.filter(e => e.category === cat.id).length,
      };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);
  }, [monthExpenses]);

  const totalMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Statistiques
          </h1>
          <p className="text-muted-foreground mt-1">
            Analysez vos dépenses en détail
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="text-center min-w-[200px]">
            <h2 className="text-xl font-semibold text-foreground capitalize">
              {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {monthExpenses.length} transaction{monthExpenses.length !== 1 && 's'}
            </p>
          </div>
          
          <button
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={selectedMonth >= new Date()}
            aria-label="Mois suivant"
          >
            <ChevronRight className={cn(
              "w-5 h-5",
              selectedMonth >= new Date() ? 'text-muted' : 'text-muted-foreground'
            )} />
          </button>
        </div>

        {/* Total */}
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground">Total des dépenses</p>
          <p className="text-4xl font-bold text-foreground mt-2">
            {totalMonth.toFixed(2)} €
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Répartition par catégorie
            </h2>
            <CategoryPieChart expenses={monthExpenses} />
          </div>

          {/* Bar Chart */}
          <div className="card-elevated p-6">
            <MonthlyBarChart 
              expenses={monthExpenses} 
              selectedMonth={selectedMonth}
            />
          </div>
        </div>

        {/* Category Details */}
        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Détail par catégorie
          </h2>
          
          {categoryStats.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune dépense ce mois-ci
            </p>
          ) : (
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground">{cat.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {cat.count} transaction{cat.count !== 1 && 's'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">
                        {cat.total.toFixed(2)} €
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({cat.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', `bg-${cat.color}`)}
                      style={{ 
                        width: `${cat.percentage}%`,
                        backgroundColor: `hsl(var(--${cat.color}))`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Statistics;
