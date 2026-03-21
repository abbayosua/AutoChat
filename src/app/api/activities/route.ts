import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const cursor = searchParams.get('cursor')

    const activities = await db.activity.findMany({
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        ticket: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const nextCursor =
      activities.length === limit
        ? activities[activities.length - 1]?.id
        : null

    return NextResponse.json({
      success: true,
      data: activities,
      pagination: {
        nextCursor,
        hasMore: activities.length === limit,
      },
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
