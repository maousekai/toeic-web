'use client'

import { useEffect, useState } from 'react'
import { Lightbulb, Headphones, FileText, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/site/markdown'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Strategy = { id: string; title: string; slug: string; section: string; content: string }

const SECTION_ICONS: Record<string, any> = {
  listening: Headphones,
  reading: FileText,
  'test-day': CalendarDays,
  general: Lightbulb,
}

export function StrategiesView() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content/strategies')
      .then((r) => r.json())
      .then((d) => setStrategies(d.strategies || []))
      .finally(() => setLoading(false))
  }, [])

  const bySection = (s: string) => strategies.filter((st) => st.section === s)

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
  }

  const sections = ['listening', 'reading', 'test-day', 'general'].filter((s) => bySection(s).length > 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Test Strategies &amp; Tips</h2>
        <p className="text-sm text-muted-foreground">Proven techniques to maximize your score on every part of the TOEIC.</p>
      </div>

      <Tabs defaultValue={sections[0]}>
        <TabsList className="flex flex-wrap h-auto">
          {sections.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">{s.replace('-', ' ')}</TabsTrigger>
          ))}
        </TabsList>
        {sections.map((s) => (
          <TabsContent key={s} value={s} className="space-y-4 mt-4">
            {bySection(s).map((st) => {
              const Icon = SECTION_ICONS[st.section] || Lightbulb
              return (
                <Card key={st.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      {st.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Markdown content={st.content} />
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
