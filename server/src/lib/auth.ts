import { randomBytes, scrypt, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { pool } from '../db/client.js'

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString('hex')}.${salt}`
}

export async function comparePassword(
  supplied: string,
  stored: string
): Promise<boolean> {
  const [hashedPassword, salt] = stored.split('.')
  const buf = (await scryptAsync(supplied, salt, 64)) as Buffer
  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buf)
}

export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

export function generateUserId(): string {
  return randomBytes(16).toString('hex')
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = generateSessionId()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await pool.query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  )

  return sessionId
}

export async function getSessionUser(sessionId: string) {
  const result = await pool.query(
    `SELECT u.* FROM users u 
     JOIN sessions s ON s.user_id = u.id 
     WHERE s.id = $1 AND s.expires_at > NOW()`,
    [sessionId]
  )

  return result.rows[0] || null
}

export async function deleteSession(sessionId: string) {
  await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId])
}
