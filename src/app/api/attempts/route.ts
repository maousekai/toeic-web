import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { estimateScore } from '@/lib/score'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { learnerId, testSetId, testSetTitle, type, durationSec, answers } = body as {
    learnerId: string
    testSetId?: string
    testSetTitle?: string
    type: string
    durationSec?: number
    answers: { questionId: string; selected: number | null }[]
  }

  if (!learnerId || !Array.isArray(answers)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Ensure learner exists
  await db.learner.upsert({ where: { id: learnerId }, update: {}, create: { id: learnerId } })

  const ids = answers.map((a) => a.questionId)
  const questions = await db.question.findMany({ where: { id: { in: ids } } })

  let correct = 0
  let listeningCorrect = 0
  let readingCorrect = 0
  let listeningTotal = 0
  let readingTotal = 0

  for (const a of answers) {
    const q = questions.find((qq) => qq.id === a.questionId)
    if (!q) continue
    if (q.part <= 4) listeningTotal++
    else readingTotal++
    if (a.selected === q.answer) {
      correct++
      if (q.part <= 4) listeningCorrect++
      else readingCorrect++
    }
  }

  const score = estimateScore(listeningCorrect, listeningTotal, readingCorrect, readingTotal)

  const attempt = await db.testAttempt.create({
    data: {
      learnerId,
      testSetId: testSetId || null,
      testSetTitle: testSetTitle || null,
      type,
      durationSec: durationSec || null,
      answers: JSON.stringify(answers),
      totalQuestions: answers.length,
      correctCount: correct,
      listeningCorrect: listeningTotal ? listeningCorrect : null,
      readingCorrect: readingTotal ? readingCorrect : null,
      score: score.total,
      listeningScore: listeningTotal ? score.listeningScore : null,
      readingScore: readingTotal ? score.readingScore : null,
      finishedAt: new Date(),
    },
  })

  return NextResponse.json({ attemptId: attempt.id, correct, total: answers.length, ...score })
}
