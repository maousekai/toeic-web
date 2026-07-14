'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, View } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'
import { UserMenu } from '@/components/auth/user-menu'
import { useLanguage } from '@/lib/use-language'
import { cn } from '@/lib/utils'

// Nav items use translation keys instead of hardcoded labels
const NAV_KEYS: { key: string; view: View }[] = [
  { key: 'nav.home', view: { name: 'home' } },
  { key: 'nav.learn', view: { name: 'learn' } },
  { key: 'nav.practice', view: { name: 'practice' } },
  { key: 'nav.teachers', view: { name: 'teachers' } },
  { key: 'nav.ai_tutor', view: { name: 'tutor' } },
  { key: 'nav.classroom', view: { name: 'class' } },
  { key: 'nav.dashboard', view: { name: 'dashboard' } },
]

// Dynamic nav for teachers
function getNavKeys(user: any): { key: string; view: View }[] {
  if (user?.role === 'TEACHER') {
    return [
      { key: 'nav.home', view: { name: 'home' } as View },
      { key: 'nav.classroom', view: { name: 'class' } as View },
      { key: 'nav.my_class', view: { name: 'teacher-dashboard' } as View },
    ]
  }
  return NAV_KEYS
}

export function Navbar() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isActive = (v: View) => v.name === view.name

  const go = (v: View) => {
    navigate(v)
    setOpen(false)
  }

  // Build nav list — teacher sees "Lớp của tôi", admin sees "Admin"
  const navItems = [...getNavKeys(user)].map(n => ({ label: t(n.key), view: n.view }))
  if (mounted && user?.role === 'ADMIN') {
    navItems.push({ label: t('nav.admin'), view: { name: 'admin' } as View })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2.5 group">
          <img src="/logo.svg" className="h-9 w-9 transition-transform group-hover:scale-105" alt="Logo" />
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight" suppressHydrationWarning>TOEIC Ace AI</span>
            <span className="text-[10px] text-muted-foreground" suppressHydrationWarning>Smart English Test Prep</span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.view)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.view)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              suppressHydrationWarning
            >
              <span suppressHydrationWarning>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          {mounted && user && user.role !== 'TEACHER' && (
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 hover:text-amber-600 sm:inline-flex"
              onClick={() => navigate({ name: 'wallet' })}
            >
              <Crown className="h-3.5 w-3.5" /> {t('btn.wallet')}
            </Button>
          )}
          <div className="hidden sm:block">
            <UserMenu />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.view)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  isActive(item.view)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                )}
                suppressHydrationWarning
              >
                <span suppressHydrationWarning>{item.label}</span>
              </button>
            ))}
            <div className="mt-2 border-t border-border/60 pt-3">
              <UserMenu />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
