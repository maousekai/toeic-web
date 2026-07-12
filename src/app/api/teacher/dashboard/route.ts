import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'TEACHER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ giáo viên mới truy cập được' }, { status: 403 })
  }

  // Lấy teacher profile
  const teacher = await db.teacher.findUnique({
    where: { userId: session.id },
    include: { user: { select: { name: true, email: true, image: true } } },
  })

  if (!teacher) {
    return NextResponse.json({ error: 'Không tìm thấy profile giáo viên' }, { status: 404 })
  }

  // Stats song song
  const [chatRooms, classSessions, completedClasses, activeStudentsRows] = await Promise.all([
    db.chatRoom.count({ where: { teacherId: session.id } }),
    db.classSession.count({ where: { teacherId: session.id } }),
    db.classSession.count({ where: { teacherId: session.id, status: 'ENDED' } }),
    db.chatRoom.findMany({
      where: { teacherId: session.id },
      select: { studentId: true },
      distinct: ['studentId'],
    }),
  ])

  // Recent chat rooms
  const recentChats = await db.chatRoom.findMany({
    where: { teacherId: session.id },
    include: {
      student: { select: { id: true, name: true, email: true, image: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { content: true, createdAt: true } },
    },
    orderBy: { lastMessageAt: 'desc' },
    take: 5,
  })

  // Upcoming/active class sessions
  const upcomingClasses = await db.classSession.findMany({
    where: { teacherId: session.id, status: { in: ['WAITING', 'ACTIVE'] } },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return NextResponse.json({
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
      bio: teacher.bio,
      subjects: teacher.subjects,
      hourlyRate: teacher.hourlyRate,
      rating: teacher.rating,
      isOnline: teacher.isOnline,
      totalLessons: teacher.totalLessons,
    },
    stats: {
      totalChats: chatRooms,
      totalClasses: classSessions,
      completedClasses,
      activeStudents: activeStudentsRows.length,
    },
    recentChats: recentChats.map((r) => ({
      id: r.id,
      student: r.student,
      lastMessage: r.messages[0]?.content || null,
      lastMessageAt: r.lastMessageAt || r.createdAt,
    })),
    upcomingClasses: upcomingClasses.map((c) => ({
      id: c.id,
      roomCode: c.roomCode,
      status: c.status,
      student: c.student,
      createdAt: c.createdAt,
      startedAt: c.startedAt,
    })),
  })
}

// PUT: update own teacher profile
export async function PUT(req: NextRequest) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.role !== 'TEACHER' && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Chỉ giáo viên mới được sửa' }, { status: 403 })
  }

  const body = (await req.json()) as {
    bio?: string; subjects?: string; hourlyRate?: number; isOnline?: boolean
  }

  const teacher = await db.teacher.update({
    where: { userId: session.id },
    data: {
      ...(body.bio !== undefined && { bio: body.bio }),
      ...(body.subjects !== undefined && { subjects: body.subjects }),
      ...(body.hourlyRate !== undefined && { hourlyRate: body.hourlyRate }),
      ...(body.isOnline !== undefined && { isOnline: body.isOnline }),
    },
  })
  return NextResponse.json({ teacher })
}
