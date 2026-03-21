// ============================================
// ORGANISMS: AIChatWidget
// ============================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIIndicator, TypingIndicator } from '@/components/atoms';
import { ResponseSuggestionCard } from '@/components/molecules';
import { Send, Minimize2, Maximize2, X, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AISuggestion } from '@/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatWidgetProps {
  title?: string;
  ticketId?: string;
  ticketContext?: string;
  onSuggestionAccept?: (suggestion: string) => void;
  className?: string;
  embeddable?: boolean;
}

export function AIChatWidget({
  title = 'AI Assistant',
  ticketId,
  ticketContext,
  onSuggestionAccept,
  className,
  embeddable = false,
}: AIChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with:\n• Generating response suggestions\n• Analyzing customer sentiment\n• Summarizing conversations\n• Finding relevant knowledge articles',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isExpanded, setIsExpanded] = useState(!embeddable);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          ticketId,
          context: ticketContext,
        }),
      });
      const data = await res.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (data.data.suggestions) {
          setSuggestions(data.data.suggestions);
        }
      }
    } catch (error) {
      console.error('AI chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionAccept = (suggestion: AISuggestion) => {
    onSuggestionAccept?.(suggestion.content);
    setSuggestions([]);
  };

  if (!isExpanded && embeddable) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className={cn('fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg', className)}
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        'flex flex-col',
        embeddable && 'fixed bottom-4 right-4 w-96 h-[500px] shadow-xl z-50',
        className
      )}
    >
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AIIndicator animated />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {embeddable && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white ml-8'
                    : 'bg-slate-100 text-slate-900 mr-8'
                )}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-slate-100 rounded-lg px-3 py-2 mr-8">
                <TypingIndicator text="AI is thinking" />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-t p-2 space-y-2 max-h-40 overflow-y-auto">
            <p className="text-xs text-slate-500 font-medium">Suggested Responses:</p>
            {suggestions.map((suggestion) => (
              <ResponseSuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onAccept={() => handleSuggestionAccept(suggestion)}
              />
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t p-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI for help..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default AIChatWidget;
