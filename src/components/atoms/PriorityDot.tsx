// ============================================
// ATOMS: PriorityDot
// ============================================

import { cn } from '@/lib/utils';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-400',
  high: 'bg-orange-500',
  urgent: 'bg-rose-500',
};

interface PriorityDotProps {
  priority: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
};

export function PriorityDot({ priority, size = 'md', className }: PriorityDotProps) {
  return (
    <span
      className={cn(
        'rounded-full',
        PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium,
        SIZE_CLASSES[size],
        className
      )}
    />
  );
}

export default PriorityDot;
