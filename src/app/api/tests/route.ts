import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const testSets = await db.testSet.findMany({ orderBy: { createdAt: 'asc' } })
  // attach question count
  const result = testSets.map((t) => ({
    ...t,
    questionIds: JSON.parse(t.questionIds),
    questionCount: (JSON.parse(t.questionIds) as string[]).length,
  }))
  return NextResponse.json({ testSets: result })
}
