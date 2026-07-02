# 📋 PHÂN CHIA NHIỆM VỤ — 3 THÀNH VIÊN

> **Dự án:** TOEIC Ace AI — Website học TOEIC tích hợp AI
> **Ngày cập nhật:** 24/06/2026
> **Số thành viên:** 3 người
> **Thời gian dự kiến:** 4–6 tuần

---

## 🎯 TỔNG QUAN PHÂN CHIA

| Thành viên | Vai trò | Module phụ trách | Số dòng code hiện có | Số dòng dự kiến thêm |
|---|---|---|---|---|
| **A** | Người xây dựng phần Luyện thi & Chấm điểm | Đề thi + Chấm điểm + Xem lại | ~812 | ~600 |
| **B** | Người phát triển tính năng AI thông minh | AI Tutor + Công cụ AI | ~569 | ~800 |
| **C** | Kỹ sư Trải nghiệm & Tăng trưởng | Giao diện + Game hóa | ~1.345 | ~700 |

### 🛡️ Nguyên tắc chung cho cả 3 người

1. **Mỗi người chỉ sửa code trong phạm vi của mình** — tránh xung đột code
2. **Tạo nhánh riêng** theo cú pháp: `feat/<tên-module>` (ví dụ: `feat/luyen-thi`)
3. **Commit nhỏ, có ý nghĩa** — theo chuẩn Conventional Commits (`feat:`, `fix:`, `refactor:`...)
4. **Tạo Pull Request** trước khi gộp vào nhánh chính — cần ít nhất 1 người review
5. **Không đẩy code trực tiếp lên nhánh `main`** — vi phạm sẽ bị hoàn tác
6. **Review code trên PR** — bình luận cụ thể, lịch sự
7. **Kiểm tra trước khi đẩy:** chạy `bun run lint` + test bằng trình duyệt

---

## 👤 THÀNH VIÊN A — Người xây dựng phần Luyện thi & Chấm điểm

### 🎯 Vai trò
Thành viên A phụ trách **phần cốt lõi nhất của website TOEIC** — toàn bộ luồng từ lúc người dùng bấm "Bắt đầu luyện tập" → làm bài → nộp bài → xem điểm → xem lại đáp án.

### 📦 Các file phụ trách

```
src/components/practice/              ← Giao diện làm bài test
├── practice-list.tsx                 ← Danh sách bộ đề
├── test-engine.tsx                   ← Bộ máy làm bài (đồng hồ, bảng câu hỏi, TTS)
└── test-results.tsx                  ← Trang kết quả + xem lại

src/app/api/attempts/                 ← API lưu kết quả
├── route.ts                          ← POST nộp bài + chấm điểm
├── [id]/route.ts                     ← GET xem lại 1 lần thi
└── by-learner/[learnerId]/route.ts   ← GET lịch sử thi của 1 người

src/app/api/tests/                    ← API lấy đề thi
├── route.ts                          ← Danh sách bộ đề
└── [id]/route.ts                     ← Chi tiết 1 bộ đề

prisma/schema.prisma                  ← Các model: Question, TestSet, TestAttempt
scripts/seed.ts                       ← Phần thêm câu hỏi + bộ đề mới
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- 61 câu hỏi (Part 2, 5, 6, 7)
- 6 bộ đề (Part 5 mini, Part 5 set 2, Part 2 listening, Part 6, Part 7, Mock 40 câu)
- Bộ máy làm bài với đồng hồ đếm ngược, bảng câu hỏi, TTS cho listening
- Chấm điểm tự động + ước lượng điểm TOEIC 10–990
- Xem lại đáp án sau thi + AI giải thích

### 🔨 Danh sách công việc chi tiết

#### **Giai đoạn 1 — Bổ sung nội dung đề (Tuần 1–2)**

| Mã | Công việc | Mô tả | Kết quả | Độ khó |
|---|---|---|---|---|
| A.1.1 | Thêm Part 1 (Mô tả ảnh) | 6 câu hỏi mô tả ảnh (hiện chưa có) | Thêm ~10 câu Part 1 | ⭐⭐ |
| A.1.2 | Thêm Part 3 (Hội thoại) | Hội thoại ngắn, 3 câu hỏi mỗi đoạn | Thêm ~15 câu Part 3 | ⭐⭐⭐ |
| A.1.3 | Thêm Part 4 (Bài nói) | Độc thoại (thông báo, thư thoại) | Thêm ~15 câu Part 4 | ⭐⭐⭐ |
| A.1.4 | Thêm câu hỏi khó | Câu difficulty 4–5 cho người học giỏi | Thêm 20 câu khó | ⭐⭐ |
| A.1.5 | Tạo Mock 100 câu | Bộ đề giả lập đề TOEIC thật (100 câu, 2 tiếng) | 1–2 bộ đề mới | ⭐⭐ |

#### **Giai đoạn 2 — Nâng cấp bộ máy làm bài (Tuần 3–4)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| A.2.1 | Chế độ thi thật | Không xem transcript, không nghe lại, không gợi ý | ⭐⭐⭐ |
| A.2.2 | Chế độ xem lại nâng cao | Sau thi, nghe lại không giới hạn, có AI giải thích từng câu | ⭐⭐ |
| A.2.3 | Độ khó thích ứng | Câu đúng → câu sau khó hơn; câu sai → dễ hơn (như GMAT) | ⭐⭐⭐⭐ |
| A.2.4 | Đánh dấu câu hỏi | Người dùng đánh dấu câu muốn xem lại sau | ⭐⭐ |
| A.2.5 | Tạm dừng/Tiếp tục bài thi | Lưu trạng thái, cho người dùng tạm dừng rồi làm tiếp | ⭐⭐⭐ |

#### **Giai đoạn 3 — Xuất kết quả & Báo cáo (Tuần 5–6)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| A.3.1 | Xuất kết quả PDF | Tải chứng nhận/báo cáo điểm về máy | ⭐⭐⭐ |
| A.3.2 | So sánh tiến độ | Biểu đồ so sánh điểm 5 lần thi gần nhất | ⭐⭐ |
| A.3.3 | Phân tích điểm yếu | "Bạn yếu Part 5 ngữ pháp, cần ôn lại thì" | ⭐⭐⭐ |

### 📊 Chỉ tiêu của A

| Chỉ tiêu | Mục tiêu |
|---|---|
| Số câu hỏi trong database | ≥ 120 câu (hiện 61) |
| Số bộ đề | ≥ 9 bộ (hiện 6) |
| Độ phủ 7 Parts | 7/7 Parts (hiện 4/7) |
| Tính năng mới hoàn thành | ≥ 3 tính năng |
| Lỗi nghiêm trọng | 0 |

### 🎤 Mẫu báo cáo của A

```markdown
## Tuần [X] — Thành viên A — Phần Luyện thi & Chấm điểm

### Đã làm:
- ✅ [Mã công việc] — mô tả — mã commit
- 🔄 [Công việc đang làm] — % hoàn thành

### Số liệu:
- Tổng câu hỏi: X/120 câu
- Tổng bộ đề: X/9 bộ
- Parts đã có: X/7

### Khó khăn:
- [Nếu có]

### Tuần sau sẽ làm:
- [Công việc tiếp theo]

### Cần hỗ trợ:
- [Từ B hoặc C nếu cần]
```

---

## 👤 THÀNH VIÊN B — Người phát triển tính năng AI thông minh

### 🎯 Vai trò
Thành viên B phụ trách **toàn bộ tính năng AI thông minh** — AI Tutor chat, AI giải thích đáp án, AI sinh câu hỏi, AI chấm viết, AI lập kế hoạch học, và các tính năng AI mới (speaking, hội thoại thực hành...).

### 📦 Các file phụ trách

```
src/components/ai/                    ← Giao diện AI
├── tutor-view.tsx                    ← Chat với AI Tutor
└── tools-view.tsx                    ← Công cụ AI (3 tab: Sinh câu hỏi, Chấm viết, Lập kế hoạch)

src/app/api/ai/                       ← API AI
├── chat/route.ts                     ← Chat với AI Tutor
├── explain/route.ts                  ← AI giải thích đáp án
├── generate-question/route.ts        ← AI sinh câu hỏi
├── writing-check/route.ts            ← AI chấm viết
├── study-plan/route.ts               ← AI lập kế hoạch học
└── provider/route.ts                 ← Thông tin AI đang dùng

src/lib/ai.ts                         ← Bộ chuyển đổi 6 nhà cung cấp AI
src/lib/use-language.tsx              ← Nút chọn ngôn ngữ AI (VN/EN/Song ngữ)
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- 5 tính năng AI đã hoạt động: chat, giải thích, sinh câu hỏi, chấm viết, lập kế hoạch
- Hỗ trợ 6 nhà cung cấp AI (ZAI/Ollama/OpenAI/OpenRouter/Groq/Gemini)
- 3 ngôn ngữ AI trả lời: Tiếng Việt / Song ngữ / English
- Huy hiệu hiển thị AI đang dùng trong giao diện

### 🔨 Danh sách công việc chi tiết

#### **Giai đoạn 1 — Nghiên cứu & Chuẩn bị (Tuần 1)**

| Mã | Công việc | Mô tả | Kết quả | Độ khó |
|---|---|---|---|---|
| B.1.1 | Nghiên cứu Web Speech API | Tìm hiểu SpeechRecognition + SpeechSynthesis | Tài liệu kỹ thuật | ⭐⭐ |
| B.1.2 | Nghiên cứu chấm điểm phát âm | Cách chấm phát âm (độ chính xác, độ trôi chảy) | Tài liệu phương pháp | ⭐⭐⭐⭐ |
| B.1.3 | Test đa nhà cung cấp trên máy | Kiểm tra Ollama/OpenAI/Gemini hoạt động | Báo cáo test | ⭐⭐ |
| B.1.4 | Thiết kế API mới | `POST /api/ai/speaking-score`, `POST /api/ai/conversation` | Tài liệu đặc tả API | ⭐⭐⭐ |

#### **Giai đoạn 2 — AI Speaking & Writing Test (Tuần 2–3)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| B.2.1 | Giao diện AI Speaking Test | Ghi âm, hiển thị waveform, phát lại | ⭐⭐⭐⭐ |
| B.2.2 | Chấm điểm Speaking | API chuyển giọng nói → văn bản, so sánh với text chuẩn, chấm điểm | ⭐⭐⭐⭐⭐ |
| B.2.3 | AI Writing Test | Giao diện soạn đoạn văn theo đề bài TOEIC, AI chấm theo rubric | ⭐⭐⭐⭐ |
| B.2.4 | Rubric chấm viết | AI chấm theo 4 tiêu chí: Ngữ pháp, Từ vựng, Mạch lạc, Đúng yêu cầu | ⭐⭐⭐ |

#### **Giai đoạn 3 — Học thông minh (Tuần 4–5)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| B.3.1 | AI Hội thoại thực hành | Chat theo tình huống (đặt nhà hàng, họp, phỏng vấn...) | ⭐⭐⭐⭐ |
| B.3.2 | AI Gợi ý từ vựng | Gợi ý từ vựng dựa trên câu người dùng hay sai | ⭐⭐⭐ |
| B.3.3 | AI Điều chỉnh độ khó | Thuật toán tăng/giảm độ khó theo năng lực | ⭐⭐⭐⭐ |
| B.3.4 | AI Phân tích tiến độ | AI phân tích tiến độ, gợi ý bước tiếp theo | ⭐⭐⭐ |

#### **Giai đoạn 4 — Hoàn thiện (Tuần 6)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| B.4.1 | Phản hồi streaming | AI Tutor trả text realtime (đỡ phải chờ) | ⭐⭐⭐ |
| B.4.2 | Lưu lịch sử hội thoại | Lưu lịch sử chat vào database, tiếp tục lần sau | ⭐⭐⭐ |
| B.4.3 | Chọn giọng đọc | Cho người dùng chọn giọng TTS (nam/nữ, Mỹ/Anh) | ⭐⭐ |

### 📊 Chỉ tiêu của B

| Chỉ tiêu | Mục tiêu |
|---|---|
| Tính năng AI mới | ≥ 4 tính năng (Speaking, Writing, Hội thoại, Gợi ý từ vựng) |
| Nhà cung cấp AI hỗ trợ | ≥ 6 (đã có) |
| Độ trễ phản hồi AI | ≤ 10 giây (có streaming) |
| Lưu lịch sử chat | Có |
| Lỗi AI | 0 (timeout, lỗi parse) |

### 🎤 Mẫu báo cáo của B

```markdown
## Tuần [X] — Thành viên B — AI & Tính năng thông minh

### Đã làm:
- ✅ [Mã công việc] — mô tả — mã commit
- 🔄 [Công việc đang làm] — % hoàn thành

### Số liệu:
- Tính năng AI: X/9 tính năng
- Nhà cung cấp hỗ trợ: 6/6
- Thời gian phản hồi AI trung bình: X giây

### Khó khăn:
- [Nếu có — đặc biệt giới hạn API, chất lượng model]

### Tuần sau sẽ làm:
- [Công việc tiếp theo]

### Cần hỗ trợ:
- [Từ A: cần API dữ liệu attempt cho bộ gợi ý từ vựng]
- [Từ C: cần giao diện cho speaking test]
```

---

## 👤 THÀNH VIÊN C — Kỹ sư Trải nghiệm & Tăng trưởng

### 🎯 Vai trò
Thành viên C phụ trách **trải nghiệm người dùng + tăng trưởng** — trang chủ, dashboard, luồng đăng nhập, trung tâm học, game hóa, bảng xếp hạng, thành tựu, thông báo, mobile PWA.

### 📦 Các file phụ trách

```
src/components/home/                   ← Trang chủ
└── home-view.tsx                      ← Trang landing

src/components/site/                   ← Khung website
├── navbar.tsx                         ← Thanh điều hướng + menu
├── footer.tsx                         ← Chân trang sticky
├── theme-provider.tsx                 ← Chế độ tối
├── theme-toggle.tsx                   ← Nút bật/tắt tối/sáng
└── language-toggle.tsx                ← Nút chọn ngôn ngữ AI

src/components/dashboard/              ← Bảng theo dõi tiến trình
└── dashboard-view.tsx                 ← Số liệu + biểu đồ + lịch sử thi

src/components/auth/                   ← Luồng đăng nhập
├── auth-modal.tsx                     ← Hộp thoại đăng nhập/đăng ký
└── user-menu.tsx                      ← Menu thả xuống avatar

src/components/learn/                  ← Trung tâm học tập
├── learn-view.tsx                     ← Trang hub chính
├── grammar-list.tsx                  ← Danh sách bài ngữ pháp
├── grammar-detail.tsx                ← Chi tiết 1 bài ngữ pháp
├── vocab-flashcards.tsx              ← Thẻ từ vựng lật + ôn tập gián đoạn
└── strategies-view.tsx               ← Chiến thuật TOEIC
```

### ✅ Tình trạng hiện tại (đã có sẵn)

- Trang chủ đẹp với hero, tính năng, tổng quan cấu trúc TOEIC
- Dashboard với 4 thẻ số liệu + 2 biểu đồ (Recharts)
- Hộp thoại đăng nhập (tab đăng nhập/đăng ký, thước đo độ mạnh mật khẩu)
- Menu người dùng thả xuống (avatar, đăng xuất)
- Trung tâm học (bài ngữ pháp, thẻ từ vựng, chiến thuật)
- Chế độ tối + nút chọn ngôn ngữ

### 🔨 Danh sách công việc chi tiết

#### **Giai đoạn 1 — Hồ sơ & Quản lý người dùng (Tuần 1–2)**

| Mã | Công việc | Mô tả | Kết quả | Độ khó |
|---|---|---|---|---|
| C.1.1 | Trang hồ sơ | Xem/sửa thông tin, điểm mục tiêu, avatar | Trang mới | ⭐⭐⭐ |
| C.1.2 | Tải avatar lên | Cho người dùng tải ảnh đại diện | API tải file | ⭐⭐⭐ |
| C.1.3 | Đổi mật khẩu | Form đổi mật khẩu | Hộp thoại mới | ⭐⭐ |
| C.1.4 | Cài đặt tài khoản | Ngôn ngữ ưa thích, tùy chọn thông báo | Trang cài đặt | ⭐⭐ |

#### **Giai đoạn 2 — Game hóa (Tuần 3–4)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| C.2.1 | Schema database game hóa | Thêm bảng Achievement, UserAchievement, Streak | ⭐⭐⭐ |
| C.2.2 | Bộ đếm chuỗi ngày học | Đếm số ngày học liên tục, hiển thị ở thanh điều hướng | ⭐⭐⭐ |
| C.2.3 | Hệ thống thành tựu | Huy hiệu: "Bài test đầu tiên", "Học 7 ngày liên tiếp", "Điểm 800+", "100 câu hỏi" | ⭐⭐⭐⭐ |
| C.2.4 | Giao diện thành tựu | Hiển thị huy hiệu trong hồ sơ + thông báo khi mở khóa | ⭐⭐⭐ |
| C.2.5 | Hệ thống điểm XP & Cấp độ | Tích điểm XP, lên cấp theo mốc | ⭐⭐⭐ |

#### **Giai đoạn 3 — Xã hội & Tăng trưởng (Tuần 5)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| C.3.1 | Bảng xếp hạng | Xếp hạng người học theo điểm trung bình | ⭐⭐⭐ |
| C.3.2 | Bộ lọc bảng xếp hạng | Lọc theo tuần/tháng/toàn thời gian, theo part | ⭐⭐ |
| C.3.3 | Chia sẻ kết quả | Chia sẻ điểm lên mạng xã hội (dạng ảnh card) | ⭐⭐⭐ |
| C.3.4 | Hệ thống bạn bè | Thêm bạn, xem tiến độ bạn bè | ⭐⭐⭐⭐ |

#### **Giai đoạn 4 — Mobile & Thông báo (Tuần 6)**

| Mã | Công việc | Mô tả | Độ khó |
|---|---|---|---|
| C.4.1 | Thiết lập PWA | Manifest.json, service worker, có thể cài đặt | ⭐⭐⭐ |
| C.4.2 | Thông báo đẩy | Nhắc nhở học hàng ngày qua browser notification | ⭐⭐⭐⭐ |
| C.4.3 | Tinh chỉnh mobile | Thanh điều hướng dưới, vùng chạm, cử chỉ | ⭐⭐⭐ |
| C.4.4 | Chế độ offline | Cache bài học/từ vựng để xem không cần internet | ⭐⭐⭐⭐ |

### 📊 Chỉ tiêu của C

| Chỉ tiêu | Mục tiêu |
|---|---|
| Trang mới | ≥ 3 (Hồ sơ, Bảng xếp hạng, Cài đặt) |
| Tính năng game hóa | ≥ 5 (Chuỗi ngày, Thành tựu, XP, Bảng xếp hạng, Chia sẻ) |
| PWA có thể cài đặt | Có |
| Responsive mobile | 100% (test trên iPhone SE, iPad) |
| Điểm Lighthouse | ≥ 90 (Hiệu năng, Trợ năng, PWA) |

### 🎤 Mẫu báo cáo của C

```markdown
## Tuần [X] — Thành viên C — Trải nghiệm & Tăng trưởng

### Đã làm:
- ✅ [Mã công việc] — mô tả — mã commit
- 🔄 [Công việc đang làm] — % hoàn thành

### Số liệu:
- Trang mới: X/3
- Tính năng game hóa: X/5
- Điểm Lighthouse: X/100
- Responsive mobile: Có/Không

### Khó khăn:
- [Nếu có — đặc biệt thiết lập PWA]

### Tuần sau sẽ làm:
- [Công việc tiếp theo]

### Cần hỗ trợ:
- [Từ A: cần API /api/leaderboard]
- [Từ B: cần AI insight cho trang tiến độ]
```

---

## 🔗 ĐIỂM GIAO TIẾP GIỮA 3 THÀNH VIÊN

### A ↔ B (Luyện thi ↔ AI)

| Giao tiếp | Chi tiết |
|---|---|
| A gọi B | A dùng `/api/ai/explain` (đã có) để AI giải thích câu sai trong trang kết quả |
| A cần B thêm | A làm Speaking Test → nhờ B tạo `/api/ai/speaking-score` |
| B cần A | B làm AI Điều chỉnh độ khó → cần A chia sẻ logic chấm điểm hiện tại |
| **Quy tắc API** | B phải commit đặc tả API trước khi A tích hợp |

### A ↔ C (Luyện thi ↔ Trải nghiệm)

| Giao tiếp | Chi tiết |
|---|---|
| A lưu → C đọc | A lưu `TestAttempt` vào database → C đọc để hiển thị Dashboard (đã có) |
| C cần A | C làm Bảng xếp hạng → cần A thêm API `/api/leaderboard` hoặc C tự query từ TestAttempt |
| A cần C | A làm Chế độ thi thật → nhờ C thiết kế giao diện cho nút chuyển chế độ |
| **Quy tắc** | Không sửa schema của nhau — nếu cần thêm trường → thảo luận trước |

### B ↔ C (AI ↔ Trải nghiệm)

| Giao tiếp | Chi tiết |
|---|---|
| B làm component → C tích hợp | B tạo `<SpeakingTest />` → C import vào trang Practice hoặc Tools |
| C cần B | C làm trang Hồ sơ → cần B thêm API `/api/user/stats` (AI insights) |
| B cần C | B làm lịch sử hội thoại → cần C thiết kế giao diện danh sách lịch sử |
| **Quy tắc** | Component của B phải có props rõ ràng, C chỉ việc import + render |

### 🤝 Họp đồng bộ hàng tuần

**Thứ 2 hàng tuần — 30 phút:**
- Mỗi người báo cáo: đã làm gì, khó khăn, kế hoạch tuần tới
- Thảo luận các API contract mới
- Giải quyết xung đột nếu có

**Standup hằng ngày (tùy chọn) — 10 phút mỗi sáng:**
- Hôm qua làm gì
- Hôm nay làm gì
- Có vướng mắc gì không

---

## 📅 LỊCH TRÌNH TỔNG QUAN

```
Tuần 1  │ A: Thêm Part 1,3,4      │ B: Nghiên cứu speech API  │ C: Giao diện trang hồ sơ
        │ A: Tạo Mock 100 câu     │ B: Thiết kế API contract │ C: Tải avatar lên
        │                         │                          │
Tuần 2  │ A: Chế độ thi thật      │ B: Giao diện Speaking    │ C: Bộ đếm chuỗi ngày
        │ A: Xem lại nâng cao     │ B: API chấm speaking      │ C: Schema thành tựu
        │                         │                          │
Tuần 3  │ A: Độ khó thích ứng     │ B: AI Writing Test        │ C: Giao diện thành tựu
        │ A: Đánh dấu câu hỏi     │ B: Rubric chấm viết       │ C: Hệ thống XP & Cấp độ
        │                         │                          │
Tuần 4  │ A: Tạm dừng/Tiếp tục    │ B: AI Hội thoại           │ C: Bảng xếp hạng
        │ A: Xuất PDF             │ B: Gợi ý từ vựng          │ C: Chia sẻ kết quả
        │                         │                          │
Tuần 5  │ A: So sánh tiến độ      │ B: AI Điều chỉnh độ khó   │ C: Thiết lập PWA
        │ A: Phân tích điểm yếu   │ B: AI Phân tích tiến độ   │ C: Thông báo đẩy
        │                         │                          │
Tuần 6  │ 🎉 TÍCH HỢP + TEST + HOÀN THIỆN + BÁO CÁO                          │
        │ Cả 3: Gộp nhánh, sửa xung đột, test end-to-end, demo
```

---

## 🛡️ QUY TRÌNH GIT AN TOÀN

### Thiết lập ban đầu (mỗi người làm 1 lần)

```bash
# Tải repo về
git clone https://github.com/username/toeic-ace-ai.git
cd toeic-ace-ai

# Cài dependencies
bun install

# Thiết lập env (copy từ .env.example)
cp .env.example .env
# Sửa .env: thêm NEXTAUTH_SECRET + chọn nhà cung cấp AI

# Thiết lập database
bun run db:push
bun run db:generate
bun run scripts/seed.ts

# Chạy dev server để kiểm tra
bun run dev
```

### Quy trình hằng ngày

```bash
# 1. Đầu ngày: đồng bộ code mới nhất
git checkout main
git pull origin main

# 2. Tạo/chuyển sang nhánh của mình
git checkout -b feat/luyen-thi        # A
git checkout -b feat/ai-features       # B
git checkout -b feat/trai-nghiem       # C

# 3. Làm việc + commit nhỏ
git add .
git commit -m "feat(A): thêm Part 1 mô tả ảnh"

# 4. Đẩy lên nhánh
git push origin feat/luyen-thi

# 5. Cuối task: tạo Pull Request trên GitHub
#    → Điền mẫu PR (xem dưới)
#    → Tag 2 người kia review
```

### Mẫu Pull Request

```markdown
## PR: [Tên tính năng]

### Mô tả
[Mô tả ngắn gọn tính năng]

### Loại thay đổi
- [ ] Tính năng mới
- [ ] Sửa lỗi
- [ ] Tái cấu trúc
- [ ] Tài liệu

### Các file thay đổi
- `src/components/practice/test-engine.tsx` — thêm Chế độ thi thật
- `src/app/api/attempts/route.ts` — thêm trường mode

### Ảnh chụp màn hình
[Nếu có thay đổi giao diện]

### Kiểm tra
- [x] `bun run lint` pass
- [x] Test thủ công pass
- [x] Không phá tính năng hiện có

### Người review
@teammate-b @teammate-c
```

---

## 📊 BÁO CÁO CUỐI KỲ (cho 3 người)

Mỗi người làm 1 phần báo cáo:

### Mẫu báo cáo cuối kỳ

```markdown
# Báo cáo cuối kỳ — [Tên thành viên] — [Module]

## 1. Tổng quan
- Module phụ trách: [tên module]
- Thời gian: [ngày bắt đầu] — [ngày kết thúc]
- Số commit: X
- Số PR đã gộp: X

## 2. Tính năng đã hoàn thành
| Mã | Tên tính năng | Trạng thái | Link PR |
|---|---|---|---|
| A.1.1 | Part 1 mô tả ảnh | ✅ Xong | #12 |
| A.1.2 | Part 3 hội thoại | ✅ Xong | #15 |
| ... | ... | ... | ... |

## 3. Số liệu
- Số dòng code mới: X dòng
- File mới: X
- File sửa: X
- Test pass: X%

## 4. Khó khăn & giải pháp
- [Khó khăn 1] → [giải pháp]
- [Khó khăn 2] → [giải pháp]

## 5. Đóng góp cho team
- Review PR của [tên]: X lần
- Hỗ trợ [tên] sửa lỗi: [mô tả]

## 6. Bài học
- [Bài học kỹ thuật]
- [Bài học kỹ năng mềm]

## 7. Định hướng tương lai
- [Tính năng muốn phát triển tiếp]
```

---

## 📞 LIÊN HỆ & HỖ TRỢ

| Vấn đề | Cách xử lý |
|---|---|
| Xung đột code | Họp nhóm 3 người giải quyết |
| Lỗi không sửa được | Tạo issue trên GitHub, tag team |
| Cần review gấp | Nhắn trên Discord/Slack |
| Đổi schema database | **BẮT BUỘC** họp nhóm 3 người trước |
| Đổi API contract | **BẮT BUỘC** báo cho người dùng API đó biết |

---

## 📚 TÀI LIỆU THAM KHẢO

| Tài liệu | Link |
|---|---|
| Next.js 16 | https://nextjs.org/docs |
| Prisma | https://www.prisma.io/docs |
| shadcn/ui | https://ui.shadcn.com |
| NextAuth.js | https://next-auth.js.org |
| Tailwind CSS 4 | https://tailwindcss.com |
| ZAI SDK | (nội bộ) |
| Ollama | https://ollama.com |
| OpenAI API | https://platform.openai.com/docs |
| Recharts | https://recharts.org |
| Framer Motion | https://www.framer.com/motion |

---

## ✅ CHECKLIST TRƯỚC KHI BÁO CÁO

Mỗi cuối tuần, mỗi thành viên kiểm tra:

- [ ] Tất cả công việc tuần này đã commit + push
- [ ] Đã tạo PR cho các task hoàn thành
- [ ] Đã review ít nhất 1 PR của đồng đội
- [ ] `bun run lint` pass
- [ ] Test thủ công trên trình duyệt pass
- [ ] Cập nhật TEAM_TASKS.md (đánh dấu task ✅)
- [ ] Viết báo cáo tuần theo mẫu
- [ ] Không có lỗi nghiêm trọng chưa sửa

---

**🎉 Chúc team 3 người làm việc hiệu quả và hoàn thành dự án thành công!**
