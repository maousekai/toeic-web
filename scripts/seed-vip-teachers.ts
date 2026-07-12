/**
 * Seed VIP packages + sample teacher accounts.
 * Run: bun run scripts/seed-vip-teachers.ts
 */
import bcrypt from 'bcryptjs'
import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding VIP packages...')

  const packages = [
    {
      name: 'VIP Tháng',
      price: 199000,
      durationDays: 30,
      features: JSON.stringify([
        'Chat trực tiếp với giáo viên 24/7',
        'Học 1-1 qua video call (tối đa 2 giờ/tháng)',
        'Truy cập toàn bộ đề thi + giải thích AI',
        'Flashcards không giới hạn',
      ]),
      color: 'emerald',
      popular: false,
    },
    {
      name: 'VIP Quý',
      price: 499000,
      durationDays: 90,
      features: JSON.stringify([
        'Chat trực tiếp với giáo viên 24/7',
        'Học 1-1 qua video call (tối đa 8 giờ/quý)',
        'Truy cập toàn bộ đề thi + giải thích AI',
        'Flashcards không giới hạn',
        'AI Study Plan cá nhân hoá',
        'Ưu tiên hỗ trợ',
      ]),
      color: 'teal',
      popular: true,
    },
    {
      name: 'VIP Năm',
      price: 1499000,
      durationDays: 365,
      features: JSON.stringify([
        'Chat trực tiếp với giáo viên 24/7',
        'Học 1-1 qua video call (tối đa 40 giờ/năm)',
        'Truy cập toàn bộ đề thi + giải thích AI',
        'Flashcards không giới hạn',
        'AI Study Plan cá nhân hoá',
        'Ưu tiên hỗ trợ cao nhất',
        'Tặng 2 đề thi ETS thật',
      ]),
      color: 'amber',
      popular: false,
    },
  ]

  for (const pkg of packages) {
    await db.vipPackage.upsert({
      where: { id: `pkg_${pkg.name.replace(/\s+/g, '_').toLowerCase()}` },
      update: pkg,
      create: { id: `pkg_${pkg.name.replace(/\s+/g, '_').toLowerCase()}`, ...pkg },
    })
  }
  console.log(`✅ ${packages.length} VIP packages`)

  // Seed sample teachers
  console.log('Seeding teachers...')
  const teachers = [
    { name: 'Ms. Sarah Johnson', email: 'sarah.teacher@toeic.com', bio: 'Giáo viên tiếng Anh 8 năm kinh nghiệm, chuyên TOEIC Listening. IELTS 8.5, TESOL certified.', subjects: 'TOEIC Listening, Pronunciation, Conversation', hourlyRate: 150000, rating: 4.9, totalLessons: 320 },
    { name: 'Mr. David Chen', email: 'david.teacher@toeic.com', bio: 'Cựu giám khảo TOEIC, 10 năm dạy Reading & Grammar. Đã giúp 500+ học viên đạt 800+.', subjects: 'TOEIC Reading, Grammar, Vocabulary', hourlyRate: 180000, rating: 5.0, totalLessons: 450 },
    { name: 'Ms. Linh Tran', email: 'linh.teacher@toeic.com', bio: 'Thạc sĩ Ngôn ngữ Anh (ĐH Ngoại thương). Dạy song ngữ Việt-Anh, đặc biệt phù hợp người mới bắt đầu.', subjects: 'TOEIC Listening, TOEIC Reading, Grammar', hourlyRate: 120000, rating: 4.8, totalLessons: 210 },
    { name: 'Mr. James Wilson', email: 'james.teacher@toeic.com', bio: 'Native speaker từ Mỹ. Chuyên luyện phát âm và giao tiếp công sở. 6 năm kinh nghiệm.', subjects: 'Pronunciation, Conversation, Business English', hourlyRate: 200000, rating: 4.9, totalLessons: 280 },
  ]

  for (const t of teachers) {
    const passwordHash = await bcrypt.hash('teacher123', 10)
    const user = await db.user.upsert({
      where: { email: t.email },
      update: { name: t.name, role: 'TEACHER' },
      create: { email: t.email, name: t.name, passwordHash, role: 'TEACHER' },
    })
    await db.teacher.upsert({
      where: { userId: user.id },
      update: {
        bio: t.bio,
        subjects: t.subjects,
        hourlyRate: t.hourlyRate,
        rating: t.rating,
        totalLessons: t.totalLessons,
        isOnline: Math.random() > 0.5,
      },
      create: {
        userId: user.id,
        bio: t.bio,
        subjects: t.subjects,
        hourlyRate: t.hourlyRate,
        rating: t.rating,
        totalLessons: t.totalLessons,
        isOnline: Math.random() > 0.5,
      },
    })
    console.log(`  ✅ ${t.name}`)
  }

  console.log('Done!')
  await db.$disconnect()
}

main().catch((e) => {
  console.error('❌ seed failed:', e)
  process.exit(1)
})
