'use client'

import { useState } from 'react'
import { Menu, X, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, View } from '@/lib/router'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'

const NAV: { label: string; view: View }[] = [
  { label: 'Home', view: { name: 'home' } },
  { label: 'Learn', view: { name: 'learn' } },
  { label: 'Practice', view: { name: 'practice' } },
  { label: 'AI Tutor', view: { name: 'tutor' } },
  { label: 'AI Tools', view: { name: 'tools' } },
  { label: 'Dashboard', view: { name: 'dashboard' } },
]

export function Navbar() {
  const { view, navigate } = useRouter()
  const [open, setOpen] = useState(false)

  const isActive = (v: View) => v.name === view.name

  const go = (v: View) => {
    navigate(v)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go({ name: 'home' })} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">TOEIC Ace AI</span>
            <span className="text-[10px] text-muted-foreground">Smart English Test Prep</span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item.label}
              onClick={() => go(item.view)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(item.view)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => go({ name: 'practice' })}
            className="hidden sm:inline-flex"
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            Start Practice
          </Button>
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
            {NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.view)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors',
                  isActive(item.view)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
