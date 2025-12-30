import 'dotenv/config';
import { pool } from './client.js';

async function createViews() {
  try {
    console.log('🔄 Creating database views for Better Auth...');
    
    // Create view mapping 'users' table to 'user' 
    await pool.query(`
      CREATE OR REPLACE VIEW "user" AS 
      SELECT * FROM users;
    `);
    
    // Create view mapping 'sessions' table to 'session'
    await pool.query(`
      CREATE OR REPLACE VIEW "session" AS 
      SELECT * FROM sessions;
    `);
    
    // Create triggers to make views writable
    await pool.query(`
      CREATE OR REPLACE FUNCTION user_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO users VALUES (NEW.*);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION user_update_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE users SET 
          email = NEW.email,
          password_hash = NEW.password_hash,
          first_name = NEW.first_name,
          last_name = NEW.last_name,
          profile_email = NEW.profile_email,
          image = NEW.image,
          created_at = NEW.created_at
        WHERE id = OLD.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION user_delete_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        DELETE FROM users WHERE id = OLD.id;
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await pool.query(`
      DROP TRIGGER IF EXISTS user_insert ON "user";
      CREATE TRIGGER user_insert
        INSTEAD OF INSERT ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_insert_trigger();
        
      DROP TRIGGER IF EXISTS user_update ON "user";
      CREATE TRIGGER user_update
        INSTEAD OF UPDATE ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_update_trigger();
        
      DROP TRIGGER IF EXISTS user_delete ON "user";
      CREATE TRIGGER user_delete
        INSTEAD OF DELETE ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_delete_trigger();
    `);
    
    // Session triggers
    await pool.query(`
      CREATE OR REPLACE FUNCTION session_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO sessions VALUES (NEW.*);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE OR REPLACE FUNCTION session_update_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE sessions SET 
          user_id = NEW.user_id,
          expires_at = NEW.expires_at,
          created_at = NEW.created_at
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
    `);
    
    await pool.query(`
      DROP TRIGGER IF EXISTS session_insert ON "session";
      CREATE TRIGGER session_insert
        INSTEAD OF INSERT ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_insert_trigger();
        
      DROP TRIGGER IF EXISTS session_update ON "session";
      CREATE TRIGGER session_update
        INSTEAD OF UPDATE ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_update_trigger();
        
      DROP TRIGGER IF EXISTS session_delete ON "session";
      CREATE TRIGGER session_delete
        INSTEAD OF DELETE ON "session"
        FOR EACH ROW
        EXECUTE FUNCTION session_delete_trigger();
    `);
    
    console.log('✅ Database views created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create views:', error);
    process.exit(1);
  }
}

createViews();
