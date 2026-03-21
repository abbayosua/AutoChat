import { NextRequest, NextResponse } from 'next/server'
import { analyzeSentiment } from '@/lib/ai/gemini'
import { db } from '@/lib/db'

// POST /api/ai/analyze-sentiment - Analyze sentiment of a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, ticketId } = body

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get user's API key from settings (BYOK)
    const apiKeySetting = await db.settings.findUnique({
      where: { key: 'gemini_api_key' }
    })
    
    const apiKey = apiKeySetting?.value || undefined

    // Analyze sentiment
    const result = await analyzeSentiment(message, apiKey)

    // Optionally update ticket with sentiment
    if (ticketId) {
      try {
        await db.ticket.update({
          where: { id: ticketId },
          data: {
            sentiment: result.sentiment,
            sentimentScore: result.confidence,
          }
        })
      } catch {
        // Ignore if ticket doesn't exist
      }
    }

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}
