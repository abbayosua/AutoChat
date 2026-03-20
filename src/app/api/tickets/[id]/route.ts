import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        customer: true,
        agent: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: true,
          },
        },
        tags: {
          include: { tag: true },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { user: true },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, priority, agentId } = body

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
      if (status === 'resolved') {
        updateData.resolvedAt = new Date()
      }
    }

    if (priority) {
      updateData.priority = priority
    }

    if (agentId !== undefined) {
      updateData.agentId = agentId
    }

    const ticket = await db.ticket.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        agent: true,
        tags: { include: { tag: true } },
      },
    })

    // Create activity for status change
    if (status) {
      await db.activity.create({
        data: {
          type: 'status_changed',
          description: `Status changed to ${status}`,
          ticketId: id,
        },
      })
    }

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}
