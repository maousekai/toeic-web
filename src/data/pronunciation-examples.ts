// 50 câu ví dụ luyện phát âm theo cấp độ CEFR
// Mỗi câu có: text, phonetic, level, tip (mẹo phát âm), focusSounds (âm khó)

export type PronunciationExample = {
  id: string
  text: string
  phonetic: string
  level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  tip: string
  focusSounds: string[] // các âm cần chú ý
  category: 'vowels' | 'consonants' | 'diphthongs' | 'stress' | 'intonation' | 'connected-speech'
}

export const PRONUNCIATION_EXAMPLES: PronunciationExample[] = [
  // ===== A0 — Câu cơ bản, âm đơn =====
  { id: 'p_a0_1', text: 'I have a cat.', phonetic: '/aɪ hæv ə kæt/', level: 'A0', tip: 'Chú ý âm /æ/ trong "cat" — mở miệng rộng, âm giữa a và e.', focusSounds: ['/æ/', '/aɪ/'], category: 'vowels' },
  { id: 'p_a0_2', text: 'The sun is hot.', phonetic: '/ðə sʌn ɪz hɒt/', level: 'A0', tip: 'Âm /ð/ trong "the" — đặt lưỡi giữa răng trên dưới, rung lưỡi.', focusSounds: ['/ð/', '/ʌ/'], category: 'consonants' },
  { id: 'p_a0_3', text: 'She has red shoes.', phonetic: '/ʃi hæz red ʃuːz/', level: 'A0', tip: 'Âm /ʃ/ trong "she, shoes" — môi tròn, đẩy hơi ra.', focusSounds: ['/ʃ/', '/uː/'], category: 'consonants' },
  { id: 'p_a0_4', text: 'My name is John.', phonetic: '/maɪ neɪm ɪz dʒɒn/', level: 'A0', tip: 'Âm /dʒ/ trong "John" — âm /d/ + /ʒ/ nối nhau.', focusSounds: ['/dʒ/', '/eɪ/'], category: 'consonants' },
  { id: 'p_a0_5', text: 'I like coffee.', phonetic: '/aɪ laɪk ˈkɒfi/', level: 'A0', tip: 'Âm /aɪ/ trong "like, I" — âm đôi, bắt đầu /a/ trôi về /ɪ/.', focusSounds: ['/aɪ/'], category: 'diphthongs' },
  { id: 'p_a0_6', text: 'He is tall.', phonetic: '/hi ɪz tɔːl/', level: 'A0', tip: 'Âm /ɔː/ trong "tall" — môi tròn, lưỡi thấp ra sau.', focusSounds: ['/ɔː/'], category: 'vowels' },
  { id: 'p_a0_7', text: 'We go to school.', phonetic: '/wi ɡəʊ tu skuːl/', level: 'A0', tip: 'Âm /uː/ trong "school" — môi tròn, kéo dài.', focusSounds: ['/uː/', '/əʊ/'], category: 'vowels' },

  // ===== A1 — Câu giao tiếp, âm thường gặp =====
  { id: 'p_a1_1', text: 'How are you today?', phonetic: '/haʊ ɑː ju təˈdeɪ/', level: 'A1', tip: 'Câu hỏi lên giọng ở cuối ("today?"). Âm /aʊ/ trong "how".', focusSounds: ['/aʊ/', 'intonation'], category: 'intonation' },
  { id: 'p_a1_2', text: 'What is your name?', phonetic: '/wɒt ɪz jɔː neɪm/', level: 'A1', tip: 'Âm /j/ trong "your" — âm bán nguyên âm, môi kéo sang 2 bên.', focusSounds: ['/j/', '/ɔː/'], category: 'consonants' },
  { id: 'p_a1_3', text: 'I would like some tea.', phonetic: '/aɪ wʊd laɪk sʌm tiː/', level: 'A1', tip: 'Âm /iː/ trong "tea" — môi kéo sang 2 bên, âm dài.', focusSounds: ['/iː/'], category: 'vowels' },
  { id: 'p_a1_4', text: 'The weather is nice.', phonetic: '/ðə ˈweðər ɪz naɪs/', level: 'A1', tip: 'Âm /ð/ trong "weather" — lưỡi giữa răng, rung.', focusSounds: ['/ð/', '/aɪ/'], category: 'consonants' },
  { id: 'p_a1_5', text: 'Can you help me?', phonetic: '/kæn ju help mi/', level: 'A1', tip: 'Câu hỏi lên giọng cuối câu. Âm /æ/ trong "can".', focusSounds: ['/æ/', 'intonation'], category: 'intonation' },
  { id: 'p_a1_6', text: 'I work in an office.', phonetic: '/aɪ wɜːk ɪn ən ˈɒfɪs/', level: 'A1', tip: 'Âm /ɜː/ trong "work" — môi trung tính, lưỡi giữa.', focusSounds: ['/ɜː/', '/ɒ/'], category: 'vowels' },
  { id: 'p_a1_7', text: 'She plays tennis.', phonetic: '/ʃi pleɪz ˈtenɪs/', level: 'A1', tip: 'Âm /eɪ/ trong "plays" — âm đôi trôi về /ɪ/.', focusSounds: ['/eɪ/'], category: 'diphthongs' },
  { id: 'p_a1_8', text: 'They are my friends.', phonetic: '/ðeɪ ɑː maɪ frendz/', level: 'A1', tip: 'Âm /eɪ/ trong "they", /aɪ/ trong "my" — 2 âm đôi cạnh nhau.', focusSounds: ['/eɪ/', '/aɪ/'], category: 'diphthongs' },

  // ===== A2 — Câu phức hơn, nối âm =====
  { id: 'p_a2_1', text: 'I would like to book a room.', phonetic: '/aɪ wʊd laɪk tu bʊk ə ruːm/', level: 'A2', tip: 'Nối âm: "would like" → /wʊdlaɪk/. Âm /ʊ/ trong "book".', focusSounds: ['/ʊ/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_a2_2', text: 'What time does the train leave?', phonetic: '/wɒt taɪm dʌz ðə treɪn liːv/', level: 'A2', tip: 'Câu hỏi Wh-question đi xuống ở cuối. Âm /aɪ/ trong "time".', focusSounds: ['/aɪ/', 'intonation'], category: 'intonation' },
  { id: 'p_a2_3', text: 'The flight is delayed.', phonetic: '/ðə flaɪt ɪz dɪˈleɪd/', level: 'A2', tip: 'Trọng âm chính rơi vào âm tiết 2: "de-LAYED".', focusSounds: ['/aɪ/', 'stress'], category: 'stress' },
  { id: 'p_a2_4', text: 'Could you repeat that, please?', phonetic: '/kʊd ju rɪˈpiːt ðæt pliːz/', level: 'A2', tip: 'Câu yêu cầu lên giọng nhẹ. Trọng âm: "re-PEAT".', focusSounds: ['/iː/', 'stress'], category: 'stress' },
  { id: 'p_a2_5', text: 'I am looking for a restaurant.', phonetic: '/aɪ əm ˈlʊkɪŋ fɔːr ə ˈrestrɒnt/', level: 'A2', tip: 'Nối âm: "looking for" → /lʊkɪŋfɔːr/. Trọng âm: "RES-tau-rant".', focusSounds: ['/ʊ/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_a2_6', text: 'How much does it cost?', phonetic: '/haʊ mʌtʃ dʌz ɪt kɒst/', level: 'A2', tip: 'Câu hỏi Wh đi xuống. Âm /ʌ/ trong "much, does".', focusSounds: ['/ʌ/', 'intonation'], category: 'intonation' },
  { id: 'p_a2_7', text: 'The weather is beautiful today.', phonetic: '/ðə ˈweðər ɪz ˈbjuːtɪfəl təˈdeɪ/', level: 'A2', tip: 'Trọng âm: "BEAU-ti-ful". Âm /juː/ trong "beautiful".', focusSounds: ['/juː/', 'stress'], category: 'stress' },
  { id: 'p_a2_8', text: 'I usually wake up at six.', phonetic: '/aɪ ˈjuːʒuəli weɪk ʌp ət sɪks/', level: 'A2', tip: 'Âm /ʒ/ trong "usually" — môi tròn, rung dây thanh.', focusSounds: ['/ʒ/', '/ʌ/'], category: 'consonants' },

  // ===== B1 — Business English, nối âm phức tạp =====
  { id: 'p_b1_1', text: 'The meeting is scheduled for tomorrow.', phonetic: '/ðə ˈmiːtɪŋ ɪz ˈʃedjuːld fɔː təˈmɒrəʊ/', level: 'B1', tip: 'Trọng âm: "MEET-ing", "SCHED-uled", "to-MOR-row". Nối "for tomorrow".', focusSounds: ['/iː/', 'stress'], category: 'stress' },
  { id: 'p_b1_2', text: 'We need to discuss the project.', phonetic: '/wi niːd tu dɪsˈkʌs ðə ˈprɒdʒekt/', level: 'B1', tip: 'Nối "need to" → /niːdtu/. Trọng âm: "dis-CUSS", "PROJ-ect".', focusSounds: ['/iː/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_b1_3', text: 'Could you send me the report by Friday?', phonetic: '/kʊd ju send mi ðə rɪˈpɔːt baɪ ˈfraɪdeɪ/', level: 'B1', tip: 'Câu yêu cầu lên giọng. Trọng âm: "re-PORT". Âm /aɪ/ trong "Friday".', focusSounds: ['/ɔː/', '/aɪ/'], category: 'stress' },
  { id: 'p_b1_4', text: 'The deadline has been extended.', phonetic: '/ðə ˈdedlaɪn həz biːn ɪkˈstendɪd/', level: 'B1', tip: 'Trọng âm: "DEAD-line", "ex-TEND-ed". Âm /aɪ/ trong "deadline".', focusSounds: ['/aɪ/', 'stress'], category: 'stress' },
  { id: 'p_b1_5', text: 'I agree with your suggestion.', phonetic: '/aɪ əˈɡriː wɪð jɔː səˈdʒestʃən/', level: 'B1', tip: 'Nối "agree with" → /əɡriːwɪð/. Trọng âm: "a-GREE", "sug-GES-tion".', focusSounds: ['/iː/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_b1_6', text: 'The presentation went well.', phonetic: '/ðə ˌprezənˈteɪʃən went wel/', level: 'B1', tip: 'Trọng âm chính: "pre-sen-TA-tion". Âm /eɪ/ trong "tation".', focusSounds: ['/eɪ/', 'stress'], category: 'stress' },
  { id: 'p_b1_7', text: 'Our company is growing rapidly.', phonetic: '/aʊə ˈkʌmpəni ɪz ˈɡrəʊɪŋ ˈræpɪdli/', level: 'B1', tip: 'Âm /aʊə/ trong "our" — âm 3 điểm. Trọng âm: "COM-pa-ny".', focusSounds: ['/aʊə/', '/ʌ/'], category: 'diphthongs' },
  { id: 'p_b1_8', text: 'I am responsible for marketing.', phonetic: '/aɪ əm rɪˈspɒnsəbəl fɔː ˈmɑːkɪtɪŋ/', level: 'B1', tip: 'Trọng âm: "re-SPON-si-ble", "MAR-ke-ting". Âm /ɑː/ trong "marketing".', focusSounds: ['/ɑː/', 'stress'], category: 'stress' },

  // ===== B2 — Business nâng cao, ngữ điệu =====
  { id: 'p_b2_1', text: 'We should negotiate the terms of the contract.', phonetic: '/wi ʃʊd nɪˈɡəʊʃieɪt ðə tɜːmz əv ðə ˈkɒntrækt/', level: 'B2', tip: 'Trọng âm: "ne-GO-ti-ate". Nối "terms of the" → /tɜːmzəvðə/.', focusSounds: ['/əʊ/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_b2_2', text: 'The revenue increased significantly.', phonetic: '/ðə ˈrevənjuː ɪnˈkriːst sɪɡˈnɪfɪkəntli/', level: 'B2', tip: 'Trọng âm: "REV-e-nue", "in-CREASED", "sig-NIF-i-cant-ly".', focusSounds: ['/juː/', '/iː/'], category: 'stress' },
  { id: 'p_b2_3', text: 'Investment in technology is essential.', phonetic: '/ɪnˈvestmənt ɪn tekˈnɒlədʒi ɪz ɪˈsenʃəl/', level: 'B2', tip: 'Nối "investment in" → /ɪnvestməntɪn/. Trọng âm: "in-VEST-ment".', focusSounds: ['/e/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_b2_4', text: 'Could you elaborate on that point?', phonetic: '/kʊd ju ɪˈlæbəreɪt ɒn ðæt pɔɪnt/', level: 'B2', tip: 'Câu yêu cầu lên giọng. Trọng âm: "e-LAB-o-rate". Âm /ɔɪ/ trong "point".', focusSounds: ['/ɔɪ/', 'stress'], category: 'diphthongs' },
  { id: 'p_b2_5', text: 'The strategy has proven to be effective.', phonetic: '/ðə ˈstrætədʒi həz ˈpruːvən tu bi ɪˈfektɪv/', level: 'B2', tip: 'Trọng âm: "STRAT-e-gy", "ef-FEC-tive". Âm /uː/ trong "proven".', focusSounds: ['/uː/', 'stress'], category: 'stress' },
  { id: 'p_b2_6', text: 'Our partnership requires mutual trust.', phonetic: '/aʊə ˈpɑːtnəʃɪp rɪˈkwaɪəz ˈmjuːtʃuəl trʌst/', level: 'B2', tip: 'Trọng âm: "PART-ner-ship", "mu-tu-al". Âm /aɪə/ trong "requires".', focusSounds: ['/aɪə/', '/ʌ/'], category: 'diphthongs' },
  { id: 'p_b2_7', text: 'The implementation was successful.', phonetic: '/ðə ˌɪmplɪmenˈteɪʃən wəz səkˈsesfəl/', level: 'B2', tip: 'Trọng âm chính: "im-ple-men-TA-tion". Âm /eɪ/ trong "tation".', focusSounds: ['/eɪ/', 'stress'], category: 'stress' },
  { id: 'p_b2_8', text: 'We need to optimize the process.', phonetic: '/wi niːd tu ˈɒptɪmaɪz ðə ˈprəʊses/', level: 'B2', tip: 'Trọng âm: "OP-ti-mize". Âm /aɪ/ trong "mize".', focusSounds: ['/aɪ/', 'stress'], category: 'stress' },

  // ===== C1 — Câu phức, từ trang trọng =====
  { id: 'p_c1_1', text: 'The acquisition will consolidate our market position.', phonetic: '/ðə ˌækwɪˈzɪʃən wɪl kənˈsɒlɪdeɪt aʊə ˈmɑːkɪt pəˈzɪʃən/', level: 'C1', tip: 'Trọng âm: "ac-qui-SI-tion", "con-SOL-i-date". Nối "will consolidate".', focusSounds: ['/ɪ/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_c1_2', text: 'Our pragmatic approach has yielded unprecedented results.', phonetic: '/aʊə præɡˈmætɪk əˈprəʊtʃ həz jiːldɪd ʌnˈpresɪdentɪd rɪˈzʌlts/', level: 'C1', tip: 'Trọng âm: "pra-GMAT-ic", "un-PREC-e-den-ted". Âm /æ/ trong "pragmatic".', focusSounds: ['/æ/', 'stress'], category: 'stress' },
  { id: 'p_c1_3', text: 'We must scrutinize every detail meticulously.', phonetic: '/wi mʌst ˈskruːtɪnaɪz ˈevri ˈdiːteɪl məˈtɪkjələsli/', level: 'C1', tip: 'Trọng âm: "SCRU-ti-nize", "me-TIC-u-lous-ly". Âm /uː/ trong "scrutinize".', focusSounds: ['/uː/', 'stress'], category: 'stress' },
  { id: 'p_c1_4', text: 'The mitigation strategy proved to be efficacious.', phonetic: '/ðə ˌmɪtɪˈɡeɪʃən ˈstrætədʒi pruːvd tu bi ˌefɪˈkeɪʃəs/', level: 'C1', tip: 'Trọng âm: "mit-i-GA-tion", "ef-FI-ca-cious". Âm /eɪ/ trong "cacious".', focusSounds: ['/eɪ/', 'stress'], category: 'stress' },
  { id: 'p_c1_5', text: 'Our CEO will address the shareholders tomorrow.', phonetic: '/aʊə ˌsiː iː ˈəʊ wɪl əˈdres ðə ˈʃeəhəʊldəz təˈmɒrəʊ/', level: 'C1', tip: 'Trọng âm: "ad-DRESS" (động từ), "SHARE-hol-ders". Nối "CEO will".', focusSounds: ['/eə/', 'connected-speech'], category: 'connected-speech' },
  { id: 'p_c1_6', text: 'The unforeseen circumstances necessitated immediate action.', phonetic: '/ðə ˌʌnfɔːˈsiːn ˈsɜːkəmstənsɪz nɪˈsesɪteɪtɪd ɪˈmiːdiət ˈækʃən/', level: 'C1', tip: 'Trọng âm: "ne-CES-si-ta-ted". Âm /iː/ trong "immediate".', focusSounds: ['/iː/', 'stress'], category: 'stress' },
  { id: 'p_c1_7', text: 'Substantive changes have been implemented throughout.', phonetic: '/səbˈstæntɪv ˈtʃeɪndʒɪz həv biːn ˈɪmplɪmentɪd θruːˈaʊt/', level: 'C1', tip: 'Trọng âm: "sub-STAN-tive", "im-PLE-men-ted". Nối "throughout".', focusSounds: ['/æ/', 'connected-speech'], category: 'connected-speech' },

  // ===== C2 — Câu học thuật, từ hiếm =====
  { id: 'p_c2_1', text: 'The CEO\'s cogent argument persuaded the board.', phonetic: '/ðə siːiːəʊz ˈkəʊdʒənt ˈɑːɡjumənt pəˈsweɪdɪd ðə bɔːd/', level: 'C2', tip: 'Trọng âm: "CO-gent", "per-SUA-ded". Âm /əʊ/ trong "cogent".', focusSounds: ['/əʊ/', 'stress'], category: 'stress' },
  { id: 'p_c2_2', text: 'His ubiquitous influence was ubiquitous in the industry.', phonetic: '/hɪz juːˈbɪkwɪtəs ˈɪnfluəns wəz juːˈbɪkwɪtəs ɪn ðə ˈɪndəstri/', level: 'C2', tip: 'Trọng âm: "u-BIQ-ui-tous". Âm /juː/ trong "ubiquitous".', focusSounds: ['/juː/', 'stress'], category: 'stress' },
  { id: 'p_c2_3', text: 'The iconoclastic approach disrupted conventional wisdom.', phonetic: '/ðə ˌaɪkəˈnɒklæstɪk əˈprəʊtʃ dɪsˈrʌptɪd kənˈvenʃənəl ˈwɪzdəm/', level: 'C2', tip: 'Trọng âm: "i-co-CLAS-tic", "dis-RUP-ted". Âm /ɒ/ trong "iconoclastic".', focusSounds: ['/ɒ/', 'stress'], category: 'stress' },
  { id: 'p_c2_4', text: 'Her meticulous attention to detail is exemplary.', phonetic: '/hɜː məˈtɪkjələs əˈtenʃən tu ˈdiːteɪl ɪz ɪɡˈzempləri/', level: 'C2', tip: 'Trọng âm: "me-TIC-u-lous", "ex-EM-pla-ry". Âm /iː/ trong "detail".', focusSounds: ['/iː/', 'stress'], category: 'stress' },
  { id: 'p_c2_5', text: 'The ephemeral nature of success demands constant vigilance.', phonetic: '/ðə ɪˈfemərəl ˈneɪtʃər əv səkˈses dɪˈmɑːndz ˈkɒnstənt ˈvɪdʒɪləns/', level: 'C2', tip: 'Trọng âm: "e-PHE-mer-al", "de-MANDS". Âm /eɪ/ trong "nature".', focusSounds: ['/eɪ/', 'stress'], category: 'stress' },
  { id: 'p_c2_6', text: 'Austerity measures were implemented with alacrity.', phonetic: '/ɒˈsterəti ˈmeʒəz wə ˈɪmplɪmentɪd wɪð əˈlækrəti/', level: 'C2', tip: 'Trọng âm: "aus-TER-i-ty", "a-LAC-ri-ty". Âm /æ/ trong "alacrity".', focusSounds: ['/æ/', 'stress'], category: 'stress' },
  { id: 'p_c2_7', text: 'The obsequious assistant fawned over the executive.', phonetic: '/ðə əbˈsiːkwiəs əˈsɪstənt fɔːnd ˈəʊvər ðə ɪɡˈzekjutɪv/', level: 'C2', tip: 'Trọng âm: "ob-SE-qui-ous", "ex-EC-u-tive". Âm /iː/ trong "obsequious".', focusSounds: ['/iː/', 'stress'], category: 'stress' },
]

// Helper: get examples by level
export function getExamplesByLevel(level: string): PronunciationExample[] {
  return PRONUNCIATION_EXAMPLES.filter((e) => e.level === level)
}

// Helper: get all levels that have examples
export function getAvailableLevels(): string[] {
  const levels = new Set(PRONUNCIATION_EXAMPLES.map((e) => e.level))
  return Array.from(levels).sort()
}

// Helper: get categories
export const PRONUNCIATION_CATEGORIES = [
  { id: 'vowels', name: 'Nguyên âm', icon: '🗣️', desc: 'Âm đơn a, e, i, o, u' },
  { id: 'consonants', name: 'Phụ âm', icon: '👄', desc: 'Âm phụ khó: th, sh, ch...' },
  { id: 'diphthongs', name: 'Âm đôi', icon: '🌊', desc: 'Âm trôi: /aɪ/, /eɪ/, /ɔɪ/...' },
  { id: 'stress', name: 'Trọng âm', icon: '💪', desc: 'Nhấn âm tiết đúng' },
  { id: 'intonation', name: 'Ngữ điệu', icon: '🎵', desc: 'Lên/xuống giọng cuối câu' },
  { id: 'connected-speech', name: 'Nối âm', icon: '🔗', desc: 'Nối từ khi nói nhanh' },
] as const
