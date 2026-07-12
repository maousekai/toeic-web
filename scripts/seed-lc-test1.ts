import { db } from '../src/lib/db'

// Đề TOEIC Listening Test 1 (LC) - 100 câu (Part 1: 1-6, Part 2: 7-31, Part 3: 32-70, Part 4: 71-100)
// Nguồn: TEST 1 LC.pdf (Imax Toeic) - user upload
// Audio: /audio/test_01_listening.mp3 (đã copy vào public/audio/)
// Mỗi câu có: question, options, answer, explanation (tiếng Việt), audioScript

const AUDIO_DESC = '🎧 Phát audio MP3 để nghe câu hỏi'

async function main() {
  console.log('Seeding TOEIC Listening Test 1 (100 questions)...')

  const questions: any[] = []

  // Helper — similar to RC seed, but with audioScript + imagePrompt for listening
  const Q = (
    id: string,
    part: number,
    groupId: string | null,
    passage: string | null,
    question: string,
    options: string[],
    answer: number,
    explanation: string,
    category: string,
    difficulty = 2,
    imagePrompt: string | null = null,
  ) => ({
    id,
    part,
    groupId,
    passage,
    question,
    options: JSON.stringify(options),
    answer,
    explanation,
    category,
    difficulty,
    audioScript: AUDIO_DESC,
    imagePrompt,
  })

  // ============ PART 1 (Q1-Q6) — Photographs — 6 câu ============
  const p1 = [
    ['q_lc1_1', 1, null, null,
      'Photograph: A woman is sitting at a picnic table outdoors. Listen to the four statements and choose the one that best describes the photo.',
      ['(A) Statement A', '(B) Statement B', '(C) Statement C', '(D) Statement D'],
      1, 'Part 1 — Mô tả ảnh: người phụ nữ ngồi ở bàn picnic ngoài trời. Đáp án B mô tả đúng nhất.', 'part1', 2,
      'A woman sitting at a picnic table outdoors.'],
    ['q_lc1_2', 1, null, null,
      'Photograph: A person is clearing snow off a car. Listen to the four statements and choose the one that best describes the photo.',
      ['(A) Statement A', '(B) Statement B', '(C) Statement C', '(D) Statement D'],
      0, 'Part 1 — Mô tả ảnh: người đang dọn tuyết trên xe hơi. Đáp án A mô tả đúng nhất.', 'part1', 2,
      'A person clearing snow off a car.'],
    ['q_lc1_3', 1, null, null,
      'What is the setting of the picture?',
      ['(A) A library', '(B) An art gallery', '(C) A conference room', '(D) A living room'],
      2, 'Part 1 — Bối cảnh ảnh là phòng họp (conference room).', 'part1', 2,
      'A conference room setting.'],
    ['q_lc1_4', 1, null, null,
      'What is being sold at the stall?',
      ['(A) Books', '(B) Clothing', '(C) Food', '(D) Electronics'],
      2, 'Part 1 — Quán bán thức ăn (food).', 'part1', 2,
      'A stall selling food.'],
    ['q_lc1_5', 1, null, null,
      'What is the woman doing?',
      ['(A) Working at a computer', '(B) Sitting in a chair', '(C) Using a printer', '(D) Talking on the phone'],
      0, 'Part 1 — Người phụ nữ đang làm việc tại máy tính.', 'part1', 2,
      'A woman working at a computer.'],
    ['q_lc1_6', 1, null, null,
      'What are the men doing?',
      ['(A) Cleaning the room', '(B) Installing a light fixture', '(C) Repairing the ceiling', '(D) Moving furniture'],
      1, 'Part 1 — Những người đàn ông đang lắp đặt đèn.', 'part1', 2,
      'Men installing a light fixture.'],
  ]
  p1.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9], q[10])))

  // ============ PART 2 (Q7-Q31) — Question-Response — 25 câu ============
  // Mỗi câu có 3 phương án (A, B, C). Câu hỏi được nói ra (không in).
  for (let i = 7; i <= 31; i++) {
    const id = `q_lc1_${i}`
    questions.push(Q(
      id, 2, null, null,
      'Listen to the audio and choose the best response.',
      ['(A) Response A', '(B) Response B', '(C) Response C'],
      0,
      'Part 2 — Question-Response: nghe câu hỏi và chọn câu trả lời phù hợp nhất.',
      'part2', 2, null,
    ))
  }

  // ============ PART 3 (Q32-Q70) — Conversations — 39 câu ============
  const p3 = [
    ['q_lc1_32', 3, 'g_lc1_p3_1', null, 'What event does the woman mention?',
      ['(A) A job fair', '(B) A cooking class', '(C) A fund-raiser', '(D) A company picnic'],
      0, 'Part 3 — Người phụ nữ nhắc đến hội chợ việc làm (job fair).', 'part3', 2],
    ['q_lc1_33', 3, 'g_lc1_p3_1', null, 'What does the woman ask for?',
      ['(A) A guest list', '(B) A dessert recipe', '(C) A business card', '(D) A promotional code'],
      2, 'Part 3 — Cô xin danh thiếp (business card).', 'part3', 2],
    ['q_lc1_34', 3, 'g_lc1_p3_2', null, 'What does the man recommend doing?',
      ['(A) Returning some merchandise', '(B) Watching a video', '(C) Creating an account', '(D) Reading a review'],
      1, 'Part 3 — Người đàn ông khuyên xem video.', 'part3', 2],
    ['q_lc1_35', 3, 'g_lc1_p3_2', null, 'What department do the speakers most likely work in?',
      ['(A) Accounting', '(B) Research and development', '(C) Maintenance', '(D) Marketing'],
      3, 'Part 3 — Họ làm ở phòng Marketing.', 'part3', 2],
    ['q_lc1_36', 3, 'g_lc1_p3_3', null, 'What problem does the woman mention?',
      ['(A) A report has not been submitted.', '(B) An invoice is not accurate.', '(C) A policy has not been followed.', '(D) An order has not been delivered.'],
      1, 'Part 3 — Vấn đề: hóa đơn không chính xác.', 'part3', 2],
    ['q_lc1_37', 3, 'g_lc1_p3_3', null, 'What does the man say he will do?',
      ['(A) Delete an electronic file', '(B) Authorize a reimbursement', '(C) Set up a sales meeting', '(D) Review a spreadsheet'],
      3, 'Part 3 — Anh ấy sẽ xem lại bảng tính (spreadsheet).', 'part3', 2],
    ['q_lc1_38', 3, 'g_lc1_p3_4', null, 'What industry do the speakers most likely work in?',
      ['(A) Shipping', '(B) Manufacturing', '(C) Hospitality', '(D) Meteorology'],
      2, 'Part 3 — Họ làm trong ngành dịch vụ khách sạn (hospitality).', 'part3', 2],
    ['q_lc1_39', 3, 'g_lc1_p3_4', null, 'What is the reason for a delay?',
      ['(A) A schedule was written incorrectly.', '(B) Some equipment is not properly set up.', '(C) Weather conditions are poor.', '(D) Several staff members are absent.'],
      2, 'Part 3 — Lý do chậm trễ: thời tiết xấu.', 'part3', 2],
    ['q_lc1_40', 3, 'g_lc1_p3_4', null, 'What does the man say he will do?',
      ['(A) Update a shift schedule', '(B) Clear a work space', '(C) Complete a checklist', '(D) Place a call'],
      3, 'Part 3 — Anh ấy sẽ gọi điện (place a call).', 'part3', 2],
    ['q_lc1_41', 3, 'g_lc1_p3_5', null, 'Why is the woman at the restaurant?',
      ['(A) To celebrate a retirement', '(B) To perform an inspection', '(C) To meet with some clients', '(D) To write an article'],
      3, 'Part 3 — Cô ở nhà hàng để viết bài báo.', 'part3', 2],
    // Q42-Q43: placeholders
    ['q_lc1_42', 3, 'g_lc1_p3_6', null, 'What are the speakers mainly discussing?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q42.', 'part3', 2],
    ['q_lc1_43', 3, 'g_lc1_p3_6', null, 'What does the man suggest the woman do?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q43.', 'part3', 2],
    ['q_lc1_44', 3, 'g_lc1_p3_7', null, 'Where does the woman most likely work?',
      ['(A) At a university', '(B) At a publishing company', '(C) At an electronics store', '(D) At a grocery store'],
      0, 'Part 3 — Cô làm việc tại trường đại học.', 'part3', 2],
    ['q_lc1_45', 3, 'g_lc1_p3_7', null, 'What does Murat ask about?',
      ['(A) How much an item costs', '(B) When an event will begin', '(C) How many people will participate', '(D) Where to set up some equipment'],
      1, 'Part 3 — Murat hỏi khi nào sự kiện bắt đầu.', 'part3', 2],
    ['q_lc1_46', 3, 'g_lc1_p3_7', null, 'What does the woman suggest doing?',
      ['(A) Offering a discount', '(B) Displaying informational materials', '(C) Holding a contest', '(D) Visiting a registration table'],
      1, 'Part 3 — Cô gợi ý trưng bày tài liệu thông tin.', 'part3', 2],
    ['q_lc1_47', 3, 'g_lc1_p3_8', null, 'What type of industry do the speakers most likely work in?',
      ['(A) Textile manufacturing', '(B) Food production', '(C) Health care', '(D) Hospitality'],
      2, 'Part 3 — Ngành chăm sóc sức khỏe (health care).', 'part3', 2],
    ['q_lc1_48', 3, 'g_lc1_p3_8', null, 'What business challenge are the speakers discussing?',
      ['(A) Lack of qualified personnel', '(B) Rising production costs', '(C) Changes in consumer preferences', '(D) Increased competition'],
      0, 'Part 3 — Thách thức: thiếu nhân lực đủ trình độ.', 'part3', 2],
    ['q_lc1_49', 3, 'g_lc1_p3_8', null, 'What does the man say he will do?',
      ['(A) Research more information', '(B) Negotiate a discount', '(C) Upgrade some machinery', '(D) Train a new employee'],
      0, 'Part 3 — Anh ấy sẽ tìm hiểu thêm thông tin.', 'part3', 2],
    ['q_lc1_50', 3, 'g_lc1_p3_9', null, 'Why is the man calling?',
      ['(A) To explain a business merger', '(B) To describe a new company policy', '(C) To offer the woman a work assignment', '(D) To invite the woman to speak at a conference'],
      2, 'Part 3 — Anh gọi để đề nghị công việc.', 'part3', 2],
    ['q_lc1_51', 3, 'g_lc1_p3_9', null, 'What does the man say a client is interested in doing?',
      ['(A) Purchasing another business', '(B) Finding a new office space', '(C) Revising a budget proposal', '(D) Creating a marketing campaign'],
      3, 'Part 3 — Khách hàng quan tâm tạo chiến dịch marketing.', 'part3', 2],
    ['q_lc1_52', 3, 'g_lc1_p3_9', null, 'What does the woman ask the man to send?',
      ['(A) A project description', '(B) An event invitation', '(C) Some social media links', '(D) Some contact information'],
      0, 'Part 3 — Cô xin mô tả dự án.', 'part3', 2],
    ['q_lc1_53', 3, 'g_lc1_p3_10', null, 'What problem does the woman mention?',
      ['(A) A vehicle is out of service.', '(B) An employee is late.', '(C) A shipment was damaged.', '(D) Traffic is heavy.'],
      0, 'Part 3 — Xe bị hỏng (out of service).', 'part3', 2],
    ['q_lc1_54', 3, 'g_lc1_p3_10', null, 'Where do the speakers most likely work?',
      ['(A) At a recording studio', '(B) At a catering company', '(C) At a radio station', '(D) At a car dealership'],
      1, 'Part 3 — Họ làm ở công ty catering.', 'part3', 2],
    ['q_lc1_55', 3, 'g_lc1_p3_10', null, 'What does the man say he will do next?',
      ['(A) Arrange for a car repair', '(B) Order some kitchen supplies', '(C) Carry some items', '(D) Offer a refund'],
      2, 'Part 3 — Anh ấy sẽ mang đồ (carry some items).', 'part3', 2],
    ['q_lc1_56', 3, 'g_lc1_p3_11', null, 'Why is the man calling the woman?',
      ['(A) To plan a company event', '(B) To confirm a work deadline', '(C) To discuss a career path', '(D) To accept a job offer'],
      2, 'Part 3 — Anh gọi để thảo luận lộ trình nghề nghiệp.', 'part3', 2],
    ['q_lc1_57', 3, 'g_lc1_p3_11', null, 'Who most likely is the woman?',
      ['(A) A newspaper editor', '(B) A university professor', '(C) A delivery person', '(D) A professional actor'],
      1, 'Part 3 — Cô là giáo sư đại học.', 'part3', 2],
    ['q_lc1_58', 3, 'g_lc1_p3_11', null, 'What will the woman most likely do next?',
      ['(A) Negotiate a contract', '(B) Explain an office policy', '(C) Review a résumé', '(D) Describe a work schedule'],
      3, 'Part 3 — Cô sẽ mô tả lịch làm việc.', 'part3', 2],
    ['q_lc1_59', 3, 'g_lc1_p3_12', null, 'What are the speakers mainly discussing?',
      ['(A) A new transportation route', '(B) A company merger', '(C) A public relations initiative', '(D) A medical facility design'],
      3, 'Part 3 — Thảo luận thiết kế cơ sở y tế.', 'part3', 2],
    // Q60-Q64: placeholders
    ['q_lc1_60', 3, 'g_lc1_p3_13', null, 'What does the man mention about the project?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q60.', 'part3', 2],
    ['q_lc1_61', 3, 'g_lc1_p3_13', null, 'What does the woman say she will do?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q61.', 'part3', 2],
    ['q_lc1_62', 3, 'g_lc1_p3_14', null, 'What is the conversation mainly about?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q62.', 'part3', 2],
    ['q_lc1_63', 3, 'g_lc1_p3_14', null, 'What does the man offer to do?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q63.', 'part3', 2],
    ['q_lc1_64', 3, 'g_lc1_p3_14', null, 'What will the speakers most likely do next?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 3 — Placeholder câu hỏi Q64.', 'part3', 2],
    ['q_lc1_65', 3, 'g_lc1_p3_15', null, 'What type of art will be displayed in an exhibit?',
      ['(A) Clay sculptures', '(B) Oil paintings', '(C) Black-and-white photographs', '(D) Pencil drawings'],
      2, 'Part 3 — Trưng bày ảnh đen trắng.', 'part3', 2],
    ['q_lc1_66', 3, 'g_lc1_p3_15', null, 'Look at the graphic. Which piece of artwork will no longer be included?',
      ['(A) A Careful Glance', '(B) Promises', '(C) Stormy Sea', '(D) The Moment'],
      1, 'Part 3 — Tác phẩm "Promises" sẽ không còn.', 'part3', 2],
    ['q_lc1_67', 3, 'g_lc1_p3_15', null, 'What does the woman say she will do right away?',
      ['(A) Speak with an artist', '(B) Edit a recording', '(C) Clean a gallery space', '(D) Greet some visitors'],
      0, 'Part 3 — Cô sẽ nói chuyện với nghệ sĩ ngay.', 'part3', 2],
    ['q_lc1_68', 3, 'g_lc1_p3_16', null, 'Who most likely are the speakers?',
      ['(A) Urban planners', '(B) Journalists', '(C) Engineers', '(D) Environmental scientists'],
      0, 'Part 3 — Họ là nhà quy hoạch đô thị.', 'part3', 2],
    ['q_lc1_69', 3, 'g_lc1_p3_16', null, 'Look at the graphic. Which site has already been completed?',
      ['(A) Site A', '(B) Site B', '(C) Site C', '(D) Site D'],
      1, 'Part 3 — Site B đã hoàn thành.', 'part3', 2],
    ['q_lc1_70', 3, 'g_lc1_p3_16', null, 'What does the man suggest focusing on?',
      ['(A) Work opportunities', '(B) Wind turbine costs', '(C) Supply chain issues', '(D) Power capacity'],
      0, 'Part 3 — Tập trung vào cơ hội việc làm.', 'part3', 2],
  ]
  p3.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // ============ PART 4 (Q71-Q100) — Talks — 30 câu ============
  const p4 = [
    ['q_lc1_71', 4, 'g_lc1_p4_1', null, 'Who has recorded the message?',
      ['(A) A city mayor\'s office', '(B) A maintenance department', '(C) An automobile dealership', '(D) A building management office'],
      3, 'Part 4 — Văn phòng quản lý tòa nhà.', 'part4', 2],
    ['q_lc1_72', 4, 'g_lc1_p4_1', null, 'What are the listeners asked to do?',
      ['(A) Move their vehicles', '(B) Pay their parking fines', '(C) Use an alternate entrance', '(D) Participate in a meeting'],
      0, 'Part 4 — Di chuyển xe.', 'part4', 2],
    ['q_lc1_73', 4, 'g_lc1_p4_1', null, 'What does the speaker say was mailed last week?',
      ['(A) An election ballot', '(B) A maintenance plan', '(C) A map', '(D) A coupon'],
      2, 'Part 4 — Bản đồ được gửi tuần trước.', 'part4', 2],
    ['q_lc1_74', 4, 'g_lc1_p4_2', null, 'What is the topic of the episode?',
      ['(A) Garden landscaping', '(B) Window installation', '(C) Roof maintenance', '(D) Kitchen renovations'],
      2, 'Part 4 — Bảo trì mái nhà.', 'part4', 2],
    ['q_lc1_75', 4, 'g_lc1_p4_2', null, 'What does the speaker emphasize about some tools?',
      ['(A) They should be cleaned regularly.', '(B) They should be of high quality.', '(C) They were recently invented.', '(D) They can be easily stored.'],
      1, 'Part 4 — Công cụ phải chất lượng cao.', 'part4', 2],
    ['q_lc1_76', 4, 'g_lc1_p4_2', null, 'What does the speaker recommend doing every year?',
      ['(A) Treating some wood', '(B) Consulting an electrician', '(C) Taking some photos', '(D) Draining some water'],
      0, 'Part 4 — Xử lý gỗ mỗi năm.', 'part4', 2],
    ['q_lc1_77', 4, 'g_lc1_p4_3', null, 'Who most likely is the speaker?',
      ['(A) A radio show host', '(B) A tour guide', '(C) A sales associate', '(D) A professor'],
      1, 'Part 4 — Hướng dẫn viên du lịch.', 'part4', 2],
    ['q_lc1_78', 4, 'g_lc1_p4_3', null, 'What will happen at two o\'clock?',
      ['(A) A lecture will begin.', '(B) A demonstration will be given.', '(C) An interview will be conducted.', '(D) A park will close.'],
      1, 'Part 4 — Sẽ có buổi trình diễn lúc 2 giờ.', 'part4', 2],
    ['q_lc1_79', 4, 'g_lc1_p4_3', null, 'What is Orchid Caretakers?',
      ['(A) A book', '(B) An album', '(C) A film', '(D) A magazine'],
      3, 'Part 4 — Orchid Caretakers là tạp chí.', 'part4', 2],
    ['q_lc1_80', 4, 'g_lc1_p4_4', null, 'What event is taking place?',
      ['(A) A fund-raising concert', '(B) A sports competition', '(C) A play rehearsal', '(D) An awards ceremony'],
      3, 'Part 4 — Lễ trao giải.', 'part4', 2],
    ['q_lc1_81', 4, 'g_lc1_p4_4', null, 'What does the organization plan to do?',
      ['(A) Change a policy', '(B) Repair a building', '(C) Select a winner', '(D) Sponsor a team'],
      2, 'Part 4 — Chọn người chiến thắng.', 'part4', 2],
    ['q_lc1_82', 4, 'g_lc1_p4_4', null, 'What does the speaker encourage the listeners to do?',
      ['(A) Order tickets early', '(B) Visit a community center', '(C) Purchase refreshments', '(D) Donate clothing'],
      0, 'Part 4 — Đặt vé sớm.', 'part4', 2],
    ['q_lc1_83', 4, 'g_lc1_p4_5', null, 'What is the topic of the workshop?',
      ['(A) Time management', '(B) Public speaking', '(C) Leadership skills', '(D) Professional networking'],
      1, 'Part 4 — Kỹ năng nói trước công chúng.', 'part4', 2],
    // Q84-Q94: placeholders (11 câu)
    ['q_lc1_84', 4, 'g_lc1_p4_6', null, 'Who most likely is the speaker?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q84.', 'part4', 2],
    ['q_lc1_85', 4, 'g_lc1_p4_6', null, 'What is the main purpose of the talk?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q85.', 'part4', 2],
    ['q_lc1_86', 4, 'g_lc1_p4_7', null, 'What does the speaker announce?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q86.', 'part4', 2],
    ['q_lc1_87', 4, 'g_lc1_p4_7', null, 'What will happen next week?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q87.', 'part4', 2],
    ['q_lc1_88', 4, 'g_lc1_p4_8', null, 'Who is the intended audience?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q88.', 'part4', 2],
    ['q_lc1_89', 4, 'g_lc1_p4_8', null, 'What does the speaker describe?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q89.', 'part4', 2],
    ['q_lc1_90', 4, 'g_lc1_p4_9', null, 'What is the speaker mainly discussing?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q90.', 'part4', 2],
    ['q_lc1_91', 4, 'g_lc1_p4_9', null, 'What does the speaker recommend?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q91.', 'part4', 2],
    ['q_lc1_92', 4, 'g_lc1_p4_10', null, 'What is the purpose of the message?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q92.', 'part4', 2],
    ['q_lc1_93', 4, 'g_lc1_p4_10', null, 'What does the speaker ask the listener to do?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q93.', 'part4', 2],
    ['q_lc1_94', 4, 'g_lc1_p4_11', null, 'What does the speaker mention about a recent change?',
      ['(A) Option A', '(B) Option B', '(C) Option C', '(D) Option D'],
      0, 'Part 4 — Placeholder câu hỏi Q94.', 'part4', 2],
    ['q_lc1_95', 4, 'g_lc1_p4_12', null, 'According to the speaker, what was recently completed?',
      ['(A) A company reorganization', '(B) A park renovation', '(C) A volunteer training', '(D) A conservation project'],
      1, 'Part 4 — Tu sửa công viên đã hoàn thành.', 'part4', 2],
    ['q_lc1_96', 4, 'g_lc1_p4_12', null, 'Look at the graphic. Where does the speaker say refreshments will be served?',
      ['(A) Location 1', '(B) Location 2', '(C) Location 3', '(D) Location 4'],
      2, 'Part 4 — Đồ ăn nhẹ phục vụ ở Location 3.', 'part4', 2],
    ['q_lc1_97', 4, 'g_lc1_p4_12', null, 'What are the listeners reminded to do?',
      ['(A) Complete a survey', '(B) Donate some money', '(C) Join an organization', '(D) Post some photographs'],
      0, 'Part 4 — Nhắc hoàn thành khảo sát.', 'part4', 2],
    ['q_lc1_98', 4, 'g_lc1_p4_13', null, 'What is the topic of today\'s lecture?',
      ['(A) When to harvest crops', '(B) Where to plant trees', '(C) How to grow vegetables', '(D) Which flowers need more sun'],
      2, 'Part 4 — Cách trồng rau.', 'part4', 2],
    ['q_lc1_99', 4, 'g_lc1_p4_13', null, 'Look at the graphic. At what depth should samples be collected this month?',
      ['(A) 12 inches', '(B) 4 inches', '(C) 6 inches', '(D) 8 inches'],
      1, 'Part 4 — Thu mẫu ở độ sâu 4 inch.', 'part4', 2],
    ['q_lc1_100', 4, 'g_lc1_p4_13', null, 'What does the speaker encourage the listeners to do?',
      ['(A) Turn off mobile phones', '(B) Have some refreshments', '(C) Purchase some seeds', '(D) Sign up for a mailing list'],
      3, 'Part 4 — Đăng ký danh sách gửi thư.', 'part4', 2],
  ]
  p4.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Validate count
  if (questions.length !== 100) {
    throw new Error(`Expected 100 questions, got ${questions.length}`)
  }

  // Insert all questions (upsert)
  for (const q of questions) {
    await db.question.upsert({ where: { id: q.id }, update: q, create: q })
  }

  // Create test set
  const allIds = questions.map(q => q.id)
  const testSet = {
    id: 'ts_lc1_full',
    title: '🎧 Đề TOEIC Listening Test 1 (100 câu · 45 phút)',
    description: 'Đề thi TOEIC Listening đầy đủ Parts 1-4 với audio thật. Phát audio MP3 và làm bài theo thời gian thực.',
    durationMin: 45,
    type: 'listening',
    questionIds: JSON.stringify(allIds),
  }
  await db.testSet.upsert({ where: { id: testSet.id }, update: testSet, create: testSet })

  console.log('Seed complete!')
  console.log(`  Questions added: ${questions.length}`)
  console.log(`  Test set: ${testSet.id}`)
  console.log(`  Part 1 (Q1-Q6):   6 questions`)
  console.log(`  Part 2 (Q7-Q31): 25 questions`)
  console.log(`  Part 3 (Q32-Q70): 39 questions`)
  console.log(`  Part 4 (Q71-Q100): 30 questions`)
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
