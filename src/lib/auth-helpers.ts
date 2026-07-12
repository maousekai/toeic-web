import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { db } from '@/lib/db'

export async function getSessionUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  return {
    id: (session.user as any).id,
    email: (session.user as any).email,
    name: (session.user as any).name,
    role: (session.user as any).role || 'STUDENT',
  }
}

/**
 * Kiểm tra user có subscription VIP còn hiệu lực không.
 */
export async function hasActiveVip(userId: string): Promise<boolean> {
  const sub = await db.vipSubscription.findFirst({
    where: {
      userId,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    orderBy: { expiresAt: 'desc' },
  })
  return !!sub
}

/**
 * Lấy thông tin VIP active (hoặc null).
 */
export async function getActiveVip(userId: string) {
  return db.vipSubscription.findFirst({
    where: {
      userId,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    include: { package: true },
    orderBy: { expiresAt: 'desc' },
  })
}

/**
 * Đảm bảo user có wallet, tạo nếu chưa có.
 * Trả về null nếu user không tồn tại (tránh foreign key error).
 */
export async function ensureWallet(userId: string) {
  // Kiểm tra user tồn tại trước
  const userExists = await db.user.findUnique({ where: { id: userId }, select: { id: true } })
  if (!userExists) return null
  return db.wallet.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 0 },
  })
}
