import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ learnerId: string }> }) {
  const { learnerId } = await params
  const attempts = await db.testAttempt.findMany({
    where: { learnerId },
    orderBy: { startedAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ attempts })
}
