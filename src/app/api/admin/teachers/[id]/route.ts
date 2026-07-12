import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

// PUT: update teacher profile
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const body = (await req.json()) as {
    bio?: string; subjects?: string; hourlyRate?: number; rating?: number; isOnline?: boolean
  }
  const teacher = await db.teacher.update({
    where: { id },
    data: {
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.subjects !== undefined && { subjects: body.subjects }),
      ...(body.hourlyRate !== undefined && { hourlyRate: body.hourlyRate }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.isOnline !== undefined && { isOnline: body.isOnline }),
    },
  })
  return NextResponse.json({ teacher })
}

// DELETE: remove teacher profile (demote user to STUDENT)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const teacher = await db.teacher.findUnique({ where: { id }, select: { userId: true } })
  if (!teacher) return NextResponse.json({ error: 'Không tìm thấy giáo viên' }, { status: 404 })

  await db.$transaction([
    db.teacher.delete({ where: { id } }),
    db.user.update({ where: { id: teacher.userId }, data: { role: 'STUDENT' } }),
  ])
  return NextResponse.json({ success: true })
}
