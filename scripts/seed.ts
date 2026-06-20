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
      title: 'Present Simple vs. Present Continuous',
      slug: 'present-simple-vs-continuous',
      category: 'tenses',
      level: 'beginner',
      summary: 'When to use the simple present and the present continuous.',
      example: 'The company manufactures (simple) electronics. Right now they are developing (continuous) a new model.',
      content: `## Present Simple
Use it for **habits, facts, schedules and general truths**.
- The store **opens** at 9 a.m.
- She **works** in the marketing department.

Signal words: *always, usually, every day, on Mondays*.

## Present Continuous
Use it for **actions happening now** or **temporary situations**.
- They **are meeting** a client right now.
- We **are launching** a new product this quarter.

Signal words: *now, at the moment, currently, this week*.

## Common TOEIC Trap
Stative verbs (know, own, prefer, belong, seem) are **not** used in continuous form even when meaning is "now".
- Correct: I **know** the answer.  Wrong: I am knowing the answer.`,
    },
    {
      id: 'g_present_perfect',
      title: 'Present Perfect & Past Simple',
      slug: 'present-perfect-past-simple',
      category: 'tenses',
      level: 'intermediate',
      summary: 'Linking the past to the present with the present perfect.',
      example: 'She has worked here since 2018. She joined the team in 2018.',
      content: `## Present Perfect (have/has + past participle)
Use it for:
- **Unfinished time** (since, for, so far, yet): *We have received 50 applications so far.*
- **Experience**: *He has visited our Tokyo office.*
- **Recent results**: *Sales have increased this quarter.*

## Past Simple
Use it for **finished time** (yesterday, last year, in 2019, ago).
- *They signed the contract **last week**.*

## TOEIC Tip
If the sentence contains a finished-time marker (last month, in 2020, two days ago), use the **past simple**, never the present perfect.`,
    },
    {
      id: 'g_conditionals',
      title: 'Conditionals (Zero, First, Second)',
      slug: 'conditionals',
      category: 'conditionals',
      level: 'intermediate',
      summary: 'If-clauses for real and hypothetical situations.',
      example: 'If we lower the price, sales will increase. If I were the manager, I would hire more staff.',
      content: `## Zero Conditional (general facts)
**If + present, present**
- If you heat water, it boils.

## First Conditional (real future)
**If + present, will + base verb**
- If we meet the deadline, the client **will be** satisfied.

## Second Conditional (hypothetical)
**If + past simple, would + base verb**
- If I **were** the CEO, I **would invest** in training.  (use "were" for all subjects)

## TOEIC Trap
After "if", never use "will". The future tense goes in the **main clause** only.`,
    },
    {
      id: 'g_passive',
      title: 'The Passive Voice',
      slug: 'passive-voice',
      category: 'voice',
      level: 'intermediate',
      summary: 'Focusing on the action rather than the doer.',
      example: 'The report was prepared by the analyst. The office is cleaned every evening.',
      content: `## Form: be + past participle
- Active: *The team **completed** the project.*
- Passive: *The project **was completed** by the team.*

## When to use the passive
- The doer is unknown or unimportant: *The window **was broken**.*
- Formal/business style: *Your application **has been received**.*

## Tenses
- Present: is/are + done — *The report **is printed** daily.*
- Past: was/were + done — *The contract **was signed** yesterday.*
- Present perfect: has/have been + done — *The items **have been shipped**.*
- Future: will be + done — *The office **will be renovated** next year.*`,
    },
    {
      id: 'g_articles',
      title: 'Articles (a / an / the)',
      slug: 'articles',
      category: 'articles',
      level: 'beginner',
      summary: 'Using indefinite and definite articles correctly.',
      example: 'I bought a computer. The computer is on the desk.',
      content: `## a / an (indefinite)
Use for **first mention**, singular, countable nouns.
- *a* before consonant sounds, *an* before vowel sounds: a uniform / an hour.

## the (definite)
Use when the noun is **specific** or **already mentioned**.
- *The report you asked for is ready.*
- *the sun, the moon, the president* (unique).

## No article
- Plural/general: *Computers are useful.*
- Abstract/uncountable: *Information is power.*
- Names of most companies, cities, countries (except "the United States").`,
    },
    {
      id: 'g_prepositions',
      title: 'Prepositions of Time & Place',
      slug: 'prepositions-time-place',
      category: 'prepositions',
      level: 'beginner',
      summary: 'in, on, at for time and location.',
      example: 'The meeting is at 3 p.m. on Monday in the main hall.',
      content: `## Time
- **at** + clock time: at 9:00, at noon
- **on** + days/dates: on Monday, on July 4th
- **in** + months/years/seasons: in May, in 2024, in summer

## Place
- **at** + specific point: at the door, at the desk
- **on** + surfaces/lines: on the table, on the wall
- **in** + enclosed spaces: in the office, in the city

## TOEIC Favorites
- **in time** (before the deadline) vs **on time** (exactly at the scheduled time)
- **by** + deadline: *Submit the form by Friday.*`,
    },
    {
      id: 'g_gerund_inf',
      title: 'Gerunds vs. Infinitives',
      slug: 'gerunds-infinitives',
      category: 'verb-forms',
      level: 'intermediate',
      summary: 'Which verbs take -ing and which take to + verb.',
      example: 'I enjoy working here. I want to leave early.',
      content: `## Verbs + gerund (-ing)
enjoy, avoid, finish, suggest, consider, mind, postpone, practice, deny
- *She suggested **postponing** the meeting.*

## Verbs + infinitive (to + verb)
want, decide, hope, plan, agree, offer, refuse, promise, learn
- *They decided **to expand** the business.*

## Verbs + either (meaning changes)
- **stop**: He stopped smoking (quit). / He stopped to smoke (paused in order to smoke).
- **remember**: I remember locking the door. / Remember to lock the door.

## Preposition + gerund
After any preposition, use -ing: *She is good at **organizing** events.*`,
    },
    {
      id: 'g_relative',
      title: 'Relative Clauses',
      slug: 'relative-clauses',
      category: 'clauses',
      level: 'intermediate',
      summary: 'who, which, that, where, whose.',
      example: 'The manager who hired me is retiring. The report which was submitted is incomplete.',
      content: `## Relative pronouns
- **who** for people: *The candidate **who** applied yesterday is strong.*
- **which** for things: *The contract **which** was signed...*
- **that** for people or things (defining clauses only)
- **whose** for possession: *The employee **whose** laptop was stolen...*
- **where** for places: *The office **where** I work...*

## Defining vs Non-defining
- **Defining** (no commas): essential info — *The man **who** called you is here.*
- **Non-defining** (commas): extra info — *Mr. Lee, **who** is our CFO, will speak.* (cannot use "that")`,
    },
    {
      id: 'g_comparison',
      title: 'Comparatives & Superlatives',
      slug: 'comparatives-superlatives',
      category: 'adjectives',
      level: 'beginner',
      summary: 'Comparing two or more things.',
      example: 'This model is faster than the previous one. It is the most efficient on the market.',
      content: `## Short adjectives (1 syllable)
- -er / the -est: fast → faster → the fastest
- big → bigger → the biggest (double consonant)

## Long adjectives (2+ syllables)
- more / the most: efficient → more efficient → the most efficient

## Irregular
- good → better → the best
- bad → worse → the worst
- far → farther/further → the farthest/furthest

## Modifiers
- **much / a lot / far** + comparative: *much more expensive*
- **slightly / a bit** + comparative: *slightly cheaper*`,
    },
    {
      id: 'g_modals',
      title: 'Modal Verbs',
      slug: 'modal-verbs',
      category: 'modals',
      level: 'intermediate',
      summary: 'can, could, may, might, must, should, would.',
      example: 'You must submit the form by Friday. Employees should wear a badge.',
      content: `## Ability & Permission
- **can / could**: ability, informal permission
- **may**: formal permission / possibility — *You may leave early.*

## Obligation & Advice
- **must**: strong obligation — *You must wear a helmet.*
- **should / ought to**: advice — *You should check the figures.*
- **have to**: external obligation

## Possibility & Deduction
- **must be**: near certainty — *He must be the new manager.*
- **can't be**: impossibility — *That can't be right.*
- **might / may / could**: possibility

## TOEIC Tip
Modals are always followed by the **base form** of the verb (no "to", no -ing).`,
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
