import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateApiKey } from '@/lib/ai/gemini'

// GET /api/ai/settings - Get AI settings
export async function GET() {
  try {
    const settings = await db.settings.findMany({
      where: {
        OR: [
          { key: 'gemini_api_key' },
          { key: 'ai_enabled' },
          { key: 'ai_model' },
        ]
      }
    })

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: {
        hasApiKey: !!settingsMap['gemini_api_key'],
        apiKeyPreview: settingsMap['gemini_api_key'] 
          ? `${settingsMap['gemini_api_key'].substring(0, 8)}...${settingsMap['gemini_api_key'].slice(-4)}`
          : null,
        aiEnabled: settingsMap['ai_enabled'] !== 'false',
        aiModel: settingsMap['ai_model'] || 'gemini-2.0-flash-lite',
      }
    })
  } catch (error) {
    console.error('Error fetching AI settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AI settings' },
      { status: 500 }
    )
  }
}

// POST /api/ai/settings - Update AI settings (BYOK)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey, aiEnabled, aiModel } = body

    const updates = []

    // Update API key if provided
    if (apiKey !== undefined) {
      // Validate the API key before saving
      if (apiKey && apiKey.trim()) {
        const isValid = await validateApiKey(apiKey.trim())
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: 'Invalid Gemini API key. Please check your key and try again.' },
            { status: 400 }
          )
        }
      }

      updates.push(
        db.settings.upsert({
          where: { key: 'gemini_api_key' },
          create: { 
            key: 'gemini_api_key', 
            value: apiKey?.trim() || '',
            category: 'ai'
          },
          update: { value: apiKey?.trim() || '' }
        })
      )
    }

    // Update AI enabled setting
    if (aiEnabled !== undefined) {
      updates.push(
        db.settings.upsert({
          where: { key: 'ai_enabled' },
          create: { 
            key: 'ai_enabled', 
            value: String(aiEnabled),
            category: 'ai'
          },
          update: { value: String(aiEnabled) }
        })
      )
    }

    // Update AI model setting
    if (aiModel !== undefined) {
      updates.push(
        db.settings.upsert({
          where: { key: 'ai_model' },
          create: { 
            key: 'ai_model', 
            value: aiModel,
            category: 'ai'
          },
          update: { value: aiModel }
        })
      )
    }

    if (updates.length > 0) {
      await Promise.all(updates)
    }

    // Fetch updated settings
    const settings = await db.settings.findMany({
      where: {
        OR: [
          { key: 'gemini_api_key' },
          { key: 'ai_enabled' },
          { key: 'ai_model' },
        ]
      }
    })

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: {
        hasApiKey: !!settingsMap['gemini_api_key'],
        apiKeyPreview: settingsMap['gemini_api_key'] 
          ? `${settingsMap['gemini_api_key'].substring(0, 8)}...${settingsMap['gemini_api_key'].slice(-4)}`
          : null,
        aiEnabled: settingsMap['ai_enabled'] !== 'false',
        aiModel: settingsMap['ai_model'] || 'gemini-2.0-flash-lite',
      },
      message: 'AI settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating AI settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update AI settings' },
      { status: 500 }
    )
  }
}

// DELETE /api/ai/settings - Delete API key
export async function DELETE() {
  try {
    await db.settings.delete({
      where: { key: 'gemini_api_key' }
    }).catch(() => {
      // Ignore if doesn't exist
    })

    return NextResponse.json({
      success: true,
      message: 'API key removed successfully'
    })
  } catch (error) {
    console.error('Error deleting AI settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete AI settings' },
      { status: 500 }
    )
  }
}
