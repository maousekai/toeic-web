// =====================================================================
//  ĐỀ ETS TOEIC — CẤU HÌNH BỘ ĐỀ TỪ GOOGLE DRIVE
// =====================================================================
//  Cách thêm bộ đề ETS mới:
//  1. Tạo folder trong public/ets-exams/<year>/ (vd: public/ets-exams/2024/)
//  2. Copy 4 file vào folder đó:
//     - listening.pdf     (đề listening)
//     - reading.pdf       (đề reading)
//     - audio.mp3         (file audio listening)
//     - transcript.pdf    (đáp án + transcript)
//  3. Copy mảng dưới, đổi year + title
//  4. (Tùy chọn) Thêm driveUrl để user có thể tải từ Google Drive
// =====================================================================

export type EtsResource = {
  id: string
  year: number
  title: string
  description: string
  driveUrl?: string          // Link Google Drive folder (mở trong tab mới)
  files: {
    listening?: string       // Path relative to public/ (vd: /ets-exams/2024/listening.pdf)
    reading?: string
    audio?: string           // .mp3 file
    transcript?: string      // Đáp án + transcript
  }
  durationMin: number        // Thời lượng làm bài đề xuất
  difficulty: 'easy' | 'medium' | 'hard'
}

export const ETS_EXAMS: EtsResource[] = [
  {
    id: 'ets-2024',
    year: 2024,
    title: 'Đề ETS TOEIC 2024',
    description: 'Bộ đề ETS TOEIC chính thức năm 2024 — gồm 4 phần: Listening (PDF + Audio), Reading (PDF), Đáp án + Transcript (PDF). Đề thi thật của ETS, độ khó chuẩn like exam day.',
    driveUrl: 'https://drive.google.com/drive/folders/your-folder-id', // ← Thay bằng link Drive thật
    files: {
      listening: '/ets-exams/2024/listening.pdf',
      reading: '/ets-exams/2024/reading.pdf',
      audio: '/ets-exams/2024/audio.mp3',
      transcript: '/ets-exams/2024/transcript.pdf',
    },
    durationMin: 120,
    difficulty: 'medium',
  },
  // ─── Cách thêm đề ETS 2023 ───
  // {
  //   id: 'ets-2023',
  //   year: 2023,
  //   title: 'Đề ETS TOEIC 2023',
  //   description: 'Bộ đề ETS 2023...',
  //   driveUrl: 'https://drive.google.com/...',
  //   files: {
  //     listening: '/ets-exams/2023/listening.pdf',
  //     reading: '/ets-exams/2023/reading.pdf',
  //     audio: '/ets-exams/2023/audio.mp3',
  //     transcript: '/ets-exams/2023/transcript.pdf',
  //   },
  //   durationMin: 120,
  //   difficulty: 'medium',
  // },
]
