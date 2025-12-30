import 'dotenv/config';
import { pool } from './client.js';

async function showColumns() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'account'
      ORDER BY ordinal_position
    `);
    console.log('📊 Account table columns:', result.rows);
    
    const sample = await pool.query('SELECT * FROM account LIMIT 1');
    console.log('📊 Sample account record:', sample.rows[0]);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

showColumns();
