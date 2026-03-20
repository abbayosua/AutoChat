import { NextRequest, NextResponse } from 'next/server'
import { LLM } from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, ticketId } = body

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      )
    }

    const llm = new LLM()
    const response = await llm.chat({
      messages: [
        {
          role: 'user',
          content: `Analyze the sentiment of the following customer support message. Respond with only a JSON object:
{"sentiment": "positive" | "neutral" | "negative", "score": <number between -1 and 1>, "confidence": <number between 0 and 1>}

Message: "${text}"`,
        },
      ],
      maxTokens: 100,
    })

    let result
    try {
      const jsonMatch = response.content?.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        result = { sentiment: 'neutral', score: 0, confidence: 0.5 }
      }
    } catch {
      result = { sentiment: 'neutral', score: 0, confidence: 0.5 }
    }

    return NextResponse.json({
      success: true,
      data: {
        ticketId,
        ...result,
      },
    })
  } catch (error) {
    console.error('Error analyzing sentiment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to analyze sentiment' },
      { status: 500 }
    )
  }
}
