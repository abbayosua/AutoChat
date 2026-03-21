// ============================================
// MOLECULES: MetricCard
// ============================================

import { Card, CardContent } from '@/components/ui/card';
import { MetricValue } from '@/components/atoms/MetricValue';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon?: LucideIcon;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  trendLabel = 'vs last period',
  icon: Icon,
  unit,
  size = 'md',
  loading = false,
  className,
}: MetricCardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
            </div>
            {Icon && <div className="h-5 w-5 bg-slate-100 rounded animate-pulse" />}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <MetricValue value={value} trend={trend} trendLabel={trendLabel} unit={unit} size={size} />
          </div>
          {Icon && (
            <div className="p-2 bg-slate-50 rounded-lg">
              <Icon className="h-5 w-5 text-slate-600" />
            </div>
          )}
        </div>
        {trend !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            {isPositive && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
            {isNegative && <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
            <span
              className={cn(
                'text-xs font-medium',
                isPositive && 'text-emerald-600',
                isNegative && 'text-rose-600',
                trend === 0 && 'text-slate-500'
              )}
            >
              {isPositive && '+'}
              {trend.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MetricCard;
