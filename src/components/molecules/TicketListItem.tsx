// ============================================
// MOLECULES: TicketListItem
// ============================================

import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { PriorityBadge } from '@/components/atoms/PriorityBadge';
import { PriorityDot } from '@/components/atoms/PriorityDot';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import { TimerDisplay } from '@/components/atoms/TimerDisplay';
import { MessageSquare, Paperclip } from 'lucide-react';
import type { Ticket, User } from '@/types';

interface TicketListItemProps {
  ticket: Ticket & { customer?: User; agent?: User };
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
}

export function TicketListItem({
  ticket,
  onClick,
  isSelected = false,
  className,
}: TicketListItemProps) {
  const minutesSinceCreated = Math.floor(
    (Date.now() - new Date(ticket.createdAt).getTime()) / 60000
  );

  const getTimerVariant = () => {
    if (ticket.priority === 'urgent' && minutesSinceCreated > 30) return 'critical';
    if (ticket.priority === 'high' && minutesSinceCreated > 60) return 'warning';
    return 'default';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-slate-100 cursor-pointer transition-colors',
        'hover:bg-slate-50',
        isSelected && 'bg-teal-50 border-l-4 border-l-teal-500',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Priority Indicator */}
        <PriorityDot priority={ticket.priority} size="lg" />

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 font-mono">
              #{ticket.id.slice(0, 6)}
            </span>
            <StatusBadge status={ticket.status} size="sm" />
            <PriorityBadge priority={ticket.priority} showLabel={false} />
          </div>

          {/* Title */}
          <h4 className="font-medium text-slate-900 truncate mb-1">
            {ticket.title}
          </h4>

          {/* Description Preview */}
          <p className="text-sm text-slate-500 line-clamp-1 mb-2">
            {ticket.description}
          </p>

          {/* Footer Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Customer */}
              {ticket.customer && (
                <div className="flex items-center gap-2">
                  <AvatarWithStatus
                    name={ticket.customer.name}
                    src={ticket.customer.avatar}
                    size="sm"
                  />
                  <span className="text-xs text-slate-600">
                    {ticket.customer.name}
                  </span>
                </div>
              )}

              {/* Agent */}
              {ticket.agent && (
                <div className="flex items-center gap-1">
                  <AvatarWithStatus
                    name={ticket.agent.name}
                    src={ticket.agent.avatar}
                    status="online"
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Time & Messages */}
            <div className="flex items-center gap-3">
              <TimerDisplay minutes={minutesSinceCreated} variant={getTimerVariant()} showIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketListItem;
