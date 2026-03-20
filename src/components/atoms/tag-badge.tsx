'use client'

import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
  name: string
  color?: string
  removable?: boolean
  onRemove?: () => void
  className?: string
}

export function TagBadge({
  name,
  color = '#6B7280',
  removable = false,
  onRemove,
  className,
}: TagBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border-0 gap-1 pr-1',
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      {name}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )
}
