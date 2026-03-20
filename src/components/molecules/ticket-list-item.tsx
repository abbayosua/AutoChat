'use client'

import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/atoms/status-badge'
import { PriorityBadge } from '@/components/atoms/priority-badge'
import { SentimentBadge } from '@/components/atoms/sentiment-badge'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { TagBadge } from '@/components/atoms/tag-badge'
import { Clock, MessageSquare } from 'lucide-react'
import type { Ticket } from '@/types'

interface TicketListItemProps {
  ticket: Ticket
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function TicketListItem({
  ticket,
  onClick,
  isSelected = false,
  className,
}: TicketListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        isSelected && 'bg-teal-50 dark:bg-teal-900/20 border-l-2 border-l-teal-500',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {ticket.sentiment && <SentimentBadge sentiment={ticket.sentiment} size="sm" />}
          </div>

          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {ticket.title}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {ticket.description}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(ticket.createdAt)}
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="h-3 w-3" />
              {ticket.messages?.length || 0}
            </div>

            {ticket.tags && ticket.tags.length > 0 && (
              <div className="flex gap-1">
                {ticket.tags.slice(0, 2).map((tt) => (
                  <TagBadge key={tt.tagId} name={tt.tag.name} color={tt.tag.color} />
                ))}
                {ticket.tags.length > 2 && (
                  <span className="text-xs text-gray-500">+{ticket.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <AvatarWithStatus
          name={ticket.customer?.name || 'Unknown'}
          status="offline"
          size="sm"
        />
      </div>
    </div>
  )
}
