// ============================================
// MOLECULES: ActivityItem
// ============================================

import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Plus,
  UserPlus,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { Activity, User } from '@/types';

interface ActivityItemProps {
  activity: Activity & { user?: User };
  className?: string;
}

const ACTIVITY_ICONS: Record<string, typeof Plus> = {
  created: Plus,
  assigned: UserPlus,
  status_changed: RefreshCw,
  replied: MessageSquare,
  resolved: CheckCircle,
  closed: XCircle,
  reopened: RefreshCw,
  note_added: MessageSquare,
  sla_breached: AlertTriangle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  created: 'text-teal-600 bg-teal-50',
  assigned: 'text-violet-600 bg-violet-50',
  status_changed: 'text-amber-600 bg-amber-50',
  replied: 'text-emerald-600 bg-emerald-50',
  resolved: 'text-teal-600 bg-teal-50',
  closed: 'text-slate-600 bg-slate-50',
  reopened: 'text-orange-600 bg-orange-50',
  note_added: 'text-slate-600 bg-slate-50',
  sla_breached: 'text-rose-600 bg-rose-50',
};

export function ActivityItem({ activity, className }: ActivityItemProps) {
  const Icon = ACTIVITY_ICONS[activity.type] || Clock;
  const colorClass = ACTIVITY_COLORS[activity.type] || 'text-slate-600 bg-slate-50';

  return (
    <div className={cn('flex gap-3 py-2', className)}>
      <div className={cn('p-1.5 rounded-full', colorClass)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700">{activity.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {activity.user && (
            <span className="text-xs text-slate-500">by {activity.user.name}</span>
          )}
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ActivityItem;
