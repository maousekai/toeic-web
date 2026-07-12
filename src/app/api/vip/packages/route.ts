import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const packages = await db.vipPackage.findMany({ orderBy: { price: 'asc' } })
  return NextResponse.json({ packages })
}
