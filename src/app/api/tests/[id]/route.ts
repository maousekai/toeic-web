import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testSet = await db.testSet.findUnique({ where: { id } })
  if (!testSet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ids = JSON.parse(testSet.questionIds) as string[]
  const questions = await db.question.findMany({ where: { id: { in: ids } } })
  // preserve order
  const ordered = ids.map((qid) => questions.find((q) => q.id === qid)).filter(Boolean)
  // parse options
  const parsed = ordered.map((q: any) => ({ ...q, options: JSON.parse(q.options) }))

  return NextResponse.json({
    testSet: { ...testSet, questionIds: ids },
    questions: parsed,
  })
}
