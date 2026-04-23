import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, type TooltipProps } from 'recharts';
import { Expense, CATEGORIES, CategoryType } from '@/types/expense';
import { PieChartIcon } from 'lucide-react';

interface CategoryPieChartProps {
  expenses: Expense[];
}

const COLORS: Record<CategoryType, string> = {
  food: 'hsl(24, 100%, 55%)',
  transport: 'hsl(221, 83%, 53%)',
  housing: 'hsl(142, 71%, 40%)',
  leisure: 'hsl(271, 91%, 65%)',
  shopping: 'hsl(339, 90%, 55%)',
  health: 'hsl(354, 70%, 54%)',
  education: 'hsl(45, 93%, 47%)',
  other: 'hsl(215, 16%, 47%)',
};

export const CategoryPieChart = ({ expenses }: CategoryPieChartProps) => {
  const data = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: cat.label,
      value: total,
      color: COLORS[cat.id],
      id: cat.id,
    };
  }).filter(d => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <PieChartIcon className="w-7 h-7" />
        </div>
        <p className="font-medium">Aucune donnée</p>
        <p className="text-sm">Ajoutez des dépenses pour voir la répartition</p>
      </div>
    );
  }

  type CategoryChartDatum = { name: string; value: number; color: string; id: CategoryType };
  type CategoryTooltipProps = TooltipProps<number, string>;

  const CustomTooltip = ({ active, payload }: CategoryTooltipProps) => {
    const datum = payload?.[0]?.payload as CategoryChartDatum | undefined;

    if (active && datum) {
      const percentage = ((datum.value / total) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: datum.color }}
            />
            <p className="font-semibold text-foreground">{datum.name}</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{datum.value.toFixed(2)} €</p>
          <p className="text-sm text-muted-foreground">{percentage}% du total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Total */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{total.toFixed(0)} €</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};