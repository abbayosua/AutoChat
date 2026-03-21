// ============================================
// AutoChat - Gemini AI Service with BYOK Support
// ============================================

import { GoogleGenerativeAI } from '@google/generative-ai'

// Default test API key (can be overridden by user's own key)
const DEFAULT_API_KEY = 'AIzaSyDKbMYocbrAz3coem7tnOexXYOZqKL2JGU'
const MODEL_NAME = 'gemini-2.0-flash-lite' // Gemini 2.5 Flash-Lite

// System prompts for different use cases
export const SYSTEM_PROMPTS = {
  customerSupport: `You are an expert customer support agent for AutoChat, an AI-powered customer support platform. 
Your role is to help draft professional, empathetic, and helpful responses to customer inquiries.
Keep responses concise but thorough. Use a friendly, professional tone.
Always acknowledge the customer's concern before providing a solution.
If you don't know something, be honest and suggest escalating to a human agent.`,

  sentimentAnalysis: `You are a sentiment analysis expert. Analyze the emotional tone of customer messages.
Classify sentiment as: positive, neutral, or negative.
Also provide a confidence score (0-1) and a brief explanation.
Respond in JSON format: { "sentiment": "positive|neutral|negative", "confidence": 0.0-1.0, "explanation": "brief explanation" }`,

  responseSuggestion: `You are an AI assistant helping customer support agents write responses.
Given a customer's message and context, suggest 3 different response options:
1. A friendly, casual response
2. A professional, formal response  
3. A detailed, thorough response

Format each response clearly with the style label.`,

  ticketSummary: `You are an expert at summarizing customer support tickets.
Create concise summaries that capture:
- The main issue or request
- Key details and context
- Current status and next steps
Keep summaries under 100 words.`,

  knowledgeBase: `You are a knowledge base article writer for AutoChat customer support platform.
Write clear, helpful articles that:
- Start with a brief introduction
- Use step-by-step instructions where appropriate
- Include tips and best practices
- End with related topics or next steps`,
}

// Response interface
export interface AIResponse {
  success: boolean
  content?: string
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// Sentiment analysis result
export interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative'
  confidence: number
  explanation: string
}

// Response suggestion
export interface ResponseSuggestion {
  id: string
  content: string
  type: 'friendly' | 'professional' | 'detailed' | 'solution' | 'follow_up'
}

// Create Gemini client with optional custom API key
function createGeminiClient(apiKey?: string) {
  const key = apiKey || DEFAULT_API_KEY
  const genAI = new GoogleGenerativeAI(key)
  return genAI.getGenerativeModel({ model: MODEL_NAME })
}

// Generate content with Gemini
export async function generateContent(
  prompt: string,
  systemPrompt: string = SYSTEM_PROMPTS.customerSupport,
  apiKey?: string
): Promise<AIResponse> {
  try {
    const model = createGeminiClient(apiKey)
    
    const fullPrompt = `${systemPrompt}\n\n---\n\n${prompt}`
    
    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return {
      success: true,
      content: text,
      usage: {
        promptTokens: 0, // Gemini doesn't provide token counts in the same way
        completionTokens: 0,
        totalTokens: 0,
      },
    }
  } catch (error) {
    console.error('Gemini AI error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate content',
    }
  }
}

// Stream content with Gemini
export async function* streamContent(
  prompt: string,
  systemPrompt: string = SYSTEM_PROMPTS.customerSupport,
  apiKey?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const model = createGeminiClient(apiKey)
    
    const fullPrompt = `${systemPrompt}\n\n---\n\n${prompt}`
    
    const result = await model.generateContentStream(fullPrompt)
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      if (chunkText) {
        yield chunkText
      }
    }
  } catch (error) {
    console.error('Gemini streaming error:', error)
    throw error
  }
}

// Analyze sentiment of a message
export async function analyzeSentiment(
  message: string,
  apiKey?: string
): Promise<SentimentResult> {
  const prompt = `Analyze the sentiment of this customer message:\n\n"${message}"`
  
  const response = await generateContent(prompt, SYSTEM_PROMPTS.sentimentAnalysis, apiKey)
  
  if (!response.success || !response.content) {
    return {
      sentiment: 'neutral',
      confidence: 0.5,
      explanation: 'Unable to analyze sentiment',
    }
  }
  
  try {
    // Try to parse JSON response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        sentiment: parsed.sentiment || 'neutral',
        confidence: parsed.confidence || 0.5,
        explanation: parsed.explanation || '',
      }
    }
  } catch {
    // Fall back to text analysis
    const content = response.content.toLowerCase()
    if (content.includes('positive')) {
      return { sentiment: 'positive', confidence: 0.7, explanation: 'Positive language detected' }
    }
    if (content.includes('negative')) {
      return { sentiment: 'negative', confidence: 0.7, explanation: 'Negative language detected' }
    }
  }
  
  return {
    sentiment: 'neutral',
    confidence: 0.5,
    explanation: 'Neutral tone detected',
  }
}

// Generate response suggestions
export async function generateResponseSuggestions(
  customerMessage: string,
  context?: string,
  apiKey?: string
): Promise<ResponseSuggestion[]> {
  const prompt = `Customer message: "${customerMessage}"
${context ? `Additional context: ${context}` : ''}

Generate 3 different response options for this customer inquiry.`
  
  const response = await generateContent(prompt, SYSTEM_PROMPTS.responseSuggestion, apiKey)
  
  if (!response.success || !response.content) {
    return [
      { style: 'friendly', content: 'Thank you for reaching out. How can I help you today?' },
      { style: 'professional', content: 'Thank you for contacting support. We are here to assist you.' },
      { style: 'detailed', content: 'Thank you for your message. Please provide more details so we can assist you better.' },
    ]
  }
  
  // Parse the response to extract different suggestions
  const suggestions: ResponseSuggestion[] = []
  const content = response.content
  
  // Try to identify different response styles
  const sections = content.split(/\d\.\s*(?:A\s+)?(?:friendly|professional|detailed)?/i)
  
  if (sections.length >= 3) {
    suggestions.push({ style: 'friendly', content: sections[1]?.trim() || '' })
    suggestions.push({ style: 'professional', content: sections[2]?.trim() || '' })
    suggestions.push({ style: 'detailed', content: sections[3]?.trim() || '' })
  } else {
    // Fallback: split by newlines and create suggestions
    const lines = content.split('\n\n').filter(l => l.trim().length > 20)
    suggestions.push({ style: 'friendly', content: lines[0] || content })
    suggestions.push({ style: 'professional', content: lines[1] || content })
    suggestions.push({ style: 'detailed', content: lines[2] || content })
  }
  
  return suggestions
}

// Generate ticket summary
export async function generateTicketSummary(
  title: string,
  description: string,
  messages?: string[],
  apiKey?: string
): Promise<string> {
  const prompt = `Ticket Title: ${title}
Ticket Description: ${description}
${messages?.length ? `Recent Messages:\n${messages.slice(-5).join('\n')}` : ''}

Provide a concise summary of this ticket.`
  
  const response = await generateContent(prompt, SYSTEM_PROMPTS.ticketSummary, apiKey)
  
  return response.success && response.content 
    ? response.content 
    : `${title}: ${description.substring(0, 100)}...`
}

// Generate knowledge base article
export async function generateKnowledgeArticle(
  topic: string,
  category: string,
  apiKey?: string
): Promise<{ title: string; content: string }> {
  const prompt = `Write a knowledge base article about: ${topic}
Category: ${category}
Include a clear title, introduction, step-by-step instructions, and tips.`
  
  const response = await generateContent(prompt, SYSTEM_PROMPTS.knowledgeBase, apiKey)
  
  if (!response.success || !response.content) {
    return {
      title: topic,
      content: `Article about ${topic} coming soon...`,
    }
  }
  
  // Extract title from the response (usually the first line)
  const lines = response.content.split('\n')
  const title = lines[0]?.replace(/^#+\s*/, '') || topic
  const content = lines.slice(1).join('\n').trim()
  
  return { title, content }
}

// Chat with AI assistant
export async function chatWithAI(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  apiKey?: string
): Promise<string> {
  // Build conversation context
  const contextPrompt = conversationHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n')
  
  const prompt = contextPrompt 
    ? `Previous conversation:\n${contextPrompt}\n\nUser: ${userMessage}`
    : userMessage
  
  const response = await generateContent(prompt, SYSTEM_PROMPTS.customerSupport, apiKey)
  
  return response.success && response.content 
    ? response.content 
    : 'I apologize, but I encountered an issue. Please try again.'
}

// Check if API key is valid
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const model = createGeminiClient(apiKey)
    await model.generateContent('Hello')
    return true
  } catch {
    return false
  }
}
