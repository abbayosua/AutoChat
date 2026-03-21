// ============================================
// AutoChat - AI Service (LLM Integration)
// ============================================

import ZAI from 'z-ai-web-dev-sdk';
import type { AISuggestion, SentimentAnalysis, ConversationSummary, TicketClassification } from '@/types';

// Initialize AI client
let aiClient: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getAIClient() {
  if (!aiClient) {
    aiClient = await ZAI.create();
  }
  return aiClient;
}

// ============================================
// System Prompts
// ============================================
export const AI_PROMPTS = {
  RESPONSE_SUGGESTION: `You are an AI assistant helping customer support agents respond to customers.
Generate helpful, professional response suggestions based on the customer's message and conversation context.
Provide 3 response options with different tones:
1. Professional - Formal and business-like
2. Friendly - Warm and conversational
3. Empathetic - Understanding and supportive

Format your response as JSON:
{
  "suggestions": [
    { "tone": "professional", "content": "..." },
    { "tone": "friendly", "content": "..." },
    { "tone": "empathetic", "content": "..." }
  ]
}`,

  SENTIMENT_ANALYSIS: `Analyze the sentiment of the customer message.
Return a JSON object with:
- sentiment: "positive", "neutral", or "negative"
- score: a number between -1.0 (very negative) and 1.0 (very positive)
- keywords: array of emotionally significant words found
- summary: brief explanation of the sentiment analysis`,

  CONVERSATION_SUMMARY: `Summarize this customer support conversation concisely.
Return a JSON object with:
- mainIssue: the primary problem or request (one sentence)
- keyPoints: array of 3-5 main discussion points
- currentStatus: current state of the ticket
- actionItems: array of next steps or required actions`,

  TICKET_CLASSIFY: `Classify this support ticket based on its title and description.
Return a JSON object with:
- category: one of [technical, billing, general, feature_request, bug]
- priority: one of [low, medium, high, urgent]
- confidence: number between 0 and 1 indicating classification confidence
- reasoning: brief explanation of the classification`,

  AGENT_SUGGESTION: `Based on the ticket content, suggest which type of agent would be best suited to handle this.
Return a JSON object with:
- agentType: the type of agent needed
- skills: array of relevant skills
- estimatedDifficulty: easy, medium, or hard
- suggestedPriority: recommended priority level`,
};

// ============================================
// Response Suggestions
// ============================================
export async function generateResponseSuggestions(
  message: string,
  context?: string,
  ticketHistory?: string[]
): Promise<AISuggestion[]> {
  const ai = await getAIClient();

  const historyContext = ticketHistory?.slice(-5).join('\n') || 'No previous messages';
  
  const completion = await ai.chat.completions.create({
    messages: [
      { role: 'assistant', content: AI_PROMPTS.RESPONSE_SUGGESTION },
      {
        role: 'user',
        content: `Customer message: "${message}"
        
Context: ${context || 'No additional context'}

Previous messages in conversation:
${historyContext}

Generate 3 response suggestions.`,
      },
    ],
    thinking: { type: 'disabled' },
  });

  const response = completion.choices[0]?.message?.content || '';
  
  try {
    const parsed = JSON.parse(response);
    return parsed.suggestions?.map((s: { tone: string; content: string }, i: number) => ({
      id: `suggestion-${i}`,
      tone: s.tone as 'professional' | 'friendly' | 'empathetic',
      content: s.content,
      confidence: 0.85,
    })) || [];
  } catch {
    // Fallback if JSON parsing fails
    return [{
      id: 'suggestion-1',
      tone: 'professional',
      content: response,
      confidence: 0.7,
    }];
  }
}

// ============================================
// Sentiment Analysis
// ============================================
export async function analyzeSentiment(
  message: string,
  conversationHistory?: string[]
): Promise<SentimentAnalysis> {
  const ai = await getAIClient();

  const fullContext = conversationHistory 
    ? `Full conversation:\n${conversationHistory.join('\n')}\n\nLatest message: "${message}"`
    : `Message: "${message}"`;

  const completion = await ai.chat.completions.create({
    messages: [
      { role: 'assistant', content: AI_PROMPTS.SENTIMENT_ANALYSIS },
      { role: 'user', content: fullContext },
    ],
    thinking: { type: 'disabled' },
  });

  const response = completion.choices[0]?.message?.content || '';

  try {
    return JSON.parse(response) as SentimentAnalysis;
  } catch {
    return {
      sentiment: 'neutral',
      score: 0,
      keywords: [],
      summary: 'Unable to analyze sentiment',
    };
  }
}

// ============================================
// Conversation Summary
// ============================================
export async function summarizeConversation(
  messages: string[]
): Promise<ConversationSummary> {
  const ai = await getAIClient();

  const conversationText = messages.map((m, i) => `[${i + 1}] ${m}`).join('\n');

  const completion = await ai.chat.completions.create({
    messages: [
      { role: 'assistant', content: AI_PROMPTS.CONVERSATION_SUMMARY },
      { role: 'user', content: `Conversation:\n${conversationText}` },
    ],
    thinking: { type: 'disabled' },
  });

  const response = completion.choices[0]?.message?.content || '';

  try {
    return JSON.parse(response) as ConversationSummary;
  } catch {
    return {
      mainIssue: 'Unable to summarize',
      keyPoints: [],
      currentStatus: 'Unknown',
      actionItems: [],
    };
  }
}

// ============================================
// Ticket Classification
// ============================================
export async function classifyTicket(
  title: string,
  description: string
): Promise<TicketClassification> {
  const ai = await getAIClient();

  const completion = await ai.chat.completions.create({
    messages: [
      { role: 'assistant', content: AI_PROMPTS.TICKET_CLASSIFY },
      {
        role: 'user',
        content: `Ticket Title: "${title}"
        
Ticket Description: "${description}"

Classify this ticket.`,
      },
    ],
    thinking: { type: 'disabled' },
  });

  const response = completion.choices[0]?.message?.content || '';

  try {
    return JSON.parse(response) as TicketClassification;
  } catch {
    return {
      category: 'general',
      priority: 'medium',
      confidence: 0.5,
      suggestedAgentType: 'general',
    };
  }
}

// ============================================
// Export all functions
// ============================================
export const aiService = {
  generateResponseSuggestions,
  analyzeSentiment,
  summarizeConversation,
  classifyTicket,
  getAIClient,
};

export default aiService;
