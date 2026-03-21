// ============================================
// ATOMS: TypingIndicator
// ============================================

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  text?: string;
  className?: string;
}

export function TypingIndicator({ text = 'typing', className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex gap-0.5">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-slate-500 italic">{text}</span>
    </div>
  );
}

export default TypingIndicator;
