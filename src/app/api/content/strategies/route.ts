import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const strategies = await db.strategy.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json({ strategies })
}
