export type CategoryType = 
  | 'food' 
  | 'transport' 
  | 'housing' 
  | 'leisure' 
  | 'shopping' 
  | 'health' 
  | 'education' 
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: CategoryType;
  date: string;
  comment?: string;
  createdAt: string;
}

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'food', label: 'Alimentation', icon: 'Utensils', color: 'category-food' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: 'category-transport' },
  { id: 'housing', label: 'Logement', icon: 'Home', color: 'category-housing' },
  { id: 'leisure', label: 'Loisirs', icon: 'Gamepad2', color: 'category-leisure' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: 'category-shopping' },
  { id: 'health', label: 'Santé', icon: 'Heart', color: 'category-health' },
  { id: 'education', label: 'Éducation', icon: 'GraduationCap', color: 'category-education' },
  { id: 'other', label: 'Autre', icon: 'MoreHorizontal', color: 'category-other' },
];

export const getCategoryInfo = (categoryId: CategoryType): CategoryInfo => {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[CATEGORIES.length - 1];
};
