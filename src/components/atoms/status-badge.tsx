'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TicketStatus } from '@/types'

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  pending: { label: 'Pending', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  waiting_customer: { label: 'Waiting', className: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' },
  resolved: { label: 'Resolved', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
}

interface StatusBadgeProps {
  status: TicketStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.open

  return (
    <Badge variant="outline" className={cn('font-medium border-0', config.className, className)}>
      {config.label}
    </Badge>
  )
}
