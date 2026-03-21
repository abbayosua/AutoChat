import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Default rooms to seed if none exist
const defaultRooms = [
  { id: 'general', name: 'General Support', description: 'General support discussions', type: 'public' },
  { id: 'technical', name: 'Technical Help', description: 'Technical support and troubleshooting', type: 'public' },
  { id: 'sales', name: 'Sales Inquiries', description: 'Sales and pricing questions', type: 'public' },
  { id: 'billing', name: 'Billing Support', description: 'Billing and payment issues', type: 'public' },
]

// GET /api/chat/rooms - List all chat rooms
export async function GET(request: NextRequest) {
  try {
    let rooms = await db.chatRoom.findMany({
      include: {
        _count: {
          select: { participants: true, messages: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Seed default rooms if none exist
    if (rooms.length === 0) {
      await db.chatRoom.createMany({
        data: defaultRooms,
        skipDuplicates: true
      })
      rooms = await db.chatRoom.findMany({
        include: {
          _count: {
            select: { participants: true, messages: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      })
    }

    const formattedRooms = rooms.map(room => ({
      id: room.id,
      name: room.name,
      description: room.description,
      type: room.type,
      participantCount: room._count.participants,
      messageCount: room._count.messages,
      createdAt: room.createdAt,
    }))

    return NextResponse.json({ success: true, data: formattedRooms })
  } catch (error) {
    console.error('Error fetching chat rooms:', error)

    // Return default rooms on error
    return NextResponse.json({
      success: true,
      data: defaultRooms.map(room => ({
        ...room,
        participantCount: 0,
        messageCount: 0,
        createdAt: new Date().toISOString(),
      }))
    })
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, type = 'public', createdById } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Room name is required' },
        { status: 400 }
      )
    }

    const room = await db.chatRoom.create({
      data: {
        name,
        description,
        type,
        createdById,
      }
    })

    return NextResponse.json({ success: true, data: room })
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create chat room' },
      { status: 500 }
    )
  }
}
