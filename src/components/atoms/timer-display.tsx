'use client'

import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TimerDisplayProps {
  minutes: number
  label?: string
  target?: number
  showIcon?: boolean
  className?: string
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function TimerDisplay({
  minutes,
  label,
  target,
  showIcon = true,
  className,
}: TimerDisplayProps) {
  const isOverTarget = target !== undefined && minutes > target
  const isNearTarget = target !== undefined && minutes > target * 0.8 && minutes <= target

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {showIcon && (
        <Clock
          className={cn(
            'h-4 w-4',
            isOverTarget
              ? 'text-rose-500'
              : isNearTarget
              ? 'text-amber-500'
              : 'text-gray-400'
          )}
        />
      )}
      <div className="flex flex-col">
        <span
          className={cn(
            'text-sm font-medium',
            isOverTarget
              ? 'text-rose-600 dark:text-rose-400'
              : isNearTarget
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {formatDuration(minutes)}
        </span>
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  )
}
