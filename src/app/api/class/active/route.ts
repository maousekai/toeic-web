import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

// GET: list active class sessions for current user (teacher or student)
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await db.classSession.findMany({
    where: {
      OR: [{ teacherId: user.id }, { studentId: user.id }],
      status: { in: ['WAITING', 'ACTIVE'] },
    },
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      student: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({ sessions })
}
