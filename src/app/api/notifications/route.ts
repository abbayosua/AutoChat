import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const userId = searchParams.get('userId')

    const where: Record<string, unknown> = {}
    if (unreadOnly) where.read = false
    if (userId) where.userId = userId

    const notifications = await db.notification.findMany({
      where,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        ticket: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    })

    const unreadCount = await db.notification.count({
      where: { read: false, ...(userId ? { userId } : {}) },
    })

    return NextResponse.json({
      success: true,
      data: { notifications, unreadCount },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, markAllRead, userId } = body

    if (markAllRead && userId) {
      await db.notification.updateMany({
        where: { read: false, userId },
        data: { read: true },
      })
    } else if (id) {
      await db.notification.update({
        where: { id },
        data: { read: true },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, userId, ticketId } = body

    if (!type || !title || !message || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, title, message, userId' },
        { status: 400 }
      )
    }

    const notification = await db.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        ticketId: ticketId || null,
      },
      include: {
        ticket: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
