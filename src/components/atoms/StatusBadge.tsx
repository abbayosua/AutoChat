// ============================================
// ATOMS: StatusBadge
// ============================================

import { Badge } from '@/components/ui/badge';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusVariants = cva('', {
  variants: {
    status: {
      open: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      in_progress: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
      pending: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100',
      waiting_customer: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100',
      resolved: 'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100',
      closed: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100',
    },
    size: {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-2.5 py-1',
      lg: 'text-base px-3 py-1.5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending: 'Pending',
  waiting_customer: 'Waiting',
  resolved: 'Resolved',
  closed: 'Closed',
};

export type TicketStatus = 'open' | 'in_progress' | 'pending' | 'waiting_customer' | 'resolved' | 'closed';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusVariants({ status, size }), className)}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}

export default StatusBadge;
