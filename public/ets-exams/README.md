# 📚 Đề ETS TOEIC — Hướng dẫn thêm bộ đề

Folder này chứa các file đề ETS TOEIC để hiển thị trực tiếp trên web.
**Mỗi bộ ETS có thể chứa NHIỀU TEST** (Test 1, Test 2, ... Test 10).

## 🗂️ Cấu trúc folder

```
public/ets-exams/
├── 2024/                              ← Mỗi năm 1 folder
│   ├── test-1/                        ← Mỗi test 1 folder con
│   │   ├── listening.pdf              ← Đề Listening của Test 1
│   │   ├── reading.pdf                ← Đề Reading của Test 1
│   │   ├── audio.mp3                  ← File audio Listening của Test 1
│   │   └── transcript.pdf             ← Đáp án + Transcript của Test 1
│   ├── test-2/
│   │   ├── listening.pdf
│   │   ├── reading.pdf
│   │   ├── audio.mp3
│   │   └── transcript.pdf
│   ├── test-3/ ... test-10/           ← Tương tự cho các test khác
│   └── README.md
├── 2023/                              ← Bộ ETS 2023 (cấu trúc tương tự)
│   ├── test-1/ ...
│   └── test-2/ ...
└── README.md                          ← File này
```

## 📥 Cách thêm bộ đề ETS mới

### Bước 1: Tải file từ Google Drive

Folder Drive "ĐỀ ETS 2024" thường có cấu trúc:
```
ETS 2024 - LISTENING/
  ├── TEST 1 LC.pdf
  ├── TEST 2 LC.pdf
  ├── ...
  └── TEST 10 LC.pdf

ETS 2024 - READING/
  ├── TEST 1 RC.pdf
  ├── ...
  └── TEST 10 RC.pdf

AUDIO - ETS 2024/
  ├── TEST 1.mp3
  ├── ...
  └── TEST 10.mp3

ĐÁP ÁN + TRANSCRIPT/
  ├── TEST 1 - ANSWER.pdf
  ├── ...
  └── TEST 10 - ANSWER.pdf
```

### Bước 2: Đổi tên + copy vào web

Cho mỗi test (1 → 10):

```bash
# Ví dụ với Test 1
mkdir -p public/ets-exams/2024/test-1

# Copy + đổi tên file
cp "TEST 1 LC.pdf"          public/ets-exams/2024/test-1/listening.pdf
cp "TEST 1 RC.pdf"          public/ets-exams/2024/test-1/reading.pdf
cp "TEST 1.mp3"             public/ets-exams/2024/test-1/audio.mp3
cp "TEST 1 - ANSWER.pdf"    public/ets-exams/2024/test-1/transcript.pdf

# Lặp lại cho Test 2, Test 3, ... Test 10
```

### Bước 3: Cập nhật file config

Mở file `src/data/ets-exams.ts` → thêm 1 object vào mảng `ETS_EXAMS`:

```typescript
{
  id: 'ets-2024',
  year: 2024,
  title: 'Đề ETS TOEIC 2024',
  description: 'Bộ đề ETS TOEIC chính thức năm 2024 — gồm 10 test...',
  driveUrl: 'https://drive.google.com/drive/folders/xxx',
  durationMin: 120,
  difficulty: 'medium',
  tests: [
    { id: 'test-1',  label: 'Test 1',  files: testFiles(2024, 1) },
    { id: 'test-2',  label: 'Test 2',  files: testFiles(2024, 2) },
    // ... đến test-10
  ],
},
```

### Bước 4: Restart dev server

```bash
bun run dev
```

Vào trang **Practice** → section **"📚 Đề ETS TOEIC"** sẽ hiện card mới.

## ✨ Tính năng tự động

- ✅ **Test selector**: Modal có dropdown chọn Test 1 → Test 10
- ✅ **Tự phát hiện file**: HEAD request kiểm tra file có tồn tại không
- ✅ **PDF Viewer**: Hiển thị PDF trực tiếp trong modal (iframe)
- ✅ **Audio Player**: Play/pause/seek, hiển thị thời gian
- ✅ **Download**: Nút tải từng file (Listening/Reading/Đáp án) về máy
- ✅ **Tabs**: Chuyển giữa Listening / Reading / Đáp án
- ✅ **Responsive**: Mobile + desktop

## 📋 Trên card Practice

Mỗi card ETS hiển thị:
- **Số tests**: Badge "10 tests"
- **Thời lượng**: Badge "120'"
- **Độ khó**: Badge "Dễ" / "TB" / "Khó"
- **Preview test list**: "Test 1, Test 2, ... +4"
- **Resource chips**: Listening, Reading, Audio, Đáp án

## ⚠️ Lưu ý bản quyền

- Đề ETS TOEIC là tài liệu có bản quyền của ETS
- Chỉ dùng cho mục đích học tập cá nhân, không phân phối lại
- Nếu deploy public, nên yêu cầu người dùng tự tải đề từ nguồn chính thức

## 🔄 Cập nhật / Thêm test mới

Khi có test mới (vd: thêm Test 11 cho ETS 2024):

1. Tạo folder `public/ets-exams/2024/test-11/`
2. Copy 4 file vào (đổi tên đúng)
3. Thêm dòng `{ id: 'test-11', label: 'Test 11', files: testFiles(2024, 11) },` vào mảng tests trong `src/data/ets-exams.ts`
4. Card sẽ tự cập nhật số tests + dropdown
