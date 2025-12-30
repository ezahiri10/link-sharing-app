import 'dotenv/config';
import { pool } from './client.js';

async function fixAccountIds() {
  try {
    console.log('🔄 Fixing account accountId values...');
    
    // The accountId for credential provider should be the email (identifier)
    // Currently it seems to be the email already, let me verify
    const result = await pool.query(`
      SELECT a.id, a."accountId", u.email
      FROM account a
      JOIN users u ON a."userId" = u.id
      WHERE a."providerId" = 'credential';
    `);
    
    console.log('Current account records:');
    console.table(result.rows);
    
    // The accountId should match the email for credential provider
    // Update any that don't match
    const updateResult = await pool.query(`
      UPDATE account a
      SET "accountId" = u.email
      FROM users u
      WHERE a."userId" = u.id 
        AND a."providerId" = 'credential'
        AND a."accountId" != u.email
      RETURNING a.id, a."accountId", u.email;
    `);
    
    console.log(`\n✅ Updated ${updateResult.rowCount} account records`);
    if (updateResult.rowCount > 0) {
      console.table(updateResult.rows);
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

fixAccountIds();
