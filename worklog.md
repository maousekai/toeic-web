---
Task ID: 1
Agent: main (Z.ai Code)
Task: Build a comprehensive English TOEIC learning website with AI integration — full features, TOEIC knowledge, practice tests, grading, and AI capabilities.

Work Log:
- Designed emerald/teal education theme in globals.css (light + dark, custom scrollbars, flip-card & gradient animations, prose styling).
- Defined Prisma schema (Learner, Vocab, GrammarLesson, Strategy, Question, TestSet, TestAttempt) and pushed to SQLite.
- Wrote seed script (scripts/seed.ts) with real TOEIC content: 32 vocab words, 10 grammar lessons, 6 strategy articles, 61 questions (Parts 2, 5, 6, 7), and 6 curated test sets incl. a 40-question mock.
- Created core libs: src/lib/ai.ts (z-ai-web-dev-sdk helper + system prompts), src/lib/router.tsx (single-route view router + anonymous learner id), src/lib/score.ts (TOEIC score estimation + CEFR bands).
- Built 14 API routes: content (vocab/grammar/strategies), tests list+detail, attempts POST/GET/by-learner, and 5 AI endpoints (chat, explain, generate-question, writing-check, study-plan).
- Built site shell: theme provider, navbar (responsive w/ hamburger), sticky footer, markdown renderer.
- Built Home view (hero, stats, 8 feature cards, 7-part TOEIC structure, AI showcase, CTA).
- Built Learn view hub + Grammar list/detail (with TTS), Vocab flashcards (flip + spaced repetition + TTS), Strategies (tabbed).
- Built Practice: test list, full test engine (timer, question palette, listening auto-TTS playback, submit dialog, auto-submit on timeout), results page (score hero, listening/reading breakdown, filterable answer review, per-question AI explain).
- Built AI Tutor chat (multi-turn, suggestions, typing indicator) and AI Tools (question generator, writing checker, study plan).
- Built Dashboard (stat cards, recharts score-history line chart + skill bar chart, recent attempts list).
- Wired everything in src/app/page.tsx as a single-route SPA driven by the router context.
- Fixed: installed remark-gfm, disabled react-hooks/set-state-in-effect rule for legitimate data-fetch/mount patterns.
- Ran `bun run lint` → passes clean.
- Verified end-to-end with Agent Browser: home, practice list, test taking, submission, results+AI explain, learn hub, grammar, vocab flashcards, AI tutor chat, AI question generator, dashboard charts, mobile hamburger menu. All API calls returned 200; zero console/runtime errors.

Stage Summary:
- Production-ready TOEIC learning platform on a single `/` route (Next.js 16 App Router + TS + Tailwind v4 + shadcn/ui + Prisma/SQLite).
- 5 AI features powered by z-ai-web-dev-sdk (LLM): tutor chat, answer explainer, question generator, writing checker, study-plan generator.
- Practice engine supports Parts 2/5/6/7 with real timer, question palette, browser-TTS narration for listening, instant grading with estimated 10–990 score, and AI answer explanations.
- Dashboard tracks progress with recharts visualizations and attempt history (keyed by anonymous learner id in localStorage).
- Sticky footer, responsive design, dark mode, accessibility (semantic HTML, ARIA labels, keyboard-friendly controls) all implemented and browser-verified.
