import { NextRequest, NextResponse } from 'next/server'
import { LLM } from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, conversationHistory, customerMessage } = body

    // Build context for AI
    const context = conversationHistory
      ?.map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n') || ''

    const prompt = `You are a helpful customer support agent. Based on the conversation below, suggest 2-3 professional and helpful response options. Each response should be concise and address the customer's concern.

Conversation:
${context}

Latest customer message: ${customerMessage}

Please provide 2-3 response suggestions in JSON format:
{"suggestions": [{"id": "1", "content": "...", "type": "solution"}, {"id": "2", "content": "...", "type": "follow_up"}]}

Keep responses professional, empathetic, and solution-focused. Each response should be 2-3 sentences max.`

    const llm = new LLM()
    const response = await llm.chat({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 500,
    })

    // Parse the response to extract suggestions
    let suggestions = []
    try {
      const jsonMatch = response.content?.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        suggestions = parsed.suggestions || []
      }
    } catch {
      // If parsing fails, create default suggestions
      suggestions = [
        {
          id: '1',
          content: 'Thank you for reaching out. Let me look into this for you right away.',
          type: 'greeting',
        },
        {
          id: '2',
          content: 'I understand your concern. I will escalate this to our technical team and get back to you shortly.',
          type: 'follow_up',
        },
      ]
    }

    return NextResponse.json({
      success: true,
      data: {
        suggestions,
        ticketId,
      },
    })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
