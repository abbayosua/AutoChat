'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AIIndicator } from '@/components/atoms/ai-indicator'
import { Sparkles, Copy, Check, Edit, Send } from 'lucide-react'

interface ResponseSuggestion {
  id: string
  content: string
  type: 'greeting' | 'solution' | 'follow_up' | 'closing'
}

interface ResponseSuggestionsProps {
  suggestions: ResponseSuggestion[]
  isLoading?: boolean
  onAccept?: (suggestion: ResponseSuggestion) => void
  onEdit?: (suggestion: ResponseSuggestion) => void
  className?: string
}

export function ResponseSuggestions({
  suggestions,
  isLoading = false,
  onAccept,
  onEdit,
  className,
}: ResponseSuggestionsProps) {
  const [copiedId, setCopiedId] = useState<string>()

  const handleCopy = async (suggestion: ResponseSuggestion) => {
    await navigator.clipboard.writeText(suggestion.content)
    setCopiedId(suggestion.id)
    setTimeout(() => setCopiedId(undefined), 2000)
  }

  if (isLoading) {
    return (
      <Card className={cn('border-violet-200 dark:border-violet-800', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <AIIndicator isProcessing />
            AI Response Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-violet-200 dark:border-violet-800', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-violet-500" />
          AI Response Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {suggestion.content}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => onAccept?.(suggestion)}
                className="bg-teal-600 hover:bg-teal-700 h-7"
              >
                <Send className="h-3 w-3 mr-1" />
                Use
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit?.(suggestion)}
                className="h-7"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(suggestion)}
                className="h-7 ml-auto"
              >
                {copiedId === suggestion.id ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No suggestions available. Start typing to get AI suggestions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
