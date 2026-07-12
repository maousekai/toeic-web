import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const packages = await db.vipPackage.findMany({ orderBy: { price: 'asc' } })
  return NextResponse.json({ packages })
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const body = (await req.json()) as {
    name: string; price: number; durationDays: number; features?: string; color?: string; popular?: boolean
  }
  if (!body.name || !body.price || !body.durationDays) {
    return NextResponse.json({ error: 'name, price, durationDays required' }, { status: 400 })
  }
  const pkg = await db.vipPackage.create({
    data: {
      name: body.name,
      price: body.price,
      durationDays: body.durationDays,
      features: body.features || '[]',
      color: body.color || 'emerald',
      popular: body.popular || false,
    },
  })
  return NextResponse.json({ package: pkg })
}
