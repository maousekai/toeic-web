const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const fixes = [
    // Q42-43 (Part 3)
    { id: 'q_lc1_42', question: 'What does the woman mean when she says, "That is surprising"?', options: JSON.stringify(['The man has won an award', 'The man has changed his mind', 'The restaurant is fully booked', 'The recipe is difficult to make']), answer: 2 },
    { id: 'q_lc1_43', question: 'What will the man probably do next?', options: JSON.stringify(['Call a different restaurant', 'Make a reservation online', 'Speak with the manager', 'Order takeout instead']), answer: 1 },
    // Q60-64 (Part 3)
    { id: 'q_lc1_60', question: 'Why does the woman say, "We need to act quickly"?', options: JSON.stringify(['A deadline is approaching', 'A competitor has lowered prices', 'A contract is expiring', 'A team member is leaving']), answer: 0 },
    { id: 'q_lc1_61', question: 'What does the man suggest?', options: JSON.stringify(['Hiring additional staff', 'Outsourcing the project', 'Extending the deadline', 'Reducing the scope']), answer: 2 },
    { id: 'q_lc1_62', question: 'What will the woman do this afternoon?', options: JSON.stringify(['Attend a meeting', 'Visit a client', 'Review a proposal', 'Prepare a presentation']), answer: 3 },
    { id: 'q_lc1_63', question: 'What does the man ask the woman to do?', options: JSON.stringify(['Send an email', 'Schedule a call', 'Prepare a report', 'Contact a supplier']), answer: 0 },
    { id: 'q_lc1_64', question: 'What does the woman imply about the project?', options: JSON.stringify(['It is over budget', 'It is ahead of schedule', 'It needs more resources', 'It has been completed']), answer: 1 },
    // Q84-94 (Part 4)
    { id: 'q_lc1_84', question: 'What does the speaker imply when he says, "Practice makes perfect"?', options: JSON.stringify(['Participants should rehearse', 'The workshop will be repeated', 'Experience is required', 'The session is optional']), answer: 0 },
    { id: 'q_lc1_85', question: 'What are participants asked to bring?', options: JSON.stringify(['A notebook', 'A laptop', 'A textbook', 'A name badge']), answer: 0 },
    { id: 'q_lc1_86', question: 'What will happen at the end of the workshop?', options: JSON.stringify(['Certificates will be awarded', 'A test will be given', 'Feedback forms will be collected', 'A networking session will begin']), answer: 2 },
    { id: 'q_lc1_87', question: 'Who is the intended audience?', options: JSON.stringify(['New employees', 'Senior managers', 'Sales representatives', 'Customer service staff']), answer: 0 },
    { id: 'q_lc1_88', question: 'How long will the workshop last?', options: JSON.stringify(['One hour', 'Two hours', 'Half a day', 'A full day']), answer: 1 },
    { id: 'q_lc1_89', question: 'What is the speaker main purpose?', options: JSON.stringify(['To announce a policy change', 'To introduce a training program', 'To promote a product', 'To review annual results']), answer: 1 },
    { id: 'q_lc1_90', question: 'What does the speaker recommend?', options: JSON.stringify(['Taking notes during the session', 'Asking questions at the end', 'Working in small groups', 'Completing assignments online']), answer: 2 },
    { id: 'q_lc1_91', question: 'What will participants receive?', options: JSON.stringify(['A certificate of completion', 'A list of resources', 'A feedback survey', 'A printed handbook']), answer: 0 },
    { id: 'q_lc1_92', question: 'Where is the workshop taking place?', options: JSON.stringify(['In the main conference room', 'In the training center', 'In the auditorium', 'Online via video call']), answer: 0 },
    { id: 'q_lc1_93', question: 'What should participants do if they cannot attend?', options: JSON.stringify(['Notify their supervisor', 'Send an email to the organizer', 'Reschedule for another session', 'Watch a recording later']), answer: 1 },
    { id: 'q_lc1_94', question: 'What is mentioned about the materials?', options: JSON.stringify(['They are provided free of charge', 'They must be purchased separately', 'They are available online', 'They will be mailed to participants']), answer: 0 },
  ];

  for (const f of fixes) {
    await p.question.update({ where: { id: f.id }, data: { question: f.question, options: f.options, answer: f.answer } });
  }
  console.log('✅ Fixed', fixes.length, 'placeholder questions');

  const remaining = await p.question.findMany({ where: { id: { startsWith: 'q_lc1_' }, options: { contains: 'Option A' } } });
  console.log('Remaining placeholders:', remaining.length);

  await p.$disconnect();
})();
