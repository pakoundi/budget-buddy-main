import { useState, useMemo } from 'react';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Filter, X } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseItem } from '@/components/ExpenseItem';
import { CATEGORIES, CategoryType } from '@/types/expense';
import { cn } from '@/lib/utils';

const History = () => {
  const { expenses, isLoading, deleteExpense, updateExpense } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Category filter
      if (selectedCategory !== 'all' && expense.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const categoryLabel = CATEGORIES.find(c => c.id === expense.category)?.label.toLowerCase() || '';
        const comment = expense.comment?.toLowerCase() || '';
        const amount = expense.amount.toString();
        
        return categoryLabel.includes(query) || 
               comment.includes(query) || 
               amount.includes(query);
      }
      
      return true;
    });
  }, [expenses, selectedCategory, searchQuery]);

  // Group expenses by month
  const groupedExpenses = useMemo(() => {
    const groups: { [key: string]: typeof filteredExpenses } = {};
    
    filteredExpenses.forEach(expense => {
      const date = parseISO(expense.date);
      const key = format(date, 'MMMM yyyy', { locale: fr });
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(expense);
    });
    
    return groups;
  }, [filteredExpenses]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Historique
          </h1>
          <p className="text-muted-foreground mt-1">
            {expenses.length} dépense{expenses.length !== 1 && 's'} enregistrée{expenses.length !== 1 && 's'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une dépense..."
                className="input-field pl-12"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'btn-secondary px-4',
                showFilters && 'bg-primary text-primary-foreground'
              )}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="animate-fade-in">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  Toutes
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredExpenses.length} résultat{filteredExpenses.length !== 1 && 's'}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <X className="w-4 h-4" />
                Effacer les filtres
              </button>
            </div>
          )}
        </div>

        {/* Expense List */}
        {filteredExpenses.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <p className="text-muted-foreground">
              {hasActiveFilters 
                ? 'Aucune dépense ne correspond à votre recherche'
                : 'Aucune dépense enregistrée'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedExpenses).map(([month, monthExpenses]) => {
              const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
              
              return (
                <div key={month} className="space-y-3">
                  <div className="flex items-center justify-between sticky top-0 bg-background py-2 z-10">
                    <h2 className="text-lg font-semibold text-foreground capitalize">
                      {month}
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground">
                      {monthTotal.toFixed(2)} €
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {monthExpenses.map(expense => (
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
                          category: CategoryType;  
                          date: string;
                          comment?: string;
                        }) => {
                          try {
                            await updateExpense(id, data);
                          } catch (error) {
                            console.error('Erreur lors de la mise à jour de la dépense :', error);
                            throw error; // Propager l'erreur pour la gérer dans le composant ExpenseItem
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
