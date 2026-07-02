import { db } from '../src/lib/db'

async function main() {
  console.log('Seeding TOEIC content...')

  // ---------- VOCABULARY ----------
  const vocabs = [
    { word: 'invoice', phonetic: '/ˈɪn.vɔɪs/', partOfSpeech: 'noun', definition: 'a document showing how much money someone owes for goods or services', example: 'Please send the invoice to the accounting department.', translation: 'hóa đơn', category: 'finance', difficulty: 1 },
    { word: 'receipt', phonetic: '/rɪˈsiːt/', partOfSpeech: 'noun', definition: 'a piece of paper that proves money has been received', example: 'Keep your receipt in case you need a refund.', translation: 'biên lai', category: 'finance', difficulty: 1 },
    { word: 'schedule', phonetic: '/ˈskedʒ.uːl/', partOfSpeech: 'noun', definition: 'a plan of activities or events and when they will happen', example: 'The meeting has been added to your schedule.', translation: 'lịch trình', category: 'office', difficulty: 1 },
    { word: 'agenda', phonetic: '/əˈdʒen.də/', partOfSpeech: 'noun', definition: 'a list of matters to be discussed at a meeting', example: 'The first item on the agenda is the budget report.', translation: 'chương trình nghị sự', category: 'office', difficulty: 2 },
    { word: 'deadline', phonetic: '/ˈded.laɪn/', partOfSpeech: 'noun', definition: 'the time by which something must be finished', example: 'The deadline for submitting applications is Friday.', translation: 'hạn chót', category: 'office', difficulty: 1 },
    { word: 'negotiate', phonetic: '/nɪˈɡoʊ.ʃi.eɪt/', partOfSpeech: 'verb', definition: 'to discuss something to reach an agreement', example: 'They will negotiate the contract terms tomorrow.', translation: 'đàm phán', category: 'business', difficulty: 2 },
    { word: 'accomplish', phonetic: '/əˈkɑːm.plɪʃ/', partOfSpeech: 'verb', definition: 'to succeed in doing something', example: 'The team accomplished all of its quarterly goals.', translation: 'hoàn thành', category: 'business', difficulty: 3 },
    { word: 'reservation', phonetic: '/ˌrez.ərˈveɪ.ʃən/', partOfSpeech: 'noun', definition: 'an arrangement to keep something for someone', example: 'I would like to make a reservation for two.', translation: 'đặt chỗ', category: 'travel', difficulty: 1 },
    { word: 'itinerary', phonetic: '/aɪˈtɪn.ə.rer.i/', partOfSpeech: 'noun', definition: 'a planned route or journey', example: 'Your itinerary includes three cities.', translation: 'lịch trình chuyến đi', category: 'travel', difficulty: 3 },
    { word: 'depart', phonetic: '/dɪˈpɑːrt/', partOfSpeech: 'verb', definition: 'to leave, especially at the start of a journey', example: 'The train departs at 7 a.m. sharp.', translation: 'khởi hành', category: 'travel', difficulty: 2 },
    { word: 'allocate', phonetic: '/ˈæl.ə.keɪt/', partOfSpeech: 'verb', definition: 'to give something officially to someone for a particular purpose', example: 'Funds were allocated to the marketing team.', translation: 'phân bổ', category: 'finance', difficulty: 3 },
    { word: 'comply', phonetic: '/kəmˈplaɪ/', partOfSpeech: 'verb', definition: 'to act according to an order or rule', example: 'All employees must comply with safety regulations.', translation: 'tuân thủ', category: 'business', difficulty: 3 },
    { word: 'evaluate', phonetic: '/ɪˈvæl.ju.eɪt/', partOfSpeech: 'verb', definition: 'to judge or calculate the quality or value of something', example: 'Managers will evaluate employee performance.', translation: 'đánh giá', category: 'hr', difficulty: 2 },
    { word: 'candidate', phonetic: '/ˈkæn.dɪ.dət/', partOfSpeech: 'noun', definition: 'a person who applies for a job or is competing for a position', example: 'Three candidates were interviewed today.', translation: 'ứng viên', category: 'hr', difficulty: 1 },
    { word: 'promote', phonetic: '/prəˈmoʊt/', partOfSpeech: 'verb', definition: 'to raise someone to a higher position', example: 'She was promoted to senior manager.', translation: 'thăng chức', category: 'hr', difficulty: 1 },
    { word: 'revenue', phonetic: '/ˈrev.ə.nuː/', partOfSpeech: 'noun', definition: 'income from business activities', example: 'Revenue increased by 15% this quarter.', translation: 'doanh thu', category: 'finance', difficulty: 2 },
    { word: 'launch', phonetic: '/lɔːntʃ/', partOfSpeech: 'verb', definition: 'to begin a new product or service', example: 'The company will launch a new app next month.', translation: 'ra mắt', category: 'marketing', difficulty: 2 },
    { word: 'survey', phonetic: '/ˈsɜːr.veɪ/', partOfSpeech: 'noun', definition: 'a study of opinions or behavior by asking questions', example: 'Customers completed a satisfaction survey.', translation: 'khảo sát', category: 'marketing', difficulty: 1 },
    { word: 'upgrade', phonetic: '/ˈʌp.ɡreɪd/', partOfSpeech: 'verb', definition: 'to improve something to a higher standard', example: 'We plan to upgrade our software systems.', translation: 'nâng cấp', category: 'tech', difficulty: 2 },
    { word: 'database', phonetic: '/ˈdeɪ.tə.beɪs/', partOfSpeech: 'noun', definition: 'a large set of data stored in a computer', example: 'Customer records are stored in the database.', translation: 'cơ sở dữ liệu', category: 'tech', difficulty: 1 },
    { word: 'efficient', phonetic: '/ɪˈfɪʃ.ənt/', partOfSpeech: 'adj', definition: 'working well without wasting time or energy', example: 'The new process is much more efficient.', translation: 'hiệu quả', category: 'business', difficulty: 2 },
    { word: 'substantial', phonetic: '/səbˈstæn.ʃəl/', partOfSpeech: 'adj', definition: 'large in amount or value', example: 'A substantial discount was offered.', translation: 'đáng kể', category: 'business', difficulty: 3 },
    { word: 'mandatory', phonetic: '/ˈmæn.də.tɔːr.i/', partOfSpeech: 'adj', definition: 'required by rules or laws', example: 'Attendance at the training is mandatory.', translation: 'bắt buộc', category: 'business', difficulty: 3 },
    { word: 'approximately', phonetic: '/əˈprɑːk.sɪ.mət.li/', partOfSpeech: 'adv', definition: 'close to an exact amount but not exact', example: 'The trip takes approximately two hours.', translation: 'khoảng', category: 'general', difficulty: 2 },
    { word: 'available', phonetic: '/əˈveɪ.lə.bəl/', partOfSpeech: 'adj', definition: 'able to be used or obtained', example: 'The report is available on the company website.', translation: 'có sẵn', category: 'general', difficulty: 1 },
    { word: 'consider', phonetic: '/kənˈsɪd.ər/', partOfSpeech: 'verb', definition: 'to think carefully about something', example: 'Please consider our proposal carefully.', translation: 'xem xét', category: 'general', difficulty: 1 },
    { word: 'ensure', phonetic: '/ɪnˈʃʊr/', partOfSpeech: 'verb', definition: 'to make certain that something happens', example: 'We must ensure the data is accurate.', translation: 'đảm bảo', category: 'general', difficulty: 2 },
    { word: 'provide', phonetic: '/prəˈvaɪd/', partOfSpeech: 'verb', definition: 'to give something to someone', example: 'The guide provides detailed information.', translation: 'cung cấp', category: 'general', difficulty: 1 },
    { word: 'require', phonetic: '/rɪˈkwaɪər/', partOfSpeech: 'verb', definition: 'to need something', example: 'This project will require extra staff.', translation: 'yêu cầu', category: 'general', difficulty: 1 },
    { word: 'consecutive', phonetic: '/kənˈsek.jə.tɪv/', partOfSpeech: 'adj', definition: 'following one after another without interruption', example: 'Sales rose for three consecutive months.', translation: 'liên tiếp', category: 'business', difficulty: 4 },
    { word: 'implement', phonetic: '/ˈɪm.plə.ment/', partOfSpeech: 'verb', definition: 'to put a plan into action', example: 'The new policy will be implemented next week.', translation: 'thực thi', category: 'business', difficulty: 3 },
    { word: 'expand', phonetic: '/ɪkˈspænd/', partOfSpeech: 'verb', definition: 'to become larger in size or scope', example: 'The firm plans to expand into Asia.', translation: 'mở rộng', category: 'business', difficulty: 2 },
  ]
  for (const v of vocabs) {
    await db.vocab.upsert({ where: { id: v.word + '_' + v.partOfSpeech }, update: {}, create: { id: v.word + '_' + v.partOfSpeech, ...v } })
  }

  // ---------- GRAMMAR ----------
  const grammar: any[] = [
    {
      id: 'g_tenses_present',
      title: 'Present Simple vs. Present Continuous (Thì hiện tại đơn & tiếp diễn)',
      slug: 'present-simple-vs-continuous',
      category: 'tenses',
      level: 'beginner',
      summary: 'Phân biệt hiện tại đơn (thói quen, sự thật) và hiện tại tiếp diễn (đang xảy ra).',
      example: 'The company manufactures electronics (hiện tại đơn - sản xuất nói chung). Right now they are developing a new model (hiện tại tiếp diễn - đang phát triển).',
      content: `## 📖 Khái niệm

**Hiện tại đơn (Present Simple)** dùng để diễn tả:
- **Thói quen, hành động lặp đi lặp lại**: *I check email every morning.* (Tôi kiểm tra email mỗi sáng)
- **Sự thật hiển nhiên, chân lý**: *Water boils at 100°C.* (Nước sôi ở 100°C)
- **Lịch trình, thời gian biểu cố định**: *The train leaves at 7 a.m.* (Tàu rời đi lúc 7h sáng)

**Hiện tại tiếp diễn (Present Continuous)** dùng để diễn tả:
- **Hành động đang xảy ra ngay lúc nói**: *They are meeting a client right now.* (Họ đang gặp khách hàng ngay bây giờ)
- **Tình trạng tạm thời**: *We are launching a new product this quarter.* (Chúng tôi đang ra mắt sản phẩm mới trong quý này)

## 📝 Cấu trúc & Công thức

**Hiện tại đơn:**
- I/You/We/They + V(bare): *I work here.*
- He/She/It + V+s/es: *She works here.*
- Phủ định: *I don't work / She doesn't work*
- Nghi vấn: *Do you work? / Does she work?*

**Hiện tại tiếp diễn:**
- S + am/is/are + V-ing: *I am working. She is working. They are working.*
- Phủ định: *I am not working / She isn't working*

## 🔍 Dấu hiệu nhận biết (Signal words)

**Hiện tại đơn** — các từ chỉ tần suất:
- always (luôn), usually (thường), often (thường xuyên)
- sometimes (đôi khi), rarely (hiếm khi), never (không bao giờ)
- every day/week/month (mỗi ngày/tuần/tháng)
- on Mondays, in the morning (vào thứ Hai, vào buổi sáng)

**Hiện tại tiếp diễn** — các từ chỉ "ngay bây giờ":
- now (bây giờ), right now (ngay bây giờ)
- at the moment (tại lúc này), currently (hiện tại)
- at present (hiện nay), this week/quarter (tuần này/quý này)
- Look! (Nhìn kìa!), Listen! (Nghe kìa!)

## 💡 Ví dụ cụ thể

| Câu | Thì | Dịch |
|---|---|---|
| The store **opens** at 9 a.m. every day. | Hiện tại đơn | Cửa hàng mở cửa lúc 9h mỗi ngày |
| She **works** in the marketing department. | Hiện tại đơn | Cô ấy làm việc ở phòng marketing |
| They **are meeting** a client right now. | Hiện tại tiếp diễn | Họ đang gặp khách hàng ngay bây giờ |
| We **are launching** a new product this quarter. | Hiện tại tiếp diễn | Chúng tôi đang ra mắt sản phẩm mới quý này |
| The conference **starts** tomorrow. | Hiện tại đơn (lịch trình) | Hội nghị bắt đầu vào ngày mai |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: Động từ trạng thái (Stative verbs)**
Một số động từ **KHÔNG** dùng ở dạng tiếp diễn dù nghĩa là "hiện tại":
- know (biết), believe (tin), understand (hiểu)
- own (sở hữu), belong (thuộc về), have (có)
- like, love, hate, prefer (thích/yêu/ghét/thích hơn)
- seem, appear (dường như)

✅ Đúng: *I **know** the answer.* (Tôi biết đáp án)
❌ Sai: *I am knowing the answer.*

⚠️ **Bẫy 2: "Have" có 2 nghĩa**
- have = sở hữu → hiện tại đơn: *I have a car.* (Tôi có xe)
- have = ăn/uống/trải nghiệm → có thể dùng tiếp diễn: *I am having lunch.* (Tôi đang ăn trưa)

⚠️ **Bẫy 3: Từ chỉ tần suất vị trí**
Trạng từ chỉ tần suất (always, usually, often...) đứng **TRƯỚC** động từ thường nhưng **SAU** động từ "to be":
- *She **always arrives** early.* (always + arrive)
- *She **is always** late.* (is + always)

🎯 **Chiến thuật TOEIC Part 5**: Khi thấy câu có "every day", "usually" → chọn hiện tại đơn. Khi thấy "now", "currently", "at the moment" → chọn hiện tại tiếp diễn. Nhưng kiểm tra xem có phải stative verb không trước khi chọn!`,
    },
    {
      id: 'g_present_perfect',
      title: 'Present Perfect & Past Simple (Hiện tại hoàn thành & Quá khứ đơn)',
      slug: 'present-perfect-past-simple',
      category: 'tenses',
      level: 'intermediate',
      summary: 'Hiện tại hoàn thành nối quá khứ với hiện tại; quá khứ đơn cho hành động đã kết thúc.',
      example: 'She has worked here since 2018 (cô ấy làm việc ở đây từ 2018 - vẫn còn làm). She joined the team in 2018 (cô ấy gia nhập đội năm 2018 - đã xảy ra).',
      content: `## 📖 Khái niệm

**Hiện tại hoàn thành (Present Perfect)**: Hành động xảy ra trong quá khứ nhưng **vẫn còn liên quan đến hiện tại**. Thường dùng khi:
- Hành động bắt đầu trong quá khứ và **còn tiếp diễn đến hiện tại**
- Nói về **kinh nghiệm** đã trải nghiệm
- Hành động vừa mới xảy ra, **kết quả còn thấy ở hiện tại**

**Quá khứ đơn (Past Simple)**: Hành động **đã hoàn toàn kết thúc** trong quá khứ, có thời gian cụ thể.

## 📝 Cấu trúc & Công thức

**Hiện tại hoàn thành:**
- S + have/has + V3 (past participle)
- *I have finished the report.* (Tôi đã hoàn thành báo cáo)
- *She has worked here for 5 years.* (Cô ấy đã làm ở đây 5 năm)

**Quá khứ đơn:**
- S + V2 (past form)
- *I finished the report yesterday.* (Tôi đã hoàn thành báo cáo hôm qua)
- *She worked here in 2018.* (Cô ấy đã làm ở đây vào năm 2018)

## 🔍 Dấu hiệu nhận biết

**Hiện tại hoàn thành** — từ chỉ "thời gian chưa kết thúc":
- since + mốc thời gian: *since 2018, since Monday* (từ 2018, từ thứ Hai)
- for + khoảng thời gian: *for 5 years, for 2 hours* (trong 5 năm, trong 2 giờ)
- so far: *so far this month* (tới thời điểm hiện tại trong tháng này)
- yet / already: *I haven't finished yet. I have already eaten.*
- just: *He has just left.* (Anh ấy vừa mới rời đi)
- ever / never (cho kinh nghiệm): *Have you ever been to Japan?*

**Quá khứ đơn** — từ chỉ "thời gian đã kết thúc":
- yesterday (hôm qua), last week/month/year (tuần/tháng/năm trước)
- in 2018, in June (vào năm 2018, vào tháng 6)
- ... ago: *2 days ago, 3 years ago* (2 ngày trước, 3 năm trước)
- when I was young (khi tôi còn trẻ)

## 💡 Ví dụ cụ thể

| Câu | Thì | Dịch |
|---|---|---|
| We **have received** 50 applications so far. | Hiện tại hoàn thành | Chúng tôi đã nhận được 50 đơn cho tới nay |
| He **has visited** our Tokyo office. | Hiện tại hoàn thành (kinh nghiệm) | Anh ấy đã từng thăm văn phòng Tokyo |
| Sales **have increased** this quarter. | Hiện tại hoàn thành | Doanh số đã tăng trong quý này |
| They **signed** the contract last week. | Quá khứ đơn | Họ đã ký hợp đồng tuần trước |
| I **lived** in Hanoi in 2019. | Quá khứ đơn | Tôi đã sống ở Hà Nội vào năm 2019 |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: Có "ago" → chắc chắn quá khứ đơn**
- ✅ *I started working here 3 years ago.* (đúng)
- ❌ *I have started working here 3 years ago.* (sai - "ago" không đi với hiện tại hoàn thành)

⚠️ **Bẫy 2: "Since" vs "For"**
- since + **mốc thời gian**: *since 2018, since Monday, since I was born*
- for + **khoảng thời gian**: *for 5 years, for 2 hours, for a long time*

⚠️ **Bẫy 3: Lẫn lộn V2 và V3**
- V2 (quá khứ đơn): *go → went, see → saw, write → wrote*
- V3 (phân từ hai, cho hiện tại hoàn thành): *go → gone, see → seen, write → written*
- Cả 2 đều bất quy tắc → phải học bảng động từ bất quy tắc!

🎯 **Chiến thuật TOEIC Part 5**: 
- Thấy "ago", "yesterday", "last week", "in + năm" → **quá khứ đơn**
- Thấy "since", "for", "so far", "yet", "already", "just" → **hiện tại hoàn thành**
- Nếu câu có "ago" mà đáp án có hiện tại hoàn thành → **loại ngay**`,
    },
    {
      id: 'g_conditionals',
      title: 'Conditionals (Câu điều kiện loại 0, 1, 2)',
      slug: 'conditionals',
      category: 'conditionals',
      level: 'intermediate',
      summary: 'Câu điều kiện: loại 0 (sự thật), loại 1 (có thể xảy ra), loại 2 (giả định không thật).',
      example: 'If we lower the price, sales will increase (loại 1 - có thể xảy ra). If I were the manager, I would hire more staff (loại 2 - giả định không thật).',
      content: `## 📖 Khái niệm

Câu điều kiện dùng để nói về **điều kiện + kết quả**. Có 3 loại chính:

- **Loại 0 (Zero conditional)**: Sự thật hiển nhiên, luôn luôn đúng
- **Loại 1 (First conditional)**: Tình huống **có thể xảy ra** ở tương lai
- **Loại 2 (Second conditional)**: Tình huống **giả định, không có thật** ở hiện tại

## 📝 Cấu trúc & Công thức

**Loại 0 — Sự thật:**
- **If + hiện tại đơn, hiện tại đơn**
- *If you heat water to 100°C, it boils.* (Nếu bạn đun nước đến 100°C, nó sẽ sôi)

**Loại 1 — Có thể xảy ra:**
- **If + hiện tại đơn, will + V(bare)**
- *If we meet the deadline, the client will be satisfied.* (Nếu chúng ta kịp hạn, khách hàng sẽ hài lòng)

**Loại 2 — Giả định không thật:**
- **If + quá khứ đơn, would + V(bare)**
- *If I were the CEO, I would invest in training.* (Nếu tôi là CEO, tôi sẽ đầu tư vào đào tạo)

## 🔍 Dấu hiệu nhận biết

- **If** (nếu), **unless** (nếu không = if not)
- **When** (khi) — thường dùng với loại 0 hoặc 1
- **As long as** (miễn là), **provided that** (with điều kiện là)
- **In case** (phòng khi)

Loại 2 thường có ngữ cảnh:
- Nói về ước muốn không thật: *If I were rich...* (Giá mà tôi giàu...)
- Khuyên nhủ giả định: *If I were you, I would...* (Nếu tôi là bạn, tôi sẽ...)

## 💡 Ví dụ cụ thể

| Câu | Loại | Dịch |
|---|---|---|
| If you press this button, the machine starts. | 0 (sự thật) | Nếu bạn nhấn nút này, máy khởi động |
| If it rains tomorrow, we will cancel the picnic. | 1 (có thể xảy ra) | Nếu mai mưa, chúng tôi sẽ hủy dã ngoại |
| If I had more time, I would learn French. | 2 (giả định) | Nếu tôi có nhiều thời gian hơn, tôi sẽ học tiếng Pháp |
| If I were you, I would accept the offer. | 2 (khuyên) | Nếu tôi là bạn, tôi sẽ nhận lời đề nghị |
| Unless you hurry, you will miss the train. | 1 (= if not) | Nếu bạn không khẩn trương, bạn sẽ lỡ tàu |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: KHÔNG dùng "will" sau "if"**
- ❌ Sai: *If it **will** rain, we will stay home.*
- ✅ Đúng: *If it **rains**, we will stay home.*
- "Will" chỉ xuất hiện ở mệnh đề **chính** (kết quả), không ở mệnh đề "if" (điều kiện)

⚠️ **Bẫy 2: "Were" cho tất cả chủ ngữ ở loại 2**
- ✅ *If I **were** you...* (đúng - dùng "were" cho "I")
- ✅ *If he **were** here...* (đúng - dùng "were" cho "he")
- ❌ *If I **was** you...* (sai trong văn formal/TOEIC)
- Form "were" cho mọi chủ ngữ là dạng **subjunctive** (thức giả định)

⚠️ **Bẫy 3: "Unless" = "If not"**
- *Unless you study, you will fail.* = *If you don't study, you will fail.*
- Chú ý: after "unless" dùng **dạng khẳng định**

🎯 **Chiến thuật TOEIC Part 5**: 
- Thấy "If + hiện tại đơn" + blank → chọn "will + V"
- Thấy "If + quá khứ đơn" + blank → chọn "would + V"
- Thấy "would" ở mệnh đề chính → mệnh đề "if" dùng quá khứ đơn
- Sau "if" có "will/would" → **loại ngay**`,
    },
    {
      id: 'g_passive',
      title: 'The Passive Voice (Câu bị động)',
      slug: 'passive-voice',
      category: 'voice',
      level: 'intermediate',
      summary: 'Câu bị động nhấn mạnh vào đối tượng nhận hành động, dùng "be + V3".',
      example: 'The report was prepared by the analyst (báo cáo được chuẩn bị bởi chuyên viên phân tích). The office is cleaned every evening (văn phòng được dọn dẹp mỗi tối).',
      content: `## 📖 Khái niệm

**Câu chủ động (Active)**: Chủ ngữ **thực hiện** hành động.
- *The team completed the project.* (Đội đã hoàn thành dự án)

**Câu bị động (Passive)**: Chủ ngữ **nhận** hành động. Nhấn mạnh vào **kết quả/đối tượng** thay vì người thực hiện.
- *The project was completed by the team.* (Dự án đã được hoàn thành bởi đội)

**Khi nào dùng bị động?**
- Không biết/biết ít về người thực hiện: *The window was broken.* (Cửa sổ bị vỡ)
- Muốn nhấn mạnh đối tượng nhận hành động: *Your application has been received.* (Đơn của bạn đã được nhận)
- Văn phong trang trọng (business/formal): *The report is being prepared.* (Báo cáo đang được chuẩn bị)

## 📝 Cấu trúc & Công thức

**Công thức chung: S + be + V3 (past participle)**

Bảng các thì bị động phổ biến:

| Thì | Chủ động | Bị động |
|---|---|---|
| Hiện tại đơn | *They print the report.* | *The report **is printed**.* |
| Quá khứ đơn | *They signed the contract.* | *The contract **was signed**.* |
| Hiện tại hoàn thành | *They have shipped the items.* | *The items **have been shipped**.* |
| Tương lai đơn | *They will renovate the office.* | *The office **will be renovated**.* |
| Hiện tại tiếp diễn | *They are building the hotel.* | *The hotel **is being built**.* |
| Động từ khuyết thiếu | *You must submit the form.* | *The form **must be submitted**.* |

**Công thức đảo chủ ngữ thành túc ngữ:**
- Active: **S** + V + **O** + (by + người thực hiện)
- Passive: **O** + be + V3 + (by + người thực hiện)
- *John wrote the report.* → *The report was written by John.*

## 🔍 Dấu hiệu nhận biết

- Có **"by + người"** ở cuối câu: *by the manager, by the team, by John*
- Động từ chính ở dạng **V3** (past participle): *written, sent, made, done*
- Trước V3 có dạng **"be"** (is/are/was/were/has been/will be...)
- Văn phong trang trọng, không nhắc người thực hiện

## 💡 Ví dụ cụ thể

| Câu chủ động | Câu bị động | Dịch |
|---|---|---|
| The team **completed** the project. | The project **was completed** by the team. | Dự án đã được hoàn thành bởi đội |
| They **sign** the contract every year. | The contract **is signed** every year. | Hợp đồng được ký mỗi năm |
| They **have shipped** the items. | The items **have been shipped**. | Hàng hóa đã được gửi đi |
| They **will renovate** the office. | The office **will be renovated**. | Văn phòng sẽ được cải tạo |
| Someone **stole** my car. | My car **was stolen**. | Xe của tôi bị đánh cắp |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: Động từ + 2 tân ngữ**
Một số động từ (give, send, show, offer, tell...) có 2 tân ngữ → 2 cách bị động:
- *They gave **John** **a gift**.* (chủ động)
- *Cách 1:* **John** was given a gift. (nhấn mạnh người nhận)
- *Cách 2:* **A gift** was given to John. (nhấn mạnh vật nhận)
- Cách 1 phổ biến hơn trong TOEIC

⚠️ **Bẫy 2: Bị động với "by" hay "with"?**
- **by + người thực hiện**: *The report was written **by** the manager.* (bởi người quản lý)
- **with + công cụ**: *The window was broken **with** a hammer.* (bằng cái búa)

⚠️ **Bẫy 3: Động từ không dùng bị động**
- Động từ trạng thái (stative verbs): *have (= sở hữu), belong, fit, suit, lack*
- ❌ Sai: *A new car is had by him.*
- ✅ Đúng: *He has a new car.*

⚠️ **Bẫy 4: Chủ ngữ "It" trong câu giả**
- *It is said that he is rich.* = *He is said to be rich.* (Người ta nói rằng anh ấy giàu)
- Đây là cấu trúc bị động phổ biến trong TOEIC Part 5/6

🎯 **Chiến thuật TOEIC Part 5**: 
- Thấy chủ ngữ là **vật** + động từ → check xem có phải bị động không
- Nếu có "by + người" sau blank → chắc chắn bị động (be + V3)
- Nếu chủ ngữ là vật nhưng hành động vật tự làm được → chủ động: *The door **opened**.* (cửa mở - không cần "was opened")
- Thấy modal (must, should, can) + vật → **modal + be + V3**: *The form must be submitted.*`,
    },
    {
      id: 'g_articles',
      title: 'Articles (Mạo từ a / an / the)',
      slug: 'articles',
      category: 'articles',
      level: 'beginner',
      summary: 'Mạo từ không xác định (a/an) và xác định (the), khi nào không dùng mạo từ.',
      example: 'I bought a computer (tôi mua 1 máy tính - lần đầu nhắc). The computer is on the desk (chiếc máy tính đó ở trên bàn - đã xác định).',
      content: `## 📖 Khái niệm

Mạo từ (article) đứng trước danh từ để cho biết danh từ đó **xác định** (cái nào, cái cụ thể) hay **chưa xác định** (1 cái bất kỳ).

- **a / an**: Mạo từ **không xác định** (indefinite article) — dùng khi nhắc lần đầu, 1 cái bất kỳ
- **the**: Mạo từ **xác định** (definite article) — dùng khi đã xác định cụ thể, hoặc đã nhắc trước đó
- **∅ (không dùng mạo từ)**: Một số trường hợp không dùng mạo từ

## 📝 Cấu trúc & Công thức

### a / an (không xác định)
- Dùng cho danh từ **đếm được, số ít**, nhắc lần đầu
- **a** + âm **consonant** (phụ âm): *a book, a car, a university* (phát âm "yu")
- **an** + âm **vowel** (nguyên âm): *an apple, an hour* (phát âm "au"), an MBA
- *I bought **a** book yesterday.* (Tôi đã mua 1 cuốn sách hôm qua)

### the (xác định)
- Dùng khi danh từ đã được **xác định cụ thể**:
  - Đã nhắc trước đó: *I bought a book. **The** book is interesting.*
  - Có bổ nghĩa cụ thể: *The book on the table* (Cuốn sách trên bàn)
  - Duy nhất: *the sun, the moon, the sky, the president*
- Dùng với danh từ chỉ **thế giới, vùng**: *the world, the Pacific, the US*

### Không dùng mạo từ (∅)
- Danh từ **số nhiều** nói chung: *Computers are useful.* (Máy tính thì hữu ích)
- Danh từ **không đếm được** nói chung: *Information is power.* (Thông tin là sức mạnh)
- Tên riêng: *John, Microsoft, Tokyo, Vietnam*
- Bữa ăn, môn học, ngôn ngữ: *breakfast, English, biology*
- Một số cụm cố định: *at home, go to school, by car, in bed*

## 🔍 Dấu hiệu nhận biết

**Dùng "a/an" khi:**
- Nhắc lần đầu, chưa xác định cụ thể
- Danh từ đếm được số ít, có "1" ngầm hiểu
- Có tính từ bổ nghĩa: *a beautiful house, an interesting book*

**Dùng "the" khi:**
- Đã nhắc trước đó trong bài
- Có "of" hoặc mệnh đề bổ nghĩa: *the capital of Vietnam, the man who called you*
- Đi với tính từ cấp cao nhất: *the best, the most expensive*
- Danh từ duy nhất: *the sun, the moon, the Internet*

## 💡 Ví dụ cụ thể

| Câu | Mạo từ | Lý do |
|---|---|---|
| I saw **a** cat. **The** cat was black. | a → the | Nhắc lần đầu (a), sau đó đã xác định (the) |
| She is **an** engineer. | an | Nghề nghiệp, âm nguyên âm |
| **The** report you asked for is ready. | the | Có mệnh đề bổ nghĩa "you asked for" |
| He is **the** best player on the team. | the | Tính từ cao nhất "best" |
| **∅** Water is essential for life. | ∅ | Danh từ không đếm được, nói chung |
| I go to work by **∅** bus. | ∅ | Cụm cố định "by + phương tiện" |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: Phát âm quyết định "a" hay "an", KHÔNG phải chữ viết**
- *a university* (phát âm "yu-ni-..." → consonant sound)
- *an hour* (phát âm "au-..." → vowel sound, "h" câm)
- *an MBA* (phát âm "em-bi-ei" → vowel sound)
- *a one-way ticket* (phát âm "wan" → consonant sound)

⚠️ **Bẫy 2: "the" với tên riêng**
- **KHÔNG dùng** "the" với: *Tokyo, Microsoft, John, Vietnam*
- **Dùng** "the" với: *the United States, the Netherlands, the UK* (các nước có "States/Kingdom/Republic")
- **Dùng** "the" với: *the Pacific Ocean, the Amazon River* (sông, biển, đại dương)

⚠️ **Bẫy 3: "A few" vs "A little"**
- *a few* + danh từ đếm được số nhiều: *a few books* (một vài cuốn sách)
- *a little* + danh từ không đếm được: *a little water* (một ít nước)
- Cả 2 đều mang nghĩa tích cực (có một chút)

🎯 **Chiến thuật TOEIC Part 5**:
- Thấy danh từ **số ít đếm được** + không xác định → "a/an"
- Thấy danh từ **đã nhắc trước đó** hoặc **có bổ nghĩa** → "the"
- Thấy danh từ **số nhiều/không đếm được** nói chung → ∅
- Đáp án có "a" trước danh từ số nhiều → **loại** (sai ngữ pháp)`,
    },
    {
      id: 'g_prepositions',
      title: 'Prepositions of Time & Place (Giới từ thời gian & địa điểm)',
      slug: 'prepositions-time-place',
      category: 'prepositions',
      level: 'beginner',
      summary: 'Phân biệt in/on/at cho thời gian và địa điểm, kèm các collocation phổ biến.',
      example: 'The meeting is at 3 p.m. on Monday in the main hall (cuộc họp lúc 3h chiều thứ Hai ở hội trường chính).',
      content: `## 📖 Khái niệm

Giới từ thời gian và địa điểm là một trong những chủ đề **thi nhiều nhất** trong TOEIC Part 5/6. Phân biệt chính: **in / on / at** tùy thuộc vào **mức độ cụ thể** của thời gian/địa điểm.

**Nguyên tắc chung (quy tắc "phễu"):**
- **in**: phạm vi rộng (tháng, năm, thành phố, quốc gia)
- **on**: phạm vi trung bình (ngày, ngày lễ, đường phố, bề mặt)
- **at**: phạm vi hẹp/cụ thể (giờ, địa điểm cụ thể, tọa độ)

## 📝 Cấu trúc & Công thức

### Giới từ thời gian

| Giới từ | Dùng với | Ví dụ |
|---|---|---|
| **at** | Giờ cụ thể, thời điểm | *at 9 a.m., at noon, at midnight, at the moment* |
| **on** | Ngày trong tuần, ngày lễ, ngày cụ thể | *on Monday, on July 4th, on Christmas Day, on my birthday* |
| **in** | Tháng, năm, mùa, thế kỷ | *in May, in 2024, in summer, in the 21st century* |
| **by** | Hạn chót (deadline) | *by Friday, by 5 p.m., by the end of the month* |
| **until/till** | Cho đến khi | *until 5 p.m., until next week* |
| **since** | Từ mốc thời gian (hiện tại hoàn thành) | *since 2018, since Monday* |
| **for** | Trong khoảng thời gian | *for 3 hours, for 5 years* |

### Giới từ địa điểm

| Giới từ | Dùng với | Ví dụ |
|---|---|---|
| **at** | Địa điểm cụ thể, tọa độ | *at the door, at the desk, at the airport, at 123 Main St* |
| **on** | Bề mặt, đường phố, tầng | *on the table, on Wall Street, on the 5th floor* |
| **in** | Không gian kín, thành phố, quốc gia | *in the office, in Tokyo, in Vietnam, in the box* |

## 🔍 Dấu hiệu nhận biết

**Cặp dễ nhầm:**
- **in time** (đúng lúc, trước deadline): *We arrived in time for the meeting.* (Đến kịp họp)
- **on time** (đúng giờ, đúng lịch): *The train arrived on time.* (Tàu đến đúng giờ)
- **at the end** (cuối cùng, điểm cuối): *at the end of the movie* (cuối phim)
- **in the end** (cuối cùng = finally): *In the end, we agreed.* (Cuối cùng chúng tôi đồng ý)

**Cụm cố định hay gặp:**
- *at night, at the weekend* (Anh-Anh) / *on the weekend* (Anh-Mỹ)
- *in the morning/afternoon/evening* nhưng *at night*
- *on time, in time, by the deadline*

## 💡 Ví dụ cụ thể

| Câu | Giới từ | Dịch |
|---|---|---|
| The meeting starts **at** 3 p.m. | at (giờ cụ thể) | Cuộc họp bắt đầu lúc 3h chiều |
| We will launch the product **on** Monday. | on (ngày tuần) | Chúng tôi sẽ ra mắt sản phẩm vào thứ Hai |
| The conference is **in** June. | in (tháng) | Hội nghị diễn ra vào tháng 6 |
| Please submit the form **by** Friday. | by (deadline) | Vui lòng nộp mẫu trước thứ Sáu |
| The office is **on** the 5th floor. | on (tầng) | Văn phòng ở tầng 5 |
| She works **in** the marketing department. | in (phòng ban) | Cô ấy làm ở phòng marketing |
| I'll meet you **at** the entrance. | at (điểm cụ thể) | Tôi sẽ gặp bạn ở lối vào |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: "in/on/at" với phương tiện**
- **in** + xe nhỏ (cá nhân): *in a car, in a taxi* (vì có không gian kín)
- **on** + xe lớn (công cộng): *on a bus, on a train, on a plane* (vì có thể đi lại)
- **on** + xe đạp/máy: *on a bicycle, on a motorcycle*

⚠️ **Bẫy 2: "by" vs "with"**
- **by** + phương tiện (không có mạo từ): *by car, by bus, by train* (đi bằng xe hơi, xe buýt)
- **on** + phương tiện cụ thể: *on the 7 a.m. train, on flight 808* (chuyến cụ thể)
- **with** + công cụ: *cut with a knife, write with a pen*

⚠️ **Bẫy 3: "Since" vs "For"**
- **since** + mốc thời gian: *since 2018, since Monday, since I was born*
- **for** + khoảng thời gian: *for 5 years, for 2 hours, for a long time*
- Cả 2 đều dùng với hiện tại hoàn thành

⚠️ **Bẫy 4: "Between" vs "Among"**
- **between** + 2 đối tượng: *between you and me* (giữa bạn và tôi)
- **among** + 3+ đối tượng: *among the team members* (giữa các thành viên)

🎯 **Chiến thuật TOEIC Part 5**:
- Thấy giờ cụ thể (3 p.m., 9:00) → **at**
- Thấy ngày (Monday, July 4th) → **on**
- Thấy tháng/năm (June, 2024) → **in**
- Thấy "deadline" → **by**
- Học thuộc các collocation: *responsible for, interested in, depend on, apply for*`,
    },
    {
      id: 'g_gerund_inf',
      title: 'Gerunds vs. Infinitives (Danh động từ vs Động từ nguyên mẫu)',
      slug: 'gerunds-infinitives',
      category: 'verb-forms',
      level: 'intermediate',
      summary: 'Động từ nào theo sau bằng V-ing, động từ nào theo sau bằng to + V, kèm ngoại lệ.',
      example: 'I enjoy working here (tôi thích làm việc ở đây - enjoy + V-ing). I want to leave early (tôi muốn về sớm - want + to V).',
      content: `## 📖 Khái niệm

Sau một số động từ, ta phải dùng **V-ing** (danh động từ - gerund), sau số khác phải dùng **to + V** (động từ nguyên mẫu có "to" - infinitive). Đây là một chủ đề **thi rất nhiều** trong TOEIC Part 5.

- **Gerund (V-ing)**: Dùng như 1 danh từ, chỉ hoạt động/thói quen
- **Infinitive (to + V)**: Chỉ mục đích, dự định, tương lai

## 📝 Cấu trúc & Công thức

### Nhóm 1: Động từ + V-ing (Gerund)
Các động từ sau **bắt buộc** đi với V-ing:

**Nhớ bằng mẹo "MEGAFEPS":**
- **M**ind (phiền), **E**njoy (thích), **G**ive up (từ bỏ)
- **A**void (tránh), **F**inish (hoàn thành)
- **E**scape (tránh thoát), **P**ostpone (trì hoãn), **S**top (ngừng)
- Cộng thêm: *consider, deny, suggest, practice, admit, miss, keep, resist, imagine, recommend*

**Ví dụ:**
- *She enjoys **working** here.* (Cô ấy thích làm việc ở đây)
- *They postponed **launching** the product.* (Họ trì hoãn việc ra mắt sản phẩm)
- *I avoid **eating** fast food.* (Tôi tránh ăn đồ nhanh)

### Nhóm 2: Động từ + to + V (Infinitive)
Các động từ sau **bắt buộc** đi với "to + V":

- **want** (muốn), **decide** (quyết định), **hope** (hy vọng)
- **plan** (lập kế hoạch), **agree** (đồng ý), **offer** (đề nghị)
- **refuse** (từ chối), **promise** (hứa), **learn** (học)
- **choose** (chọn), **manage** (quản lý), **fail** (thất bại)
- **tend** (có xu hướng), **pretend** (giả vờ), **claim** (tuyên bố)

**Ví dụ:**
- *They decided **to expand** the business.* (Họ quyết định mở rộng kinh doanh)
- *She promised **to call** me back.* (Cô ấy hứa sẽ gọi lại)
- *We plan **to launch** next month.* (Chúng tôi dự định ra mắt vào tháng sau)

### Nhóm 3: Động từ + cả 2 (đổi nghĩa)
Một số động từ có thể dùng cả 2, **nhưng nghĩa khác nhau**:

| Động từ | + V-ing | + to + V |
|---|---|---|
| **stop** | *He stopped smoking.* (Bỏ thuốc) | *He stopped to smoke.* (Dừng lại để hút thuốc) |
| **remember** | *I remember locking the door.* (Nhớ đã khóa) | *Remember to lock the door.* (Nhớ phải khóa) |
| **forget** | *I forgot meeting her.* (Quên đã gặp) | *I forgot to call her.* (Quên không gọi) |
| **try** | *Try adding sugar.* (Thử thêm đường) | *Try to open it.* (Cố gắng mở) |
| **regret** | *I regret saying that.* (Tiếc vì đã nói) | *I regret to say...* (Tiếc phải nói...) |

### Sau giới từ → luôn V-ing
- *She is good at **organizing** events.* (Cô ấy giỏi tổ chức sự kiện)
- *Thank you for **helping** me.* (Cảm ơn vì đã giúp)
- *I'm interested in **learning** French.* (Tôi quan tâm đến việc học tiếng Pháp)

## 🔍 Dấu hiệu nhận biết

- Thấy động từ nhóm 1 (enjoy, avoid, finish...) → **V-ing**
- Thấy động từ nhóm 2 (want, decide, plan...) → **to + V**
- Thấy giới từ (in, on, at, for, about...) → **V-ing**
- Thấy "to" như giới từ (chỉ hướng) → V-ing: *I look forward to **hearing** from you.*

## 💡 Ví dụ cụ thể

| Câu | Dạng | Dịch |
|---|---|---|
| She suggested **postponing** the meeting. | V-ing (suggest) | Cô ấy gợi ý trì hoãn cuộc họp |
| They decided **to expand** the business. | to + V (decide) | Họ quyết định mở rộng kinh doanh |
| I enjoy **working** with you. | V-ing (enjoy) | Tôi thích làm việc với bạn |
| He wants **to leave** early. | to + V (want) | Anh ấy muốn về sớm |
| She is good at **organizing** events. | V-ing (sau giới từ) | Cô ấy giỏi tổ chức sự kiện |
| I look forward to **hearing** from you. | V-ing ("to" ở đây là giới từ) | Tôi mong sớm nghe tin từ bạn |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: "To" là infinitive hay giới từ?**
- *I want **to go**.* (to = infinitive marker → V bare)
- *I look forward to **hearing** from you.* (to = giới từ → V-ing)
- Cách phân biệt: "look forward to", "be used to", "object to" → "to" là giới từ → V-ing

⚠️ **Bẫy 2: "Used to" vs "Be used to"**
- *used to + V* (thường làm trong quá khứ, giờ không): *I used to **smoke**.* (Tôi từng hút thuốc)
- *be used to + V-ing* (quen với việc gì): *I am used to **working** late.* (Tôi quen với việc làm muộn)

⚠️ **Bẫy 3: Động từ + V hay V-ing sau "suggest/recommend"**
- *suggest/recommend + V-ing*: *I suggest **going** now.*
- *suggest/recommend + that + S + V bare*: *I suggest that he **go** now.* (subjunctive)
- ❌ Sai: *I suggest him to go.* (không dùng "suggest + sb + to + V")

🎯 **Chiến thuật TOEIC Part 5**:
- Học thuộc danh sách động từ + V-ing (nhóm 1) và + to + V (nhóm 2)
- Thấy giới từ → chắc chắn V-ing
- Thấy "look forward to", "be used to", "object to" → V-ing
- Thấy "suggest" + người → dùng "that + S + V bare" hoặc "V-ing" (không có "to + V")`,
    },
    {
      id: 'g_relative',
      title: 'Relative Clauses (Mệnh đề quan hệ)',
      slug: 'relative-clauses',
      category: 'clauses',
      level: 'intermediate',
      summary: 'who/which/that/where/whose — mệnh đề quan hệ xác định và không xác định.',
      example: 'The manager who hired me is retiring (người quản lý đã thuê tôi đang về hưu). The report which was submitted is incomplete (báo cáo đã nộp chưa hoàn chỉnh).',
      content: `## 📖 Khái niệm

**Mệnh đề quan hệ (Relative Clause)** là mệnh đề phụ bổ nghĩa cho danh từ đứng trước nó, bắt đầu bằng **đại từ quan hệ** (who, which, that, whose, where, when).

Có 2 loại:
- **Mệnh đề xác định (Defining)**: Bắt buộc để hiểu nghĩa, không có dấu phẩy
- **Mệnh đề không xác định (Non-defining)**: Bổ sung thông tin thêm, có dấu phẩy, có thể bỏ đi

## 📝 Cấu trúc & Công thức

### Các đại từ quan hệ

| Đại từ | Dùng cho | Ví dụ |
|---|---|---|
| **who** | Người (chủ ngữ) | *The man **who** called you is here.* |
| **whom** | Người (tân ngữ, formal) | *The man **whom** I met yesterday...* |
| **which** | Vật, động vật | *The book **which** is on the table...* |
| **that** | Người HOẶC vật (chỉ mệnh đề xác định) | *The book **that** I bought...* |
| **whose** | Sở hữu (của ai, của cái gì) | *The man **whose** car was stolen...* |
| **where** | Nơi chốn | *The city **where** I was born...* |
| **when** | Thời gian | *The year **when** I graduated...* |

### Mệnh đề xác định (Defining)
- **Không** có dấu phẩy
- Bắt buộc để biết đang nói về cái nào
- Có thể dùng **that** thay cho who/which
- *The man **who** called you is here.* (Người đàn ông đã gọi cho bạn đang ở đây)

### Mệnh đề không xác định (Non-defining)
- **Có** dấu phẩy ngăn cách
- Bổ sung thông tin thêm, có thể bỏ
- **KHÔNG** dùng "that", chỉ dùng who/which
- *Mr. Lee, **who** is our CFO, will speak.* (Ông Lee, người là CFO của chúng ta, sẽ phát biểu)

## 🔍 Dấu hiệu nhận biết

- Thấy danh từ + **who/which/that/whose/where** → mệnh đề quan hệ
- Sau mệnh đề quan hệ có **dấu phẩy** → mệnh đề không xác định → không dùng "that"
- Mệnh đề không xác định thường đứng giữa 2 dấu phẩy: *Mr. Lee, **, who**..., **,** will speak.*

## 💡 Ví dụ cụ thể

| Câu | Đại từ | Loại | Dịch |
|---|---|---|---|
| The candidate **who** applied yesterday is strong. | who (người) | Xác định | Ứng viên đã ứng tuyển hôm qua rất mạnh |
| The contract **which** was signed yesterday is valid. | which (vật) | Xác định | Hợp đồng được ký hôm qua có hiệu lực |
| The employee **whose** laptop was stolen reported it. | whose (sở hữu) | Xác định | Nhân viên có laptop bị đánh cắp đã báo cáo |
| The office **where** I work is downtown. | where (nơi) | Xác định | Văn phòng nơi tôi làm việc ở trung tâm |
| Mr. Lee, **who** is our CFO, will speak tomorrow. | who (người) | Không xác định | Ông Lee, CFO của chúng ta, sẽ phát biểu ngày mai |
| This book, **which** I bought last week, is great. | which (vật) | Không xác định | Cuốn sách này, tôi mua tuần trước, rất hay |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: Có dấu phẩy → KHÔNG dùng "that"**
- ✅ *Mr. Lee, **who** is our CFO, will speak.* (đúng)
- ❌ *Mr. Lee, **that** is our CFO, will speak.* (sai - mệnh đề không xác định không dùng "that")

⚠️ **Bẫy 2: "Who" vs "Whom"**
- **who** = chủ ngữ: *The man **who** called you...* (người đàn ông đã gọi...)
- **whom** = tân ngữ (formal): *The man **whom** I met...* (người đàn ông mà tôi đã gặp...)
- Trong văn nói/thường: có thể dùng "who" thay cho "whom"

⚠️ **Bẫy 3: "Whose" cho cả người và vật**
- *The man **whose** car was stolen...* (người đàn ông có xe bị đánh cắp)
- *The book **whose** cover is torn...* (cuốn sách có bìa bị rách)
- "Whose" dùng cho cả người và vật trong formal English

⚠️ **Bẫy 4: Rút gọn mệnh đề quan hệ**
- Hiện tại: *The man **standing** there is my boss.* (= who is standing)
- Quá khứ: *The book **written** in 1990 is rare.* (= which was written)
- TOEIC Part 5/6 hay test dạng rút gọn này

🎯 **Chiến thuật TOEIC Part 5**:
- Thấy danh từ chỉ người + blank → "who" hoặc "that"
- Thấy danh từ chỉ vật + blank → "which" hoặc "that"
- **Có dấu phẩy** → loại "that", chọn "who/which"
- Thấy "whose" → check có ý sở hữu không
- Mệnh đề rút gọn: chủ động → V-ing, bị động → V3`,
    },
    {
      id: 'g_comparison',
      title: 'Comparatives & Superlatives (So sánh hơn & nhất)',
      slug: 'comparatives-superlatives',
      category: 'adjectives',
      level: 'beginner',
      summary: 'So sánh hơn (-er/more) và so sánh nhất (-est/most), kèm bất quy tắc.',
      example: 'This model is faster than the previous one (mẫu này nhanh hơn mẫu trước). It is the most efficient on the market (nó hiệu quả nhất trên thị trường).',
      content: `## 📖 Khái niệm

- **So sánh hơn (Comparative)**: So sánh **2** sự vật/người
  - *A is **bigger than** B.* (A lớn hơn B)
- **So sánh nhất (Superlative)**: So sánh **3+** sự vật/người, chọn cái nhất
  - *A is **the biggest**.* (A là lớn nhất)

## 📝 Cấu trúc & Công thức

### Tính từ ngắn (1 âm tiết)
- **So sánh hơn**: adj + **-er** + than
- **So sánh nhất**: the + adj + **-est**
- *fast → faster → the fastest* (nhanh → nhanh hơn → nhanh nhất)
- *tall → taller → the tallest*

Quy tắc chính tả:
- Tính từ tận cùng bằng "e": chỉ thêm "-r"/"-st": *large → larger → the largest*
- Tính từ tận cùng bằng "y": đổi "y" thành "i" + "-er"/"-est": *easy → easier → the easiest*
- Tính từ tận cùng bằng 1 phụ âm + 1 nguyên âm + 1 phụ âm: gấp đôi phụ âm cuối: *big → bigger → the biggest, hot → hotter → the hottest*

### Tính từ dài (2+ âm tiết, đặc biệt tận cùng bằng -y, -ful, -ous, -ive)
- **So sánh hơn**: more + adj + than
- **So sánh nhất**: the most + adj
- *expensive → more expensive → the most expensive*
- *beautiful → more beautiful → the most beautiful*
- *important → more important → the most important*

### Tính từ bất quy tắc (PHẢI HỌC THUỘC)

| Tính từ gốc | So sánh hơn | So sánh nhất |
|---|---|---|
| **good** (tốt) | **better** | **the best** |
| **bad** (xấu) | **worse** | **the worst** |
| **far** (xa) | **farther/further** | **the farthest/furthest** |
| **little** (ít) | **less** | **the least** |
| **many/much** (nhiều) | **more** | **the most** |

## 🔍 Dấu hiệu nhận biết

**So sánh hơn**:
- Có từ **"than"** trong câu
- *A is **bigger than** B.*

**So sánh nhất**:
- Có **"the"** trước tính từ + "-est" / "most"
- *A is **the biggest**.* / *A is **the most expensive**.*

**Các cụm so sánh khác**:
- **as + adj + as**: *A is as big as B.* (A lớn bằng B)
- **not as/so + adj + as**: *A is not as big as B.* (A không lớn bằng B)
- **the same as**: *A is the same as B.* (A giống B)
- **different from**: *A is different from B.* (A khác B)

## 💡 Ví dụ cụ thể

| Câu | Loại | Dịch |
|---|---|---|
| This model is **faster than** the previous one. | So sánh hơn (ngắn) | Mẫu này nhanh hơn mẫu trước |
| It is **the most efficient** on the market. | So sánh nhất (dài) | Nó hiệu quả nhất trên thị trường |
| She is **taller than** her brother. | So sánh hơn (ngắn) | Cô ấy cao hơn em trai |
| This is **the best** restaurant in town. | So sánh nhất (bất quy tắc) | Đây là nhà hàng tốt nhất trong thành phố |
| The weather is **getting colder and colder**. | So sánh kép | Thời tiết đang ngày càng lạnh hơn |
| **The more** you study, **the better** you become. | So sánh kép | Càng học nhiều, bạn càng giỏi |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: So sánh kép (Double comparative)**
- *colder and colder* (ngày càng lạnh)
- *more and more expensive* (ngày càng đắt)
- Cấu trúc: **comparative + and + comparative**

⚠️ **Bẫy 2: "The + comparative, the + comparative"**
- *The sooner, the better.* (Càng sớm càng tốt)
- *The more you practice, the better you become.* (Càng luyện tập nhiều, bạn càng giỏi)
- Cấu trúc: **The + so sánh hơn + S + V, the + so sánh hơn + S + V**

⚠️ **Bẫy 3: Trạng từ bổ nghĩa cho so sánh**
- **much / a lot / far / significantly** + so sánh hơn: *much more expensive, far better*
- **a bit / slightly / a little** + so sánh hơn: *slightly cheaper, a bit taller*
- **by far** + so sánh nhất: *by far the best* (tốt nhất rõ rệt)

⚠️ **Bẫy 4: Đừng thêm "-er" và "more" cùng lúc**
- ❌ Sai: *more faster, more better*
- ✅ Đúng: *faster, better* (vì "fast/better" đã là so sánh hơn rồi)

🎯 **Chiến thuật TOEIC Part 5**:
- Thấy "than" → so sánh hơn (-er hoặc more)
- Thấy "the" + blank → so sánh nhất (-est hoặc most)
- Tính từ 1 âm tiết → -er/-est
- Tính từ 2+ âm tiết → more/most
- Bất quy tắc: good/bad/far → học thuộc!
- Có "much/a lot/far" trước blank → so sánh hơn`,
    },
    {
      id: 'g_modals',
      title: 'Modal Verbs (Động từ khuyết thiếu)',
      slug: 'modal-verbs',
      category: 'modals',
      level: 'intermediate',
      summary: 'can/could/may/might/must/should/would — năng lực, nghĩa vụ, suy luận.',
      example: 'You must submit the form by Friday (bạn phải nộp mẫu trước thứ Sáu - nghĩa vụ). Employees should wear a badge (nhân viên nên đeo thẻ - khuyên).',
      content: `## 📖 Khái niệm

**Động từ khuyết thiếu (Modal verbs)** là các động từ đặc biệt đi kèm động từ chính ở dạng bare (nguyên mẫu không "to"). Chúng thêm ý nghĩa về **năng lực, sự cho phép, nghĩa vụ, khả năng, lời khuyên, suy luận**.

Các modal phổ biến: **can, could, may, might, must, should, would, will, shall, ought to**

## 📝 Cấu trúc & Công thức

**Cấu trúc chung: S + modal + V(bare) (không có "to", không "-s", không "-ing")**
- *You **must submit** the form.* (đúng) — modal + V bare
- ❌ *You must to submit / must submits / must submitting* (sai)

### Phân loại theo chức năng

| Modal | Chức năng | Ví dụ |
|---|---|---|
| **can** | Năng lực hiện tại, xin phép | *I can swim. Can I go now?* |
| **could** | Năng lực quá khứ, xin phép lịch sự | *I could swim when I was 5. Could you help me?* |
| **may** | Xin phép trang trọng, khả năng | *May I leave? It may rain.* |
| **might** | Khả năng ít hơn may | *It might rain tomorrow.* |
| **must** | Nghĩa vụ mạnh, suy luận chắc chắn | *You must wear a seatbelt. He must be tired.* |
| **must not** (mustn't) | Cấm (KHÔNG được) | *You mustn't smoke here.* |
| **have to** | Nghĩa vụ khách quan | *I have to wear a uniform.* |
| **should / ought to** | Lời khuyên, nên | *You should rest. You ought to apologize.* |
| **would** | Giả định, lời đề nghị lịch sự | *I would go if I had time. Would you like tea?* |
| **will** | Tương lai, hứa hẹn | *I will call you.* |

## 🔍 Dấu hiệu nhận biết

**Nghĩa vụ / Cấm:**
- **must** = phải (mạnh, chủ quan): *You must stop!*
- **have to** = phải (khách quan, do luật/quy định): *Employees have to wear ID badges.*
- **must not / mustn't** = CẤM (không được làm): *You mustn't enter.*
- **don't have to** = không phải (không bắt buộc): *You don't have to come.*

**Suy luận (Deduction):**
- **must be** = chắc chắn là: *He has a Ferrari. He **must be** rich.* (Anh ấy chắc giàu)
- **can't be** = không thể là: *He just started. He **can't be** the manager.* (Không thể là)
- **might/may/could be** = có thể là: *She's not here. She **might be** at lunch.*

**Lời khuyên:**
- **should / ought to** = nên: *You should see a doctor.* (Bạn nên đi khám)
- **had better** = tốt nhất là: *You had better hurry.* (Tốt nhất bạn nên khẩn trương)

## 💡 Ví dụ cụ thể

| Câu | Modal | Chức năng | Dịch |
|---|---|---|---|
| You **must** submit the form by Friday. | must | Nghĩa vụ | Bạn phải nộp mẫu trước thứ Sáu |
| Employees **should** wear a badge. | should | Lời khuyên | Nhân viên nên đeo thẻ |
| He **must be** the new manager. | must be | Suy luận chắc chắn | Anh ấy chắc là quản lý mới |
| That **can't be** right. | can't be | Suy luận phủ định | Điều đó không thể đúng được |
| She **might be** at lunch. | might be | Khả năng | Cô ấy có thể đang ăn trưa |
| **Would** you like some coffee? | would | Đề nghị lịch sự | Bạn có muốn cà phê không? |
| You **mustn't** smoke here. | mustn't | Cấm | Bạn không được hút thuốc ở đây |
| You **don't have to** come if you're busy. | don't have to | Không bắt buộc | Bạn không cần đến nếu bận |

## 🎯 Mẹo làm bài TOEIC & Bẫy thường gặp

⚠️ **Bẫy 1: "Must not" ≠ "Don't have to"**
- **must not / mustn't** = CẤM (không được làm): *You mustn't smoke.* (Cấm hút thuốc)
- **don't have to** = KHÔNG PHẢI (không bắt buộc): *You don't have to smoke.* (Bạn không bắt buộc hút)
- Đây là bẫy kinh điển trong TOEIC!

⚠️ **Bẫy 2: Modal luôn đi với V bare (không "to")**
- ✅ *You should **go** now.* (đúng)
- ❌ *You should **to go** now.* (sai - modal không có "to")
- Ngoại lệ: **ought to** (luôn có "to"): *You ought to go.*

⚠️ **Bẫy 3: Modal không thêm "-s" cho số ít**
- ✅ *He **can** swim.* (đúng)
- ❌ *He **cans** swim.* (sai - modal không chia)

⚠️ **Bẫy 4: Modal + have + V3 = dự đoán về quá khứ**
- *He **must have forgotten**.* (Chắc anh ấy đã quên)
- *She **should have called**.* (Cô ấy đáng lẽ nên gọi)
- *They **might have left**.* (Có lẽ họ đã đi rồi)

🎯 **Chiến thuật TOEIC Part 5**:
- Sau modal (can/must/should/would...) → luôn **V bare** (không "to", không "-s", không "-ing")
- Thấy "must" → check nghĩa: nghĩa vụ (phải) hay suy luận (chắc là)
- "Must not" = cấm ≠ "Don't have to" = không phải
- Modal + have + V3 → dự đoán quá khứ
- "Should have + V3" = đáng lẽ nên (nhưng không làm) — hối tiếc`,
    },
  ]
  for (const g of grammar) {
    await db.grammarLesson.upsert({ where: { slug: g.slug }, update: g, create: g })
  }

  // ---------- STRATEGIES ----------
  const strategies: any[] = [
    {
      id: 's_listening_overview',
      title: 'Listening Section Overview',
      slug: 'listening-overview',
      section: 'listening',
      content: `The Listening section has **100 questions** in **about 45 minutes**.
- **Part 1 — Photographs** (6 Q): describe a photo, choose the best statement.
- **Part 2 — Question-Response** (25 Q): hear a question, choose the best reply.
- **Part 3 — Conversations** (39 Q): short talks between 2-3 people.
- **Part 4 — Talks** (30 Q): short monologues (announcements, voicemails).

## Key Strategies
1. **Read ahead** before the audio starts — predict the topic.
2. **Don't get stuck** — if you miss a question, move on.
3. Watch for **distractors**: words from the audio that appear in wrong answers.
4. For Part 2, listen to the **first word** (who/what/where/when/why/how) — it signals the answer type.`,
    },
    {
      id: 's_reading_overview',
      title: 'Reading Section Overview',
      slug: 'reading-overview',
      section: 'reading',
      content: `The Reading section has **100 questions** in **75 minutes**.
- **Part 5 — Incomplete Sentences** (30 Q): choose the word/phrase to fill the blank. ~20 sec each.
- **Part 6 — Text Completion** (16 Q): 4 texts, each with 4 blanks. ~3-4 min per text.
- **Part 7 — Reading Comprehension** (54 Q): single & multiple passages.

## Time Management (75 min)
- Part 5: **10 minutes** (don't exceed!)
- Part 6: **12 minutes**
- Part 7: **50 minutes**

If a Part 5 question takes too long, **guess and move on** — every question is worth 1 point.`,
    },
    {
      id: 's_part5_strategy',
      title: 'Part 5: Grammar Sprint Strategy',
      slug: 'part5-strategy',
      section: 'reading',
      content: `Part 5 tests **grammar and vocabulary** with a single blank.

## Steps
1. Read the whole sentence quickly.
2. Identify what is **missing** (verb tense, preposition, conjunction, word form).
3. Eliminate options that are grammatically impossible.
4. Choose the best remaining answer.

## Common patterns
- Word form: *success / succeed / successful / successfully* — match the part of speech the blank needs.
- Subject-verb agreement: a plural subject needs a plural verb.
- Preposition collocations: *responsible for, interested in, depend on*.

Aim for **20 seconds per question**. Flag hard ones and return only if time remains.`,
    },
    {
      id: 's_part7_strategy',
      title: 'Part 7: Skim & Scan Mastery',
      slug: 'part7-strategy',
      section: 'reading',
      content: `Part 7 rewards **efficient reading**, not slow reading.

## Approach
1. **Read the questions first** — underline key words (names, dates, numbers).
2. **Scan** the passage for those key words.
3. Answer **detail** questions directly from the text.
4. For **main idea / inference / purpose** questions, check the first and last lines.

## Question types
- **Main idea**: What is the purpose of the email?
- **Detail**: According to the notice, what time does...?
- **Inference**: What is implied about...?
- **Vocabulary**: The word "X" in paragraph 2 is closest in meaning to...
- **Not/Except**: Which is NOT mentioned?

Never spend more than 2 minutes on a single-passage question set.`,
    },
    {
      id: 's_test_day',
      title: 'Test-Day Checklist',
      slug: 'test-day-checklist',
      section: 'test-day',
      content: `## Before the test
- Sleep 7-8 hours; avoid cramming the night before.
- Bring valid **photo ID** and pencils/eraser as required.
- Arrive **30 minutes early**.

## During the test
- You **cannot** go back to the Listening section once it ends.
- In Reading, manage your own time — the proctor only announces the end.
- **Guess every question** — there is no penalty for wrong answers.
- Mark answers carefully; check you're on the right line.

## Scoring
- Listening: 5-495, Reading: 5-495, Total: **10-990**.
- Most employers look for **600+**; many international roles want **750+**.`,
    },
    {
      id: 's_distractors',
      title: 'Spotting Distractors in Listening',
      slug: 'distractors-listening',
      section: 'listening',
      content: `A **distractor** is a wrong option that uses words from the audio to trick you.

## Classic traps
- A word from the audio appears, but in the **wrong context**.
- A **homonym** or similar-sounding word is used.
- A true fact is stated, but it **doesn't answer the question**.
- Numbers/dates are **reversed** or off by one.

## Defense
1. Listen for the **full idea**, not individual words.
2. After hearing the answer, wait — the speaker may **correct** themselves.
3. Use elimination: remove answers that contradict the audio.`,
    },
  ]
  for (const s of strategies) {
    await db.strategy.upsert({ where: { slug: s.slug }, update: s, create: s })
  }

  // ---------- QUESTIONS ----------
  const Q = (data: any) => ({
    id: data.id,
    part: data.part,
    groupId: data.groupId || null,
    passage: data.passage || null,
    audioScript: data.audioScript || null,
    imagePrompt: data.imagePrompt || null,
    question: data.question,
    options: JSON.stringify(data.options),
    answer: data.answer,
    explanation: data.explanation || null,
    difficulty: data.difficulty || 2,
    category: data.category || null,
  })

  const questions: any[] = [
    // ===== PART 2 — Question-Response =====
    Q({ id: 'q_p2_1', part: 2, audioScript: 'When does the conference begin?', question: 'Audio: "When does the conference begin?"', options: ['In the main hall.', "At nine o'clock.", 'Yes, I went there.', 'For three days.'], answer: 1, category: 'when', explanation: 'The question asks about time (When). Only "At nine o\'clock" answers a time question.' }),
    Q({ id: 'q_p2_2', part: 2, audioScript: 'Who is going to lead the presentation?', question: 'Audio: "Who is going to lead the presentation?"', options: ['Ms. Tanaka will.', 'In the meeting room.', 'Yes, it was good.', 'Next Monday.'], answer: 0, category: 'who', explanation: '"Who" asks for a person. Only "Ms. Tanaka will" identifies a person.' }),
    Q({ id: 'q_p2_3', part: 2, audioScript: 'Where can I pick up my badge?', question: 'Audio: "Where can I pick up my badge?"', options: ['A blue one.', 'At the registration desk.', 'Yes, please.', 'Tomorrow morning.'], answer: 1, category: 'where', explanation: '"Where" asks for a location. "At the registration desk" gives a place.' }),
    Q({ id: 'q_p2_4', part: 2, audioScript: 'How long does the flight take?', question: 'Audio: "How long does the flight take?"', options: ['About two hours.', 'To Singapore.', 'By plane.', 'Next week.'], answer: 0, category: 'how-long', explanation: '"How long" asks for duration. "About two hours" gives a length of time.' }),
    Q({ id: 'q_p2_5', part: 2, audioScript: 'Why was the meeting postponed?', question: 'Audio: "Why was the meeting postponed?"', options: ['At 3 p.m.', 'Because the client was unavailable.', 'In room 4.', 'Yes, I think so.'], answer: 1, category: 'why', explanation: '"Why" asks for a reason. "Because..." provides the cause.' }),
    Q({ id: 'q_p2_6', part: 2, audioScript: 'Would you like me to send the report now?', question: 'Audio: "Would you like me to send the report now?"', options: ['Yes, please do.', 'Last Tuesday.', 'By email.', 'The finance report.'], answer: 0, category: 'offer', explanation: 'This is an offer. "Yes, please do" accepts it politely.' }),
    Q({ id: 'q_p2_7', part: 2, audioScript: 'Which folder is the contract in?', question: 'Audio: "Which folder is the contract in?"', options: ["It's in the red one.", "No, it isn't.", 'Signed yesterday.', 'Three copies.'], answer: 0, category: 'which', explanation: '"Which" asks for a choice among items. "It\'s in the red one" selects one.' }),
    Q({ id: 'q_p2_8', part: 2, audioScript: 'What time does the bank open?', question: 'Audio: "What time does the bank open?"', options: ['On Main Street.', "At 9 a.m.", "Yes, it's open.", 'For customers.'], answer: 1, category: 'when', explanation: '"What time" asks for a clock time. "At 9 a.m." gives the time.' }),

    // ===== PART 5 — Incomplete Sentences =====
    Q({ id: 'q_p5_1', part: 5, question: 'The new software ____ last week has improved our efficiency.', options: ['installed', 'was installed', 'installing', 'install'], answer: 1, category: 'passive', explanation: 'The software received the action, so passive "was installed" is correct. Time marker "last week" = past.' }),
    Q({ id: 'q_p5_2', part: 5, question: 'All employees must ____ the safety regulations at all times.', options: ['comply', 'compliant', 'compliance', 'complying'], answer: 0, category: 'word-form', explanation: 'After modal "must" we use the base form of the verb: "comply".' }),
    Q({ id: 'q_p5_3', part: 5, question: 'The conference room is ____ the third floor.', options: ['in', 'on', 'at', 'by'], answer: 1, category: 'preposition', explanation: 'We use "on" for floors of a building: on the third floor.' }),
    Q({ id: 'q_p5_4', part: 5, question: 'Ms. Chen has worked for the company ____ 2015.', options: ['for', 'since', 'from', 'in'], answer: 1, category: 'preposition', explanation: 'With a specific starting point (2015), use "since" with the present perfect.' }),
    Q({ id: 'q_p5_5', part: 5, question: 'The marketing team ____ a new campaign next month.', options: ['launch', 'will launch', 'launched', 'launching'], answer: 1, category: 'tense', explanation: '"Next month" signals future, so "will launch" is correct.' }),
    Q({ id: 'q_p5_6', part: 5, question: 'Please submit your expense report ____ Friday at the latest.', options: ['by', 'in', 'on', 'at'], answer: 0, category: 'preposition', explanation: '"By" indicates a deadline: by Friday = no later than Friday.' }),
    Q({ id: 'q_p5_7', part: 5, question: 'The report was ____ prepared by the junior analyst.', options: ['careful', 'carefully', 'care', 'careless'], answer: 1, category: 'word-form', explanation: 'We need an adverb to modify the verb "prepared". "Carefully" is the adverb.' }),
    Q({ id: 'q_p5_8', part: 5, question: '____ the deadline was tight, the team finished the project on time.', options: ['Although', 'Because', 'Despite', 'However'], answer: 0, category: 'conjunction', explanation: 'Two clauses with a contrast relationship. "Despite" would need a noun, not a clause.' }),
    Q({ id: 'q_p5_9', part: 5, question: 'Sales have increased ____ for three consecutive quarters.', options: ['steady', 'steadily', 'steadiness', 'steadied'], answer: 1, category: 'word-form', explanation: 'Adverb "steadily" modifies the verb "increased".' }),
    Q({ id: 'q_p5_10', part: 5, question: 'The candidate ____ resume impressed the panel was hired immediately.', options: ['who', 'which', 'whose', 'that'], answer: 2, category: 'relative', explanation: '"whose" shows possession: the resume belonged to the candidate.' }),
    Q({ id: 'q_p5_11', part: 5, question: 'If I ____ the manager, I would approve the budget.', options: ['am', 'was', 'were', 'be'], answer: 2, category: 'conditional', explanation: 'Second conditional uses "were" for all subjects in the if-clause.' }),
    Q({ id: 'q_p5_12', part: 5, question: 'The package is scheduled to arrive ____ Tuesday morning.', options: ['in', 'on', 'at', 'to'], answer: 1, category: 'preposition', explanation: 'Use "on" with days: on Tuesday morning.' }),
    Q({ id: 'q_p5_13', part: 5, question: 'Customers who ____ in the loyalty program receive extra discounts.', options: ['enroll', 'enrolls', 'enrolling', 'enrolled'], answer: 0, category: 'verb-form', explanation: 'The relative clause subject is "who" (plural "customers"), so base verb "enroll" matches present simple.' }),
    Q({ id: 'q_p5_14', part: 5, question: 'This model is ____ than the one we tested last year.', options: ['efficient', 'more efficient', 'most efficient', 'efficiently'], answer: 1, category: 'comparison', explanation: 'Comparing two items with "than" → comparative "more efficient".' }),
    Q({ id: 'q_p5_15', part: 5, question: 'The meeting ____ when the fire alarm rang.', options: ['has started', 'started', 'had started', 'starts'], answer: 2, category: 'tense', explanation: 'The meeting started before the alarm rang (past of past) → past perfect "had started".' }),
    Q({ id: 'q_p5_16', part: 5, question: 'Please make sure all documents ____ signed before submission.', options: ['is', 'are', 'was', 'be'], answer: 1, category: 'subject-verb', explanation: 'Plural subject "documents" + passive → "are signed".' }),
    Q({ id: 'q_p5_17', part: 5, question: 'The trainer suggested ____ notes during the demonstration.', options: ['take', 'to take', 'taking', 'took'], answer: 2, category: 'gerund', explanation: 'After "suggest" we use a gerund: "taking".' }),
    Q({ id: 'q_p5_18', part: 5, question: '____ the high cost, the company decided to proceed with the project.', options: ['Although', 'Even though', 'Despite', 'Because'], answer: 2, category: 'conjunction', explanation: '"Despite" + noun phrase ("the high cost"). "Although/Even though" need a full clause.' }),
    Q({ id: 'q_p5_19', part: 5, question: 'The invoice indicates that payment ____ within thirty days.', options: ['is due', 'due', 'being due', 'dues'], answer: 0, category: 'verb-form', explanation: 'A finite verb is needed: "is due".' }),
    Q({ id: 'q_p5_20', part: 5, question: 'Our office, ____ is located downtown, will relocate next year.', options: ['that', 'which', 'who', 'whose'], answer: 1, category: 'relative', explanation: 'Non-defining relative clause (with commas) about a place → "which", never "that".' }),
    Q({ id: 'q_p5_21', part: 5, question: 'The applicant was ____ for the position because of her experience.', options: ['select', 'selecting', 'selected', 'selection'], answer: 2, category: 'passive', explanation: 'Passive construction "was selected" (she received the action).' }),
    Q({ id: 'q_p5_22', part: 5, question: 'You ____ bring your ID; it is required for entry.', options: ['can', 'must', 'would', 'could'], answer: 1, category: 'modal', explanation: 'Required obligation → "must".' }),
    Q({ id: 'q_p5_23', part: 5, question: 'The CEO will address the staff ____ the auditorium at noon.', options: ['in', 'on', 'at', 'by'], answer: 0, category: 'preposition', explanation: 'Use "in" for an enclosed space like an auditorium.' }),
    Q({ id: 'q_p5_24', part: 5, question: 'Neither the manager nor the employees ____ aware of the change.', options: ['was', 'were', 'is', 'has been'], answer: 1, category: 'subject-verb', explanation: 'With "neither...nor", the verb agrees with the nearer subject ("employees" → plural "were").' }),
    Q({ id: 'q_p5_25', part: 5, question: 'The new policy will take ____ on January 1st.', options: ['affect', 'effect', 'effective', 'effectively'], answer: 1, category: 'word-form', explanation: '"take effect" is the fixed phrase meaning "become active".' }),
    Q({ id: 'q_p5_26', part: 5, question: 'The factory produces ____ twice as many units as it did five years ago.', options: ['approximate', 'approximately', 'approximating', 'approximation'], answer: 1, category: 'word-form', explanation: 'Adverb "approximately" modifies the quantity.' }),
    Q({ id: 'q_p5_27', part: 5, question: 'We appreciate ____ the opportunity to work with your team.', options: ['have', 'having', 'to have', 'had'], answer: 1, category: 'gerund', explanation: 'After "appreciate" we use a gerund: "having".' }),
    Q({ id: 'q_p5_28', part: 5, question: 'The presentation was ____ informative ____ engaging.', options: ['both / and', 'neither / or', 'either / and', 'not / but'], answer: 0, category: 'correlative', explanation: '"both...and" connects two positive qualities.' }),
    Q({ id: 'q_p5_29', part: 5, question: 'By the time you receive this letter, I ____ to Singapore.', options: ['will move', 'will have moved', 'move', 'moved'], answer: 1, category: 'tense', explanation: 'Future perfect "will have moved" for an action completed before a future time.' }),
    Q({ id: 'q_p5_30', part: 5, question: 'The committee is composed ____ five members from each department.', options: ['of', 'from', 'by', 'with'], answer: 0, category: 'collocation', explanation: '"composed of" is the correct collocation.' }),

    // ===== PART 6 — Text Completion =====
    Q({ id: 'q_p6_1', part: 6, groupId: 'g_email_conf', passage: 'To: All Staff\nFrom: Helen Park, Events Coordinator\nSubject: Annual Conference\n\nDear Colleagues,\n\nI am pleased to announce that our annual conference will take place on March 15 at the Grand Hotel. This year, we are expecting over 200 participants, so early registration is strongly (31) ____. Please sign up through the company portal by February 28.\n\nThe program will (32) ____ keynote speeches, panel discussions, and a networking dinner. A detailed agenda will be circulated next week. If you would like to (33) ____ a presentation, please submit your proposal to me by February 10.\n\nI look forward to seeing you all there.\n\nBest regards,\nHelen Park', question: '(31) ____', options: ['recommend', 'recommending', 'recommended', 'recommendation'], answer: 2, category: 'passive', explanation: 'Passive "is strongly recommended" — registration is being recommended.' }),
    Q({ id: 'q_p6_2', part: 6, groupId: 'g_email_conf', passage: 'To: All Staff\nFrom: Helen Park, Events Coordinator\nSubject: Annual Conference\n\nDear Colleagues,\n\nI am pleased to announce that our annual conference will take place on March 15 at the Grand Hotel. This year, we are expecting over 200 participants, so early registration is strongly (31) ____. Please sign up through the company portal by February 28.\n\nThe program will (32) ____ keynote speeches, panel discussions, and a networking dinner. A detailed agenda will be circulated next week. If you would like to (33) ____ a presentation, please submit your proposal to me by February 10.\n\nI look forward to seeing you all there.\n\nBest regards,\nHelen Park', question: '(32) ____', options: ['include', 'includes', 'included', 'including'], answer: 0, category: 'verb-form', explanation: 'After modal "will" use the base form "include".' }),
    Q({ id: 'q_p6_3', part: 6, groupId: 'g_email_conf', passage: 'To: All Staff\nFrom: Helen Park, Events Coordinator\nSubject: Annual Conference\n\nDear Colleagues,\n\nI am pleased to announce that our annual conference will take place on March 15 at the Grand Hotel. This year, we are expecting over 200 participants, so early registration is strongly (31) ____. Please sign up through the company portal by February 28.\n\nThe program will (32) ____ keynote speeches, panel discussions, and a networking dinner. A detailed agenda will be circulated next week. If you would like to (33) ____ a presentation, please submit your proposal to me by February 10.\n\nI look forward to seeing you all there.\n\nBest regards,\nHelen Park', question: '(33) ____', options: ['give', 'giving', 'gave', 'given'], answer: 0, category: 'verb-form', explanation: 'After "to" (infinitive) use the base form "give".' }),
    Q({ id: 'q_p6_4', part: 6, groupId: 'g_email_conf', passage: 'To: All Staff\nFrom: Helen Park, Events Coordinator\nSubject: Annual Conference\n\nDear Colleagues,\n\nI am pleased to announce that our annual conference will take place on March 15 at the Grand Hotel. This year, we are expecting over 200 participants, so early registration is strongly (31) ____. Please sign up through the company portal by February 28.\n\nThe program will (32) ____ keynote speeches, panel discussions, and a networking dinner. A detailed agenda will be circulated next week. If you would like to (33) ____ a presentation, please submit your proposal to me by February 10.\n\nI look forward to seeing you all there.\n\nBest regards,\nHelen Park', question: 'What is the main purpose of the email?', options: ['To announce a conference and request registration', 'To cancel an event', 'To request a refund', "To review last year's agenda"], answer: 0, category: 'main-idea', explanation: 'The email announces the conference and asks staff to register early.' }),
    Q({ id: 'q_p6_5', part: 6, groupId: 'g_notice', passage: 'NOTICE TO ALL TENANTS\n\nPlease be advised that the building\'s HVAC system will undergo maintenance from November 20 to November 22. During this period, the air conditioning (34) ____ be unavailable on floors 5 through 8.\n\nTenants on the affected floors are (35) ____ to work from home if possible. The cafeteria will remain open, and meeting rooms on the lower floors can be reserved (36) ____ advance at the reception desk.\n\nWe apologize for any inconvenience and appreciate your cooperation.\n\nFacilities Management', question: '(34) ____', options: ['will', 'is', 'has', 'was'], answer: 0, category: 'modal', explanation: 'Future scheduled event → "will be unavailable".' }),
    Q({ id: 'q_p6_6', part: 6, groupId: 'g_notice', passage: 'NOTICE TO ALL TENANTS\n\nPlease be advised that the building\'s HVAC system will undergo maintenance from November 20 to November 22. During this period, the air conditioning (34) ____ be unavailable on floors 5 through 8.\n\nTenants on the affected floors are (35) ____ to work from home if possible. The cafeteria will remain open, and meeting rooms on the lower floors can be reserved (36) ____ advance at the reception desk.\n\nWe apologize for any inconvenience and appreciate your cooperation.\n\nFacilities Management', question: '(35) ____', options: ['encourage', 'encouraging', 'encouraged', 'encouragement'], answer: 2, category: 'passive', explanation: 'Passive "are encouraged" — tenants are being encouraged.' }),
    Q({ id: 'q_p6_7', part: 6, groupId: 'g_notice', passage: 'NOTICE TO ALL TENANTS\n\nPlease be advised that the building\'s HVAC system will undergo maintenance from November 20 to November 22. During this period, the air conditioning (34) ____ be unavailable on floors 5 through 8.\n\nTenants on the affected floors are (35) ____ to work from home if possible. The cafeteria will remain open, and meeting rooms on the lower floors can be reserved (36) ____ advance at the reception desk.\n\nWe apologize for any inconvenience and appreciate your cooperation.\n\nFacilities Management', question: '(36) ____', options: ['in', 'on', 'at', 'by'], answer: 0, category: 'preposition', explanation: '"in advance" is the correct fixed phrase.' }),
    Q({ id: 'q_p6_8', part: 6, groupId: 'g_notice', passage: 'NOTICE TO ALL TENANTS\n\nPlease be advised that the building\'s HVAC system will undergo maintenance from November 20 to November 22. During this period, the air conditioning (34) ____ be unavailable on floors 5 through 8.\n\nTenants on the affected floors are (35) ____ to work from home if possible. The cafeteria will remain open, and meeting rooms on the lower floors can be reserved (36) ____ advance at the reception desk.\n\nWe apologize for any inconvenience and appreciate your cooperation.\n\nFacilities Management', question: 'Which floors are affected by the maintenance?', options: ['Floors 1-4', 'Floors 5-8', 'All floors', 'The cafeteria only'], answer: 1, category: 'detail', explanation: 'The notice states floors 5 through 8 are affected.' }),

    // ===== PART 7 — Reading Comprehension =====
    Q({ id: 'q_p7_1', part: 7, groupId: 'g_ad', passage: 'GRAND OPENING — Brew & Bean Café\n\nJoin us this Saturday for the grand opening of Brew & Bean Café, located at 42 Market Street! From 7 a.m. to 9 p.m., enjoy 50% off all hot beverages and a free pastry with every coffee purchase.\n\nThe first 50 customers will receive a loyalty card loaded with five complimentary drinks. Live acoustic music begins at 6 p.m.\n\nBrew & Bean Café — where every cup tells a story.', question: 'What is being advertised?', options: ['A job opening', 'A café opening', 'A music concert', 'A loyalty program'], answer: 1, category: 'main-idea', explanation: 'The text announces the grand opening of Brew & Bean Café.' }),
    Q({ id: 'q_p7_2', part: 7, groupId: 'g_ad', passage: 'GRAND OPENING — Brew & Bean Café\n\nJoin us this Saturday for the grand opening of Brew & Bean Café, located at 42 Market Street! From 7 a.m. to 9 p.m., enjoy 50% off all hot beverages and a free pastry with every coffee purchase.\n\nThe first 50 customers will receive a loyalty card loaded with five complimentary drinks. Live acoustic music begins at 6 p.m.\n\nBrew & Bean Café — where every cup tells a story.', question: 'What do the first 50 customers receive?', options: ['A free meal', 'A loyalty card with five free drinks', 'A 50% discount for life', 'A concert ticket'], answer: 1, category: 'detail', explanation: 'The text says the first 50 customers get a loyalty card with five complimentary drinks.' }),
    Q({ id: 'q_p7_3', part: 7, groupId: 'g_ad', passage: 'GRAND OPENING — Brew & Bean Café\n\nJoin us this Saturday for the grand opening of Brew & Bean Café, located at 42 Market Street! From 7 a.m. to 9 p.m., enjoy 50% off all hot beverages and a free pastry with every coffee purchase.\n\nThe first 50 customers will receive a loyalty card loaded with five complimentary drinks. Live acoustic music begins at 6 p.m.\n\nBrew & Bean Café — where every cup tells a story.', question: 'When does the live music start?', options: ['7 a.m.', '9 p.m.', '6 p.m.', 'Noon'], answer: 2, category: 'detail', explanation: 'The ad states "Live acoustic music begins at 6 p.m."' }),
    Q({ id: 'q_p7_4', part: 7, groupId: 'g_email2', passage: 'To: Daniel Romero\nFrom: Maria Gomez\nSubject: Your Order #4471\n\nDear Mr. Romero,\n\nThank you for your recent purchase from OfficePlus. Your order #4471, containing two ergonomic chairs and a desk lamp, has been processed and is scheduled for delivery on Thursday, May 12, between 10 a.m. and 2 p.m.\n\nPlease ensure someone is available to receive the delivery. If you need to reschedule, contact our customer service at least 24 hours in advance at 1-800-555-0143.\n\nShould you have any questions, reply to this email.\n\nBest regards,\nMaria Gomez\nCustomer Service, OfficePlus', question: 'What is the purpose of the email?', options: ['To confirm a delivery schedule', 'To advertise a product', 'To request a refund', 'To cancel an order'], answer: 0, category: 'main-idea', explanation: 'The email confirms the order and gives the delivery date/time.' }),
    Q({ id: 'q_p7_5', part: 7, groupId: 'g_email2', passage: 'To: Daniel Romero\nFrom: Maria Gomez\nSubject: Your Order #4471\n\nDear Mr. Romero,\n\nThank you for your recent purchase from OfficePlus. Your order #4471, containing two ergonomic chairs and a desk lamp, has been processed and is scheduled for delivery on Thursday, May 12, between 10 a.m. and 2 p.m.\n\nPlease ensure someone is available to receive the delivery. If you need to reschedule, contact our customer service at least 24 hours in advance at 1-800-555-0143.\n\nShould you have any questions, reply to this email.\n\nBest regards,\nMaria Gomez\nCustomer Service, OfficePlus', question: 'What should Mr. Romero do to reschedule?', options: ['Reply to the email', 'Call at least 24 hours in advance', 'Wait for the delivery person', 'Visit the store'], answer: 1, category: 'detail', explanation: 'The email says to contact customer service at least 24 hours in advance to reschedule.' }),
    Q({ id: 'q_p7_6', part: 7, groupId: 'g_email2', passage: 'To: Daniel Romero\nFrom: Maria Gomez\nSubject: Your Order #4471\n\nDear Mr. Romero,\n\nThank you for your recent purchase from OfficePlus. Your order #4471, containing two ergonomic chairs and a desk lamp, has been processed and is scheduled for delivery on Thursday, May 12, between 10 a.m. and 2 p.m.\n\nPlease ensure someone is available to receive the delivery. If you need to reschedule, contact our customer service at least 24 hours in advance at 1-800-555-0143.\n\nShould you have any questions, reply to this email.\n\nBest regards,\nMaria Gomez\nCustomer Service, OfficePlus', question: 'How many items were ordered?', options: ['One', 'Two', 'Three', 'Four'], answer: 2, category: 'detail', explanation: 'Two chairs + one desk lamp = three items.' }),
    Q({ id: 'q_p7_7', part: 7, groupId: 'g_double', passage: 'Email 1:\nTo: All Employees\nFrom: HR Department\nSubject: Wellness Program\n\nStarting next month, the company will launch a wellness program offering free yoga classes every Tuesday and Thursday at 6 p.m. in the gym. Participation is voluntary, but those who attend at least 80% of sessions will receive a $100 health stipend.\n\n— HR Team\n\n---\n\nEmail 2:\nTo: HR Department\nFrom: James Lee\nSubject: Re: Wellness Program\n\nThank you for the announcement. I would love to join, but I have a recurring client meeting on Thursdays at 6 p.m. Could the Thursday session be moved to Wednesday? I believe several colleagues have the same conflict. I\'d be happy to attend the Tuesday sessions in the meantime.\n\nBest,\nJames Lee', question: 'What is the main topic of both emails?', options: ['A new product launch', 'A company wellness program', 'A client meeting schedule', 'A salary increase'], answer: 1, category: 'main-idea', explanation: 'Both emails discuss the wellness program (yoga classes).' }),
    Q({ id: 'q_p7_8', part: 7, groupId: 'g_double', passage: 'Email 1:\nTo: All Employees\nFrom: HR Department\nSubject: Wellness Program\n\nStarting next month, the company will launch a wellness program offering free yoga classes every Tuesday and Thursday at 6 p.m. in the gym. Participation is voluntary, but those who attend at least 80% of sessions will receive a $100 health stipend.\n\n— HR Team\n\n---\n\nEmail 2:\nTo: HR Department\nFrom: James Lee\nSubject: Re: Wellness Program\n\nThank you for the announcement. I would love to join, but I have a recurring client meeting on Thursdays at 6 p.m. Could the Thursday session be moved to Wednesday? I believe several colleagues have the same conflict. I\'d be happy to attend the Tuesday sessions in the meantime.\n\nBest,\nJames Lee', question: 'What does James Lee request?', options: ['A refund of the stipend', 'To move the Thursday session to Wednesday', 'To cancel the program', 'A different instructor'], answer: 1, category: 'detail', explanation: 'James asks if the Thursday session could be moved to Wednesday.' }),
    Q({ id: 'q_p7_9', part: 7, groupId: 'g_double', passage: 'Email 1:\nTo: All Employees\nFrom: HR Department\nSubject: Wellness Program\n\nStarting next month, the company will launch a wellness program offering free yoga classes every Tuesday and Thursday at 6 p.m. in the gym. Participation is voluntary, but those who attend at least 80% of sessions will receive a $100 health stipend.\n\n— HR Team\n\n---\n\nEmail 2:\nTo: HR Department\nFrom: James Lee\nSubject: Re: Wellness Program\n\nThank you for the announcement. I would love to join, but I have a recurring client meeting on Thursdays at 6 p.m. Could the Thursday session be moved to Wednesday? I believe several colleagues have the same conflict. I\'d be happy to attend the Tuesday sessions in the meantime.\n\nBest,\nJames Lee', question: 'What can be inferred about James Lee?', options: ['He dislikes yoga.', 'He wants to attend but has a schedule conflict.', 'He already received the stipend.', 'He works in the HR department.'], answer: 1, category: 'inference', explanation: 'James says he "would love to join" but has a recurring meeting conflict — he wants to attend but cannot on Thursdays.' }),
    Q({ id: 'q_p7_10', part: 7, groupId: 'g_article', passage: 'The Rise of Remote Work\n\nOver the past decade, remote work has transformed from a rare perk into a mainstream practice. Advances in cloud computing, video conferencing, and project management software have made it possible for entire teams to collaborate without sharing a physical office.\n\nStudies suggest that remote employees often report higher productivity and job satisfaction. However, challenges remain. Some workers struggle with isolation, while others find it difficult to separate work from personal life. Companies have responded by offering virtual social events and encouraging employees to maintain set working hours.\n\nExperts predict that hybrid models — combining office and remote days — will become the norm, offering flexibility while preserving teamwork.', question: 'What is the main idea of the article?', options: ['Remote work has become common and brings both benefits and challenges', 'Remote work is declining', 'Office work is more productive', 'Cloud computing is expensive'], answer: 0, category: 'main-idea', explanation: 'The article explains the growth of remote work and its pros and cons.' }),
    Q({ id: 'q_p7_11', part: 7, groupId: 'g_article', passage: 'The Rise of Remote Work\n\nOver the past decade, remote work has transformed from a rare perk into a mainstream practice. Advances in cloud computing, video conferencing, and project management software have made it possible for entire teams to collaborate without sharing a physical office.\n\nStudies suggest that remote employees often report higher productivity and job satisfaction. However, challenges remain. Some workers struggle with isolation, while others find it difficult to separate work from personal life. Companies have responded by offering virtual social events and encouraging employees to maintain set working hours.\n\nExperts predict that hybrid models — combining office and remote days — will become the norm, offering flexibility while preserving teamwork.', question: 'According to the article, what is one challenge of remote work?', options: ['Higher costs for employees', 'Difficulty separating work from personal life', 'Lack of software tools', 'Lower salaries'], answer: 1, category: 'detail', explanation: 'The article mentions workers "find it difficult to separate work from personal life".' }),
    Q({ id: 'q_p7_12', part: 7, groupId: 'g_article', passage: 'The Rise of Remote Work\n\nOver the past decade, remote work has transformed from a rare perk into a mainstream practice. Advances in cloud computing, video conferencing, and project management software have made it possible for entire teams to collaborate without sharing a physical office.\n\nStudies suggest that remote employees often report higher productivity and job satisfaction. However, challenges remain. Some workers struggle with isolation, while others find it difficult to separate work from personal life. Companies have responded by offering virtual social events and encouraging employees to maintain set working hours.\n\nExperts predict that hybrid models — combining office and remote days — will become the norm, offering flexibility while preserving teamwork.', question: 'What do experts predict about the future of work?', options: ['Everyone will work fully remotely', 'Hybrid models will become the norm', 'Offices will disappear', 'Productivity will drop'], answer: 1, category: 'detail', explanation: 'The last paragraph says experts predict hybrid models will become the norm.' }),
    Q({ id: 'q_p7_13', part: 7, groupId: 'g_sched', passage: 'TRAINING SCHEDULE — Customer Service Team\nWeek of June 3\n\nMonday, June 3     9:00-11:00   Product Knowledge Workshop (Room A)\nTuesday, June 4    10:00-12:00  Conflict Resolution (Room B)\nWednesday, June 5  1:00-3:00    Software Tools Demo (Lab 2)\nThursday, June 6   2:00-4:00    Team Building Activity (Lounge)\nFriday, June 7     9:00-10:00   Q&A with Management (Room A)\n\nAttendance is mandatory for all sessions. Bring your employee badge.', question: 'Where does the Software Tools Demo take place?', options: ['Room A', 'Room B', 'Lab 2', 'The Lounge'], answer: 2, category: 'detail', explanation: 'Wednesday\'s Software Tools Demo is in Lab 2.' }),
    Q({ id: 'q_p7_14', part: 7, groupId: 'g_sched', passage: 'TRAINING SCHEDULE — Customer Service Team\nWeek of June 3\n\nMonday, June 3     9:00-11:00   Product Knowledge Workshop (Room A)\nTuesday, June 4    10:00-12:00  Conflict Resolution (Room B)\nWednesday, June 5  1:00-3:00    Software Tools Demo (Lab 2)\nThursday, June 6   2:00-4:00    Team Building Activity (Lounge)\nFriday, June 7     9:00-10:00   Q&A with Management (Room A)\n\nAttendance is mandatory for all sessions. Bring your employee badge.', question: 'How long is the Q&A session?', options: ['One hour', 'Two hours', 'Three hours', 'Four hours'], answer: 0, category: 'detail', explanation: 'Friday Q&A is 9:00-10:00, which is one hour.' }),
    Q({ id: 'q_p7_15', part: 7, groupId: 'g_sched', passage: 'TRAINING SCHEDULE — Customer Service Team\nWeek of June 3\n\nMonday, June 3     9:00-11:00   Product Knowledge Workshop (Room A)\nTuesday, June 4    10:00-12:00  Conflict Resolution (Room B)\nWednesday, June 5  1:00-3:00    Software Tools Demo (Lab 2)\nThursday, June 6   2:00-4:00    Team Building Activity (Lounge)\nFriday, June 7     9:00-10:00   Q&A with Management (Room A)\n\nAttendance is mandatory for all sessions. Bring your employee badge.', question: 'What is required of attendees?', options: ['To bring a laptop', 'To bring an employee badge', 'To pay a fee', 'To register online'], answer: 1, category: 'detail', explanation: 'The notice says "Bring your employee badge".' }),
  ]

  for (const q of questions) {
    await db.question.upsert({ where: { id: q.id }, update: q, create: q })
  }

  // ---------- TEST SETS ----------
  const testSets: any[] = [
    {
      id: 'ts_part5_mini',
      title: 'Part 5 Mini Test — Grammar & Vocabulary',
      description: '15 incomplete-sentence questions covering tenses, prepositions, word form and more. ~10 minutes.',
      durationMin: 10,
      type: 'part5',
      questionIds: JSON.stringify(['q_p5_1','q_p5_2','q_p5_3','q_p5_4','q_p5_5','q_p5_6','q_p5_7','q_p5_8','q_p5_9','q_p5_10','q_p5_11','q_p5_12','q_p5_13','q_p5_14','q_p5_15']),
    },
    {
      id: 'ts_part5_set2',
      title: 'Part 5 Set 2 — Advanced Grammar',
      description: '15 harder incomplete-sentence questions. ~10 minutes.',
      durationMin: 10,
      type: 'part5',
      questionIds: JSON.stringify(['q_p5_16','q_p5_17','q_p5_18','q_p5_19','q_p5_20','q_p5_21','q_p5_22','q_p5_23','q_p5_24','q_p5_25','q_p5_26','q_p5_27','q_p5_28','q_p5_29','q_p5_30']),
    },
    {
      id: 'ts_part2_listening',
      title: 'Part 2 Listening — Question & Response',
      description: '8 question-response items. The browser will read each question aloud — choose the best reply. ~8 minutes.',
      durationMin: 8,
      type: 'listening',
      questionIds: JSON.stringify(['q_p2_1','q_p2_2','q_p2_3','q_p2_4','q_p2_5','q_p2_6','q_p2_7','q_p2_8']),
    },
    {
      id: 'ts_part6',
      title: 'Part 6 — Text Completion',
      description: 'Two passages with fill-in-the-blank and comprehension questions. ~8 minutes.',
      durationMin: 8,
      type: 'part6',
      questionIds: JSON.stringify(['q_p6_1','q_p6_2','q_p6_3','q_p6_4','q_p6_5','q_p6_6','q_p6_7','q_p6_8']),
    },
    {
      id: 'ts_part7',
      title: 'Part 7 — Reading Comprehension',
      description: 'Advertisements, emails, articles and schedules with comprehension questions. ~15 minutes.',
      durationMin: 15,
      type: 'part7',
      questionIds: JSON.stringify(['q_p7_1','q_p7_2','q_p7_3','q_p7_4','q_p7_5','q_p7_6','q_p7_7','q_p7_8','q_p7_9','q_p7_10','q_p7_11','q_p7_12','q_p7_13','q_p7_14','q_p7_15']),
    },
    {
      id: 'ts_full_mini',
      title: 'Mini TOEIC Mock Test (40 questions)',
      description: 'A balanced mock covering Parts 2, 5, 6 & 7. Estimated scaled score provided at the end. ~40 minutes.',
      durationMin: 40,
      type: 'full',
      questionIds: JSON.stringify(['q_p2_1','q_p2_2','q_p2_3','q_p2_4','q_p2_5','q_p2_6','q_p2_7','q_p2_8','q_p5_1','q_p5_2','q_p5_3','q_p5_4','q_p5_5','q_p5_6','q_p5_7','q_p5_8','q_p5_9','q_p5_10','q_p5_11','q_p5_12','q_p5_13','q_p5_14','q_p5_15','q_p6_1','q_p6_2','q_p6_3','q_p6_4','q_p6_5','q_p6_6','q_p6_7','q_p6_8','q_p7_1','q_p7_2','q_p7_3','q_p7_4','q_p7_5','q_p7_6','q_p7_7','q_p7_8','q_p7_9']),
    },
    {
      id: 'ts_exam_simulation',
      title: '🎯 TOEIC Exam Simulation — Thi Thật (61 câu · 120 phút)',
      description: 'Mô phỏng phòng thi TOEIC thật: KHÔNG xem transcript, KHÔNG nghe lại audio, đồng hồ đếm ngược nghiêm ngặt 120 phút, tự nộp khi hết giờ. Lấy toàn bộ 61 câu hỏi hiện có. Khuyến nghị: tìm chỗ yên tĩnh, tắt điện thoại, làm nghiêm túc như thi thật.',
      durationMin: 120,
      type: 'exam',
      questionIds: JSON.stringify([
        // Part 2 — Listening (8 câu)
        'q_p2_1','q_p2_2','q_p2_3','q_p2_4','q_p2_5','q_p2_6','q_p2_7','q_p2_8',
        // Part 5 — Incomplete Sentences (30 câu)
        'q_p5_1','q_p5_2','q_p5_3','q_p5_4','q_p5_5','q_p5_6','q_p5_7','q_p5_8','q_p5_9','q_p5_10',
        'q_p5_11','q_p5_12','q_p5_13','q_p5_14','q_p5_15','q_p5_16','q_p5_17','q_p5_18','q_p5_19','q_p5_20',
        'q_p5_21','q_p5_22','q_p5_23','q_p5_24','q_p5_25','q_p5_26','q_p5_27','q_p5_28','q_p5_29','q_p5_30',
        // Part 6 — Text Completion (8 câu)
        'q_p6_1','q_p6_2','q_p6_3','q_p6_4','q_p6_5','q_p6_6','q_p6_7','q_p6_8',
        // Part 7 — Reading Comprehension (15 câu)
        'q_p7_1','q_p7_2','q_p7_3','q_p7_4','q_p7_5','q_p7_6','q_p7_7','q_p7_8','q_p7_9','q_p7_10',
        'q_p7_11','q_p7_12','q_p7_13','q_p7_14','q_p7_15',
      ]),
    },
  ]
  for (const t of testSets) {
    await db.testSet.upsert({ where: { id: t.id }, update: t, create: t })
  }

  console.log('Seed complete.')
  console.log(`  Vocab: ${await db.vocab.count()}`)
  console.log(`  Grammar: ${await db.grammarLesson.count()}`)
  console.log(`  Strategies: ${await db.strategy.count()}`)
  console.log(`  Questions: ${await db.question.count()}`)
  console.log(`  Test sets: ${await db.testSet.count()}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
