'use client'

import { cn } from '@/lib/utils'
import { Bell, Check, X } from 'lucide-react'
import type { Activity } from '@/types'

interface NotificationItemProps {
  activity: Activity
  onDismiss?: () => void
  onMarkRead?: () => void
  className?: string
}

const activityIcons: Record<string, string> = {
  created: '📝',
  assigned: '👤',
  status_changed: '🔄',
  priority_changed: '⚡',
  replied: '💬',
  note_added: '📌',
  resolved: '✅',
  reopened: '🔓',
  closed: '📂',
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 24) {
    return new Date(date).toLocaleDateString()
  }
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function NotificationItem({
  activity,
  onDismiss,
  onMarkRead,
  className,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
        className
      )}
    >
      <div className="flex-shrink-0 text-lg">
        {activityIcons[activity.type] || '📌'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {activity.description}
        </p>
        <span className="text-xs text-gray-500">{formatTime(activity.createdAt)}</span>
      </div>

      <div className="flex items-center gap-1">
        {onMarkRead && (
          <button
            onClick={onMarkRead}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Check className="h-4 w-4 text-gray-400" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  )
}
