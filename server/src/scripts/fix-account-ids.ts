import 'dotenv/config'
import { pool } from '../db/client.js'

async function fixAccountIds() {
  console.log('🔄 Fixing accountIds to match emails...\n')
  
  const result = await pool.query(`
    UPDATE account 
    SET "accountId" = (
      SELECT email 
      FROM "user" 
      WHERE "user".id = account."userId"
    )
    WHERE "providerId" = 'credential' 
    AND "accountId" != (
      SELECT email 
      FROM "user" 
      WHERE "user".id = account."userId"
    )
    RETURNING "accountId"
  `)
  
  console.log(`✅ Updated ${result.rowCount} account(s)`)
  console.log('   New accountIds:', result.rows.map(r => r.accountId).join(', '))
  
  await pool.end()
}

fixAccountIds()
