'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Trophy, Clock, CheckCircle2, XCircle, Volume2, Sparkles, ArrowLeft,
  Headphones, FileText, RotateCcw, ChevronDown, Brain, Target,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { scoreBand } from '@/lib/score'
import { Skeleton } from '@/components/ui/skeleton'
import { Markdown } from '@/components/site/markdown'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible'

type Attempt = {
  id: string
  testSetTitle: string | null
  type: string
  durationSec: number | null
  totalQuestions: number
  correctCount: number
  listeningCorrect: number | null
  readingCorrect: number | null
  score: number | null
  listeningScore: number | null
  readingScore: number | null
  answers: { questionId: string; selected: number | null }[]
}

type Question = {
  id: string
  part: number
  passage: string | null
  audioScript: string | null
  question: string
  options: string[]
  answer: number
  explanation: string | null
}

const PART_LABEL: Record<number, string> = {
  1: 'Part 1', 2: 'Part 2', 3: 'Part 3', 4: 'Part 4',
  5: 'Part 5', 6: 'Part 6', 7: 'Part 7',
}

function fmtDur(sec: number | null) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}m ${s}s`
}

export function TestResults({ attemptId }: { attemptId: string }) {
  const { navigate } = useRouter()
  const { toast } = useToast()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({})
  const [loadingAi, setLoadingAi] = useState<Record<string, boolean>>({})
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all')

  useEffect(() => {
    fetch(`/api/attempts/${attemptId}`)
      .then((r) => r.json())
      .then((d) => {
        setAttempt(d.attempt)
        setQuestions(d.questions)
      })
      .finally(() => setLoading(false))
  }, [attemptId])

  const getAiExplain = useCallback(async (q: Question, selected: number | null) => {
    if (aiExplanations[q.id] || loadingAi[q.id]) return
    setLoadingAi((s) => ({ ...s, [q.id]: true }))
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          options: q.options,
          correctAnswer: q.answer,
          selectedAnswer: selected,
          passage: q.passage,
          part: q.part,
        }),
      })
      const data = await res.json()
      if (data.explanation) {
        setAiExplanations((s) => ({ ...s, [q.id]: data.explanation }))
      } else {
        toast({ title: 'AI unavailable', description: data.error || 'Try again later', variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'AI request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoadingAi((s) => ({ ...s, [q.id]: false }))
    }
  }, [aiExplanations, loadingAi, toast])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Result not found.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'practice' })}>Back to practice</Button>
      </div>
    )
  }

  const total = attempt.totalQuestions
  const correct = attempt.correctCount
  const pct = total ? Math.round((correct / total) * 100) : 0
  const band = attempt.score ? scoreBand(attempt.score) : null
  const hasListening = attempt.listeningScore !== null
  const hasReading = attempt.readingScore !== null

  const filteredQs = questions.filter((q) => {
    const ans = attempt.answers.find((a) => a.questionId === q.id)
    if (filter === 'correct') return ans?.selected === q.answer
    if (filter === 'wrong') return ans?.selected !== q.answer && ans?.selected !== null
    if (filter === 'unanswered') return ans?.selected === null
    return true
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'practice' })} className="mb-4 gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back to practice
      </Button>

      {/* Score hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="overflow-hidden border-primary/20">
          <div className="relative bg-gradient-to-br from-primary/10 via-teal-500/5 to-amber-500/10 p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <Trophy className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estimated TOEIC Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tabular-nums">{attempt.score ?? '—'}</span>
                    <span className="text-lg text-muted-foreground">/ 990</span>
                  </div>
                  {band && (
                    <Badge variant="secondary" className="mt-1">{band.band}</Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {hasListening && (
                  <div className="rounded-xl bg-background/70 p-3 text-center">
                    <Headphones className="mx-auto h-4 w-4 text-teal-500" />
                    <div className="mt-1 text-2xl font-bold tabular-nums">{attempt.listeningScore}</div>
                    <div className="text-[10px] text-muted-foreground">Listening / 495</div>
                    <div className="text-xs text-muted-foreground">{attempt.listeningCorrect} correct</div>
                  </div>
                )}
                {hasReading && (
                  <div className="rounded-xl bg-background/70 p-3 text-center">
                    <FileText className="mx-auto h-4 w-4 text-amber-500" />
                    <div className="mt-1 text-2xl font-bold tabular-nums">{attempt.readingScore}</div>
                    <div className="text-[10px] text-muted-foreground">Reading / 495</div>
                    <div className="text-xs text-muted-foreground">{attempt.readingCorrect} correct</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <div><div className="text-sm font-bold">{correct}/{total}</div><div className="text-[10px] text-muted-foreground">Correct</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 p-3">
              <Target className="h-5 w-5 text-primary" />
              <div><div className="text-sm font-bold">{pct}%</div><div className="text-[10px] text-muted-foreground">Accuracy</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 p-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div><div className="text-sm font-bold">{fmtDur(attempt.durationSec)}</div><div className="text-[10px] text-muted-foreground">Duration</div></div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/40 p-3">
              <XCircle className="h-5 w-5 text-rose-500" />
              <div><div className="text-sm font-bold">{total - correct}</div><div className="text-[10px] text-muted-foreground">Incorrect</div></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review header + filters */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Answer Review</h2>
          <p className="text-sm text-muted-foreground">Review every question and ask the AI to explain the answers.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'wrong', 'correct', 'unanswered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div className="mt-4 space-y-4">
        {filteredQs.length === 0 && (
          <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No questions in this category.</CardContent></Card>
        )}
        {filteredQs.map((q, i) => {
          const ans = attempt.answers.find((a) => a.questionId === q.id)
          const selected = ans?.selected ?? null
          const isCorrect = selected === q.answer
          const isUnanswered = selected === null
          const realIndex = questions.findIndex((qq) => qq.id === q.id)
          return (
            <Card key={q.id} className={isCorrect ? 'border-emerald-500/30' : isUnanswered ? 'border-border' : 'border-rose-500/30'}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold">{realIndex + 1}</span>
                    <Badge variant="outline">{PART_LABEL[q.part]}</Badge>
                    {q.audioScript && <Badge variant="secondary" className="gap-1"><Headphones className="h-3 w-3" /> Audio</Badge>}
                  </div>
                  {isCorrect ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Correct</Badge>
                  ) : isUnanswered ? (
                    <Badge variant="secondary" className="gap-1"><XCircle className="h-3.5 w-3.5" /> Unanswered</Badge>
                  ) : (
                    <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 gap-1"><XCircle className="h-3.5 w-3.5" /> Incorrect</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {q.passage && (
                  <pre className="whitespace-pre-wrap rounded-lg bg-secondary/40 p-3 font-sans text-xs leading-relaxed text-muted-foreground max-h-40 overflow-y-auto scrollbar-thin">{q.passage}</pre>
                )}
                {q.audioScript && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => speak(q.audioScript!)}>
                      <Volume2 className="mr-1 h-3.5 w-3.5" /> Play audio
                    </Button>
                  </div>
                )}
                <p className="text-sm font-medium">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isAns = oi === q.answer
                    const isSel = oi === selected
                    return (
                      <div
                        key={oi}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-sm ${
                          isAns
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : isSel
                            ? 'border-rose-500/50 bg-rose-500/5'
                            : 'border-border'
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${isAns ? 'bg-emerald-500 text-white' : isSel ? 'bg-rose-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAns && <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />}
                        {isSel && !isAns && <XCircle className="mt-0.5 h-4 w-4 text-rose-500" />}
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="rounded-lg bg-secondary/40 p-3 text-xs">
                    <span className="font-semibold text-primary">Explanation: </span>{q.explanation}
                  </div>
                )}

                {/* AI explanation */}
                <Collapsible>
                  <div className="flex items-center gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => getAiExplain(q, selected)} disabled={loadingAi[q.id] || !!aiExplanations[q.id]}>
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        {aiExplanations[q.id] ? 'AI explanation shown' : loadingAi[q.id] ? 'AI is thinking…' : 'Ask AI to explain'}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    {aiExplanations[q.id] && (
                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <Brain className="h-3.5 w-3.5" /> AI Tutor
                        </div>
                        <Markdown content={aiExplanations[q.id]} className="text-sm" />
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => navigate({ name: 'practice' })} className="gap-1.5">
          <RotateCcw className="h-4 w-4" /> Take another test
        </Button>
        <Button variant="outline" onClick={() => navigate({ name: 'dashboard' })}>View my dashboard</Button>
        <Button variant="outline" onClick={() => navigate({ name: 'tutor' })}>Ask the AI tutor</Button>
      </div>
    </div>
  )
}
