import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

// GET: list all teachers with detail
export async function GET(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const teachers = await db.teacher.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true, locked: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ teachers })
}

// POST: create teacher profile for existing user (promote user to TEACHER + create Teacher row)
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { userId, bio, subjects, hourlyRate } = (await req.json()) as {
    userId?: string; bio?: string; subjects?: string; hourlyRate?: number
  }
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const existing = await db.teacher.findUnique({ where: { userId } })
  if (existing) return NextResponse.json({ error: 'User đã là giáo viên' }, { status: 400 })

  // Promote user role + create teacher profile
  const [_, teacher] = await db.$transaction([
    db.user.update({ where: { id: userId }, data: { role: 'TEACHER' } }),
    db.teacher.create({
      data: {
        userId,
        bio: bio || '',
        subjects: subjects || 'TOEIC Listening, TOEIC Reading, Grammar',
        hourlyRate: hourlyRate || 100000,
      },
    }),
  ])
  return NextResponse.json({ teacher })
}
