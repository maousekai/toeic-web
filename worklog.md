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

---
Task ID: 2
Agent: main (Z.ai Code)
Task: Add user registration & login functionality with beautiful UI and good scalability.

Work Log:
- Installed bcryptjs + @types/bcryptjs for password hashing.
- Updated Prisma schema: added `User` model (email unique, passwordHash, name, image) + added `userId` optional FK on `Learner` to link accounts.
- Ran `bun run db:push` and `bunx prisma generate` to sync schema.
- Created NextAuth.js config at `src/lib/auth/auth-options.ts` with CredentialsProvider + JWT session strategy (30-day expiry). Passwords verified via `bcrypt.compare`. Throws descriptive errors for missing account / wrong password.
- Added `src/types/next-auth.d.ts` to extend Session/JWT types with `user.id`.
- Created `src/app/api/auth/[...nextauth]/route.ts` (NextAuth handler, GET+POST).
- Created `src/app/api/auth/register/route.ts` with full validation (name ≥ 2 chars, email regex, password ≥ 6 chars), duplicate-email check (409), bcrypt hash (salt 10), creates User + linked Learner row.
- Built `src/lib/auth/session-provider.tsx` (wraps next-auth SessionProvider).
- Built `src/lib/auth/use-auth.ts` (`useAuth` hook exposing user/isLoading/isAuthenticated/login/logout).
- Built `src/lib/auth/auth-ui-context.tsx` (AuthUIProvider) — global modal state so any component can call `openAuth('login'|'register', onSuccess)`.
- Built `src/components/auth/auth-modal.tsx` — beautiful dialog with gradient header, tabs Sign In / Create Account, inline validation, password show/hide, password-strength meter (4 bars, weak/fair/good/strong), auto-login after register, feature bullets.
- Built `src/components/auth/user-menu.tsx` — avatar with initials fallback + dropdown (Dashboard, AI Tutor, Sign Out) when authenticated; "Sign In" + "Get Started" buttons when not.
- Updated `src/app/layout.tsx` to wrap app in SessionProvider.
- Updated `src/app/page.tsx` to wrap app in AuthUIProvider.
- Updated `src/components/site/navbar.tsx` — replaced "Start Practice" CTA with UserMenu; UserMenu also renders in mobile hamburger menu.
- Updated `src/lib/router.tsx` `getLearnerId(userId?)` — deterministic `learner_<userId>` when authenticated (attempts follow account across devices), falls back to localStorage anonymous id otherwise.
- Updated `src/components/practice/test-engine.tsx` — uses `user.id` from useAuth when submitting attempts.
- Updated `src/components/practice/practice-list.tsx` — `startTest()` opens auth modal (with onSuccess callback → navigate to test) if not logged in; otherwise navigates directly.
- Updated `src/components/dashboard/dashboard-view.tsx` — auth gate card ("Sign in to view your dashboard") when not authenticated; refetches attempts when user changes.
- Updated `src/components/home/home-view.tsx` — primary CTA shows "Get Started — It's Free" (opens register) when logged out, "Start a Free Practice Test" when logged in; subtitle adapts to auth state.
- Fixed lint: removed `useMemo` in useAuth (react-hooks/preserve-manual-memoization rule).
- Restarted dev server to pick up regenerated Prisma client (global Prisma cache was holding pre-User-model instance).
- Verified end-to-end with Agent Browser: register new account → auto-login → user menu shows name+email → logout → login with credentials → start practice test (no auth gate) → submit → dashboard shows the attempt linked to the user (`learner_<userId>`). Mobile hamburger menu shows auth buttons. Zero console/runtime errors. Lint passes clean.

Stage Summary:
- Production-grade auth layered on top of the existing TOEIC platform.
- Stack: NextAuth.js v4 (JWT strategy) + bcryptjs (salt 10) + Prisma User model + SQLite.
- UI: modal-based (login + register in one dialog with tabs) because sandbox only exposes the `/` route. Gradient header, password strength meter, show/hide password, inline validation, auto-login after register.
- Scalability: deterministic `learner_<userId>` id means attempts follow the user across devices/browsers; JWT sessions work serverless/edge; existing anonymous localStorage behavior preserved as fallback so the site still works for guests.
- Auth-gated features: Practice tests and Dashboard prompt login via the modal (with onSuccess callback). Home + Learn + AI Tutor + AI Tools remain open to guests.
- All API routes for auth: `/api/auth/[...nextauth]` (NextAuth handler), `/api/auth/register` (custom register), `/api/auth/session` (NextAuth session check).

---
Task ID: 4
Agent: main (Z.ai Code)
Task: Add multi-provider AI adapter (Ollama/OpenAI/OpenRouter/Groq/Gemini) while keeping ZAI as default.

Work Log:
- Installed `openai` SDK (OpenAI-compatible — works with Ollama, Groq, OpenRouter, Gemini too).
- Refactored `src/lib/ai.ts` into adapter pattern with priority: OLLAMA_BASE_URL → OPENAI_API_KEY → OPENROUTER_API_KEY → GROQ_API_KEY → GEMINI_API_KEY → ZAI (fallback).
- Each provider has sensible default model (e.g. `qwen2.5:7b` for Ollama, `gpt-4o-mini` for OpenAI, `gemini-1.5-flash` for Gemini, `llama-3.3-70b-versatile` for Groq, `qwen/qwen-2.5-7b-instruct:free` for OpenRouter). All overridable via env vars.
- Used dynamic `import('openai')` so SDK is only loaded when a non-ZAI provider is active — keeps ZAI path lightweight.
- Added `/api/ai/provider` GET endpoint returning current provider info (name, model, isLocal).
- Updated `TutorView` to fetch + display a provider badge (e.g. "🤖 ZAI Cloud" or "🦙 Ollama (Local AI) · 100% offline") under the header.
- Fixed lint: converted `require()` to `await import()` for `@typescript-eslint/no-require-imports`.
- Verified with Agent Browser: badge shows "🤖 ZAI Cloud", AI Tutor still answers in Vietnamese via ZAI endpoint (POST /api/ai/chat 200 in 11.7s). No regressions.

Stage Summary:
- ZAI remains the default provider (no env vars set in sandbox → falls back to ZAI).
- Project is now deploy-ready: on Vercel/local, user just sets ONE env var (e.g. `OLLAMA_BASE_URL` or `GEMINI_API_KEY`) and the app switches AI provider automatically — no code changes needed.
- Ollama support means users can run the entire app 100% offline with a local AI model (qwen2.5:7b recommended for Vietnamese TOEIC tutoring).

---
Task ID: 5
Agent: main (Z.ai Code)
Task: Add "Exam Mode" — TOEIC exam simulation that mimics real test conditions.

Work Log:
- Added new test set `ts_exam_simulation` to seed.ts: 61 questions (all current), 120 minutes, type='exam'.
- Updated `src/lib/router.tsx`: View `test` now accepts optional `mode?: 'practice' | 'exam'`.
- Updated `src/app/page.tsx`: pass `mode` prop to `<TestEngine>`.
- Rewrote `src/components/practice/practice-list.tsx`:
  - Split into 2 sections: "🎯 Chế độ Thi Thật" (exam, top, highlighted) + "📚 Chế độ Luyện Tập" (practice, bottom).
  - Exam cards have rose color theme, nội quy box (no transcript, no replay, strict timer, auto-submit).
  - Click "Vào phòng thi" → opens AlertDialog nội quy with full rules + recommendations → confirm → navigate to exam mode.
  - Practice cards unchanged (button "Start" → practice mode).
- Rewrote `src/components/practice/test-engine.tsx` to support both modes:
  - **Exam mode banner**: rose gradient banner "🎯 CHẾ ĐỘ THI THẬT — EXAM MODE" with rules summary.
  - **Listening (exam)**: shows "Audio đang phát 1 lần duy nhất" — NO Replay button, NO transcript details.
  - **Listening (practice)**: keeps Replay button + Show transcript (unchanged).
  - **Palette (exam)**: hides answered state (only highlights current question) — "Ẩn trạng thái đã trả lời để mô phỏng thi thật".
  - **Palette (practice)**: shows answered/unanswered colors (unchanged).
  - **Top bar (exam)**: hides answered count, shows "Câu X/Y · Hết giờ tự động nộp".
  - **Timer (exam)**: amber at ≤5min, red+pulse at ≤1min.
  - **5-minute warning**: toast notification at 300s remaining.
  - **Submit dialog (exam)**: Vietnamese, red destructive button, "không thể làm lại" warning.
  - **Auto-submit**: when timeLeft === 0, auto-submits with Vietnamese toast.
- Re-seeded database (was empty after previous schema changes) — restored 32 vocab, 10 grammar, 6 strategies, 61 questions, 7 test sets (was 6, now +1 exam).
- Verified with Agent Browser: exam mode shows banner, no replay, no transcript, palette hides answered, 61 questions, 120 min timer. Lint passes, zero console errors.

Stage Summary:
- New "Thi Thật" feature complete and verified end-to-end.
- 2 distinct modes: Practice (loose, learning-oriented) vs Exam (strict, simulation).
- Exam mode mimics real TOEIC: no transcript, no audio replay, strict timer, auto-submit, 5-min warning, hidden answered state.
- UI in Vietnamese for exam mode (nội quy, nộp bài, hết giờ) to match target audience.
- Database restored with all content after re-seed.

---
Task ID: 6
Agent: main (Z.ai Code)
Task: Add ETS TOEIC exam section to Practice page — integrate real ETS exam files from Google Drive.

Work Log:
- Analyzed uploaded screenshot: showed Google Drive folder "ĐỀ ETS 2024" with 4 files (AUDIO, ĐÁP ÁN + TRANSCRIPT, ETS 2024 - LISTENING, ETS 2024 - READING).
- Created `public/ets-exams/2024/` folder for users to upload ETS exam files (PDFs + audio).
- Created `src/data/ets-exams.ts` — config file defining ETS exam resources (id, year, title, description, driveUrl, file paths, durationMin, difficulty). Includes example for 2024 + commented template for adding more years.
- Built `src/components/practice/ets-exam-modal.tsx`:
  - Modal with gradient header showing exam title + year + duration + difficulty.
  - Auto-detects if files exist in public/ (HEAD request) → if missing, shows warning + 2 options: open Google Drive / admin upload.
  - Custom audio player (play/pause, seek bar, time display) for listening audio.
  - Tabs: Listening / Reading / Đáp án — each renders PDF in iframe viewer.
  - Download buttons for each file.
  - "Mở Google Drive" external link button.
- Updated `src/components/practice/practice-list.tsx`:
  - Added new section "📚 Đề ETS TOEIC (từ Google Drive)" between Exam Mode and Practice Mode.
  - Amber/orange themed cards for ETS exams.
  - Each card shows: title, year badge, duration, difficulty, resource chips (Listening/Reading/Audio/Đáp án), "Xem đề" button + Drive link button.
  - Click "Xem đề" → opens EtsExamModal.
- Created `public/ets-exams/README.md` — detailed Vietnamese guide for adding new ETS exam sets (folder structure, file naming, config update, restart).
- Fixed lint: moved `checkFile` function outside component (react-hooks/immutability rule).
- Verified with Agent Browser: ETS section appears in Practice page, "Đế ETS TOEIC 2024" card visible, clicking "Xem đề" opens modal with warning (since files not yet uploaded), Google Drive link works, tabs disabled appropriately. Zero console errors. Lint passes.

Stage Summary:
- New "Đề ETS TOEIC" feature complete — users can view real ETS exam PDFs + listen to audio + download answers directly on the web.
- Architecture: PDFs and audio stored in `public/ets-exams/<year>/`, config in `src/data/ets-exams.ts`, UI auto-adapts (warning when files missing, full viewer when present).
- Vietnamese UI for target audience (hướng dẫn, nút "Xem đề", "Mở Google Drive", etc.).
- README.md in public/ets-exams/ provides clear guide for team members to add more ETS exam sets.
- Default config has 1 exam (ETS 2024) with placeholder Google Drive URL — admin needs to replace with real folder ID and/or upload actual files.

---
Task ID: 7
Agent: main (Z.ai Code)
Task: Refactor ETS exam structure to support multiple tests per ETS set (ETS 2024 has 10 tests).

Work Log:
- Analyzed 2nd uploaded screenshot: folder "ETS 2024 - LISTENING" contains 11 PDFs (PART 3 - TEST 1 + TEST 1 LC through TEST 10 LC) — meaning each ETS year has 10 separate tests, each with its own Listening/Reading/Audio/Transcript files.
- Refactored `src/data/ets-exams.ts`:
  - Added new `EtsTest` type with `id`, `label`, `files` (listening/reading/audio/transcript).
  - Updated `EtsResource` to have `tests: EtsTest[]` array instead of single `files` object.
  - Added `testFiles(year, testNum)` helper function for generating standardized file paths.
  - Configured ETS 2024 with 10 tests (Test 1 → Test 10), each pointing to `/ets-exams/2024/test-N/`.
- Created 10 folders: `public/ets-exams/2024/test-1/` through `test-10/` for users to upload files.
- Rewrote `src/components/practice/ets-exam-modal.tsx`:
  - Added Test selector (Select dropdown) at top of modal — shows "Chọn Test (10 tests có sẵn)".
  - File status check now re-runs when selected test changes.
  - Audio player + PDF tabs + download buttons all reflect the selected test.
  - Warning message shows correct test number (e.g., "File Test 5 chưa được upload vào web") and correct folder path (`public/ets-exams/2024/test-5/`).
  - PDF viewer titles include test label (e.g., "Đề Listening Test 5 - ETS 2024").
- Updated `src/components/practice/practice-list.tsx`:
  - ETS cards now show "10 tests" badge.
  - Added test list preview (Test 1, Test 2, ... +4) showing first 6 tests + overflow count.
- Updated `public/ets-exams/README.md` with new folder structure documentation:
  - `public/ets-exams/<year>/test-N/` for each test.
  - Step-by-step guide: download from Drive (TEST 1 LC.pdf → listening.pdf, etc.) → copy to test folder → update config.
- Verified with Agent Browser: card shows "10 tests", modal opens with Test selector dropdown (all 10 tests visible), switching to Test 5 updates warning message + PDF titles correctly. Zero console errors. Lint passes.

Stage Summary:
- ETS exam feature now supports multiple tests per ETS set (10 tests for ETS 2024).
- Architecture: `public/ets-exams/<year>/test-N/{listening,reading,audio,transcript}` + config in `ets-exams.ts`.
- UI: dropdown selector in modal + test preview badges on card.
- Auto-detection: file existence checked per-test, warning shows correct test number + folder path.
- Ready for user to upload 40 files (4 files × 10 tests) to fully populate ETS 2024.

---
Task ID: 8
Agent: main (Z.ai Code)
Task: Rewrite all 10 grammar lessons in Vietnamese with detailed structure: explanation, signal words, examples, TOEIC tips.

Work Log:
- Rewrote all 10 grammar lessons in scripts/seed.ts with consistent 5-section Vietnamese structure:
  1. 📖 Khái niệm — Vietnamese explanation of when/why to use
  2. 📝 Cấu trúc & Công thức — Formulas + conjugation tables
  3. 🔍 Dấu hiệu nhận biết — Signal words (e.g., "ago" → past simple, "since" → present perfect)
  4. 💡 Ví dụ cụ thể — Tables with English sentence + Vietnamese translation
  5. 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp — Common traps + TOEIC Part 5 strategies
- Lessons covered:
  1. Present Simple vs. Present Continuous (Thì hiện tại đơn & tiếp diễn)
  2. Present Perfect & Past Simple (Hiện tại hoàn thành & quá khứ đơn)
  3. Conditionals (Câu điều kiện loại 0, 1, 2)
  4. The Passive Voice (Câu bị động)
  5. Articles (Mạo từ a/an/the)
  6. Prepositions of Time & Place (Giới từ thời gian & địa điểm)
  7. Gerunds vs. Infinitives (Danh động từ vs động từ nguyên mẫu)
  8. Relative Clauses (Mệnh đề quan hệ)
  9. Comparatives & Superlatives (So sánh hơn & nhất)
  10. Modal Verbs (Động từ khuyết thiếu)
- Each lesson includes:
  - Vietnamese title with English original in parentheses
  - Detailed Vietnamese explanation
  - Signal words with Vietnamese translations
  - 5-7 example sentences in table format with Vietnamese translations
  - 3-4 common TOEIC traps (⚠️) with correct/incorrect examples
  - Specific TOEIC Part 5 strategy (🎯)
- Re-seeded database (10 grammar lessons updated).
- Fixed Chinese characters that slipped in during editing (chỉ xuất hiện, có thể xảy ra).
- Verified with Agent Browser: lesson list shows Vietnamese titles, lesson detail page displays all 5 sections correctly with proper Vietnamese formatting. Zero console errors. Lint passes.

Stage Summary:
- All 10 grammar lessons now in Vietnamese with consistent, comprehensive structure.
- Each lesson has: Khái niệm, Cấu trúc, Dấu hiệu nhận biết, Ví dụ cụ thể (with translations), Mẹo TOEIC + Bẫy.
- Signal words highlighted with Vietnamese translations (e.g., "since + mốc thời gian", "for + khoảng thời gian").
- TOEIC-specific tips and traps included for each topic (e.g., "ago" never goes with present perfect, "must not" ≠ "don't have to").
- Database updated, ready for use.

---
Task ID: 9
Agent: main (Z.ai Code)
Task: Add 20 interactive grammar exercises per lesson (200 total) with detailed Vietnamese explanations.

Work Log:
- Added `GrammarExercise` model to Prisma schema (id, lessonId, question, options JSON, answer, explanation, order).
- Ran `bun run db:push` to sync schema.
- Created `scripts/seed-exercises.ts` with 200 exercises (10 lessons × 20 questions each):
  1. Present Simple vs. Present Continuous — 20 questions
  2. Present Perfect & Past Simple — 20 questions
  3. Conditionals — 20 questions
  4. Passive Voice — 20 questions
  5. Articles — 20 questions
  6. Prepositions — 20 questions
  7. Gerunds vs. Infinitives — 20 questions
  8. Relative Clauses — 20 questions
  9. Comparatives & Superlatives — 20 questions
  10. Modal Verbs — 20 questions
  Each exercise has: question, 4 options, correct answer, detailed Vietnamese explanation (e.g., "Dấu hiệu 'every day' → hiện tại đơn. Chủ ngữ 'The store' số ít → thêm 's': opens.").
- Created API `/api/content/grammar/[slug]/exercises` — GET returns all exercises for a lesson, sorted by order.
- Built `src/components/learn/grammar-exercise.tsx` — interactive exercise component with 2 phases:
  - **Doing phase**: One question at a time, progress bar at top (clickable to jump), 4 option buttons, "Câu trước/Câu tiếp" navigation, "Nộp bài" on last question, submit confirmation dialog.
  - **Submitted phase**: Score card (% + correct count + message), full review of all 20 questions with correct/incorrect/unanswered badges, color-coded options (green=correct, red=wrong), detailed explanation per question, "Làm lại" button.
- Updated `src/components/learn/grammar-detail.tsx` — added "Bài tập thực hành" section at bottom of each grammar lesson page.
- Restarted dev server to pick up regenerated Prisma client (GrammarExercise model).
- Verified with Agent Browser: opened Present Simple lesson → exercise section visible → answered 2 questions → navigated to Q20 → submitted → results showed "2/20 câu đúng · 10%" → all 20 questions reviewed with explanations → "Làm lại" button works. Zero console errors. Lint passes.

Stage Summary:
- 200 grammar exercises added across 10 lessons (20 per lesson).
- Interactive UI: one-question-at-a-time flow with progress bar, submit dialog, score display, full review with explanations.
- All explanations in Vietnamese, tied to signal words and TOEIC tips from the lesson content.
- Database: GrammarExercise table populated, API endpoint live, component integrated into grammar detail page.

---
Task ID: 10
Agent: main (Z.ai Code)
Task: Redesign grammar detail page CSS for better readability — less cluttered, better spacing, color accents.

Work Log:
- Analyzed user's screenshot of grammar detail page — identified problems: dense text, no spacing between sections, long formula lines, no color highlights, hard to scan.
- Rewrote `.prose-toeic` CSS in globals.css with major improvements:
  - **Font size**: 0.95rem → 1rem (larger, easier to read)
  - **Line height**: 1.7 → 1.85 (more breathing room)
  - **H2 (section titles like "Khái niệm", "Cấu trúc")**: Added dashed top border + larger margin (1.75rem) to clearly separate sections. First h2 has no border.
  - **H3 (subsections)**: Now uses primary color for visual hierarchy
  - **Bullet lists**: Custom bullet points (small primary-colored dots) instead of default disc, more padding between items (0.5rem margin)
  - **Ordered lists**: Better spacing for numbered examples
  - **Em (Italian/Vietnamese translations)**: Muted color + smaller font (0.92em) + italic — clearly distinguishes Vietnamese translations from English content
  - **Inline code (formulas like "S + am/is/are + V-ing")**: Now has border + background + monospace font — stands out as a formula
  - **Block code**: Styled pre blocks with border + background
  - **Blockquote (callouts)**: Left border + tinted background (color-mix) + rounded corners — looks like a callout box
  - **Tables**: Header with primary background + primary-foreground text, striped rows (even rows tinted), hover effect, horizontal scroll on mobile, rounded corners
  - **HR**: Dashed line separator
  - **Links**: Primary color + underline offset
- Updated grammar-detail.tsx layout:
  - Header card with subtle gradient (primary/8 → teal/5 → transparent)
  - "Tất cả bài ngữ pháp" back button (Vietnamese)
  - Title + summary in header card with badges (category + level)
  - Content card with max-w-3xl centered + larger padding (p-6 sm:p-8) for readability
  - Example section renamed "Ví dụ minh họa" (Vietnamese)
  - Exercise section: now wrapped in highlighted container with border-2 primary/30 + gradient background + larger icon (12x12 with shadow) to make it stand out
- Verified with VLM analysis: redesign significantly improved readability, clear section separation, good color accents (green table header, callout boxes), clear formulas/tables/bullets. Minor tweaks: increased font size 0.95→1rem, made exercise section more prominent.
- Lint passes. Zero console errors.

Stage Summary:
- Grammar detail page now much more readable:
  - Clear visual hierarchy with dashed section separators
  - Vietnamese translations visually distinguished (muted italic)
  - Formulas highlighted as code blocks with border + background
  - Tables with colored headers + striped rows
  - Callout boxes for tips/traps
  - Exercise section prominently highlighted with gradient + border
- All grammar content (10 lessons) automatically benefits from new styling since they all use the same Markdown component.

---
Task ID: 11
Agent: main (Z.ai Code)
Task: Restructure Vocabulary into 7 CEFR levels (A0-C2) with ~100 words each.

Work Log:
- Updated Prisma schema: added `level String @default("A1")` field to Vocab model (CEFR: A0/A1/A2/B1/B2/C1/C2).
- Ran `bun run db:push` to sync schema.
- Created `scripts/seed-vocab-levels.ts` with ~700 vocabulary words across 7 CEFR levels:
  - **A0 (104 từ)** — Pre-Beginner: số, màu, ngày, gia đình, đồ vật cơ bản, động từ thường (one, red, mother, eat, go...)
  - **A1 (102 từ)** — Beginner: giao tiếp cơ bản, đời sống hàng ngày (family, teacher, lunch, buy, sell...)
  - **A2 (105 từ)** — Elementary: du lịch, mua sắm, giao tiếp xã hội (airport, ticket, hotel, weather, season...)
  - **B1 (107 từ)** — Intermediate (TOEIC 400-600): business English cơ bản (meeting, deadline, colleague, manager, report...)
  - **B2 (109 từ)** — Upper-Intermediate (TOEIC 600-750): business nâng cao (negotiate, contract, revenue, strategy, feasible...)
  - **C1 (106 từ)** — Advanced (TOEIC 750-900): business/academic nâng cao (consolidate, lucrative, pragmatic, scrutinize, implement...)
  - **C2 (109 từ)** — Mastery (TOEIC 900+): từ vựng chuyên sâu, trang trọng (acquiesce, cogent, ephemeral, meticulous, ubiquitous...)
  Each word has: word, phonetic, partOfSpeech, definition (Vietnamese), example (English), translation (Vietnamese), category, level, difficulty.
- Created API `/api/content/vocab/counts` — returns count per level for UI display.
- Updated `/api/content/vocab` — added `level` query param for filtering.
- Rewrote `src/components/learn/vocab-flashcards.tsx` with beautiful new design:
  - **Level selector**: 7 cards (A0-C2) in responsive grid, each showing level code + word count + Vietnamese name. Active level highlighted with gradient.
  - **Selected level info card**: shows level code (gradient text), Vietnamese name, English name, description (e.g., "TOEIC 600-750 · Đàm phán, tài chính"), word count, mastered count.
  - **Progress bar**: shows current position (Câu X/Y) + percentage.
  - **Flip card**: larger (h-80), cleaner design, level badge on front, definition + translation + example on back.
  - **Spaced repetition**: "Chưa thuộc" / "Đã thuộc" buttons, box system (0-5), stored in localStorage.
  - **TTS pronunciation**: for both word and example sentence.
  - **Color-coded levels**: each CEFR level has its own color (slate→emerald→teal→cyan→amber→orange→rose).
- Verified with Agent Browser: all 7 levels visible (A0-C2 with correct counts), clicking B2 loads B2 vocab ("able" — có khả năng), flip card works, progress bar shows, no errors.
- Lint passes. Zero console errors.

Stage Summary:
- Vocabulary feature completely restructured into 7 CEFR levels with ~100 words each (742 total).
- Each level color-coded and described with TOEIC score range (B1=400-600, B2=600-750, C1=750-900, C2=900+).
- Beautiful UI with level selector cards, progress tracking, spaced repetition.
- All vocab has Vietnamese definitions + translations + English examples + phonetics.
- Old 32 vocabs replaced with 742 new vocabs organized by proficiency level.
