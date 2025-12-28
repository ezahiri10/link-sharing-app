import { pool } from '../db/client.js';
import { getSessionUser } from '../lib/auth.js';
export async function createContext({ req, res }) {
    const sessionId = req.headers.cookie?.split('session_id=')[1]?.split(';')[0];
    let user = null;
    if (sessionId) {
        try {
            user = await getSessionUser(sessionId);
        }
        catch (error) {
            console.error('Session error:', error);
        }
    }
    return {
        req,
        res,
        db: pool,
        user,
    };
}
//# sourceMappingURL=context.js.map