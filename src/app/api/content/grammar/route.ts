import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const lessons = await db.grammarLesson.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true, slug: true, category: true, level: true, summary: true, example: true },
  })
  return NextResponse.json({ lessons })
}
