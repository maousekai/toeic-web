'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'vi' | 'en' | 'bi'

const STORAGE_KEY = 'toeic_ai_language'
const DEFAULT_LANGUAGE: Language = 'vi'

const LABELS: Record<Language, { short: string; long: string; flag: string }> = {
  vi: { short: 'VI', long: 'Tiếng Việt', flag: '🇻🇳' },
  en: { short: 'EN', long: 'English', flag: '🇬🇧' },
  bi: { short: 'VI+EN', long: 'Song ngữ', flag: '🌐' },
}

// UI translation dictionary
const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navbar
  'nav.home': { vi: 'Trang chủ', en: 'Home', bi: 'Home' },
  'nav.learn': { vi: 'Học', en: 'Learn', bi: 'Learn' },
  'nav.practice': { vi: 'Luyện thi', en: 'Practice', bi: 'Practice' },
  'nav.teachers': { vi: 'Giáo viên', en: 'Teachers', bi: 'Teachers' },
  'nav.ai_tutor': { vi: 'AI Trợ giảng', en: 'AI Tutor', bi: 'AI Tutor' },
  'nav.classroom': { vi: 'Phòng học', en: 'Classroom', bi: 'Classroom' },
  'nav.dashboard': { vi: 'Tổng quan', en: 'Dashboard', bi: 'Dashboard' },
  'nav.my_class': { vi: 'Lớp của tôi', en: 'My Classes', bi: 'My Classes' },
  'nav.admin': { vi: 'Quản trị', en: 'Admin', bi: 'Admin' },
  // User menu
  'menu.dashboard': { vi: 'Tổng quan', en: 'Dashboard', bi: 'Dashboard' },
  'menu.my_class': { vi: 'Lớp của tôi', en: 'My Classes', bi: 'My Classes' },
  'menu.teachers': { vi: 'Giáo viên', en: 'Teachers', bi: 'Teachers' },
  'menu.ai_tutor': { vi: 'AI Trợ giảng', en: 'AI Tutor', bi: 'AI Tutor' },
  'menu.wallet': { vi: 'Ví của tôi', en: 'My Wallet', bi: 'My Wallet' },
  'menu.vip': { vi: 'Gói VIP', en: 'VIP Membership', bi: 'VIP Membership' },
  'menu.admin': { vi: 'Quản trị', en: 'Admin Panel', bi: 'Admin Panel' },
  'menu.sign_out': { vi: 'Đăng xuất', en: 'Sign Out', bi: 'Sign Out' },
  'menu.sign_in': { vi: 'Đăng nhập', en: 'Sign In', bi: 'Sign In' },
  'menu.get_started': { vi: 'Bắt đầu', en: 'Get Started', bi: 'Get Started' },
  // Wallet button
  'btn.wallet': { vi: 'Ví', en: 'Wallet', bi: 'Wallet' },
  // Language toggle
  'lang.title': { vi: 'Ngôn ngữ AI trả lời', en: 'AI Response Language', bi: 'AI Response Language' },
  'lang.vi_desc': { vi: 'Giải thích thuần Việt, dễ hiểu', en: 'Full Vietnamese explanations', bi: 'Full Vietnamese explanations' },
  'lang.bi_desc': { vi: 'Việt + thuật ngữ Anh trong ngoặc', en: 'Vietnamese + English terms', bi: 'Vietnamese + English terms' },
  'lang.en_desc': { vi: 'Toàn bộ tiếng Anh (immersion)', en: 'Full English (immersion)', bi: 'Full English (immersion)' },

  // Home
  'home.hero.badge': { vi: 'Luyện thi TOEIC cùng AI', en: 'AI-Powered TOEIC Preparation', bi: 'Luyện thi TOEIC cùng AI' },
  'home.hero.title1': { vi: 'Hãy chinh phục bài thi TOEIC cùng ', en: 'Conquer the TOEIC test with your ', bi: 'Hãy chinh phục bài thi TOEIC cùng ' },
  'home.hero.title2': { vi: 'trợ lý AI của bạn', en: 'AI assistant', bi: 'trợ lý AI của bạn (AI assistant)' },
  'home.hero.desc': { vi: 'Tất cả những gì bạn cần để đạt điểm cao trong bài thi TOEIC Nghe & Đọc với bài học đầy đủ, đề thi thực hành sát với thực tế, chấm điểm tức thì và trợ giảng AI giải thích từng câu trả lời.', en: 'Everything you need to score high on the TOEIC Listening & Reading test with comprehensive lessons, realistic practice tests, instant grading, and an AI tutor explaining every answer.', bi: 'Tất cả những gì bạn cần để đạt điểm cao trong bài thi TOEIC Nghe & Đọc với bài học đầy đủ, đề thi thực hành sát với thực tế, chấm điểm tức thì và trợ giảng AI giải thích từng câu trả lời.' },
  'home.hero.btn_start': { vi: 'Làm bài thi thử ngay', en: 'Start a Free Practice Test', bi: 'Làm bài thi thử ngay' },
  'home.hero.btn_started': { vi: 'Bắt đầu — Miễn phí', en: 'Get Started — It\'s Free', bi: 'Bắt đầu (Get Started)' },
  'home.hero.btn_explore': { vi: 'Khám phá Bài học', en: 'Explore Lessons', bi: 'Khám phá Bài học' },
  'home.hero.sub_welcome': { vi: 'Chào mừng trở lại — tiến trình của bạn đã được lưu.', en: 'Welcome back — your progress is saved.', bi: 'Chào mừng trở lại — tiến trình của bạn đã được lưu.' },
  'home.hero.sub_free': { vi: 'Không cần thẻ tín dụng · Lưu tiến trình trên mọi thiết bị', en: 'No credit card required · Save progress across devices', bi: 'Không cần thẻ tín dụng · Lưu tiến trình trên mọi thiết bị' },
  'home.hero.trusted': { vi: 'Được tin dùng bởi 1,000+ học viên Việt Nam', en: 'Trusted by 1,000+ Vietnamese learners', bi: 'Được tin dùng bởi 1,000+ học viên Việt Nam' },
  'home.hero.avg_improvement': { vi: 'Cải thiện trung bình', en: 'Average improvement', bi: 'Cải thiện trung bình' },
  
  'home.stats.parts': { vi: 'Phần thi TOEIC', en: 'TOEIC parts covered', bi: 'TOEIC parts covered' },
  'home.stats.vocab': { vi: 'Từ vựng', en: 'Vocabulary words', bi: 'Từ vựng (Vocabulary)' },
  'home.stats.score': { vi: 'Khung điểm dự đoán', en: 'Score estimate range', bi: 'Khung điểm dự đoán' },
  'home.stats.tools': { vi: 'Công cụ AI', en: 'AI-powered tools', bi: 'Công cụ AI' },
  
  'home.features.badge': { vi: 'Tính năng', en: 'Features', bi: 'Tính năng' },
  'home.features.title': { vi: 'Một nền tảng, trọn bộ kỹ năng TOEIC', en: 'One platform, every TOEIC skill', bi: 'Một nền tảng, trọn bộ kỹ năng TOEIC' },
  'home.features.desc': { vi: 'Từ ngữ pháp cơ bản đến chiến thuật phòng thi, luôn có AI đồng hành trong từng bước.', en: 'From grammar fundamentals to exam-day strategy, backed by AI at every step.', bi: 'Từ ngữ pháp cơ bản đến chiến thuật phòng thi, luôn có AI đồng hành trong từng bước.' },
  
  'home.structure.badge': { vi: 'Cấu trúc Đề thi', en: 'Test Structure', bi: 'Test Structure' },
  'home.structure.title': { vi: '7 phần của bài thi TOEIC', en: 'The 7 parts of the TOEIC test', bi: 'The 7 parts of the TOEIC test' },
  'home.structure.desc': { vi: '200 câu hỏi trong 2 giờ — 100 Nghe (45 phút) + 100 Đọc (75 phút).', en: '200 questions in 2 hours — 100 Listening (45 min) + 100 Reading (75 min).', bi: '200 câu hỏi trong 2 giờ — 100 Listening (45 phút) + 100 Reading (75 phút).' },
  'home.structure.practice_all': { vi: 'Luyện tập mọi phần với AI nhận xét', en: 'Practice all parts with AI feedback', bi: 'Luyện tập mọi phần với AI nhận xét' },
  'home.structure.try_now': { vi: 'Thử ngay', en: 'Try now', bi: 'Try now' },
  
  'home.ai.badge': { vi: 'Gia sư AI', en: 'AI Tutoring', bi: 'AI Tutoring' },
  'home.ai.title': { vi: 'Gia sư AI luôn sẵn sàng 24/7', en: 'Your AI tutor never sleeps', bi: 'Gia sư AI luôn sẵn sàng 24/7' },
  'home.ai.desc': { vi: 'Mắc kẹt với ngữ pháp lúc nửa đêm? Cần người giải thích tại sao đáp án lại sai? Gia sư AI của chúng tôi cung cấp hướng dẫn tức thì, bám sát đề thi — bằng ngôn ngữ dễ hiểu.', en: 'Stuck on a grammar rule at midnight? Need someone to explain why an answer is wrong? Our AI tutor gives you instant, exam-focused guidance — in plain English.', bi: 'Mắc kẹt với ngữ pháp lúc nửa đêm? Cần người giải thích tại sao đáp án lại sai? Gia sư AI của chúng tôi cung cấp hướng dẫn tức thì, bám sát đề thi — bằng ngôn ngữ dễ hiểu.' },
  'home.ai.btn': { vi: 'Trò chuyện với Gia sư AI', en: 'Chat with the AI Tutor', bi: 'Trò chuyện với Gia sư AI' },
  'home.ai.feature1': { vi: 'Hỏi bất kỳ câu hỏi TOEIC nào và nhận giải thích rõ ràng', en: 'Ask any TOEIC question and get a clear explanation', bi: 'Ask any TOEIC question and get a clear explanation' },
  'home.ai.feature2': { vi: 'AI giải thích tại sao từng phương án đúng hay sai', en: 'AI explains why each option is right or wrong', bi: 'AI explains why each option is right or wrong' },
  'home.ai.feature3': { vi: 'Tạo câu hỏi thực hành mới về bất kỳ chủ đề nào', en: 'Generate fresh practice questions on any topic', bi: 'Generate fresh practice questions on any topic' },
  'home.ai.feature4': { vi: 'Sửa lỗi bài viết với những lời khuyên hữu ích', en: 'Get your writing corrected with friendly feedback', bi: 'Get your writing corrected with friendly feedback' },
  'home.ai.feature5': { vi: 'Nhận lộ trình học cá nhân hóa từng tuần', en: 'Receive a personalized week-by-week study plan', bi: 'Receive a personalized week-by-week study plan' },
  
  'home.testimonials.badge': { vi: 'Câu chuyện Thành công', en: 'Success Stories', bi: 'Success Stories' },
  'home.testimonials.title': { vi: 'Học viên nói gì về TOEIC Ace AI?', en: 'What learners say about TOEIC Ace AI?', bi: 'Học viên nói gì về TOEIC Ace AI?' },
  'home.testimonials.desc': { vi: 'Hàng ngàn học viên đã cải thiện điểm TOEIC chỉ trong vài tháng.', en: 'Thousands of learners have improved their TOEIC scores in just a few months.', bi: 'Hàng ngàn học viên đã cải thiện điểm TOEIC chỉ trong vài tháng.' },
  
  'home.listening.badge': { vi: 'Luyện Nghe', en: 'Listening Practice', bi: 'Listening Practice' },
  'home.listening.title': { vi: 'Luyện Listening với audio MP3 thật', en: 'Listening practice with real MP3 audio', bi: 'Luyện Listening với audio MP3 thật' },
  'home.listening.desc': { vi: 'Đề thi có audio MP3 chuẩn ETS, giọng đọc y hệt phong độ thi thật. Part 1 có ảnh minh hoạ, Part 2-4 có transcript để kiểm tra đáp án sau khi nộp bài.', en: 'Tests feature standard ETS MP3 audio, matching real exam voices. Part 1 includes photos, Parts 2-4 have transcripts to check answers after submission.', bi: 'Đề thi có audio MP3 chuẩn ETS, giọng đọc y hệt phong độ thi thật. Part 1 có ảnh minh hoạ, Part 2-4 có transcript để kiểm tra đáp án sau khi nộp bài.' },
  'home.listening.f1': { vi: '100 câu Listening đầy đủ (Part 1-4)', en: 'Full 100 Listening questions (Part 1-4)', bi: '100 câu Listening đầy đủ (Part 1-4)' },
  'home.listening.f2': { vi: 'Audio MP3 chuẩn như thi thật', en: 'Standard MP3 audio like the real exam', bi: 'Audio MP3 chuẩn như thi thật' },
  'home.listening.f3': { vi: 'Exam Mode giả lập phòng thi', en: 'Exam Mode simulation', bi: 'Exam Mode giả lập phòng thi' },
  'home.listening.f4': { vi: 'Transcript + giải thích từng câu', en: 'Transcripts + detailed explanations', bi: 'Transcript + giải thích từng câu' },
  'home.listening.btn': { vi: 'Luyện Listening ngay', en: 'Practice Listening now', bi: 'Practice Listening now' },
  
  'home.cta.title': { vi: 'Sẵn sàng chinh phục mục tiêu TOEIC của bạn?', en: 'Ready to reach your target TOEIC score?', bi: 'Sẵn sàng chinh phục mục tiêu TOEIC của bạn?' },
  'home.cta.desc': { vi: 'Làm bài thi thử, ôn lại từng đáp án cùng AI và xây dựng các kỹ năng giúp bạn tăng điểm.', en: 'Take a mock test, review every answer with AI, and build the skills that move your score up.', bi: 'Làm bài thi thử, ôn lại từng đáp án cùng AI và xây dựng các kỹ năng giúp bạn tăng điểm.' },
  'home.cta.btn_test': { vi: 'Làm bài thi thử', en: 'Take a Mock Test', bi: 'Take a Mock Test' },
  'home.cta.btn_lessons': { vi: 'Xem các Bài học', en: 'Browse Lessons', bi: 'Browse Lessons' },
  
  // Learn
  'learn.back_home': { vi: 'Trang chủ', en: 'Home', bi: 'Trang chủ (Home)' },
  'learn.header.title': { vi: 'Trung tâm Học tập', en: 'Learning Center', bi: 'Learning Center' },
  'learn.header.desc': { vi: 'Xây dựng các kỹ năng cần thiết cho điểm TOEIC cao — ngữ pháp, từ vựng và chiến thuật thi.', en: 'Build the skills behind a high TOEIC score — grammar, vocabulary and exam strategy.', bi: 'Xây dựng các kỹ năng cần thiết cho điểm TOEIC cao — ngữ pháp, từ vựng và chiến thuật thi.' },
  
  'learn.hub.grammar.title': { vi: 'Bài học Ngữ pháp', en: 'Grammar Lessons', bi: 'Grammar Lessons' },
  'learn.hub.grammar.desc': { vi: 'Giải thích rõ ràng các điểm ngữ pháp thường gặp trong TOEIC, kèm ví dụ và âm thanh.', en: 'Clear explanations of the grammar points tested on the TOEIC, with examples and audio.', bi: 'Giải thích rõ ràng các điểm ngữ pháp thường gặp trong TOEIC, kèm ví dụ và âm thanh.' },
  'learn.hub.grammar.cta': { vi: 'Xem bài học', en: 'Browse lessons', bi: 'Browse lessons' },
  
  'learn.hub.vocab.title': { vi: 'Từ vựng Flashcards', en: 'Vocabulary Flashcards', bi: 'Vocabulary Flashcards' },
  'learn.hub.vocab.desc': { vi: 'Lật mở, nghe và ôn tập các từ vựng tiếng Anh thương mại thường gặp với phương pháp lặp lại ngắt quãng.', en: 'Flip, listen and review high-frequency business English words with spaced repetition.', bi: 'Lật mở, nghe và ôn tập các từ vựng tiếng Anh thương mại thường gặp với phương pháp lặp lại ngắt quãng.' },
  'learn.hub.vocab.cta': { vi: 'Bắt đầu flashcards', en: 'Start flashcards', bi: 'Start flashcards' },
  
  'learn.hub.pronun.title': { vi: 'Luyện phát âm', en: 'Pronunciation Practice', bi: 'Pronunciation Practice' },
  'learn.hub.pronun.desc': { vi: 'Nghe câu mẫu, ghi âm giọng nói, nhận feedback AI chi tiết về phát âm, trọng âm, ngữ điệu.', en: 'Listen to samples, record your voice, get detailed AI feedback on pronunciation, stress, and intonation.', bi: 'Nghe câu mẫu, ghi âm giọng nói, nhận feedback AI chi tiết về phát âm, trọng âm, ngữ điệu.' },
  'learn.hub.pronun.cta': { vi: 'Luyện ngay', en: 'Practice now', bi: 'Practice now' },
  
  'learn.hub.strat.title': { vi: 'Chiến thuật làm bài', en: 'Test Strategies', bi: 'Test Strategies' },
  'learn.hub.strat.desc': { vi: 'Các chiến thuật cho từng phần thi Listening và Reading — kèm mẹo hữu ích cho ngày thi.', en: 'Section-by-section tactics for Listening and Reading — plus test-day tips.', bi: 'Các chiến thuật cho từng phần thi Listening và Reading — kèm mẹo hữu ích cho ngày thi.' },
  'learn.hub.strat.cta': { vi: 'Xem chiến thuật', en: 'See strategies', bi: 'See strategies' },
  
  'learn.hub.writing.title': { vi: 'Chữa lỗi Viết với AI', en: 'AI Writing Check', bi: 'AI Writing Check' },
  'learn.hub.writing.desc': { vi: 'Nhận sửa lỗi câu ngay lập tức từ AI và học hỏi qua các nhận xét chi tiết.', en: 'Get your sentences corrected instantly by AI and learn from the feedback.', bi: 'Nhận sửa lỗi câu ngay lập tức từ AI và học hỏi qua các nhận xét chi tiết.' },
  'learn.hub.writing.cta': { vi: 'Thử công cụ AI', en: 'Try AI tools', bi: 'Try AI tools' },
  
  'learn.tabs.grammar': { vi: 'Ngữ pháp', en: 'Grammar', bi: 'Grammar' },
  'learn.tabs.strategies': { vi: 'Chiến thuật', en: 'Strategies', bi: 'Strategies' },
  
  'learn.overview.title': { vi: 'Bài thi TOEIC là gì?', en: 'What is the TOEIC test?', bi: 'What is the TOEIC test?' },
  'learn.overview.desc': { vi: 'Bài thi TOEIC (Test of English for International Communication) đánh giá kỹ năng tiếng Anh sử dụng trong môi trường làm việc. Bài thi Nghe & Đọc kéo dài 2 giờ với 200 câu hỏi trắc nghiệm.', en: 'The TOEIC (Test of English for International Communication) measures everyday English skills used in the workplace. The Listening & Reading test lasts 2 hours and contains 200 multiple-choice questions.', bi: 'Bài thi TOEIC đánh giá kỹ năng tiếng Anh trong môi trường làm việc. Bài thi Nghe & Đọc kéo dài 2 giờ với 200 câu hỏi.' },
  'learn.overview.listening': { vi: 'Nghe: 100 câu · 45 phút', en: 'Listening: 100 questions · 45 min', bi: 'Listening: 100 câu · 45 phút' },
  'learn.overview.reading': { vi: 'Đọc: 100 câu · 75 phút', en: 'Reading: 100 questions · 75 min', bi: 'Reading: 100 câu · 75 phút' },
  'learn.overview.score': { vi: 'Khung điểm: 10 – 990', en: 'Score range: 10 – 990', bi: 'Score range: 10 – 990' },
  'learn.overview.btn_test': { vi: 'Làm bài thi thử', en: 'Take a practice test', bi: 'Take a practice test' },
  'learn.overview.btn_ai': { vi: 'Hỏi Gia sư AI', en: 'Ask the AI tutor', bi: 'Ask the AI tutor' },
  
  // Practice
  'practice.header.title': { vi: 'Luyện Thi TOEIC', en: 'TOEIC Practice', bi: 'TOEIC Practice' },
  'practice.header.desc': { vi: 'Chọn bộ đề phù hợp với mục tiêu của bạn. Có 2 chế độ: luyện tập (xem transcript, nghe lại) và thi thật (mô phỏng phòng thi, nghiêm ngặt).', en: 'Choose a test that fits your goals. Two modes: practice (view transcripts, replay audio) and exam (strict simulation).', bi: 'Chọn bộ đề phù hợp với mục tiêu của bạn. Có 2 chế độ: practice và exam.' },
  
  'practice.listening.title': { vi: 'Đề TOEIC Listening (Audio MP3 thật)', en: 'TOEIC Listening Test (Real MP3 Audio)', bi: 'TOEIC Listening Test (Real MP3 Audio)' },
  'practice.listening.desc': { vi: 'Đề thi thật TOEIC Listening — Parts 1-4 với file audio MP3 (cần VIP)', en: 'Real TOEIC Listening test — Parts 1-4 with MP3 audio files (VIP required)', bi: 'Đề thi thật TOEIC Listening — Parts 1-4 với file audio MP3 (cần VIP)' },
  
  'practice.reading.title': { vi: 'Đề TOEIC Reading Đầy Đủ (100 câu)', en: 'Full TOEIC Reading Test (100 Qs)', bi: 'Full TOEIC Reading Test (100 Qs)' },
  'practice.reading.desc': { vi: 'Đề thi thật TOEIC Reading — Part 5, 6, 7 với 100 câu hỏi + giải thích chi tiết (cần VIP)', en: 'Real TOEIC Reading test — Parts 5, 6, 7 with 100 questions + detailed explanations (VIP required)', bi: 'Đề thi thật TOEIC Reading — Part 5, 6, 7 với 100 câu hỏi + giải thích chi tiết (cần VIP)' },
  
  'practice.exam.title': { vi: 'Chế độ Thi Thật (Exam Simulation)', en: 'Exam Simulation Mode', bi: 'Exam Simulation Mode' },
  'practice.exam.desc': { vi: 'Mô phỏng phòng thi TOEIC thật — làm nghiêm túc để đánh giá chính xác năng lực', en: 'Real TOEIC exam simulation — take it seriously for an accurate assessment', bi: 'Mô phỏng phòng thi TOEIC thật — làm nghiêm túc để đánh giá chính xác năng lực' },
  
  'practice.ets.title': { vi: 'Đề ETS TOEIC (từ Google Drive)', en: 'ETS TOEIC Tests (from Google Drive)', bi: 'ETS TOEIC Tests (from Google Drive)' },
  'practice.ets.desc': { vi: 'Bộ đề ETS chính thức — xem đề + nghe audio + tải đáp án ngay trên web', en: 'Official ETS tests — view test + listen to audio + download answers on web', bi: 'Bộ đề ETS chính thức — xem đề + nghe audio + tải đáp án ngay trên web' },
  
  'practice.practice.title': { vi: 'Chế độ Luyện Tập (Practice Mode)', en: 'Practice Mode', bi: 'Practice Mode' },
  'practice.practice.desc': { vi: 'Tự do luyện từng part — có transcript, nghe lại, xem gợi ý (miễn phí, không cần VIP)', en: 'Freely practice each part — with transcripts, audio replay, and hints (free, no VIP required)', bi: 'Tự do luyện từng part — có transcript, nghe lại, xem gợi ý (miễn phí, không cần VIP)' },
  
  'practice.ai.title': { vi: 'Muốn luyện thêm câu hỏi mới?', en: 'Want more fresh questions?', bi: 'Muốn luyện thêm câu hỏi mới?' },
  'practice.ai.desc': { vi: 'Dùng AI Question Generator để tạo câu hỏi theo chủ đề bạn muốn.', en: 'Use the AI Question Generator to create questions on any topic you want.', bi: 'Dùng AI Question Generator để tạo câu hỏi theo chủ đề bạn muốn.' },
  'practice.ai.btn': { vi: 'Mở AI Tools', en: 'Open AI Tools', bi: 'Open AI Tools' },
  
  'practice.btn.start': { vi: 'Bắt đầu', en: 'Start', bi: 'Start' },
  'practice.btn.enter_exam': { vi: 'Vào phòng thi', en: 'Enter Exam', bi: 'Enter Exam' },
  'practice.btn.view_test': { vi: 'Xem đề', en: 'View Test', bi: 'View Test' },
  'practice.labels.questions': { vi: 'câu', en: 'Qs', bi: 'Qs' },
  'practice.labels.minutes': { vi: 'phút', en: 'min', bi: 'min' },
  'practice.labels.explanations': { vi: 'Giải thích VN', en: 'Explanations', bi: 'Explanations' },
  'practice.labels.answers': { vi: 'Đáp án', en: 'Answers', bi: 'Answers' },
  'practice.labels.easy': { vi: 'Dễ', en: 'Easy', bi: 'Easy' },
  'practice.labels.medium': { vi: 'TB', en: 'Med', bi: 'Med' },
  'practice.labels.hard': { vi: 'Khó', en: 'Hard', bi: 'Hard' },
  'practice.labels.free': { vi: 'MIỄN PHÍ', en: 'FREE', bi: 'FREE' },
}

type LanguageCtx = {
  language: Language
  changeLanguage: (lang: Language) => void
  loaded: boolean
  labels: { short: string; long: string; flag: string }
  allLabels: typeof LABELS
  t: (key: string) => string
}

const Ctx = createContext<LanguageCtx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null
      if (stored && ['vi', 'en', 'bi'].includes(stored)) {
        setLanguage(stored)
      }
    } catch {}
    setLoaded(true)

    // Sync across tabs / components
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setLanguage(e.newValue as Language)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {}
  }

  return (
    <Ctx.Provider value={{
      language, changeLanguage, loaded,
      labels: LABELS[language], allLabels: LABELS,
      t: (key: string) => UI_TRANSLATIONS[key]?.[language] ?? key,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
