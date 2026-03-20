'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { format } from 'date-fns'
import type { Activity } from '@/types'

interface ActivityTimelineProps {
  activities: Activity[]
  className?: string
}

const activityConfig: Record<string, { icon: string; color: string }> = {
  created: { icon: '📝', color: 'bg-teal-100 dark:bg-teal-900/30' },
  assigned: { icon: '👤', color: 'bg-violet-100 dark:bg-violet-900/30' },
  status_changed: { icon: '🔄', color: 'bg-amber-100 dark:bg-amber-900/30' },
  priority_changed: { icon: '⚡', color: 'bg-orange-100 dark:bg-orange-900/30' },
  replied: { icon: '💬', color: 'bg-teal-100 dark:bg-teal-900/30' },
  note_added: { icon: '📌', color: 'bg-slate-100 dark:bg-slate-900/30' },
  resolved: { icon: '✅', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
  reopened: { icon: '🔓', color: 'bg-rose-100 dark:bg-rose-900/30' },
  closed: { icon: '📂', color: 'bg-gray-100 dark:bg-gray-900/30' },
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <ScrollArea className={cn('h-[400px]', className)}>
      <div className="relative px-4 py-2">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Activities */}
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const config = activityConfig[activity.type] || activityConfig.created

            return (
              <div key={activity.id} className="relative flex gap-3">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm',
                    config.color
                  )}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {activity.user && (
                      <>
                        <AvatarWithStatus
                          name={activity.user.name}
                          src={activity.user.avatar}
                          size="sm"
                          className="h-5 w-5"
                        />
                        <span className="text-xs text-gray-500">
                          {activity.user.name}
                        </span>
                      </>
                    )}
                    <span className="text-xs text-gray-400">
                      {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}
