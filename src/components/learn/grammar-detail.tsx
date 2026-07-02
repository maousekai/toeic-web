'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Volume2, Clock, Tag, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { Markdown } from '@/components/site/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { GrammarExercise } from './grammar-exercise'

type Lesson = {
  id: string
  title: string
  slug: string
  category: string
  level: string
  summary: string
  content: string
  example: string
}

export function GrammarDetail({ slug }: { slug: string }) {
  const { navigate } = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/content/grammar/${slug}`)
      .then((r) => r.json())
      .then((d) => setLesson(d.lesson || null))
      .finally(() => setLoading(false))
  }, [slug])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p>Lesson not found.</p>
          <Button onClick={() => navigate({ name: 'grammar' })}>Back to Grammar</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'grammar' })} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Tất cả bài ngữ pháp
      </Button>

      {/* Header card với gradient nhẹ */}
      <Card className="overflow-hidden border-primary/20">
        <div className="bg-gradient-to-br from-primary/8 via-teal-500/5 to-transparent p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1"><Tag className="h-3 w-3" /> {lesson.category}</Badge>
            <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {lesson.level}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{lesson.summary}</p>
        </div>
      </Card>

      {/* Content chính — max-width cho dễ đọc */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="max-w-3xl mx-auto">
            <Markdown content={lesson.content} />
          </div>
        </CardContent>
      </Card>

      {/* Example callout */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" /> Ví dụ minh họa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <p className="flex-1 text-base italic leading-relaxed">{lesson.example}</p>
            <Button variant="ghost" size="icon" onClick={() => speak(lesson.example)} aria-label="Listen">
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Section — 20 câu bài tập */}
      <div className="mt-8 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <PenLine className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Bài tập thực hành</h2>
            <p className="text-xs text-muted-foreground">20 câu trắc nghiệm — làm để kiểm tra hiểu bài</p>
          </div>
        </div>
        <GrammarExercise slug={slug} />
      </div>
    </div>
  )
}
