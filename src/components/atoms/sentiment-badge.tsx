'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Smile, Meh, Frown } from 'lucide-react'
import type { SentimentType } from '@/types'

const sentimentConfig: Record<SentimentType, { label: string; className: string; icon: typeof Smile }> = {
  positive: {
    label: 'Positive',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: Smile,
  },
  neutral: {
    label: 'Neutral',
    className: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    icon: Meh,
  },
  negative: {
    label: 'Negative',
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    icon: Frown,
  },
}

interface SentimentBadgeProps {
  sentiment: SentimentType
  score?: number
  showIcon?: boolean
  className?: string
}

export function SentimentBadge({ sentiment, score, showIcon = true, className }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment] || sentimentConfig.neutral
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn('font-medium border-0 gap-1', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
      {score !== undefined && (
        <span className="text-xs opacity-70">({Math.round(score * 100)}%)</span>
      )}
    </Badge>
  )
}
