import 'dotenv/config';
import { pool } from './client.js';

async function addSessionColumns() {
  try {
    console.log('🔄 Adding Better Auth columns to sessions table...\n');
    
    // Add expiresAt (camelCase) alongside expires_at
    await pool.query(`
      ALTER TABLE sessions 
      ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP;
    `);
    
    // Copy data from expires_at to expiresAt for existing sessions
    await pool.query(`
      UPDATE sessions 
      SET "expiresAt" = expires_at 
      WHERE "expiresAt" IS NULL;
    `);
    
    console.log('✅ expiresAt column added\n');
    
    // Update session view trigger to handle both columns
    await pool.query(`
      CREATE OR REPLACE FUNCTION session_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO sessions (
          id, 
          user_id, 
          expires_at,
          "expiresAt"
        ) VALUES (
          NEW.id, 
          NEW.user_id, 
          COALESCE(NEW.expires_at, NEW."expiresAt"),
          COALESCE(NEW."expiresAt", NEW.expires_at)
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION session_update_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE sessions SET 
          user_id = NEW.user_id,
          expires_at = COALESCE(NEW.expires_at, NEW."expiresAt"),
          "expiresAt" = COALESCE(NEW."expiresAt", NEW.expires_at)
        WHERE id = OLD.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('✅ Session triggers updated\n');
    
    await pool.end();
    console.log('✅ Sessions table ready for Better Auth');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

addSessionColumns();
