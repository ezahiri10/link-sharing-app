import 'dotenv/config';
import { pool } from './client.js';

async function fixSchema() {
  try {
    console.log('🔄 Fixing schema issues...\n');
    
    // 1. Make password_hash nullable (Better Auth stores passwords in account table)
    console.log('Making password_hash nullable...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN password_hash DROP NOT NULL;
    `);
    console.log('✅ password_hash is now nullable\n');
    
    // 2. Check if account table password column exists and has data
    console.log('Checking account table...');
    const accountCheck = await pool.query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'account' AND column_name = 'password';
    `);
    console.table(accountCheck.rows);
    
    // 3. Sample account data
    const sampleAccount = await pool.query(`
      SELECT 
        id,
        "userId",
        "accountId",
        "providerId",
        SUBSTRING(password, 1, 20) as password_preview,
        LENGTH(password) as password_length
      FROM account
      WHERE "providerId" = 'credential'
      LIMIT 3;
    `);
    console.log('\nSample account records:');
    console.table(sampleAccount.rows);
    
    await pool.end();
    console.log('\n✅ Schema fix complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

fixSchema();
