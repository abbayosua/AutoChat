// ============================================
// ATOMS: TimerDisplay
// ============================================

import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  minutes?: number;
  hours?: number;
  showIcon?: boolean;
  variant?: 'default' | 'warning' | 'critical';
  className?: string;
}

export function TimerDisplay({ 
  minutes = 0, 
  hours,
  showIcon = false, 
  variant = 'default',
  className 
}: TimerDisplayProps) {
  const totalMinutes = hours !== undefined ? hours * 60 : minutes;
  const displayHours = Math.floor(totalMinutes / 60);
  const displayMinutes = totalMinutes % 60;

  const formatTime = () => {
    if (displayHours > 0) {
      return `${displayHours}h ${displayMinutes}m`;
    }
    return `${displayMinutes}m`;
  };

  const variantClasses = {
    default: 'text-slate-600',
    warning: 'text-amber-600',
    critical: 'text-rose-600',
  };

  return (
    <div className={cn('flex items-center gap-1', variantClasses[variant], className)}>
      {showIcon && <Clock className="h-3.5 w-3.5" />}
      <span className="text-sm font-medium">{formatTime()}</span>
    </div>
  );
}

export default TimerDisplay;
