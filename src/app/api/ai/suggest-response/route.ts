import { NextRequest, NextResponse } from 'next/server'
import { generateResponseSuggestions } from '@/lib/ai/gemini'
import { db } from '@/lib/db'

// POST /api/ai/suggest-response - Generate response suggestions for tickets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, customerMessage, context } = body

    if (!customerMessage || !customerMessage.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer message is required' },
        { status: 400 }
      )
    }

    // Get user's API key from settings (BYOK)
    const apiKeySetting = await db.settings.findUnique({
      where: { key: 'gemini_api_key' }
    })
    
    const apiKey = apiKeySetting?.value || undefined

    // Generate response suggestions
    const suggestions = await generateResponseSuggestions(customerMessage, context, apiKey)

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        ticketId,
      }
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
