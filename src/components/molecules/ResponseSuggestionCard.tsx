// ============================================
// MOLECULES: ResponseSuggestionCard
// ============================================

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIIndicator } from '@/components/atoms/AIIndicator';
import { Check, Copy, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { AISuggestion } from '@/types';

interface ResponseSuggestionCardProps {
  suggestion: AISuggestion;
  onAccept?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function ResponseSuggestionCard({
  suggestion,
  onAccept,
  onEdit,
  onCopy,
  className,
}: ResponseSuggestionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion.content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const toneColors = {
    professional: 'border-teal-200 bg-teal-50',
    friendly: 'border-emerald-200 bg-emerald-50',
    empathetic: 'border-violet-200 bg-violet-50',
  };

  return (
    <Card className={cn('border', toneColors[suggestion.tone], className)}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <AIIndicator size="sm" animated={false} />
          <span className="text-xs font-medium text-slate-600 capitalize">
            {suggestion.tone}
          </span>
          <span className="text-xs text-slate-400 ml-auto">
            {Math.round(suggestion.confidence * 100)}% match
          </span>
        </div>
        <p className="text-sm text-slate-700 mb-3 line-clamp-3">
          {suggestion.content}
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onAccept} className="flex-1">
            <Check className="h-3.5 w-3.5 mr-1" />
            Use
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResponseSuggestionCard;
