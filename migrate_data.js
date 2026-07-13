const { PrismaClient: SQLiteClient } = require('@prisma/client-sqlite');
const { PrismaClient: PGClient } = require('@prisma/client');

const sqlite = new SQLiteClient();
const pg = new PGClient();

async function main() {
    const tables = [
        'user',
        'vipPackage',
        'vocab',
        'grammarLesson',
        'strategy',
        'testSet',
        'teacher',
        'wallet',
        'vipSubscription',
        'paymentTransaction',
        'learner',
        'grammarExercise',
        'question',
        'testAttempt',
        'chatRoom',
        'chatMessage',
        'classSession'
    ];

    for (const table of tables) {
        console.log(`Migrating ${table}...`);
        try {
            const data = await sqlite[table].findMany();
            if (data.length > 0) {
                console.log(`  Found ${data.length} records in ${table}`);
                
                // For PostgreSQL, createMany doesn't return the inserted rows, but skipDuplicates ignores conflicts
                await pg[table].createMany({
                    data,
                    skipDuplicates: true
                });
                console.log(`  Migrated ${table} successfully.`);
            }
        } catch (e) {
            console.error(`  Error migrating ${table}:`, e.message);
        }
    }
    console.log('Migration complete!');
    await sqlite.$disconnect();
    await pg.$disconnect();
}

main().catch(console.error);
