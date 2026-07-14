import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const lessons = await db.grammarLesson.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, title: true, slug: true, category: true, level: true, summary: true, example: true },
    })

    if (lessons.length > 0) {
      return NextResponse.json({ lessons })
    }

    // Mock data fallback if DB is empty
    const mockLessons = [
      {
        id: '1',
        title: 'Thì Hiện tại hoàn thành (Present Perfect)',
        slug: 'present-perfect',
        category: 'Tenses',
        level: 'Intermediate',
        summary: 'Diễn tả hành động bắt đầu ở quá khứ và còn tiếp diễn đến hiện tại, hoặc kết quả ảnh hưởng đến hiện tại.',
        example: 'I have worked here for 3 years.'
      },
      {
        id: '2',
        title: 'Mệnh đề quan hệ (Relative Clauses)',
        slug: 'relative-clauses',
        category: 'Clauses',
        level: 'Upper-Intermediate',
        summary: 'Sử dụng who, whom, which, that để bổ nghĩa cho danh từ đứng trước nó.',
        example: 'The man who is standing there is my boss.'
      },
      {
        id: '3',
        title: 'Câu Bị động (Passive Voice)',
        slug: 'passive-voice',
        category: 'Verbs',
        level: 'Intermediate',
        summary: 'Dùng khi muốn nhấn mạnh vào đối tượng chịu tác động của hành động thay vì người thực hiện.',
        example: 'The report was finished yesterday.'
      }
    ]

    return NextResponse.json({ lessons: mockLessons })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch grammar lessons' }, { status: 500 })
  }
}
