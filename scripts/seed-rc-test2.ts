import { db } from '../src/lib/db'

// Đề TOEIC Reading Test 2 (RC) - 100 câu (Part 5: 101-130, Part 6: 131-146, Part 7: 147-200)
// Nguồn: TEST 2 RC.pdf (Imax Toeic) - user upload
// Mỗi câu có: question, options, answer, explanation (tiếng Việt)

async function main() {
  console.log('Seeding TOEIC Reading Test 2 (100 questions)...')

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
    ['q_rc2_101', 5, null, null, 'Before operating your handheld device, please ------ the enclosed cable to charge it.', ['plan', 'remain', 'use', 'finish'], 2, '"Use" = sử dụng. Ngữ cảnh: sử dụng cáp để sạc thiết bị cầm tay.', 'vocabulary', 2],
    ['q_rc2_102', 5, null, null, "Safile's new external hard drive can ------ store up to one terabyte of data.", ['secure', 'security', 'securely', 'secured'], 2, 'Cần trạng từ (adverb) bổ nghĩa cho động từ "store". "Securely" = một cách an toàn.', 'word-form', 3],
    ['q_rc2_103', 5, null, null, 'Mr. Peterson will travel ------ the Tokyo office for the annual meeting.', ['to', 'through', 'in', 'over'], 0, '"Travel to" = đi đến. Giới từ chỉ hướng di chuyển.', 'preposition', 2],
    ['q_rc2_104', 5, null, null, "Yong-Soo Cosmetics will not charge for items on back order until ------ have left our warehouse.", ['them', 'they', 'themselves', 'their'], 1, 'Cần đại từ chủ ngữ số nhiều thay cho "items". "They" làm chủ ngữ của "have left".', 'pronoun', 2],
    ['q_rc2_105', 5, null, null, 'Our premium day tour takes visitors to historic sites ------ the Aprico River.', ['onto', 'since', 'inside', 'along'], 3, '"Along" = dọc theo. "Along the river" = dọc theo dòng sông.', 'preposition', 2],
    ['q_rc2_106', 5, null, null, 'Eighty percent of drivers surveyed said they would consider buying a vehicle that runs on ------.', ['electricity', 'electrically', 'electricians', 'electrify'], 0, 'Cần danh từ sau "runs on". "Electricity" = điện. "Runs on electricity" = chạy bằng điện.', 'word-form', 2],
    ['q_rc2_107', 5, null, null, 'Xinzhe Zu has ------ Petrin Engineering as the vice president of operations.', ['attached', 'resigned', 'joined', 'combined'], 2, '"Joined" = gia nhập. "Joined as VP" = gia nhập với tư cách Phó Chủ tịch.', 'vocabulary', 2],
    ['q_rc2_108', 5, null, null, "Next month, Barder House Books will be holding ------ third author's hour in Cleveland.", ['it', 'itself', 'its own', 'its'], 3, 'Cần tính từ sở hữu (possessive adjective). "Its third" = lần thứ 3 của nó.', 'pronoun', 2],
    ['q_rc2_109', 5, null, null, "Chester's Tiles ------ expanded to a second location in Turnington.", ['severely', 'usually', 'recently', 'exactly'], 2, '"Recently" = gần đây. Trạng từ chỉ thời gian bổ nghĩa cho "expanded".', 'vocabulary', 2],
    ['q_rc2_110', 5, null, null, "Tabrino's has ------ increased the number of almonds in the Nut Medley snack pack.", ['significant', 'significance', 'signifies', 'significantly'], 3, 'Cần trạng từ bổ nghĩa cho "increased". "Significantly" = đáng kể.', 'word-form', 3],
    ['q_rc2_111', 5, null, null, '------ she travels, Jacintha Flores collects samples of local fabrics and patterns.', ['Wherever', 'In addition to', 'Either', 'In contrast to'], 0, '"Wherever" = bất cứ nơi nào. Liên từ chỉ nơi chốn.', 'conjunction', 3],
    ['q_rc2_112', 5, null, null, 'Most picture ------ at Glowing Photo Lab go on sale at 3:00 P.M. today.', ['framer', 'framing', 'framed', 'frames'], 3, 'Cần danh từ số nhiều làm chủ ngữ. "Picture frames" = khung ảnh.', 'word-form', 3],
    ['q_rc2_113', 5, null, null, 'All students in the business management class hold ------ college degrees.', ['late', 'developed', 'advanced', 'elated'], 2, '"Advanced degrees" = bằng cấp cao. Tính từ bổ nghĩa cho "degrees".', 'vocabulary', 2],
    ['q_rc2_114', 5, null, null, 'We hired Noah Wan of Shengyao Accounting Ltd. ------ our company\'s financial assets.', ['to evaluate', 'to be evaluated', 'will be evaluated', 'evaluate'], 0, '"Hire sb to + V" = thuê ai làm gì. "To evaluate" là不定式 bổ nghĩa mục đích.', 'infinitive', 3],
    ['q_rc2_115', 5, null, null, 'Ms. Charisse is taking on a new account ------ she finishes the Morrison project.', ['with', 'going', 'after', 'between'], 2, '"After" = sau khi. Liên từ chỉ thời gian.', 'conjunction', 2],
    ['q_rc2_116', 5, null, null, "Cornet Motors' profits are ------ this year than last year.", ['higher', 'high', 'highly', 'highest'], 0, 'Có "than" → so sánh hơn. "Higher" = cao hơn.', 'comparison', 2],
    ['q_rc2_117', 5, null, null, "In its ------ advertising campaign, Jaymor Tools demonstrates how reliable its products are.", ['current', 'relative', 'spacious', 'collected'], 0, '"Current" = hiện tại. "Current advertising campaign" = chiến dịch quảng cáo hiện tại.', 'vocabulary', 2],
    ['q_rc2_118', 5, null, null, 'Remember to submit receipts for reimbursement ------ returning from a business trip.', ['such as', 'when', 'then', 'within'], 1, '"When + V-ing" = khi. Liên từ chỉ thời gian.', 'conjunction', 2],
    ['q_rc2_119', 5, null, null, "Patrons will be able to access Westside Library's ------ acquired collection of books on Tuesday.", ['instantly', 'newly', 'early', 'naturally'], 1, '"Newly acquired" = mới thu thập. Trạng từ bổ nghĩa cho V3.', 'word-form', 3],
    ['q_rc2_120', 5, null, null, 'Please ------ any questions about time sheets to Tabitha Jones in the payroll department.', ['direction', 'directive', 'directed', 'direct'], 3, 'Cần động từ nguyên mẫu sau "please". "Direct" = hướng đến, chuyển đến.', 'word-form', 2],
    ['q_rc2_121', 5, null, null, 'Before signing a delivery ------, be sure to double-check that all the items ordered are in the shipment.', ['decision', 'announcement', 'receipt', 'limit'], 2, '"Delivery receipt" = biên nhận giao hàng.', 'vocabulary', 2],
    ['q_rc2_122', 5, null, null, 'Funds have been added to the budget for expenses ------ with the new building.', ['associated', 'association', 'associate', 'associates'], 0, '"Associated with" = liên quan đến. V3 làm tính từ.', 'word-form', 3],
    ['q_rc2_123', 5, null, null, 'Ms. Bernard ------ that a deadline was approaching, so she requested some assistance.', ['noticed', 'obscured', 'withdrew', 'appeared'], 0, '"Noticed" = nhận thấy. Động từ quá khứ.', 'vocabulary', 2],
    ['q_rc2_124', 5, null, null, 'Mr. Moscowitz is ------ that Dr. Tanaka will agree to present the keynote speech at this year\'s conference.', ['hopes', 'hoped', 'hopeful', 'hopefully'], 2, 'Cần tính từ sau "is". "Be hopeful that" = hy vọng rằng.', 'word-form', 3],
    ['q_rc2_125', 5, null, null, 'Two Australian companies are developing new smartphones, but it is unclear ------ phone will become available first.', ['if', 'which', 'before', 'because'], 1, '"Which" = cái nào. Đại từ nghi vấn thay cho "phone".', 'pronoun', 3],
    ['q_rc2_126', 5, null, null, 'Corners Gym offers its members a free lesson in how to use ------ properly.', ['weighs', 'weights', 'weighty', 'weighed'], 1, '"Weights" = tạ tập thể hình. Danh từ số nhiều.', 'vocabulary', 2],
    ['q_rc2_127', 5, null, null, '------ the rules, overnight parking is not permitted at the clubhouse facility.', ['Prior to', 'Except for', 'Instead of', 'According to'], 3, '"According to" = theo như. Cụm giới từ.', 'phrase', 2],
    ['q_rc2_128', 5, null, null, 'Once everyone ------, we can begin the conference call.', ['arrived', 'is arriving', 'to arrive', 'has arrived'], 3, '"Once + hiện tại hoàn thành" = khi ai đó đã đến. Mệnh đề thời gian dùng thì hiện tại hoàn thành cho hành động hoàn thành trước.', 'tense', 4],
    ['q_rc2_129', 5, null, null, "Each summer a motivational video that highlights the past year's ------ is shown to all company employees.", ['preferences', 'accomplishments', 'communications', 'uncertainties'], 1, '"Accomplishments" = thành tựu. Phù hợp ngữ cảnh video truyền động lực.', 'vocabulary', 2],
    ['q_rc2_130', 5, null, null, "Employees who wish to attend the retirement dinner ------ Ms. Howell's 30 years of service should contact Mr. Lee.", ['honor', 'to honor', 'will honor', 'will be honored'], 1, '"To honor" = để vinh danh. Bổ nghĩa mục đích (不定式).', 'infinitive', 3],
  ]
  p5.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // ============ PART 6 (131-146) - 16 câu, 4 passages ============
  // Passage 1: Email from Dellwyn Home Store about furniture order (131-134)
  const p6_passage1 = `To: Myung-Hee Hahn
From: Dellwyn Home Store
Date: January 15
Subject: Order update

Dear Ms. Hahn,

Your [131] order of a red oak dining table and six matching chairs arrived at our store this morning. We would now like to arrange for the delivery of the [132]. Please call us at 517-555-0188 and ask [133] to Coleman Cobb, our delivery manager. [134].

Customer Service, Dellwyn Home Store`

  const p6_1 = [
    ['q_rc2_131', 6, 'g_rc2_p6_1', p6_passage1, '131.', ['specially', 'specialize', 'special', 'specializing'], 2, 'Cần tính từ bổ nghĩa "order". "Special order" = đơn đặt hàng đặc biệt.', 'word-form', 3],
    ['q_rc2_132', 6, 'g_rc2_p6_1', p6_passage1, '132.', ['furniture', 'appliances', 'refund', 'tools'], 0, '"Delivery of the furniture" = giao đồ nội thất. Phù hợp ngữ cảnh đơn hàng bàn ghế.', 'vocabulary', 2],
    ['q_rc2_133', 6, 'g_rc2_p6_1', p6_passage1, '133.', ['speak', 'spoken', 'is speaking', 'to speak'], 3, '"Ask to speak to" = yêu cầu nói chuyện với.不定式 sau "ask".', 'infinitive', 3],
    ['q_rc2_134', 6, 'g_rc2_p6_1', p6_passage1, '134.', ['He can schedule a convenient time.', 'He began working here yesterday.', 'He can meet you at 11:00 A.M.', 'He recently moved to Dellwyn.'], 0, 'Câu phù hợp ngữ cảnh lên lịch giao hàng → "He can schedule a convenient time".', 'sentence-insertion', 4],
  ]
  p6_1.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 2: Advertisement for Keep Cool Service Contractors (135-138)
  const p6_passage2 = `Keep Cool Service Contractors:
67 Main Road, Edinburgh Village
Chaguanas, Trinidad and Tobago

Keep Cool Service Contractors can bring you peace of mind. As part of an annual contract, we will service your air-conditioning system, ensuring your [135] and comfort. This includes inspecting the system, making repairs as needed, and professionally cleaning your air ducts. [136], if necessary, we can replace your old air-conditioning system with a new, cost-efficient one.

Our workers are highly qualified licensed technicians who stay up-to-date with ongoing training. [137]. We promise you fair prices and professional work, [138] by our Keep Cool guarantee.

Call 1-868-555-0129 for a free quote today.`

  const p6_2 = [
    ['q_rc2_135', 6, 'g_rc2_p6_2', p6_passage2, '135.', ['safe', 'safely', 'safest', 'safety'], 3, 'Cần danh từ song song với "comfort". "Safety and comfort" = an toàn và thoải mái.', 'word-form', 3],
    ['q_rc2_136', 6, 'g_rc2_p6_2', p6_passage2, '136.', ['On one hand', 'Nonetheless', 'Furthermore', 'And yet'], 2, '"Furthermore" = hơn nữa. Thêm thông tin bổ sung.', 'transition', 3],
    ['q_rc2_137', 6, 'g_rc2_p6_2', p6_passage2, '137.', ['Take advantage of dozens of useful online tools.', 'Moreover, the air conditioner you chose is very popular.', 'Plus, they are friendly, clean, and knowledgeable.', 'Thank you for visiting our contractor showroom.'], 2, 'Câu phù hợp nói về nhân viên → "Plus, they are friendly, clean, and knowledgeable".', 'sentence-insertion', 4],
    ['q_rc2_138', 6, 'g_rc2_p6_2', p6_passage2, '138.', ['backed', 'backs', 'backing', 'back'], 0, '"Backed by" = được bảo chứng bởi. V3 bổ nghĩa cho "work".', 'word-form', 3],
  ]
  p6_2.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 3: Email from Light Idea about price increase (139-142)
  const p6_passage3 = `To: All Customers
From: asquires@lightidea.com
Date: March 6
Subject: Information

Dear Light Idea Customers,

Light Idea is enacting a price increase on select energy-efficient products, effective April 17. Specific product pricing will [139]. Please contact your sales representative for details and questions.

The last date for ordering at current prices is April 16. All orders [140] after this date will follow the new price list. [141]. Customers will be able to find this on our Web site.

We will continue to provide quality products and [142] service to our valued customers. Thank you for your business.

Sincerely,

Arvin Squires
Head of Sales, Light Idea`

  const p6_3 = [
    ['q_rc2_139', 6, 'g_rc2_p6_3', p6_passage3, '139.', ['agree', 'vary', 'wait', 'decline'], 1, '"Vary" = thay đổi, khác nhau. Giá cả sẽ khác nhau tùy sản phẩm.', 'vocabulary', 3],
    ['q_rc2_140', 6, 'g_rc2_p6_3', p6_passage3, '140.', ['receiving', 'having received', 'received', 'will be received'], 2, 'V3 làm tính từ bổ nghĩa "orders". "Orders received" = đơn nhận được.', 'word-form', 3],
    ['q_rc2_141', 6, 'g_rc2_p6_3', p6_passage3, '141.', ['The updated price list will be available on March 20.', 'We apologize for this inconvenience.', 'Your orders will be shipped after April 17.', 'We are increasing prices because of rising costs.'], 0, 'Câu tiếp theo nói "find this on our Web site" → phù hợp với "price list will be available".', 'sentence-insertion', 4],
    ['q_rc2_142', 6, 'g_rc2_p6_3', p6_passage3, '142.', ['exceptionally', 'exception', 'exceptional', 'exceptionalism'], 2, 'Cần tính từ bổ nghĩa "service". "Exceptional service" = dịch vụ xuất sắc.', 'word-form', 3],
  ]
  p6_3.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Passage 4: Email from Kenneth Okim about jewelry order (143-146)
  const p6_passage4 = `To: Jang-Ho Kwon <jkwon@newart.nz>
From: Kenneth Okim <k.okim@okimjewelry.nz>
Subject: Good news
Date: 30 August

Dear Jang-Ho,

Thank you for the shipment last month of 80 units of your jewelry pieces. I am happy to report that they have been selling very well in my shop. My [143] love the colourful designs as well as the quality of your workmanship. [144].

I would like to increase the number of units I order from you. Would you be able to [145] my order for the September shipment?

Finally, I would like to discuss the possibility of featuring your work exclusively in my store. I believe that I could reach your target audience best and that the agreement would serve [146] both very well. I look forward to hearing from you.

Best regards,
Kenneth Okim
Okim Jewelry`

  const p6_4 = [
    ['q_rc2_143', 6, 'g_rc2_p6_4', p6_passage4, '143.', ['patients', 'students', 'customers', 'teammates'], 2, '"Customers" = khách hàng. Ngữ cảnh cửa hàng bán trang sức.', 'vocabulary', 2],
    ['q_rc2_144', 6, 'g_rc2_p6_4', p6_passage4, '144.', ['If you need more time, please let me know.', 'Unfortunately, I do not have adequate shelf space at this time.', 'I would like to show you some of my own designs.', 'The reasonable prices also make your pieces a great value.'], 3, 'Câu phù hợp khen ngợi sản phẩm → "The reasonable prices also make your pieces a great value".', 'sentence-insertion', 4],
    ['q_rc2_145', 6, 'g_rc2_p6_4', p6_passage4, '145.', ['include', 'double', 'repeat', 'insure'], 1, '"Double my order" = gấp đôi đơn hàng. Ngữ cảnh "increase the number of units".', 'vocabulary', 3],
    ['q_rc2_146', 6, 'g_rc2_p6_4', p6_passage4, '146.', ['us', 'you', 'we', 'these'], 0, '"Serve us both" = phục vụ cả hai chúng ta. Đại từ tân ngữ.', 'pronoun', 3],
  ]
  p6_4.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // ============ PART 7 (147-200) - 54 câu ============
  // Q147-148: Savan Business Center - social media webinar
  const p7_passage1 = `Focus Your Social Media Presence

For small-business owners, it can be a challenge to stand out in a competitive social media environment. Successfully reaching your target market involves knowing how and where to promote your products in a way that is effective and memorable. The Savan Business Center offers support for business owners who need a boost in doing just that. For over 50 years, we've been helping entrepreneurs grow their sales through insight of current industry trends and understanding of our clients' unique needs.

Let us help you get more organized in creating effective and far-reaching social media content. Our latest webinar, Focus Your Social Media Presence, will cover topics related to making your business stand out. You can sign up on our event Web page.

Date: February 5
Time: 10:00 A.M. to 11:00 A.M.
Event Web page: https://www.savanbusinesscenter.com/socialmedia`

  const p7_1 = [
    ['q_rc2_147', 7, 'g_rc2_p7_1', p7_passage1, 'What is true about the Savan Business Center?', ['It works with small businesses.', 'It publishes a weekly newsletter.', 'It recently launched a new Web site.', 'It is seeking suggestions for webinar topics.'], 0, '"For small-business owners" → Savan Business Center làm việc với doanh nghiệp nhỏ.', 'detail', 2],
    ['q_rc2_148', 7, 'g_rc2_p7_1', p7_passage1, 'What is indicated about the webinar?', ['It begins at 11:00 A.M.', 'It features advice on creating promotional content.', 'It is being offered every month.', 'It requires a small fee to attend.'], 1, '"Creating effective and far-reaching social media content" → webinar tư vấn tạo nội dung quảng cáo.', 'inference', 3],
  ]
  p7_1.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q149-150: Dine Out Darville
  const p7_passage2 = `Dine Out Darville Is Back!

Dine Out Darville, which runs this year from June 22 to 28, is the perfect chance to try a restaurant in Darville for the first time or revisit one of your favorite restaurants in town. You might even visit multiple restaurants during the weeklong event! Twelve popular restaurants will offer special four-course dinners—including a cup of soup, a salad, a main course, and a dessert—all for a reduced price of $30. Reservations are highly recommended. Dine Out Darville welcomes hundreds of locals and tourists each year, and you do not want to miss your opportunity to get a great meal at a great price.

Visit www.darvillebusinesscouncil.org/dineout for a list of participating restaurants.`

  const p7_2 = [
    ['q_rc2_149', 7, 'g_rc2_p7_2', p7_passage2, 'What is mentioned about Dine Out Darville?', ['It lasts for one week.', 'It is held in a different location each year.', 'It is being held for the first time.', 'It includes both lunch and dinner.'], 0, '"From June 22 to 28" + "weeklong event" → sự kiện kéo dài 1 tuần.', 'detail', 2],
    ['q_rc2_150', 7, 'g_rc2_p7_2', p7_passage2, 'What is NOT included in the reduced-price meals?', ['A cup of soup', 'A salad', 'A dessert', 'A beverage'], 3, 'Bữa ăn gồm soup, salad, main course, dessert — không có đồ uống (beverage).', 'detail', 2],
  ]
  p7_2.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q151-152: Rainsy LLC headquarters move
  const p7_passage3 = `Rainsy To Move Headquarters

DADE (July 11)—Rainsy LLC announced yesterday that it is moving its headquarters to Dade.

A data storage and analytics firm currently based in Salt Creek, Rainsy has clients that include some of the country's largest credit card companies, online retailers, and software providers. Rainsy helps these businesses manage and understand their customer data.

Rainsy is not planning to close its current offices in Salt Creek. However, the Dade location will become its new base of operations, as several members of its executive team will work there. The company's chief executive officer and chief financial officer will relocate to Dade along with approximately 50 percent of the company's workforce.

The office of Rainsy's chief technology officer will remain in Salt Creek, as will the account management team. The company's new Dade offices are located at 12 Glacier Parkway.`

  const p7_3 = [
    ['q_rc2_151', 7, 'g_rc2_p7_3', p7_passage3, 'What does Rainsy LLC do?', ['It stores and analyzes consumer information.', 'It sells technology products online.', 'It processes credit card payments for retailers.', 'It develops computer software programs.'], 0, '"A data storage and analytics firm" → Rainsy lưu trữ và phân tích thông tin khách hàng.', 'detail', 2],
    ['q_rc2_152', 7, 'g_rc2_p7_3', p7_passage3, 'Who will be based in Dade?', ["Rainsy's chief technology officer", 'The entire Rainsy executive team', "About half of Rainsy's employees", 'The Rainsy account management team'], 2, '"Approximately 50 percent of the company\'s workforce" → khoảng nửa nhân viên sẽ ở Dade.', 'detail', 3],
  ]
  p7_3.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q153-154: Text message chain about printer paper
  const p7_passage4 = `Michael Liu (9:43 A.M.): Hi, Jana. I'm at Biz Plus. The paper you need is out of stock until next week. Will another color work?

Jana Bhat (9:45 A.M.): What are the options?

Michael Liu (9:46 A.M.): They have yellow, green, and pink in the brand that you prefer.

Jana Bhat (9:47 A.M.): I really need blue. Are there other brands of blue printer paper?

Michael Liu (9:48 A.M.): Yes, but they're all a darker blue. They also cost more.

Jana Bhat (9:49 A.M.): OK, forget it. I'll place an order online.`

  const p7_4 = [
    ['q_rc2_153', 7, 'g_rc2_p7_4', p7_passage4, 'What is suggested about the paper Mr. Liu is shopping for?', ['It is light blue.', 'It is expensive.', 'It is sold exclusively at Biz Plus.', 'It has been discontinued.'], 0, 'Other brands are "darker blue" → giấy cô cần là màu xanh nhạt (light blue).', 'inference', 3],
    ['q_rc2_154', 7, 'g_rc2_p7_4', p7_passage4, "At 9:49 A.M., what does Ms. Bhat most likely mean when she writes, 'OK, forget it'?", ['She wants to check her budget.', 'She thinks Mr. Liu should not purchase paper at Biz Plus.', 'She believes Mr. Liu should not place an order this week.', 'She plans to cancel her order.'], 1, '"Forget it" + "I\'ll place an order online" → cô muốn Mr. Liu không mua giấy ở Biz Plus nữa, cô sẽ đặt online.', 'inference', 3],
  ]
  p7_4.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q155-157: SFMA letter to library director
  const p7_passage5 = `20 May

Neil Croft, Director
Queensland Libraries
13 Hummocky Road
Brisbane QLD 4003

Dear Mr. Croft,

— [1] —. I have read your inquiry about offering financial management courses at libraries across Queensland. The Society for Financial Management Advisors (SFMA) welcomes the opportunity to partner with the libraries to make basic financial management information more widely available.

You proposed that SFMA members could lead introductory courses at several library branches. — [2] —. SFMA members have offered similar courses to recent graduates, people changing careers, and first-time investors in the past.

— [3] —. If you have a list of library branches that would host the first series of events, I can suggest facilitators who work near those libraries or would be willing to travel to them. Do you have a general profile of the expected attendees? — [4] —. That information would help us tailor the courses to audience needs and interests.

I look forward to meeting with you to develop a plan. Please contact me by telephone at 07 5550 1344 to set up a time to discuss the courses.

Sincerely,

Roberta Otney
Chairperson, Society for Financial Management Advisors`

  const p7_5 = [
    ['q_rc2_155', 7, 'g_rc2_p7_5', p7_passage5, 'Why did Ms. Otney write the letter?', ['To welcome a new library director', 'To register for an SFMA finance course', 'To confirm some educational credentials', 'To reply to a question from Mr. Croft'], 3, '"I have read your inquiry" → Ms. Otney viết thư để trả lời câu hỏi (inquiry) của Mr. Croft.', 'main-idea', 2],
    ['q_rc2_156', 7, 'g_rc2_p7_5', p7_passage5, 'What is one thing Ms. Otney requested?', ['A library membership', 'A list of course instructors', 'The locations of some libraries', "Mr. Croft's telephone number"], 2, '"If you have a list of library branches that would host" → Ms. Otney yêu cầu vị trí (địa điểm) các thư viện.', 'detail', 3],
    ['q_rc2_157', 7, 'g_rc2_p7_5', p7_passage5, "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? 'This is something I would be happy to arrange.'", ['[1]', '[2]', '[3]', '[4]'], 1, 'Sau câu đề xuất SFMA members dạy khóa học → "This is something I would be happy to arrange" phù hợp vị trí [2].', 'sentence-insertion', 4],
  ]
  p7_5.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q158-160: Claro Vision eyeglass advertisement
  const p7_passage6 = `Claro Vision
The difference is clear.

Take advantage of our limited-time offer:
50% off all eyeglass frames through 30 September

Other advantages available today and every day:
- Free eyeglass fittings and adjustments
- Money-back guarantee if you are not completely satisfied
- More than 500 locations in shopping malls throughout Canada
- Low-cost vision checkups by licensed opticians

To find a store near you, visit www.clarovision.ca/locations, or call 416-555-0122 today!`

  const p7_6 = [
    ['q_rc2_158', 7, 'g_rc2_p7_6', p7_passage6, 'Why most likely was the advertisement created?', ['To draw attention to an underused professional service', 'To publicize the benefits of a warranty policy', 'To announce the opening of new store locations', 'To promote a temporary price discount'], 3, '"50% off all eyeglass frames through 30 September" → quảng cáo khuyến mãi giảm giá tạm thời.', 'main-idea', 2],
    ['q_rc2_159', 7, 'g_rc2_p7_6', p7_passage6, 'What is stated about Claro Vision stores?', ["They are larger than competitors' stores.", 'They accept all major credit cards.', 'They are located next to shopping malls.', 'They provide eyeglass fittings at no cost.'], 3, '"Free eyeglass fittings and adjustments" → lắp kính miễn phí.', 'detail', 2],
    ['q_rc2_160', 7, 'g_rc2_p7_6', p7_passage6, 'What is stated about vision checkups?', ['They are completed by a partner company.', 'They are performed by a certified professional.', 'They should be done every ten months.', 'They are offered on a limited number of days.'], 1, '"Licensed opticians" → kiểm tra thị lực do chuyên gia có chứng chỉ thực hiện.', 'detail', 2],
  ]
  p7_6.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q161-163: Rosserry Building Corporation lease letter
  const p7_passage7 = `Rosserry Building Corporation
2710 South Exmouth Drive
Singapore 188509

1 April

Elizabeth Balakrishnan
Bala Home Furnishings
416 Holliton Drive C2
Singapore 793801

Dear Ms. Balakrishnan,

This is a reminder that the one-year lease for your space will end on 30 April. Please contact my office at 1555 0124 to make an appointment to renew your lease. There will be a small increase in rent and fees because of rising operating costs.

Updated charges upon lease renewal:
Monthly rental S$1,800.00
Parking space fee S$50.00
Cleaning service S$10.00
Security fee S$35.00
Total monthly charge S$1,895.00

If you are not renewing your lease, please notify our office by 15 April. Plan to vacate the property by 5 p.m. on 30 April. There will be an inspection of the property, and there may be charges for repairs or damages beyond normal usage.

Kind regards,
Alexis Tan`

  const p7_7 = [
    ['q_rc2_161', 7, 'g_rc2_p7_7', p7_passage7, 'What is the purpose of the letter?', ['To explain the fees for equipment installation', 'To offer a discount on a service', 'To provide information about a lease agreement', 'To request a change to a property amenity'], 2, 'Thư nhắc gia hạn thuê + chi phí mới → cung cấp thông tin về hợp đồng thuê.', 'main-idea', 2],
    ['q_rc2_162', 7, 'g_rc2_p7_7', p7_passage7, 'According to the letter, what must Ms. Balakrishnan pay for each month?', ['Furniture rental', 'Office supplies', 'An inspection fee', 'A parking space'], 3, '"Parking space fee S$50.00" → phí đỗ xe hàng tháng.', 'detail', 2],
    ['q_rc2_163', 7, 'g_rc2_p7_7', p7_passage7, 'Who most likely is Ms. Tan?', ['A repair person', 'A property manager', 'A cleaning person', 'A security company employee'], 1, 'Rosserry Building Corporation + quản lý hợp đồng thuê → Ms. Tan là quản lý bất động sản.', 'inference', 3],
  ]
  p7_7.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q164-167: Qualiview Ltd email about contract negotiation
  const p7_passage8 = `To: lkhoury@britelyauto.co.uk
From: khagel@qualiview.co.uk
Date: 14 April
Subject: Your proposed changes

Dear Ms. Khoury,

Thank you for forwarding your proposed revisions to the contract for Qualiview Ltd. to be your wholesale supplier of automotive window glass.

First, we will gladly agree to an extension of the contract term from one to three years. Secondly, I am not sure what more we can do to address your concerns about packaging materials. We use custom-built crates and innovative packaging to reduce the risk of breakage during shipping. While we will replace any goods that may be damaged in transit, we do not agree to pay an additional penalty fee in the event of such damage.

I would like to discuss this further with you next week; however, I will be out of the office through Tuesday afternoon. Would you be available to meet before 11:00 A.M. on either Wednesday or Thursday? Friday is also possible. Please let me know a convenient date and time for you.

Best regards,
Karl Hagel
Qualiview Ltd.`

  const p7_8 = [
    ['q_rc2_164', 7, 'g_rc2_p7_8', p7_passage8, 'Why did Mr. Hagel write the e-mail?', ['To report damage to an item', 'To finalize a purchase', 'To request a product sample', 'To negotiate a contract'], 3, 'Thảo luận điều khoản hợp đồng (gia hạn, packaging, penalty fee) → đàm phán hợp đồng.', 'main-idea', 3],
    ['q_rc2_165', 7, 'g_rc2_p7_8', p7_passage8, 'What is indicated about Qualiview Ltd.?', ['It sells its products online.', 'It makes windows for cars.', 'It has paid penalty fees in the past.', 'It recently redesigned its shipping crates.'], 1, '"Wholesale supplier of automotive window glass" → Qualiview sản xuất kính xe ô tô.', 'detail', 2],
    ['q_rc2_166', 7, 'g_rc2_p7_8', p7_passage8, "The word 'address' in paragraph 2, line 2, is closest in meaning to", ['respond to', 'think about', 'greet', 'deliver'], 0, '"Address concerns" = giải quyết mối lo ngại → "respond to" (phản hồi, giải quyết).', 'vocabulary', 3],
    ['q_rc2_167', 7, 'g_rc2_p7_8', p7_passage8, 'When is Mr. Hagel available next week?', ['On Monday morning', 'On Tuesday afternoon', 'On Wednesday morning', 'On Thursday afternoon'], 2, '"Out through Tuesday afternoon" + "meet before 11 A.M. on Wednesday or Thursday" → sáng thứ Tư.', 'detail', 3],
  ]
  p7_8.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q168-171: Shipping container shortage article
  const p7_passage9 = `Shipping Disruptions

SINGAPORE (6 June)—Recently, the demand for international freight space has been outpacing the availability of shipping containers. This container shortage has led to higher costs for goods being shipped out of Asian ports. A drop in the production of rolls of steel, the raw material that containers are made from, has further complicated the situation. —[1]—.

Some exporters have considered the more expensive option of air freight, but companies are still faced with a difficult choice. —[2]—. They must either ask their customers to accept shipment delays, or substantially raise customer prices to cover the costs of expedited shipping. Either way, suppliers risk triggering customer dissatisfaction.

'We are working with business partners, investors, and government officials to discuss solutions to this problem,' said Henry Lam, a spokesperson for the household goods producer QET Group. —[3]—. 'It's going to take total cooperation of all stakeholders to find a solution.'

Not all companies are suffering, though. For example, Fezker, the producer of athletic apparel and footwear, has implemented strategies to better overcome this situation. Fezker has successfully refocused its efforts away from exports to western countries and toward expanding its domestic and regional markets. —[4]—.

'We moved quickly, so the shipping container shortage has not caused a significant impact on our profits,' said Fezker CEO Nuwa Lee.`

  const p7_9 = [
    ['q_rc2_168', 7, 'g_rc2_p7_9', p7_passage9, 'What is mentioned about shipping containers?', ['They come in different sizes.', 'They are in short supply.', 'They are made from a variety of materials.', 'They can be used for long-term storage.'], 1, '"This container shortage" → container đang thiếu hụt nguồn cung.', 'detail', 2],
    ['q_rc2_169', 7, 'g_rc2_p7_9', p7_passage9, 'What does Mr. Lam say is needed to resolve the situation?', ['A sharp increase in the number of customers', 'A relaxation of government restrictions', 'The development of new technologies', 'Communication between affected groups'], 3, '"Total cooperation of all stakeholders" → cần sự hợp tác/giao tiếp giữa các bên liên quan.', 'detail', 3],
    ['q_rc2_170', 7, 'g_rc2_p7_9', p7_passage9, 'What type of clothing does Fezker produce?', ['Rain jackets', 'Sportswear', 'Business suits', 'Work uniforms'], 1, '"Athletic apparel and footwear" → Fezker sản xuất đồ thể thao.', 'detail', 2],
    ['q_rc2_171', 7, 'g_rc2_p7_9', p7_passage9, "In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong? 'These markets are supplied using more readily available truck and train transportation.'", ['[1]', '[2]', '[3]', '[4]'], 3, 'Sau câu "expanding domestic and regional markets" → câu về vận chuyển truck/train phù hợp vị trí [4].', 'sentence-insertion', 4],
  ]
  p7_9.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q172-175: Construction team text message chain
  const p7_passage10 = `Gary Wendel (7:40 A.M.): Good morning, team. Can you share the current status of your projects, please?

Jing Yu (7:42 A.M.): I met with the client last week to confirm the start date for Phase B of the Palisade project.

Robbie Zuniga (7:43 A.M.): I am headed to the job site now for the Riverview project. The rain last week delayed pouring the concrete for the sidewalks. I will check the conditions this morning to see if the situation has improved.

Gary Wendel (7:44 A.M.): When will Phase B of the Palisade project begin?

Jing Yu (7:46 A.M.): We will break ground in March and plan to have the building completed by November.

Gary Wendel (7:47 A.M.): That's good news about the March start date. I am sure the client is happy about that.

Gary Wendel (7:50 A.M.): Robbie, let me know what you find out about the site conditions. Perhaps Nathan Burry can help at the site. He's our most knowledgeable concrete finisher.

Robbie Zuniga (7:55 A.M.): Actually, I'm meeting Nathan at the site this morning, so I'll get his opinion on when we can pour the concrete. The rest of the project is on hold until we can do this.

Gary Wendel (7:57 A.M.): Keep me posted. I don't want to rush it if it's still too wet. At the same time, the Riverview project is already behind schedule because of equipment problems and late delivery of building materials.

Robbie Zuniga (7:58 A.M.): Will do.`

  const p7_10 = [
    ['q_rc2_172', 7, 'g_rc2_p7_10', p7_passage10, 'In what industry do the writers most likely work?', ['Construction', 'Energy', 'Manufacturing', 'Travel'], 0, '"Job site" + "concrete" + "building" + "sidewalks" → ngành xây dựng.', 'inference', 2],
    ['q_rc2_173', 7, 'g_rc2_p7_10', p7_passage10, 'Why did Mr. Wendel begin the discussion?', ['To plan a client meeting', 'To discuss a weather forecast', 'To obtain an update on some work', 'To change the start date of an event'], 2, '"Can you share the current status of your projects?" → Mr. Wendel muốn cập nhật tiến độ công việc.', 'main-idea', 2],
    ['q_rc2_174', 7, 'g_rc2_p7_10', p7_passage10, 'What is indicated about the Riverview project?', ['It has had several delays.', 'It is being managed by Ms. Yu.', 'It will be completed in November.', 'Its clients are happy with the progress.'], 0, '"Already behind schedule because of equipment problems and late delivery of building materials" + rain delay → dự án Riverview có nhiều chậm trễ.', 'inference', 3],
    ['q_rc2_175', 7, 'g_rc2_p7_10', p7_passage10, "At 7:58 A.M., what does Mr. Zuniga most likely mean when he writes, 'Will do'?", ['He will revise a delivery schedule.', 'He will purchase more equipment.', 'He will hire workers to help at a site.', 'He will share the outcome of a meeting.'], 3, '"Keep me posted" → "Will do" = sẽ báo lại kết quả cuộc gặp Nathan (chia sẻ kết quả).', 'inference', 3],
  ]
  p7_10.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q176-180: Karabel Industries ice cream email + survey form (double passage)
  const p7_passage11 = `From: Madalyn Kerluke <mkerluke@karabel.ca>
To: Omar Niklaus <oniklaus@karabel.ca>, Jay Toncic <jtoncic@karabel.ca>
Date: Friday, 3 February 2:16 P.M.
Subject: Taste-test results
Attachment: Fatior Labs survey results

Hi, Team.

I just received the 24–26 January survey results from Fatior Labs for our new ice-cream taste test. As you can see from the attached document, the results are very disappointing. We sent the four flavours that we considered to be the best, but none of them received high enough ratings to advance to the next stage of development. Most of the reviews were consistent among the 92 taste-test participants in our target market of consumers ages 25 through 40. It's not a big problem if a product gets low scores in colour in the testing phase, since we can easily adjust that in the laboratory. But we should never be sending out samples that are getting scores lower than 3 in the taste category.

I would like to meet at 9 A.M. on Monday (6 February) to figure out how to proceed. There is one flavour we may be able to work with if we make a few adjustments, as suggested by most of our taste testers. We will also need to get some new flavours to Fatior Labs no later than 1 March if we are going to get a new ice cream on the Preston Grocers freezer shelves by the beginning of June.

Madalyn Kerluke

---

Fatior Labs Consumer Taste-Testing Survey
Date: 24 January
Company: Karabel Industries
Participant number: 54

Directions: You will be given a 45 g sample of 4 different ice creams. Please rate the taste, texture, sweetness, and colour of each ice cream on a scale of 1 (very unpleasant) to 5 (very pleasant). Please write any additional comments below.

| Flavour | Taste | Texture | Sweetness | Colour |
| Lemon | 2 | 3 | 2 | 4 |
| Mango | 3 | 3 | 2 | 1 |
| Salted Caramel | 2 | 1 | 1 | 5 |
| Peanut Brittle | 3 | 4 | 2 | 2 |

Comments: The fruit-flavoured ice creams were surprisingly sour. I did not care for them at all. I think the Peanut Brittle has the most potential, but it's missing something. I bet that adding chocolate swirls or brownie bits would make it a winner.`

  const p7_11 = [
    ['q_rc2_176', 7, 'g_rc2_p7_11', p7_passage11, 'What does the e-mail indicate about Karabel Industries ice cream?', ['It is currently sold in four flavors.', 'Its coloring can be changed easily.', 'Its popularity has declined recently.', 'It is sold in Karabel Industries stores.'], 0, '"We sent the four flavours" → hiện có 4 hương vị kem được gửi taste test.', 'detail', 3],
    ['q_rc2_177', 7, 'g_rc2_p7_11', p7_passage11, 'What does Ms. Kerluke state that she wants to do?', ['Visit a laboratory', 'Hold a team meeting', 'Contact a grocery store', 'Write new survey questions'], 1, '"I would like to meet at 9 A.M. on Monday" → Ms. Kerluke muốn họp team.', 'detail', 2],
    ['q_rc2_178', 7, 'g_rc2_p7_11', p7_passage11, 'What is suggested about Fatior Labs?', ['It has 92 employees.', 'It manufactures food colorings.', 'It will perform another taste test for Karabel Industries.', 'It supplies ice cream to Preston Grocers.'], 2, '"Get some new flavours to Fatior Labs no later than 1 March" → Fatior Labs sẽ làm thêm taste test cho Karabel Industries.', 'inference', 3],
    ['q_rc2_179', 7, 'g_rc2_p7_11', p7_passage11, 'Based on the survey form, what flavor will Karabel Industries most likely make adjustments to?', ['Lemon', 'Mango', 'Salted Caramel', 'Peanut Brittle'], 3, '"One flavour we may be able to work with" + comment: "Peanut Brittle has the most potential" → Peanut Brittle.', 'inference', 4],
    ['q_rc2_180', 7, 'g_rc2_p7_11', p7_passage11, 'What can be concluded about participant number 54?', ['The participant purchased several containers of ice cream.', 'The participant is between the ages of 25 and 40.', 'The participant regularly takes consumer surveys.', 'The participant prefers fruit-flavored ice cream.'], 1, '"Target market of consumers ages 25 through 40" → participant 54 thuộc nhóm tuổi này.', 'inference', 3],
  ]
  p7_11.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q181-185: Create Great job posting + Annie Smith application letter (double passage)
  const p7_passage12 = `--- Web Page ---

Create Great, an Ontario-based creative agency with a diverse range of global clients in the fashion industry, is seeking a copywriter who is passionate about fashion, understands market trends, and handles digital tools with ease.

The ideal candidate will be someone who works well in a fast-paced environment with team members from international backgrounds. The copywriter will collaborate with the creative team to develop brand strategies that suit customer needs and with the marketing team to ensure the success of brand-based publicity campaigns for current and prospective clients. As remote work is permitted for copywriters, residence in Canada is not required.

To apply, send your cover letter and résumé to the director of our creative team, Fran Benjamin, Create Great, 838 Colbert Street, London, ON N6B 3P5. Application deadline: August 5.

--- Letter ---

Annie Smith
4810 South Bryant Street
Portland, OR 97206

August 6

Fran Benjamin
Create Great
838 Colbert Street
London, ON N6B 3P5

Dear Ms. Benjamin,

I am writing to apply for the copywriter position at Create Great. As an expert fashion designer who also has writing experience, I believe I would be a valuable addition to your team. Enclosed please find my résumé.

I have a decade of experience as the lead designer for women's collections at MODA, a clothing line in Portland. I oversee the design production process from initial market research to finished product. In my role, I work in close partnership with the marketing and production teams.

In addition, for the last five years, I have been maintaining my own blog. My posts focus on trends in women's fashion and how to make clothing and cosmetics more sustainable. What started as a hobby has now attracted paying advertisers and over 15,000 followers. Visit www.medesheen.com for examples of my writing.

Thank you for considering my application.

Sincerely,
Annie Smith`

  const p7_12 = [
    ['q_rc2_181', 7, 'g_rc2_p7_12', p7_passage12, 'According to the Web page, what will the job recipient be able to do?', ['Work remotely', 'Manage a team', 'Travel internationally', 'Relocate to Canada'], 0, '"Remote work is permitted for copywriters" → ứng viên được làm việc từ xa.', 'detail', 2],
    ['q_rc2_182', 7, 'g_rc2_p7_12', p7_passage12, "On the Web page, the word 'suit' in paragraph 2, line 4, is closest in meaning to", ['adapt', 'determine', 'invest', 'satisfy'], 3, '"Suit customer needs" = đáp ứng nhu cầu khách hàng → "satisfy".', 'vocabulary', 3],
    ['q_rc2_183', 7, 'g_rc2_p7_12', p7_passage12, 'What is indicated about Ms. Smith?', ['She has already met Ms. Benjamin.', 'She has worked as a copywriter.', 'She missed an application deadline.', 'She forgot to submit a required document.'], 2, 'Letter dated August 6, deadline August 5 → Ms. Smith nộp đơn trễ hạn.', 'inference', 3],
    ['q_rc2_184', 7, 'g_rc2_p7_12', p7_passage12, "According to the letter, what is one of Ms. Smith's responsibilities at MODA?", ['Hiring fashion designers', 'Writing drafts of advertisements', 'Managing a production process', 'Researching sustainable clothing options'], 2, '"I oversee the design production process" → Ms. Smith quản lý quy trình sản xuất thiết kế.', 'detail', 2],
    ['q_rc2_185', 7, 'g_rc2_p7_12', p7_passage12, 'What most likely is Medesheen?', ['A brand of cosmetics', 'A fashion blog', 'An online magazine', 'An advertising agency'], 1, '"Maintaining my own blog" + "Visit www.medesheen.com for examples of my writing" → Medesheen là blog thời trang.', 'inference', 3],
  ]
  p7_12.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q186-190: Fowler Office Supplies email exchange + receipt (triple passage)
  const p7_passage13 = `--- Email 1 ---

From: Akihito Nakashima <a.nakashima@gilchristshipping.com>
To: Fowler Office Supplies <support@fowlerofficesupplies.com>
Subject: Order B19849
Date: August 19

To Whom It May Concern,

Yesterday, I purchased some office supplies on your Web site. I received an e-mail receipt, but the costs are not itemized on it. To satisfy a new company policy, I must give my supervisor a receipt with the charges for each item listed separately. Could you e-mail me such a receipt? If not, is it possible for me to get this information myself from your Web site? Finally, can confirmations for future orders possibly be sent to more than one e-mail address? It would be ideal for my supervisor to automatically receive one.

Thank you,
Akihito Nakashima, Executive Assistant
Gilchrist Shipping

--- Email 2 ---

From: Fowler Office Supplies <support@fowlerofficesupplies.com>
To: Akihito Nakashima <a.nakashima@gilchristshipping.com>
Subject: RE: Order B19849
Date: August 19
Attachment: B19849

Dear Mr. Nakashima,

Attached is the receipt you requested. In apology for the inconvenience, we will provide you with 10 percent off the total price of your next order. To view a full description of any previous order, first log in to your account on our Web site, go to the 'My Orders' tab, and then click on any order number.

I noticed that included in each of your last few orders was an identical order for ten of a particular item. You should know that we will reduce the price for that item by 5 percent if you mark this as a recurring order. To do this, simply check the 'Recurring Order' box on the online order form.

As for your final query, this is not possible right now. However, I will share the idea with our technical team.

All the best,
Cameron Higgins, Customer Relations
Fowler Office Supplies

--- Receipt ---

Fowler Office Supplies
Receipt for Order: B19849
Order Date: August 18

Printer paper | $8.00/500 sheets | 10 | $80.00
Toner (black) | $50.00/cartridge | 1 | $50.00
Gel pens (blue) | $5.00/8-pack | 3 | $15.00
Staples | $3.50/box | 2 | $7.00
GRAND TOTAL: $152.00

Return Policy: Unopened merchandise may be returned by mail or in one of our stores within 60 days of purchase. For returns by mail, log in to your account to print a shipping label. For in-store returns, bring the item and the order number to any Fowler Office Supplies location.`

  const p7_13 = [
    ['q_rc2_186', 7, 'g_rc2_p7_13', p7_passage13, 'Why did Mr. Nakashima send the e-mail?', ['He did not receive an item he ordered.', 'He was mistakenly charged twice for an item.', 'He received a receipt that was not detailed enough.', 'He did not get a confirmation e-mail for a purchase he made.'], 2, '"The costs are not itemized on it" → biên nhận không liệt kê chi tiết từng món.', 'main-idea', 2],
    ['q_rc2_187', 7, 'g_rc2_p7_13', p7_passage13, 'According to the second e-mail, what will Mr. Nakashima receive with his next order?', ['A catalog', 'A free pen', 'A printed receipt', 'A price discount'], 3, '"10 percent off the total price of your next order" → giảm giá 10% cho đơn hàng kế tiếp.', 'detail', 2],
    ['q_rc2_188', 7, 'g_rc2_p7_13', p7_passage13, "For what item does Mr. Higgins suggest that Mr. Nakashima select 'Recurring Order'?", ['Printer paper', 'Toner', 'Gel pens', 'Staples'], 0, '"Identical order for ten of a particular item" → receipt shows 10 printer paper.', 'inference', 3],
    ['q_rc2_189', 7, 'g_rc2_p7_13', p7_passage13, 'What will Mr. Higgins ask the technical team to look into?', ["Improving the Web site's response rate", 'Providing an option to send receipts to multiple e-mail addresses', "Placing a link to customers' order history on the home page", 'Making return labels printable from any device'], 1, '"Can confirmations be sent to more than one e-mail address?" → share with technical team để xem xét.', 'detail', 3],
    ['q_rc2_190', 7, 'g_rc2_p7_13', p7_passage13, 'What is needed to return an item at a Fowler Office Supplies store?', ['The original receipt', 'A credit card number', 'A confirmation e-mail', 'The order number'], 3, '"Bring the item and the order number to any Fowler Office Supplies location" → cần số đơn hàng khi trả hàng tại cửa hàng.', 'detail', 2],
  ]
  p7_13.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q191-195: Crawford and Duval article + web page + receipt (triple passage)
  const p7_passage14 = `--- Article ---

Crawford and Duval Opens Brick-and-Mortar Stores

HONG KONG (18 February)—Crawford and Duval, the online retailer known for its handcrafted blankets, decorative pillows, and other household goods, has established four brick-and-mortar stores in Hong Kong. Last Monday, the company celebrated the grand opening of boutique stores in Causeway Bay, Discovery Bay, and Sheung Wan in addition to a large department store in Central District. While the boutique stores carry the most popular of the small household goods for which Crawford and Duval is famous, the Central District location also boasts an indoor plant department and an on-site café that features specialty coffees, teas, and light snacks. Moreover, it has a much more extensive selection of the merchandise than what is available through the company's Web site.

--- Web Page ---

Crawford and Duval comes to our loyal shoppers in Hong Kong!

Crawford and Duval is pleased to announce the opening of its first brick-and-mortar stores in the following locations: Causeway Bay, Discovery Bay, Sheung Wan, and Central District.

Since the launch of our online store five years ago, we have helped you to create the living space of your dreams. Now we make it even easier to decorate your home. Each location has an interior designer on staff, so you can consult with an expert in person while you browse our popular items.

All locations are convenient to public transportation. Our Central District location offers free parking in its attached car park.

As part of our grand-opening celebration, shoppers who visit one of our stores before 1 March will receive a gift card for HK$70 to use during their visit.

Members of our online Frequent Purchase Club will receive the same benefits in our stores, including a 10 percent discount on purchases of HK$500 or more.

--- Receipt ---

Crawford and Duval
Customer Receipt
Date: 23 February

Bamboo table lamp | HK$1,450.00
Decorative cushions, set of two | HK$750.00
Aloe plant in a 7.5-litre planter | HK$300.00
Machine-washable wool blanket | HK$2,000.00
Sub Total | HK$4,500.00
Less 10% | HK$450.00
TOTAL | HK$4,050.00

Credit card number: ************5598
Name on the credit card: Mei-Lin Fong

Stop at our in-store café for a treat!`

  const p7_14 = [
    ['q_rc2_191', 7, 'g_rc2_p7_14', p7_passage14, 'What is the purpose of the article?', ['To compare locally made products', 'To announce store openings', 'To list changes to a Web site', 'To review a café'], 1, '"Crawford and Duval Opens Brick-and-Mortar Stores" → thông báo mở cửa hàng vật lý mới.', 'main-idea', 2],
    ['q_rc2_192', 7, 'g_rc2_p7_14', p7_passage14, 'What does the Web site indicate about Crawford and Duval?', ['It has store locations around the world.', 'It has been in business for ten years.', 'It employs interior designers.', 'It offers free parking at all of its stores.'], 2, '"Each location has an interior designer on staff" → Crawford and Duval có nhà thiết kế nội thất tại mỗi cửa hàng.', 'detail', 2],
    ['q_rc2_193', 7, 'g_rc2_p7_14', p7_passage14, 'According to the receipt, what is indicated about the blanket?', ['It can be washed by machine.', 'It is made of cotton.', 'It is queen-sized.', 'It comes in a set with pillows.'], 0, '"Machine-washable wool blanket" → chăn có thể giặt máy.', 'detail', 2],
    ['q_rc2_194', 7, 'g_rc2_p7_14', p7_passage14, 'Where most likely did Ms. Fong make her purchase?', ['On a Web site', 'In a boutique shop', 'At a café', 'In a department store'], 3, 'Receipt có "Aloe plant" → Central District có plant department (department store) → mua tại department store.', 'inference', 3],
    ['q_rc2_195', 7, 'g_rc2_p7_14', p7_passage14, 'What is suggested about Ms. Fong?', ['She often buys food from Crawford and Duval.', 'She is a member of the Frequent Purchase Club.', 'She applied a gift card to her purchase.', 'She shopped during a grand-opening event.'], 1, '10% discount applied (Sub Total $4500, Less 10% $450) → Ms. Fong là thành viên Frequent Purchase Club.', 'inference', 3],
  ]
  p7_14.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Q196-200: Osawa Corporate Team Building web page + request form + review (triple passage)
  const p7_passage15 = `--- Web Page ---

Osawa Corporate Team Building

Bring your team together to promote cooperation while having fun! Our activities increase job satisfaction and engagement. We do all the planning so you can relax. Simply choose the event that is right for your team.

Scavenger Hunt—An outdoor game in which teams are given a list of objects to find and photograph with their phone or camera. Group size: 10–50 people. Time: 3 hours.

Game Day—This is a high-energy game day with fun team activities. This event builds team strength, communication, and problem-solving skills. Group size: 20–500 people. Time: 2 hours.

Team Painting—Each team member creates a painting outdoors based on a predetermined theme. The paintings are linked together at the end. Group size: 6–30 people. Time: 1–2 hours.

Robot Building—Your group will be broken into teams. Each team builds a robot to be used in challenges against the others. Group size: 10–30 people. Time: 2–3 hours.

All Chocolate—Your group will have the chance to use engineering skills to build a tower of chocolate. Then you learn how to make chocolate from a local chocolatier. Group size: 8–150 people. Time: 2 hours.

Book an event in October and receive 15 percent off.

--- Request Form ---

Name: Alexandra Peterson
Company name: Whitten Tech
E-mail address: apeterson@whittentech.com
Phone: 617-555-0123
Location and date of event: Downtown Boston, October 15
What events are you interested in? Choose your top three.
1. Game Day
2. Scavenger Hunt
3. Team Painting
Number of participants: 28 people
Additional information: We are interested in a fun activity for our sales team before the busy selling season begins. We spend a lot of time in the office, so we want an outdoor event.

--- Review ---

Posted by Whitten Tech on October 20

Our team hired Osawa Corporate Team Building to lead an activity for the sales staff at Whitten Tech. The facilitator of the Scavenger Hunt, Lorenzo Benford, was excellent. The 28 members of our sales team all had positive feedback. They reported that they loved exploring the city, learning about its history, and finding new local attractions, even on a cold and cloudy day. I highly recommend this activity. The only downside was that we did not realize how far we would be walking. It would have been helpful to have an idea of the walking distances so we could have been fully prepared.`

  const p7_15 = [
    ['q_rc2_196', 7, 'g_rc2_p7_15', p7_passage15, 'What does the first Web page indicate about the Scavenger Hunt?', ['It requires participants to rent a camera.', 'It concludes with prizes for participants.', 'It is a suitable activity for indoors.', 'It takes three hours to complete.'], 3, '"Time: 3 hours" → Scavenger Hunt kéo dài 3 tiếng.', 'detail', 2],
    ['q_rc2_197', 7, 'g_rc2_p7_15', p7_passage15, 'What event is best for a group of more than 200 people?', ['Game Day', 'Team Painting', 'Robot Building', 'All Chocolate'], 0, 'Game Day: 20-500 people → phù hợp cho nhóm hơn 200 người.', 'detail', 2],
    ['q_rc2_198', 7, 'g_rc2_p7_15', p7_passage15, 'What is suggested about Ms. Peterson?', ['She has joined the Building Robots event in the past.', 'She will receive a discount on an event.', 'She recently started a job at Whitten Tech.', 'She used to be an event planner.'], 1, 'Event in October → "15 percent off" → Ms. Peterson sẽ được giảm giá.', 'inference', 3],
    ['q_rc2_199', 7, 'g_rc2_p7_15', p7_passage15, 'What can be concluded about Whitten Tech?', ['It changed its number of event participants.', 'It provided its staff with free passes to museums.', 'It was unable to schedule its first-choice activity.', 'It was not able to hold its event outside.'], 2, 'Lựa chọn ưu tiên (first choice) là Game Day, nhưng review cho biết họ làm Scavenger Hunt (lựa chọn 2) → không được hoạt động ưu tiên.', 'inference', 4],
    ['q_rc2_200', 7, 'g_rc2_p7_15', p7_passage15, 'According to the review, what was disappointing about the event?', ['The focus on local history', 'The lack of information about walking distances', 'The difficulty in keeping the group together', 'The uninteresting facilitator'], 1, '"The only downside was that we did not realize how far we would be walking" → thiếu thông tin về khoảng cách đi bộ.', 'detail', 3],
  ]
  p7_15.forEach(q => questions.push(Q(q[0], q[1], q[2], q[3], q[4], q[5], q[6], q[7], q[8], q[9])))

  // Insert all questions
  for (const q of questions) {
    await db.question.upsert({ where: { id: q.id }, update: q, create: q })
  }

  // Create test set
  const allIds = questions.map(q => q.id)
  const testSet = {
    id: 'ts_rc2_full',
    title: '🎯 Đề TOEIC Reading Test 2 (100 câu · 75 phút)',
    description: 'Đề TOEIC Reading đầy đủ từ Part 5 (30 câu), Part 6 (16 câu), Part 7 (54 câu) — tổng 100 câu. Lấy từ bộ đề ETS thật bạn cung cấp (TEST 2 RC.pdf). Có giải thích chi tiết bằng tiếng Việt sau khi nộp bài.',
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
