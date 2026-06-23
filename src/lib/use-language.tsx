'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'vi' | 'en' | 'bi'

const STORAGE_KEY = 'toeic_ai_language'
const DEFAULT_LANGUAGE: Language = 'vi'

const LABELS: Record<Language, { short: string; long: string; flag: string }> = {
  vi: { short: 'VI', long: 'Tiếng Việt', flag: '🇻🇳' },
  en: { short: 'EN', long: 'English', flag: '🇬🇧' },
  bi: { short: 'VI+EN', long: 'Song ngữ', flag: '🌐' },
}

type LanguageCtx = {
  language: Language
  changeLanguage: (lang: Language) => void
  loaded: boolean
  labels: { short: string; long: string; flag: string }
  allLabels: typeof LABELS
}

const Ctx = createContext<LanguageCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored && ['vi', 'en', 'bi'].includes(stored)) {
        setLanguage(stored)
      }
    } catch {}
    setLoaded(true)

    // Sync across tabs / components
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLanguage(e.newValue as Language)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
  }

  return (
    <Ctx.Provider value={{ language, changeLanguage, loaded, labels: LABELS[language], allLabels: LABELS }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
