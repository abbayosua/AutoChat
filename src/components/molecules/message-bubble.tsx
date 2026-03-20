'use client'

import { cn } from '@/lib/utils'
import { AvatarWithStatus } from '@/components/atoms/avatar-with-status'
import { AIIndicator } from '@/components/atoms/ai-indicator'
import { Check, CheckCheck, Copy } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
  isOwn?: boolean
  showAvatar?: boolean
  className?: string
}

export function MessageBubble({
  message,
  isOwn = false,
  showAvatar = true,
  className,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const isAI = message.aiGenerated
  const isSystem = message.type === 'system'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isSystem) {
    return (
      <div className={cn('text-center py-2', className)}>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[85%]',
        isOwn ? 'ml-auto flex-row-reverse' : '',
        className
      )}
    >
      {showAvatar && !isOwn && (
        <AvatarWithStatus
          name={message.sender?.name || 'User'}
          src={message.sender?.avatar}
          status="offline"
          size="sm"
        />
      )}

      <div
        className={cn(
          'rounded-2xl px-4 py-2.5 relative group',
          isOwn
            ? 'bg-teal-600 text-white rounded-tr-sm'
            : isAI
            ? 'bg-violet-50 dark:bg-violet-900/30 text-gray-900 dark:text-gray-100 rounded-tl-sm border border-violet-200 dark:border-violet-800'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm'
        )}
      >
        {isAI && (
          <div className="flex items-center gap-1 mb-1">
            <AIIndicator />
            <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
              AI Suggestion
            </span>
          </div>
        )}

        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        <div
          className={cn(
            'flex items-center gap-2 mt-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          <span
            className={cn(
              'text-xs',
              isOwn ? 'text-teal-100' : 'text-gray-500'
            )}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {isAI && (
            <button
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}

          {isOwn && (
            <CheckCheck className="h-4 w-4 text-teal-200" />
          )}
        </div>
      </div>
    </div>
  )
}
