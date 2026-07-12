# 🎓 TOEIC Ace AI — Smart English Test Prep with AI

![TOEIC Ace AI](https://img.shields.io/badge/TOEIC-Ace%20AI-emerald) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-blue) ![License](https://img.shields.io/badge/License-MIT-green)

Nền tảng học TOEIC Listening & Reading đầy đủ tính năng, tích hợp AI đa nhà cung cấp (Ollama local / ZAI Cloud / OpenAI / Groq / Gemini). Xây dựng bằng Next.js 16 + TypeScript + Prisma/SQLite + Tailwind CSS + shadcn/ui.

> **Tài khoản admin mặc định:** `admin@toeic.com` / `admin123` (chạy `bun run scripts/seed-admin.ts` để tạo lại nếu cần)

---

## 📑 Mục lục

1. [Tính năng chi tiết](#-tính-năng-chi-tiết)
2. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Luồng sự kiện các chức năng](#-luồng-sự-kiện-các-chức-năng)
5. [Cài đặt & chạy trên VS Code](#-cài-đặt--chạy-trên-vs-code)
6. [Cấu hình AI Provider](#-cấu-hình-ai-provider)
7. [Tài khoản & vai trò](#-tài-khoản--vai-trò)
8. [API endpoints](#-api-endpoints)
9. [Database schema](#-database-schema)
10. [Scripts tiện ích](#-scripts-tiện-ích)
11. [Troubleshooting](#-troubleshooting)

---

## ✨ Tính năng chi tiết

### 1. 🏠 Trang chủ (`Home`)
- Hero section + CTA "Get Started" / "Explore Lessons"
- Giới thiệu 7 Parts của TOEIC (Part 1-4 Listening, Part 5-7 Reading)
- Tổng quan các tính năng AI
- Footer sticky (luôn ở đáy, không nổi lên trên nội dung)
- Hỗ trợ Dark/Light mode (`next-themes`)

### 2. 📚 Learning Center
#### a) Grammar (Ngữ pháp)
- **10 bài học tiếng Việt**: Tenses, Conditionals, Passive Voice, Articles, Prepositions, Gerunds, Relative Clauses, Comparatives, Modals, Conjunctions
- Mỗi bài: tiêu đề, tóm tắt, nội dung Markdown, ví dụ minh hoạ, **TTS đọc ví dụ**
- **200 bài tập trắc nghiệm** đi kèm (mỗi bài ~20 câu)
- Hiển thị đáp án đúng + giải thích sau khi nộp

#### b) Vocabulary (Từ vựng)
- **742 từ vựng** theo CEFR A0–C2 (A0, A1, A2, B1, B2, C1, C2)
- Lọc theo level, tìm kiếm theo từ
- **Flashcard** với hiệu ứng lật 3D
- **Spaced Repetition (Lặp lại ngắt quãng)**: từ khó xuất hiện lại sau 1 ngày, 3 ngày, 7 ngày (lưu trong `localStorage`)
- Phát âm **TTS** cho mỗi từ
- Hiển thị: word, phonetic (IPA), part of speech, definition, example, translation (tiếng Việt)

#### c) Pronunciation (Phát âm)
- **44 âm IPA** (24 consonants + 20 vowels)
- Mỗi âm: ký hiệu IPA, ví dụ từ, mô tả khẩu hình, audio mẫu
- **Ghi âm giọng người dùng** (MediaRecorder API)
- **AI phân tích phát âm** qua API `/api/pronunciation/analyze`

#### d) Strategies (Chiến thuật)
- 6 bài chiến thuật thi TOEIC theo từng Part
- Mẹo làm bài, quản lý thời gian, tránh bẫy

### 3. ✍️ Practice Tests (Luyện thi)
#### a) Đề Reading đầy đủ (100 câu, 75 phút)
- **3 đề**: TEST 1 RC, TEST 2 RC, TEST 3 RC (300 câu tổng)
- Phân bổ: Part 5 (30 câu) + Part 6 (16 câu) + Part 7 (54 câu)
- Giải thích chi tiết bằng **tiếng Việt** cho mỗi câu
- Dữ liệu trích từ PDF thật bằng **AI Vision (glm-4.6v)**

#### b) Đề Listening đầy đủ (100 câu, 45 phút)
- **1 đề**: TEST 1 LC với **audio MP3 thật**
- Phân bổ: Part 1 (6 câu) + Part 2 (25 câu) + Part 3 (39 câu) + Part 4 (30 câu)
- Part 1 có `imagePrompt` (mô tả ảnh)
- Tự động phát audio, có thể replay (ngoài Exam Mode)

#### c) Exam Mode (Chế độ thi thật)
- Không hiện transcript, không replay audio
- Timer nghiêm ngặt — hết giờ tự động nộp
- Giả lập điều kiện phòng thi thật

#### d) Đề ETS TOEIC (từ Google Drive)
- Modal hiển thị link đề ETS thật từ Google Drive

#### e) 8 bộ đề luyện tập nhỏ
- Part 2 (Listening), Part 5/6/7 (Reading), Full mock 40 câu, v.v.

### 4. 🤖 AI Features (6 tính năng, auto-detect provider)
| # | Tính năng | API Endpoint | Mô tả |
|---|---|---|---|
| 1 | **AI Tutor Chat** | `/api/ai/chat` | Chatbot TOEIC 24/7, hỗ trợ Việt/Anh/Song ngữ |
| 2 | **AI Answer Explainer** | `/api/ai/explain` | Giải thích chi tiết tại sao đáp án đúng/sai |
| 3 | **AI Question Generator** | `/api/ai/generate-question` | Sinh câu hỏi TOEIC mới theo Part/độ khó |
| 4 | **AI Writing & Grammar Checker** | `/api/ai/writing-check` | Sửa lỗi ngữ pháp + gợi ý viết lại |
| 5 | **AI Study Plan Generator** | `/api/ai/study-plan` | Lập kế hoạch học tuần theo trình độ + mục tiêu |
| 6 | **AI Pronunciation Analysis** | `/api/pronunciation/analyze` | Phân tích phát âm từ audio ghi âm |

**Auto-detect provider**: Code tự gọi `GET http://localhost:11434/api/tags` để probe Ollama. Nếu có `qwen2.5:3b` → dùng Ollama local. Nếu không → fallback ZAI Cloud.

### 5. 🔐 Authentication
- **NextAuth.js v4** với Credentials Provider (email + password)
- **bcrypt** hash password (salt rounds = 10)
- JWT session (30 ngày)
- Register / Login / Logout qua modal
- Auth gate cho các tính năng cần đăng nhập

### 6. 🛡️ Admin Panel
- **Dashboard**: thống kê (người dùng, từ vựng, bài grammar, câu hỏi, bộ đề, lượt thi)
- **Quản lý Từ vựng**: CRUD (thêm/sửa/xoá) + lọc theo level + tìm kiếm
- **Quản lý Ngữ pháp**: CRUD bài học
- **Quản lý Người dùng**: đổi role, **khoá/mở khoá tài khoản**, xoá tài khoản
  - Cột "Trạng thái": 🟢 Hoạt động / 🔴 Đã khoá
  - Nút khoá/mở khoá với confirm dialog
  - Tài khoản bị khoá không thể đăng nhập (toast tiếng Việt rõ ràng)
  - Safety guard: không thể khoá/xoá tài khoản ADMIN
- Sidebar riêng (ẩn navbar chính), nút "Xem trang web" để quay lại

### 7. 📊 Dashboard người dùng
- Biểu đồ **score history** (Recharts) — điểm thi theo thời gian
- **Skill breakdown** (Listening vs Reading)
- Lịch sử các lần thi gần đây
- Chỉ truy cập được khi đã đăng nhập

---

## 🛠️ Công nghệ sử dụng

### Core Framework
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Next.js** | 16.x (App Router, Turbopack) | Framework React fullstack |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling utility-first |
| **shadcn/ui** | New York style | Component library (dựa trên Radix UI) |

### Database & ORM
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Prisma** | 6.x | ORM |
| **SQLite** | (qua better-sqlite3) | Database (file `db/custom.db`) |

### Authentication
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **NextAuth.js** | 4.24.x | Auth (Credentials + JWT) |
| **bcryptjs** | 3.x | Password hashing |

### AI Providers
| Công nghệ | Mục đích |
|---|---|
| **z-ai-web-dev-sdk** | ZAI Cloud (sandbox, fallback) |
| **ollama** (qua OpenAI SDK) | Local AI — `qwen2.5:3b` (auto-detect) |
| **openai** SDK | OpenAI-compatible client (cho Ollama/Groq/Gemini/OpenRouter) |

### State & Data Fetching
| Công nghệ | Mục đích |
|---|---|
| **Zustand** | Client state (UI state) |
| **TanStack Query** | Server state (data fetching + caching) |

### UI/UX Libraries
| Công nghệ | Mục đích |
|---|---|
| **lucide-react** | Icons |
| **recharts** | Charts (dashboard) |
| **next-themes** | Dark/Light mode |
| **framer-motion** | Animations |
| **@dnd-kit** | Drag & drop (flashcards) |
| **@mdxeditor/editor** | Markdown editor (grammar lessons) |

### Dev Tools
| Công nghệ | Mục đích |
|---|---|
| **Bun** | Runtime + package manager |
| **ESLint** | Code linting |
| **Prisma Studio** | DB GUI (`bunx prisma studio`) |

---

## 📁 Cấu trúc dự án

```
toeic-ace-ai/
├── prisma/
│   └── schema.prisma              # Prisma schema (9 models)
├── public/
│   └── audio/
│       └── test_01_listening.mp3  # Audio MP3 thật cho đề Listening
├── scripts/                       # Scripts seed dữ liệu
│   ├── seed.ts                    # Seed chính (vocab, grammar, strategies, test sets)
│   ├── seed-admin.ts              # Tạo tài khoản admin (admin@toeic.com/admin123)
│   ├── seed-rc-test1.ts           # Đề Reading Test 1 (100 câu)
│   ├── seed-rc-test2.ts           # Đề Reading Test 2 (100 câu)
│   ├── seed-rc-test3.ts           # Đề Reading Test 3 (100 câu)
│   ├── seed-lc-test1.ts           # Đề Listening Test 1 (100 câu + audio)
│   ├── seed-exercises.ts          # Bài tập grammar
│   ├── seed-vocab-levels.ts       # Vocab theo CEFR level
│   ├── seed-image-test.ts         # Test image question
│   ├── mysql-setup.sql            # Script SQL cho MySQL
│   └── fix-lc-placeholders.js     # Fix placeholder câu Listening
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # 26 API routes
│   │   │   ├── admin/             # Admin CRUD (users, vocab, grammar, stats)
│   │   │   ├── ai/                # AI endpoints (chat, explain, generate, writing, study-plan, provider)
│   │   │   ├── attempts/          # Lưu/kèm kết quả thi
│   │   │   ├── auth/              # NextAuth + register + check-status
│   │   │   ├── content/           # Grammar, vocab, strategies
│   │   │   ├── pronunciation/     # AI phân tích phát âm
│   │   │   └── tests/             # Test sets + questions
│   │   ├── globals.css            # Tailwind global styles
│   │   ├── layout.tsx             # Root layout (SessionProvider, ThemeProvider)
│   │   └── page.tsx               # Single-page app (router internal)
│   ├── components/
│   │   ├── admin/                 # Admin panel + shell
│   │   ├── ai/                    # Tutor view + Tools view
│   │   ├── auth/                  # Auth modal, guard, user menu
│   │   ├── dashboard/             # User dashboard (charts)
│   │   ├── home/                  # Trang chủ
│   │   ├── learn/                 # Grammar, vocab flashcards, strategies
│   │   ├── practice/              # Test engine, results, ETS modal
│   │   ├── pronunciation/         # IPA + ghi âm
│   │   ├── site/                  # Navbar, footer, language toggle
│   │   └── ui/                    # shadcn/ui components (40+ components)
│   ├── data/                      # Static data (IPA, etc.)
│   ├── hooks/                     # Custom hooks (use-toast, etc.)
│   ├── lib/
│   │   ├── ai.ts                  # AI provider adapter (auto-detect Ollama)
│   │   ├── auth/                  # NextAuth config + hooks
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── router.tsx             # Internal router (single-page app)
│   │   ├── score.ts               # Tính điểm TOEIC (10-990)
│   │   ├── use-language.tsx       # Language context (vi/en/bi)
│   │   └── utils.ts               # Utilities (cn, etc.)
│   └── types/                     # TypeScript types
├── db/
│   └── custom.db                  # SQLite database file
├── .env                           # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── eslint.config.mjs
└── README.md
```

---

## 🔄 Luồng sự kiện các chức năng

### 1. Luồng Đăng ký / Đăng nhập

```
┌─────────────┐     POST /api/auth/register      ┌──────────────┐
│  User mở    │ ─────────────────────────────────>│ bcrypt hash  │
│  Auth Modal │                                    │ pwd (10 rnd) │
└─────────────┘                                    └──────┬───────┘
       │                                                   │
       │     POST /api/auth/check-status (pre-check)       │
       │ ──────────────────────────────────────────────────>
       │     ← { exists: bool, locked: bool }              │
       │                                                   ▼
       │     nếu locked → toast "Tài khoản đã bị khoá"  ┌─────────┐
       │     nếu ok    → signIn('credentials')           │  User   │
       │ ──────────────────────────────────────────────> │ created │
       │                                                   └─────────┘
       │     ← JWT session cookie
       ▼
   Dashboard
```

**Chi tiết:**
1. User nhập email + password → bấm Sign In
2. Client gọi `POST /api/auth/check-status` với `{ email }` — kiểm tra tài khoản có bị khoá không
3. Nếu `locked: true` → hiện toast đỏ "Tài khoản đã bị khoá", dừng
4. Nếu không → gọi `signIn('credentials', { email, password, redirect: false })` của NextAuth
5. NextAuth gọi `authorize()` trong `auth-options.ts`:
   - Tìm user trong DB theo email
   - Nếu `user.locked === true` → throw error
   - So sánh `bcrypt.compare(password, user.passwordHash)`
   - Trả về user object (gồm `role`)
6. JWT token được tạo (chứa `id`, `email`, `name`, `role`) → set cookie `next-auth.session-token`
7. Client nhận session → UI cập nhật (User menu hiện ra, nút Admin hiện nếu role=ADMIN)

---

### 2. Luồng Luyện thi TOEIC (Test Engine)

```
User chọn đề
    │
    ▼
GET /api/tests/{id}  →  trả TestSet + Questions
    │
    ▼
Hiển thị test engine:
  - Timer đếm ngược (durationMin)
  - Question palette (chuyển câu)
  - Part 1: hiển thị ảnh + phát audio
  - Part 2-4: phát audio, không hiện transcript
  - Part 5-7: hiện passage + câu hỏi + 4 options
    │
    │  User chọn đáp án (click radio)
    │  → lưu vào state `answers: Record<qId, number>`
    │
    ▼
User bấm "Nộp bài" HOẶC hết giờ
    │
    ▼
POST /api/attempts  với:
  {
    testSetId, type, durationSec, answers,
    totalQuestions, correctCount,
    listeningCorrect, readingCorrect
  }
    │
    ▼
Server tính điểm:
  - score = 10 + (correctCount / total) * 980
  - listeningScore, readingScore (riêng biệt)
  - Lưu TestAttempt vào DB (gắn với Learner)
    │
    ▼
GET /api/attempts/{attemptId}  →  trả kết quả chi tiết
    │
    ▼
Hiển thị TestResults:
  - Điểm tổng (10-990)
  - Listening vs Reading breakdown
  - Bảng câu hỏi + đáp án user chọn + đáp án đúng
  - Nút "Giải thích AI" cho mỗi câu → POST /api/ai/explain
```

---

### 3. Luồng AI Tutor Chat

```
User mở AI Tutor
    │
    ▼
GET /api/ai/provider  →  probe Ollama
    │
    │  ┌─────────────────────────────────────┐
    │  │ detectProvider():                   │
    │  │   1. fetch localhost:11434/api/tags │
    │  │      (timeout 3s, cache 30s)        │
    │  │   2. Nếu có qwen2.5:3b → 'ollama'   │
    │  │   3. Nếu không → 'zai' (fallback)   │
    │  └─────────────────────────────────────┘
    │
    ▼
Hiển thị badge:
  🦙 Ollama (Local AI) · ✅ Sẵn sàng
  HOẶC
  🤖 ZAI Cloud (fallback)
    │
    │  User gõ câu hỏi → bấm Send
    │
    ▼
POST /api/ai/chat  với:
  {
    language: 'vi' | 'en' | 'bi',
    messages: [{ role, content }, ...]
  }
    │
    ▼
Server build messages:
  [SYSTEM_PROMPTS.tutor(lang), ...userMessages]
    │
    ▼
aiChat(messages):
  - Nếu provider = 'ollama':
      OpenAI SDK → POST localhost:11434/v1/chat/completions
      { model: 'qwen2.5:3b', temperature: 0.5, max_tokens: 1024 }
  - Nếu provider = 'zai':
      ZAI SDK → zai.chat.completions.create(...)
    │
    ▼
Trả về { reply: "..." }
    │
    ▼
UI thêm tin nhắn assistant vào chat
```

---

### 4. Luồng Khoá / Mở khoá tài khoản (Admin)

```
Admin đăng nhập (role=ADMIN)
    │
    ▼
Vào Admin Panel → tab "Người dùng"
    │
    ▼
GET /api/admin/users  →  trả danh sách user (excludes ADMIN)
    │
    │  Hiển thị bảng:
    │  | Tên | Email | Role | Trạng thái | Ngày DK | Thao tác |
    │  |------|-------|------|------------|---------|----------|
    │  | An   | a@x   | STUDENT | 🟢 Hoạt động | ... | 🔒 🗑️ |
    │
    │  Admin click nút 🔒 (Khoá)
    │
    ▼
Confirm dialog: "Bạn có chắc muốn khoá tài khoản 'a@x'?"
    │
    │  Admin bấm OK
    │
    ▼
PUT /api/admin/users  với:
  { id: 'user_xxx', locked: true }
    │
    ▼
Server check:
  - Session có role=ADMIN không? (nếu không → 403)
  - Target user có phải ADMIN không? (nếu có → 400, reject)
  - Update User.locked = true
    │
    ▼
UI refresh → row hiển thị:
  | An (đã khoá) | a@x | STUDENT | 🔴 Đã khoá | ... | 🔓 🗑️ |
  (opacity-60)
    │
    ▼
Khi user "a@x" cố đăng nhập:
  - Pre-check /api/auth/check-status → { locked: true }
  - Toast: "Tài khoản đã bị khoá — Vui lòng liên hệ hỗ trợ"
  - Không gọi NextAuth callback
    │
    ▼
Admin mở khoá (click 🔓):
  - PUT /api/admin/users { id, locked: false }
  - User có thể đăng nhập lại bình thường
```

---

### 5. Luồng Vocabulary Flashcard + Spaced Repetition

```
User chọn level (vd: A2)
    │
    ▼
GET /api/content/vocab?level=A2  →  trả danh sách từ
    │
    ▼
Hiển thị flashcard đầu tiên:
  - Mặt trước: word + phonetic + TTS 🔊
  - Click lật → mặt sau: definition + example + translation
    │
    │  User tự đánh giá:
    │   - "Biết" → tăng interval (1d → 3d → 7d → 14d → 30d)
    │   - "Chưa biết" → reset về 1d
    │
    ▼
Lưu vào localStorage: {
  [word]: { interval, nextReview, lastReview }
}
    │
    ▼
Lần sau mở app → filter từ có nextReview <= now
→ hiển thị trước để ôn tập
```

---

### 6. Luồng AI Pronunciation Analysis

```
User chọn âm IPA (vd: /θ/)
    │
    ▼
Phát audio mẫu (TTS hoặc file)
    │
    │  User bấm "Ghi âm" → MediaRecorder API
    │  (ghi 3-5 giây)
    │
    ▼
Stop → tạo Blob audio/webm
    │
    ▼
Convert → base64
    │
    ▼
POST /api/pronunciation/analyze  với:
  {
    targetIpa: 'θ',
    audio: 'data:audio/webm;base64,...'
  }
    │
    ▼
Server gọi ZAI Vision API (glm-4.6v):
  "Phân tích audio này, so sánh với âm /θ/..."
    │
    ▼
Trả về: {
  score: 0-100,
  feedback: "Bạn phát âm gần đúng, nhưng...",
  tips: ["Đặt lưỡi giữa răng...", ...]
}
    │
    ▼
UI hiển thị điểm + feedback + tips
```

---

## 🚀 Cài đặt & chạy trên VS Code

### Yêu cầu hệ thống
- **Node.js** 18+ (khuyến nghị 20+)
- **Bun** (runtime + package manager) — [cài tại đây](https://bun.sh)
- **VS Code** với các extension:
  - ESLint
  - Tailwind CSS IntelliSense
  - Prisma
  - TypeScript Vue Plugin (Volar) — không bắt buộc nhưng helpful

### Bước 1: Clone repo

```bash
git clone https://github.com/vinhdong123/toeic-ace-ai.git
cd toeic-ace-ai
```

### Bước 2: Cài đặt dependencies

```bash
# Cài Bun nếu chưa có (Linux/macOS)
curl -fsSL https://bun.sh/install | bash

# Cài dependencies
bun install
```

### Bước 3: Cấu hình environment

Tạo file `.env` ở thư mục gốc:

```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **NEXTAUTH_SECRET**: chạy `openssl rand -base64 32` để tạo chuỗi ngẫu nhiên.
> Nếu không set, code dùng default `'toeic-ace-ai-dev-secret-change-in-production'` (chỉ dùng dev).

### Bước 4: Khởi tạo database

```bash
# Tạo database + tables từ schema
bun run db:push

# (tuỳ chọn) Mở Prisma Studio để xem DB
bunx prisma studio
# → http://localhost:5555
```

### Bước 5: Seed dữ liệu

```bash
# Seed chính: vocab, grammar, strategies, test sets
bun run scripts/seed.ts

# Seed tài khoản admin (admin@toeic.com / admin123)
bun run scripts/seed-admin.ts

# Seed 3 đề Reading (mỗi đề 100 câu)
bun run scripts/seed-rc-test1.ts
bun run scripts/seed-rc-test2.ts
bun run scripts/seed-rc-test3.ts

# Seed 1 đề Listening (100 câu + audio)
bun run scripts/seed-lc-test1.ts

# Seed bài tập grammar
bun run scripts/seed-exercises.ts

# Seed vocab theo CEFR level (742 từ)
bun run scripts/seed-vocab-levels.ts
```

### Bước 6: (Tuỳ chọn) Cài đặt Ollama + qwen2.5:3b

```bash
# Cài Ollama: https://ollama.com/download
# Sau khi cài, chạy:
ollama serve              # khởi động server (chạy nền)
ollama pull qwen2.5:3b    # tải model (~2GB)
# Verify:
ollama list               # phải thấy qwen2.5:3b
```

> App **tự nhận diện** Ollama — không cần cấu hình `.env` gì thêm.
> Nếu Ollama không chạy → tự fallback sang ZAI Cloud.

### Bước 7: Chạy dev server

```bash
bun run dev
```

Mở browser: **http://localhost:3000**

### Bước 8: (Tuỳ chọn) Build production

```bash
bun run build
bun run start
```

### Các lệnh thường dùng

| Lệnh | Mô tả |
|---|---|
| `bun run dev` | Chạy dev server (port 3000, Turbopack) |
| `bun run lint` | Kiểm tra ESLint |
| `bun run build` | Build production |
| `bun run db:push` | Push schema → DB (tạo/sửa tables) |
| `bun run db:generate` | Generate Prisma Client |
| `bun run db:migrate` | Tạo migration |
| `bun run db:reset` | Reset DB (XOÁ toàn bộ data) |
| `bunx prisma studio` | Mở DB GUI tại :5555 |
| `bun run scripts/seed-admin.ts` | Tạo/reset tài khoản admin |

---

## 🤖 Cấu hình AI Provider

App **tự nhận diện** provider theo thứ tự:

```
1. Probe Ollama (localhost:11434/api/tags)
   → Nếu có qwen2.5:3b → DÙNG OLLAMA LOCAL (free, offline)
2. Nếu Ollama không chạy → FALLBACK ZAI CLOUD (sandbox)
```

### Override (tuỳ chọn)

Nếu muốn dùng model khác hoặc Ollama ở máy khác, thêm vào `.env`:

```env
# Ollama (mặc định: qwen2.5:3b @ localhost:11434)
OLLAMA_MODEL=qwen2.5:7b           # đổi model
OLLAMA_BASE_URL=http://192.168.1.100:11434/v1  # Ollama ở máy khác
```

### So sánh providers

| Provider | Cost | Tốc độ | Privacy | Setup |
|---|---|---|---|---|
| 🦙 Ollama + qwen2.5:3b | Free | Chậm (CPU) | 100% local | Cài Ollama + pull model |
| 🤖 ZAI Cloud (fallback) | Free (sandbox) | Nhanh | Cloud | Không cần gì |

---

## 👤 Tài khoản & vai trò

### Roles
| Role | Quyền |
|---|---|
| `STUDENT` | Học, làm bài thi, xem dashboard cá nhân |
| `INSTRUCTOR` | (dự phòng) Giống STUDENT + có thể xem thống kê lớp |
| `ADMIN` | Toàn quyền: admin panel, CRUD users/vocab/grammar, khoá/mở khoá tài khoản |

### Tài khoản mặc định
| Email | Password | Role |
|---|---|---|
| `admin@toeic.com` | `admin123` | ADMIN |

Tạo lại bất cứ lúc nào:
```bash
bun run scripts/seed-admin.ts
```

---

## 📡 API endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/check-status` | Pre-check tài khoản có bị khoá không |
| GET | `/api/auth/providers` | Danh sách auth providers (NextAuth) |
| GET | `/api/auth/session` | Lấy session hiện tại |
| POST | `/api/auth/callback/credentials` | Login callback (NextAuth) |
| POST | `/api/auth/signout` | Logout |

### AI (`/api/ai`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/ai/provider` | Thông tin provider hiện tại + health check |
| POST | `/api/ai/chat` | AI Tutor chat |
| POST | `/api/ai/explain` | Giải thích đáp án |
| POST | `/api/ai/generate-question` | Sinh câu hỏi TOEIC |
| POST | `/api/ai/writing-check` | Sửa lỗi viết |
| POST | `/api/ai/study-plan` | Lập kế hoạch học |

### Content (`/api/content`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/content/grammar` | Danh sách bài grammar |
| GET | `/api/content/grammar/[slug]` | Chi tiết bài grammar |
| GET | `/api/content/grammar/[slug]/exercises` | Bài tập của bài grammar |
| GET | `/api/content/vocab?level=A1` | Vocab theo level |
| GET | `/api/content/vocab/counts` | Số lượng vocab mỗi level |
| GET | `/api/content/strategies` | Danh sách chiến thuật |

### Tests (`/api/tests`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/tests` | Danh sách bộ đề |
| GET | `/api/tests/[id]` | Chi tiết bộ đề + câu hỏi |

### Attempts (`/api/attempts`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/attempts` | Lưu kết quả thi |
| GET | `/api/attempts/[id]` | Chi tiết lần thi |
| GET | `/api/attempts/by-learner/[learnerId]` | Lịch sử thi của learner |

### Admin (`/api/admin`) — yêu cầu role=ADMIN
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê tổng |
| GET | `/api/admin/users` | Danh sách user |
| PUT | `/api/admin/users` | Đổi role / khoá-mở khoá user |
| DELETE | `/api/admin/users?id=xxx` | Xoá user |
| GET | `/api/admin/vocab?q=xxx&level=A1` | Danh sách vocab + tìm kiếm |
| POST | `/api/admin/vocab` | Thêm vocab |
| PUT | `/api/admin/vocab` | Sửa vocab |
| DELETE | `/api/admin/vocab?id=xxx` | Xoá vocab |
| GET | `/api/admin/grammar` | Danh sách grammar |
| POST | `/api/admin/grammar` | Thêm grammar |
| PUT | `/api/admin/grammar` | Sửa grammar |
| DELETE | `/api/admin/grammar?id=xxx` | Xoá grammar |

### Pronunciation (`/api/pronunciation`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/pronunciation/analyze` | AI phân tích phát âm (audio base64) |

---

## 🗄️ Database schema

File: `prisma/schema.prisma` — 9 models:

| Model | Mô tả | Trường chính |
|---|---|---|
| **User** | Tài khoản người dùng | id, email, name, passwordHash, role, locked, image |
| **Learner** | Hồ sơ học viên (1-1 với User) | id, name, targetScore, userId |
| **Vocab** | Từ vựng | word, phonetic, partOfSpeech, definition, example, translation, level (A0-C2), category |
| **GrammarLesson** | Bài grammar | title, slug, category, level, summary, content (Markdown), example |
| **GrammarExercise** | Bài tập grammar | lessonId, question, options (JSON), answer, explanation |
| **Strategy** | Chiến thuật thi | title, slug, section, content |
| **Question** | Câu hỏi TOEIC | part (1-7), passage, groupId, audioScript, imagePrompt, question, options (JSON), answer, explanation |
| **TestSet** | Bộ đề | title, description, durationMin, type, questionIds (JSON) |
| **TestAttempt** | Lần thi | learnerId, testSetId, startedAt, finishedAt, durationSec, answers (JSON), correctCount, score, listeningScore, readingScore |

---

## 📜 Scripts tiện ích

| Script | Mô tả |
|---|---|
| `bun run scripts/seed.ts` | Seed dữ liệu chính (vocab, grammar, strategies) |
| `bun run scripts/seed-admin.ts` | Tạo/reset tài khoản admin |
| `bun run scripts/seed-rc-test1.ts` | Đề Reading Test 1 (100 câu) |
| `bun run scripts/seed-rc-test2.ts` | Đề Reading Test 2 (100 câu) |
| `bun run scripts/seed-rc-test3.ts` | Đề Reading Test 3 (100 câu) |
| `bun run scripts/seed-lc-test1.ts` | Đề Listening Test 1 (100 câu + audio) |
| `bun run scripts/seed-exercises.ts` | Bài tập grammar (200 câu) |
| `bun run scripts/seed-vocab-levels.ts` | Vocab theo CEFR (742 từ) |
| `bun run scripts/seed-image-test.ts` | Test câu hỏi có ảnh |

---

## 🐛 Troubleshooting

### Lỗi: "Cannot connect to Ollama"
```
Không kết nối được với Ollama. Hãy chạy `ollama serve` và `ollama pull qwen2.5:3b` rồi thử lại.
```
**Fix**: Mở terminal khác, chạy:
```bash
ollama serve
ollama pull qwen2.5:3b
```
App sẽ tự fallback sang ZAI Cloud nếu Ollama không chạy.

### Lỗi: "Prisma Client did not find `locked` field"
**Fix**: Regenerate Prisma Client:
```bash
bun run db:generate
# hoặc
bunx prisma generate
```

### Lỗi: Đăng nhập admin không được
**Fix**: Chạy lại seed-admin:
```bash
bun run scripts/seed-admin.ts
```
Tài khoản: `admin@toeic.com` / `admin123`

### Lỗi: Database bị reset
Sau khi reset DB, chạy lại tất cả seeds theo thứ tự:
```bash
bun run scripts/seed.ts
bun run scripts/seed-admin.ts
bun run scripts/seed-rc-test1.ts
bun run scripts/seed-rc-test2.ts
bun run scripts/seed-rc-test3.ts
bun run scripts/seed-lc-test1.ts
bun run scripts/seed-exercises.ts
bun run scripts/seed-vocab-levels.ts
```

### Lỗi: Dev server crash trên memory thấp
Tăng Node heap:
```bash
NODE_OPTIONS="--max-old-space-size=2560" bun run dev
```

### Lỗi: `localhost:3000` không truy cập được (IPv6)
Dùng `127.0.0.1` thay vì `localhost`:
```bash
curl http://127.0.0.1:3000/
```

---

## 📄 License

MIT License — tự do sử dụng cho mục đích học tập và thương mại.

## 👥 Đóng góp

Dự án được phát triển cho mục đích học TOEIC. Mọi đóng góp đều welcome!

---

**🎓 TOEIC Ace AI** — Học TOEIC thông minh với AI, miễn phí, offline-ready.
