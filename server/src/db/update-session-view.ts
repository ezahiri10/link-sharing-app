import 'dotenv/config';
import { pool } from './client.js';

async function updateSessionView() {
  try {
    console.log('🔄 Updating session view...\n');
    
    // Recreate the view to include expiresAt
    await pool.query(`
      CREATE OR REPLACE VIEW "session" AS 
      SELECT 
        id,
        user_id,
        expires_at,
        "expiresAt"
      FROM sessions;
    `);
    
    console.log('✅ Session view updated with expiresAt column\n');
    
    await pool.end();
    console.log('✅ Done');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    await pool.end();
    process.exit(1);
  }
}

updateSessionView();
