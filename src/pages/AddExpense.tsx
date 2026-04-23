import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseForm } from '@/components/ExpenseForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import type { CategoryType, Expense } from '@/types/expense';

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense } = useExpenses();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt'> & { category: CategoryType }) => {
    setIsSubmitting(true);
    
    try {
      addExpense(data);
      setShowSuccess(true);
      
      toast({
        title: "Dépense enregistrée",
        description: `${data.amount.toFixed(2)} € ajouté avec succès`,
      });

      // Reset success state after animation
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la dépense",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-0 hover:bg-transparent"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Ajouter une dépense</h1>
          <p className="text-muted-foreground mt-1">
            Remplissez les détails de votre dépense ci-dessous
          </p>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-card p-8 rounded-2xl shadow-lg text-center animate-scale-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-category-housing/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-category-housing" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Dépense enregistrée !
              </h2>
              <p className="text-muted-foreground mt-1">
                Votre dépense a été ajoutée avec succès
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="card-elevated p-6 md:p-8">
          <ExpenseForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-xl bg-accent/50 border border-accent">
          <h3 className="font-medium text-accent-foreground mb-2">
            💡 Conseil
          </h3>
          <p className="text-sm text-muted-foreground">
            Enregistrez vos dépenses dès qu'elles sont effectuées pour un suivi plus précis de votre budget.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddExpense;
