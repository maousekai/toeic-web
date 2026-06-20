'use client'

import { motion } from 'framer-motion'
import {
  Sparkles, Brain, BookOpen, ClipboardCheck, MessageSquareText,
  PenLine, CalendarClock, Trophy, ArrowRight, Headphones, FileText,
  Zap, Target, CheckCircle2, GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'

const features = [
  { icon: BookOpen, title: 'Complete TOEIC Curriculum', desc: 'Grammar lessons, vocabulary flashcards and proven strategies for all 7 parts of the test.', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { icon: ClipboardCheck, title: 'Full Practice Tests', desc: 'Part-specific drills and a 40-question mock test with a realistic timer, just like exam day.', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { icon: Trophy, title: 'Instant Grading & Score', desc: 'Get an estimated TOEIC score (10–990) plus a detailed breakdown of every answer.', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { icon: MessageSquareText, title: 'AI Tutor Chat', desc: 'Ask any TOEIC question 24/7 and get clear, exam-focused explanations in seconds.', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  { icon: Zap, title: 'AI Question Generator', desc: 'Generate unlimited fresh practice questions for any part, topic or difficulty level.', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  { icon: PenLine, title: 'AI Writing & Grammar Check', desc: 'Submit your sentences and get instant grammar corrections with friendly tips.', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { icon: CalendarClock, title: 'Personalized Study Plan', desc: 'Tell the AI your level and goal — receive a week-by-week plan to reach your target score.', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  { icon: Target, title: 'Progress Dashboard', desc: 'Track your scores, accuracy and study streaks with visual charts over time.', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
]

const parts = [
  { part: 'Part 1', title: 'Photographs', section: 'Listening', qs: '6 questions', icon: Headphones, desc: 'Choose the best description of a photo.' },
  { part: 'Part 2', title: 'Question-Response', section: 'Listening', qs: '25 questions', icon: Headphones, desc: 'Hear a question, pick the best reply.' },
  { part: 'Part 3', title: 'Conversations', section: 'Listening', qs: '39 questions', icon: Headphones, desc: 'Short dialogues with 3 questions each.' },
  { part: 'Part 4', title: 'Talks', section: 'Listening', qs: '30 questions', icon: Headphones, desc: 'Monologues: announcements & messages.' },
  { part: 'Part 5', title: 'Incomplete Sentences', section: 'Reading', qs: '30 questions', icon: FileText, desc: 'Grammar & vocabulary fill-in-the-blank.' },
  { part: 'Part 6', title: 'Text Completion', section: 'Reading', qs: '16 questions', icon: FileText, desc: 'Fill blanks in short passages.' },
  { part: 'Part 7', title: 'Reading Comprehension', section: 'Reading', qs: '54 questions', icon: FileText, desc: 'Single & multiple passages.' },
]

const stats = [
  { value: '7', label: 'TOEIC parts covered' },
  { value: '60+', label: 'Practice questions' },
  { value: '10–990', label: 'Score estimate range' },
  { value: '5', label: 'AI-powered tools' },
]

export function HomeView() {
  const { navigate } = useRouter()
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 animate-gradient" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full px-3 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-Powered TOEIC Preparation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Master the TOEIC test with your{' '}
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                personal AI coach
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Everything you need to ace the TOEIC Listening &amp; Reading test — complete lessons,
              realistic practice exams, instant grading, and AI tutoring that explains every answer.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate({ name: 'practice' })}>
                Start a Free Practice Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate({ name: 'learn' })}>
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Lessons
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">No sign-up required · Practice instantly · Free forever</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <Card key={s.label} className="border-border/60 text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">One platform, every TOEIC skill</h2>
          <p className="mt-4 text-muted-foreground">
            From grammar fundamentals to exam-day strategy, backed by AI at every step.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOEIC STRUCTURE */}
      <section className="border-y border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Test Structure</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The 7 parts of the TOEIC test</h2>
            <p className="mt-4 text-muted-foreground">
              200 questions in 2 hours — 100 Listening (45 min) + 100 Reading (75 min).
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parts.map((p, i) => (
              <motion.div
                key={p.part}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Card className="h-full">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${p.section === 'Listening' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                      <p.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{p.part}</CardTitle>
                        <Badge variant="secondary" className="text-[10px]">{p.qs}</Badge>
                      </div>
                      <div className="text-sm font-medium text-primary">{p.title}</div>
                      <CardDescription className="mt-1 text-sm">{p.desc}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}

            <Card className="flex h-full items-center justify-center border-dashed bg-background/50">
              <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                <Brain className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Practice all parts with AI feedback</p>
                <Button size="sm" variant="ghost" onClick={() => navigate({ name: 'practice' })}>
                  Try now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5"><Sparkles className="h-3.5 w-3.5" /> AI Tutoring</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your AI tutor never sleeps</h2>
            <p className="mt-4 text-muted-foreground">
              Stuck on a grammar rule at midnight? Need someone to explain why an answer is wrong?
              Our AI tutor gives you instant, exam-focused guidance — in plain English.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Ask any TOEIC question and get a clear explanation',
                'AI explains why each option is right or wrong',
                'Generate fresh practice questions on any topic',
                'Get your writing corrected with friendly feedback',
                'Receive a personalized week-by-week study plan',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-6" onClick={() => navigate({ name: 'tutor' })}>
              <MessageSquareText className="mr-2 h-4 w-4" />
              Chat with the AI Tutor
            </Button>
          </div>

          <Card className="overflow-hidden border-primary/20 shadow-lg">
            <CardHeader className="border-b border-border/60 bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">TOEIC Coach</CardTitle>
                  <CardDescription className="text-xs">AI Tutor · Online</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                Why do we use "since" with the present perfect?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm">
                Great question! Use <strong>since</strong> with a <em>specific starting point</em> in time
                (since 2018, since Monday), and <strong>for</strong> with a <em>duration</em> (for two years).
                Both go with the present perfect when the action continues to now. ✨
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
                Can you give me a Part 5 practice question on prepositions?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm">
                Sure! Try this: <em>"The meeting is scheduled ____ 3 p.m. ___ Monday."</em> 🎯
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-teal-600 text-primary-foreground">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <CardContent className="relative flex flex-col items-center gap-6 p-10 text-center sm:p-16">
            <Trophy className="h-12 w-12" />
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to reach your target TOEIC score?
            </h2>
            <p className="max-w-xl text-primary-foreground/80">
              Take a mock test, review every answer with AI, and build the skills that move your score up.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base" onClick={() => navigate({ name: 'practice' })}>
                Take a Mock Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => navigate({ name: 'learn' })}>
                Browse Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
