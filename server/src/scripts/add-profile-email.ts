import 'dotenv/config';
import { pool } from '../db/client.js';

async function addProfileEmail() {
  try {
    console.log('🔄 Adding profile_email column...');
    
    // Add profile_email column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_email TEXT;
    `);
    
    console.log('✅ profile_email column added');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

addProfileEmail();
