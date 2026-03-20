'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface AIIndicatorProps {
  isProcessing?: boolean
  className?: string
}

export function AIIndicator({ isProcessing = false, className }: AIIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className={cn('relative', isProcessing && 'animate-pulse')}>
        <Sparkles
          className={cn(
            'h-4 w-4 text-violet-500',
            isProcessing && 'animate-bounce'
          )}
        />
        {isProcessing && (
          <span className="absolute inset-0 rounded-full bg-violet-400/30 animate-ping" />
        )}
      </div>
      {isProcessing && (
        <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
          AI thinking...
        </span>
      )}
    </div>
  )
}
