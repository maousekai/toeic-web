# 📋 TEAM_TASKS.md — Phân chia nhiệm vụ 3 thành viên

> **Dự án:** TOEIC Ace AI — Web học TOEIC tích hợp AI
> **Cập nhật:** 2026-06-24
> **Tổng số thành viên:** 3 người
> **Thời gian dự kiến:** 4-6 tuần

---

## 🎯 Tổng quan phân chia

| Thành viên | Vai trò | Module phụ trách | LOC hiện có | LOC dự kiến thêm |
|---|---|---|---|---|
| **A** | Practice & Scoring Engine Builder | Luyện thi + Chấm điểm | ~812 | ~600 |
| **B** | AI & Smart Features Developer | AI Tutor + Smart tools | ~569 | ~800 |
| **C** | UX & Growth Engineer | Trải nghiệm + Gamification | ~1.345 | ~700 |

### 🛡️ Nguyên tắc chung

1. **Mỗi người chỉ đụng code trong scope của mình** — tránh conflict
2. **Tạo branch riêng** theo format: `feat/<tên-module>` (vd: `feat/practice-engine`)
3. **Commit nhỏ, có ý nghĩa** — theo Conventional Commits (`feat:`, `fix:`, `refactor:`...)
4. **Tạo Pull Request** trước khi merge vào main — team review ít nhất 1 người
5. **Không push thẳng lên `main`** — vi phạm sẽ bị revert
6. **Code review trên PR** — comment cụ thể, lịch sự
7. **Test trước khi push:** `bun run lint` + test thủ công bằng browser

---

## 👤 THÀNH VIÊN A — Practice & Scoring Engine Builder

### 🎯 Vai trò
A phụ trách **phần cốt lõi nhất của web TOEIC** — toàn bộ flow từ lúc user bấm "Start Practice" → làm bài → nộp bài → xem điểm → review đáp án.

### 📦 Files phụ trách

```
src/components/practice/              ← Frontend (UI làm bài test)
├── practice-list.tsx                 ← Danh sách bộ đề
├── test-engine.tsx                   ← Engine làm bài (timer, palette, TTS)
└── test-results.tsx                  ← Trang kết quả + review

src/app/api/attempts/                 ← API lưu kết quả
├── route.ts                          ← POST nộp bài + chấm điểm
├── [id]/route.ts                     ← GET xem lại 1 lần thi
└── by-learner/[learnerId]/route.ts   ← GET lịch sử thi

src/app/api/tests/                    ← API lấy đề thi
├── route.ts                          ← List bộ đề
└── [id]/route.ts                     ← Chi tiết bộ đề

prisma/schema.prisma                  ← Models: Question, TestSet, TestAttempt
scripts/seed.ts                       ← Phần thêm câu hỏi + bộ đề
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- 61 câu hỏi (Part 2, 5, 6, 7)
- 6 bộ đề (Part 5 mini, Part 5 set 2, Part 2 listening, Part 6, Part 7, Full mock 40 câu)
- Test engine với timer, question palette, TTS cho listening
- Chấm điểm tự động + ước lượng điểm TOEIC 10-990
- Review answers sau thi + AI explain

### 🔨 Tasks chi tiết

#### **Phase 1 — Bổ sung nội dung đề (Tuần 1-2)**

| ID | Task | Mô tả | Output | Độ khó |
|---|---|---|---|---|
| A.1.1 | Thêm Part 1 (Photographs) | 6 câu hỏi mô tả ảnh (hiện chưa có) | Seed thêm ~10 câu Part 1 | ⭐⭐ |
| A.1.2 | Thêm Part 3 (Conversations) | Short conversations, 3 câu hỏi mỗi đoạn | Seed thêm ~15 câu Part 3 | ⭐⭐⭐ |
| A.1.3 | Thêm Part 4 (Talks) | Monologues (announcements, voicemails) | Seed thêm ~15 câu Part 4 | ⭐⭐⭐ |
| A.1.4 | Thêm câu hỏi advanced | Câu khó difficulty 4-5 | Seed thêm 20 câu khó | ⭐⭐ |
| A.1.5 | Tạo Full Mock 100 câu | Bộ đề giả lập đề TOEIC thật (100 câu, 2 tiếng) | 1-2 bộ đề mới | ⭐⭐ |

#### **Phase 2 — Engine nâng cao (Tuần 3-4)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| A.2.1 | Exam Mode | Chế độ thi thật: không xem transcript, không replay, không hint | ⭐⭐⭐ |
| A.2.2 | Review Mode nâng cao | Sau thi, replay audio unlimited, có AI explain per question | ⭐⭐ |
| A.2.3 | Adaptive Difficulty | Câu đúng → câu sau khó hơn; câu sai → dễ hơn (như GMAT) | ⭐⭐⭐⭐ |
| A.2.4 | Bookmark câu hỏi | User đánh dấu câu muốn xem lại | ⭐⭐ |
| A.2.5 | Pause/Resume test | Lưu trạng thái, cho user pause rồi continue | ⭐⭐⭐ |

#### **Phase 3 — Export & Reporting (Tuần 5-6)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| A.3.1 | Export kết quả PDF | Tải certificate/báo cáo điểm về máy | ⭐⭐⭐ |
| A.3.2 | So sánh tiến độ | Biểu đồ so sánh điểm 5 lần thi gần nhất | ⭐⭐ |
| A.3.3 | Phân tích điểm yếu | "Bạn yếu Part 5 grammar, cần ôn lại tenses" | ⭐⭐⭐ |

### 📊 KPIs của A

| KPI | Target |
|---|---|
| Số câu hỏi trong DB | ≥ 120 câu (hiện 61) |
| Số bộ đề | ≥ 9 bộ (hiện 6) |
| Độ phủ 7 Parts | 7/7 Parts (hiện 4/7) |
| Tính năng mới hoàn thành | ≥ 3 tính năng |
| Bug critical | 0 |

### 🎤 Template báo cáo A

```markdown
## Tuần [X] — Thành viên A — Practice & Scoring Engine

### Đã làm:
- ✅ [Task ID] — mô tả — commit hash
- 🔄 [Task đang làm] — % hoàn thành

### Số liệu:
- Tổng câu hỏi: X/120 câu
- Tổng bộ đề: X/9 bộ
- Parts đã có: X/7

### Khó khăn:
- [Nếu có]

### Tuần sau sẽ làm:
- [Task tiếp theo]

### Cần hỗ trợ:
- [Từ B hoặc C nếu cần]
```

---

## 👤 THÀNH VIÊN B — AI & Smart Features Developer

### 🎯 Vai trò
B phụ trách **toàn bộ tính năng AI thông minh** — AI Tutor chat, AI giải thích đáp án, AI sinh câu hỏi, AI chấm viết, AI study plan, và các tính năng AI mới (speaking, conversation practice...).

### 📦 Files phụ trách

```
src/components/ai/                    ← Frontend AI
├── tutor-view.tsx                    ← AI Tutor chat UI
└── tools-view.tsx                    ← AI Tools (3 tabs: Generator, Writing, Plan)

src/app/api/ai/                       ← API AI
├── chat/route.ts                     ← AI Tutor chat
├── explain/route.ts                  ← AI giải thích đáp án
├── generate-question/route.ts        ← AI sinh câu hỏi
├── writing-check/route.ts            ← AI chấm viết
├── study-plan/route.ts               ← AI study plan
└── provider/route.ts                 ← Info về AI provider đang dùng

src/lib/ai.ts                         ← Adapter 6 AI providers
src/lib/use-language.tsx              ← Language toggle (VI/EN/BI)
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- 5 tính năng AI đã hoạt động: chat, explain, generate-question, writing-check, study-plan
- Multi-provider adapter (ZAI/Ollama/OpenAI/OpenRouter/Groq/Gemini)
- 3 ngôn ngữ AI trả lời: Tiếng Việt / Song ngữ / English
- Provider badge trong UI

### 🔨 Tasks chi tiết

#### **Phase 1 — Research & Setup (Tuần 1)**

| ID | Task | Mô tả | Output | Độ khó |
|---|---|---|---|---|
| B.1.1 | Research Web Speech API | Tìm hiểu SpeechRecognition + SpeechSynthesis | Document technical | ⭐⭐ |
| B.1.2 | Research AI Speech Scoring | Cách chấm phát âm (pronunciation, fluency) | Document approach | ⭐⭐⭐⭐ |
| B.1.3 | Test multi-provider trên local | Verify Ollama/OpenAI/Gemini hoạt động | Test report | ⭐⭐ |
| B.1.4 | Thiết kế API contract mới | `POST /api/ai/speaking-score`, `POST /api/ai/conversation` | API spec doc | ⭐⭐⭐ |

#### **Phase 2 — AI Speaking & Writing Test (Tuần 2-3)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| B.2.1 | AI Speaking Test UI | Record audio, hiển thị waveform, playback | ⭐⭐⭐⭐ |
| B.2.2 | AI Speaking Scoring | API chuyển speech→text, so sánh với text chuẩn, chấm điểm | ⭐⭐⭐⭐⭐ |
| B.2.3 | AI Writing Test | UI soạn đoạn văn theo prompt TOEIC, AI chấm theo rubric | ⭐⭐⭐⭐ |
| B.2.4 | Writing rubric | AI chấm theo 4 tiêu chí: Grammar, Vocabulary, Coherence, Task | ⭐⭐⭐ |

#### **Phase 3 — Smart Learning (Tuần 4-5)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| B.3.1 | AI Conversation Practice | Chat scenario-based (đặt nhà hàng, họp, phỏng vấn...) | ⭐⭐⭐⭐ |
| B.3.2 | AI Vocabulary Recommender | Gợi ý từ vựng dựa trên câu user hay sai | ⭐⭐⭐ |
| B.3.3 | AI Difficulty Adapter | Algorithm tăng/giảm difficulty theo năng lực | ⭐⭐⭐⭐ |
| B.3.4 | AI Progress Insights | AI phân tích tiến độ, suggest下一步 | ⭐⭐⭐ |

#### **Phase 4 — Polish (Tuần 6)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| B.4.1 | Streaming response | AI Tutor stream text realtime (đỡ wait) | ⭐⭐⭐ |
| B.4.2 | Conversation history | Lưu lịch sử chat vào DB, tiếp tục lần sau | ⭐⭐⭐ |
| B.4.3 | Voice selection | Cho user chọn giọng TTS (nam/nữ, US/UK) | ⭐⭐ |

### 📊 KPIs của B

| KPI | Target |
|---|---|
| Tính năng AI mới | ≥ 4 tính năng (Speaking, Writing, Conversation, Recommender) |
| AI providers hỗ trợ | ≥ 6 (đã có) |
| Độ trễ AI response | ≤ 10s (đã có streaming) |
| Lưu lịch sử chat | Có |
| Bug AI | 0 (timeout, parse error) |

### 🎤 Template báo cáo B

```markdown
## Tuần [X] — Thành viên B — AI & Smart Features

### Đã làm:
- ✅ [Task ID] — mô tả — commit hash
- 🔄 [Task đang làm] — % hoàn thành

### Số liệu:
- Tính năng AI: X/9 tính năng
- Provider hỗ trợ: 6/6
- Avg AI response time: Xs

### Khó khăn:
- [Nếu có — đặc biệt API rate limit, model quality]

### Tuần sau sẽ làm:
- [Task tiếp theo]

### Cần hỗ trợ:
- [Từ A: cần API attempt data cho vocabulary recommender]
- [Từ C: cần UI cho speaking test]
```

---

## 👤 THÀNH VIÊN C — UX & Growth Engineer

### 🎯 Vai trò
C phụ trách **trải nghiệm người dùng + tăng trưởng** — trang chủ, dashboard, auth flow, learning hub, gamification, leaderboard, achievements, notifications, mobile PWA.

### 📦 Files phụ trách

```
src/components/home/                   ← Trang chủ
└── home-view.tsx                      ← Landing page

src/components/site/                   ← Shell website
├── navbar.tsx                         ← Header + nav
├── footer.tsx                         ← Footer sticky
├── theme-provider.tsx                 ← Dark mode
├── theme-toggle.tsx                   ← Nút toggle dark/light
└── language-toggle.tsx                ← Nút chọn ngôn ngữ AI

src/components/dashboard/              ← Bảng theo dõi tiến trình
└── dashboard-view.tsx                 ← Stats + charts + recent attempts

src/components/auth/                   ← Auth flow
├── auth-modal.tsx                     ← Modal login/register
└── user-menu.tsx                      ← Avatar dropdown

src/components/learn/                  ← Learning hub
├── learn-view.tsx                     ← Hub chính
├── grammar-list.tsx                  ← List grammar lessons
├── grammar-detail.tsx                ← Chi tiết 1 bài grammar
├── vocab-flashcards.tsx              ← Flashcard flip + spaced repetition
└── strategies-view.tsx               ← TOEIC strategies
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- Trang chủ đẹp với hero, features, TOEIC structure overview
- Dashboard với 4 stat cards + 2 charts (Recharts)
- Auth modal (login/register tabs, password strength meter)
- User menu dropdown (avatar, logout)
- Learning hub (grammar lessons, vocab flashcards, strategies)
- Dark mode + language toggle

### 🔨 Tasks chi tiết

#### **Phase 1 — Profile & User Management (Tuần 1-2)**

| ID | Task | Mô tả | Output | Độ khó |
|---|---|---|---|---|
| C.1.1 | Profile page | Xem/sửa thông tin user, target score, avatar | New view + route | ⭐⭐⭐ |
| C.1.2 | Avatar upload | Cho user upload ảnh đại diện | File upload API | ⭐⭐⭐ |
| C.1.3 | Change password | Form đổi mật khẩu | New modal | ⭐⭐ |
| C.1.4 | Account settings | Language preference, notification prefs | Settings page | ⭐⭐ |

#### **Phase 2 — Gamification (Tuần 3-4)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| C.2.1 | DB schema gamification | Thêm bảng Achievement, UserAchievement, Streak | ⭐⭐⭐ |
| C.2.2 | Streak counter | Đếm chuỗi ngày học liên tục, hiển thị ở navbar | ⭐⭐⭐ |
| C.2.3 | Achievements system | Badge: "First Test", "7-day streak", "Score 800+", "100 questions" | ⭐⭐⭐⭐ |
| C.2.4 | Achievements UI | Hiển thị badges trong profile + toast khi unlock | ⭐⭐⭐ |
| C.2.5 | XP & Level system | Tích điểm XP, lên level theo mốc | ⭐⭐⭐ |

#### **Phase 3 — Social & Growth (Tuần 5)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| C.3.1 | Leaderboard | Xếp hạng người học theo điểm trung bình | ⭐⭐⭐ |
| C.3.2 | Leaderboard filters | Filter theo tuần/tháng/toàn thời gian, theo part | ⭐⭐ |
| C.3.3 | Share result | Share điểm lên social media (image card) | ⭐⭐⭐ |
| C.3.4 | Friends system | Add friend, xem tiến độ bạn bè | ⭐⭐⭐⭐ |

#### **Phase 4 — Mobile & Notifications (Tuần 6)**

| ID | Task | Mô tả | Độ khó |
|---|---|---|---|
| C.4.1 | PWA setup | Manifest.json, service worker, installable | ⭐⭐⭐ |
| C.4.2 | Push notifications | Nhắc nhở học hàng ngày qua browser notification | ⭐⭐⭐⭐ |
| C.4.3 | Mobile UX polish | Bottom nav, touch targets, gestures | ⭐⭐⭐ |
| C.4.4 | Offline mode | Cache lessons/vocab để xem không cần internet | ⭐⭐⭐⭐ |

### 📊 KPIs của C

| KPI | Target |
|---|---|
| Trang mới | ≥ 3 (Profile, Leaderboard, Settings) |
| Tính năng gamification | ≥ 5 (Streak, Achievements, XP, Leaderboard, Share) |
| PWA installable | Có |
| Mobile responsive | 100% (test trên iPhone SE, iPad) |
| Lighthouse score | ≥ 90 (Performance, Accessibility, PWA) |

### 🎤 Template báo cáo C

```markdown
## Tuần [X] — Thành viên C — UX & Growth

### Đã làm:
- ✅ [Task ID] — mô tả — commit hash
- 🔄 [Task đang làm] — % hoàn thành

### Số liệu:
- Trang mới: X/3
- Tính năng gamification: X/5
- Lighthouse score: X/100
- Mobile responsive: Yes/No

### Khó khăn:
- [Nếu có — đặc biệt PWA setup]

### Tuần sau sẽ làm:
- [Task tiếp theo]

### Cần hỗ trợ:
- [Từ A: cần API endpoint /api/leaderboard]
- [Từ B: cần AI insight cho progress page]
```

---

## 🔗 ĐIỂM GIAO TIẾP GIỮA 3 THÀNH VIÊN

### A ↔ B (Practice ↔ AI)

| Giao tiếp | Chi tiết |
|---|---|
| A gọi B | A dùng `/api/ai/explain` (đã có) để AI giải thích câu sai trong results |
| A cần B thêm | A làm Speaking Test → nhờ B tạo `/api/ai/speaking-score` |
| B cần A | B làm AI Difficulty Adapter → cần A chia sẻ logic chấm điểm hiện tại |
| **API contract** | B须 commit API spec trước khi A integrate |

### A ↔ C (Practice ↔ UX)

| Giao tiếp | Chi tiết |
|---|---|
| A lưu → C đọc | A lưu `TestAttempt` vào DB → C đọc để hiển thị Dashboard (đã có) |
| C cần A | C làm Leaderboard → cần A thêm API `/api/leaderboard` hoặc C tự query từ TestAttempt |
| A cần C | A làm Exam Mode → nhờ C thiết kế UI cho mode switcher |
| **Quy tắc** | Không sửa schema của nhau — nếu cần thêm field → discuss trước |

### B ↔ C (AI ↔ UX)

| Giao tiếp | Chi tiết |
|---|---|
| B làm component → C integrate | B tạo `<SpeakingTest />` → C import vào Practice list hoặc Tools page |
| C cần B | C làm Profile page → cần B thêm API `/api/user/stats` (AI insights) |
| B cần C | B làm conversation history → cần C thiết kế UI history list |
| **Quy tắc** | Component của B phải có props rõ ràng, C chỉ việc import + render |

### 🤝 Họp sync hàng tuần

**Thứ 2 hàng tuần — 30 phút:**
- Mỗi người báo cáo: đã làm gì, khó khăn, kế hoạch tuần tới
- Discuss các API contract mới
- Resolve conflict nếu có

**Daily standup (optional) — 10 phút mỗi sáng:**
- Hôm qua làm gì
- Hôm nay làm gì
- Có vướng mắc gì không

---

## 📅 TIMELINE TỔNG QUAN

```
Tuần 1  │ A: Seed Part 1,3,4     │ B: Research speech API   │ C: Profile page UI
        │ A: Tạo Full Mock 100   │ B: API contract design   │ C: Avatar upload
        │                        │                          │
Tuần 2  │ A: Exam Mode           │ B: AI Speaking Test UI   │ C: Streak counter
        │ A: Review Mode nâng cao│ B: Speaking scoring API  │ C: Achievements schema
        │                        │                          │
Tuần 3  │ A: Adaptive Difficulty │ B: AI Writing Test       │ C: Achievements UI
        │ A: Bookmark câu hỏi    │ B: Writing rubric        │ C: XP & Level system
        │                        │                          │
Tuần 4  │ A: Pause/Resume test   │ B: AI Conversation       │ C: Leaderboard
        │ A: Export PDF          │ B: Vocab Recommender     │ C: Share result
        │                        │                          │
Tuần 5  │ A: So sánh tiến độ     │ B: AI Difficulty Adapter │ C: PWA setup
        │ A: Phân tích điểm yếu  │ B: AI Progress Insights  │ C: Push notifications
        │                        │                          │
Tuần 6  │ 🎉 TÍCH HỢP + TEST + POLISH + BÁO CÁO                              │
        │ Cả 3: Merge branches, fix conflicts, E2E test, demo
```

---

## 🛡️ WORKFLOW GIT AN TOÀN

### Setup ban đầu (mỗi người làm 1 lần)

```bash
# Clone repo
git clone https://github.com/username/toeic-ace-ai.git
cd toeic-ace-ai

# Cài dependencies
bun install

# Setup env (copy từ .env.example)
cp .env.example .env
# Edit .env: thêm NEXTAUTH_SECRET + chọn AI provider

# Setup database
bun run db:push
bun run db:generate
bun run scripts/seed.ts

# Chạy dev server verify
bun run dev
```

### Quy trình hàng ngày

```bash
# 1. Đầu ngày: sync code mới nhất
git checkout main
git pull origin main

# 2. Tạo/chuyển sang branch của mình
git checkout -b feat/practice-engine    # A
git checkout -b feat/ai-features        # B
git checkout -b feat/ux-growth          # C

# 3. Làm việc + commit nhỏ
git add .
git commit -m "feat(thành viên A): thêm Part 1 photographs"

# 4. Push lên branch
git push origin feat/practice-engine

# 5. Cuối task: tạo Pull Request trên GitHub
#    → Điền template PR (xem dưới)
#    → Tag 2 người kia review
```

### Template Pull Request

```markdown
## PR: [Tên tính năng]

### Mô tả
[Brief mô tả tính năng]

### Loại thay đổi
- [ ] Feature mới
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation

### Files thay đổi
- `src/components/practice/test-engine.tsx` — thêm Exam Mode
- `src/app/api/attempts/route.ts` — thêm field mode

### Screenshots
[Nếu có UI change]

### Test
- [x] `bun run lint` pass
- [x] Test thủ công pass
- [x] Không break existing features

### Reviewer
@teammate-b @teammate-c
```

---

## 📊 BÁO CÁO CUỐI KỲ (cho 3 người)

Mỗi người làm 1 phần báo cáo:

### Template báo cáo cuối kỳ

```markdown
# Báo cáo cuối kỳ — [Tên thành viên] — [Module]

## 1. Tổng quan
- Module phụ trách: [tên module]
- Thời gian: [start date] — [end date]
- Số commit: X
- Số PR merged: X

## 2. Tính năng đã hoàn thành
| ID | Tên tính năng | Status | Link PR |
|---|---|---|---|
| A.1.1 | Part 1 photographs | ✅ Done | #12 |
| A.1.2 | Part 3 conversations | ✅ Done | #15 |
| ... | ... | ... | ... |

## 3. Số liệu
- LOC code mới: X dòng
- Files mới: X
- Files sửa: X
- Tests pass: X%

## 4. Khó khăn & giải pháp
- [Khó khăn 1] → [giải pháp]
- [Khó khăn 2] → [giải pháp]

## 5. Đóng góp cho team
- Review PR của [tên]: X lần
- Hỗ trợ [tên] fix bug: [mô tả]

## 6. Bài học
- [Technical lesson]
- [Soft skill lesson]

## 7. Định hướng tương lai
- [Tính năng muốn phát triển tiếp]
```

---

## 📞 CONTACT & HỖ TRỢ

| Vấn đề | Liên hệ |
|---|---|
| Conflict code | Họp nhóm 3 người giải quyết |
| Bug không fix được | Tạo issue trên GitHub, tag team |
| Cần review gấp | Nhắn trên Discord/Slack |
| Đổi schema DB | **BẮT BUỘC** họp nhóm 3 người trước |
| Đổi API contract | **BẮT BUỘC** báo cho người dùng API đó biết |

---

## 📚 TÀI LIỆU THAM KHẢO

| Tài liệu | Link |
|---|---|
| Next.js 16 docs | https://nextjs.org/docs |
| Prisma docs | https://www.prisma.io/docs |
| shadcn/ui | https://ui.shadcn.com |
| NextAuth.js | https://next-auth.js.org |
| Tailwind CSS 4 | https://tailwindcss.com |
| ZAI SDK | (internal) |
| Ollama | https://ollama.com |
| OpenAI API | https://platform.openai.com/docs |
| Recharts | https://recharts.org |
| Framer Motion | https://www.framer.com/motion |

---

## ✅ CHECKLIST TRƯỚC KHI BÁO CÁO

Mỗi cuối tuần, mỗi thành viên check:

- [ ] Tất cả tasks tuần này đã commit + push
- [ ] Đã tạo PR cho các task hoàn thành
- [ ] Đã review ít nhất 1 PR của đồng đội
- [ ] `bun run lint` pass
- [ ] Test thủ công trên browser pass
- [ ] Cập nhật TEAM_TASKS.md (đánh dấu task ✅)
- [ ] Viết báo cáo tuần theo template
- [ ] Không có bug critical chưa fix

---

**🎉 Chúc team 3 người làm việc hiệu quả và hoàn thành dự án thành công!**
