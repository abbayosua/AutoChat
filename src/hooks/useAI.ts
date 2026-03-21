// ============================================
// HOOKS: useAI
// ============================================

import { useState, useCallback } from 'react';
import type { AISuggestion, SentimentAnalysis, ConversationSummary, TicketClassification } from '@/types';

interface UseAIReturn {
  loading: boolean;
  error: string | null;
  generateSuggestions: (message: string, context?: string) => Promise<AISuggestion[]>;
  analyzeSentiment: (message: string) => Promise<SentimentAnalysis>;
  summarizeConversation: (messages: string[]) => Promise<ConversationSummary>;
  classifyTicket: (title: string, description: string) => Promise<TicketClassification>;
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (
    message: string,
    context?: string
  ): Promise<AISuggestion[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/suggest-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });
      const data = await res.json();
      if (data.success) return data.data.suggestions;
      throw new Error(data.error || 'Failed to generate suggestions');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeSentiment = useCallback(async (message: string): Promise<SentimentAnalysis> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.error || 'Failed to analyze sentiment');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { sentiment: 'neutral', score: 0, keywords: [], summary: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const summarizeConversation = useCallback(async (messages: string[]): Promise<ConversationSummary> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.error || 'Failed to summarize');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { mainIssue: msg, keyPoints: [], currentStatus: 'Unknown', actionItems: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const classifyTicket = useCallback(async (title: string, description: string): Promise<TicketClassification> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.error || 'Failed to classify');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { category: 'general', priority: 'medium', confidence: 0.5, suggestedAgentType: 'general' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateSuggestions,
    analyzeSentiment,
    summarizeConversation,
    classifyTicket,
  };
}

export default useAI;
