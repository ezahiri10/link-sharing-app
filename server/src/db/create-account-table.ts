import 'dotenv/config';
import { pool } from './client.js';

async function createAccountTable() {
  try {
    console.log('🔄 Creating account table for Better Auth...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "expiresAt" TIMESTAMP,
        password TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_account_userId ON account("userId");
      CREATE INDEX IF NOT EXISTS idx_account_providerId ON account("providerId");
    `);
    
    console.log('✅ Account table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create account table:', error);
    process.exit(1);
  }
}

createAccountTable();
