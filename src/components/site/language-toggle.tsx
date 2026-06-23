'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage, type Language } from '@/lib/use-language'
import { cn } from '@/lib/utils'

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, changeLanguage, loaded, labels, allLabels } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (!loaded) {
    return <div className="h-9 w-9 rounded-md bg-secondary animate-pulse" />
  }

  const options: Language[] = ['vi', 'bi', 'en']

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen((o) => !o)}
        className={cn('gap-1.5', compact && 'px-2')}
        aria-label="AI language"
        title={`AI trả lời bằng: ${labels.long}`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs font-semibold">{labels.flag} {labels.short}</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-lg">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Ngôn ngữ AI trả lời
          </div>
          {options.map((lang) => {
            const l = allLabels[lang]
            const active = lang === language
            return (
              <button
                key={lang}
                onClick={() => {
                  changeLanguage(lang)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                )}
              >
                <span className="text-base">{l.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">{l.long}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {lang === 'vi' && 'Giải thích thuần Việt, dễ hiểu'}
                    {lang === 'bi' && 'Việt + thuật ngữ Anh trong ngoặc'}
                    {lang === 'en' && 'Toàn bộ tiếng Anh (immersion)'}
                  </div>
                </div>
                {active && <Check className="h-4 w-4" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
