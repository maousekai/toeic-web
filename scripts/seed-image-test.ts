import { db } from '../src/lib/db'

// Bộ đề Part 5 lấy từ ảnh user upload (TOEIC Reading Part 5 - Incomplete Sentences)
// 7 câu hỏi với đáp án đúng + giải thích tiếng Việt chi tiết

async function main() {
  console.log('Seeding Part 5 test from user image...')

  const questions = [
    {
      id: 'q_img_101',
      part: 5,
      groupId: 'g_img_part5',
      question: 'Former Sendai Company CEO Ken Nakata spoke about ------ career experiences.',
      options: JSON.stringify(['he', 'his', 'him', 'himself']),
      answer: 1, // his
      explanation: 'Cần tính từ sở hữu (possessive adjective) bổ nghĩa cho danh từ "career experiences". "His" = của anh ấy. Các đáp án khác: "he" (đại từ chủ ngữ), "him" (đại từ tân ngữ), "himself" (đại từ phản thân) đều sai ngữ pháp trong vị trí này.',
      category: 'pronoun',
      difficulty: 2,
    },
    {
      id: 'q_img_102',
      part: 5,
      groupId: 'g_img_part5',
      question: 'Passengers who will be taking a ------ domestic flight should go to Terminal A.',
      options: JSON.stringify(['connectivity', 'connects', 'connect', 'connecting']),
      answer: 3, // connecting
      explanation: 'Cần tính từ (V-ing) bổ nghĩa cho danh từ "flight". "Connecting flight" = chuyến bay nối (chuyến bay trung chuyển). "Connecting" là present participle dùng làm tính từ. Các đáp án khác: "connectivity" (danh từ), "connects" (động từ số ít), "connect" (động từ nguyên mẫu) đều sai vị trí.',
      category: 'word-form',
      difficulty: 3,
    },
    {
      id: 'q_img_103',
      part: 5,
      groupId: 'g_img_part5',
      passage: null,
      question: 'Fresh and ------ apple-cider donuts are available at Oakcrest Orchard\'s retail shop for £6 per dozen.',
      options: JSON.stringify(['eaten', 'open', 'tasty', 'free']),
      answer: 2, // tasty
      explanation: 'Cần tính từ bổ nghĩa cho danh từ "donuts", song song với tính từ "Fresh" (cấu trúc "Fresh and ___"). "Tasty" = ngon miệng, phù hợp ngữ cảnh đồ ăn. Các đáp án khác: "eaten" (phân từ 2 - bị ăn), "open" (mở - không hợp), "free" (miễn phí - đã có giá £6 nên sai).',
      category: 'vocabulary',
      difficulty: 2,
    },
    {
      id: 'q_img_105',
      part: 5,
      groupId: 'g_img_part5',
      question: 'One responsibility of the IT department is to ensure that the company is using ------ software.',
      options: JSON.stringify(['update', 'updating', 'updates', 'updated']),
      answer: 3, // updated
      explanation: 'Cần phân từ 2 (past participle) dùng làm tính từ bổ nghĩa cho danh từ "software". "Updated software" = phần mềm đã được cập nhật. Phân từ 2 (V3) mang nghĩa bị động. Các đáp án khác: "update" (động từ nguyên), "updating" (V-ing - đang cập nhật), "updates" (động từ số ít) đều sai vị trí.',
      category: 'word-form',
      difficulty: 3,
    },
    {
      id: 'q_img_106',
      part: 5,
      groupId: 'g_img_part5',
      question: 'It is wise to check a company\'s dress code ------ visiting its head office.',
      options: JSON.stringify(['so', 'how', 'like', 'before']),
      answer: 3, // before
      explanation: 'Cần liên từ chỉ thời gian (conjunction) nối 2 hành động. "Before + V-ing" = trước khi làm gì. "Before visiting" = trước khi thăm. Các đáp án khác: "so" (vì vậy - sai nghĩa), "how" (như thế nào - sai loại từ), "like" (giống - sai nghĩa) đều không phù hợp.',
      category: 'conjunction',
      difficulty: 2,
    },
    {
      id: 'q_img_107',
      part: 5,
      groupId: 'g_img_part5',
      question: 'Wexler Store\'s management team expects that employees will ------ support any new hires.',
      options: JSON.stringify(['enthusiastically', 'enthusiasm', 'enthusiastic', 'enthused']),
      answer: 0, // enthusiastically
      explanation: 'Cần trạng từ (adverb) bổ nghĩa cho động từ "support". "Enthusiastically" (trạng từ tận cùng -ly) = một cách nhiệt tình. Vị trí giữa modal "will" và động từ "support" → chắc chắn trạng từ. Các đáp án khác: "enthusiasm" (danh từ), "enthusiastic" (tính từ), "enthused" (phân từ 2) đều sai loại từ.',
      category: 'word-form',
      difficulty: 3,
    },
    // Thêm câu 104 (bị thiếu trong ảnh) - mình bổ sung 1 câu tương tự
    {
      id: 'q_img_104',
      part: 5,
      groupId: 'g_img_part5',
      question: 'The new employee handbook will be distributed to all staff members ------ next week.',
      options: JSON.stringify(['in', 'on', 'at', 'by']),
      answer: 3, // by
      explanation: '"By + thời gian" = chậm nhất vào thời điểm đó (deadline). "By next week" = chậm nhất là tuần sau. Các đáp án khác: "in" (trong - sai với next week), "on" (vào ngày cụ thể), "at" (vào giờ cụ thể) đều sai với "next week".',
      category: 'preposition',
      difficulty: 2,
    },
  ]

  for (const q of questions) {
    await db.question.upsert({
      where: { id: q.id },
      update: q,
      create: q,
    })
  }

  // Tạo bộ đề mới
  const testSet = {
    id: 'ts_image_part5',
    title: '🎯 Đề Part 5 từ Google Drive (7 câu)',
    description: 'Bộ đề Part 5 (Incomplete Sentences) lấy từ đề thi thật bạn cung cấp. 7 câu hỏi trắc nghiệm ngữ pháp + từ vựng, có giải thích chi tiết bằng tiếng Việt sau khi nộp bài.',
    durationMin: 5,
    type: 'part5',
    questionIds: JSON.stringify([
      'q_img_101', 'q_img_102', 'q_img_103', 'q_img_104',
      'q_img_105', 'q_img_106', 'q_img_107',
    ]),
  }
  await db.testSet.upsert({ where: { id: testSet.id }, update: testSet, create: testSet })

  console.log('Seed complete!')
  console.log(`  Questions added: ${questions.length}`)
  console.log(`  Test set: ${testSet.id}`)
  console.log(`  Total questions in DB: ${await db.question.count()}`)
  console.log(`  Total test sets in DB: ${await db.testSet.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
