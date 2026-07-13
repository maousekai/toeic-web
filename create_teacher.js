const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
(async () => {
    const h = await bcrypt.hash('teacher123', 10);
    await p.user.upsert({
        where: { email: 'teacher@toeic.com' },
        update: { role: 'TEACHER', passwordHash: h },
        create: { email: 'teacher@toeic.com', name: 'Teacher', passwordHash: h, role: 'TEACHER' }
    });
    console.log('✅ Teacher created');
    await p.$disconnect();
})();
