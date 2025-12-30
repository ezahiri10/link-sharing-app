import 'dotenv/config';
import { pool } from './client.js';

async function updateTriggers() {
  try {
    console.log('🔄 Updating user view triggers...');
    
    // Drop old triggers and recreate with new columns
    await pool.query(`
      DROP TRIGGER IF EXISTS user_insert ON "user";
      DROP TRIGGER IF EXISTS user_update ON "user";
      DROP TRIGGER IF EXISTS user_delete ON "user";
      
      CREATE OR REPLACE FUNCTION user_insert_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, 
          profile_email, image, created_at, name, "emailVerified", 
          "createdAt", "updatedAt"
        ) VALUES (
          NEW.id, NEW.email, NEW.password_hash, NEW.first_name, NEW.last_name,
          NEW.profile_email, NEW.image, COALESCE(NEW.created_at, CURRENT_TIMESTAMP),
          COALESCE(NEW.name, NEW.email), COALESCE(NEW."emailVerified", false),
          COALESCE(NEW."createdAt", CURRENT_TIMESTAMP), COALESCE(NEW."updatedAt", CURRENT_TIMESTAMP)
        );
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
          name = COALESCE(NEW.name, NEW.email),
          "emailVerified" = COALESCE(NEW."emailVerified", false),
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER user_insert
        INSTEAD OF INSERT ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_insert_trigger();
        
      CREATE TRIGGER user_update
        INSTEAD OF UPDATE ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_update_trigger();
        
      CREATE TRIGGER user_delete
        INSTEAD OF DELETE ON "user"
        FOR EACH ROW
        EXECUTE FUNCTION user_delete_trigger();
    `);
    
    console.log('✅ Triggers updated successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

updateTriggers();
