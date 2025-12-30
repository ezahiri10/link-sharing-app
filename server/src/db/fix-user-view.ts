import 'dotenv/config';
import { pool } from './client.js';

async function fixUserView() {
  try {
    console.log('🔄 Updating user view to include password from account table...');
    
    // Drop and recreate the user view with password from account
    await pool.query(`
      DROP VIEW IF EXISTS "user" CASCADE;
      
      CREATE VIEW "user" AS 
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.profile_email,
        u.image,
        u.created_at,
        u.email as name,
        false as "emailVerified",
        u.created_at as "createdAt",
        u.created_at as "updatedAt"
      FROM users u;
    `);
    
    console.log('✅ User view updated successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to update view:', error);
    process.exit(1);
  }
}

fixUserView();
