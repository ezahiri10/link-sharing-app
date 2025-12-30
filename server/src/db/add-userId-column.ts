import 'dotenv/config';
import { pool } from './client.js';

async function addUserIdColumn() {
  try {
    console.log('Adding userId column...');
    
    await pool.query(`
      ALTER TABLE sessions 
      ADD COLUMN IF NOT EXISTS "userId" TEXT;
      
      UPDATE sessions 
      SET "userId" = user_id 
      WHERE "userId" IS NULL;
      
      DROP VIEW IF EXISTS "session" CASCADE;
      
      CREATE VIEW "session" AS 
      SELECT 
        id,
        user_id,
        "userId",
        expires_at,
        "expiresAt",
        token,
        "ipAddress",
        "userAgent",
        "createdAt",
        "updatedAt"
      FROM sessions;
    `);
    
    // Update trigger
    await pool.query(`
      CREATE OR REPLACE FUNCTION session_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO sessions (
          id, user_id, "userId", expires_at, "expiresAt", token,
          "ipAddress", "userAgent", "createdAt", "updatedAt"
        ) VALUES (
          NEW.id, 
          COALESCE(NEW.user_id, NEW."userId"),
          COALESCE(NEW."userId", NEW.user_id),
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
    `);
    
    console.log('✅ Done');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
    process.exit(1);
  }
}

addUserIdColumn();
