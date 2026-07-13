# 🎓 TOEIC Ace AI — Smart English Test Prep with AI

![TOEIC Ace AI](https://img.shields.io/badge/TOEIC-Ace%20AI-emerald) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-6-blue) ![License](https://img.shields.io/badge/License-MIT-green)

Nền tảng học TOEIC Listening & Reading **đầy đủ tính năng**, tích hợp AI đa nhà cung cấp (Ollama local / ZAI Cloud), wallet + VIP system, real-time chat + video call 1-1 với giáo viên (giống MS Teams).

> **Tài khoản admin mặc định:** `admin@toeic.com` / `admin123` (chạy `bun run scripts/seed-admin.ts` để tạo lại)
> **Tài khoản giáo viên mẫu:** `sarah.teacher@toeic.com` / `teacher123`

---

## 📑 Mục lục

1. [Tính năng chi tiết](#-tính-năng-chi-tiết)
2. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Cơ sở dữ liệu — ER Diagram](#-cơ-sở-dữ-liệu--er-diagram)
5. [Mối quan hệ các bảng](#-mối-quan-hệ-các-bảng)
6. [Luồng sự kiện các chức năng](#-luồng-sự-kiện-các-chức-năng)
7. [Cài đặt & chạy trên VS Code](#-cài-đặt--chạy-trên-vs-code)
8. [API endpoints](#-api-endpoints)
9. [Tài khoản & vai trò](#-tài-khoản--vai-trò)
10. [Scripts tiện ích](#-scripts-tiện-ích)
11. [Troubleshooting](#-troubleshooting)

---

## ✨ Tính năng chi tiết

### 1. 🏠 Trang chủ (Home)
- Hero section với ảnh người thật + floating cards (tutor portrait + student photo + score badge)
- Trust indicators (4 avatar + 5 sao + "1,000+ learners")
- Stats: 7 parts, 742+ vocab, 10–990 score range, 6 AI tools
- Features grid (8 cards)
- TOEIC structure (7 parts)
- AI Tutor showcase (real woman tutor portrait + chat bubble + "Online now" badge)
- Testimonials (4 học viên thật: Linh, Minh, Mai, Tuan — với avatar + score badge)
- Listening showcase banner (ảnh người đeo headphones)
- CTA banner

### 2. 📚 Learning Center
#### a) Grammar (Ngữ pháp)
- **10 bài học tiếng Việt**: Tenses, Conditionals, Passive Voice, Articles, Prepositions, Gerunds, Relative Clauses, Comparatives, Modals, Conjunctions
- Mỗi bài: tiêu đề, tóm tắt, nội dung Markdown, ví dụ, TTS đọc ví dụ
- **200 bài tập trắc nghiệm** đi kèm (mỗi bài ~20 câu)

#### b) Vocabulary (Từ vựng)
- **742 từ vựng** theo CEFR A0–C2
- **Flashcard** với hiệu ứng lật 3D + TTS
- **Spaced Repetition** (lưu trong localStorage)
- Lọc theo level, tìm kiếm

#### c) Pronunciation (Phát âm)
- **44 âm IPA** (24 consonants + 20 vowels)
- Ghi âm giọng người dùng (MediaRecorder API)
- **AI phân tích phát âm** qua VLM

#### d) Strategies (Chiến thuật)
- 6 bài chiến thuật thi TOEIC theo từng Part

### 3. ✍️ Practice Tests (Luyện thi)
#### 🔒 Đề VIP (cần gói VIP)
- **1 đề Listening đầy đủ** (100 câu, 45 phút) + audio MP3 thật
- **3 đề Reading đầy đủ** (100 câu/đề, 75 phút) — Part 5 (30) + Part 6 (16) + Part 7 (54)
- Giải thích chi tiết tiếng Việt cho mỗi câu

#### 🆓 Đề FREE (không cần VIP)
- 8 bộ đề luyện tập nhỏ: Part 2 Listening, Part 5, Part 6, Part 7, Full mock 40 câu, v.v.

#### 🎯 Exam Mode
- Không hiện transcript, không replay audio
- Timer nghiêm ngặt — hết giờ tự động nộp

#### 📂 Đề ETS TOEIC
- Modal hiển thị link đề ETS thật từ Google Drive

### 4. 🤖 AI Features (6 tính năng, auto-detect provider)
| # | Tính năng | API | Giới hạn |
|---|---|---|---|
| 1 | **AI Tutor Chat** | `/api/ai/chat` | Free: 10 câu, VIP: ∞ + upload ảnh |
| 2 | **AI Answer Explainer** | `/api/ai/explain` | Theo đề thi |
| 3 | **AI Question Generator** | `/api/ai/generate-question` | Free |
| 4 | **AI Writing & Grammar Checker** | `/api/ai/writing-check` | Free |
| 5 | **AI Study Plan Generator** | `/api/ai/study-plan` | Free |
| 6 | **AI Pronunciation Analysis** | `/api/pronunciation/analyze` | Free |

**Auto-detect provider**: Code tự probe Ollama (`localhost:11434`). Có `qwen2.5:3b` → dùng local. Không → fallback ZAI Cloud.

### 5. 🔐 Authentication
- **NextAuth.js v4** + Credentials Provider
- **bcrypt** hash password (10 rounds)
- JWT session (30 ngày)
- Lock/unlock accounts (admin)
- Pre-check `/api/auth/check-status` (check locked trước khi login)

### 6. 💰 Wallet + 👑 VIP System
#### Wallet
- Nạp tiền (6 mức: 50k, 100k, 200k, 500k, 1M, 2M — mock payment)
- Số dư + lịch sử giao dịch
- Admin có thể tặng tiền cho user

#### VIP Packages (3 gói)
| Gói | Giá | Thời hạn | Popular? |
|---|---|---|---|
| VIP Tháng | 199,000₫ | 30 ngày | |
| VIP Quý | 499,000₫ | 90 ngày | ⭐ |
| VIP Năm | 1,499,000₫ | 365 ngày | |

**VIP quyền:**
- Đề đầy đủ (Listening + 3 Reading) ✅
- Chat + video call với giáo viên ✅
- AI Tutor không giới hạn + upload ảnh ✅
- Flashcards không giới hạn ✅

### 7. 👨‍🏫 Teachers + Real-time Chat + Video Call
#### Teachers list
- 4 giáo viên mẫu (Sarah, David, Linh, James)
- Card: avatar, rating, hourly rate, online status, subjects, bio
- 2 buttons: Chat (tạo phòng chat) + Call (tạo class session)

#### 💬 Real-time Chat (Socket.io)
- Chat real-time qua socket.io mini-service (port 3003)
- Typing indicator (3 dots animation)
- Optimistic UI (tin nhắn hiện ngay)
- **Gửi ảnh** qua chat (Paperclip button, max 4MB, preview + click to zoom)
- Auto-scroll, message bubbles
- VIP gate (học sinh cần VIP, giáo viên free)

#### 📹 Video Call (WebRTC P2P)
- `getUserMedia` (camera + mic)
- `RTCPeerConnection` + Google STUN servers
- Full signaling: offer/answer/ICE via socket.io
- Teacher = caller, Student = callee
- Controls: mute mic, toggle camera, end call
- Room code (6 chars) + copy button
- "Waiting for teacher/student" overlay

### 8. 🎓 Teacher Dashboard (giao diện riêng cho giáo viên)
- **4 tabs**: Tổng quan, Học sinh, Lớp học, Doanh thu
- Profile header: avatar + online pulse + rating + totalLessons
- 4 stat cards: Học sinh, Phòng chat, Lớp học, Doanh thu ước tính
- Recent chats (click → mở chat room)
- Upcoming classes (click → join video call)
- Students tab: danh sách + message count + Chat button
- Classes tab: "Mở lớp mới cho học sinh" + danh sách lớp WAITING/ACTIVE
- Earnings tab: summary + monthly stats (3 months) + recent completed classes
- Edit profile modal (bio, subjects, hourlyRate, isOnline)
- **Giáo viên không thấy:** Ví, VIP, Teachers list, Practice (đề VIP)

### 9. 🛡️ Admin Panel (7 tabs)
| Tab | Chức năng |
|---|---|
| 📊 Dashboard | 10 stat cards (users, teachers, VIP active, total topup, VIP revenue, vocab, grammar, questions, test sets, attempts) |
| 👥 Học viên | List (excludes ADMIN+TEACHER) + **detail modal** (wallet, VIP, payments, chat rooms, classes, test attempts, stats) + CRUD (sửa tên/email, đặt lại mật khẩu, khoá/mở khoá, đổi role, tặng tiền, reset AI counter, xoá) |
| 👨‍🏫 Giáo viên | List + edit (bio, subjects, rate, rating) + toggle online + delete (demote) |
| 👑 Gói VIP | CRUD packages (add/edit/delete) |
| 💰 Giao dịch | All transactions + filter + summary |
| 📚 Từ vựng | CRUD vocab |
| 📖 Ngữ pháp | CRUD grammar lessons |

### 10. 📊 Dashboard người dùng
- Biểu đồ score history (Recharts)
- Skill breakdown (Listening vs Reading)
- Lịch sử các lần thi

---

## 🛠️ Công nghệ sử dụng

### Core Framework
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Next.js** | 16.x (App Router, Turbopack) | Framework React fullstack |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Styling utility-first |
| **shadcn/ui** | New York style | Component library (Radix UI) |

### Database & ORM
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **Prisma** | 6.x | ORM |
| **SQLite** | (better-sqlite3) | Database (`prisma/db/custom.db`) |

### Authentication & Security
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **NextAuth.js** | 4.24.x | Auth (Credentials + JWT) |
| **bcryptjs** | 3.x | Password hashing |

### AI Providers
| Công nghệ | Mục đích |
|---|---|
| **z-ai-web-dev-sdk** | ZAI Cloud (sandbox, fallback) + VLM (ảnh) |
| **Ollama** (qua OpenAI SDK) | Local AI — `qwen2.5:3b` (auto-detect) |
| **openai** SDK | OpenAI-compatible client |

### Real-time & WebRTC
| Công nghệ | Mục đích |
|---|---|
| **Socket.io** | Real-time chat + WebRTC signaling |
| **WebRTC** | P2P video call (browser native) |

### State & Data Fetching
| Công nghệ | Mục đích |
|---|---|
| **Zustand** | Client state |
| **TanStack Query** | Server state |
| **Framer Motion** | Animations |

### UI/UX Libraries
| Công nghệ | Mục đích |
|---|---|
| **lucide-react** | Icons |
| **recharts** | Charts (dashboard) |
| **next-themes** | Dark/Light mode |
| **@dnd-kit** | Drag & drop (flashcards) |
| **next/image** | Optimized images |

### Dev Tools
| Công nghệ | Mục đích |
|---|---|
| **Bun** | Runtime + package manager |
| **ESLint** | Code linting |
| **tsx** | TypeScript runner (mini-service) |

---

## 📁 Cấu trúc dự án

```
toeic-ace-ai-max/
├── prisma/
│   ├── schema.prisma              # 17 models (User, Teacher, Wallet, VIP, Chat, Class, ...)
│   └── db/
│       └── custom.db              # SQLite database (12MB — đã seed sẵn)
├── public/
│   ├── audio/
│   │   └── test_01_listening.mp3  # Audio MP3 thật cho đề Listening
│   └── images/
│       ├── home/                  # 13 ảnh (hero, tutor, testimonials, listening, ...)
│       ├── learn/                 # 4 ảnh (grammar, vocab, pronunciation, strategies)
│       ├── practice/              # 2 ảnh (reading, exam)
│       └── ai/                    # 2 ảnh (writing, study-plan)
├── mini-services/
│   └── realtime-service/          # Socket.io service (port 3003)
│       ├── index.ts               # Chat + WebRTC signaling
│       └── package.json
├── scripts/                       # 10 seed scripts
│   ├── seed.ts                    # Vocab + grammar + strategies + test sets
│   ├── seed-admin.ts              # Tạo admin@toeic.com
│   ├── seed-vip-teachers.ts       # 3 VIP packages + 4 teachers
│   ├── seed-rc-test1.ts           # Đề Reading Test 1 (100 câu)
│   ├── seed-rc-test2.ts           # Đề Reading Test 2 (100 câu)
│   ├── seed-rc-test3.ts           # Đề Reading Test 3 (100 câu)
│   ├── seed-lc-test1.ts           # Đề Listening Test 1 (100 câu + audio)
│   ├── seed-exercises.ts          # 200 bài tập grammar
│   ├── seed-vocab-levels.ts       # 742 từ vựng CEFR
│   ├── seed-image-test.ts         # Test image question
│   └── mysql-setup.sql            # Script SQL cho MySQL
├── src/
│   ├── app/
│   │   ├── api/                   # 47 API routes
│   │   │   ├── admin/             # Admin CRUD (users, teachers, vip, payments, vocab, grammar, stats)
│   │   │   ├── ai/                # AI endpoints (chat, explain, generate, writing, study-plan, provider)
│   │   │   ├── attempts/          # Lưu/kèm kết quả thi
│   │   │   ├── auth/              # NextAuth + register + check-status
│   │   │   ├── chat/              # Chat rooms + messages
│   │   │   ├── class/             # Class sessions (create/join/active)
│   │   │   ├── content/           # Grammar, vocab, strategies
│   │   │   ├── pronunciation/     # AI phân tích phát âm
│   │   │   ├── teacher/           # Teacher dashboard + students + earnings
│   │   │   ├── teachers/          # Public teachers list
│   │   │   ├── tests/             # Test sets + questions
│   │   │   ├── vip/               # VIP packages + purchase + status
│   │   │   └── wallet/            # Wallet balance + topup + transactions
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Single-page app (router internal)
│   ├── components/                # 82 components
│   │   ├── admin/                 # Admin panel (7 tabs) + shell
│   │   ├── ai/                    # Tutor view + Tools view
│   │   ├── auth/                  # Auth modal, guard, user menu
│   │   ├── chat/                  # Real-time chat (socket.io + image upload)
│   │   ├── class-room/            # Video call (WebRTC)
│   │   ├── dashboard/             # User dashboard (charts)
│   │   ├── home/                  # Trang chủ
│   │   ├── learn/                 # Grammar, vocab, strategies, pronunciation
│   │   ├── practice/              # Test engine, results, ETS modal
│   │   ├── pronunciation/         # IPA + ghi âm
│   │   ├── site/                  # Navbar, footer, theme toggle
│   │   ├── teacher/               # Teacher dashboard (4 tabs)
│   │   ├── teachers/              # Teachers list
│   │   ├── ui/                    # shadcn/ui (40+ components)
│   │   ├── vip/                   # VIP membership page
│   │   └── wallet/                # Wallet page
│   ├── lib/
│   │   ├── ai.ts                  # AI adapter (auto-detect Ollama/ZAI)
│   │   ├── auth/                  # NextAuth config + hooks
│   │   ├── auth-helpers.ts        # getSessionUser, hasActiveVip, ensureWallet
│   │   ├── db.ts                  # Prisma client singleton
│   │   ├── router.tsx             # Internal router (single-page app)
│   │   ├── score.ts               # Tính điểm TOEIC (10-990)
│   │   ├── use-language.tsx       # Language context (vi/en/bi)
│   │   └── utils.ts               # Utilities (cn, etc.)
│   ├── data/                      # Static data (IPA, ETS exams)
│   ├── hooks/                     # Custom hooks
│   └── types/                     # TypeScript types
├── .env                           # Environment variables
├── package.json                   # 71 deps + 10 devDeps
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🗄️ Cơ sở dữ liệu — ER Diagram

Dự án dùng **Prisma ORM + SQLite** với **17 models**. Dưới đây là ER diagram dạng text:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    User     │       │   Learner   │       │   TestAttempt   │
├─────────────┤       ├─────────────┤       ├─────────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │   ┌──►│ id (PK)         │
│ email       │   │   │ userId (FK) │   │   │ learnerId (FK)  │
│ name        │   └───│ name        │   │   │ testSetId       │
│ passwordHash│       │ targetScore │   │   │ score           │
│ role        │       │ createdAt   │   │   │ listeningScore  │
│ locked      │       └─────────────┘   │   │ readingScore    │
│ aiMessageCnt│                         │   │ answers (JSON)  │
│ createdAt   │                         │   └─────────────────┘
└─────┬───────┘                         │
      │                                 │
      │ 1:1                             │
      ▼                                 │
┌─────────────┐       ┌─────────────┐  │
│   Wallet    │       │   Teacher   │  │
├─────────────┤       ├─────────────┤  │
│ id (PK)     │       │ id (PK)     │  │
│ userId (FK) │       │ userId (FK) │  │
│ balance     │       │ bio         │  │
└─────────────┘       │ subjects    │  │
                      │ hourlyRate  │  │
                      │ rating      │  │
                      │ isOnline    │  │
                      └─────────────┘  │

┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│ VipPackage  │       │ VipSubscription │       │ PaymentTxn  │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ id (PK)         │       │ id (PK)     │
│ name        │       │ userId (FK)     │──┐    │ userId (FK) │
│ price       │       │ packageId (FK)  │  │    │ amount      │
│ durationDays│       │ startedAt       │  ├───►│ type        │
│ features    │       │ expiresAt       │  │    │ status      │
│ popular     │       │ isActive        │  │    │ description │
└─────────────┘       └─────────────────┘  │    └─────────────┘
                                           │
                                           │ (User)
┌─────────────┐       ┌─────────────┐     │
│  ChatRoom   │       │  ChatMessage│     │
├─────────────┤       ├─────────────┤     │
│ id (PK)     │◄──────│ id (PK)     │     │
│ studentId   │──┐    │ roomId (FK) │     │
│ teacherId   │──┤    │ senderId    │──┬──┘
│ lastMsgAt   │  │    │ content     │  │
└─────────────┘  │    │ read        │  │
                 │    └─────────────┘  │
                 └─────► (User) ◄──────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ ClassSession│       │  Question   │       │   TestSet   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ teacherId   │──┐    │ part (1-7)  │       │ title       │
│ studentId   │──┤    │ passage     │       │ durationMin │
│ roomCode    │  │    │ audioScript │       │ type        │
│ status      │  │    │ question    │       │ questionIds │
│ startedAt   │  │    │ options     │       └─────────────┘
│ endedAt     │  │    │ answer      │
└─────────────┘  │    │ explanation │
                 │    └─────────────┘
                 └─────► (User)

┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│GrammarLesson│       │ GrammarExercise │       │  Strategy   │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ id (PK)         │       │ id (PK)     │
│ title       │       │ lessonId (FK)   │       │ title       │
│ slug        │       │ question        │       │ slug        │
│ category    │       │ options (JSON)  │       │ section     │
│ level       │       │ answer          │       │ content     │
│ content     │       │ explanation     │       └─────────────┘
│ example     │       └─────────────────┘
└─────────────┘

┌─────────────┐
│   Vocab     │
├─────────────┤
│ id (PK)     │
│ word        │
│ phonetic    │
│ partOfSpeech│
│ definition  │
│ example     │
│ translation │
│ level (CEFR)│
│ category    │
└─────────────┘
```

---

## 🔗 Mối quan hệ các bảng

### 1. User (Trung tâm) — 17 relations

```
User (1) ──── (0..1) Wallet           # Mỗi user có 1 ví (hoặc chưa có)
User (1) ──── (0..1) Teacher          # User có thể là giáo viên (1:1)
User (1) ──── (0..n) VipSubscription  # User có nhiều lần mua VIP
User (1) ──── (0..n) PaymentTxn       # User có nhiều giao dịch
User (1) ──── (0..n) Learner          # User có nhiều learner profiles
User (1) ──── (0..n) ChatMessage      # User gửi nhiều tin nhắn
User (1) ──── (0..n) ChatRoom         # User tham gia nhiều phòng chat (student hoặc teacher)
User (1) ──── (0..n) ClassSession     # User tham gia nhiều lớp học (teacher hoặc student)
```

### 2. Chat System

```
ChatRoom (1) ──── (2) User            # 1 phòng chat có 1 student + 1 teacher
  │
  └─ ChatRoom.studentId → User.id     # Foreign key (student)
  └─ ChatRoom.teacherId → User.id     # Foreign key (teacher)

ChatRoom (1) ──── (0..n) ChatMessage  # 1 phòng chat có nhiều tin nhắn
ChatMessage.senderId → User.id        # Foreign key (người gửi)
```

### 3. Class / Video Call System

```
ClassSession (1) ──── (2) User        # 1 lớp có 1 teacher + 1 student
  │
  └─ ClassSession.teacherId → User.id
  └─ ClassSession.studentId → User.id

ClassSession.status: WAITING → ACTIVE → ENDED
```

### 4. VIP System

```
VipPackage (1) ──── (0..n) VipSubscription  # 1 gói VIP có nhiều subscription
VipSubscription.userId → User.id            # User mua VIP
VipSubscription.packageId → VipPackage.id   # Thuộc gói nào

PaymentTransaction.userId → User.id         # Giao dịch của user
PaymentTransaction.type: TOPUP | VIP_PURCHASE
```

### 5. Test System

```
TestSet (1) ──── (0..n) Question     # 1 bộ đề chứa nhiều câu hỏi (qua questionIds JSON)
TestAttempt.learnerId → Learner.id   # Lượt thi của learner
Learner.userId → User.id             # Learner thuộc user

Question.part: 1-7 (Part 1-4 Listening, Part 5-7 Reading)
TestSet.type: mini | full | listening | exam | part5 | part6 | part7
```

### 6. Learning Content

```
GrammarLesson (1) ──── (0..n) GrammarExercise  # 1 bài grammar có nhiều bài tập
GrammarExercise.lessonId → GrammarLesson.id

Vocab (standalone)            # 742 từ vựng độc lập
Strategy (standalone)         # 6 chiến thuật độc lập
```

### 7. Role-based Access

```
User.role:
  ├── STUDENT     → học, làm thi, mua VIP, chat/call với teacher
  ├── INSTRUCTOR  → giống STUDENT (dự phòng)
  ├── TEACHER     → Teacher Dashboard, chat/call với student (không cần VIP)
  └── ADMIN       → Admin Panel (7 tabs), full CRUD
```

---

## 🔄 Luồng sự kiện các chức năng

### 1. Luồng Đăng ký / Đăng nhập

```
User mở Auth Modal
    │
    ▼
POST /api/auth/check-status { email }
    │
    ├─ locked: true → toast "Tài khoản đã bị khoá" → dừng
    │
    ▼
signIn('credentials', { email, password })
    │
    ▼
NextAuth authorize():
    ├─ Find user by email
    ├─ if user.locked → throw error
    ├─ bcrypt.compare(password, user.passwordHash)
    └─ return { id, email, name, role }
    │
    ▼
JWT token (30 ngày) → set cookie
    │
    ▼
UI: User menu hiện ra, Admin button (if ADMIN)
```

### 2. Luồng Nạp tiền + Mua VIP

```
User vào Ví → chọn 200,000₫ → click "Nạp 200.000₫"
    │
    ▼
POST /api/wallet/topup { amount: 200000, method: "MoMo" }
    │
    ▼
ensureWallet(user.id) → Wallet.upsert (tạo nếu chưa có)
    │
    ▼
$transaction:
    ├─ Wallet.balance += 200000
    └─ PaymentTransaction.create (type=TOPUP, status=SUCCESS)
    │
    ▼
Toast "✅ Nạp tiền thành công" + refresh balance

=== Mua VIP ===

User vào VIP Membership → click "Mua gói VIP Quý"
    │
    ▼
POST /api/vip/purchase { packageId: "pkg_vip_quý" }
    │
    ▼
Check wallet.balance >= 499000?
    ├─ Không đủ → 400 "Số dư không đủ" → redirect /wallet
    │
    ▼
$transaction:
    ├─ Wallet.balance -= 499000
    ├─ VipSubscription.create (expiresAt = now + 90 days)
    ├─ PaymentTransaction.create (type=VIP_PURCHASE)
    └─ User.aiMessageCount = 0  (reset AI counter)
    │
    ▼
Toast "🎉 Kích hoạt VIP thành công"
```

### 3. Luồng Luyện thi (VIP gate)

```
User vào Practice → click đề Reading Test 1
    │
    ▼
startTest(test):
    ├─ if isVipTest(test.id) && !isVip → toast "🔒 Cần VIP" → redirect /vip
    └─ else → navigate to test engine
    │
    ▼
Test Engine:
    ├─ Timer đếm ngược (durationMin)
    ├─ Part 1-4: phát audio, không transcript
    └─ Part 5-7: hiện passage + câu hỏi + 4 options
    │
    ▼
User nộp bài / hết giờ
    │
    ▼
POST /api/attempts { answers, correctCount, score, ... }
    │
    ▼
Server tính điểm:
    ├─ score = 10 + (correctCount / total) * 980
    ├─ listeningScore, readingScore
    └─ Lưu TestAttempt vào DB
    │
    ▼
GET /api/attempts/{id} → TestResults:
    ├─ Điểm tổng (10-990)
    ├─ Listening vs Reading breakdown
    ├─ Bảng câu hỏi + đáp án
    └─ Nút "Giải thích AI" → POST /api/ai/explain
```

### 4. Luồng AI Tutor (VIP limit)

```
User mở AI Tutor
    │
    ▼
GET /api/ai/chat → { isVip, used, remaining, limit }
    │
    ├─ VIP → banner "👑 VIP · ∞ unlimited + ảnh"
    └─ Free → banner "⚡ Còn X/10 câu"
    │
    ▼
User gửi câu hỏi (+ ảnh if VIP)
    │
    ▼
POST /api/ai/chat { messages, image? }
    │
    ├─ if !isVip && aiMessageCount >= 10 → 403 { needVip: true }
    ├─ if image && !isVip → 403 { needVip: true }
    │
    ▼
    ├─ VIP + ảnh → aiChatWithImage() (ZAI Vision VLM)
    └─ else → aiChat() (text only)
    │
    ▼
    ├─ if !isVip → User.aiMessageCount += 1
    └─ return { reply, usage: { remaining } }
    │
    ▼
Update banner "Còn X-1/10 câu" (hoặc "∞ VIP")
```

### 5. Luồng Chat Real-time

```
Học sinh vào Teachers → click Chat
    │
    ▼
POST /api/chat/rooms { teacherUserId }
    │
    ├─ Check VIP (học sinh cần VIP, giáo viên không cần)
    └─ Find or create ChatRoom
    │
    ▼
Navigate to ChatView { roomId }
    │
    ▼
Connect Socket.io: io('http://localhost:3003')
    ├─ emit 'auth' { userId, role, name }
    └─ emit 'chat:join' roomId
    │
    ▼
GET /api/chat/rooms/{id}/messages → load history
    │
    ▼
User gửi tin nhắn:
    ├─ Optimistic: add message ngay
    ├─ emit 'chat:message' (socket → real-time)
    └─ POST /api/chat/rooms/{id}/messages (persist)
    │
    ▼
Teacher (tab khác) nhận 'chat:message' → hiện tin nhắn
    │
    ├─ Typing indicator (3 dots)
    └─ Auto-scroll
```

### 6. Luồng Video Call (WebRTC)

```
Học sinh click Call → POST /api/class/create { teacherUserId }
    │
    ├─ Check VIP
    └─ Create ClassSession { roomCode: "Y4M6K9", status: WAITING }
    │
    ▼
Navigate to ClassRoomView { roomCode }
    │
    ▼
POST /api/class/join { roomCode } → mark ACTIVE
    │
    ▼
getUserMedia (camera + mic)
    │
    ▼
Connect Socket.io + emit 'call:create' { roomCode }
    │
    ▼
Teacher vào Teacher Dashboard → thấy lớp WAITING → click "Vào lớp"
    │
    ▼
Teacher emit 'call:join' { roomCode }
    │
    ▼
Socket emit 'call:student-joined' → Teacher
    │
    ▼
Teacher (caller) creates WebRTC offer:
    ├─ peer.createOffer() → setLocalDescription
    └─ emit 'call:offer' { sdp }
    │
    ▼
Student (callee) receives offer:
    ├─ setRemoteDescription(offer)
    ├─ peer.createAnswer() → setLocalDescription
    └─ emit 'call:answer' { sdp }
    │
    ▼
Exchange ICE candidates (both directions)
    │
    ▼
P2P connection established → video + audio stream
    │
    ▼
Controls: mute mic, toggle camera, end call
```

### 7. Luồng Admin quản lý user

```
Admin vào Admin Panel → tab "Học viên"
    │
    ▼
GET /api/admin/users → list (excludes ADMIN + TEACHER)
    │
    ▼
Click 👁️ → UserDetailModal:
    ├─ GET /api/admin/users/{id} → full detail
    │   ├─ wallet, activeVip, vipHistory, payments
    │   ├─ chatRooms, classSessions, testAttempts
    │   └─ stats (totalPayments, totalVipSpent, ...)
    │
    ▼
Actions:
    ├─ ✏️ Sửa thông tin → PUT { name, email }
    ├─ 🔑 Đặt lại mật khẩu → PUT { resetPassword }
    ├─ 🔒 Khoá/Mở khoá → PUT { locked }
    ├─ 🔄 Reset AI counter → PUT { resetAiCount: true }
    ├─ 🎁 Tặng tiền → PUT { addBalance: 100000 }
    └─ 🗑️ Xoá tài khoản → DELETE
```

---

## 🚀 Cài đặt & chạy trên VS Code

### Yêu cầu hệ thống
- **Node.js** 18+ (khuyến nghị 20+)
- **Bun** — [cài tại đây](https://bun.sh)
- **VS Code** với extension: ESLint, Tailwind CSS IntelliSense, Prisma

### Bước 1: Clone repo

```bash
git clone https://github.com/vinhdong123/toeic-ace-ai-max.git
cd toeic-ace-ai-max
```

### Bước 2: Cài đặt dependencies

```bash
bun install
cd mini-services/realtime-service && bun install && cd ../..
```

### Bước 3: Cấu hình `.env`

File `.env` đã có sẵn:
```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ Đổi `NEXTAUTH_SECRET`: chạy `openssl rand -base64 32`

### Bước 4: Khởi tạo database

```bash
bun run db:push
```

> 💡 Repo đã có sẵn `prisma/db/custom.db` (12MB — đã seed đầy đủ). Nếu muốn reset, xoá file này rồi chạy `db:push` + seed lại.

### Bước 5: Seed dữ liệu (nếu reset DB)

```bash
bun run scripts/seed.ts
bun run scripts/seed-admin.ts
bun run scripts/seed-vocab-levels.ts
bun run scripts/seed-rc-test1.ts
bun run scripts/seed-rc-test2.ts
bun run scripts/seed-rc-test3.ts
bun run scripts/seed-lc-test1.ts
bun run scripts/seed-exercises.ts
bun run scripts/seed-vip-teachers.ts
```

### Bước 6: (Tuỳ chọn) Cài Ollama + qwen2.5:3b

```bash
# Cài Ollama: https://ollama.com/download
ollama serve              # khởi động server
ollama pull qwen2.5:3b    # tải model (~2GB)
```

> App tự nhận diện Ollama — không cần cấu hình `.env` gì thêm.

### Bước 7: Chạy 2 services

```bash
# Terminal 1: Socket.io realtime service (chat + video call)
cd mini-services/realtime-service
bun run dev
# → http://localhost:3003

# Terminal 2: Next.js app
bun run dev
# → http://localhost:3000
```

Mở browser: **http://localhost:3000**

### Các lệnh thường dùng

| Lệnh | Mô tả |
|---|---|
| `bun run dev` | Chạy Next.js dev server (port 3000) |
| `bun run lint` | Kiểm tra ESLint |
| `bun run build` | Build production |
| `bun run db:push` | Push schema → DB |
| `bun run db:generate` | Generate Prisma Client |
| `bunx prisma studio` | Mở DB GUI tại :5555 |

---

## 📡 API endpoints (47 routes)

### Auth (`/api/auth`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/check-status` | Pre-check tài khoản bị khoá |
| GET | `/api/auth/session` | Lấy session |
| POST | `/api/auth/callback/credentials` | Login (NextAuth) |
| POST | `/api/auth/signout` | Logout |

### AI (`/api/ai`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/ai/provider` | Provider info + health check |
| GET | `/api/ai/chat` | AI usage status (isVip, remaining) |
| POST | `/api/ai/chat` | AI Tutor chat (10 câu free / VIP unlimited + ảnh) |
| POST | `/api/ai/explain` | Giải thích đáp án |
| POST | `/api/ai/generate-question` | Sinh câu hỏi TOEIC |
| POST | `/api/ai/writing-check` | Sửa lỗi viết |
| POST | `/api/ai/study-plan` | Lập kế hoạch học |

### Wallet (`/api/wallet`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/wallet/balance` | Số dư ví |
| POST | `/api/wallet/topup` | Nạp tiền (mock) |
| GET | `/api/wallet/transactions` | Lịch sử giao dịch |

### VIP (`/api/vip`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/vip/packages` | Danh sách gói VIP |
| POST | `/api/vip/purchase` | Mua VIP (trừ ví) |
| GET | `/api/vip/status` | Trạng thái VIP + số dư |

### Teachers (`/api/teachers`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/teachers` | Danh sách giáo viên |

### Teacher Dashboard (`/api/teacher`) — yêu cầu role=TEACHER
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/teacher/dashboard` | Stats + recent chats + upcoming classes |
| PUT | `/api/teacher/dashboard` | Update own profile |
| GET | `/api/teacher/students` | Danh sách học sinh |
| GET | `/api/teacher/earnings` | Doanh thu ước tính |

### Chat (`/api/chat`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/chat/rooms` | Danh sách phòng chat |
| POST | `/api/chat/rooms` | Tạo/mở phòng chat (VIP gate) |
| GET | `/api/chat/rooms/[id]/messages` | Lịch sử tin nhắn |
| POST | `/api/chat/rooms/[id]/messages` | Gửi tin nhắn |

### Class (`/api/class`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/class/create` | Tạo lớp học (teacher/student) |
| POST | `/api/class/join` | Tham gia lớp (VIP gate) |
| GET | `/api/class/active` | Lớp đang hoạt động |

### Content (`/api/content`)
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/content/grammar` | Danh sách bài grammar |
| GET | `/api/content/grammar/[slug]` | Chi tiết bài |
| GET | `/api/content/grammar/[slug]/exercises` | Bài tập |
| GET | `/api/content/vocab?level=A1` | Vocab theo level |
| GET | `/api/content/vocab/counts` | Số lượng vocab mỗi level |
| GET | `/api/content/strategies` | Chiến thuật |

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
| GET | `/api/attempts/by-learner/[learnerId]` | Lịch sử thi |

### Admin (`/api/admin`) — yêu cầu role=ADMIN
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê tổng |
| GET | `/api/admin/users` | List học sinh (excludes ADMIN+TEACHER) |
| GET | `/api/admin/users/[id]` | User detail (wallet, VIP, payments, chat, classes) |
| PUT | `/api/admin/users/[id]` | Edit user (name, email, locked, role, resetPassword, addBalance) |
| DELETE | `/api/admin/users/[id]` | Xoá user |
| GET | `/api/admin/teachers` | List giáo viên |
| POST | `/api/admin/teachers` | Tạo giáo viên (promote user) |
| PUT | `/api/admin/teachers/[id]` | Sửa profile giáo viên |
| DELETE | `/api/admin/teachers/[id]` | Xoá giáo viên (demote) |
| GET | `/api/admin/vip-packages` | List gói VIP |
| POST | `/api/admin/vip-packages` | Tạo gói VIP |
| PUT | `/api/admin/vip-packages/[id]` | Sửa gói VIP |
| DELETE | `/api/admin/vip-packages/[id]` | Xoá gói VIP |
| GET | `/api/admin/payments` | Tất cả giao dịch + summary |
| GET/POST/PUT/DELETE | `/api/admin/vocab` | CRUD vocab |
| GET/POST/PUT/DELETE | `/api/admin/grammar` | CRUD grammar |

### Pronunciation (`/api/pronunciation`)
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/pronunciation/analyze` | AI phân tích phát âm (audio base64) |

---

## 👤 Tài khoản & vai trò

### Roles
| Role | Quyền |
|---|---|
| `STUDENT` | Học, làm thi (free + VIP), mua VIP, chat/call teacher (cần VIP) |
| `INSTRUCTOR` | Giống STUDENT (dự phòng) |
| `TEACHER` | Teacher Dashboard, chat/call với student (FREE, không cần VIP) |
| `ADMIN` | Admin Panel (7 tabs), full CRUD, không cần VIP |

### Tài khoản mặc định
| Email | Password | Role |
|---|---|---|
| `admin@toeic.com` | `admin123` | ADMIN |
| `sarah.teacher@toeic.com` | `teacher123` | TEACHER |
| `david.teacher@toeic.com` | `teacher123` | TEACHER |
| `linh.teacher@toeic.com` | `teacher123` | TEACHER |
| `james.teacher@toeic.com` | `teacher123` | TEACHER |

---

## 📜 Scripts tiện ích

| Script | Mô tả |
|---|---|
| `bun run scripts/seed.ts` | Seed chính (vocab, grammar, strategies) |
| `bun run scripts/seed-admin.ts` | Tạo/reset admin |
| `bun run scripts/seed-vip-teachers.ts` | 3 VIP packages + 4 teachers |
| `bun run scripts/seed-rc-test1.ts` | Đề Reading Test 1 (100 câu) |
| `bun run scripts/seed-rc-test2.ts` | Đề Reading Test 2 (100 câu) |
| `bun run scripts/seed-rc-test3.ts` | Đề Reading Test 3 (100 câu) |
| `bun run scripts/seed-lc-test1.ts` | Đề Listening Test 1 (100 câu + audio) |
| `bun run scripts/seed-exercises.ts` | 200 bài tập grammar |
| `bun run scripts/seed-vocab-levels.ts` | 742 từ vựng CEFR |

---

## 🐛 Troubleshooting

### Lỗi: "Không kết nối được với Ollama"
```bash
ollama serve
ollama pull qwen2.5:3b
```
App tự fallback sang ZAI Cloud nếu Ollama không chạy.

### Lỗi: Đăng nhập admin không được
```bash
bun run scripts/seed-admin.ts
```

### Lỗi: Chat không real-time
- Kiểm tra mini-service chạy: `cd mini-services/realtime-service && bun run dev`
- Port 3003 phải listening

### Lỗi: Video call không kết nối
- Cho phép camera + mic trong browser
- Mở 2 tab (teacher + student) để test
- WebRTC cần STUN server (đã config Google STUN)

### Lỗi: Prisma Client không có field mới
```bash
bun run db:generate
```

---

## 📄 License

MIT License — tự do sử dụng cho mục đích học tập và thương mại.

---

**🎓 TOEIC Ace AI** — Học TOEIC thông minh với AI, real-time chat, video call, wallet + VIP system.
