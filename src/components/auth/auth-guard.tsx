'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { Lock, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * AuthGuard — Bọc nội dung yêu cầu đăng nhập.
 * Sử dụng mounted pattern để tránh hydration mismatch.
 */
export function AuthGuard({ children, featureName }: { children: React.ReactNode; featureName: string }) {
  const { user, isLoading } = useAuth()
  const { openAuth } = useAuthUI()
  const [mounted, setMounted] = useState(false)

  // Chỉ render sau khi mounted trên client → tránh hydration mismatch
  useEffect(() => { setMounted(true) }, [])

  // Trước khi mount: render placeholder rỗng (nhất quán server & client)
  if (!mounted) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-primary/20">
            {/* Header gradient */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-teal-500/5 to-transparent p-8 text-center">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, var(--primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Lock className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Đăng nhập để sử dụng {featureName}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Tính năng này yêu cầu đăng nhập để lưu tiến trình học tập của bạn.
                  Tạo tài khoản miễn phí chỉ trong 1 phút!
                </p>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => openAuth('register')} className="gap-2">
                  <UserPlus className="h-4 w-4" /> Đăng ký miễn phí
                </Button>
                <Button size="lg" variant="outline" onClick={() => openAuth('login')} className="gap-2">
                  <LogIn className="h-4 w-4" /> Đã có tài khoản
                </Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-border/60 p-3">
                  <Sparkles className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-[10px] font-medium">Miễn phí</p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <Lock className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-[10px] font-medium">Lưu tiến trình</p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <Sparkles className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-[10px] font-medium">Không giới hạn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
