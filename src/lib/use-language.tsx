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

// UI translation dictionary
const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { vi: 'Trang chủ', en: 'Home', bi: 'Home' },
  'nav.learn': { vi: 'Học', en: 'Learn', bi: 'Learn' },
  'nav.practice': { vi: 'Luyện thi', en: 'Practice', bi: 'Practice' },
  'nav.teachers': { vi: 'Giáo viên', en: 'Teachers', bi: 'Teachers' },
  'nav.ai_tutor': { vi: 'AI Trợ giảng', en: 'AI Tutor', bi: 'AI Tutor' },
  'nav.classroom': { vi: 'Phòng học', en: 'Classroom', bi: 'Classroom' },
  'nav.dashboard': { vi: 'Tổng quan', en: 'Dashboard', bi: 'Dashboard' },
  'nav.my_class': { vi: 'Lớp của tôi', en: 'My Classes', bi: 'My Classes' },
  'nav.admin': { vi: 'Quản trị', en: 'Admin', bi: 'Admin' },
  // User menu
  'menu.dashboard': { vi: 'Tổng quan', en: 'Dashboard', bi: 'Dashboard' },
  'menu.my_class': { vi: 'Lớp của tôi', en: 'My Classes', bi: 'My Classes' },
  'menu.teachers': { vi: 'Giáo viên', en: 'Teachers', bi: 'Teachers' },
  'menu.ai_tutor': { vi: 'AI Trợ giảng', en: 'AI Tutor', bi: 'AI Tutor' },
  'menu.wallet': { vi: 'Ví của tôi', en: 'My Wallet', bi: 'My Wallet' },
  'menu.vip': { vi: 'Gói VIP', en: 'VIP Membership', bi: 'VIP Membership' },
  'menu.admin': { vi: 'Quản trị', en: 'Admin Panel', bi: 'Admin Panel' },
  'menu.sign_out': { vi: 'Đăng xuất', en: 'Sign Out', bi: 'Sign Out' },
  'menu.sign_in': { vi: 'Đăng nhập', en: 'Sign In', bi: 'Sign In' },
  'menu.get_started': { vi: 'Bắt đầu', en: 'Get Started', bi: 'Get Started' },
  // Wallet button
  'btn.wallet': { vi: 'Ví', en: 'Wallet', bi: 'Wallet' },
  // Language toggle
  'lang.title': { vi: 'Ngôn ngữ AI trả lời', en: 'AI Response Language', bi: 'AI Response Language' },
  'lang.vi_desc': { vi: 'Giải thích thuần Việt, dễ hiểu', en: 'Full Vietnamese explanations', bi: 'Full Vietnamese explanations' },
  'lang.bi_desc': { vi: 'Việt + thuật ngữ Anh trong ngoặc', en: 'Vietnamese + English terms', bi: 'Vietnamese + English terms' },
  'lang.en_desc': { vi: 'Toàn bộ tiếng Anh (immersion)', en: 'Full English (immersion)', bi: 'Full English (immersion)' },
}

type LanguageCtx = {
  language: Language
  changeLanguage: (lang: Language) => void
  loaded: boolean
  labels: { short: string; long: string; flag: string }
  allLabels: typeof LABELS
  t: (key: string) => string
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
    <Ctx.Provider value={{
      language, changeLanguage, loaded,
      labels: LABELS[language], allLabels: LABELS,
      t: (key: string) => UI_TRANSLATIONS[key]?.[language] ?? key,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
