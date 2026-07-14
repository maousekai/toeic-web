'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import {
  Sparkles, Zap, PenLine, CalendarClock, Wand2, Loader2, CheckCircle2,
  Volume2, RefreshCw, ClipboardCopy, Send,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@/components/site/markdown'
import { LanguageToggle } from '@/components/site/language-toggle'
import { useLanguage } from '@/lib/use-language'
import { useToast } from '@/hooks/use-toast'

// ---------- AI Question Generator ----------
type GenQuestion = {
  part: number
  passage: string | null
  question: string
  options: string[]
  answer: number
  explanation: string
  category?: string
}

function QuestionGenerator() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [part, setPart] = useState('5')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [count, setCount] = useState('3')
  const [questions, setQuestions] = useState<GenQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const generate = useCallback(async () => {
    setLoading(true)
    setQuestions([])
    setRevealed({})
    try {
      const res = await fetch('/api/ai/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ part: Number(part), topic, difficulty, count: Number(count), language }),
      })
      const data = await res.json()
      if (data.questions) {
        setQuestions(data.questions)
        toast({ title: `Generated ${data.questions.length} question(s)` })
      } else {
        toast({ title: 'Generation failed', description: data.error, variant: 'destructive' })
      }
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [part, topic, difficulty, count, language, toast])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text.replace(/^Audio:\s*/i, ''))
    u.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Wand2 className="h-5 w-5 text-primary" /> AI Question Generator</CardTitle>
          <CardDescription>Generate fresh TOEIC practice questions on demand, for any part and topic.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs">TOEIC Part</Label>
              <Select value={part} onValueChange={setPart}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Part 2 — Question-Response</SelectItem>
                  <SelectItem value="5">Part 5 — Incomplete Sentences</SelectItem>
                  <SelectItem value="6">Part 6 — Text Completion</SelectItem>
                  <SelectItem value="7">Part 7 — Reading Comprehension</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Topic (optional)</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. prepositions, tenses" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Number of questions</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate questions</>}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Part {q.part}</Badge>
                  {q.category && <Badge variant="secondary">{q.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {q.part === 2 && (
                  <Button size="sm" variant="outline" onClick={() => speak(q.question)}><Volume2 className="mr-1 h-3.5 w-3.5" /> Play audio</Button>
                )}
                <p className="text-sm font-medium">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const show = revealed[i]
                    const isAns = oi === q.answer
                    return (
                      <div key={oi} className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-sm ${show && isAns ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}>
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-secondary text-muted-foreground">{String.fromCharCode(65 + oi)}</span>
                        <span className="flex-1">{opt}</span>
                        {show && isAns && <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />}
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
                    {revealed[i] ? 'Hide answer' : 'Show answer'}
                  </Button>
                </div>
                {revealed[i] && q.explanation && (
                  <div className="rounded-lg bg-secondary/40 p-3 text-xs">
                    <span className="font-semibold text-primary">Explanation: </span>{q.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" onClick={generate} disabled={loading} className="gap-1.5">
            <RefreshCw className="h-4 w-4" /> Generate more
          </Button>
        </div>
      )}
    </div>
  )
}

// ---------- Writing & Grammar Checker ----------
function WritingChecker() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const check = useCallback(async () => {
    if (text.trim().length < 3) return
    setLoading(true)
    setFeedback('')
    try {
      const res = await fetch('/api/ai/writing-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      })
      const data = await res.json()
      if (data.feedback) setFeedback(data.feedback)
      else toast({ title: 'Check failed', description: data.error, variant: 'destructive' })
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [text, language, toast])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><PenLine className="h-5 w-5 text-primary" /> AI Writing &amp; Grammar Check</CardTitle>
        <CardDescription>Write a sentence or short paragraph and get instant corrections and tips.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I have went to the office yesterday for discussing about the new project."
          rows={4}
          className="resize-none"
        />
        <Button onClick={check} disabled={loading || text.trim().length < 3}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking…</> : <><Send className="mr-2 h-4 w-4" /> Check my writing</>}
        </Button>
        {feedback && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> AI Feedback
            </div>
            <Markdown content={feedback} className="text-sm" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ---------- Study Plan Generator ----------
function StudyPlan() {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [currentLevel, setCurrentLevel] = useState('intermediate')
  const [targetScore, setTargetScore] = useState('750')
  const [weeks, setWeeks] = useState('8')
  const [perDay, setPerDay] = useState('1-2 hours per day')
  const [focus, setFocus] = useState('')
  const [plan, setPlan] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    setPlan('')
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLevel, targetScore: Number(targetScore), weeksAvailable: Number(weeks), studyTimePerDay: perDay, focusAreas: focus, language,
        }),
      })
      const data = await res.json()
      if (data.plan) setPlan(data.plan)
      else toast({ title: 'Failed', description: data.error, variant: 'destructive' })
    } catch (e: any) {
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [currentLevel, targetScore, weeks, perDay, focus, language, toast])

  const copyPlan = () => {
    navigator.clipboard.writeText(plan)
    toast({ title: 'Copied to clipboard' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg"><CalendarClock className="h-5 w-5 text-primary" /> Personalized Study Plan</CardTitle>
        <CardDescription>Tell the AI your level and goal — receive a custom week-by-week plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Current level</Label>
            <Select value={currentLevel} onValueChange={setCurrentLevel}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (A2)</SelectItem>
                <SelectItem value="pre-intermediate">Pre-Intermediate (B1)</SelectItem>
                <SelectItem value="intermediate">Intermediate (B1+)</SelectItem>
                <SelectItem value="upper-intermediate">Upper-Intermediate (B2)</SelectItem>
                <SelectItem value="advanced">Advanced (C1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target score</Label>
            <Select value={targetScore} onValueChange={setTargetScore}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="600">600</SelectItem>
                <SelectItem value="700">700</SelectItem>
                <SelectItem value="750">750</SelectItem>
                <SelectItem value="800">800</SelectItem>
                <SelectItem value="850">850</SelectItem>
                <SelectItem value="900">900</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Weeks available</Label>
            <Select value={weeks} onValueChange={setWeeks}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 weeks</SelectItem>
                <SelectItem value="8">8 weeks</SelectItem>
                <SelectItem value="12">12 weeks</SelectItem>
                <SelectItem value="16">16 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Time per day</Label>
            <Select value={perDay} onValueChange={setPerDay}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30 min - 1 hour">30 min – 1 hour</SelectItem>
                <SelectItem value="1-2 hours per day">1–2 hours</SelectItem>
                <SelectItem value="2-3 hours per day">2–3 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Areas to focus on (optional)</Label>
          <Input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. listening, grammar, time management" />
        </div>
        <Button onClick={generate} disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building your plan…</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate study plan</>}
        </Button>
        {plan && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <CalendarClock className="h-4 w-4" /> Your Personalized Plan
              </div>
              <Button size="sm" variant="ghost" onClick={copyPlan}><ClipboardCopy className="mr-1 h-3.5 w-3.5" /> Copy</Button>
            </div>
            <Markdown content={plan} className="text-sm" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ToolsView() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header with banner image */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-teal-500/5 to-amber-500/10">
        <div className="grid items-center gap-4 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <Badge variant="secondary" className="mb-2 gap-1.5"><Sparkles className="h-3.5 w-3.5" /> AI Powered</Badge>
            <h1 className="text-3xl font-bold tracking-tight">AI Tools</h1>
            <p className="mt-2 text-muted-foreground">Supercharge your TOEIC prep with on-demand AI — generate questions, check your writing, and get a study plan.</p>
          </div>
          <div className="relative hidden h-24 w-24 overflow-hidden rounded-xl border border-border/60 shadow-md sm:block">
            <Image
              src="/images/ai/study-plan.jpg"
              alt="AI Tools"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="generator">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="flex flex-wrap h-auto shrink-0">
            <TabsTrigger value="generator" className="gap-1.5"><Zap className="h-4 w-4" /> Question Generator</TabsTrigger>
            <TabsTrigger value="writing" className="gap-1.5"><PenLine className="h-4 w-4" /> Writing Check</TabsTrigger>
            <TabsTrigger value="plan" className="gap-1.5"><CalendarClock className="h-4 w-4" /> Study Plan</TabsTrigger>
          </TabsList>
          <LanguageToggle />
        </div>
        <TabsContent value="generator" className="mt-0"><QuestionGenerator /></TabsContent>
        <TabsContent value="writing" className="mt-0"><WritingChecker /></TabsContent>
        <TabsContent value="plan" className="mt-0"><StudyPlan /></TabsContent>
      </Tabs>
    </div>
  )
}
