# 🎓 TOEIC Ace AI

A complete, AI-powered TOEIC Listening & Reading preparation platform built with Next.js 16, featuring practice tests, instant grading, AI tutoring, vocabulary flashcards, grammar lessons, and personalized study plans.

![TOEIC Ace AI](https://img.shields.io/badge/TOEIC-Ace%20AI-emerald) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📚 Learning Center
- **Grammar lessons** — 10 lessons (tenses, conditionals, passive voice, articles, prepositions, gerunds, relative clauses, comparatives, modals) with examples and text-to-speech audio
- **Vocabulary flashcards** — 32 business-English words with flip animation, pronunciation, and **spaced repetition** (stored locally)
- **Strategies & tips** — section-by-section tactics for Listening, Reading, and test day

### ✍️ Practice Tests & Grading
- **6 curated test sets** (Part 2 listening, Part 5, Part 6, Part 7, and a 40-question full mock)
- **Real test engine** with countdown timer, question palette, **browser TTS narration for listening**, auto-submit on timeout
- **Instant grading** with estimated TOEIC score (10–990), listening/reading breakdown, filterable answer review
- **Per-question AI explanations** — ask the AI why each answer is right/wrong

### 🤖 AI Features (5 tools, multi-provider)
1. **AI Tutor chat** — 24/7 conversational TOEIC coach (Vietnamese / English / Bilingual)
2. **AI Answer Explainer** — explains every question in your test results
3. **AI Question Generator** — creates fresh practice questions for any part/topic/difficulty
4. **AI Writing & Grammar Checker** — corrects your sentences with friendly tips
5. **AI Study Plan Generator** — personalized week-by-week roadmap

**Supports 6 AI providers** — auto-detected via environment variables:
| Provider | Env var | Type | Cost |
|---|---|---|---|
| 🦙 Ollama | `OLLAMA_BASE_URL` | Local | Free, offline |
| 🟢 OpenAI | `OPENAI_API_KEY` | Cloud | Paid |
| 🔌 OpenRouter | `OPENROUTER_API_KEY` | Cloud | Free tier |
| ⚡ Groq | `GROQ_API_KEY` | Cloud | Free tier |
| ✨ Google Gemini | `GEMINI_API_KEY` | Cloud | Free tier |
| 🤖 ZAI | (auto in Z.ai sandbox) | Cloud | Free |

### 🔐 Authentication
- Email + password registration / login (NextAuth.js)
- Passwords hashed with bcrypt (salt 10)
- Cross-device progress sync (deterministic learner ID)
- Anonymous fallback (localStorage) — no login required to try

### 📊 Dashboard
- Stat cards: best score, average score, accuracy, tests taken
- Recharts visualizations: score history line chart + skill breakdown bar chart
- Recent attempts list (click to review any past test)

### 🎨 UX
- Responsive design (mobile-first, hamburger menu)
- Dark mode (next-themes)
- Sticky footer, accessibility (semantic HTML, ARIA labels)
- 3 AI reply languages: 🇻🇳 Vietnamese / 🌐 Bilingual / 🇬🇧 English

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York)
- **Database**: Prisma ORM + SQLite
- **Auth**: NextAuth.js v4 (JWT strategy) + bcryptjs
- **AI**: z-ai-web-dev-sdk + openai SDK (for other providers)
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: react-markdown + remark-gfm
- **Runtime**: Bun (or Node.js ≥ 18.18)

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.18 (or Bun ≥ 1.0)
- An AI provider (see `.env.example` — Ollama is recommended for free offline use)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/toeic-ace-ai.git
cd toeic-ace-ai

# 2. Install dependencies
bun install        # or: npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env — fill in NEXTAUTH_SECRET and choose an AI provider

# 4. Set up database
bun run db:push       # Create SQLite schema
bun run db:generate   # Generate Prisma client
bun run scripts/seed.ts  # Seed TOEIC content (32 vocab, 10 grammar lessons, 61 questions, 6 test sets)

# 5. Run the dev server
bun run dev           # or: npm run dev
```

Open **http://localhost:3000** 🎉

## 📦 Deploy

### Vercel (recommended)
1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (from `.env.example`) in Vercel dashboard
4. **Note**: Switch from SQLite to PostgreSQL for production (Vercel Postgres, Supabase, Neon)
5. Deploy

### Other platforms
Works on Netlify, Railway, Render, or any VPS with Node.js. For VPS, SQLite is fine.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                  # 16 API routes
│   │   ├── ai/               # 6 AI endpoints (chat, explain, generate, writing-check, study-plan, provider)
│   │   ├── attempts/         # Test submission + history
│   │   ├── auth/             # NextAuth + register
│   │   ├── content/          # Vocab, grammar, strategies
│   │   └── tests/            # Test sets
│   ├── layout.tsx            # Root layout (Theme + Session + Language providers)
│   └── page.tsx              # Single-route SPA with view router
├── components/
│   ├── ai/                   # Tutor chat + AI Tools
│   ├── auth/                 # Auth modal + user menu
│   ├── dashboard/            # Progress dashboard with charts
│   ├── home/                 # Landing page
│   ├── learn/                # Grammar, vocab flashcards, strategies
│   ├── practice/             # Test list, test engine, results
│   ├── site/                 # Navbar, footer, theme, language toggle
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── ai.ts                 # AI provider adapter (6 providers)
│   ├── auth/                 # NextAuth config + hooks
│   ├── db.ts                 # Prisma client
│   ├── router.tsx            # Client-side view router
│   ├── score.ts              # TOEIC score estimation
│   └── use-language.tsx      # AI reply language context
└── types/next-auth.d.ts      # NextAuth type augmentation

prisma/schema.prisma           # 7 models: User, Learner, Vocab, GrammarLesson, Strategy, Question, TestSet, TestAttempt
scripts/seed.ts                # Seed TOEIC content
```

## 📝 License

MIT — free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

## ⚠️ Disclaimer

This is an educational project, not affiliated with ETS (the official TOEIC organization). The score estimation is an approximation for practice only.
