'use client'

import { GraduationCap, Github, Mail, Heart } from 'lucide-react'
import { useRouter, View } from '@/lib/router'

const LINKS: { label: string; view: View }[] = [
  { label: 'Learn', view: { name: 'learn' } },
  { label: 'Grammar', view: { name: 'grammar' } },
  { label: 'Vocabulary', view: { name: 'vocab' } },
  { label: 'Practice Tests', view: { name: 'practice' } },
  { label: 'AI Tutor', view: { name: 'tutor' } },
  { label: 'AI Tools', view: { name: 'tools' } },
  { label: 'Dashboard', view: { name: 'dashboard' } },
]

export function Footer() {
  const { navigate } = useRouter()
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-base font-bold" suppressHydrationWarning>TOEIC Ace AI</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A complete TOEIC Listening &amp; Reading preparation platform with AI-powered tutoring,
              practice tests, instant grading and personalized study plans.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="#" className="rounded-lg p-2 hover:bg-accent hover:text-foreground transition-colors" aria-label="GitHub"><Github className="h-4 w-4" /></a>
              <a href="#" className="rounded-lg p-2 hover:bg-accent hover:text-foreground transition-colors" aria-label="Email"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.view)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">About the TOEIC</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Listening &amp; Reading test</li>
              <li>200 questions · 2 hours</li>
              <li>Score range: 10 – 990</li>
              <li>Recognized worldwide</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p suppressHydrationWarning>© {new Date().getFullYear()} TOEIC Ace AI. For practice &amp; educational use only.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> for English learners
          </p>
        </div>
      </div>
    </footer>
  )
}
