import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, ensureWallet } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

const ALLOWED_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000]

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount, method } = (await req.json()) as { amount?: number; method?: string }
  if (!amount || !ALLOWED_AMOUNTS.includes(amount)) {
    return NextResponse.json({ error: 'Số tiền không hợp lệ. Chọn: 50k, 100k, 200k, 500k, 1M, 2M' }, { status: 400 })
  }

  // Mock payment (demo) — trong production sẽ gọi VNPay/MoMo/ZaloPay ở đây
  await ensureWallet(user.id)
  const [updatedWallet, _tx] = await db.$transaction([
    db.wallet.update({
      where: { userId: user.id },
      data: { balance: { increment: amount } },
    }),
    db.paymentTransaction.create({
      data: {
        userId: user.id,
        amount,
        type: 'TOPUP',
        status: 'SUCCESS',
        description: `Nạp tiền qua ${method || 'mock'} (demo)`,
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    balance: updatedWallet.balance,
    message: `Đã nạp ${amount.toLocaleString('vi-VN')}₫ vào ví`,
  })
}

export async function GET() {
  return NextResponse.json({ amounts: ALLOWED_AMOUNTS })
}
