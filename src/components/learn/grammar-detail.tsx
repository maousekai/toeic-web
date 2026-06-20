'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, BookOpen, Volume2, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { Markdown } from '@/components/site/markdown'
import { Skeleton } from '@/components/ui/skeleton'

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
        <ArrowLeft className="h-4 w-4" /> All grammar lessons
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1"><Tag className="h-3 w-3" /> {lesson.category}</Badge>
            <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {lesson.level}</Badge>
          </div>
          <CardTitle className="mt-2 text-2xl">{lesson.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{lesson.summary}</p>
        </CardHeader>
        <CardContent>
          <Markdown content={lesson.content} />
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" /> Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <p className="flex-1 text-base italic">{lesson.example}</p>
            <Button variant="ghost" size="icon" onClick={() => speak(lesson.example)} aria-label="Listen">
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
