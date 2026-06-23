import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = (await req.json()) as {
      name?: string
      email?: string
      password?: string
    }

    // ----- Validation -----
    const cleanName = (name || '').trim()
    const cleanEmail = (email || '').toLowerCase().trim()
    const pwd = password || ''

    if (cleanName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 })
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (pwd.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // ----- Duplicate check -----
    const existing = await db.user.findUnique({ where: { email: cleanEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // ----- Hash + create -----
    const passwordHash = await bcrypt.hash(pwd, 10)
    const user = await db.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
      },
    })

    // Also create (or link) a Learner row for this user
    await db.learner.upsert({
      where: { id: `learner_${user.id}` },
      update: { userId: user.id, name: user.name },
      create: { id: `learner_${user.id}`, userId: user.id, name: user.name },
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (e: any) {
    console.error('Register error:', e)
    return NextResponse.json({ error: e?.message || 'Registration failed.' }, { status: 500 })
  }
}
