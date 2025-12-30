import 'dotenv/config';
import { db } from './client.js';

async function testKyselyQuery() {
  try {
    console.log('🔍 Testing Kysely account query...\n');
    
    // Simulate what Better Auth does
    const userId = '8c0374d1721c6174ec3382099d75a3a2'; // zahiri@gmail.com
    
    console.log('Query 1: Direct Kysely query (what Better Auth uses)');
    const result1 = await db
      .selectFrom('account')
      .selectAll()
      .where('userId', '=', userId)
      .limit(100)
      .execute();
    
    console.log('Results:', result1.length);
    if (result1.length > 0) {
      console.log('First result:', result1[0]);
      console.log('Has password field:', 'password' in result1[0]);
      console.log('Password value:', result1[0].password);
    }
    
    console.log('\n\nQuery 2: Direct SQL query');
    const result2 = await db.executeQuery({
      sql: 'SELECT * FROM account WHERE "userId" = $1 LIMIT 100',
      parameters: [userId],
    });
    
    console.log('Results:', result2.rows.length);
    if (result2.rows.length > 0) {
      console.log('First result:', result2.rows[0]);
    }
    
    await db.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

testKyselyQuery();
