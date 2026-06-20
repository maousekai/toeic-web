import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const attempt = await db.testAttempt.findUnique({ where: { id } })
  if (!attempt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const answers = JSON.parse(attempt.answers) as { questionId: string; selected: number | null }[]
  const ids = answers.map((a) => a.questionId)
  const questions = await db.question.findMany({ where: { id: { in: ids } } })
  const ordered = ids.map((qid) => questions.find((q) => q.id === qid)).filter(Boolean)
  const parsed = ordered.map((q: any) => ({ ...q, options: JSON.parse(q.options) }))

  return NextResponse.json({
    attempt: {
      ...attempt,
      answers,
    },
    questions: parsed,
  })
}
