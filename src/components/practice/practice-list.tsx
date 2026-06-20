'use client'

import { useEffect, useState } from 'react'
import { Clock, FileText, Headphones, Layers, Play, ArrowRight, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { Skeleton } from '@/components/ui/skeleton'

type TestSet = {
  id: string
  title: string
  description: string
  durationMin: number
  type: string
  questionCount: number
}

const TYPE_META: Record<string, { icon: any; color: string; label: string }> = {
  full: { icon: Trophy, color: 'bg-primary/10 text-primary', label: 'Full Mock' },
  listening: { icon: Headphones, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', label: 'Listening' },
  part5: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 5' },
  part6: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 6' },
  part7: { icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Part 7' },
  mini: { icon: Layers, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', label: 'Mini' },
}

export function PracticeList() {
  const { navigate } = useRouter()
  const [tests, setTests] = useState<TestSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tests')
      .then((r) => r.json())
      .then((d) => setTests(d.testSets || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Practice Tests</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a test set, take it under exam conditions, and get an instant estimated score with full answer review.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((t) => {
            const meta = TYPE_META[t.type] || TYPE_META.mini
            return (
              <Card key={t.id} className="group flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${meta.color}`}>
                      <meta.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{meta.label}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{t.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> {t.questionCount} Q</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.durationMin} min</span>
                  </div>
                  <Button size="sm" onClick={() => navigate({ name: 'test', testSetId: t.id })}>
                    <Play className="mr-1 h-3.5 w-3.5" /> Start
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="mt-8 border-dashed bg-secondary/20">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowRight className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Want unlimited fresh questions?</h3>
            <p className="text-sm text-muted-foreground">Use the AI Question Generator to create custom practice on any topic.</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ name: 'tools' })}>Open AI Tools</Button>
        </CardContent>
      </Card>
    </div>
  )
}
