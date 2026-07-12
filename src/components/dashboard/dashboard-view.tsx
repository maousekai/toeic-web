'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Trophy, Target, Clock, TrendingUp, Award, BookOpen, ArrowRight,
  Headphones, FileText, BarChart3, Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter, getLearnerId } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import { Skeleton } from '@/components/ui/skeleton'
import { scoreBand } from '@/lib/score'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts'

type Attempt = {
  id: string
  testSetTitle: string | null
  type: string
  totalQuestions: number
  correctCount: number
  score: number | null
  listeningScore: number | null
  readingScore: number | null
  durationSec: number | null
  startedAt: string
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DashboardView() {
  const { navigate } = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { openAuth } = useAuthUI()
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [learnerId, setLearnerId] = useState('')

  useEffect(() => {
    if (authLoading) return
    const id = getLearnerId(user?.id)
    setLearnerId(id)
    fetch(`/api/attempts/by-learner/${id}`)
      .then((r) => r.json())
      .then((d) => setAttempts(d.attempts || []))
      .finally(() => setLoading(false))
  }, [user?.id, authLoading])

  const scored = attempts.filter((a) => a.score !== null)
  const bestScore = scored.length ? Math.max(...scored.map((a) => a.score!)) : 0
  const avgScore = scored.length ? Math.round(scored.reduce((s, a) => s + (a.score || 0), 0) / scored.length) : 0
  const totalQuestions = attempts.reduce((s, a) => s + a.totalQuestions, 0)
  const totalCorrect = attempts.reduce((s, a) => s + a.correctCount, 0)
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  const chartData = [...scored].reverse().map((a, i) => ({
    name: `#${i + 1}`,
    score: a.score,
    date: fmtDate(a.startedAt),
  }))

  // Skill breakdown (listening vs reading correct where available)
  const lAttempts = attempts.filter((a) => a.listeningScore !== null)
  const rAttempts = attempts.filter((a) => a.readingScore !== null)
  const skillData = [
    { skill: 'Listening', value: lAttempts.length ? Math.round(lAttempts.reduce((s, a) => s + (a.listeningScore || 0), 0) / lAttempts.length) : 0, fill: '#14b8a6' },
    { skill: 'Reading', value: rAttempts.length ? Math.round(rAttempts.reduce((s, a) => s + (a.readingScore || 0), 0) / rAttempts.length) : 0, fill: '#f59e0b' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header with banner image */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-teal-500/5 to-amber-500/10">
        <div className="grid items-center gap-4 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Track your progress, scores and study activity over time.</p>
            <Button className="mt-4" onClick={() => navigate({ name: 'practice' })}>
              <Trophy className="mr-2 h-4 w-4" /> Take a new test
            </Button>
          </div>
          <div className="relative hidden h-28 w-28 overflow-hidden rounded-xl border border-border/60 shadow-md sm:block">
            <Image
              src="/images/home/dashboard.jpg"
              alt="Dashboard analytics"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Auth gate */}
      {!authLoading && !user ? (
        <Card className="border-dashed border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sign in to view your dashboard</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Create a free account to track your TOEIC scores across devices, save your progress, and unlock personalized AI study plans.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => openAuth('register')}>Create free account <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
              <Button variant="outline" onClick={() => openAuth('login')}>Sign in</Button>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      ) : attempts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No attempts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Take your first practice test to start tracking progress here.</p>
            </div>
            <Button onClick={() => navigate({ name: 'practice' })}>Start practicing <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Best Score</p>
                    <p className="text-3xl font-bold tabular-nums text-primary">{bestScore || '—'}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-primary/30" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold tabular-nums">{avgScore || '—'}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-500/40" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                    <p className="text-3xl font-bold tabular-nums">{accuracy}%</p>
                    <p className="text-[10px] text-muted-foreground">{totalCorrect}/{totalQuestions} correct</p>
                  </div>
                  <Target className="h-8 w-8 text-amber-500/40" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Tests Taken</p>
                    <p className="text-3xl font-bold tabular-nums">{attempts.length}</p>
                  </div>
                  <Award className="h-8 w-8 text-violet-500/40" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Score history */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" /> Score History</CardTitle>
                <CardDescription>Your estimated TOEIC score across attempts.</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 990]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                        labelFormatter={(l) => `Attempt ${l}`}
                        formatter={(v: any) => [`${v} / 990`, 'Score']}
                      />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-sm text-muted-foreground">No scored attempts yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Skill breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4 text-primary" /> Skill Breakdown</CardTitle>
                <CardDescription>Average scores by section.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={skillData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="skill" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis domain={[0, 495]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v} / 495`, '']} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {skillData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent attempts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4 text-primary" /> Recent Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
                {attempts.slice(0, 15).map((a) => {
                  const band = a.score ? scoreBand(a.score) : null
                  return (
                    <button
                      key={a.id}
                      onClick={() => navigate({ name: 'results', attemptId: a.id })}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{a.testSetTitle || a.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {fmtDate(a.startedAt)} · {a.correctCount}/{a.totalQuestions} correct
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {a.listeningScore !== null && (
                          <Badge variant="outline" className="gap-1 text-[10px]"><Headphones className="h-3 w-3" /> {a.listeningScore}</Badge>
                        )}
                        {a.readingScore !== null && (
                          <Badge variant="outline" className="gap-1 text-[10px]"><FileText className="h-3 w-3" /> {a.readingScore}</Badge>
                        )}
                        {a.score !== null ? (
                          <div className="text-right">
                            <div className="text-lg font-bold tabular-nums text-primary">{a.score}</div>
                            <div className="text-[9px] text-muted-foreground">{band?.band.split(' ')[0]}</div>
                          </div>
                        ) : (
                          <Badge variant="secondary">—</Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md" onClick={() => navigate({ name: 'learn' })}>
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookOpen className="h-5 w-5" /></div>
                <div><p className="text-sm font-semibold">Continue Learning</p><p className="text-xs text-muted-foreground">Grammar & vocabulary</p></div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md" onClick={() => navigate({ name: 'tutor' })}>
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Trophy className="h-5 w-5" /></div>
                <div><p className="text-sm font-semibold">Ask AI Tutor</p><p className="text-xs text-muted-foreground">Get instant help</p></div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md" onClick={() => navigate({ name: 'tools' })}>
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock className="h-5 w-5" /></div>
                <div><p className="text-sm font-semibold">AI Study Plan</p><p className="text-xs text-muted-foreground">Build a roadmap</p></div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
