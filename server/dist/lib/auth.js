import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { pool } from '../db/client.js';
const scryptAsync = promisify(scrypt);
export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(password, salt, 64));
    return `${buf.toString('hex')}.${salt}`;
}
export async function comparePassword(supplied, stored) {
    const [hashedPassword, salt] = stored.split('.');
    const buf = (await scryptAsync(supplied, salt, 64));
    return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buf);
}
export function generateSessionId() {
    return randomBytes(32).toString('hex');
}
export function generateUserId() {
    return randomBytes(16).toString('hex');
}
export async function createSession(userId) {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query('INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)', [sessionId, userId, expiresAt]);
    return sessionId;
}
export async function getSessionUser(sessionId) {
    const result = await pool.query(`SELECT u.* FROM users u 
     JOIN sessions s ON s.user_id = u.id 
     WHERE s.id = $1 AND s.expires_at > NOW()`, [sessionId]);
    return result.rows[0] || null;
}
export async function deleteSession(sessionId) {
    await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}
//# sourceMappingURL=auth.js.map