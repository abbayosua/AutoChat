import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const notes = await db.internalNote.findMany({
      where: { ticketId: id },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, data: notes })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content } = body

    // Get first agent as default author
    const agents = await db.user.findMany({
      where: { role: 'agent' },
      take: 1
    })

    const authorId = agents[0]?.id

    if (!authorId) {
      return NextResponse.json(
        { success: false, error: 'No agent found' },
        { status: 400 }
      )
    }

    const note = await db.internalNote.create({
      data: {
        content,
        ticketId: id,
        authorId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
