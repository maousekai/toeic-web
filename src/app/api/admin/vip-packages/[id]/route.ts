import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

async function checkAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'ADMIN') return null
  return user
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  const body = (await req.json()) as {
    name?: string; price?: number; durationDays?: number; features?: string; color?: string; popular?: boolean
  }
  const pkg = await db.vipPackage.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.durationDays !== undefined && { durationDays: body.durationDays }),
      ...(body.features !== undefined && { features: body.features }),
      ...(body.color !== undefined && { color: body.color }),
      ...(body.popular !== undefined && { popular: body.popular }),
    },
  })
  return NextResponse.json({ package: pkg })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const { id } = await params
  await db.vipPackage.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
