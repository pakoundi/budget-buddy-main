import { getCategoryInfo, CategoryType } from '@/types/expense';
import { cn } from '@/lib/utils';

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

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const info = getCategoryInfo(category);

  return (
    <span 
      className={cn(
        'category-badge',
        colorMap[category],
        className
      )}
    >
      {info.label}
    </span>
  );
};
