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

// POST: create new user (as STUDENT) and teacher profile, or attach to existing
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { name, email, password, bio, subjects, hourlyRate } = await req.json()
  
  if (!email || !name) return NextResponse.json({ error: 'Name and email required' }, { status: 400 })

  let user = await db.user.findUnique({ where: { email } })
  if (user) {
    const existing = await db.teacher.findUnique({ where: { userId: user.id } })
    if (existing) return NextResponse.json({ error: 'User đã là giáo viên' }, { status: 400 })
    
    // Attach teacher profile without changing role
    const teacher = await db.teacher.create({
      data: {
        userId: user.id,
        bio: bio || '',
        subjects: subjects || 'TOEIC Listening, TOEIC Reading, Grammar',
        hourlyRate: Number(hourlyRate) || 100000,
      },
    })
    return NextResponse.json({ teacher })
  }

  if (!password) return NextResponse.json({ error: 'Password required for new user' }, { status: 400 })
  
  // Use bcryptjs, assuming it's available. We can use dynamic import or standard import.
  const bcrypt = require('bcryptjs')
  const passwordHash = await bcrypt.hash(password, 10)

  // Create new user (STUDENT) and nested teacher profile
  const newUser = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'STUDENT',
      teacher: {
        create: {
          bio: bio || '',
          subjects: subjects || 'TOEIC Listening, TOEIC Reading, Grammar',
          hourlyRate: Number(hourlyRate) || 100000,
        }
      }
    },
    include: { teacher: true }
  })
  
  return NextResponse.json({ teacher: newUser.teacher })
}
