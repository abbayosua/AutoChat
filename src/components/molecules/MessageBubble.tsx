// ============================================
// MOLECULES: MessageBubble
// ============================================

import { cn } from '@/lib/utils';
import { AvatarWithStatus } from '@/components/atoms/AvatarWithStatus';
import { AIIndicator } from '@/components/atoms/AIIndicator';
import { formatDistanceToNow } from 'date-fns';
import type { Message, User } from '@/types';

interface MessageBubbleProps {
  message: Message & { sender?: User };
  isOwn?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export function MessageBubble({
  message,
  isOwn = false,
  showAvatar = true,
  className,
}: MessageBubbleProps) {
  const isAI = message.aiGenerated;
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className={cn('text-center py-2', className)}>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {showAvatar && message.sender && (
        <AvatarWithStatus
          name={message.sender.name}
          src={message.sender.avatar}
          size="sm"
        />
      )}

      <div
        className={cn(
          'max-w-[70%] rounded-lg px-3 py-2',
          isOwn
            ? 'bg-teal-600 text-white'
            : isAI
            ? 'bg-violet-50 border border-violet-200 text-slate-900'
            : 'bg-slate-100 text-slate-900'
        )}
      >
        {isAI && (
          <div className="flex items-center gap-1 mb-1">
            <AIIndicator size="sm" animated={false} />
            <span className="text-xs text-violet-600 font-medium">AI Suggestion</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span
          className={cn(
            'text-xs mt-1 block',
            isOwn ? 'text-teal-100' : 'text-slate-400'
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
