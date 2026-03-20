import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tickets = await db.ticket.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            status: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            status: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: tickets })
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, customerId, priority, category } = body

    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        customerId,
        priority: priority || 'medium',
        category,
      },
      include: {
        customer: true,
        tags: {
          include: { tag: true },
        },
      },
    })

    // Create activity
    await db.activity.create({
      data: {
        type: 'created',
        description: `Ticket created: ${title}`,
        ticketId: ticket.id,
        userId: customerId,
      },
    })

    return NextResponse.json({ success: true, data: ticket })
  } catch (error) {
    console.error('Error creating ticket:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    )
  }
}
