import 'dotenv/config';
import { pool } from './client.js';

async function addColumns() {
  try {
    console.log('🔄 Adding Better Auth columns to users table...');
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name TEXT,
      ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      
      -- Update existing records
      UPDATE users SET name = email WHERE name IS NULL;
      UPDATE users SET "createdAt" = created_at WHERE "createdAt" IS NULL;
      UPDATE users SET "updatedAt" = created_at WHERE "updatedAt" IS NULL;
    `);
    
    console.log('✅ Columns added successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

addColumns();
