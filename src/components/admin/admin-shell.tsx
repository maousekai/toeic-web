'use client'
import { useState, useEffect } from 'react'
import { useRouter, View } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useToast } from '@/hooks/use-toast'
import { GraduationCap, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function AdminShell({ children, activeTab, onTabChange }: { children: React.ReactNode; activeTab: string; onTabChange: (tab: string) => void }) {
  const { navigate } = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Học viên' },
    { id: 'teachers', label: 'Giáo viên' },
    { id: 'vip', label: 'Gói VIP' },
    { id: 'payments', label: 'Giao dịch' },
    { id: 'vocab', label: 'Từ vựng' },
    { id: 'grammar', label: 'Ngữ pháp' },
  ]
  return (
    <div className="flex min-h-screen bg-secondary/20">
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="h-5 w-5" /></div>
          <div className="flex flex-col leading-none"><span className="text-sm font-bold" suppressHydrationWarning>TOEIC Ace AI</span><span className="text-[10px] text-rose-500 font-semibold" suppressHydrationWarning>ADMIN PANEL</span></div>
        </div>
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2.5"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'A'}</div><div className="min-w-0"><p className="truncate text-sm font-medium" suppressHydrationWarning>{user?.name}</p><p className="truncate text-xs text-muted-foreground" suppressHydrationWarning>{user?.email}</p></div></div>
          <Badge className="mt-2 bg-rose-500/15 text-rose-600 text-[10px]">ADMIN</Badge>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {tabs.map(t => (
            <button key={t.id} onClick={() => { onTabChange(t.id); setSidebarOpen(false) }} className={cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors', activeTab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground')} suppressHydrationWarning>
              <span suppressHydrationWarning>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <button onClick={() => navigate({ name: 'home' })} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" suppressHydrationWarning><ExternalLink className="h-4 w-4" /><span suppressHydrationWarning>Xem trang web</span></button>
          <button onClick={async () => { await logout(); toast({ title: 'Đã đăng xuất' }); navigate({ name: 'home' }) }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-500/10" suppressHydrationWarning><LogOut className="h-4 w-4" /><span suppressHydrationWarning>Đăng xuất</span></button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg p-2 hover:bg-accent">{sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <span className="text-sm font-bold" suppressHydrationWarning>Admin Panel</span>
          <Badge className="ml-auto bg-rose-500/15 text-rose-600 text-[10px]">ADMIN</Badge>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
