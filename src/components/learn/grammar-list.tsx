'use client'

import { useEffect, useState } from 'react'
import { BookOpen, ArrowRight, Tag, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { Skeleton } from '@/components/ui/skeleton'

type LessonSummary = {
  id: string
  title: string
  slug: string
  category: string
  level: string
  summary: string
  example: string
}

const CATEGORIES = ['tenses', 'conditionals', 'voice', 'articles', 'prepositions', 'verb-forms', 'clauses', 'adjectives', 'modals']

export function GrammarList() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()
  const [lessons, setLessons] = useState<LessonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/api/content/grammar')
      .then((r) => r.json())
      .then((d) => setLessons(d.lessons || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? lessons : lessons.filter((l) => l.category === filter)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Grammar Lessons</h2>
        <p className="text-sm text-muted-foreground">Master the grammar points that appear most often on the TOEIC test.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <Card
              key={l.id}
              className="group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md"
              onClick={() => {
                if (!user) {
                  openAuth('login', () => navigate({ name: 'grammar', slug: l.slug }))
                  return
                }
                navigate({ name: 'grammar', slug: l.slug })
              }}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="gap-1 text-[10px]"><Tag className="h-3 w-3" /> {l.category}</Badge>
                  <Badge variant="outline" className="gap-1 text-[10px]"><Clock className="h-3 w-3" /> {l.level}</Badge>
                </div>
                <CardTitle className="mt-2 flex items-center gap-2 text-base">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {l.title}
                </CardTitle>
                <CardDescription className="text-sm">{l.summary}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read lesson <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
