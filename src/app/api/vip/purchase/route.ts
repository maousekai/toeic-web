import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, ensureWallet, getActiveVip } from '@/lib/auth-helpers'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { packageId } = (await req.json()) as { packageId?: string }
  if (!packageId) return NextResponse.json({ error: 'packageId required' }, { status: 400 })

  const pkg = await db.vipPackage.findUnique({ where: { id: packageId } })
  if (!pkg) return NextResponse.json({ error: 'Gói VIP không tồn tại' }, { status: 404 })

  const wallet = await ensureWallet(user.id)
  if (!wallet) {
    return NextResponse.json({ error: 'Tài khoản không hợp lệ. Vui lòng đăng nhập lại.' }, { status: 403 })
  }
  if (wallet.balance < pkg.price) {
    return NextResponse.json({
      error: `Số dư không đủ. Cần ${pkg.price.toLocaleString('vi-VN')}₫, ví có ${wallet.balance.toLocaleString('vi-VN')}₫`,
    }, { status: 400 })
  }

  // Kiểm tra VIP hiện tại (nếu còn hạn, cộng thêm ngày)
  const currentVip = await getActiveVip(user.id)
  const baseDate = currentVip?.expiresAt && currentVip.expiresAt > new Date() ? currentVip.expiresAt : new Date()
  const expiresAt = new Date(baseDate)
  expiresAt.setDate(expiresAt.getDate() + pkg.durationDays)

  const [updatedWallet, _newSub, _tx, _userReset] = await db.$transaction([
    db.wallet.update({
      where: { userId: user.id },
      data: { balance: { decrement: pkg.price } },
    }),
    db.vipSubscription.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        startedAt: new Date(),
        expiresAt,
        isActive: true,
      },
    }),
    db.paymentTransaction.create({
      data: {
        userId: user.id,
        amount: pkg.price,
        type: 'VIP_PURCHASE',
        status: 'SUCCESS',
        description: `Mua ${pkg.name} (${pkg.durationDays} ngày)`,
      },
    }),
    // Reset AI message counter khi mua VIP
    db.user.update({
      where: { id: user.id },
      data: { aiMessageCount: 0 },
    }),
  ])

  return NextResponse.json({
    success: true,
    package: pkg.name,
    expiresAt,
    balance: updatedWallet.balance,
    message: `Đã kích hoạt ${pkg.name} đến ${expiresAt.toLocaleDateString('vi-VN')}`,
  })
}
