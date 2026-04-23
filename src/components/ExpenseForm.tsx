import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Check } from 'lucide-react';
import { CATEGORIES, CategoryType } from '@/types/expense';
import { CategoryIcon } from './CategoryIcon';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ExpenseFormData {
  amount: number;
  category: CategoryType;
  date: string;
  comment?: string;
}

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  isSubmitting?: boolean;
  initialData?: ExpenseFormData;
  submitButtonText?: string;
}

export const ExpenseForm = ({ 
  onSubmit, 
  isSubmitting = false, 
  initialData,
  submitButtonText = 'Ajouter la dépense'
}: ExpenseFormProps) => {
  const [amount, setAmount] = useState(initialData?.amount.toString() || '');
  const [category, setCategory] = useState<CategoryType | null>(initialData?.category || null);
  const [date, setDate] = useState<Date>(initialData ? new Date(initialData.date) : new Date());
  const [comment, setComment] = useState(initialData?.comment || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Veuillez entrer un montant valide';
    }
    
    if (!category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      amount: parseFloat(amount),
      category: category!,
      date: format(date, 'yyyy-MM-dd'),
      comment: comment.trim() || undefined,
    });
    
    // Reset form
    setAmount('');
    setCategory(null);
    setDate(new Date());
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Montant */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Montant <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
            }}
            placeholder="0.00"
            className={cn(
              'input-field pr-12 text-lg',
              errors.amount && 'border-destructive focus:ring-destructive'
            )}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            €
          </span>
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Catégorie <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id);
                if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
              }}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
                category === cat.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30 bg-card'
              )}
            >
              <CategoryIcon category={cat.id} size="sm" />
              <span className="text-sm font-medium text-foreground">{cat.label}</span>
              {category === cat.id && (
                <Check className="w-4 h-4 text-primary absolute top-2 right-2" />
              )}
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Date <span className="text-destructive">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="input-field flex items-center gap-3 text-left"
            >
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <span>{format(date, 'dd/MM/yyyy')}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Commentaire */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Commentaire <span className="text-muted-foreground">(optionnel)</span>
        </label>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ex: Courses de la semaine..."
          className="input-field"
          maxLength={100}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
      </button>
    </form>
  );
};
