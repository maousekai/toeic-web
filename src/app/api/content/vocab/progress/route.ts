import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth-helpers'

const BOX_INTERVALS = [0, 1, 2, 5, 5, 5] // days per box level

export async function GET(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ masteredIds: [], knownCount: 0, totalProgress: 0 })

  const { searchParams } = new URL(req.url)
  const level = searchParams.get('level')

  // Get all progress for this user
  const allProgress = await db.vocabProgress.findMany({
    where: { userId: user.id },
    include: { vocab: { select: { level: true } } },
  })

  // IDs of vocabs whose dueAt is in the future (mastered & not yet due for review)
  const now = new Date()
  const masteredIds = allProgress
    .filter((p) => p.box > 0 && p.dueAt > now && (!level || p.vocab.level === level))
    .map((p) => p.vocabId)

  // Count known (box >= 1 for this level)
  const knownCount = allProgress.filter(
    (p) => p.box > 0 && (!level || p.vocab.level === level)
  ).length

  // Total progress entries for this level
  const totalProgress = allProgress.filter(
    (p) => !level || p.vocab.level === level
  ).length

  return NextResponse.json({ masteredIds, knownCount, totalProgress })
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
  }

  const body = await req.json()
  const { vocabId, known } = body

  if (!vocabId || typeof known !== 'boolean') {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  // Get existing progress or default
  const existing = await db.vocabProgress.findUnique({
    where: { userId_vocabId: { userId: user.id, vocabId } },
  })

  let box = existing?.box ?? 0
  if (known) {
    box = Math.min(box + 1, BOX_INTERVALS.length - 1)
  } else {
    box = 0 // Reset to 0 when not known
  }

  const intervalDays = BOX_INTERVALS[box]
  const dueAt = new Date(Date.now() + intervalDays * 86400000)

  const progress = await db.vocabProgress.upsert({
    where: { userId_vocabId: { userId: user.id, vocabId } },
    update: {
      box,
      dueAt,
      learnedAt: new Date(),
    },
    create: {
      userId: user.id,
      vocabId,
      box,
      dueAt,
      learnedAt: new Date(),
    },
  })

  return NextResponse.json({
    progress: {
      box: progress.box,
      dueAt: progress.dueAt,
      intervalDays,
    },
  })
}
