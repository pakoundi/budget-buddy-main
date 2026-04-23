import { useState, useEffect, useCallback } from 'react';
import { Expense, CategoryType } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

// Sample data for demo
const generateSampleData = (): Expense[] => {
  const now = new Date();
  const expenses: Expense[] = [];
  const categories: CategoryType[] = ['food', 'transport', 'housing', 'leisure', 'shopping', 'health', 'education', 'other'];
  const comments = [
    'Courses de la semaine',
    'Métro mensuel',
    'Loyer janvier',
    'Cinéma avec amis',
    'Vêtements soldes',
    'Pharmacie',
    'Livres universitaires',
    'Divers',
    'Restaurant midi',
    'Essence voiture',
    'Électricité',
    'Concert',
    'Cadeau anniversaire',
    'Dentiste',
    'Fournitures scolaires',
  ];

  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    
    expenses.push({
      id: `sample-${i}`,
      amount: Math.floor(Math.random() * 150) + 5,
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date.toISOString().split('T')[0],
      comment: Math.random() > 0.3 ? comments[Math.floor(Math.random() * comments.length)] : undefined,
      createdAt: date.toISOString(),
    });
  }

  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch {
        const sampleData = generateSampleData();
        setExpenses(sampleData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
      }
    } else {
      const sampleData = generateSampleData();
      setExpenses(sampleData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    saveExpenses(updated);
    return newExpense;
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback((id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const updateExpense = useCallback((id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    const updated = expenses.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const getExpensesByPeriod = useCallback((startDate: Date, endDate: Date) => {
    return expenses.filter(e => {
      const date = new Date(e.date);
      return date >= startDate && date <= endDate;
    });
  }, [expenses]);

  const getTotalByCategory = useCallback((categoryFilter?: CategoryType, startDate?: Date, endDate?: Date) => {
    let filtered = expenses;
    
    if (startDate && endDate) {
      filtered = getExpensesByPeriod(startDate, endDate);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }
    
    return filtered.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, getExpensesByPeriod]);

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    getExpensesByPeriod,
    getTotalByCategory,
  };
};
