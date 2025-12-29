import 'dotenv/config'
import { pool } from '../db/client.js'

async function checkAccount() {
  console.log('\n📋 All accounts:\n')
  
  const result = await pool.query(`
    SELECT u.email, a."accountId", a."providerId", a.password IS NOT NULL as has_password
    FROM account a 
    JOIN "user" u ON a."userId" = u.id 
    ORDER BY u.email
  `)
  
  console.table(result.rows)
  
  await pool.end()
}

checkAccount()
