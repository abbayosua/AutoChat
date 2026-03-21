// ============================================
// API: AI Chat
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    if (!message) return NextResponse.json({ success: false, error: 'Message required' }, { status: 400 });

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'You are an AI assistant for support agents. Be concise and helpful.' },
        { role: 'user', content: context ? `Context: ${context}\n\n${message}` : message },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, I could not process that request.';

    const suggestions = message.toLowerCase().includes('suggest') ? [
      { id: '1', tone: 'professional' as const, content: 'Thank you for your message. I\'m looking into this now.', confidence: 0.85 },
      { id: '2', tone: 'friendly' as const, content: 'Hi! Thanks for reaching out. Let me help you with that.', confidence: 0.80 },
    ] : [];

    return NextResponse.json({ success: true, data: { response, suggestions } });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
