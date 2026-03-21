// ============================================
// API: Agents List
// ============================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const agents = await db.user.findMany({
      where: { role: { in: ['admin', 'agent'] } },
      select: { id: true, name: true, email: true, avatar: true, status: true, role: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
