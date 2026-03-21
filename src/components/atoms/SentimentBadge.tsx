// ============================================
// ATOMS: SentimentBadge
// ============================================

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SENTIMENT_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  positive: { label: 'Positive', emoji: '😊', color: 'bg-emerald-100 text-emerald-700' },
  neutral: { label: 'Neutral', emoji: '😐', color: 'bg-slate-100 text-slate-700' },
  negative: { label: 'Negative', emoji: '😟', color: 'bg-rose-100 text-rose-700' },
};

export type SentimentType = 'positive' | 'neutral' | 'negative';

interface SentimentBadgeProps {
  sentiment: SentimentType;
  score?: number;
  showEmoji?: boolean;
  className?: string;
}

export function SentimentBadge({ 
  sentiment, 
  score, 
  showEmoji = true, 
  className 
}: SentimentBadgeProps) {
  const config = SENTIMENT_CONFIG[sentiment] || SENTIMENT_CONFIG.neutral;

  return (
    <Badge variant="outline" className={cn(config.color, 'gap-1', className)}>
      {showEmoji && <span>{config.emoji}</span>}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="text-xs opacity-70">({score.toFixed(2)})</span>
      )}
    </Badge>
  );
}

export default SentimentBadge;
