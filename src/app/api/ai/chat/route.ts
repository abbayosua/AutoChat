import { NextRequest, NextResponse } from 'next/server'
import { generateContent, SYSTEM_PROMPTS } from '@/lib/ai/gemini'
import { db } from '@/lib/db'

// POST /api/ai/chat - Chat with AI assistant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [] } = body

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

    // Build conversation context
    const contextPrompt = history.length > 0
      ? history.map((msg: { role: string; content: string }) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n') + `\n\nUser: ${message}`
      : message

    // Generate AI response
    const response = await generateContent(
      contextPrompt,
      SYSTEM_PROMPTS.customerSupport,
      apiKey
    )

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || 'AI generation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response.content,
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI response' },
      { status: 500 }
    )
  }
}
