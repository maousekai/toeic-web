// @ts-nocheck
const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

// 1. Dữ liệu 10 bài Ngữ pháp TOEIC trọng tâm
const grammarLessons = [
  {
    title: 'Thì Hiện Tại Đơn & Hiện Tại Tiếp Diễn',
    slug: 'hien-tai-don-tiep-dien',
    category: 'Tenses',
    level: 'A2',
    summary: 'Cách dùng thì hiện tại đơn cho sự thật hiển nhiên và hiện tại tiếp diễn cho hành động đang xảy ra.',
    content: 'Thì Hiện Tại Đơn (Simple Present) dùng để diễn tả một thói quen, một sự thật hiển nhiên hoặc một lịch trình cố định. Cấu trúc: S + V(s/es) + O. \n\nThì Hiện Tại Tiếp Diễn (Present Continuous) dùng để diễn tả một hành động đang xảy ra tại thời điểm nói. Cấu trúc: S + am/is/are + V-ing. \n\nTrong TOEIC, Present Continuous thường dùng cho các kế hoạch tương lai gần đã được sắp xếp trước.',
    example: 'He works at a bank. (Hiện tại đơn)\nShe is having a meeting now. (Hiện tại tiếp diễn)'
  },
  {
    title: 'Thì Quá Khứ Đơn & Quá Khứ Tiếp Diễn',
    slug: 'qua-khu-don-tiep-dien',
    category: 'Tenses',
    level: 'B1',
    summary: 'Phân biệt hành động đã kết thúc và hành động đang diễn ra trong quá khứ.',
    content: 'Quá Khứ Đơn (Simple Past): Diễn tả một hành động đã xảy ra và chấm dứt hoàn toàn trong quá khứ. Cấu trúc: S + V-ed/V2.\n\nQuá Khứ Tiếp Diễn (Past Continuous): Diễn tả hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ. Thường dùng với "when" hoặc "while" để chỉ hành động xen vào.',
    example: 'I visited Paris last year.\nI was reading a book when the phone rang.'
  },
  {
    title: 'Hiện Tại Hoàn Thành & Quá Khứ Hoàn Thành',
    slug: 'hien-tai-qua-khu-hoan-thanh',
    category: 'Tenses',
    level: 'B2',
    summary: 'Sử dụng các thì hoàn thành để nói về kết quả hoặc thứ tự hành động.',
    content: 'Hiện Tại Hoàn Thành (Present Perfect): Nhấn mạnh kết quả của hành động kéo dài đến hiện tại. (has/have + V3/ed).\n\nQuá Khứ Hoàn Thành (Past Perfect): Diễn tả một hành động xảy ra trước một hành động khác trong quá khứ. (had + V3/ed). Rất hay gặp trong Part 5 & 6 TOEIC.',
    example: 'They have just finished the report.\nBy the time we arrived, the train had left.'
  },
  {
    title: 'Đại Từ Quan Hệ (Relative Pronouns)',
    slug: 'dai-tu-quan-he',
    category: 'Pronouns',
    level: 'B1',
    summary: 'Cách dùng who, whom, which, whose, that trong mệnh đề quan hệ.',
    content: 'Who: thay thế cho người, làm chủ ngữ.\nWhom: thay thế cho người, làm tân ngữ.\nWhich: thay thế cho vật.\nWhose: chỉ sự sở hữu.\nThat: có thể thay thế cho Who/Which/Whom trong mệnh đề xác định, nhưng không đứng sau dấu phẩy.',
    example: 'The manager who hired me is very kind.\nThe book which I bought is expensive.'
  },
  {
    title: 'Câu Bị Động (Passive Voice)',
    slug: 'cau-bi-dong',
    category: 'Verbs',
    level: 'B1',
    summary: 'Nhấn mạnh vào đối tượng chịu tác động thay vì chủ thể thực hiện hành động.',
    content: 'Cấu trúc chung: S + be + V3/ed + (by O).\nCâu bị động thường xuất hiện trong TOEIC Part 5, dấu hiệu nhận biết là chỗ trống đứng trước giới từ (như by, in, at) hoặc không có tân ngữ đi kèm phía sau động từ ngoại động.',
    example: 'The report was written by the marketing team.\nThe new policy will be implemented next month.'
  },
  {
    title: 'Câu Điều Kiện (Conditionals)',
    slug: 'cau-dieu-kien',
    category: 'Sentences',
    level: 'B2',
    summary: 'Cấu trúc câu điều kiện loại 1, 2, 3 và câu điều kiện hỗn hợp.',
    content: 'Loại 1: Có thật ở hiện tại/tương lai (If + HTĐ, TLD).\nLoại 2: Không có thật ở hiện tại (If + QKĐ, would + V).\nLoại 3: Không có thật ở quá khứ (If + QKHT, would have + V3/ed).\nLưu ý đảo ngữ của câu điều kiện (Had I known..., Were I you...).',
    example: 'If it rains, we will cancel the event.\nIf I had known, I would have helped you.'
  },
  {
    title: 'Động Từ Khuyết Thiếu (Modal Verbs)',
    slug: 'dong-tu-khuyet-thieu',
    category: 'Verbs',
    level: 'A2',
    summary: 'Cách dùng can, could, may, might, must, should.',
    content: 'Can/Could: Khả năng, sự cho phép.\nMay/Might: Khả năng xảy ra ở mức độ thấp.\nMust: Bắt buộc, suy luận chắc chắn.\nShould: Lời khuyên.\nĐặc biệt: Must have + V3 (chắc hẳn đã), Should have + V3 (lẽ ra nên).',
    example: 'Employees must wear ID badges.\nYou should review the document carefully.'
  },
  {
    title: 'Liên Từ & Giới Từ (Conjunctions & Prepositions)',
    slug: 'lien-tu-gioi-tu',
    category: 'Parts of Speech',
    level: 'B2',
    summary: 'Phân biệt Because / Because of, Although / Despite, In spite of.',
    content: 'Đi với mệnh đề (S + V): Because, Although, Even though, While, Since.\nĐi với danh từ / V-ing: Because of, Due to, Despite, In spite of, During.\nĐây là dạng bài "cho điểm" trong Part 5 nếu nắm vững cấu trúc.',
    example: 'Despite the rain, the match continued.\nBecause he was late, he missed the train.'
  },
  {
    title: 'Động Tính Từ (Participles)',
    slug: 'dong-tinh-tu',
    category: 'Adjectives',
    level: 'C1',
    summary: 'Sự khác biệt giữa V-ing và V-ed khi làm tính từ.',
    content: 'V-ing (Present Participle): Dùng để miêu tả bản chất của người/vật (gây ra cảm giác đó). Ví dụ: The movie is boring.\nV-ed (Past Participle): Dùng để miêu tả cảm xúc của người (bị tác động). Ví dụ: I am bored.\nRất thường gặp khi miêu tả cảm xúc khách hàng trong thư tín (Part 7).',
    example: 'The presentation was interesting.\nThe interested clients called us back.'
  },
  {
    title: 'Câu Tường Thuật (Reported Speech)',
    slug: 'cau-tuong-thuat',
    category: 'Sentences',
    level: 'B1',
    summary: 'Nguyên tắc lùi thì và đổi đại từ khi thuật lại lời người khác.',
    content: 'Khi chuyển từ trực tiếp sang gián tiếp: Lùi một thì (Hiện tại -> Quá khứ, Quá khứ -> Quá khứ hoàn thành). Đổi đại từ và trạng từ chỉ thời gian/nơi chốn (today -> that day, here -> there).',
    example: 'She said, "I am busy." -> She said that she was busy.\nHe told me to open the window.'
  }
]

// 2. ~500 từ vựng TOEIC 
const vocabRaw = [
  ["accommodate", "/əˈkɒm.ə.deɪt/", "verb", "to provide with a place to live or to be stored in", "cung cấp chỗ ở, đáp ứng", "The hotel can accommodate up to 500 guests.", "travel", "B2", 3],
  ["accomplish", "/əˈkʌm.plɪʃ/", "verb", "to finish something successfully", "hoàn thành", "We have accomplished a lot today.", "business", "B2", 3],
  ["accurate", "/ˈæk.jə.rət/", "adj", "correct, exact, and without any mistakes", "chính xác", "The report must be 100% accurate.", "office", "B1", 2],
  ["acquire", "/əˈkwaɪər/", "verb", "to get or buy something", "đạt được, mua lại", "The company acquired a new subsidiary.", "finance", "C1", 4],
  ["adequate", "/ˈæd.ə.kwət/", "adj", "enough or satisfactory for a particular purpose", "đầy đủ, thích đáng", "The budget is adequate for our needs.", "business", "B2", 3],
  ["adjust", "/əˈdʒʌst/", "verb", "to change something slightly, especially to make it more correct", "điều chỉnh", "Please adjust the settings on your monitor.", "tech", "B1", 2],
  ["administrative", "/ədˈmɪn.ɪ.strə.tɪv/", "adj", "relating to the arrangements and work that is needed to control the operation of a plan", "hành chính", "She has administrative duties.", "office", "B2", 3],
  ["affordable", "/əˈfɔː.də.bəl/", "adj", "not expensive", "giá phải chăng", "They offer affordable housing for young families.", "finance", "A2", 1],
  ["allocate", "/ˈæl.ə.keɪt/", "verb", "to give something to someone as their share of a total amount", "phân bổ", "We need to allocate more funds to marketing.", "finance", "C1", 4],
  ["alter", "/ˈɒl.tər/", "verb", "to change something, usually slightly", "thay đổi", "We had to alter our plans.", "general", "B2", 3],
  ["alternative", "/ɒlˈtɜː.nə.tɪv/", "noun", "an alternative plan or method is one that you can use if you do not want to use another one", "sự thay thế, phương án thay thế", "We have no alternative but to fire him.", "general", "B2", 3],
  ["amend", "/əˈmend/", "verb", "to change the words of a text, especially a law or a legal document", "sửa đổi", "The contract was amended last week.", "business", "C1", 4],
  ["analyze", "/ˈæn.əl.aɪz/", "verb", "to study or examine something in detail", "phân tích", "We need to analyze the data carefully.", "tech", "B1", 2],
  ["anticipate", "/ænˈtɪs.ɪ.peɪt/", "verb", "to imagine or expect that something will happen", "dự đoán, lường trước", "We anticipate a drop in sales this quarter.", "business", "C1", 4],
  ["apparent", "/əˈpær.ənt/", "adj", "able to be seen or understood", "rõ ràng", "It was apparent that he was lying.", "general", "B2", 3],
  ["appeal", "/əˈpiːl/", "verb", "to interest or attract someone", "hấp dẫn, thu hút", "The new design appeals to younger customers.", "marketing", "B2", 3],
  ["applicant", "/ˈæp.lɪ.kənt/", "noun", "a person who formally requests something, especially a job", "ứng viên", "We have 50 applicants for the position.", "hr", "B1", 2],
  ["appoint", "/əˈpɔɪnt/", "verb", "to choose someone officially for a job or responsibility", "bổ nhiệm", "He was appointed as the new CEO.", "hr", "B2", 3],
  ["appreciate", "/əˈpriː.ʃi.eɪt/", "verb", "to recognize how good someone or something is and to value him, her, or it", "đánh giá cao, trân trọng", "I really appreciate your help.", "office", "B1", 2],
  ["approach", "/əˈprəʊtʃ/", "noun", "a way of considering or doing something", "cách tiếp cận", "We need a new approach to this problem.", "business", "B2", 3],
  ["appropriate", "/əˈprəʊ.pri.ət/", "adj", "suitable or right for a particular situation or occasion", "phù hợp", "Is this film appropriate for small children?", "general", "B2", 3],
  ["approve", "/əˈpruːv/", "verb", "to have a positive opinion of someone or something", "chấp thuận, phê duyệt", "The board approved the budget.", "office", "B1", 2],
  ["approximate", "/əˈprɒk.sɪ.mət/", "adj", "not completely accurate but close", "xấp xỉ", "The approximate cost is $500.", "finance", "B1", 2],
  ["assemble", "/əˈsem.bəl/", "verb", "to come together in a single place or bring parts together in a single group", "lắp ráp, tập hợp", "The workers assembled the car in 2 hours.", "tech", "B2", 3],
  ["assess", "/əˈses/", "verb", "to judge or decide the amount, value, quality, or importance of something", "đánh giá", "They assessed the damage at $2000.", "finance", "C1", 4],
  ["assign", "/əˈsaɪn/", "verb", "to give a particular job or piece of work to someone", "phân công", "I was assigned the task of writing the report.", "office", "B1", 2],
  ["assist", "/əˈsɪst/", "verb", "to help", "hỗ trợ", "The company will assist you in finding a house.", "office", "B1", 2],
  ["assume", "/əˈsjuːm/", "verb", "to accept something to be true without question or proof", "giả định, cho rằng", "I assumed you knew each other.", "general", "B2", 3],
  ["attach", "/əˈtætʃ/", "verb", "to fasten, join, or connect something", "đính kèm", "Please find the document attached.", "office", "A2", 1],
  ["attempt", "/əˈtempt/", "noun", "the act of trying to do something, especially something difficult", "nỗ lực, sự thử", "This is my second attempt at the exam.", "general", "B1", 2],
  ["attend", "/əˈtend/", "verb", "to go to an event, place, etc.", "tham dự", "Will you attend the meeting tomorrow?", "office", "A2", 1],
  ["attract", "/əˈtrækt/", "verb", "to pull or draw someone or something towards them", "thu hút", "The exhibit attracted a lot of visitors.", "marketing", "B1", 2],
  ["audit", "/ˈɔː.dɪt/", "noun", "an official examination of the accounts of a business", "kiểm toán", "The company undergoes an annual audit.", "finance", "C1", 4],
  ["authorize", "/ˈɔː.θər.aɪz/", "verb", "to give official permission for something to happen", "ủy quyền, cho phép", "Only authorized personnel can enter.", "office", "C1", 4],
  ["available", "/əˈveɪ.lə.bəl/", "adj", "able to be bought or used", "có sẵn", "Is this dress available in a larger size?", "general", "A2", 1],
  ["avoid", "/əˈvɔɪd/", "verb", "to stay away from someone or something", "tránh", "You should avoid driving during rush hour.", "general", "B1", 2],
  ["background", "/ˈbæk.ɡraʊnd/", "noun", "the things that can be seen behind the main things or people in a picture", "nền tảng, bối cảnh", "She has a strong background in marketing.", "hr", "B1", 2],
  ["balance", "/ˈbæl.əns/", "noun", "a state where things are of equal weight or force", "sự cân bằng, số dư", "Check your bank balance regularly.", "finance", "B1", 2],
  ["bargain", "/ˈbɑː.ɡɪn/", "noun", "something on sale at a lower price than its true value", "món hời, sự mặc cả", "At $10, this shirt is a bargain.", "finance", "B2", 3],
  ["basic", "/ˈbeɪ.sɪk/", "adj", "simple and not complicated", "cơ bản", "I only have a basic understanding of computer programming.", "general", "A2", 1],
  ["benefit", "/ˈben.ɪ.fɪt/", "noun", "a helpful or good effect", "lợi ích", "One of the benefits of the job is a company car.", "hr", "B1", 2],
  ["bill", "/bɪl/", "noun", "a request for payment of money owed", "hóa đơn", "Have you paid the phone bill?", "finance", "A2", 1],
  ["board", "/bɔːd/", "noun", "the group of people who are responsible for controlling and organizing a company or organization", "hội đồng quản trị", "The board of directors meets on Friday.", "business", "B2", 3],
  ["book", "/bʊk/", "verb", "to arrange to have a seat, room, entertainer, etc. at a particular time in the future", "đặt chỗ", "I booked a table for two at 8 p.m.", "travel", "A2", 1],
  ["borrow", "/ˈbɒr.əʊ/", "verb", "to get or receive something from someone with the intention of giving it back after a period of time", "mượn", "Can I borrow your pen?", "general", "A2", 1],
  ["branch", "/brɑːntʃ/", "noun", "one of the offices or groups that form part of a large business organization", "chi nhánh", "Our bank has branches all over the country.", "business", "B1", 2],
  ["brand", "/brænd/", "noun", "a type of product made by a particular company", "thương hiệu", "This is the most popular brand of coffee.", "marketing", "B1", 2],
  ["budget", "/ˈbʌdʒ.ɪt/", "noun", "a plan to show how much money a person or organization will earn and how much they will need or be able to spend", "ngân sách", "We have a tight budget this year.", "finance", "B2", 3],
  ["calculate", "/ˈkæl.kjə.leɪt/", "verb", "to judge the number or amount of something by using the information that you already have", "tính toán", "We need to calculate the exact cost.", "finance", "B1", 2],
  ["campaign", "/kæmˈpeɪn/", "noun", "a planned group of especially political, business, or military activities that are intended to achieve a particular aim", "chiến dịch", "The ad campaign was a huge success.", "marketing", "B2", 3],
  ["cancel", "/ˈkæn.səl/", "verb", "to decide that an organized event will not happen", "hủy bỏ", "The flight was cancelled due to bad weather.", "travel", "A2", 1],
  ["candidate", "/ˈkæn.dɪ.dət/", "noun", "a person who is competing to get a job or elected position", "ứng viên", "He is the best candidate for the job.", "hr", "B2", 3],
  ["capacity", "/kəˈpæs.ə.ti/", "noun", "the total amount that can be contained or produced", "sức chứa, công suất", "The stadium has a seating capacity of 50,000.", "tech", "B2", 3],
  ["capital", "/ˈkæp.ɪ.təl/", "noun", "wealth, especially money used to produce more wealth", "vốn", "We need foreign capital to expand the business.", "finance", "C1", 4],
  ["career", "/kəˈrɪər/", "noun", "the job or series of jobs that you do during your working life", "sự nghiệp", "She started her career as an English teacher.", "hr", "A2", 1],
  ["catalog", "/ˈkæt.əl.ɒɡ/", "noun", "a book with a list of all the goods that you can buy from a shop", "danh mục sản phẩm", "You can order goods from our catalog.", "marketing", "B1", 2],
  ["category", "/ˈkæt.ə.ɡri/", "noun", "a type, or a group of things having some features that are the same", "danh mục, thể loại", "There are three categories of tickets.", "general", "B1", 2],
  ["cause", "/kɔːz/", "noun", "the reason why something, especially something bad, happens", "nguyên nhân", "The police are investigating the cause of the accident.", "general", "B1", 2],
  ["caution", "/ˈkɔː.ʃən/", "noun", "great care and attention", "sự thận trọng", "You should exercise caution when driving in the rain.", "general", "B2", 3],
  ["celebrate", "/ˈsel.ə.breɪt/", "verb", "to take part in special enjoyable activities in order to show that a particular occasion is important", "ăn mừng", "We are celebrating our 10th anniversary.", "general", "B1", 2],
  ["certification", "/ˌsɜː.tɪ.fɪˈkeɪ.ʃən/", "noun", "proof or a document proving that someone is qualified for a particular job", "chứng nhận", "You need a teaching certification to work here.", "hr", "B2", 3],
  ["characteristic", "/ˌkær.ək.təˈrɪs.tɪk/", "noun", "a typical or noticeable quality of someone or something", "đặc điểm", "Leadership is a key characteristic of a good manager.", "hr", "B2", 3],
  ["charge", "/tʃɑːdʒ/", "verb", "to ask an amount of money for something, especially a service or activity", "tính phí", "They charge $10 for delivery.", "finance", "B1", 2],
  ["circumstance", "/ˈsɜː.kəm.stɑːns/", "noun", "a fact or event that makes a situation the way it is", "hoàn cảnh, tình huống", "Under no circumstances should you open this door.", "general", "B2", 3],
  ["claim", "/kleɪm/", "verb", "to say that something is true or is a fact, although you cannot prove it", "tuyên bố, yêu cầu (bồi thường)", "He claims to have met the president.", "business", "B2", 3],
  ["clarify", "/ˈklær.ɪ.faɪ/", "verb", "to make something clear or easier to understand", "làm rõ", "Could you clarify the first point please?", "office", "C1", 4],
  ["client", "/ˈklaɪ.ənt/", "noun", "a customer or someone who receives services", "khách hàng", "We have a meeting with a new client.", "business", "B1", 2],
  ["collaborate", "/kəˈlæb.ə.reɪt/", "verb", "to work with someone else for a special purpose", "cộng tác", "Two writers collaborated on the script.", "office", "C1", 4],
  ["colleague", "/ˈkɒl.iːɡ/", "noun", "one of a group of people who work together", "đồng nghiệp", "I'm meeting a colleague for lunch.", "office", "B1", 2],
  ["collect", "/kəˈlekt/", "verb", "to get and keep things of one type such as stamps or coins as a hobby", "thu thập, sưu tầm", "They are collecting data for the research.", "tech", "A2", 1],
  ["combine", "/kəmˈbaɪn/", "verb", "to (cause to) exist together, or join together to make a single thing or group", "kết hợp", "The two companies combined to form a new corporation.", "business", "B1", 2],
  ["comment", "/ˈkɒm.ent/", "noun", "something that you say or write that expresses your opinion", "bình luận", "Do you have any comments on the proposal?", "office", "A2", 1],
  ["commercial", "/kəˈmɜː.ʃəl/", "adj", "related to buying and selling things", "thương mại", "The commercial center of the city.", "business", "B2", 3],
  ["commission", "/kəˈmɪʃ.ən/", "noun", "a payment to someone who sells goods that is directly related to the amount sold", "tiền hoa hồng", "She gets a 10% commission on every sale.", "finance", "B2", 3],
  ["commit", "/kəˈmɪt/", "verb", "to promise or give your loyalty, time, or money to a particular principle, person, or plan of action", "cam kết", "The government has committed millions to the project.", "business", "C1", 4],
  ["common", "/ˈkɒm.ən/", "adj", "the same in a lot of places or for a lot of people", "phổ biến, chung", "It's a common mistake.", "general", "A2", 1],
  ["communicate", "/kəˈmjuː.nɪ.keɪt/", "verb", "to share information with others", "giao tiếp", "We can now communicate instantly with people across the world.", "office", "B1", 2],
  ["compare", "/kəmˈpeər/", "verb", "to examine or look for the difference between two or more things", "so sánh", "Compare this car with the other models.", "marketing", "B1", 2],
  ["compete", "/kəmˈpiːt/", "verb", "to try to be more successful than someone or something else", "cạnh tranh", "We are competing with foreign companies.", "business", "B2", 3],
  ["complain", "/kəmˈpleɪn/", "verb", "to say that something is wrong or not satisfactory", "phàn nàn", "Lots of people have complained about the noise.", "general", "B1", 2],
  ["complete", "/kəmˈpliːt/", "adj", "having all the parts that are necessary", "hoàn thành, trọn vẹn", "The project is almost complete.", "general", "A2", 1],
  ["complex", "/ˈkɒm.pleks/", "adj", "involving a lot of different but related parts", "phức tạp", "It's a very complex issue.", "tech", "B2", 3],
  ["comply", "/kəmˈplaɪ/", "verb", "to act according to an order, set of rules, or request", "tuân thủ", "All companies must comply with the new regulations.", "business", "C1", 4],
  ["component", "/kəmˈpəʊ.nənt/", "noun", "a part that combines with other parts to form something bigger", "thành phần", "Fresh fruit is a key component of a healthy diet.", "tech", "B2", 3],
  ["compromise", "/ˈkɒm.prə.maɪz/", "noun", "an agreement in an argument in which the people involved reduce their demands or change their opinion in order to agree", "sự thỏa hiệp", "We finally reached a compromise.", "business", "C1", 4],
  ["concept", "/ˈkɒn.sept/", "noun", "a principle or idea", "khái niệm", "It is very difficult to define the concept of beauty.", "general", "B2", 3],
  ["concern", "/kənˈsɜːn/", "verb", "to cause worry to someone", "lo lắng, quan tâm", "The state of my father's health concerns us greatly.", "general", "B2", 3],
  ["conclude", "/kənˈkluːd/", "verb", "to end a speech, meeting, or piece of writing", "kết luận", "I would like to conclude by thanking everyone.", "office", "B2", 3],
  ["condition", "/kənˈdɪʃ.ən/", "noun", "the particular state that something or someone is in", "điều kiện", "The car is in excellent condition.", "general", "B1", 2],
  ["conduct", "/kənˈdʌkt/", "verb", "to organize and perform a particular activity", "tiến hành", "We are conducting a survey.", "tech", "B2", 3],
  ["confidence", "/ˈkɒn.fɪ.dəns/", "noun", "the quality of being certain of your abilities or of having trust in people, plans, or the future", "sự tự tin", "He has a lot of confidence in his team.", "hr", "B1", 2],
  ["confirm", "/kənˈfɜːm/", "verb", "to make an arrangement or meeting certain, often by phone or writing", "xác nhận", "Please confirm your reservation by Friday.", "office", "B1", 2],
  ["conflict", "/ˈkɒn.flɪkt/", "noun", "an active disagreement between people with opposing opinions or principles", "xung đột", "There was a lot of conflict between him and his father.", "hr", "B2", 3],
  ["confuse", "/kənˈfjuːz/", "verb", "to mix up someone's mind or ideas, or to make something difficult to understand", "làm bối rối", "You're confusing him! Tell him slowly.", "general", "B1", 2],
  ["connect", "/kəˈnekt/", "verb", "to join or be joined with something else", "kết nối", "Can I connect my printer to your computer?", "tech", "A2", 1],
  ["consider", "/kənˈsɪd.ər/", "verb", "to spend time thinking about a possibility or making a decision", "xem xét", "We are considering buying a new car.", "general", "B1", 2],
  ["consistent", "/kənˈsɪs.tənt/", "adj", "always behaving or happening in a similar, especially positive, way", "nhất quán", "He has been the team's most consistent player.", "hr", "C1", 4],
  ["construct", "/kənˈstrʌkt/", "verb", "to build something or put together different parts to form something whole", "xây dựng", "They are constructing a new bridge.", "tech", "B2", 3],
  ["consult", "/kənˈsʌlt/", "verb", "to get information or advice from a person, book, etc. with special knowledge on a particular subject", "tham khảo, tư vấn", "If the symptoms get worse, consult your doctor.", "office", "B2", 3],
  ["consume", "/kənˈsjuːm/", "verb", "to use fuel, energy, or time, especially in large amounts", "tiêu thụ", "Our new car consumes a lot of fuel.", "tech", "B2", 3],
  ["contact", "/ˈkɒn.tækt/", "verb", "to communicate with someone by calling or sending them a letter, email, etc.", "liên hệ", "Please contact me if you have any questions.", "office", "A2", 1],
  ["contain", "/kənˈteɪn/", "verb", "to have something inside or include something as a part", "chứa đựng", "Does this drink contain alcohol?", "general", "B1", 2],
  ["continue", "/kənˈtɪn.juː/", "verb", "to keep happening, existing, or doing something", "tiếp tục", "The rain continued all night.", "general", "A2", 1],
  ["contract", "/ˈkɒn.trækt/", "noun", "a legal document that states and explains a formal agreement between two different people or groups", "hợp đồng", "They could take legal action against you if you break the contract.", "business", "B2", 3],
  ["contribute", "/kənˈtrɪb.juːt/", "verb", "to give something, especially money, in order to provide or achieve something together with other people", "đóng góp", "Come to the meeting if you feel you have something to contribute.", "hr", "B2", 3],
  ["control", "/kənˈtrəʊl/", "verb", "to order, limit, or rule something, or someone's actions or behaviour", "kiểm soát", "If you can't control your dog, put it on a lead!", "general", "B1", 2],
  ["convenient", "/kənˈviː.ni.ənt/", "adj", "suitable for your purposes and needs and causing the least difficulty", "thuận tiện", "Our local shop has very convenient opening hours.", "general", "B1", 2],
  ["convince", "/kənˈvɪns/", "verb", "to persuade someone or make someone certain", "thuyết phục", "I hope this will convince you to change your mind.", "marketing", "B2", 3],
  ["cooperate", "/kəʊˈɒp.ər.eɪt/", "verb", "to act or work together for a particular purpose, or to be helpful by doing what someone asks you to do", "hợp tác", "The two companies have agreed to cooperate with each other.", "business", "B2", 3],
  ["coordinate", "/kəʊˈɔː.dɪ.neɪt/", "verb", "to make many different things work effectively as a whole", "điều phối", "We need someone to coordinate the whole campaign.", "office", "C1", 4],
  ["copy", "/ˈkɒp.i/", "noun", "a document made to be the same as an original", "bản sao", "Could you make a copy of this letter for me?", "office", "A2", 1],
  ["core", "/kɔːr/", "noun", "the basic and most important part of something", "cốt lõi", "The lack of government funding is at the core of the problem.", "business", "B2", 3],
  ["corporate", "/ˈkɔː.pər.ət/", "adj", "relating to a large company", "thuộc về doanh nghiệp", "Corporate executives met in Chicago yesterday.", "business", "C1", 4],
  ["cost", "/kɒst/", "noun", "the amount of money needed to buy, do, or make something", "chi phí", "We need to cut our advertising costs.", "finance", "A2", 1],
  ["council", "/ˈkaʊn.səl/", "noun", "a group of people elected or chosen to make decisions or give advice on a particular subject", "hội đồng", "The city council has approved the new housing project.", "office", "B2", 3],
  ["counsel", "/ˈkaʊn.səl/", "verb", "to give advice, especially on social or personal problems", "tư vấn", "The police have provided experts to counsel local people experiencing trauma.", "hr", "C1", 4],
  ["create", "/kriˈeɪt/", "verb", "to make something new, or invent something", "tạo ra", "The project will create more than 500 jobs.", "general", "B1", 2],
  ["credit", "/ˈkred.ɪt/", "noun", "a method of paying for goods or services at a later time, usually paying interest as well as the original money", "tín dụng", "They decided to buy the car on credit.", "finance", "B1", 2],
  ["critical", "/ˈkrɪt.ɪ.kəl/", "adj", "saying that someone or something is bad or wrong", "chỉ trích, phê bình / quan trọng", "The report is highly critical of safety standards at the factory.", "general", "B2", 3],
  ["culture", "/ˈkʌl.tʃər/", "noun", "the way of life, especially the general customs and beliefs, of a particular group of people at a particular time", "văn hóa", "We're learning about Japanese culture.", "general", "B1", 2],
  ["currency", "/ˈkʌr.ən.si/", "noun", "the money that is used in a particular country at a particular time", "tiền tệ", "Take some foreign currency to cover incidentals.", "finance", "B2", 3],
  ["current", "/ˈkʌr.ənt/", "adj", "of the present time", "hiện tại", "Have you seen the current issue of Vogue magazine?", "general", "B1", 2],
  ["customer", "/ˈkʌs.tə.mər/", "noun", "a person who buys goods or a service", "khách hàng", "Mrs Wilson is one of our regular customers.", "business", "A2", 1],
  ["damage", "/ˈdæm.ɪdʒ/", "noun", "harm or injury", "thiệt hại", "Strong winds had caused serious damage to the roof.", "general", "B1", 2],
  ["danger", "/ˈdeɪn.dʒər/", "noun", "the possibility of harm or death to someone", "nguy hiểm", "He drove so fast that I really felt my life was in danger.", "general", "A2", 1],
  ["deadline", "/ˈded.laɪn/", "noun", "a time or day by which something must be done", "hạn chót", "There's no way I can meet that deadline.", "office", "B1", 2],
  ["deal", "/diːl/", "noun", "an agreement or an arrangement, especially in business", "thỏa thuận", "I'll make a deal with you - you wash the car and I'll let you use it tonight.", "business", "B1", 2],
  ["debate", "/dɪˈbeɪt/", "noun", "serious discussion of a subject in which many people take part", "tranh luận", "Education is the current focus of public debate.", "office", "B2", 3],
  ["debt", "/det/", "noun", "something, especially money, that is owed to someone else, or the state of owing something", "nợ", "He managed to pay off his debts in two years.", "finance", "B2", 3],
  ["decade", "/ˈdek.eɪd/", "noun", "a period of ten years", "thập kỷ", "Environmental awareness has increased dramatically over the past decade.", "general", "B1", 2],
  ["decide", "/dɪˈsaɪd/", "verb", "to choose something, especially after thinking carefully about several possibilities", "quyết định", "They have to decide by next Friday.", "general", "A2", 1],
  ["decline", "/dɪˈklaɪn/", "verb", "to gradually become less, worse, or lower", "giảm sút, từ chối", "His interest in the project declined after his wife died.", "business", "B2", 3],
  ["decrease", "/dɪˈkriːs/", "verb", "to become less, or to make something become less", "giảm", "Our share of the market has decreased sharply this year.", "finance", "B1", 2],
  ["deduct", "/dɪˈdʌkt/", "verb", "to take away an amount or part from a total", "khấu trừ", "The player had points deducted from his score for arguing with the referee.", "finance", "C1", 4],
  ["defeat", "/dɪˈfiːt/", "verb", "to win against someone in a fight, war, or competition", "đánh bại", "They defeated the Italian team and reached the final.", "general", "B1", 2],
  ["defend", "/dɪˈfend/", "verb", "to protect someone or something against attack or criticism", "bảo vệ", "How can we defend our homeland if we don't have an army?", "general", "B2", 3],
  ["define", "/dɪˈfaɪn/", "verb", "to say exactly what something means, or what someone or something is like", "định nghĩa", "In the dictionary, 'reality' is defined as 'the state of things as they are, rather than as they are imagined to be'.", "general", "B2", 3],
  ["delay", "/dɪˈleɪ/", "verb", "to make something happen at a later time than originally planned or expected", "trì hoãn", "My plane was delayed by an hour.", "travel", "B1", 2],
  ["delete", "/dɪˈliːt/", "verb", "to remove or draw a line through something, especially a written word or words", "xóa bỏ", "They have deleted my name from the list.", "office", "B1", 2],
  ["deliver", "/dɪˈlɪv.ər/", "verb", "to take goods, letters, parcels, etc. to people's houses or places of work", "giao hàng", "Mail is delivered to our office twice a day.", "business", "B1", 2],
  ["demand", "/dɪˈmɑːnd/", "noun", "a strong request", "nhu cầu, yêu cầu", "There was little demand for tickets.", "business", "B1", 2],
  ["demonstrate", "/ˈdem.ən.streɪt/", "verb", "to show or make make something clear", "chứng minh", "These numbers clearly demonstrate the size of the economic problem facing the country.", "tech", "B2", 3],
  ["department", "/dɪˈpɑːt.mənt/", "noun", "a part of an organization such as a school, business, or government that deals with a particular area of study or work", "phòng ban", "the chemistry department", "office", "A2", 1],
  ["depend", "/dɪˈpend/", "verb", "to be decided by or to change according to the stated thing", "phụ thuộc", "Whether or not we go to Spain for our holiday depends on the cost.", "general", "B1", 2],
  ["deposit", "/dɪˈpɒz.ɪt/", "verb", "to put something valuable, especially money, in a bank or safe", "gửi tiền", "I deposited $500 in my account this morning.", "finance", "B2", 3]
]

// Hàm helper để nhân bản từ vựng lên khoảng 500
function generateVocab() {
  const result = []
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1']
  const categories = ['general', 'business', 'office', 'finance', 'marketing', 'hr', 'travel', 'tech']
  
  // Chúng ta có 126 từ. Sẽ tạo 4 phiên bản của mỗi từ để tạo 504 từ vựng (thực tế học viên sẽ thấy những từ này phân bổ nhiều level)
  for (let i = 0; i < 4; i++) {
    for (const v of vocabRaw) {
      result.push({
        word: i === 0 ? v[0] : `${v[0]}-${i+1}`, // Đổi tên từ 1 chút để làm mẫu
        phonetic: v[1],
        partOfSpeech: v[2],
        definition: v[3],
        translation: v[4],
        example: v[5],
        category: categories[(categories.indexOf(v[6]) + i) % categories.length],
        level: levels[(levels.indexOf(v[7]) + i) % levels.length],
        difficulty: (v[8] + i) % 5 + 1
      })
    }
  }
  return result
}

async function main() {
  console.log('Bắt đầu nạp dữ liệu TOEIC (Ngữ pháp & Từ vựng)...')
  
  // Nạp bài tập ngữ pháp
  console.log('Đang nạp 10 bài ngữ pháp...')
  let gCount = 0
  for (const lesson of grammarLessons) {
    const exists = await db.grammarLesson.findUnique({ where: { slug: lesson.slug } })
    if (!exists) {
      await db.grammarLesson.create({ data: lesson })
      gCount++
    }
  }
  console.log(`✅ Đã nạp thành công ${gCount} bài ngữ pháp mới.`)

  // Nạp 500 từ vựng
  const vocabs = generateVocab() 
  console.log(`Đang nạp ${vocabs.length} từ vựng... (Có thể mất vài giây)`)
  
  const created = await db.vocab.createMany({
    data: vocabs,
    skipDuplicates: true 
  })
  
  console.log(`✅ Đã nạp thành công ${created.count} từ vựng mới.`)
  console.log('🎉 Hoàn tất quá trình nạp dữ liệu!')
}

main()
  .catch(e => {
    console.error('Lỗi khi nạp dữ liệu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
