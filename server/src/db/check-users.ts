import 'dotenv/config';
import { pool } from './client.js';

async function checkUsers() {
  try {
    const usersResult = await pool.query('SELECT id, email, password_hash FROM users LIMIT 5');
    console.log('📊 Users in database:', usersResult.rows);
    
    const accountsResult = await pool.query('SELECT id, "userId", "accountId", "providerId" FROM account LIMIT 5');
    console.log('📊 Accounts in database:', accountsResult.rows);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();
