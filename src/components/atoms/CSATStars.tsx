// ============================================
// ATOMS: CSATStars
// ============================================

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CSATStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function CSATStars({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  showValue = false,
  className 
}: CSATStarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            SIZE_CLASSES[size],
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-100 text-slate-300'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default CSATStars;
