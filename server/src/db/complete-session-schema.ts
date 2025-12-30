import 'dotenv/config';
import { pool } from './client.js';

async function addAllSessionColumns() {
  try {
    console.log('🔄 Adding all Better Auth session columns...\n');
    
    // Add token, ipAddress, userAgent columns
    await pool.query(`
      ALTER TABLE sessions 
      ADD COLUMN IF NOT EXISTS token TEXT,
      ADD COLUMN IF NOT EXISTS "ipAddress" TEXT,
      ADD COLUMN IF NOT EXISTS "userAgent" TEXT,
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    
    console.log('✅ All session columns added\n');
    
    // Update view
    await pool.query(`
      CREATE OR REPLACE VIEW "session" AS 
      SELECT 
        id,
        user_id,
        expires_at,
        "expiresAt",
        token,
        "ipAddress",
        "userAgent",
        "createdAt",
        "updatedAt"
      FROM sessions;
    `);
    
    console.log('✅ Session view updated\n');
    
    // Update triggers
    await pool.query(`
      DROP TRIGGER IF EXISTS session_insert ON "session";
      DROP TRIGGER IF EXISTS session_update ON "session";
      DROP TRIGGER IF EXISTS session_delete ON "session";
      
      CREATE OR REPLACE FUNCTION session_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO sessions (
          id, user_id, expires_at, "expiresAt", token,
          "ipAddress", "userAgent", "createdAt", "updatedAt"
        ) VALUES (
          NEW.id, 
          NEW.user_id, 
          COALESCE(NEW.expires_at, NEW."expiresAt"),
          COALESCE(NEW."expiresAt", NEW.expires_at),
          NEW.token,
          NEW."ipAddress",
          NEW."userAgent",
          COALESCE(NEW."createdAt", CURRENT_TIMESTAMP),
          COALESCE(NEW."updatedAt", CURRENT_TIMESTAMP)
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
          "expiresAt" = COALESCE(NEW."expiresAt", NEW.expires_at),
          token = NEW.token,
          "ipAddress" = NEW."ipAddress",
          "userAgent" = NEW."userAgent",
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION session_delete_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM sessions WHERE id = OLD.id;
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER session_insert
        INSTEAD OF INSERT ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_insert_trigger();
        
      CREATE TRIGGER session_update
        INSTEAD OF UPDATE ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_update_trigger();
        
      CREATE TRIGGER session_delete
        INSTEAD OF DELETE ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_delete_trigger();
    `);
    
    console.log('✅ Session triggers updated\n');
    
    await pool.end();
    console.log('✅ Sessions table fully configured for Better Auth');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

addAllSessionColumns();
