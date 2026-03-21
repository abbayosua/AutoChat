// ============================================
// ATOMS: MetricValue
// ============================================

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricValueProps {
  value: number | string;
  trend?: number;
  trendLabel?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

export function MetricValue({ 
  value, 
  trend, 
  trendLabel, 
  unit,
  size = 'md',
  className 
}: MetricValueProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const isNeutral = trend === 0;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline gap-1">
        <span className={cn('font-bold text-slate-900', SIZE_CLASSES[size])}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-1">
          {isPositive && (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          )}
          {isNegative && (
            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
          )}
          {isNeutral && (
            <Minus className="h-3.5 w-3.5 text-slate-400" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isPositive && 'text-emerald-600',
              isNegative && 'text-rose-600',
              isNeutral && 'text-slate-500'
            )}
          >
            {isPositive && '+'}
            {trend.toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-xs text-slate-500">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default MetricValue;
