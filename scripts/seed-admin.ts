/**
 * Seed / reset the Admin account.
 *
 * Idempotent: safe to re-run. If the admin email already exists, it will be
 * upgraded to role ADMIN and its password will be reset to the configured one.
 *
 * Default credentials (override via env if you want):
 *   ADMIN_EMAIL=admin@toeic.com
 *   ADMIN_PASSWORD=admin123
 *   ADMIN_NAME=Administrator
 *
 * Usage:
 *   bun run scripts/seed-admin.ts
 */
import bcrypt from 'bcryptjs'
import { db } from '../src/lib/db'

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@toeic.com').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Administrator'

  console.log(`Seeding admin account…`)
  console.log(`  email: ${email}`)
  console.log(`  name : ${name}`)

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await db.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
    },
    select: { id: true, email: true, name: true, role: true },
  })

  console.log(`✅ Admin account ready:`)
  console.log(user)

  await db.$disconnect()
}

main().catch((e) => {
  console.error('❌ seed-admin failed:', e)
  process.exit(1)
})
