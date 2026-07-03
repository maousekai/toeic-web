import { db } from '../src/lib/db'

// Helper to create exercise
function E(lessonId: string, order: number, question: string, options: string[], answer: number, explanation: string) {
  return {
    id: `${lessonId}_ex_${order}`,
    lessonId,
    question,
    options: JSON.stringify(options),
    answer,
    explanation,
    order,
  }
}

async function main() {
  console.log('Seeding grammar exercises...')

  const exercises: any[] = []

  // ===== 1. PRESENT SIMPLE vs. PRESENT CONTINUOUS (g_tenses_present) =====
  const L1 = 'g_tenses_present'
  exercises.push(
    E(L1, 1, 'The store ___ at 9 a.m. every day.', ['open', 'opens', 'is opening', 'opening'], 1, 'Dấu hiệu "every day" → hiện tại đơn. Chủ ngữ "The store" số ít → thêm "s": opens.'),
    E(L1, 2, 'Right now, they ___ a client meeting.', ['have', 'has', 'are having', 'having'], 2, 'Dấu hiệu "Right now" → hiện tại tiếp diễn. S + are + V-ing: are having.'),
    E(L1, 3, 'She ___ in the marketing department.', ['work', 'works', 'is working', 'working'], 1, 'Sự thật lâu dài → hiện tại đơn. "She" số ít → works.'),
    E(L1, 4, 'Look! The baby ___.', ['sleep', 'sleeps', 'is sleeping', 'sleeping'], 2, 'Dấu hiệu "Look!" → hiện tại tiếp diễn → is sleeping.'),
    E(L1, 5, 'I ___ the answer right now.', ['know', 'am knowing', 'knows', 'knowing'], 0, '"Know" là stative verb → không dùng tiếp diễn → hiện tại đơn: know.'),
    E(L1, 6, 'The train ___ at 7 a.m. tomorrow.', ['leave', 'leaves', 'is leaving', 'leaving'], 1, 'Lịch trình cố định → hiện tại đơn. "The train" số ít → leaves.'),
    E(L1, 7, 'We ___ a new product this quarter.', ['launch', 'launches', 'are launching', 'launching'], 2, 'Dấu hiệu "this quarter" (tạm thời) → hiện tại tiếp diễn → are launching.'),
    E(L1, 8, 'He usually ___ to work by bus.', ['go', 'goes', 'is going', 'going'], 1, 'Dấu hiệu "usually" → hiện tại đơn. "He" số ít → goes.'),
    E(L1, 9, '___ you ___ anything right now?', ['Do/listen', 'Are/listening', 'Do/listening', 'Are/listen'], 1, '"Right now" → hiện tại tiếp diễn → Are you listening.'),
    E(L1, 10, 'She ___ this book belongs to.', ['is knowing', 'knows', 'know', 'knowing'], 1, '"Know" là stative verb → hiện tại đơn. "She" → knows.'),
    E(L1, 11, 'The conference ___ next Monday.', ['start', 'starts', 'is starting', 'starting'], 1, 'Lịch trình → hiện tại đơn. "The conference" → starts.'),
    E(L1, 12, 'Listen! Someone ___ at the door.', ['knock', 'knocks', 'is knocking', 'knocking'], 2, '"Listen!" → hiện tại tiếp diễn → is knocking.'),
    E(L1, 13, 'I ___ lunch at the moment.', ['have', 'am having', 'has', 'having'], 1, '"At the moment" → tiếp diễn. "Have" = ăn (không phải sở hữu) → có thể dùng tiếp diễn: am having.'),
    E(L1, 14, 'My brother ___ in Tokyo.', ['live', 'lives', 'is living', 'living'], 1, 'Sự thật lâu dài → hiện tại đơn. "My brother" → lives.'),
    E(L1, 15, 'They ___ TV every evening.', ['watch', 'watches', 'are watching', 'watching'], 0, '"Every evening" → hiện tại đơn. "They" → watch.'),
    E(L1, 16, 'The company ___ a new CEO this month.', ['hire', 'hires', 'is hiring', 'hiring'], 2, '"This month" (tạm thời) → hiện tại tiếp diễn → is hiring.'),
    E(L1, 17, 'She ___ coffee in the morning.', ['prefer', 'prefers', 'is preferring', 'preferring'], 1, '"Prefer" là stative verb → hiện tại đơn. "She" → prefers.'),
    E(L1, 18, 'What ___ you ___? — I\'m a teacher.', ['do/do', 'are/doing', 'do/doing', 'are/do'], 0, 'Hỏi nghề nghiệp (sự thật) → hiện tại đơn: What do you do?'),
    E(L1, 19, 'The price of gas ___ these days.', ['rise', 'rises', 'is rising', 'rising'], 2, '"These days" (tạm thời) → hiện tại tiếp diễn → is rising.'),
    E(L1, 20, 'I ___ what you mean.', ['understand', 'am understanding', 'understands', 'understanding'], 0, '"Understand" là stative verb → hiện tại đơn: understand.'),
  )

  // ===== 2. PRESENT PERFECT & PAST SIMPLE (g_present_perfect) =====
  const L2 = 'g_present_perfect'
  exercises.push(
    E(L2, 1, 'She ___ here since 2018.', ['work', 'works', 'has worked', 'worked'], 2, '"Since 2018" → hiện tại hoàn thành → has worked.'),
    E(L2, 2, 'They ___ the contract last week.', ['sign', 'signed', 'have signed', 'signing'], 1, '"Last week" (thời gian đã kết thúc) → quá khứ đơn → signed.'),
    E(L2, 3, 'We ___ 50 applications so far.', ['receive', 'received', 'have received', 'receiving'], 2, '"So far" → hiện tại hoàn thành → have received.'),
    E(L2, 4, 'I ___ in Hanoi 3 years ___.', ['lived/ago', 'have lived/since', 'lived/since', 'have lived/ago'], 0, '"Ago" → quá khứ đơn → lived/ago.'),
    E(L2, 5, 'He ___ our Tokyo office twice.', ['visit', 'visited', 'has visited', 'visiting'], 2, 'Kinh nghiệm (twice) → hiện tại hoàn thành → has visited.'),
    E(L2, 6, 'Sales ___ this quarter.', ['increase', 'increased', 'have increased', 'increasing'], 2, '"This quarter" (chưa kết thúc) → hiện tại hoàn thành → have increased.'),
    E(L2, 7, 'I ___ him yesterday at the conference.', ['meet', 'met', 'have met', 'meeting'], 1, '"Yesterday" → quá khứ đơn → met.'),
    E(L2, 8, '___ you ever ___ to Japan?', ['Did/go', 'Have/been', 'Did/been', 'Have/go'], 1, '"Ever" + kinh nghiệm → hiện tại hoàn thành → Have you been.'),
    E(L2, 9, 'The package ___ just ___.', ['has/arrived', 'did/arrive', 'has/arriving', 'did/arrived'], 0, '"Just" → hiện tại hoàn thành → has arrived.'),
    E(L2, 10, 'I ___ my homework yet.', ['didn\'t finish', 'haven\'t finished', 'don\'t finish', 'am not finishing'], 1, '"Yet" (phủ định) → hiện tại hoàn thành → haven\'t finished.'),
    E(L2, 11, 'In 2019, she ___ her own business.', ['start', 'started', 'has started', 'starting'], 1, '"In 2019" (thời gian kết thúc) → quá khứ đơn → started.'),
    E(L2, 12, 'They ___ each other since childhood.', ['know', 'knew', 'have known', 'knowing'], 2, '"Since childhood" → hiện tại hoàn thành → have known.'),
    E(L2, 13, 'I ___ not ___ that movie before.', ['did/see', 'have/seen', 'did/seen', 'have/see'], 1, '"Before" + kinh nghiệm → hiện tại hoàn thành → have not seen.'),
    E(L2, 14, 'He ___ the report two days ago.', ['submit', 'submitted', 'has submitted', 'submitting'], 1, '"Two days ago" → quá khứ đơn → submitted.'),
    E(L2, 15, 'We ___ here for 5 years.', ['live', 'lived', 'have lived', 'living'], 2, '"For 5 years" → hiện tại hoàn thành → have lived.'),
    E(L2, 16, 'The meeting ___ 10 minutes ago.', ['end', 'ended', 'has ended', 'ending'], 1, '"10 minutes ago" → quá khứ đơn → ended.'),
    E(L2, 17, 'I ___ already ___ lunch.', ['have/eaten', 'did/eat', 'have/eat', 'did/eaten'], 0, '"Already" → hiện tại hoàn thành → have eaten.'),
    E(L2, 18, 'She ___ French when she was young.', ['study', 'studied', 'has studied', 'studying'], 1, '"When she was young" → quá khứ đơn → studied.'),
    E(L2, 19, 'The company ___ its revenue target this year.', ['reach', 'reached', 'has reached', 'reaching'], 2, '"This year" (chưa kết thúc) → hiện tại hoàn thành → has reached.'),
    E(L2, 20, 'I ___ him since we ___ at university.', ['know/met', 'have known/met', 'knew/have met', 'have known/have met'], 1, '"Since" → hiện tại hoàn thành (have known) + mệnh đề quá khứ (met).'),
  )

  // ===== 3. CONDITIONALS (g_conditionals) =====
  const L3 = 'g_conditionals'
  exercises.push(
    E(L3, 1, 'If it ___ tomorrow, we will cancel the picnic.', ['rain', 'rains', 'will rain', 'raining'], 1, 'Câu điều kiện loại 1: If + hiện tại đơn → rains.'),
    E(L3, 2, 'If I ___ you, I would accept the offer.', ['am', 'was', 'were', 'be'], 2, 'Câu điều kiện loại 2: If + past simple. Dùng "were" cho mọi chủ ngữ.'),
    E(L3, 3, 'If we ___ the deadline, the client will be satisfied.', ['meet', 'met', 'will meet', 'meeting'], 0, 'Loại 1: If + hiện tại đơn → meet.'),
    E(L3, 4, 'If I ___ more time, I would learn French.', ['have', 'had', 'will have', 'having'], 1, 'Loại 2: If + quá khứ đơn → had.'),
    E(L3, 5, 'If you ___ water to 100°C, it boils.', ['heat', 'heated', 'will heat', 'heating'], 0, 'Loại 0 (sự thật): If + hiện tại đơn → heat.'),
    E(L3, 6, 'Unless you ___, you will miss the train.', ['hurry', 'don\'t hurry', 'will hurry', 'hurried'], 0, '"Unless" = "if not" → dùng dạng khẳng định → hurry.'),
    E(L3, 7, 'If he ___ harder, he would pass the exam.', ['study', 'studied', 'will study', 'studying'], 1, 'Loại 2: If + quá khứ đơn → studied.'),
    E(L3, 8, 'I will call you if I ___ late.', ['am', 'was', 'will be', 'were'], 0, 'Loại 1: If + hiện tại đơn → am.'),
    E(L3, 9, 'If I ___ the CEO, I would invest in training.', ['am', 'was', 'were', 'be'], 2, 'Loại 2: dùng "were" cho mọi chủ ngữ (subjunctive).'),
    E(L3, 10, 'What ___ you do if you won the lottery?', ['will', 'would', 'do', 'did'], 1, 'Loại 2: would + V bare.'),
    E(L3, 11, 'If she ___ early, she catches the bus.', ['leave', 'leaves', 'will leave', 'left'], 1, 'Loại 0: If + hiện tại đơn. "She" → leaves.'),
    E(L3, 12, 'If we had known, we ___ differently.', ['will act', 'would act', 'would have acted', 'act'], 2, 'Loại 3 (quá khứ giả định): would have + V3.'),
    E(L3, 13, '___ you study harder, you will fail the exam.', ['If', 'Unless', 'When', 'As'], 1, 'Nghĩa "nếu không" → Unless. (Unless = if not).'),
    E(L3, 14, 'If it ___ rain, we will stay home.', ['will', 'won\'t', 'doesn\'t', 'don\'t'], 2, 'Loại 1: If + hiện tại đơn phủ định. "It" → doesn\'t rain.'),
    E(L3, 15, 'If I were rich, I ___ around the world.', ['travel', 'traveled', 'would travel', 'will travel'], 2, 'Loại 2: would + V bare.'),
    E(L3, 16, 'The meeting ___ canceled if no one comes.', ['is', 'will be', 'would be', 'was'], 1, 'Loại 1: mệnh đề chính → will + V bare → will be.'),
    E(L3, 17, 'If you press this button, the machine ___.', ['start', 'starts', 'will start', 'starting'], 2, 'Loại 1: mệnh đề chính → will + V bare → will start.'),
    E(L3, 18, 'If she ___ here now, she would help us.', ['is', 'was', 'were', 'be'], 2, 'Loại 2: "were" cho mọi chủ ngữ.'),
    E(L3, 19, '___ you heat ice, it melts.', ['If', 'When', 'Unless', 'Would'], 0, 'Loại 0 (sự thật) → If hoặc When đều được. Chọn If.'),
    E(L3, 20, 'If they ___ the price, sales would increase.', ['lower', 'lowered', 'will lower', 'lowering'], 1, 'Loại 2: If + quá khứ đơn → lowered.'),
  )

  // ===== 4. PASSIVE VOICE (g_passive) =====
  const L4 = 'g_passive'
  exercises.push(
    E(L4, 1, 'The report ___ by the analyst yesterday.', ['wrote', 'was written', 'is written', 'writing'], 1, '"Yesterday" → quá khứ đơn bị động: was + V3 → was written.'),
    E(L4, 2, 'The office ___ every evening.', ['cleans', 'is cleaned', 'cleaned', 'cleaning'], 1, 'Hiện tại đơn bị động: is/are + V3 → is cleaned.'),
    E(L4, 3, 'The contract ___ tomorrow.', ['will sign', 'will be signed', 'is signed', 'signs'], 1, 'Tương lai bị động: will be + V3 → will be signed.'),
    E(L4, 4, 'The items ___ already ___.', ['have/shipped', 'have been/shipped', 'were/shipped', 'are/shipped'], 1, 'Hiện tại hoàn thành bị động: have been + V3 → have been shipped.'),
    E(L4, 5, 'The hotel ___ right now.', ['builds', 'is building', 'is being built', 'built'], 2, 'Hiện tại tiếp diễn bị động: is being + V3 → is being built.'),
    E(L4, 6, 'The form must ___ by Friday.', ['submit', 'be submitted', 'submitted', 'submitting'], 1, 'Modal + bị động: must be + V3 → must be submitted.'),
    E(L4, 7, 'My car ___ last night.', ['stole', 'was stolen', 'is stolen', 'stealing'], 1, '"Last night" → quá khứ đơn bị động: was + V3 → was stolen.'),
    E(L4, 8, 'The window ___ with a hammer.', ['broke', 'was broken', 'is broken', 'breaking'], 1, 'Bị động quá khứ. "With" + công cụ → was broken.'),
    E(L4, 9, 'The project ___ by the team last month.', ['completed', 'was completed', 'is completed', 'completing'], 1, '"Last month" → quá khứ bị động → was completed.'),
    E(L4, 10, 'Your application ___ received.', ['has', 'has been', 'is', 'was being'], 1, 'Hiện tại hoàn thành bị động → has been received.'),
    E(L4, 11, 'The book ___ by millions of readers.', ['reads', 'is read', 'read', 'reading'], 1, 'Hiện tại đơn bị động: is + V3. "Read" V3 = "read" → is read.'),
    E(L4, 12, 'A new bridge ___ next year.', ['will build', 'will be built', 'is built', 'builds'], 1, 'Tương lai bị động → will be built.'),
    E(L4, 13, 'The email ___ at this moment.', ['sends', 'is being sent', 'was sent', 'sent'], 1, '"At this moment" → hiện tại tiếp diễn bị động → is being sent.'),
    E(L4, 14, 'The decision ___ by the manager.', ['made', 'was made', 'makes', 'is making'], 1, 'Quá khứ bị động (by + người) → was made.'),
    E(L4, 15, 'The products ___ in China.', ['manufacture', 'are manufactured', 'manufactured', 'manufacturing'], 1, 'Hiện tại đơn bị động: are + V3 → are manufactured.'),
    E(L4, 16, 'The thieves ___ by the police.', ['caught', 'were caught', 'is caught', 'catching'], 1, 'Quá khứ bị động (plural subject) → were caught.'),
    E(L4, 17, 'It ___ that he is rich.', ['says', 'is said', 'said', 'saying'], 1, 'Cấu trúc giả: It is said that... → is said.'),
    E(L4, 18, 'The letter ___ tomorrow morning.', ['will send', 'will be sent', 'is sent', 'sends'], 1, 'Tương lai bị động → will be sent.'),
    E(L4, 19, 'The report ___ every Monday.', ['publishes', 'is published', 'published', 'publishing'], 1, 'Hiện tại đơn bị động (every Monday) → is published.'),
    E(L4, 20, 'All tickets ___ already ___.', ['have/sold', 'have been/sold', 'were/sold', 'are/sold'], 1, 'Hiện tại hoàn thành bị động → have been sold.'),
  )

  // ===== 5. ARTICLES (g_articles) =====
  const L5 = 'g_articles'
  exercises.push(
    E(L5, 1, 'I bought ___ computer yesterday. ___ computer is on the desk.', ['a/The', 'a/A', 'the/The', 'the/A'], 0, 'Nhắc lần đầu → "a", sau đó đã xác định → "the".'),
    E(L5, 2, 'She is ___ engineer at ___ big company.', ['an/a', 'a/a', 'an/the', 'a/an'], 0, '"Engineer" âm nguyên âm → "an". "Big" âm phụ âm → "a".'),
    E(L5, 3, '___ sun rises in ___ east.', ['The/the', 'A/an', 'The/an', 'A/the'], 0, 'Danh từ duy nhất → "the sun", "the east".'),
    E(L5, 4, 'I go to work by ___ bus.', ['a', 'the', 'an', '∅'], 3, 'Cụm cố định "by + phương tiện" → không dùng mạo từ (∅).'),
    E(L5, 5, 'He is ___ best player on the team.', ['a', 'the', 'an', '∅'], 1, 'Tính từ cao nhất "best" → "the".'),
    E(L5, 6, '___ water is essential for life.', ['A', 'The', 'An', '∅'], 3, 'Danh từ không đếm được, nói chung → ∅.'),
    E(L5, 7, 'I saw ___ UFO in ___ sky last night.', ['a/the', 'an/the', 'the/the', 'a/a'], 0, '"UFO" phát âm "yu-..." → "a". "Sky" duy nhất → "the".'),
    E(L5, 8, 'She has ___ MBA from Harvard.', ['a', 'an', 'the', '∅'], 1, '"MBA" phát âm "em-bi-ei" âm nguyên âm → "an".'),
    E(L5, 9, 'He waited for ___ hour at ___ airport.', ['a/the', 'an/the', 'the/an', 'an/a'], 1, '"Hour" phát âm "au" (h câm) → "an". "Airport" xác định → "the".'),
    E(L5, 10, '___ Microsoft is ___ global company.', ['∅/a', 'The/a', 'A/a', 'The/the'], 0, 'Tên công ty → ∅. "Global" âm phụ âm → "a".'),
    E(L5, 11, 'I need ___ information about the project.', ['a', 'an', 'the', '∅'], 3, '"Information" không đếm được → ∅.'),
    E(L5, 12, 'The report you asked for is on ___ table.', ['a', 'an', 'the', '∅'], 2, 'Có mệnh đề bổ nghĩa "you asked for" → "the".'),
    E(L5, 13, 'She plays ___ piano very well.', ['a', 'an', 'the', '∅'], 2, 'Cụm cố định "play the + nhạc cụ" → "the".'),
    E(L5, 14, 'We live in ___ United States.', ['a', 'an', 'the', '∅'], 2, 'Tên nước có "States/Kingdom" → "the United States".'),
    E(L5, 15, 'I usually have ___ breakfast at 7 a.m.', ['a', 'an', 'the', '∅'], 3, 'Bữa ăn → ∅.'),
    E(L5, 16, 'He is ___ honest man.', ['a', 'an', 'the', '∅'], 1, '"Honest" phát âm "on-est" (h câm) → "an".'),
    E(L5, 17, '___ Eiffel Tower is in Paris.', ['A', 'An', 'The', '∅'], 2, 'Danh từ duy nhất → "the Eiffel Tower".'),
    E(L5, 18, 'There are ___ books on the shelf.', ['a', 'an', 'the', '∅'], 3, 'Danh từ số nhiều nói chung → ∅.'),
    E(L5, 19, 'She bought ___ umbrella because it was raining.', ['a', 'an', 'the', '∅'], 1, '"Umbrella" âm "am-..." → "an".'),
    E(L5, 20, 'He is studying ___ English at ___ university.', ['∅/a', 'the/a', 'an/a', '∅/an'], 0, 'Ngôn ngữ → ∅. "University" phát âm "yu-..." → "a".'),
  )

  // ===== 6. PREPOSITIONS (g_prepositions) =====
  const L6 = 'g_prepositions'
  exercises.push(
    E(L6, 1, 'The meeting starts ___ 3 p.m.', ['in', 'on', 'at', 'by'], 2, 'Giờ cụ thể → "at 3 p.m.".'),
    E(L6, 2, 'We will launch the product ___ Monday.', ['in', 'on', 'at', 'by'], 1, 'Ngày trong tuần → "on Monday".'),
    E(L6, 3, 'The conference is ___ June.', ['in', 'on', 'at', 'by'], 0, 'Tháng → "in June".'),
    E(L6, 4, 'Please submit the form ___ Friday.', ['in', 'on', 'at', 'by'], 3, 'Hạn chót (deadline) → "by Friday".'),
    E(L6, 5, 'The office is ___ the 5th floor.', ['in', 'on', 'at', 'by'], 1, 'Tầng → "on the 5th floor".'),
    E(L6, 6, 'She works ___ the marketing department.', ['in', 'on', 'at', 'by'], 0, 'Phòng ban (không gian kín) → "in".'),
    E(L6, 7, 'I have worked here ___ 2018.', ['for', 'since', 'from', 'in'], 1, 'Mốc thời gian → "since 2018".'),
    E(L6, 8, 'They have lived here ___ 5 years.', ['for', 'since', 'from', 'in'], 0, 'Khoảng thời gian → "for 5 years".'),
    E(L6, 9, 'The train arrived ___ time.', ['in', 'on', 'at', 'by'], 1, '"On time" = đúng giờ (đúng lịch).'),
    E(L6, 10, 'We arrived ___ time for the meeting.', ['in', 'on', 'at', 'by'], 0, '"In time" = kịp (trước deadline).'),
    E(L6, 11, 'I\'ll meet you ___ the entrance.', ['in', 'on', 'at', 'by'], 2, 'Điểm cụ thể → "at the entrance".'),
    E(L6, 12, 'The shop is ___ Wall Street.', ['in', 'on', 'at', 'by'], 1, 'Đường phố → "on Wall Street".'),
    E(L6, 13, 'She is interested ___ learning French.', ['in', 'on', 'at', 'for'], 0, 'Collocation: "interested in" + V-ing.'),
    E(L6, 14, 'He is responsible ___ the marketing team.', ['for', 'of', 'in', 'to'], 0, 'Collocation: "responsible for".'),
    E(L6, 15, 'The book is ___ the table.', ['in', 'on', 'at', 'by'], 1, 'Bề mặt → "on the table".'),
    E(L6, 16, 'I cut the paper ___ a knife.', ['by', 'with', 'in', 'on'], 1, 'Công cụ → "with a knife".'),
    E(L6, 17, 'We traveled to Paris ___ plane.', ['by', 'with', 'in', 'on'], 0, 'Phương tiện (không mạo từ) → "by plane".'),
    E(L6, 18, 'The decision depends ___ the budget.', ['of', 'on', 'in', 'for'], 1, 'Collocation: "depend on".'),
    E(L6, 19, 'She applied ___ the job online.', ['for', 'to', 'in', 'on'], 0, 'Collocation: "apply for".'),
    E(L6, 20, 'The meeting is ___ 9 a.m. ___ Monday.', ['at/on', 'on/at', 'in/on', 'at/in'], 0, 'Giờ → "at 9 a.m.", ngày → "on Monday".'),
  )

  // ===== 7. GERUNDS vs. INFINITIVES (g_gerund_inf) =====
  const L7 = 'g_gerund_inf'
  exercises.push(
    E(L7, 1, 'I enjoy ___ here.', ['work', 'to work', 'working', 'worked'], 2, '"Enjoy" + V-ing → working.'),
    E(L7, 2, 'They decided ___ the business.', ['expand', 'to expand', 'expanding', 'expanded'], 1, '"Decide" + to + V → to expand.'),
    E(L7, 3, 'She suggested ___ the meeting.', ['postpone', 'to postpone', 'postponing', 'postponed'], 2, '"Suggest" + V-ing → postponing.'),
    E(L7, 4, 'He wants ___ early today.', ['leave', 'to leave', 'leaving', 'left'], 1, '"Want" + to + V → to leave.'),
    E(L7, 5, 'They avoided ___ the topic.', ['discuss', 'to discuss', 'discussing', 'discussed'], 2, '"Avoid" + V-ing → discussing.'),
    E(L7, 6, 'We plan ___ next month.', ['launch', 'to launch', 'launching', 'launched'], 1, '"Plan" + to + V → to launch.'),
    E(L7, 7, 'I look forward to ___ from you.', ['hear', 'to hear', 'hearing', 'heard'], 2, '"Look forward to" + V-ing (to ở đây là giới từ) → hearing.'),
    E(L7, 8, 'She is good at ___ events.', ['organize', 'to organize', 'organizing', 'organized'], 2, 'Sau giới từ "at" → V-ing → organizing.'),
    E(L7, 9, 'He promised ___ me back.', ['call', 'to call', 'calling', 'called'], 1, '"Promise" + to + V → to call.'),
    E(L7, 10, 'I finished ___ the report.', ['write', 'to write', 'writing', 'wrote'], 2, '"Finish" + V-ing → writing.'),
    E(L7, 11, 'They agreed ___ the contract.', ['sign', 'to sign', 'signing', 'signed'], 1, '"Agree" + to + V → to sign.'),
    E(L7, 12, 'She denied ___ the email.', ['send', 'to send', 'sending', 'sent'], 2, '"Deny" + V-ing → sending.'),
    E(L7, 13, 'I used ___ a lot of coffee, but I stopped.', ['drink', 'to drink', 'drinking', 'drank'], 1, '"Used to" + V bare (thói quen quá khứ) → to drink.'),
    E(L7, 14, 'I am used to ___ up early.', ['wake', 'to wake', 'waking', 'woke'], 2, '"Be used to" + V-ing (quen với) → waking.'),
    E(L7, 15, 'He refused ___ the offer.', ['accept', 'to accept', 'accepting', 'accepted'], 1, '"Refuse" + to + V → to accept.'),
    E(L7, 16, 'Thank you for ___ me.', ['help', 'to help', 'helping', 'helped'], 2, 'Sau giới từ "for" → V-ing → helping.'),
    E(L7, 17, 'They hope ___ the project by June.', ['complete', 'to complete', 'completing', 'completed'], 1, '"Hope" + to + V → to complete.'),
    E(L7, 18, 'I don\'t mind ___ here.', ['wait', 'to wait', 'waiting', 'waited'], 2, '"Mind" + V-ing → waiting.'),
    E(L7, 19, 'He stopped ___ last year.', ['smoke', 'to smoke', 'smoking', 'smoked'], 2, '"Stop + V-ing" = bỏ thói quen → smoking (bỏ hút thuốc).'),
    E(L7, 20, 'She learned ___ Japanese.', ['speak', 'to speak', 'speaking', 'spoke'], 1, '"Learn" + to + V → to speak.'),
  )

  // ===== 8. RELATIVE CLAUSES (g_relative) =====
  const L8 = 'g_relative'
  exercises.push(
    E(L8, 1, 'The man ___ called you is here.', ['who', 'which', 'whose', 'where'], 0, 'Chỉ người, chủ ngữ → "who".'),
    E(L8, 2, 'The book ___ is on the table is mine.', ['who', 'which', 'whose', 'where'], 1, 'Chỉ vật → "which".'),
    E(L8, 3, 'The employee ___ laptop was stolen reported it.', ['who', 'which', 'whose', 'where'], 2, 'Sở hữu → "whose".'),
    E(L8, 4, 'The city ___ I was born is beautiful.', ['who', 'which', 'whose', 'where'], 3, 'Nơi chốn → "where".'),
    E(L8, 5, 'Mr. Lee, ___ is our CFO, will speak tomorrow.', ['who', 'which', 'that', 'whose'], 0, 'Mệnh đề không xác định (có dấu phẩy) → "who", không dùng "that".'),
    E(L8, 6, 'The contract ___ was signed yesterday is valid.', ['who', 'which', 'whose', 'where'], 1, 'Chỉ vật → "which".'),
    E(L8, 7, 'The candidate ___ applied yesterday is strong.', ['who', 'which', 'whose', 'where'], 0, 'Chỉ người, chủ ngữ → "who".'),
    E(L8, 8, 'This is the office ___ I work.', ['who', 'which', 'whose', 'where'], 3, 'Nơi chốn → "where".'),
    E(L8, 9, 'The man ___ car is red is my boss.', ['who', 'which', 'whose', 'where'], 2, 'Sở hữu → "whose".'),
    E(L8, 10, 'I bought a book ___ was recommended by my friend.', ['who', 'which', 'whose', 'where'], 1, 'Chỉ vật → "which".'),
    E(L8, 11, 'The year ___ I graduated was 2018.', ['who', 'which', 'whose', 'when'], 3, 'Thời gian → "when".'),
    E(L8, 12, 'This book, ___ I bought last week, is great.', ['who', 'which', 'that', 'whose'], 1, 'Mệnh đề không xác định (dấu phẩy) → "which", không "that".'),
    E(L8, 13, 'The woman ___ I met yesterday is a doctor.', ['who', 'which', 'whose', 'where'], 0, 'Chỉ người → "who" (hoặc "whom" formal).'),
    E(L8, 14, 'The man ___ standing there is my boss.', ['who is', 'who', 'which', 'whose'], 0, 'Rút gọn mệnh đề quan hệ đang tiếp diễn: "who is standing" → "standing" hoặc giữ nguyên "who is".'),
    E(L8, 15, 'The report ___ in 1990 is rare.', ['writing', 'written', 'who wrote', 'which writing'], 1, 'Rút gọn mệnh đề bị động: "which was written" → "written".'),
    E(L8, 16, 'She is the person ___ I admire the most.', ['who', 'which', 'whose', 'where'], 0, 'Chỉ người → "who".'),
    E(L8, 17, 'The hotel ___ we stayed was excellent.', ['who', 'which', 'whose', 'where'], 3, 'Nơi chốn → "where".'),
    E(L8, 18, 'The student ___ won the scholarship is very talented.', ['who', 'which', 'whose', 'where'], 0, 'Chỉ người, chủ ngữ → "who".'),
    E(L8, 19, 'The phone ___ I bought yesterday is broken.', ['who', 'which', 'whose', 'where'], 1, 'Chỉ vật → "which".'),
    E(L8, 20, 'Mr. Kim, ___ daughter is a doctor, lives next door.', ['who', 'which', 'whose', 'where'], 2, 'Sở hữu → "whose".'),
  )

  // ===== 9. COMPARATIVES & SUPERLATIVES (g_comparison) =====
  const L9 = 'g_comparison'
  exercises.push(
    E(L9, 1, 'This model is ___ than the previous one.', ['fast', 'faster', 'fastest', 'more fast'], 1, 'So sánh hơn, tính từ 1 âm tiết → "faster".'),
    E(L9, 2, 'It is ___ on the market.', ['efficient', 'more efficient', 'the most efficient', 'most efficient'], 2, 'So sánh nhất, tính từ dài → "the most efficient".'),
    E(L9, 3, 'She is ___ than her brother.', ['tall', 'taller', 'tallest', 'more tall'], 1, 'So sánh hơn, 1 âm tiết → "taller".'),
    E(L9, 4, 'This is ___ restaurant in town.', ['good', 'better', 'the best', 'best'], 2, 'So sánh nhất, bất quy tắc "good" → "the best".'),
    E(L9, 5, 'The weather is getting ___ and ___.', ['cold/cold', 'colder/colder', 'more cold/more cold', 'coldest/coldest'], 1, 'So sánh kép: "colder and colder".'),
    E(L9, 6, '___ you study, ___ you become.', ['The more/the better', 'More/better', 'The most/the best', 'More/most'], 0, 'Cấu trúc "The + comparative, the + comparative" → "The more, the better".'),
    E(L9, 7, 'This car is ___ more expensive than that one.', ['very', 'much', 'so', 'too'], 1, 'Trạng từ bổ nghĩa so sánh hơn: "much/a lot/far" → "much more expensive".'),
    E(L9, 8, 'He is ___ player on the team.', ['bad', 'worse', 'the worst', 'worst'], 2, 'So sánh nhất, bất quy tắc "bad" → "the worst".'),
    E(L9, 9, 'She is as ___ as her sister.', ['smart', 'smarter', 'smartest', 'more smart'], 0, 'Cấu trúc "as + adj + as" → "as smart as".'),
    E(L9, 10, 'This box is ___ than that one.', ['heavy', 'heavier', 'heaviest', 'more heavy'], 1, 'So sánh hơn, 1 âm tiết → "heavier" (y → i + er).'),
    E(L9, 11, 'It is ___ day of the year.', ['hot', 'hotter', 'the hottest', 'hottest'], 2, 'So sánh nhất, 1 âm tiết → "the hottest" (gấp đôi t).'),
    E(L9, 12, 'She speaks English ___ than I do.', ['well', 'better', 'the best', 'best'], 1, 'So sánh hơn, bất quy tắc "well" → "better".'),
    E(L9, 13, 'This problem is ___ than the last one.', ['difficult', 'more difficult', 'the most difficult', 'difficulter'], 1, 'So sánh hơn, tính từ dài → "more difficult".'),
    E(L9, 14, 'He is ___ person I know.', ['funny', 'funnier', 'the funniest', 'funniest'], 2, 'So sánh nhất, 2 âm tiết tận cùng "y" → "the funniest".'),
    E(L9, 15, 'The second exam was slightly ___ than the first.', ['easy', 'easier', 'the easiest', 'easiest'], 1, 'So sánh hơn → "easier" (y → i + er).'),
    E(L9, 16, 'She is ___ than any other student.', ['intelligent', 'more intelligent', 'the most intelligent', 'intelligenter'], 1, 'So sánh hơn, tính từ dài → "more intelligent".'),
    E(L9, 17, 'This is by ___ the best movie I\'ve seen.', ['far', 'much', 'so', 'very'], 0, '"By far" + so sánh nhất → "by far the best".'),
    E(L9, 18, 'Today is ___ than yesterday.', ['cold', 'colder', 'the coldest', 'coldest'], 1, 'So sánh hơn → "colder".'),
    E(L9, 19, 'He has ___ money than I do.', ['little', 'less', 'the least', 'lesser'], 1, 'So sánh hơn, bất quy tắc "little" → "less".'),
    E(L9, 20, 'She is the ___ beautiful girl in the class.', ['more', 'most', 'much', 'very'], 1, 'So sánh nhất, tính từ dài → "the most beautiful".'),
  )

  // ===== 10. MODAL VERBS (g_modals) =====
  const L10 = 'g_modals'
  exercises.push(
    E(L10, 1, 'You ___ submit the form by Friday.', ['can', 'must', 'would', 'may'], 1, 'Nghĩa vụ → "must" (phải).'),
    E(L10, 2, 'Employees ___ wear a badge.', ['should', 'can', 'must', 'would'], 2, 'Nghĩa vụ → "must" (phải).'),
    E(L10, 3, 'You ___ smoke here. It\'s prohibited.', ['mustn\'t', 'don\'t have to', 'shouldn\'t', 'can\'t'], 0, '"Must not" = cấm → "mustn\'t smoke".'),
    E(L10, 4, 'You ___ come if you don\'t want to.', ['mustn\'t', 'don\'t have to', 'can\'t', 'shouldn\'t'], 1, '"Don\'t have to" = không bắt buộc → "don\'t have to come".'),
    E(L10, 5, 'He has a Ferrari. He ___ be rich.', ['must', 'can', 'would', 'should'], 0, 'Suy luận chắc chắn → "must be".'),
    E(L10, 6, 'He just started. He ___ be the manager.', ['must', 'can\'t', 'should', 'would'], 1, 'Suy luận phủ định → "can\'t be".'),
    E(L10, 7, 'She ___ be at lunch. She\'s not at her desk.', ['must', 'can\'t', 'might', 'should'], 2, 'Khả năng → "might be".'),
    E(L10, 8, '___ you like some coffee?', ['Will', 'Would', 'Can', 'Must'], 1, 'Đề nghị lịch sự → "Would you like...?"'),
    E(L10, 9, 'You ___ see a doctor. You look sick.', ['must', 'should', 'can', 'would'], 1, 'Lời khuyên → "should see".'),
    E(L10, 10, 'I ___ swim when I was 5 years old.', ['can', 'could', 'may', 'should'], 1, 'Năng lực quá khứ → "could swim".'),
    E(L10, 11, '___ I leave early today?', ['Must', 'May', 'Would', 'Should'], 1, 'Xin phép trang trọng → "May I...?"'),
    E(L10, 12, 'He ___ have forgotten the meeting.', ['must', 'can', 'would', 'should'], 0, 'Suy luận quá khứ: "must have + V3" → "must have forgotten".'),
    E(L10, 13, 'You ___ have told me earlier!', ['should', 'must', 'can', 'would'], 0, 'Hối tiếc quá khứ: "should have + V3" → "should have told".'),
    E(L10, 14, 'They ___ have left already. The lights are off.', ['must', 'can', 'would', 'should'], 0, 'Suy luận quá khứ → "must have left".'),
    E(L10, 15, 'You ___ not enter without permission.', ['must', 'do', 'are', 'have'], 0, 'Cấm → "must not enter".'),
    E(L10, 16, 'I ___ help you if I had time.', ['will', 'would', 'can', 'must'], 1, 'Giả định (loại 2) → "would help".'),
    E(L10, 17, 'She ___ to wear a uniform at work.', ['must', 'has', 'can', 'should'], 1, '"Have to" (nghĩa vụ khách quan) → "has to wear".'),
    E(L10, 18, 'You ___ better hurry or you\'ll be late.', ['had', 'would', 'should', 'must'], 0, '"Had better" + V bare → "had better hurry".'),
    E(L10, 19, 'I ___ play the piano when I was young.', ['can', 'could', 'may', 'should'], 1, 'Năng lực quá khứ → "could play".'),
    E(L10, 20, 'It ___ rain tomorrow, so bring an umbrella.', ['must', 'might', 'should', 'can'], 1, 'Khả năng → "might rain".'),
  )

  // Insert all exercises
  for (const ex of exercises) {
    await db.grammarExercise.upsert({ where: { id: ex.id }, update: ex, create: ex })
  }

  console.log('Grammar exercises seed complete.')
  console.log(`  Total exercises: ${await db.grammarExercise.count()}`)
  for (const lessonId of [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10]) {
    const count = await db.grammarExercise.count({ where: { lessonId } })
    console.log(`  ${lessonId}: ${count} exercises`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
