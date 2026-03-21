// ============================================
// MOLECULES: NotificationItem
// ============================================

import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  UserPlus,
  Clock,
} from 'lucide-react';

interface NotificationItemProps {
  type: 'ticket' | 'mention' | 'assignment' | 'sla' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  onClick?: () => void;
  className?: string;
}

const ICON_MAP = {
  ticket: MessageSquare,
  mention: UserPlus,
  assignment: UserPlus,
  sla: Clock,
  system: Bell,
};

const COLOR_MAP = {
  ticket: 'text-teal-600 bg-teal-50',
  mention: 'text-violet-600 bg-violet-50',
  assignment: 'text-emerald-600 bg-emerald-50',
  sla: 'text-rose-600 bg-rose-50',
  system: 'text-slate-600 bg-slate-50',
};

export function NotificationItem({
  type,
  title,
  message,
  timestamp,
  read = false,
  onClick,
  className,
}: NotificationItemProps) {
  const Icon = ICON_MAP[type];

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 cursor-pointer transition-colors border-l-2',
        read ? 'bg-white border-l-transparent' : 'bg-slate-50 border-l-teal-500',
        'hover:bg-slate-100',
        className
      )}
    >
      <div className="flex gap-3">
        <div className={cn('p-2 rounded-lg', COLOR_MAP[type])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-slate-900">{title}</p>
          <p className="text-xs text-slate-500 line-clamp-1">{message}</p>
          <p className="text-xs text-slate-400 mt-1">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
        {!read && (
          <div className="w-2 h-2 bg-teal-500 rounded-full mt-2" />
        )}
      </div>
    </div>
  );
}

export default NotificationItem;
