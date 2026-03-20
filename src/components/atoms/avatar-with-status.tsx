'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { UserStatus } from '@/types'

const statusColors: Record<UserStatus, string> = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  away: 'bg-amber-500',
  busy: 'bg-rose-500',
}

interface AvatarWithStatusProps {
  src?: string
  name: string
  status?: UserStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

const indicatorSizes = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
}

export function AvatarWithStatus({
  src,
  name,
  status = 'offline',
  size = 'md',
  className,
}: AvatarWithStatusProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span
        className={cn(
          'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-gray-900',
          statusColors[status],
          indicatorSizes[size]
        )}
      />
    </div>
  )
}
