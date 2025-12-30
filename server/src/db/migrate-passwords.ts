import 'dotenv/config';
import { pool } from './client.js';

async function migratePasswords() {
  try {
    console.log('🔄 Migrating existing user passwords to account table...');
    
    // Copy passwords from users table to account table for Better Auth
    const result = await pool.query(`
      INSERT INTO account (id, "userId", "accountId", "providerId", password, "createdAt", "updatedAt")
      SELECT 
        gen_random_uuid()::text as id,
        id as "userId",
        email as "accountId",
        'credential' as "providerId",
        password_hash as password,
        created_at as "createdAt",
        created_at as "updatedAt"
      FROM users
      WHERE id NOT IN (
        SELECT "userId" FROM account WHERE "providerId" = 'credential'
      )
      ON CONFLICT DO NOTHING;
    `);
    
    console.log(`✅ Migrated ${result.rowCount} user passwords to account table`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to migrate passwords:', error);
    process.exit(1);
  }
}

migratePasswords();
