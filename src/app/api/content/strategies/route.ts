import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const strategies = await db.strategy.findMany({ orderBy: { createdAt: 'asc' } })
    
    if (strategies.length > 0) {
      return NextResponse.json({ strategies })
    }

    // Mock data fallback if DB is empty
    const mockStrategies = [
      {
        id: '1',
        title: 'Mẹo Nghe Part 1: Hình Ảnh',
        slug: 'listening-part-1',
        section: 'listening',
        content: '### Cách làm Part 1 hiệu quả\n\n- Quan sát toàn cảnh bức tranh trước khi nghe.\n- Xác định chủ thể (người hay vật) và hành động chính.\n- **Lưu ý:** Các đáp án thường có "bẫy" từ đồng âm hoặc tả sai hành động.\n- Nghe kỹ các động từ V-ing.'
      },
      {
        id: '2',
        title: 'Chiến thuật Reading Part 5',
        slug: 'reading-part-5',
        section: 'reading',
        content: '### Điền từ vào chỗ trống\n\n- Đừng đọc vội cả câu, hãy nhìn từ trước và sau chỗ trống.\n- Xác định loại từ cần điền (danh từ, động từ, tính từ, trạng từ).\n- Học thuộc các cụm từ cố định (collocations) để tăng tốc độ làm bài.'
      },
      {
        id: '3',
        title: 'Mẹo quản lý thời gian ngày thi',
        slug: 'time-management',
        section: 'test-day',
        content: '### Canh giờ Reading\n\n- Part 5 & 6: Tối đa 20 phút.\n- Part 7 (Đoạn đơn): Tối đa 25 phút.\n- Part 7 (Đoạn kép/ba): 30 phút còn lại.\n- Nếu bí câu nào, đánh lụi và chuyển qua câu khác ngay lập tức, không để mất quá 1 phút cho 1 câu.'
      }
    ]

    return NextResponse.json({ strategies: mockStrategies })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch strategies' }, { status: 500 })
  }
}
