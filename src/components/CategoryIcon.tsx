import { 
  Utensils, 
  Car, 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  Heart, 
  GraduationCap, 
  MoreHorizontal,
  LucideIcon
} from 'lucide-react';
import { CategoryType } from '@/types/expense';
import { cn } from '@/lib/utils';

const iconMap: Record<CategoryType, LucideIcon> = {
  food: Utensils,
  transport: Car,
  housing: Home,
  leisure: Gamepad2,
  shopping: ShoppingBag,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal,
};

const colorMap: Record<CategoryType, string> = {
  food: 'bg-category-food/15 text-category-food',
  transport: 'bg-category-transport/15 text-category-transport',
  housing: 'bg-category-housing/15 text-category-housing',
  leisure: 'bg-category-leisure/15 text-category-leisure',
  shopping: 'bg-category-shopping/15 text-category-shopping',
  health: 'bg-category-health/15 text-category-health',
  education: 'bg-category-education/15 text-category-education',
  other: 'bg-category-other/15 text-category-other',
};

interface CategoryIconProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryIcon = ({ category, size = 'md', className }: CategoryIconProps) => {
  const Icon = iconMap[category];
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div 
      className={cn(
        'rounded-xl flex items-center justify-center',
        sizeClasses[size],
        colorMap[category],
        className
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
};
