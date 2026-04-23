import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trash2, MoreVertical, AlertTriangle, Pencil } from 'lucide-react';
import { Expense, getCategoryInfo } from '@/types/expense';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ExpenseForm } from './ExpenseForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ExpenseItemProps {
  expense: Expense;
  onDelete?: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: {
    amount: number;
    category: string;
    date: string;
    comment?: string;
  }) => Promise<void>;
  showDate?: boolean;
  className?: string;
}

export const ExpenseItem = ({ 
  expense, 
  onDelete, 
  onUpdate,
  showDate = true,
  className 
}: ExpenseItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(expense.id);
      } finally {
        setIsDeleting(false);
        setShowDeleteDialog(false);
      }
    }
  };

  const handleUpdate = async (data: {
    amount: number;
    category: string;
    date: string;
    comment?: string;
  }) => {
    if (onUpdate) {
      setIsUpdating(true);
      try {
        await onUpdate(expense.id, data);
        setShowEditDialog(false);
      } finally {
        setIsUpdating(false);
      }
    }
  };
  const categoryInfo = getCategoryInfo(expense.category);
  const formattedDate = format(new Date(expense.date), 'd MMM yyyy', { locale: fr });

  return (
    <div 
      className={cn(
        'group flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50',
        'hover:border-primary/20 hover:shadow-md',
        'transition-all duration-300',
        className
      )}
    >
      <CategoryIcon category={expense.category} size="md" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground truncate">
            {categoryInfo.label}
          </h4>
          <span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: `hsl(var(--${categoryInfo.color}))` }}
          />
        </div>
        <div className="flex items-center gap-2 mt-1">
          {showDate && (
            <span className="text-sm text-muted-foreground">
              {formattedDate}
            </span>
          )}
          {expense.comment && (
            <>
              {showDate && <span className="text-muted-foreground/50">•</span>}
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {expense.comment}
              </span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className="text-lg font-bold text-foreground whitespace-nowrap">
            {expense.amount.toFixed(2)} €
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {onUpdate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEditDialog(true);
              }}
              className={cn(
                'p-2 rounded-xl text-muted-foreground',
                'hover:text-primary hover:bg-primary/10',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-200',
                isUpdating && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Modifier la dépense"
              disabled={isUpdating}
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className={cn(
                'p-2 rounded-xl text-muted-foreground',
                'hover:text-destructive hover:bg-destructive/10',
                'opacity-0 group-hover:opacity-100',
                'transition-all duration-200',
                isDeleting && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Supprimer la dépense"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>

        {/* Dialogs */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="max-w-sm mx-auto">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <AlertDialogTitle>Supprimer la dépense ?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-left">
                Êtes-vous sûr de vouloir supprimer cette dépense de {expense.amount.toFixed(2)}€ 
                pour "{getCategoryInfo(expense.category).label}" ?
                <span className="block mt-2 text-foreground/80">
                  Cette action est irréversible.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {onUpdate && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifier la dépense</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <ExpenseForm
                  onSubmit={handleUpdate}
                  isSubmitting={isUpdating}
                  initialData={{
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    comment: expense.comment || ''
                  }}
                  submitButtonText="Enregistrer les modifications"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};