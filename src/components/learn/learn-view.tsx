'use client'

import { BookOpen, Brain, Lightbulb, Headphones, FileText, ArrowRight, GraduationCap, PenLine, Mic } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useRouter, type View } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { BackButton } from '@/components/site/back-button'
import { useLanguage } from '@/lib/use-language'
import { GrammarList } from './grammar-list'
import { GrammarDetail } from './grammar-detail'
import { VocabFlashcards } from './vocab-flashcards'
import { StrategiesView } from './strategies-view'
import Image from 'next/image'

export function LearnView() {
  const { view, navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const { t } = useLanguage()

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
    { icon: BookOpen, title: 'learn.hub.grammar.title', desc: 'learn.hub.grammar.desc', cta: 'learn.hub.grammar.cta', view: 'grammar' as const, needAuth: true, image: '/images/learn/grammarnew.jpg' },
    { icon: Brain, title: 'learn.hub.vocab.title', desc: 'learn.hub.vocab.desc', cta: 'learn.hub.vocab.cta', view: 'vocab' as const, needAuth: true, image: '/images/learn/vocab.jpg' },
    { icon: Mic, title: 'learn.hub.pronun.title', desc: 'learn.hub.pronun.desc', cta: 'learn.hub.pronun.cta', view: 'pronunciation' as const, needAuth: true, image: '/images/learn/pronunciationnew.jpg' },
    { icon: Lightbulb, title: 'learn.hub.strat.title', desc: 'learn.hub.strat.desc', cta: 'learn.hub.strat.cta', view: 'strategies' as const, needAuth: false, image: '/images/learn/strategies.jpg' },
    { icon: PenLine, title: 'learn.hub.writing.title', desc: 'learn.hub.writing.desc', cta: 'learn.hub.writing.cta', view: 'tools' as const, needAuth: true, image: '/images/ai/writing.jpg' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BackButton targetView={{ name: 'home' }} label={t('learn.back_home')} />
      {/* Hub header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('learn.header.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('learn.header.desc')}
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
            if (c.view === 'grammar' || c.view === 'strategies') {
              setTimeout(() => {
                document.getElementById('learning-content')?.scrollIntoView({ behavior: 'smooth' })
              }, 50)
            }
          }}>
            {/* PHẦN 1: Khung ảnh - Sáng sủa, sạch sẽ, không dùng lớp phủ đen nữa */}
            <div className="relative aspect-video w-full overflow-hidden bg-secondary/10">
              <Image
                src={c.image}
                alt={c.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />

              {/* Icon badge giữ nguyên ở góc trên */}
              <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-background/95 shadow-md backdrop-blur">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* PHẦN 2: Nội dung bên dưới - Tự động đổi màu chữ theo giao diện Sáng/Tối */}
            <CardContent className="p-5">
              {/* Đưa tiêu đề xuống đây, thêm hiệu ứng đổi màu khi hover vào card */}
              <CardTitle className="text-base font-bold text-foreground mb-2 transition-colors group-hover:text-primary">
                {t(c.title)}
              </CardTitle>

              <CardDescription className="text-sm leading-relaxed">{t(c.desc)}</CardDescription>

              <div className="mt-4 flex items-center text-sm font-medium text-primary">
                {t(c.cta)} <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Default tabs: Grammar + Strategies combined */}
      <div id="learning-content" className="scroll-mt-6">
        <Tabs value={['grammar', 'strategies'].includes(view.name) ? view.name : 'grammar'} onValueChange={(val) => navigate({ name: val as View['name'] })}>
          <TabsList>
            <TabsTrigger value="grammar" className="gap-1.5"><BookOpen className="h-4 w-4" /> {t('learn.tabs.grammar')}</TabsTrigger>
            <TabsTrigger value="strategies" className="gap-1.5"><Lightbulb className="h-4 w-4" /> {t('learn.tabs.strategies')}</TabsTrigger>
          </TabsList>
          <TabsContent value="grammar" className="mt-6"><GrammarList /></TabsContent>
          <TabsContent value="strategies" className="mt-6"><StrategiesView /></TabsContent>
        </Tabs>
      </div>

      {/* TOEIC overview band */}
      <Card className="mt-10 border-primary/20 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-primary" /> {t('learn.overview.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              {t('learn.overview.desc')}
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-teal-500" /> {t('learn.overview.listening')}</li>
              <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-amber-500" /> {t('learn.overview.reading')}</li>
              <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {t('learn.overview.score')}</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <Button onClick={() => navigate({ name: 'practice' })}>{t('learn.overview.btn_test')} <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
            <Button variant="outline" onClick={() => navigate({ name: 'tutor' })}>{t('learn.overview.btn_ai')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
