import { initTRPC, TRPCError } from '@trpc/server';
import { pool } from './db/client.js';
export const createContext = ({ req, res }) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    return {
        req,
        res,
        db: pool,
        sessionId,
    };
};
const t = initTRPC.context().create();
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
    if (!ctx.sessionId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    const result = await ctx.db.query('SELECT s.user_id, u.email, u.first_name, u.last_name, u.image FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = $1 AND s.expires_at > NOW()', [ctx.sessionId]);
    if (result.rows.length === 0) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired session' });
    }
    return next({
        ctx: {
            ...ctx,
            user: result.rows[0],
        },
    });
});
//# sourceMappingURL=trpc.js.map