import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const counts: Record<string, number> = {}
  for (const level of levels) {
    counts[level] = await db.vocab.count({ where: { level } })
  }
  return NextResponse.json({ counts })
}
