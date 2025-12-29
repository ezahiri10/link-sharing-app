import { initTRPC, TRPCError } from '@trpc/server';
import { pool } from './db/client.js';
export const createContext = async ({ req, res }) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    let user = null;
    if (sessionId) {
        const result = await pool.query(`SELECT u.id, u.email, u.first_name, u.last_name, u.image 
       FROM users u 
       JOIN sessions s ON u.id = s.user_id 
       WHERE s.id = $1 AND s.expires_at > NOW()`, [sessionId]);
        user = result.rows[0] || null;
    }
    return {
        req,
        res,
        db: pool,
        user,
    };
};
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({
        ctx: {
            ...ctx,
            user: ctx.user,
        },
    });
});
//# sourceMappingURL=trpc.js.map