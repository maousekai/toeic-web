'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, View } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { ThemeToggle } from './theme-toggle'
import { LanguageToggle } from './language-toggle'
import { UserMenu } from '@/components/auth/user-menu'
import { cn } from '@/lib/utils'

const NAV: { label: string; view: View }[] = [
  { label: 'Home', view: { name: 'home' } },
  { label: 'Learn', view: { name: 'learn' } },
  { label: 'Practice', view: { name: 'practice' } },
  { label: 'Teachers', view: { name: 'teachers' } },
  { label: 'AI Tutor', view: { name: 'tutor' } },
  { label: 'Dashboard', view: { name: 'dashboard' } },
]

export function Navbar() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const isActive = (v: View) => v.name === view.name

  const go = (v: View) => {
    navigate(v)
    setOpen(false)
  }

  // Build nav list — add Admin if user is admin (chỉ sau khi mounted)
  const navItems = [...NAV]
  if (mounted && user?.role === 'ADMIN') {
    navItems.push({ label: 'Admin', view: { name: 'admin' } as View })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
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
          {mounted && user && (
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 hover:text-amber-600 sm:inline-flex"
              onClick={() => navigate({ name: 'wallet' })}
            >
              <Crown className="h-3.5 w-3.5" /> Ví
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
