// ============================================
// ATOMS: AIIndicator
// ============================================

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function AIIndicator({ size = 'md', animated = true, className }: AIIndicatorProps) {
  return (
    <div className={cn('inline-flex items-center justify-center', className)}>
      <Sparkles
        className={cn(
          'text-violet-500',
          SIZE_CLASSES[size],
          animated && 'animate-pulse'
        )}
      />
    </div>
  );
}

export default AIIndicator;
