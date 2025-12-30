import 'dotenv/config';
import { pool } from './client.js';

async function fixTriggers() {
  try {
    console.log('🔄 Fixing user view triggers...');
    
    // Better Auth only provides: id, email, name, emailVerified, image, createdAt, updatedAt
    // It does NOT provide password_hash, first_name, last_name, profile_email
    // Those fields are custom to our schema
    
    await pool.query(`
      CREATE OR REPLACE FUNCTION user_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO users (
          id, 
          email, 
          name, 
          "emailVerified", 
          image, 
          "createdAt", 
          "updatedAt",
          first_name,
          last_name,
          profile_email,
          created_at
        ) VALUES (
          NEW.id, 
          NEW.email, 
          COALESCE(NEW.name, NEW.email),
          COALESCE(NEW."emailVerified", false),
          NEW.image,
          COALESCE(NEW."createdAt", CURRENT_TIMESTAMP),
          COALESCE(NEW."updatedAt", CURRENT_TIMESTAMP),
          '',  -- first_name empty by default
          '',  -- last_name empty by default  
          NULL, -- profile_email null by default
          COALESCE(NEW.created_at, CURRENT_TIMESTAMP)
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION user_update_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE users SET 
          email = NEW.email,
          name = COALESCE(NEW.name, NEW.email),
          "emailVerified" = COALESCE(NEW."emailVerified", false),
          image = NEW.image,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    console.log('✅ Triggers fixed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

fixTriggers();
