'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react'
import type { TicketPriority } from '@/types'

const priorityConfig: Record<TicketPriority, { label: string; className: string; icon: typeof AlertTriangle }> = {
  urgent: {
    label: 'Urgent',
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    icon: AlertTriangle,
  },
  high: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    icon: ArrowUp,
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    icon: Minus,
  },
  low: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    icon: ArrowDown,
  },
}

interface PriorityBadgeProps {
  priority: TicketPriority
  showIcon?: boolean
  className?: string
}

export function PriorityBadge({ priority, showIcon = true, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.medium
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn('font-medium border-0 gap-1', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
