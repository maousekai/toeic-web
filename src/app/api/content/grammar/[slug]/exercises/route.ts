import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = await db.grammarLesson.findUnique({ where: { slug } })
  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const exercises = await db.grammarExercise.findMany({
    where: { lessonId: lesson.id },
    orderBy: { order: 'asc' },
  })

  const parsed = exercises.map((e) => ({ ...e, options: JSON.parse(e.options) }))
  return NextResponse.json({ exercises: parsed, lessonId: lesson.id })
}
