'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Check, Wallet, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'
import { BackButton } from '@/components/site/back-button'
import { cn } from '@/lib/utils'

const COLOR_STYLES: Record<string, string> = {
  emerald: 'border-emerald-500/50 bg-emerald-500/5',
  teal: 'border-teal-500/50 bg-teal-500/5',
  amber: 'border-amber-500/50 bg-amber-500/5',
}

export function VipView() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { toast } = useToast()
  const [packages, setPackages] = useState<any[]>([])
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const [pkgRes, statusRes] = await Promise.all([
      fetch('/api/vip/packages'),
      user ? fetch('/api/vip/status') : Promise.resolve(null),
    ])
    const pkg = await pkgRes.json()
    setPackages(pkg.packages || [])
    if (statusRes) {
      const st = await statusRes.json()
      setStatus(st)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const handlePurchase = async (pkgId: string, price: number) => {
    if (!user) { openAuth('register'); return }
    setPurchasing(pkgId)
    try {
      const res = await fetch('/api/vip/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkgId }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.needVip || data.error?.includes('Số dư')) {
          toast({
            title: 'Không đủ tiền',
            description: data.error || `Cần nạp thêm tiền vào ví`,
            variant: 'destructive',
          })
          setTimeout(() => navigate({ name: 'wallet' }), 1500)
        } else {
          toast({ title: 'Lỗi', description: data.error, variant: 'destructive' })
        }
      } else {
        toast({ title: '🎉 Kích hoạt VIP thành công!', description: data.message })
        fetchData()
      }
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' })
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-8"><p>Đang tải...</p></div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label="Trang chủ" />
      <div className="text-center">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Crown className="h-3.5 w-3.5 text-amber-500" /> VIP Membership
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mở khóa học 1-1 với giáo viên</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Nâng cấp VIP để chat trực tiếp, gọi video call 1-1 với giáo viên, và truy cập toàn bộ tính năng cao cấp.
        </p>
      </div>

      {/* VIP status */}
      {user && status && (
        <Card className={cn('mt-6', status.isVip ? 'border-amber-500/50 bg-amber-500/5' : '')}>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              {status.isVip ? (
                <>
                  <Crown className="h-10 w-10 text-amber-500" />
                  <div>
                    <p className="font-semibold">Đang là VIP: {status.package}</p>
                    <p className="text-sm text-muted-foreground">
                      Còn {status.daysLeft} ngày (đến {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString('vi-VN') : ''})
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Wallet className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Chưa có VIP</p>
                    <p className="text-sm text-muted-foreground">
                      Số dư ví: {status.balance?.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </>
              )}
            </div>
            {!status.isVip && (
              <Button variant="outline" onClick={() => navigate({ name: 'wallet' })}>
                Nạp tiền <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Packages */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const features = JSON.parse(pkg.features || '[]')
          const isPopular = pkg.popular
          return (
            <Card
              key={pkg.id}
              className={cn(
                'relative flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg',
                COLOR_STYLES[pkg.color] || 'border-border',
                isPopular && 'ring-2 ring-primary'
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1 bg-primary text-primary-foreground">
                    <Sparkles className="h-3 w-3" /> Phổ biến nhất
                  </Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{pkg.price.toLocaleString('vi-VN')}₫</span>
                  <span className="text-sm text-muted-foreground"> / {pkg.durationDays} ngày</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <ul className="space-y-2">
                  {features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                  disabled={purchasing === pkg.id}
                  onClick={() => handlePurchase(pkg.id, pkg.price)}
                >
                  {purchasing === pkg.id ? 'Đang xử lý...' : 'Mua gói này'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* CTA: what you get */}
      <Card className="mt-8 border-primary/20 bg-secondary/30">
        <CardContent className="grid gap-6 p-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold">Chat 24/7</h3>
            <p className="mt-1 text-sm text-muted-foreground">Nhắn tin trực tiếp với giáo viên bất cứ lúc nào</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold">Video Call 1-1</h3>
            <p className="mt-1 text-sm text-muted-foreground">Học trực tiếp với giáo viên qua video, giống MS Teams</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-semibold">Đầy đủ tính năng</h3>
            <p className="mt-1 text-sm text-muted-foreground">Truy cập toàn bộ đề thi, AI tools, flashcards</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
