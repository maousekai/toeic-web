import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'TEACHER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ giáo viên' }, { status: 403 })
  }

  const teacher = await db.teacher.findUnique({ where: { userId: session.id } })
  if (!teacher) return NextResponse.json({ error: 'Không tìm thấy profile' }, { status: 404 })

  // Lấy tất cả lớp đã hoàn thành (ENDED)
  const completedClasses = await db.classSession.findMany({
    where: { teacherId: session.id, status: 'ENDED' },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { endedAt: 'desc' },
    take: 50,
  })

  // Tính doanh thu ước tính: số giờ dạy × hourlyRate
  // Mỗi class session ~ 1 giờ
  const estimatedEarnings = completedClasses.length * teacher.hourlyRate

  // Thống kê theo tháng (3 tháng gần nhất)
  const now = new Date()
  const monthlyStats = []
  for (let i = 0; i < 3; i++) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const count = await db.classSession.count({
      where: {
        teacherId: session.id,
        status: 'ENDED',
        endedAt: { gte: monthStart, lt: monthEnd },
      },
    })
    monthlyStats.push({
      month: monthStart.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      classes: count,
      earnings: count * teacher.hourlyRate,
    })
  }

  return NextResponse.json({
    hourlyRate: teacher.hourlyRate,
    totalClasses: completedClasses.length,
    estimatedEarnings,
    monthlyStats,
    recentClasses: completedClasses.slice(0, 10).map((c) => ({
      id: c.id,
      student: c.student,
      startedAt: c.startedAt,
      endedAt: c.endedAt,
      duration: c.startedAt && c.endedAt
        ? Math.round((c.endedAt.getTime() - c.startedAt.getTime()) / 60000)
        : null,
    })),
  })
}
