import 'dotenv/config';
import { pool } from './client.js';

async function checkAccountPasswords() {
  try {
    const result = await pool.query(`
      SELECT a.id, a."userId", a."accountId", a."providerId", 
             CASE WHEN a.password IS NULL THEN 'NULL' ELSE 'HAS_PASSWORD' END as password_status,
             u.password_hash IS NOT NULL as user_has_hash
      FROM account a
      JOIN users u ON a."userId" = u.id
      WHERE a."providerId" = 'credential'
      LIMIT 5
    `);
    console.log('📊 Account passwords status:', result.rows);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAccountPasswords();
