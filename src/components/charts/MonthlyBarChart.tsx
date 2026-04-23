import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, type TooltipProps } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Expense } from '@/types/expense';
import { BarChart3 } from 'lucide-react';

interface MonthlyBarChartProps {
  expenses: Expense[];
  selectedMonth: Date;
}

export const MonthlyBarChart = ({ expenses, selectedMonth }: MonthlyBarChartProps) => {
  const start = startOfMonth(selectedMonth);
  const end = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start, end });

  // Group by week
  const weeklyData: { name: string; total: number; weekNum: number }[] = [];
  let currentWeek = 1;
  let weekTotal = 0;

  days.forEach((day, index) => {
    const dayExpenses = expenses.filter(e => isSameDay(new Date(e.date), day));
    const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    weekTotal += dayTotal;

    if ((index + 1) % 7 === 0 || index === days.length - 1) {
      weeklyData.push({
        name: `Sem ${currentWeek}`,
        total: Math.round(weekTotal * 100) / 100,
        weekNum: currentWeek,
      });
      currentWeek++;
      weekTotal = 0;
    }
  });

  const maxTotal = Math.max(...weeklyData.map(w => w.total), 1);

  type WeeklyTooltipProps = TooltipProps<number, string>;

  const CustomTooltip = ({ active, payload, label }: WeeklyTooltipProps) => {
    const value = payload?.[0]?.value;

    if (active && typeof value === 'number') {
      return (
        <div className="bg-card border border-border rounded-xl shadow-lg p-4">
          <p className="font-medium text-muted-foreground text-sm">{label}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {value.toFixed(2)} €
          </p>
        </div>
      );
    }
    return null;
  };

  if (weeklyData.every(w => w.total === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <BarChart3 className="w-7 h-7" />
        </div>
        <p className="font-medium">Aucune donnée</p>
        <p className="text-sm">Pas de dépenses ce mois</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Évolution hebdomadaire
      </h3>
      <p className="text-xs text-muted-foreground mb-6 capitalize">
        {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
          <Bar 
            dataKey="total" 
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          >
            {weeklyData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.total === maxTotal 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--primary) / 0.4)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};