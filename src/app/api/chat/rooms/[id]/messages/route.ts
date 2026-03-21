import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/chat/rooms/[id]/messages - Get messages for a room
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: roomId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // cursor for pagination

    const where: { roomId: string; createdAt?: { lt: Date } } = { roomId }
    if (before) {
      where.createdAt = { lt: new Date(before) }
    }

    const messages = await db.chatMessage.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Reverse to get chronological order
    const orderedMessages = messages.reverse()

    const formattedMessages = orderedMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      type: msg.type,
      createdAt: msg.createdAt,
      sender: {
        id: msg.sender.id,
        name: msg.sender.name,
        avatar: msg.sender.avatar,
      }
    }))

    return NextResponse.json({ success: true, data: formattedMessages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: true, data: [] })
  }
}

// POST /api/chat/rooms/[id]/messages - Send a message to a room
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: roomId } = await params
    const body = await request.json()
    const { content, senderId, senderName } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Find or create a sender if senderId not provided
    let actualSenderId = senderId

    if (!actualSenderId) {
      // Create or find a guest user
      const guestUser = await db.user.upsert({
        where: { email: `guest-${Date.now()}@autochat.temp` },
        create: {
          email: `guest-${Date.now()}@autochat.temp`,
          name: senderName || 'Guest User',
          role: 'customer',
          status: 'online',
        },
        update: {
          status: 'online',
        }
      })
      actualSenderId = guestUser.id
    }

    // Verify room exists
    const room = await db.chatRoom.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      // Create room if it doesn't exist
      await db.chatRoom.create({
        data: {
          id: roomId,
          name: roomId.charAt(0).toUpperCase() + roomId.slice(1) + ' Support',
          type: 'public',
        }
      })
    }

    const message = await db.chatMessage.create({
      data: {
        content: content.trim(),
        roomId,
        senderId: actualSenderId,
        type: 'message',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        }
      }
    })

    const formattedMessage = {
      id: message.id,
      content: message.content,
      type: message.type,
      createdAt: message.createdAt,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar,
      }
    }

    return NextResponse.json({ success: true, data: formattedMessage })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
