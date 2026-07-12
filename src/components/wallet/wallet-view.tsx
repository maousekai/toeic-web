'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet as WalletIcon, Plus, History, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { useToast } from '@/hooks/use-toast'
import { BackButton } from '@/components/site/back-button'

const AMOUNTS = [
  { value: 50000, label: '50,000₫' },
  { value: 100000, label: '100,000₫' },
  { value: 200000, label: '200,000₫' },
  { value: 500000, label: '500,000₫' },
  { value: 1000000, label: '1,000,000₫' },
  { value: 2000000, label: '2,000,000₫' },
]

export function WalletView() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { toast } = useToast()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const [topupLoading, setTopupLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!user) { setLoading(false); return }
    const [balRes, txRes] = await Promise.all([
      fetch('/api/wallet/balance'),
      fetch('/api/wallet/transactions'),
    ])
    const bal = await balRes.json()
    const tx = await txRes.json()
    setBalance(bal.balance || 0)
    setTransactions(tx.transactions || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const handleTopup = async () => {
    if (!user) { openAuth('login'); return }
    if (!selected) return
    setTopupLoading(true)
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selected, method: 'MoMo (demo)' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Nạp tiền thất bại', description: data.error, variant: 'destructive' })
      } else {
        toast({ title: '✅ Nạp tiền thành công', description: data.message })
        setBalance(data.balance)
        setSelected(null)
        fetchData()
      }
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' })
    } finally {
      setTopupLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <WalletIcon className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-bold">Đăng nhập để xem ví</h2>
        <Button className="mt-4" onClick={() => openAuth('login')}>Đăng nhập</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label="Trang chủ" />
      <h1 className="text-3xl font-bold tracking-tight">Ví của tôi</h1>

      {/* Balance card */}
      <Card className="mt-6 overflow-hidden border-0 bg-gradient-to-br from-primary to-teal-600 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-foreground/80">Số dư khả dụng</p>
              <p className="mt-1 text-4xl font-bold tabular-nums">{balance.toLocaleString('vi-VN')}₫</p>
            </div>
            <WalletIcon className="h-12 w-12 text-primary-foreground/60" />
          </div>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate({ name: 'vip' })}
          >
            Mua VIP <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Top-up section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plus className="h-5 w-5 text-primary" /> Nạp tiền
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Chọn số tiền muốn nạp (demo — không thanh toán thật):
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AMOUNTS.map((a) => (
              <button
                key={a.value}
                onClick={() => setSelected(a.value)}
                className={`rounded-xl border-2 p-4 text-center font-semibold transition-all ${
                  selected === a.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          {selected && (
            <Button className="mt-4 w-full" onClick={handleTopup} disabled={topupLoading}>
              {topupLoading ? 'Đang xử lý...' : `Nạp ${selected.toLocaleString('vi-VN')}₫`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" /> Lịch sử giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có giao dịch nào.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    {tx.type === 'TOPUP' ? (
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{tx.description || (tx.type === 'TOPUP' ? 'Nạp tiền' : 'Mua VIP')}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  <Badge variant={tx.type === 'TOPUP' ? 'default' : 'secondary'}>
                    {tx.type === 'TOPUP' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}₫
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
