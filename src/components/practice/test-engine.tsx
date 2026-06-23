'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Clock, ChevronLeft, ChevronRight, Flag, Volume2, AlertCircle, Headphones, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter, getLearnerId } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'

type Question = {
  id: string
  part: number
  passage: string | null
  audioScript: string | null
  question: string
  options: string[]
  answer: number
}

type TestSet = {
  id: string
  title: string
  durationMin: number
  type: string
  questionIds: string[]
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const PART_LABEL: Record<number, string> = {
  1: 'Part 1 · Photographs',
  2: 'Part 2 · Question-Response',
  3: 'Part 3 · Conversations',
  4: 'Part 4 · Talks',
  5: 'Part 5 · Incomplete Sentences',
  6: 'Part 6 · Text Completion',
  7: 'Part 7 · Reading Comprehension',
}

export function TestEngine({ testSetId }: { testSetId: string }) {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [testSet, setTestSet] = useState<TestSet | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const startedAtRef = useRef<number>(Date.now())
  const playedRef = useRef<Set<string>>(new Set())

  // Load test
  useEffect(() => {
    fetch(`/api/tests/${testSetId}`)
      .then((r) => r.json())
      .then((d) => {
        setTestSet(d.testSet)
        setQuestions(d.questions)
        setTimeLeft((d.testSet.durationMin || 30) * 60)
        const init: Record<string, number | null> = {}
        d.questions.forEach((q: Question) => (init[q.id] = null))
        setAnswers(init)
      })
      .finally(() => setLoading(false))
  }, [testSetId])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  const submit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    const durationSec = Math.round((Date.now() - startedAtRef.current) / 1000)
    const payload = {
      learnerId: getLearnerId(user?.id),
      testSetId: testSet?.id,
      testSetTitle: testSet?.title,
      type: testSet?.type || 'mini',
      durationSec,
      answers: questions.map((q) => ({ questionId: q.id, selected: answers[q.id] ?? null })),
    }
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.attemptId) {
        toast({ title: 'Test submitted!', description: `You scored ${data.correct}/${data.total} correct.` })
        navigate({ name: 'results', attemptId: data.attemptId })
      } else {
        toast({ title: 'Submission failed', description: data.error || 'Unknown error', variant: 'destructive' })
        setSubmitting(false)
      }
    } catch (e: any) {
      toast({ title: 'Submission failed', description: e.message, variant: 'destructive' })
      setSubmitting(false)
    }
  }, [answers, questions, testSet, navigate, toast, submitting])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !loading && questions.length > 0 && !submitting) {
      toast({ title: "Time's up!", description: 'Submitting your test automatically.' })
      submit()
    }
  }, [timeLeft, loading, questions.length, submit, submitting, toast])

  // Listening: auto-play audio when entering a listening question
  const playAudio = useCallback((q: Question) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !q.audioScript) return
    const u = new SpeechSynthesisUtterance(q.audioScript)
    u.lang = 'en-US'
    u.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [])

  useEffect(() => {
    if (questions.length === 0) return
    const q = questions[current]
    if (q && q.part <= 4 && q.audioScript && !playedRef.current.has(q.id)) {
      playedRef.current.add(q.id)
      // small delay to ensure speechSynthesis is ready
      const t = setTimeout(() => playAudio(q), 300)
      return () => clearTimeout(t)
    }
  }, [current, questions, playAudio])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!testSet || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">This test could not be loaded.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'practice' })}>Back to practice</Button>
      </div>
    )
  }

  const q = questions[current]
  const answeredCount = Object.values(answers).filter((v) => v !== null).length
  const isListening = q.part <= 4
  const lowTime = timeLeft <= 60

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Top bar */}
      <div className="sticky top-16 z-30 mb-4 flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/90 p-3 backdrop-blur">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{testSet.title}</p>
          <p className="text-xs text-muted-foreground">{answeredCount}/{questions.length} answered</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold tabular-nums ${lowTime ? 'bg-rose-500/10 text-rose-600 animate-pulse' : 'bg-secondary'}`}>
            <Clock className="h-4 w-4" />
            {fmt(timeLeft)}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" disabled={submitting}>
                <Flag className="mr-1 h-3.5 w-3.5" /> Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit your test?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have answered {answeredCount} of {questions.length} questions.
                  {answeredCount < questions.length ? ` ${questions.length - answeredCount} unanswered questions will be marked incorrect.` : ' All questions answered.'}
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep going</AlertDialogCancel>
                <AlertDialogAction onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit now'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        {/* Question area */}
        <div className="space-y-4">
          {/* Passage (Part 6/7) */}
          {q.passage && (
            <Card className="bg-secondary/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Passage</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{q.passage}</pre>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant={isListening ? 'secondary' : 'outline'} className="gap-1">
                  {isListening && <Headphones className="h-3 w-3" />}
                  {PART_LABEL[q.part] || `Part ${q.part}`}
                </Badge>
                <span className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Listening audio control */}
              {isListening && q.audioScript && (
                <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-teal-700 dark:text-teal-300">
                      <Volume2 className="h-4 w-4" />
                      <span>Listen to the audio, then choose the best answer.</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => playAudio(q)}>
                      <Volume2 className="mr-1 h-3.5 w-3.5" /> Replay
                    </Button>
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Show transcript</summary>
                    <p className="mt-1 text-sm italic text-muted-foreground">"{q.audioScript}"</p>
                  </details>
                </div>
              )}

              <p className="text-base font-medium leading-relaxed">{q.question}</p>

              <div className="space-y-2.5">
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                        selected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/40 hover:bg-accent/50'
                      }`}
                    >
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {selected && <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button disabled={submitting}><Flag className="mr-1 h-4 w-4" /> Finish &amp; Submit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit your test?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {answeredCount} of {questions.length} questions.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep going</AlertDialogCancel>
                    <AlertDialogAction onClick={submit} disabled={submitting}>Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Question palette */}
        <div className="hidden lg:block">
          <Card className="sticky top-32">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Question Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((qq, i) => {
                  const ans = answers[qq.id]
                  return (
                    <button
                      key={qq.id}
                      onClick={() => setCurrent(i)}
                      className={`flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                        i === current
                          ? 'bg-primary text-primary-foreground'
                          : ans !== null && ans !== undefined
                          ? 'bg-primary/15 text-primary'
                          : 'bg-secondary text-muted-foreground hover:bg-accent'
                      }`}
                      aria-label={`Go to question ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary" /> Current</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-primary/30" /> Answered</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-secondary" /> Unanswered</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
