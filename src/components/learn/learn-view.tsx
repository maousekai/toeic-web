'use client'

import { BookOpen, Brain, Lightbulb, Headphones, FileText, ArrowRight, GraduationCap, PenLine, Mic } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useRouter, type View } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { BackButton } from '@/components/site/back-button'
import { GrammarList } from './grammar-list'
import { GrammarDetail } from './grammar-detail'
import { VocabFlashcards } from './vocab-flashcards'
import { StrategiesView } from './strategies-view'
import Image from 'next/image'

export function LearnView() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()

  // Helper: yêu cầu login trước khi navigate
  const requireAuth = (targetView: View, featureName: string) => {
    if (!user) {
      openAuth('login', () => navigate(targetView))
      return
    }
    navigate(targetView)
  }

  // Single grammar lesson
  if (view.name === 'grammar' && view.slug) {
    return <GrammarDetail slug={view.slug} />
  }
  if (view.name === 'vocab') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <VocabFlashcards />
      </div>
    )
  }
  if (view.name === 'pronunciation') {
    return null // handled in page.tsx
  }

  const hubCards = [
    { icon: BookOpen, title: 'Grammar Lessons', desc: 'Clear explanations of the grammar points tested on the TOEIC, with examples and audio.', cta: 'Browse lessons', view: 'grammar' as const, needAuth: true, image: '/images/learn/grammar.jpg' },
    { icon: Brain, title: 'Vocabulary Flashcards', desc: 'Flip, listen and review high-frequency business English words with spaced repetition.', cta: 'Start flashcards', view: 'vocab' as const, needAuth: true, image: '/images/learn/vocab.jpg' },
    { icon: Mic, title: 'Luyện phát âm', desc: 'Nghe câu mẫu, ghi âm giọng nói, nhận feedback AI chi tiết về phát âm, trọng âm, ngữ điệu.', cta: 'Luyện ngay', view: 'pronunciation' as const, needAuth: true, image: '/images/learn/pronunciation.jpg' },
    { icon: Lightbulb, title: 'Test Strategies', desc: 'Section-by-section tactics for Listening and Reading — plus test-day tips.', cta: 'See strategies', view: 'strategies' as const, needAuth: false, image: '/images/learn/strategies.jpg' },
    { icon: PenLine, title: 'AI Writing Check', desc: 'Get your sentences corrected instantly by AI and learn from the feedback.', cta: 'Try AI tools', view: 'tools' as const, needAuth: true, image: '/images/ai/writing.jpg' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label="Trang chủ" />
      {/* Hub header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
        <p className="mt-2 text-muted-foreground">
          Build the skills behind a high TOEIC score — grammar, vocabulary and exam strategy.
        </p>
      </div>

      {/* Hub cards with images */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {hubCards.map((c) => (
          <Card key={c.title} className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => {
            if (c.needAuth) {
              requireAuth({ name: c.view } as View, c.title)
            } else {
              navigate({ name: c.view } as View)
            }
          }}>
            {/* Image header */}
            <div className="relative h-40 w-full overflow-hidden bg-secondary">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {/* Icon badge */}
              <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/95 shadow-md backdrop-blur">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              {/* Title overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <CardTitle className="text-base font-semibold text-white drop-shadow-md">{c.title}</CardTitle>
              </div>
            </div>
            <CardContent className="p-5">
              <CardDescription className="text-sm leading-relaxed">{c.desc}</CardDescription>
              <div className="mt-3 flex items-center text-xs font-medium text-primary">
                {c.cta} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Default tabs: Grammar + Strategies combined */}
      <Tabs defaultValue="grammar">
        <TabsList>
          <TabsTrigger value="grammar" className="gap-1.5"><BookOpen className="h-4 w-4" /> Grammar</TabsTrigger>
          <TabsTrigger value="strategies" className="gap-1.5"><Lightbulb className="h-4 w-4" /> Strategies</TabsTrigger>
        </TabsList>
        <TabsContent value="grammar" className="mt-6"><GrammarList /></TabsContent>
        <TabsContent value="strategies" className="mt-6"><StrategiesView /></TabsContent>
      </Tabs>

      {/* TOEIC overview band */}
      <Card className="mt-10 border-primary/20 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-primary" /> What is the TOEIC test?
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              The <strong>TOEIC</strong> (Test of English for International Communication) measures everyday English
              skills used in the workplace. The Listening &amp; Reading test lasts 2 hours and contains 200
              multiple-choice questions.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-teal-500" /> Listening: 100 questions · 45 min</li>
              <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-amber-500" /> Reading: 100 questions · 75 min</li>
              <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> Score range: 10 – 990</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Button onClick={() => navigate({ name: 'practice' })}>Take a practice test <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
            <Button variant="outline" onClick={() => navigate({ name: 'tutor' })}>Ask the AI tutor</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
