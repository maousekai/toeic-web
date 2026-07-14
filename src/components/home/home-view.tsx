'use client'

import { motion } from 'framer-motion'
import {
  Sparkles, Brain, BookOpen, ClipboardCheck, MessageSquareText,
  PenLine, CalendarClock, Trophy, ArrowRight, Headphones, FileText,
  Zap, Target, CheckCircle2, GraduationCap, Star, Quote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from '@/lib/router'
import { useAuth } from '@/lib/auth/use-auth'
import { useAuthUI } from '@/lib/auth/auth-ui-context'
import Image from 'next/image'

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
  { value: '742+', label: 'Vocabulary words' },
  { value: '10–990', label: 'Score estimate range' },
  { value: '6', label: 'AI-powered tools' },
]

const testimonials = [
  {
    name: 'Linh Nguyen',
    role: 'Student, Hanoi',
    avatar: '/images/home/testimonial-1.jpg',
    score: '850',
    text: 'Từ 550 lên 850 chỉ trong 3 tháng! AI Tutor giải thích từng câu sai cực kỳ dễ hiểu. Mình học mỗi tối 1 tiếng là đủ.',
    rating: 5,
  },
  {
    name: 'Minh Tran',
    role: 'Engineer, HCMC',
    avatar: '/images/home/testimonial-2.jpg',
    score: '790',
    text: 'Đề thi thật rất gần với trên app. Phần Listening có audio MP3 thật, nghe y hệt phong độ thi thật. Recommend 100%!',
    rating: 5,
  },
  {
    name: 'Mai Pham',
    role: 'Office Worker, Da Nang',
    avatar: '/images/home/testimonial-3.jpg',
    score: '720',
    text: 'Mình bận công việc nên chỉ học được cuối tuần. AI Study Plan giúp mình tối ưu thời gian, đạt target sau 2 tháng.',
    rating: 5,
  },
  {
    name: 'Tuan Le',
    role: 'Graduate, Hai Phong',
    avatar: '/images/home/testimonial-4.jpg',
    score: '905',
    text: 'Phần giải thích đáp án bằng tiếng Việt cực kỳ chi tiết. Grammar lessons cũng hay, có cả bài tập luyện thêm. Tuyệt vời!',
    rating: 5,
  },
]

export function HomeView() {
  const { navigate } = useRouter()
  const { user } = useAuth()
  const { openAuth } = useAuthUI()

  const primaryCta = () => {
    if (user) navigate({ name: 'practice' })
    else openAuth('register', () => navigate({ name: 'practice' }))
  }

  return (
    <div>
      {/* ===== HERO — Modern split layout with images ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 sm:pt-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT — Text content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <Badge variant="secondary" className="mb-4 gap-1.5 rounded-full px-3 py-1 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI-Powered TOEIC Preparation
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Hãy chinh phục bài thi TOEIC cùng {' '}
                <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                  trợ lý AI của bạn
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:mx-0">
                Tất cả những gì bạn cần để đạt điểm cao trong bài thi TOEIC Nghe & Đọc với bài học đầy đủ, đề thi thực hành sát với thực tế, chấm điểm tức thì và trợ giảng AI giải thích từng câu trả lời.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" className="h-12 px-8 text-base" onClick={primaryCta}>
                  {user ? 'Start a Free Practice Test' : 'Get Started — It\'s Free'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate({ name: 'learn' })}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore Lessons
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {user ? 'Welcome back — your progress is saved.' : 'No credit card required · Save progress across devices'}
              </p>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-background">
                      <Image
                        src={`/images/home/testimonial-${i}.jpg`}
                        alt="User avatar"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 1,000+ Vietnamese learners</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Hero image collage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              {/* Main hero photo — real people learning */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
                <Image
                  src="/images/home/hero-english.jpg"
                  alt="Students learning English together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {/* Gradient overlay for text legibility + brand color tint */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 via-transparent to-amber-500/20" />
              </div>

              {/* Floating tutor portrait — top left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -left-4 -top-4 hidden w-32 overflow-hidden rounded-xl border-2 border-background shadow-xl sm:block lg:-left-8"
              >
                <div className="relative aspect-square">
                  <Image src="/images/home/tutor-woman.jpg" alt="AI Tutor" fill sizes="128px" className="object-cover" />
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-1 right-1 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </motion.div>

              {/* Floating student office photo — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -right-4 hidden h-24 w-24 overflow-hidden rounded-2xl border-2 border-background shadow-xl sm:block lg:-right-8 lg:h-32 lg:w-32"
              >
                <div className="relative h-full w-full">
                  <Image src="/images/home/student-office.png" alt="Student studying" fill sizes="128px" className="object-cover" />
                </div>
              </motion.div>

              {/* Floating score badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -bottom-4 left-6 flex items-center gap-2 rounded-xl border border-border/60 bg-background/95 p-3 shadow-xl backdrop-blur"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-none">+295 pts</div>
                  <div className="text-[10px] text-muted-foreground">Average improvement</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
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

      {/* ===== FEATURES ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">Features</Badge>
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
              <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${f.color} transition-transform group-hover:scale-110`}>
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

      {/* ===== TOEIC STRUCTURE ===== */}
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
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-md">
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

      {/* ===== AI SHOWCASE — with real tutor photo ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT — Real tutor photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-border/60 shadow-xl">
              <Image
                src="/images/home/tutor-woman.jpg"
                alt="AI TOEIC Tutor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Brand color tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-teal-500/10" />
            </div>
            {/* Floating chat bubble */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -right-4 top-8 max-w-[200px] rounded-2xl rounded-tl-sm bg-primary px-4 py-3 text-sm text-primary-foreground shadow-xl"
            >
              <span className="font-medium">Hi! I'm your TOEIC Coach 👋</span>
              <p className="mt-1 text-xs text-primary-foreground/80">Ask me anything, 24/7!</p>
            </motion.div>
            {/* Online status badge */}
            <div className="absolute -left-3 bottom-6 flex items-center gap-2 rounded-full border border-border/60 bg-background/95 px-3 py-1.5 shadow-lg backdrop-blur">
              <span className="flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium">Online now</span>
            </div>
          </motion.div>

          {/* RIGHT — Text + features list */}
          <div className="order-1 lg:order-2">
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
        </div>
      </section>

      {/* ===== TESTIMONIALS — New section with real people photos ===== */}
      <section className="border-y border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-3">Success Stories</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Học viên nói gì về TOEIC Ace AI?</h2>
            <p className="mt-4 text-muted-foreground">
              Hàng ngàn học viên đã cải thiện điểm TOEIC chỉ trong vài tháng.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full overflow-hidden"> {/* 1. CÁI NÀY GIỮ NGUYÊN */}
                  {/* Avatar header */}
                  {/* 2. CÁI NÀY PHẢI XÓA overflow-hidden ĐI */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/10 to-teal-500/10">

                    {/* Thêm z-10 vào đây để ảnh luôn nổi lên trên */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">

                      {/* 3. CÁI NÀY BẮT BUỘC PHẢI GIỮ overflow-hidden để ảnh có hình TRÒN */}
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-background shadow-lg">
                        <Image src={t.avatar} alt={t.name} fill sizes="80px" className="object-cover" />
                      </div>

                    </div>

                    {/* Score badge */}
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                      <Trophy className="h-3 w-3" />
                      {t.score}
                    </div>
                  </div>
                  <CardContent className="px-5 pb-5 pt-12 text-center">
                    <Quote className="mx-auto mb-2 h-5 w-5 text-primary/40" />
                    <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                    <div className="mt-4 flex justify-center gap-0.5">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="mt-3">
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOWCASE BANNER — with listening photo ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="grid md:grid-cols-2">
            {/* Image side */}
            <div className="relative h-64 md:h-auto">
              <Image
                src="/images/home/listening.jpg"
                alt="Student practicing listening with headphones"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent md:bg-gradient-to-r" />
            </div>
            {/* Content side */}
            <CardContent className="flex flex-col justify-center gap-4 p-8 sm:p-12">
              <Badge variant="secondary" className="w-fit gap-1.5"><Headphones className="h-3.5 w-3.5" /> Listening Practice</Badge>
              <h3 className="text-2xl font-bold sm:text-3xl">Luyện Listening với audio MP3 thật</h3>
              <p className="text-muted-foreground">
                Đề thi có audio MP3 chuẩn ETS, giọng đọc y hệt phong độ thi thật. Part 1 có ảnh minh hoạ,
                Part 2-4 có transcript để kiểm tra đáp án sau khi nộp bài.
              </p>
              <ul className="space-y-2">
                {['100 câu Listening đầy đủ (Part 1-4)', 'Audio MP3 chuẩn như thi thật', 'Exam Mode giả lập phòng thi', 'Transcript + giải thích từng câu'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-2 w-fit" onClick={() => navigate({ name: 'practice' })}>
                Luyện Listening ngay <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* ===== CTA ===== */}
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
