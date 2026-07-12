import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const teachers = await db.teacher.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { rating: 'desc' },
  })
  return NextResponse.json({
    teachers: teachers.map((t) => ({
      id: t.id,
      userId: t.userId,
      name: t.user.name,
      email: t.user.email,
      image: t.user.image,
      bio: t.bio,
      subjects: t.subjects,
      hourlyRate: t.hourlyRate,
      rating: t.rating,
      totalLessons: t.totalLessons,
      isOnline: t.isOnline,
    })),
  })
}
