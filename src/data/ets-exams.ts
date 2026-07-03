// =====================================================================
//  ĐỀ ETS TOEIC — CẤU HÌNH BỘ ĐỀ TỪ GOOGLE DRIVE
// =====================================================================
//  Mỗi bộ ETS (vd: 2024) có thể chứa NHIỀU TEST (Test 1, Test 2, ... Test 10)
//  Mỗi test gồm 4 file: listening.pdf, reading.pdf, audio.mp3, transcript.pdf
//
//  Cách thêm bộ đề ETS mới:
//  1. Tạo folder trong public/ets-exams/<year>/<test>/ (vd: public/ets-exams/2024/test-1/)
//  2. Copy 4 file vào folder đó:
//     - listening.pdf     (đề listening của test đó)
//     - reading.pdf       (đề reading của test đó)
//     - audio.mp3         (file audio listening của test đó)
//     - transcript.pdf    (đáp án + transcript của test đó)
//  3. Copy mảng dưới, đổi year + title + thêm các test
//  4. (Tùy chọn) Thêm driveUrl để user có thể tải từ Google Drive
// =====================================================================

export type EtsTest = {
  id: string                 // 'test-1', 'test-2', ...
  label: string              // 'Test 1', 'Test 2', ...
  files: {
    listening?: string       // path to PDF
    reading?: string
    audio?: string           // path to MP3
    transcript?: string      // path to PDF (đáp án + transcript)
  }
}

export type EtsResource = {
  id: string                 // 'ets-2024'
  year: number
  title: string              // 'Đề ETS TOEIC 2024'
  description: string
  driveUrl?: string          // Link Google Drive folder (mở trong tab mới)
  durationMin: number        // Thời lượng làm bài đề xuất mỗi test
  difficulty: 'easy' | 'medium' | 'hard'
  tests: EtsTest[]           // Mảng các test trong bộ đề
}

// Helper: tạo path chuẩn cho 1 test
function testFiles(year: number, testNum: number) {
  return {
    listening: `/ets-exams/${year}/test-${testNum}/listening.pdf`,
    reading: `/ets-exams/${year}/test-${testNum}/reading.pdf`,
    audio: `/ets-exams/${year}/test-${testNum}/audio.mp3`,
    transcript: `/ets-exams/${year}/test-${testNum}/transcript.pdf`,
  }
}

export const ETS_EXAMS: EtsResource[] = [
  {
    id: 'ets-2024',
    year: 2024,
    title: 'Đề ETS TOEIC 2024',
    description: 'Bộ đề ETS TOEIC chính thức năm 2024 — gồm 10 test đầy đủ. Mỗi test có 4 phần: Listening (PDF + Audio), Reading (PDF), Đáp án + Transcript (PDF). Đề thi thật của ETS, độ khó chuẩn like exam day.',
    driveUrl: 'https://drive.google.com/drive/folders/your-folder-id', // ← Thay bằng link Drive thật
    durationMin: 120,
    difficulty: 'medium',
    tests: [
      { id: 'test-1', label: 'Test 1', files: testFiles(2024, 1) },
      { id: 'test-2', label: 'Test 2', files: testFiles(2024, 2) },
      { id: 'test-3', label: 'Test 3', files: testFiles(2024, 3) },
      { id: 'test-4', label: 'Test 4', files: testFiles(2024, 4) },
      { id: 'test-5', label: 'Test 5', files: testFiles(2024, 5) },
      { id: 'test-6', label: 'Test 6', files: testFiles(2024, 6) },
      { id: 'test-7', label: 'Test 7', files: testFiles(2024, 7) },
      { id: 'test-8', label: 'Test 8', files: testFiles(2024, 8) },
      { id: 'test-9', label: 'Test 9', files: testFiles(2024, 9) },
      { id: 'test-10', label: 'Test 10', files: testFiles(2024, 10) },
    ],
  },
  // ─── Cách thêm đề ETS 2023 ───
  // {
  //   id: 'ets-2023',
  //   year: 2023,
  //   title: 'Đề ETS TOEIC 2023',
  //   description: 'Bộ đề ETS 2023 — gồm 10 test...',
  //   driveUrl: 'https://drive.google.com/...',
  //   durationMin: 120,
  //   difficulty: 'medium',
  //   tests: [
  //     { id: 'test-1', label: 'Test 1', files: testFiles(2023, 1) },
  //     { id: 'test-2', label: 'Test 2', files: testFiles(2023, 2) },
  //     // ... thêm các test khác
  //   ],
  // },
]
