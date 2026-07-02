# 📚 Đề ETS TOEIC — Hướng dẫn thêm bộ đề

Folder này chứa các file đề ETS TOEIC để hiển thị trực tiếp trên web.

## 🗂️ Cấu trúc folder

```
public/ets-exams/
├── 2024/                       ← Mỗi năm 1 folder
│   ├── listening.pdf           ← Đề Listening (PDF)
│   ├── reading.pdf             ← Đề Reading (PDF)
│   ├── audio.mp3               ← File audio Listening (MP3)
│   └── transcript.pdf          ← Đáp án + Transcript (PDF)
├── 2023/
│   ├── listening.pdf
│   ├── reading.pdf
│   ├── audio.mp3
│   └── transcript.pdf
└── README.md                   ← File này
```

## 📥 Cách thêm bộ đề ETS mới

### Bước 1: Tải file từ Google Drive

Vào Google Drive folder "ĐỀ ETS 2024" → tải 4 file:
- `AUDIO - ETS 2024` → đổi tên thành `audio.mp3`
- `ETS 2024 - LISTENING` → đổi tên thành `listening.pdf`
- `ETS 2024 - READING` → đổi tên thành `reading.pdf`
- `ĐÁP ÁN + TRANSCRIPT` → đổi tên thành `transcript.pdf`

### Bước 2: Copy vào folder web

```bash
# Tạo folder năm mới (nếu chưa có)
mkdir -p public/ets-exams/2024

# Copy 4 file vào folder đó
cp /path/to/audio.mp3       public/ets-exams/2024/audio.mp3
cp /path/to/listening.pdf   public/ets-exams/2024/listening.pdf
cp /path/to/reading.pdf     public/ets-exams/2024/reading.pdf
cp /path/to/transcript.pdf  public/ets-exams/2024/transcript.pdf
```

### Bước 3: Cập nhật file config

Mở file `src/data/ets-exams.ts` → thêm 1 object vào mảng `ETS_EXAMS`:

```typescript
{
  id: 'ets-2024',                              // ID duy nhất
  year: 2024,
  title: 'Đề ETS TOEIC 2024',
  description: 'Bộ đề ETS TOEIC chính thức năm 2024...',
  driveUrl: 'https://drive.google.com/drive/folders/xxx',  // Link Drive (tùy chọn)
  files: {
    listening: '/ets-exams/2024/listening.pdf',
    reading: '/ets-exams/2024/reading.pdf',
    audio: '/ets-exams/2024/audio.mp3',
    transcript: '/ets-exams/2024/transcript.pdf',
  },
  durationMin: 120,
  difficulty: 'medium',    // 'easy' | 'medium' | 'hard'
},
```

### Bước 4: Restart dev server

```bash
bun run dev
```

Vào trang **Practice** → section **"📚 Đề ETS TOEIC"** sẽ hiện card mới.

## ✨ Tính năng tự động

- ✅ **Tự phát hiện file**: Nếu file chưa upload → hiển thị thông báo + link Google Drive
- ✅ **PDF Viewer**: Hiển thị PDF trực tiếp trong modal (iframe)
- ✅ **Audio Player**: Play/pause/seek, hiển thị thời gian
- ✅ **Download**: Nút tải từng file về máy
- ✅ **Tabs**: Chuyển giữa Listening / Reading / Đáp án
- ✅ **Responsive**: Mobile + desktop

## 🎨 Tùy chọn

### Đặt link Google Drive (không cần upload file)

Nếu chỉ muốn link Drive mà không upload file vào web:

```typescript
{
  id: 'ets-2024',
  year: 2024,
  title: 'Đề ETS TOEIC 2024',
  description: '...',
  driveUrl: 'https://drive.google.com/drive/folders/xxx',
  files: {},           // ← Để trống
  durationMin: 120,
  difficulty: 'medium',
}
```

→ Card sẽ hiện nhưng khi click "Xem đề" sẽ hiển thị thông báo hướng dẫn mở Google Drive.

## ⚠️ Lưu ý bản quyền

- Đề ETS TOEIC là tài liệu có bản quyền của ETS
- Chỉ dùng cho mục đích học tập cá nhân, không phân phối lại
- Nếu deploy public, nên yêu cầu người dùng tự tải đề từ nguồn chính thức

## 🔄 Cập nhật bộ đề

Khi có đề ETS mới (vd: 2025):

1. Tạo folder `public/ets-exams/2025/`
2. Copy 4 file vào (đổi tên đúng)
3. Thêm object mới vào `src/data/ets-exams.ts`
4. Card mới sẽ tự xuất hiện trên web
