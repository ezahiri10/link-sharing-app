import 'dotenv/config';
import { pool } from './client.js';

async function debugAuth() {
  try {
    console.log('🔍 Checking Better Auth configuration...\n');
    
    // Check if account table exists and has correct structure
    const accountTable = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'account'
      ORDER BY ordinal_position;
    `);
    console.log('📊 Account table structure:');
    console.table(accountTable.rows);
    
    // Check existing accounts
    const accounts = await pool.query(`
      SELECT id, "userId", "accountId", "providerId", 
             CASE WHEN password IS NOT NULL THEN 'HAS_PASSWORD' ELSE 'NO_PASSWORD' END as password_status,
             "createdAt"
      FROM account
      LIMIT 5;
    `);
    console.log('\n📊 Existing accounts:');
    console.table(accounts.rows);
    
    // Check users
    const users = await pool.query(`
      SELECT id, email, name, "emailVerified", 
             CASE WHEN password_hash IS NOT NULL THEN 'HAS_HASH' ELSE 'NO_HASH' END as hash_status
      FROM users
      LIMIT 5;
    `);
    console.log('\n📊 Existing users:');
    console.table(users.rows);
    
    // Try to find a specific user and their account
    const testUser = await pool.query(`
      SELECT u.id, u.email, u.name,
             a.id as account_id, a."providerId", 
             CASE WHEN a.password IS NOT NULL THEN 'HAS_PASSWORD' ELSE 'NO_PASSWORD' END as password_status,
             LENGTH(a.password) as password_length
      FROM users u
      LEFT JOIN account a ON u.id = a."userId"
      WHERE u.email = $1;
    `, ['1234@gmail.com']);
    
    console.log('\n📊 Test user (1234@gmail.com):');
    console.table(testUser.rows);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

debugAuth();
