import { db } from '../src/lib/db'

// Đề TOEIC Reading Test 3 (RC) - 100 câu (Part 5: 101-130, Part 6: 131-146, Part 7: 147-200)
// Nguồn: TEST 3 RC.pdf (Imax Toeic) - user upload
// Mỗi câu có: question, options, answer, explanation (tiếng Việt)

async function main() {
  console.log('Seeding TOEIC Reading Test 3 (100 questions)...')

  const questions: any[] = []

  // Helper
  const Q = (id: string, part: number, groupId: string | null, passage: string | null, question: string, options: string[], answer: number, explanation: string, category: string, difficulty = 2) => ({
    id, part, groupId, passage, question,
    options: JSON.stringify(options),
    answer, explanation, category, difficulty,
    audioScript: null, imagePrompt: null,
  })

  // ============ PART 5 (101-130) - 30 câu ============
  const p5 = [
    ['q_rc3_101', 5, null, null, '------ your order is being processed, please call customer service with any questions.', ['Still', 'Either', 'While', 'Also'], 2, '"While" = trong khi. "While your order is being processed" = Trong khi đơn hàng của bạn đang được xử lý. Cần liên từ chỉ thời gian.', 'conjunction', 2],
    ['q_rc3_102', 5, null, null, 'ABC Truck Supplies has the ------ selection of mufflers in the state.', ['natural', 'widest', 'overall', 'positive'], 1, '"Widest selection" = lựa chọn rộng nhất. Collocation phổ biến: wide/widest + selection.', 'collocation', 2],
    ['q_rc3_103', 5, null, null, 'Sharstwood Landscaping has received dozens of five-star ------ for its work.', ['reviews', 'reviewer', 'reviewed', 'reviewing'], 0, 'Cần danh từ số nhiều sau "five-star". "Reviews" = các đánh giá. Các lựa chọn khác là V-ing, V3, danh từ chỉ người.', 'word-form', 2],
    ['q_rc3_104', 5, null, null, 'Dr. Cho will visit the Teledarr Lab during the annual open house, since ------ may not have another chance to see it.', ['hers', 'she', 'her', 'herself'], 1, 'Cần đại từ chủ ngữ số ít (Dr. Cho) → "she". Vị trí trước "may not have" (modal + V).', 'pronoun', 2],
    ['q_rc3_105', 5, null, null, 'Dorn Department Store decided to ------ its already large selection of housewares.', ['create', 'enforce', 'apply', 'expand'], 3, '"Expand its selection" = mở rộng lựa chọn. Collocation phù hợp ngữ cảnh bán lẻ.', 'vocabulary', 2],
    ['q_rc3_106', 5, null, null, 'We ------ that you bring a portfolio of work samples to the interview.', ['was asking', 'having asked', 'ask', 'asks'], 2, 'Cần động từ hiện tại đơn. Chủ ngữ "We" số nhiều → "ask" (không "-s").', 'subject-verb', 2],
    ['q_rc3_107', 5, null, null, 'Members of the Bold Stone Farm Store receive ------ discounts on all purchases.', ['depth', 'deepen', 'deep', 'deeply'], 2, 'Cần tính từ bổ nghĩa cho "discounts". "Deep discounts" = giảm giá sâu.', 'word-form', 2],
    ['q_rc3_108', 5, null, null, 'If your plans change, please contact us at least 24 hours before the time of your ------.', ['reserved', 'reservation', 'reservable', 'reserve'], 1, 'Cần danh từ sau "your". "Reservation" = sự đặt chỗ.', 'word-form', 2],
    ['q_rc3_109', 5, null, null, 'Hold the tomato seedling gently by the stem in order to avoid harming ------ roots.', ['its', 'at', 'that', 'in'], 0, 'Cần tính từ sở hữu bổ nghĩa cho "roots". "Its" = của nó (cây non).', 'pronoun', 2],
    ['q_rc3_110', 5, null, null, 'At the registration table, be sure to collect your name tag ------ entering the conference.', ['very', 'often', 'always', 'before'], 3, '"Before + V-ing" = trước khi. Cần giới từ chỉ thời gian.', 'preposition', 2],
    ['q_rc3_111', 5, null, null, 'Maihama vehicles include an extended ------ to cover engine repairs.', ['record', 'operation', 'budget', 'warranty'], 3, '"Extended warranty" = bảo hành kéo dài. Collocation phổ biến trong ngành ô tô.', 'collocation', 2],
    ['q_rc3_112', 5, null, null, "The hotel's new Web site features an ------ collection of high-quality images.", ['absolute', 'efficient', 'impressive', 'undefeated'], 2, '"Impressive collection" = bộ sưu tập ấn tượng. Phù hợp ngữ cảnh trang web khách sạn cao cấp.', 'vocabulary', 2],
    ['q_rc3_113', 5, null, null, 'On behalf of everyone at Uniontown Bank, we ------ thank you for your continued patronage.', ['deservedly', 'commonly', 'sincerely', 'perfectly'], 2, '"Sincerely thank" = chân thành cảm ơn. Collocation trang trọng thường dùng trong văn bản kinh doanh.', 'collocation', 3],
    ['q_rc3_114', 5, null, null, 'Fragile equipment must be stored in a secure location so that nothing is ------ damaged.', ['accident', 'accidents', 'accidental', 'accidentally'], 3, 'Cần trạng từ bổ nghĩa cho "damaged". "Accidentally damaged" = bị hư hỏng vô tình.', 'word-form', 2],
    ['q_rc3_115', 5, null, null, "Ms. Sampson will not arrive at the convention ------ after our team's presentation.", ['until', 'lately', 'from', 'when'], 0, '"Not...until" = không...cho đến khi. "Will not arrive until after" = sẽ không đến cho đến sau khi.', 'conjunction', 3],
    ['q_rc3_116', 5, null, null, 'The community picnic will be held ------ the park behind the Seltzer Public Library.', ['in', 'all', 'for', 'here'], 0, '"In the park" = trong công viên. Cần giới từ chỉ vị trí.', 'preposition', 2],
    ['q_rc3_117', 5, null, null, 'The new hires ------ for an orientation on May 10 at 9:00 A.M.', ['to be gathering', 'will gather', 'gathering', 'to gather'], 1, 'Cần động từ chia thì tương lai đơn. "Will gather" = sẽ tụ tập. Chủ ngữ "new hires" + thời gian cụ thể trong tương lai.', 'tense', 2],
    ['q_rc3_118', 5, null, null, 'When Mr. Young approached the desk, the receptionist ------ offered him a seat in the waiting room.', ['politely', 'polite', 'politeness', 'politest'], 0, 'Cần trạng từ bổ nghĩa cho "offered". "Politely offered" = lịch sự mời.', 'word-form', 2],
    ['q_rc3_119', 5, null, null, 'Members of the Marvale marketing team claimed that ------ was the best design for the new corporate logo.', ['they', 'them', 'theirs', 'their'], 2, 'Cần đại từ sở hữu thay thế cho danh từ đã nhắc đến. "Theirs" = thiết kế của họ.', 'pronoun', 3],
    ['q_rc3_120', 5, null, null, 'The new Kitsuna video camera is currently on sale for $375, not ------ tax.', ['excepting', 'alongside', 'within', 'including'], 3, '"Not including tax" = chưa bao gồm thuế. Collocation phổ biến khi báo giá.', 'preposition', 2],
    ['q_rc3_121', 5, null, null, 'All associates are ------ to follow the standard operating procedures outlined in the handbook.', ['concerned', 'tended', 'maintained', 'expected'], 3, '"Are expected to" = được mong đợi sẽ. Cấu trúc trang trọng dùng trong sổ tay nhân viên.', 'vocabulary', 3],
    ['q_rc3_122', 5, null, null, 'This month Framley Publishing House is embarking on its ------ expansion so far.', ['ambitiously', 'most ambitiously', 'ambition', 'most ambitious'], 3, 'Cần tính từ ở dạng so sánh nhất. "Most ambitious expansion" = kế hoạch mở rộng tham vọng nhất.', 'word-form', 3],
    ['q_rc3_123', 5, null, null, "After months of collaboration, Matricks Technology's software developers ------ released a top-quality product.", ['profoundly', 'overly', 'finally', 'intensely'], 2, '"Finally released" = cuối cùng đã phát hành. Phù hợp ngữ cảnh sau nhiều tháng hợp tác.', 'vocabulary', 2],
    ['q_rc3_124', 5, null, null, 'Tickets are valid for one-time access and do not allow for ------ into the venue.', ['duplication', 'reentry', 'permission', 'turnover'], 1, '"Allow for reentry" = cho phép vào lại. Collocation trong ngữ cảnh vé sự kiện.', 'vocabulary', 3],
    ['q_rc3_125', 5, null, null, 'We hired Okafor Construction to do the renovation ------ it was not the lowest bidder on the project.', ['if only', 'alternatively', 'whereas', 'even though'], 3, '"Even though" = mặc dù. Diễn tả sự nhượng bộ (vẫn thuê dù không phải bên báo giá thấp nhất).', 'conjunction', 3],
    ['q_rc3_126', 5, null, null, 'The first ------ of the training will introduce staff to certain workplace responsibilities.', ['part', 'parted', 'parting', 'partial'], 0, 'Cần danh từ. "The first part of the training" = phần đầu của buổi đào tạo.', 'word-form', 2],
    ['q_rc3_127', 5, null, null, 'According to industry ------, Ghira Company plans to relocate its headquarters to Australia.', ['reported', 'reportedly', 'reporter', 'reports'], 3, '"According to industry reports" = Theo các báo cáo ngành. Cần danh từ số nhiều.', 'word-form', 2],
    ['q_rc3_128', 5, null, null, 'Next month, the Kneath House will host an exhibition of ------ furniture and clothing from the eighteenth century.', ['authentic', 'authentically', 'authenticate', 'authenticity'], 0, 'Cần tính từ bổ nghĩa cho "furniture and clothing". "Authentic" = chính gốc, thật.', 'word-form', 3],
    ['q_rc3_129', 5, null, null, "PKTM's regional managers serve ------ the direction of the vice president.", ['among', 'under', 'behind', 'opposite'], 1, '"Serve under" = phục vụ dưới quyền. Collocation chỉ quan hệ cấp bậc.', 'collocation', 3],
    ['q_rc3_130', 5, null, null, "------ a recent surge in demand, Vanita's Catering is hiring four additional servers.", ['Everywhere', 'Possibly', 'In total', 'Owing to'], 3, '"Owing to" = do, vì (đồng nghĩa với "due to"). Cụm giới từ chỉ nguyên nhân.', 'phrase', 3],
  ]
  p5.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // ============ PART 6 (131-146) - 16 câu, 4 passages ============
  // Passage 1 (131-134): Email about Florence Shawn retirement
  const p6_passage1 = `Questions 131-134 refer to the following e-mail.

To: All Staff
From: Yoreli Costa
Date: February 15
Subject: Florence Shawn

Hi Everyone,

I have news to share about a 131 in the human resources department. After nearly twenty years with Cometti Creative, Florence Shawn has decided to retire from the position of director of human resources.

Our current senior manager of human resources, Makoto Ichise, will replace Ms. Shawn when she retires. Ms. Shawn 132 Mr. Ichise since he joined the company five years ago.

Ms. Shawn's 133 day will be February 22. A retirement party will be held for her on that day at 4:00 p.m. in the Terey Lobby. 134.

Best,
Yoreli Costa
Director of Operations, Cometti Creative`

  const p6_1 = [
    ['q_rc3_131', 6, 'g_rc3_p6_1', p6_passage1, '131.', ['difference', 'strategy', 'change', 'practice'], 2, '"Change" = sự thay đổi. Ngữ cảnh: Florence nghỉ hưu → có sự thay đổi trong phòng nhân sự.', 'vocabulary', 2],
    ['q_rc3_132', 6, 'g_rc3_p6_1', p6_passage1, '132.', ['mentors', 'is mentoring', 'will mentor', 'has been mentoring'], 3, 'Cần thì hiện tại hoàn thành tiếp diễn với "since" (since he joined...). "Has been mentoring" = đã đang hướng dẫn.', 'tense', 3],
    ['q_rc3_133', 6, 'g_rc3_p6_1', p6_passage1, '133.', ['last', 'original', 'flexible', 'alternate'], 0, '"Last day" = ngày làm việc cuối cùng. Phù hợp ngữ cảnh nghỉ hưu.', 'vocabulary', 2],
    ['q_rc3_134', 6, 'g_rc3_p6_1', p6_passage1, '134.', ['Cometti Creative will hire a replacement soon.', 'We hope that you can all attend to wish her well.', 'Ms. Shawn was the first director of human resources at Cometti Creative.', 'The first project will be the creation of a talent development program.'], 1, 'Câu trước nói về "retirement party" → câu phù hợp là mong mọi người tham dự để chúc mừng.', 'sentence-insertion', 4],
  ]
  p6_1.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 2 (135-138): Lovitt Real Estate ad
  const p6_passage2 = `Questions 135-138 refer to the following advertisement.

Lovitt Real Estate

Helping Manitoba Families Find their Dream Homes

Manuel Lovitt, 135 of Lovitt Real Estate, has been selling real estate for over 17 years. Mr. Lovitt and his award-winning team 136 in homes for families in the Winnipeg, Brandon, and Dauphin areas. They know about the schools, parks, services, transportation, and activities that enhance family life in the area where you want to reside. 137.

Contact Lovitt Real Estate today and let the team guide you 138 the home of your dreams. They will listen to your needs, negotiate on your behalf, and get you the best home for your hard-earned money.

Call 431-555-0168 to speak to an agent or visit www.lovittrealestate.ca for more information.`

  const p6_2 = [
    ['q_rc3_135', 6, 'g_rc3_p6_2', p6_passage2, '135.', ['own', 'owned', 'owner', 'owning'], 2, 'Cần danh từ chỉ người. "Owner of Lovitt Real Estate" = chủ sở hữu của Lovitt Real Estate.', 'word-form', 2],
    ['q_rc3_136', 6, 'g_rc3_p6_2', p6_passage2, '136.', ['practice', 'specialize', 'report', 'purchase'], 1, '"Specialize in" = chuyên về. Collocation phù hợp ngữ cảnh bất động sản.', 'vocabulary', 2],
    ['q_rc3_137', 6, 'g_rc3_p6_2', p6_passage2, '137.', ['They can arrange transportation for your local elementary school.', 'That is because they live in the communities they serve.', 'They will be closed for the summer but will be back soon.', 'Therefore, they can help you with all your banking needs.'], 1, 'Câu trước nói "They know about the schools, parks..." → câu phù hợp là giải thích lý do họ biết: vì họ sống trong cộng đồng họ phục vụ.', 'sentence-insertion', 4],
    ['q_rc3_138', 6, 'g_rc3_p6_2', p6_passage2, '138.', ['toward', 'fixing', 'because', 'along'], 0, '"Guide toward" = hướng dẫn đến với. Collocation chỉ phương hướng.', 'preposition', 3],
  ]
  p6_2.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 3 (139-142): Swainson-Gray Investments slide presentation
  const p6_passage3 = `Questions 139-142 refer to the following slide presentation.

Welcome to "Distributing Your Savings." This slide 139 is the third of a twelve-segment educational series called "Preparing for Retirement." 140.

This series provides only 141 advice. It should not replace the guidance of your investment planner. The series has been developed as background material to help you ask key questions when 142 with your investment planner. We hope you find this information helpful.

Swainson-Gray Investments`

  const p6_3 = [
    ['q_rc3_139', 6, 'g_rc3_p6_3', p6_passage3, '139.', ['presenting', 'presents', 'presentation', 'presented'], 2, 'Cần danh từ. "This slide presentation" = bài thuyết trình bằng slide.', 'word-form', 2],
    ['q_rc3_140', 6, 'g_rc3_p6_3', p6_passage3, '140.', ['You are encouraged to visit our office for a free portfolio review.', 'The series is designed to help you make informed financial decisions.', 'Please fill out the paperwork before your appointment.', 'Your responses will help us serve you better in the future.'], 1, 'Câu phù hợp với ngữ cảnh chuỗi giáo dục về tài chính → được thiết kế để giúp đưa ra quyết định tài chính sáng suốt.', 'sentence-insertion', 4],
    ['q_rc3_141', 6, 'g_rc3_p6_3', p6_passage3, '141.', ['regional', 'expensive', 'supplemental', 'playful'], 2, '"Supplemental advice" = lời khuyên bổ sung. Phù hợp vì câu sau nói "không thay thế sự hướng dẫn của investment planner".', 'vocabulary', 3],
    ['q_rc3_142', 6, 'g_rc3_p6_3', p6_passage3, '142.', ['consulting', 'prescribing', 'listing', 'following'], 0, '"When consulting with" = khi tham vấn với. Cần V-ing sau "when" + bổ nghĩa cho "investment planner".', 'word-form', 3],
  ]
  p6_3.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 4 (143-146): Email about vending machines
  const p6_passage4 = `Questions 143-146 refer to the following e-mail.

To: Dana Paulwell
From: Silas Laveau
Date: August 22
Subject: My input
Attachment: Article

Dear Dr. Paulwell,

This message is in response to yesterday's staff meeting, particularly the discussion on how certain aspects of the clinic may affect our work and mission. 143.

Currently, the vending machines in the hall outside our waiting room are stocked with sugary and salty products such as soft drinks and chips. As a health care provider, we 144 beverages and snacks that show our commitment to wellness. 145, our mission is focused on good health.

I have attached an article about actions that medical centers like ours are taking to improve their hospitality stations. I hope you find it 146. It details some easy and cost-effective changes we could consider.

Kind regards,
Silas Laveau`

  const p6_4 = [
    ['q_rc3_143', 6, 'g_rc3_p6_4', p6_passage4, '143.', ['I thought it went on longer than was necessary.', 'I wish we had been informed about it sooner.', 'I would like to make a suggestion on this topic.', 'I would be honored to lead a follow-up session.'], 2, 'Câu sau đưa ra gợi ý về máy bán hàng → câu phù hợp là "Tôi muốn đưa ra một gợi ý về chủ đề này".', 'sentence-insertion', 4],
    ['q_rc3_144', 6, 'g_rc3_p6_4', p6_passage4, '144.', ['will offer', 'have offered', 'were offering', 'should be offering'], 3, '"Should be offering" = nên cung cấp. Cần modal "should" để đưa ra đề xuất phù hợp với nhà cung cấp dịch vụ y tế.', 'tense', 3],
    ['q_rc3_145', 6, 'g_rc3_p6_4', p6_passage4, '145.', ['After all', 'By the way', 'In the meantime', 'On the other hand'], 0, '"After all" = sau tất cả, dù sao thì. Dùng để nhấn mạnh / giải thích lý do (sứ mệnh là sức khỏe tốt).', 'phrase', 4],
    ['q_rc3_146', 6, 'g_rc3_p6_4', p6_passage4, '146.', ['useful', 'eventful', 'profitable', 'comfortable'], 0, '"Find it useful" = thấy nó hữu ích. Collocation phù hợp khi gửi tài liệu cho đồng nghiệp.', 'vocabulary', 2],
  ]
  p6_4.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // ============ PART 7 (147-200) - 54 câu, 15 passages ============

  // Q147-148: Medillo Shoes advertisement
  const p7_passage1 = `Questions 147-148 refer to the following advertisement.

Medillo Shoes Celebrates Twenty Years in Cape Town!
246 Breda Place, Wynberg, Cape Town 7800
021 555 0149 | www.medilloshoes.co.za

Does your job require you to stand all day long? Get the support you need! At Medillo Shoes, we specialise in comfortable, supportive footwear that is stylish and suitable for any business or medical setting.

Visit us on 10 May to receive 20 percent off your purchase of one or more pairs of shoes during this anniversary event. Should you need assistance finding the best shoes for your professional needs, our footwear specialists will be on hand to help. Schedule a free consultation at www.medilloshoes.co.za to avoid a long wait.`

  const p7_1 = [
    ['q_rc3_147', 7, 'g_rc3_p7_1', p7_passage1, 'What will happen at Medillo Shoes on May 10?', ['All shoes will be discounted.', 'Shop assistants will be hired.', 'A shoe style will be discontinued.', 'Operational hours will be extended.'], 0, '"Receive 20 percent off your purchase of one or more pairs of shoes" → giảm giá 20% tất cả giày trong ngày 10/5.', 'detail', 2],
    ['q_rc3_148', 7, 'g_rc3_p7_1', p7_passage1, 'What is indicated about Medillo Shoes?', ['It has been in business for ten years.', 'It specializes in athletic footwear.', 'It is located next to a medical center.', 'It allows customers to make appointments.'], 3, '"Schedule a free consultation at www.medilloshoes.co.za" → cho phép khách hàng đặt lịch hẹn.', 'inference', 3],
  ]
  p7_1.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q149-150: Neil Cullen email
  const p7_passage2 = `Questions 149-150 refer to the following e-mail.

To: Sales Team
From: Neil Cullen
Date: 10 April
Subject: My schedule next week

Dear Team,

I will be out of the office next week, from 15 to 19 April, attending the conference of the National Technology Alliance in Glasgow. While away, I will check e-mail and voice mail infrequently. For any urgent matters, please contact my assistant, Christina Choo. If you have a specific question about the Ezenx Industries account, please e-mail Mya Soroka. I will be back in the office on 22 April and will see all of you then.

Best,
Neil Cullen, Director of Sales and Marketing
Shallok Technology`

  const p7_2 = [
    ['q_rc3_149', 7, 'g_rc3_p7_2', p7_passage2, 'What is the purpose of the e-mail?', ['To register for a conference', 'To announce a new account', 'To schedule a meeting', 'To inform colleagues of an absence'], 3, 'Nội dung chính: thông báo vắng mặt tuần sau (15-19/4) đi dự hội nghị.', 'purpose', 2],
    ['q_rc3_150', 7, 'g_rc3_p7_2', p7_passage2, 'What is most likely true about Ms. Soroka?', ['She will be traveling with Mr. Cullen.', 'She works on the Ezenx Industries account.', "She is Ms. Choo's supervisor.", 'She will be out of the office until April 22.'], 1, '"If you have a specific question about the Ezenx Industries account, please e-mail Mya Soroka" → cô ấy phụ trách tài khoản Ezenx Industries.', 'inference', 3],
  ]
  p7_2.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q151-152: Bryanton Building Permit notice
  const p7_passage3 = `Questions 151-152 refer to the following notice.

CITY OF BRYANTON
Building Permit Office
Notice for residents and contractors working in Bryanton

Beginning on Monday, July 1, the City of Bryanton's Building Permit Office, located at 912 Fir Avenue, will be open from Monday to Thursday, 9:00 A.M. to 5:00 P.M. Applications for permits will no longer be accepted on Fridays or Saturdays. The average processing time for permit applications will remain three business days. With this change, the city will lower its operating costs while maintaining its high standards of service for residents.`

  const p7_3 = [
    ['q_rc3_151', 7, 'g_rc3_p7_3', p7_passage3, 'What change is the Building Permit Office making?', ['It is moving to a new location.', 'It is simplifying the permit application process.', 'It is reducing the number of days it will accept permit applications.', 'It is increasing the processing time for permit applications.'], 2, '"Applications for permits will no longer be accepted on Fridays or Saturdays" → giảm số ngày nhận đơn.', 'detail', 2],
    ['q_rc3_152', 7, 'g_rc3_p7_3', p7_passage3, 'According to the notice, why is the change being made?', ['To save the city money', 'To attract more residents', 'To improve the quality of service', 'To decrease the number of new permit applications'], 0, '"The city will lower its operating costs" → tiết kiệm tiền cho thành phố.', 'detail', 2],
  ]
  p7_3.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q153-155: River Thames Tours confirmation
  const p7_passage4 = `Questions 153-155 refer to the following online order confirmation.

https://www.riverthamestours.uk/order/confirmation
River Thames Tours

Thank you for reserving a River Thames tour with us. We are eager to welcome you aboard. Each tour lasts 3 hours. Your tour includes a luncheon served at 1:00 p.m. Please consult our Web site for a menu. Should you have any dietary restrictions and like to request a special meal, please contact our customer experience manager, Martin Torma, at least 48 hours prior to your tour.

This reservation also entitles you to a 10 percent discount on a walking tour by Edgerton Walking Tours—just provide your confirmation code when booking.

Name: Lewis Califf
Purchase Date: 18 April
Confirmation Code: H102057
Tour Start: 1 May, 11:30 a.m.
Quantity: 4
Total: £180.00
Payment: Credit card ending in 1037

Please note: Boarding ends 10 minutes before departure time.
Tours cannot be rescheduled.`

  const p7_4 = [
    ['q_rc3_153', 7, 'g_rc3_p7_4', p7_passage4, 'What is indicated about the river tour?', ['It is one hour long.', 'It comes with a meal.', 'It can be rescheduled.', 'It sells out quickly.'], 1, '"Your tour includes a luncheon served at 1:00 p.m." → tour bao gồm bữa ăn trưa.', 'detail', 2],
    ['q_rc3_154', 7, 'g_rc3_p7_4', p7_passage4, 'How many tickets did Mr. Califf purchase?', ['1', '3', '4', '7'], 2, '"Quantity: 4" → mua 4 vé.', 'detail', 1],
    ['q_rc3_155', 7, 'g_rc3_p7_4', p7_passage4, 'How can customers receive a discount on a walking tour?', ['By making a reservation online', 'By paying with a credit card', 'By requesting a coupon from the captain', 'By mentioning a confirmation code'], 3, '"just provide your confirmation code when booking" → cung cấp mã xác nhận khi đặt.', 'detail', 2],
  ]
  p7_4.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q156-157: Online chat - paper supply
  const p7_passage5 = `Questions 156-157 refer to the following online chat discussion.

Michiko Saunders [8:06 A.M.]
Hi, Jacob. Are you on your way to the office?

Jacob Kwon [8:08 A.M.]
Yes. I should be there in about 25 minutes.

Michiko Saunders [8:10 A.M.]
OK. I was just starting to print out the design proposal for the Dansby Group, but we've run out of paper. And we don't have another delivery of it coming until Wednesday.

Jacob Kwon [8:12 A.M.]
I see an office supply store across the street. It just opened for the day.

Michiko Saunders [8:13 A.M.]
Fantastic. Three packs of paper should be enough.

Jacob Kwon [8:15 A.M.]
OK. By the way, when will the representatives from the Dansby Group be coming to our office? I could also pick up some coffee and snacks for that meeting.`

  const p7_5 = [
    ['q_rc3_156', 7, 'g_rc3_p7_5', p7_passage5, 'At 8:12 A.M., what does Mr. Kwon most likely mean when he writes, "I see an office supply store across the street"?', ['He needs help finding a building.', 'He can purchase some paper.', 'He will look for a new printer.', 'He is going to negotiate a delivery schedule.'], 1, 'Ngữ cảnh: hết giấy in → Kwon thấy cửa hàng văn phòng phẩm → có thể mua giấy.', 'inference', 3],
    ['q_rc3_157', 7, 'g_rc3_p7_5', p7_passage5, 'What will Ms. Saunders most likely do next?', ['Reschedule a meeting', 'Prepare some refreshments', 'Check on an arrival time', 'Revise a design proposal'], 2, 'Kwon hỏi khi nào đại diện Dansby Group đến → Sanders sẽ trả lời / kiểm tra thời gian đến.', 'inference', 3],
  ]
  p7_5.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q158-160: Kipbank letter (with sentence insertion)
  const p7_passage6 = `Questions 158-160 refer to the following letter.

Kipbank Business Services
548 Sycamore Lake Road
Green Bay, WI 54301

April 2

Madeline Omar
Passionflower Interior Design
1556 Deer Run Road
Green Bay, WI 54301

Dear Ms. Omar,

A business owner's days are filled with juggling the wants, needs, and demands of customers, staff, and suppliers. — [1] —.

Let Kipbank find the right solutions for your small business so that you can focus on your products and people. Kipbank offers checking accounts, corporate credit cards, business loans, and payroll and bookkeeping services. — [2] —. This fall, we will also add financial planners to our team to help you and your employees plan for your futures.

With our corporate credit cards, Kipbank customers can take advantage of money-saving offers from selected hotel, office supply, and air travel partners. — [3] —. These deals are automatically applied to qualified purchases. And the business owner can place spending limits on each card. — [4] —.

Please call us at 920-555-0122 to set up an appointment or just stop by when it is convenient. We look forward to meeting you and providing your enterprise with superior service.

Sincerely,
Thomas Piskorksi
Thomas Piskorksi, Kipbank Customer Concierge`

  const p7_6 = [
    ['q_rc3_158', 7, 'g_rc3_p7_6', p7_passage6, 'What is suggested about Ms. Omar?', ['She is an accountant.', 'She works for Mr. Piskorksi.', 'She operates a small company.', 'She is a Kipbank customer.'], 2, 'Người nhận là "Passionflower Interior Design" và thư nói "your small business" → cô vận hành một công ty nhỏ.', 'inference', 3],
    ['q_rc3_159', 7, 'g_rc3_p7_6', p7_passage6, 'What is stated about the credit cards?', ['They come in a variety of colors.', 'They require an annual fee.', 'They include discounts on certain purchases.', 'They can be used to buy personal items.'], 2, '"Money-saving offers from selected hotel, office supply, and air travel partners" → thẻ có giảm giá cho một số mua sắm.', 'detail', 2],
    ['q_rc3_160', 7, 'g_rc3_p7_6', p7_passage6, 'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?\n"Everyday financial details only add more distractions."', ['[1]', '[2]', '[3]', '[4]'], 0, 'Câu [1] ngay sau câu mô tả "ngày của doanh nhân đầy rẫy những juggling" → câu phù hợp nhất là chi tiết tài chính hàng ngày càng thêm phiền nhiễu.', 'sentence-insertion', 4],
  ]
  p7_6.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q161-163: Waldenstone Business Review article
  const p7_passage7 = `Questions 161-163 refer to the following newspaper article.

OTTAWA (22 May)—Waldenstone Business Review has added a new category to its esteemed international business awards this year. The Waldenstone Corporate Prize is awarded to a business with the foresight to develop strategies that help ensure the company's long-term viability.

This year's award was presented to Carila Corporation, a major player in the electronics sector. Under the direction of CEO Atsak Kakar, Carila Corporation went from near bankruptcy to a high level of profitability in just three years.

"Winning this award was very gratifying, not just for me but for the entire company," Mr. Kakar said upon receiving the award. "Everyone has worked extremely hard to get this company back on solid financial ground. The long-term solution has brought exceptional value to our shareholders."`

  const p7_7 = [
    ['q_rc3_161', 7, 'g_rc3_p7_7', p7_passage7, 'What is the purpose of the article?', ['To profile a newly opened business', 'To analyze a trend in the electronics industry', "To highlight a company's achievement", 'To discuss changes to an employment contract'], 2, 'Bài viết nói về Carila Corporation được trao giải thưởng → làm nổi bật thành tựu của công ty.', 'purpose', 2],
    ['q_rc3_162', 7, 'g_rc3_p7_7', p7_passage7, 'What is suggested about Carila Corporation?', ['It no longer develops electronics.', 'It was once a struggling business.', 'It has been unable to attract more clients.', 'It is seeking to replace its CEO.'], 1, '"Went from near bankruptcy to a high level of profitability" → từng là doanh nghiệp gặp khó khăn.', 'inference', 3],
    ['q_rc3_163', 7, 'g_rc3_p7_7', p7_passage7, 'The word "solution" in paragraph 3, line 6, is closest in meaning to', ['mixture', 'proof', 'statement', 'answer'], 3, '"Solution" trong ngữ cảnh "long-term solution has brought exceptional value" = giải pháp, đáp án. "Answer" gần nghĩa nhất.', 'vocabulary', 3],
  ]
  p7_7.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q164-167: Commbolt ad (with sentence insertion)
  const p7_passage8 = `Questions 164-167 refer to the following advertisement.

Commbolt is for Everyone!

As a Commbolt customer, you've come to expect the best in reliable high-speed Internet, straightforward pricing options, and top-notch customer service from friendly professionals who are responsive to your every need. — [1] —. Unlike the competition, we promise to never lock you into inflexible contracts or suddenly raise your monthly bill without notice.

At Commbolt, we know you have options when it comes to choosing an Internet service provider. — [2] —. To show our gratitude for your loyalty, we are offering a special limited-time referral bonus.

The way it works is simple. — [3] —. You can use e-mail, social media, or even text messages to tell everyone about Commbolt. When a new user signs up using your code, each of you will receive a monetary credit. Receive $10 when new referrals sign up for a monthly plan at $45, and receive $20 for a plan costing $60 per month. The best news? — [4] —. There is no limit to the credits; the more people you sign up, the more money you get.

Your unique code is XA4R177.`

  const p7_8 = [
    ['q_rc3_164', 7, 'g_rc3_p7_8', p7_passage8, 'What Commbolt benefit does the advertisement mention?', ['Its low prices', 'Its excellent customer service', 'Its lifetime contracts', 'Its convenient installation schedule'], 1, '"Top-notch customer service from friendly professionals" → dịch vụ khách hàng xuất sắc.', 'detail', 2],
    ['q_rc3_165', 7, 'g_rc3_p7_8', p7_passage8, 'What is the maximum amount a customer can earn when one referred person signs up for service?', ['$10.00', '$20.00', '$45.00', '$60.00'], 1, 'Gói $60/tháng → nhận $20 (cao nhất). Gói $45 → nhận $10.', 'detail', 2],
    ['q_rc3_166', 7, 'g_rc3_p7_8', p7_passage8, 'What is true about the Commbolt promotion?', ['It may not be posted on social media.', 'It does not provide credit for more than three referrals.', 'It is expected to run for a full year.', 'It rewards both new and existing customers.'], 3, '"Each of you will receive a monetary credit" → cả người giới thiệu (existing) và người mới (new) đều được thưởng.', 'detail', 3],
    ['q_rc3_167', 7, 'g_rc3_p7_8', p7_passage8, 'In which of the positions marked [1], [2], [3], or [4] does the following sentence best belong?\n"Just share your unique referral code with friends and family."', ['[1]', '[2]', '[3]', '[4]'], 2, 'Câu [3] ngay sau "The way it works is simple." → câu phù hợp nhất là hướng dẫn "Just share your unique referral code..."', 'sentence-insertion', 4],
  ]
  p7_8.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q168-171: Sarah's Catering web page
  const p7_passage9 = `Questions 168-171 refer to the following Web page.

https://www.sarahscatering.com
Sarah's Catering—What You Serve Matters

Sarah's Catering is a family-owned-and-operated company. The company was founded ten years ago with a mission to provide the highest quality catering services in our community. We work closely with local growers and use only the freshest ingredients. Our menu items can be adapted to the client's taste or dietary needs. For example, we can prepare vegetarian, vegan, and gluten-free options.

We provide catering for birthday parties, wedding receptions, corporate meetings, business holiday parties, and many other types of events. From planning the menu and preparing your food to engaging servers and cleanup staff for the event, Sarah's Catering has it covered.

Sarah's Catering can cater lunches in your office for a minimum of twenty people. We offer delicious options to make your group's meal a satisfying experience.

We're here to serve you! Ordering is fast and simple. Visit www.sarahscatering.com/quote to request a cost estimate for your next event.

What people are saying
"Sarah's Catering was very easy to work with, and the food was delicious! Everyone in the office commented on how good the food was." — Glen Liu, Perkins Real Estate
"All the food was perfect, and the staff was the best." — Annie Pierce, Kania Marketing, Inc.`

  const p7_9 = [
    ['q_rc3_168', 7, 'g_rc3_p7_9', p7_passage9, 'What is indicated about Sarah\'s Catering?', ['It uses locally sourced products.', 'It is twenty years old.', 'It specializes mainly in weddings.', 'It has an on-site dining room.'], 0, '"We work closely with local growers and use only the freshest ingredients" → sử dụng sản phẩm nguồn địa phương.', 'detail', 2],
    ['q_rc3_169', 7, 'g_rc3_p7_9', p7_passage9, 'The word "taste" in paragraph 1, line 4, is closest in meaning to', ['preference', 'sample', 'experience', 'flavor'], 0, '"Adapted to the client\'s taste or dietary needs" → "taste" = khẩu vị, sở thích. "Preference" gần nghĩa nhất.', 'vocabulary', 3],
    ['q_rc3_170', 7, 'g_rc3_p7_9', p7_passage9, 'What is mentioned as a service provided by Sarah\'s Catering?', ['Entertainment planning', 'Cooking demonstrations', 'Cleanup after meals', 'Rentals of tables and chairs'], 2, '"Engaging servers and cleanup staff for the event" → cung cấp nhân viên dọn dẹp sau bữa ăn.', 'detail', 2],
    ['q_rc3_171', 7, 'g_rc3_p7_9', p7_passage9, 'Who most likely is Mr. Liu?', ['An employee of Sarah\'s Catering', 'A professional event manager', 'A customer of Sarah\'s Catering', 'An assistant at a marketing firm'], 2, 'Mr. Liu để lại lời nhận xét tích cực về dịch vụ → là khách hàng của Sarah\'s Catering.', 'inference', 2],
  ]
  p7_9.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q172-175: Online chat about video conference & printing issues
  const p7_passage10 = `Questions 172-175 refer to the following online chat discussion.

Marcus Steuber [10:41 A.M.] Are we still planning to have the author video conference today? I haven't yet received a meeting invitation.
Brinda Rajan [10:42 A.M.] I do have the meeting on my calendar. Let me forward it to you; it appears our editorial assistant didn't include you.
Marcus Steuber [10:43 A.M.] Thanks, I just received it. The timing doesn't work for me, though. I have an appointment with Hazel Luong to discuss the printing issues at our Singapore plant.
Brinda Rajan [10:44 A.M.] Could you postpone that? The new author we're working with really needs your guidance on the final book design and formatting. You're our most knowledgeable production editor.
Marcus Steuber [10:45 A.M.] Let me check with my supervisor. I'll add Mr. Borg to our chat.
Joshua Borg [10:47 A.M.] Hi, team. Marcus, you should prioritize your appointment with Hazel. I'll be visiting the plant next week, and we need to have some viable solutions before then.
Brinda Rajan [10:48 A.M.] OK, I'll contact Ms. Benoit to find out if she can meet later in the day, then.
Marcus Steuber [10:48 A.M.] That would work. I'm free between 4 and 6 P.M.`

  const p7_10 = [
    ['q_rc3_172', 7, 'g_rc3_p7_10', p7_passage10, 'Why does Mr. Steuber write to Ms. Rajan?', ['To invite her to a professional event', 'To check on the status of a meeting', 'To make travel plans for a business trip', "To ask about an assistant's performance"], 1, '"Are we still planning to have the author video conference today? I haven\'t yet received a meeting invitation." → kiểm tra tình trạng cuộc họp.', 'purpose', 2],
    ['q_rc3_173', 7, 'g_rc3_p7_10', p7_passage10, 'At 10:45 A.M., what does Mr. Steuber most likely mean when he writes, "Let me check with my supervisor"?', ['He needs final approval on a book design.', 'He would like advice on changing an appointment.', 'He requires access to the corporate calendar.', 'He is uncertain how to add team members to the chat.'], 1, 'Ngữ cảnh: Brinda đề nghị hoãn lịch hẹn với Hazel → Marcus cần xin ý kiến supervisor để thay đổi lịch hẹn.', 'inference', 3],
    ['q_rc3_174', 7, 'g_rc3_p7_10', p7_passage10, 'Who most likely is Ms. Benoit?', ['A writer', 'A designer', 'A production editor', 'A printing plant supervisor'], 0, 'Brinda nói "I\'ll contact Ms. Benoit to find out if she can meet later" thay cho buổi video conference với tác giả → Ms. Benoit là tác giả.', 'inference', 4],
    ['q_rc3_175', 7, 'g_rc3_p7_10', p7_passage10, 'What will Ms. Rajan probably do next?', ['Suggest solutions to a printing issue', 'Arrange to visit the Singapore plant', 'Attend a meeting with Ms. Luong', 'Reschedule a video conference'], 3, '"I\'ll contact Ms. Benoit to find out if she can meet later in the day" → sắp xếp lại lịch video conference với tác giả.', 'inference', 3],
  ]
  p7_10.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q176-180: Rambling River Festival schedule + text message
  const p7_passage11 = `Questions 176-180 refer to the following schedule and text message.

Rambling River Festival Schedule of Musical Events

Friday, September 8
- 3:30 P.M. Johanna Greenblatt
- 8:00 P.M. Bethesda Radio Show featuring the Blass Brothers Band (to be recorded at the Bramley Theater)

Saturday, September 9
- 6:30 P.M. The Rolling Dozen
- 7:45 P.M. Jefferson Cage

All events take place at the Bethesda Park Open-Air Stage unless otherwise noted. Feel free to bring picnic blankets.

---

Text Message: From Rambling River Festival, Sep 8, 9:14 A.M.

This afternoon's performance will take place in Cole Hall in anticipation of inclement weather. Bulky items are not allowed, but coat-check service will be available.

This evening's performance is being pushed to 2:30 P.M. tomorrow; local band Kirscha will perform during the original time slot instead.

We expect our full Saturday program to take place at the Bethesda Park Open-Air Stage.`

  const p7_11 = [
    ['q_rc3_176', 7, 'g_rc3_p7_11', p7_passage11, 'Who was originally scheduled to perform at the Bramley Theater?', ['Johanna Greenblatt', 'The Blass Brothers Band', 'The Rolling Dozen', 'Jefferson Cage'], 1, '"Bethesda Radio Show featuring the Blass Brothers Band (to be recorded at the Bramley Theater)" → Blass Brothers Band biểu diễn tại Bramley Theater.', 'detail', 2],
    ['q_rc3_177', 7, 'g_rc3_p7_11', p7_passage11, 'What does the schedule suggest about the Rambling River Festival?', ['It takes place annually.', 'It requires a ticket for entry.', 'It features local food vendors.', 'It is mainly an outdoor event.'], 3, '"All events take place at the Bethesda Park Open-Air Stage unless otherwise noted" → chủ yếu là sự kiện ngoài trời.', 'inference', 3],
    ['q_rc3_178', 7, 'g_rc3_p7_11', p7_passage11, 'According to the text message, what can audience members do at Cole Hall?', ['Check coats', 'Store bulky items', 'Buy concert tickets', 'Pick up a schedule of events'], 0, '"Coat-check service will be available" → khách có thể gửi áo khoác.', 'detail', 2],
    ['q_rc3_179', 7, 'g_rc3_p7_11', p7_passage11, 'In the text message, the word "pushed" in paragraph 2, line 1, is closest in meaning to', ['moved', 'extended', 'managed', 'pressured'], 0, '"Pushed to 2:30 P.M. tomorrow" = dời sang 2:30 chiều mai. "Pushed" = moved.', 'vocabulary', 3],
    ['q_rc3_180', 7, 'g_rc3_p7_11', p7_passage11, 'When will Kirschau perform?', ['At 3:30 P.M. on Friday', 'At 8:00 P.M. on Friday', 'At 2:30 P.M. on Saturday', 'At 6:30 P.M. on Saturday'], 1, 'Buổi tối thứ 6 (8:00 P.M.) bị dời → Kirscha biểu diễn trong khung giờ gốc (8:00 P.M. thứ 6).', 'detail', 3],
  ]
  p7_11.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q181-185: Ogden Bank email + article
  const p7_passage12 = `Questions 181-185 refer to the following e-mail and article.

E-mail
To: All Branch Managers
From: Fran Corliss
Subject: Survey results on mobile banking
Date: April 7

Hello all,

Ogden Bank recently conducted a survey of its customers concerning mobile banking. Here are some key takeaways.

Over 95 percent of our customers own a mobile device. However, although interest in mobile banking is high, only 39 percent of our customers use our application. Some customers cite security concerns (23 percent), but a majority (78 percent) say that they simply do not think the app works well.

A mandatory meeting for all branch managers will be held at our headquarters on April 12 at 4:00 P.M. to brainstorm strategies for responding to this challenge.

Best,
Fran Corliss
Director of Mobile Banking, Ogden Bank

---

Article: Boost for Mobile Banking
By Edward Panzius

FLEMINGTON (May 25)—Ogden Bank has rolled out major improvements to its mobile banking application. It has expanded the variety of tasks that can be accomplished through the app and made it much easier to use.

"Many of our account holders have been frustrated in the past by a clunky, limited app," said Alys DeFreese, manager of the Flemington branch of Ogden Bank. "They can now do just about any task with the app that they could over the phone or by visiting a branch in person. This is just another example of how we support our customers in any way we can."

According to Ms. DeFreese, in the few weeks since the upgrade, 20 percent of account holders have switched to depositing checks and paying bills online. She anticipates that number will rise as more customers learn about the easy-to-use app.

"The convenience made a big difference for me," said account holder Yair Baum. Another customer, Maria Reed, added, "I appreciate the flexibility of being able to do my banking whenever and wherever I want."`

  const p7_12 = [
    ['q_rc3_181', 7, 'g_rc3_p7_12', p7_passage12, 'What is one purpose of the e-mail?', ['To provide details on a new privacy policy', 'To propose a survey of banking habits', 'To ask bank staff to test a mobile app', 'To inform managers of a company problem'], 3, 'Email thông báo kết quả khảo sát: chỉ 39% khách dùng app, 78% cho rằng app hoạt động không tốt → thông báo vấn đề cho quản lý.', 'purpose', 3],
    ['q_rc3_182', 7, 'g_rc3_p7_12', p7_passage12, 'According to the e-mail, what percentage of the bank\'s customers use the mobile app?', ['23 percent', '39 percent', '78 percent', '95 percent'], 1, '"Only 39 percent of our customers use our application" → 39%.', 'detail', 2],
    ['q_rc3_183', 7, 'g_rc3_p7_12', p7_passage12, 'In the article, the word "anticipates" in paragraph 3, line 5, is closest in meaning to', ['considers', 'waits for', 'prepares for', 'expects'], 3, '"She anticipates that number will rise" = cô ấy dự kiến/trông chừng con số sẽ tăng. "Anticipates" = expects.', 'vocabulary', 3],
    ['q_rc3_184', 7, 'g_rc3_p7_12', p7_passage12, 'Who most likely attended a meeting at Ogden Bank headquarters on April 12?', ['Mr. Panzius', 'Ms. DeFreese', 'Mr. Baum', 'Ms. Reed'], 1, 'Cuộc họp bắt buộc cho "all branch managers" → Ms. DeFreese (manager of Flemington branch) tham dự.', 'inference', 3],
    ['q_rc3_185', 7, 'g_rc3_p7_12', p7_passage12, 'What is suggested about Ogden Bank\'s management?', ['It prefers that account holders do their banking in person.', 'It is considering offering free checking to new account holders.', 'It is in the process of hiring more staff.', 'It prioritizes improvements in customer experience.'], 3, 'Ban quản lý đã tiến hành khảo sát và cải tiến app dựa trên phản hồi → ưu tiên cải thiện trải nghiệm khách hàng.', 'inference', 4],
  ]
  p7_12.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q186-190: Westwood Library book club notice + Lisa Calle email
  const p7_passage13 = `Questions 186-190 refer to the following notice, Web page, and e-mail.

Notice:
Attention, Library Members
The Westwood Library is excited to announce the start of a book club, which is open to all library members. The club will meet on the last Thursday of each month, from 7:00 to 9:00 PM, in the Harrison Meeting Room, to discuss a book chosen by one of our professional staff. From January to June, we will read recently published nonfiction works, and from July to December, we will focus on contemporary fiction titles. For more information, visit www.westwoodlibrary.org or speak with the staff at the circulation desk.

Web page:
https://www.westwoodlibrary.org/bookclub
We hope you will join us for the book club on the last Thursday of each month at 7:00 P.M.! Below are the titles selected for the first half of the year.

January: Wild Open Range by Jaxon McDonald
February: The Journey of a Song by Lucy Xi
March: Due North: Adventures in Alaska's Northern Territory by Isabel Beck
April: The Art of Mindful Carpentry by Peter Landers
May: Mary Swan: A Legend Before Her Time by Kai Noble
June: To Be Announced

---

E-mail:
To: Lisa Calle <lcalle@worldmail.com>
From: Gail Frey <gfrey@myemail.com>
Date: March 27
Subject: Book club

Dear Ms. Calle,

It was delightful to see you leading the book club yesterday evening. Ms. Beck's Due North is lengthy, and it was a challenge to finish it before the meeting. However, I have to thank you for choosing that book because it revived my childhood interest in traveling to Alaska. In fact, I've already looked up some tours!

The club meeting was packed, and I hardly got to talk to you. We should catch up sometime soon. Perhaps we might try the new French restaurant on Looper Street. I hear it is amazing and reasonably priced.

Sincerely,
Gail Frey`

  const p7_13 = [
    ['q_rc3_186', 7, 'g_rc3_p7_13', p7_passage13, 'What is the purpose of the notice?', ['To highlight some books in the library', 'To announce a change in library hours', 'To promote an activity at the library', 'To introduce a new librarian'], 2, 'Notice thông báo bắt đầu câu lạc bộ sách → quảng bá hoạt động tại thư viện.', 'purpose', 2],
    ['q_rc3_187', 7, 'g_rc3_p7_13', p7_passage13, 'What is suggested about the book Wild Open Range?', ['It is a best-selling title.', 'It is a work of nonfiction.', 'It was published ten years ago.', 'It is available at a discount for library members.'], 1, 'Thông báo: "From January to June, we will read recently published nonfiction works" → Wild Open Range (tháng 1) là sách phi hư cấu.', 'inference', 3],
    ['q_rc3_188', 7, 'g_rc3_p7_13', p7_passage13, 'What author most likely wrote about a famous person?', ['Jaxon McDonald', 'Lucy Xi', 'Peter Landers', 'Kai Noble'], 3, '"Mary Swan: A Legend Before Her Time by Kai Noble" → "Legend" gợi ý Mary Swan là người nổi tiếng → Kai Noble viết về người nổi tiếng.', 'inference', 3],
    ['q_rc3_189', 7, 'g_rc3_p7_13', p7_passage13, 'What can be concluded about Ms. Calle?', ['She is a library staff member.', 'She has written book reviews.', "She is Ms. Frey's supervisor.", 'She favors historical fiction.'], 0, 'Email: "It was delightful to see you leading the book club" + Notice nói sách được chọn bởi "professional staff" → Ms. Calle là nhân viên thư viện.', 'inference', 3],
    ['q_rc3_190', 7, 'g_rc3_p7_13', p7_passage13, 'What does Ms. Frey indicate about the book she read?', ['It discussed a topic that was unfamiliar to her.', 'It had parts that she thought were inaccurate.', 'It was easy to read in the time available.', 'It inspired her to explore an old interest.'], 3, '"It revived my childhood interest in traveling to Alaska" → truyền cảm hứng khám phá lại sở thích cũ.', 'detail', 3],
  ]
  p7_13.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q191-195: George Street Sweets order emails + receipt
  const p7_passage14 = `Questions 191-195 refer to the following e-mails and receipt.

From: Tatiana Schwartz <orders@georgestreetsweets.co.uk>
To: Alejandro Ordaz <aordaz@brooksidestationery.co.uk>
Date: 28 April
Subject: Confirmation of order number 47892
Attachment: Order receipt

Dear Mr. Ordaz,

Thank you for placing an order with George Street Sweets. This e-mail is to confirm that we have received your request. Your receipt has been attached to this e-mail.

If you have any questions or need to make any changes to your order, please reply to this message or phone us at (091) 498 0172. Note that we are unable to accommodate order changes that are submitted less than 48 hours before your scheduled pickup time.

If picking up your order, we are located at 29 George Street. Parking is available next door, directly behind Spike's Cycle Shop. We offer delivery to customers within 10 kilometres of our shop for a fee of £2.50. Please note that cancellations within 24 hours of your pickup or delivery time will not be refunded.

Sincerely,
Tatiana Schwartz

---

George Street Sweets
Order: 47892
Date of Order: 28 April
Pickup Date and Time: N/A
Delivery Date and Time: 2 May, 11:30 A.M.
Delivery Location: 2 Spen Lane, Business Suite 202
Payment Method: Credit Card—Alejandro Ordaz
Customisation Instructions: None

Item | Cost
18-inch round cake (chocolate with vanilla icing) | £32.00
1 set of candles | £5.00
Delivery | £2.50
Total | £39.50

---

From: Alejandro Ordaz <aordaz@brooksidestationery.co.uk>
To: Tatiana Schwartz <orders@georgestreetsweets.co.uk>
Date: 29 April
Subject: RE: Confirmation of order number 47892

Dear Ms. Schwartz,

I received my order confirmation e-mail and receipt, and I noticed an error. It seems that the person to whom I spoke on the phone while placing my order did not copy down the message I requested. The customisation I specified was that "Happy Retirement" be written on top.

I hope it will still be possible to include this message despite the timing. Please respond to this e-mail to confirm. Also, there will be more guests than I originally expected, so I might contact your business again to place an additional order.

Best,
Alejandro Ordaz`

  const p7_14 = [
    ['q_rc3_191', 7, 'g_rc3_p7_14', p7_passage14, 'What is a policy of George Street Sweets?', ['Orders cannot be changed.', 'Orders placed less than 48 hours before pickup incur an extra fee.', 'Orders must be paid for when they are placed.', 'Orders cannot be refunded within 24 hours of pickup.'], 3, '"Cancellations within 24 hours of your pickup or delivery time will not be refunded" → không hoàn tiền nếu hủy trong vòng 24 giờ.', 'detail', 3],
    ['q_rc3_192', 7, 'g_rc3_p7_14', p7_passage14, 'What is suggested about the building at 2 Spen Lane?', ['It has parking spaces behind a bicycle shop.', 'It is located within 10 kilometers of George Street Sweets.', 'It is a residential apartment building.', 'It is owned by Ms. Schwartz.'], 1, 'Đơn hàng có phí delivery £2.50 = phí giao trong 10 km → 2 Spen Lane nằm trong phạm vi 10 km.', 'inference', 3],
    ['q_rc3_193', 7, 'g_rc3_p7_14', p7_passage14, 'What can be concluded about the cake?', ['It has not been paid for yet.', 'It will have only chocolate icing.', 'It was ordered over the phone.', 'It contains ice cream.'], 2, '"The person to whom I spoke on the phone while placing my order" → bánh được đặt qua điện thoại.', 'inference', 3],
    ['q_rc3_194', 7, 'g_rc3_p7_14', p7_passage14, 'In the second e-mail, what does Mr. Ordaz request?', ['A full refund', 'A different flavor', 'A response to an e-mail', 'An additional candle'], 2, '"Please respond to this e-mail to confirm" → yêu cầu trả lời email để xác nhận.', 'detail', 2],
    ['q_rc3_195', 7, 'g_rc3_p7_14', p7_passage14, 'What does Mr. Ordaz mention about the event in his e-mail?', ['It will take place on April 29.', 'It is an anniversary party.', 'Its start time has changed.', 'It will be larger than expected.'], 3, '"There will be more guests than I originally expected" → sự kiện sẽ lớn hơn dự kiến.', 'detail', 2],
  ]
  p7_14.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q196-200: Woolf Flooring email + survey + Miyoko report
  const p7_passage15 = `Questions 196-200 refer to the following e-mail, survey, and report.

E-mail:
To: Undisclosed Recipients
From: iqbal_grewal@woolfflooring.com.au
Date: 12 June
Subject: Cost-savings survey

Dear Colleagues,

At Woolf Flooring we are looking for ways to reduce day-to-day costs without sacrificing product quality, customer service, or staff morale. To this end, we are seeking input from select staff members in a variety of departments via an online survey that can be found at www.surveyquest.com.au/109820. Everyone who has been chosen to take part in the survey has been with the company for at least ten years and, therefore, is very familiar with our processes.

The deadline for completing the survey is 19 June. Note that this survey is for recipients of this e-mail only. Please do not forward this e-mail to others or post the link to the survey elsewhere.

We also plan to hire outside consultants to review our operations and write a report of their findings. We understand that some colleagues disagree with this approach to cutting costs; however, we have determined that getting an outside perspective is a worthwhile investment that will be likely to save us money in the long run.

Best,
Iqbal Grewal, Director of Business Transformation
Woolf Flooring

---

Survey:
https://www.surveyquest.com.au/109820
Woolf Flooring Cost-Savings Survey

Based on your experience as an employee of Woolf Flooring, please provide one idea for a change that could be implemented to improve productivity and cut costs. Thank you.

Date: 18 June
Name and role: Beth Mair, sales manager

I have noticed that some employees grab a new pair of disposable gloves every time they return from a break. They could be using the same ones throughout the whole day. By limiting the use of gloves to one pair per day, Woolf Flooring would save thousands of dollars per year. Doing so would also reduce waste. A new policy regarding the use of personal protective items would be easy to implement immediately and would simply require sending a company-wide e-mail to explain it.

---

Miyoko Consulting
Woolf Flooring Report Summary

Thank you for allowing us to spend the last few weeks reviewing your operations. You will find a detailed expense-reduction report with projected savings in the pages that follow. Here is a list of our main recommendations.

1. Employees do not always use wood stains and other materials as efficiently as possible. More training time could be dedicated to this.
2. Employees could be more mindful of electricity costs—for instance, turning off all lights and machines when not in use.
3. Several Internet service providers are offering special pricing right now. Switching to one of these providers could save a considerable amount of money in the long run.
4. More effort could be made to reuse supplies—for example, some basic personal protective equipment could be used more than once.`

  const p7_15 = [
    ['q_rc3_196', 7, 'g_rc3_p7_15', p7_passage15, 'In his e-mail, what does Mr. Grewal indicate about the survey?', ['It does not have an end date.', 'It requires the use of a password.', 'It can be completed on paper.', 'It should not be shared with others.'], 3, '"Please do not forward this e-mail to others or post the link to the survey elsewhere" → không nên chia sẻ với người khác.', 'detail', 2],
    ['q_rc3_197', 7, 'g_rc3_p7_15', p7_passage15, 'According to the e-mail, what do some Woolf Flooring employees disagree with?', ['The plan to hire consultants', 'The way a survey is structured', 'The way a budget report is presented', 'The departments selected to provide feedback'], 0, '"Some colleagues disagree with this approach to cutting costs" → "this approach" = "hire outside consultants" → không đồng ý với kế hoạch thuê tư vấn.', 'detail', 3],
    ['q_rc3_198', 7, 'g_rc3_p7_15', p7_passage15, 'What can be concluded about Ms. Mair?', ['She regularly provides ideas for change.', 'She has worked at Woolf Flooring for many years.', 'She will be helping to collect feedback.', 'She works in the production department.'], 1, 'Email: "Everyone who has been chosen to take part in the survey has been with the company for at least ten years" → Ms. Mair (người khảo sát) đã làm việc nhiều năm.', 'inference', 3],
    ['q_rc3_199', 7, 'g_rc3_p7_15', p7_passage15, 'In the survey, what does Ms. Mair note about her suggestion?', ['It may require some new equipment.', 'It has worked well at other companies.', 'It could be implemented right away.', 'It has been suggested to management before.'], 2, '"Would be easy to implement immediately and would simply require sending a company-wide e-mail to explain it" → có thể triển khai ngay lập tức.', 'detail', 3],
    ['q_rc3_200', 7, 'g_rc3_p7_15', p7_passage15, 'What recommendation made by Miyoko Consulting corresponds with Ms. Mair\'s suggestion?', ['Recommendation 1', 'Recommendation 2', 'Recommendation 3', 'Recommendation 4'], 3, 'Ms. Mair đề xuất dùng lại găng tay (personal protective equipment). Recommendation 4: "some basic personal protective equipment could be used more than once" → tương ứng.', 'inference', 3],
  ]
  p7_15.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Insert all questions
  for (const q of questions) {
    await db.question.upsert({ where: { id: q.id }, update: q, create: q })
  }

  // Create test set
  const allIds = questions.map(q => q.id)
  const testSet = {
    id: 'ts_rc3_full',
    title: '🎯 Đề TOEIC Reading Test 3 (100 câu · 75 phút)',
    description: 'Đề TOEIC Reading đầy đủ từ Part 5 (30 câu), Part 6 (16 câu), Part 7 (54 câu) — tổng 100 câu. Lấy từ bộ đề Imax Toeic thật bạn cung cấp (TEST 3 RC.pdf). Có giải thích chi tiết bằng tiếng Việt sau khi nộp bài.',
    durationMin: 75,
    type: 'full',
    questionIds: JSON.stringify(allIds),
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
