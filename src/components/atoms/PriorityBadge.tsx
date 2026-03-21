// ============================================
// ATOMS: PriorityBadge
// ============================================

import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Minus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG: Record<string, { label: string; icon: typeof ArrowDown; color: string }> = {
  low: { label: 'Low', icon: ArrowDown, color: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', icon: Minus, color: 'bg-amber-100 text-amber-600' },
  high: { label: 'High', icon: ArrowUp, color: 'bg-orange-100 text-orange-600' },
  urgent: { label: 'Urgent', icon: AlertTriangle, color: 'bg-rose-100 text-rose-600' },
};

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: TicketPriority;
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showLabel = true, className }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.color, 'gap-1', className)}>
      <Icon className="h-3 w-3" />
      {showLabel && <span>{config.label}</span>}
    </Badge>
  );
}

export default PriorityBadge;
