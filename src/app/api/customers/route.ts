import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const where: Record<string, unknown> = { role: 'customer' }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }
    
    const customers = await db.user.findMany({
      where,
      take: limit,
      include: {
        _count: { select: { ticketsAsCustomer: true } },
        ticketsAsCustomer: {
          where: { satisfactionRating: { isNot: null } },
          select: { 
            satisfactionRating: { 
              select: { rating: true } 
            } 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Calculate average satisfaction per customer
    const customersWithStats = customers.map(c => {
      const ratings = c.ticketsAsCustomer
        .map(t => t.satisfactionRating?.rating)
        .filter(Boolean) as number[]
      const avgSatisfaction = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : null
      
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        avatar: c.avatar,
        status: c.status,
        createdAt: c.createdAt,
        ticketCount: c._count.ticketsAsCustomer,
        avgSatisfaction
      }
    })
    
    return NextResponse.json({ success: true, data: customersWithStats })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company } = body
    
    // Check if customer with email already exists
    const existingCustomer = await db.user.findUnique({
      where: { email }
    })
    
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email already exists' },
        { status: 400 }
      )
    }
    
    const customer = await db.user.create({
      data: {
        name,
        email,
        role: 'customer',
        status: 'offline',
      }
    })
    
    return NextResponse.json({ success: true, data: customer })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
