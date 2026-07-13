const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const p = new PrismaClient();
(async () => {
    const h = await bcrypt.hash('admin123', 10);
    await p.user.upsert({
        where: { email: 'admin@toeic.com' },
        update: { role: 'ADMIN', passwordHash: h },
        create: { email: 'admin@toeic.com', name: 'Admin', passwordHash: h, role: 'ADMIN' }
    });
    console.log('✅ Admin created');
    await p.$disconnect();
})();
