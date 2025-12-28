import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
export const authRouter = router({
    register: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
    }))
        .mutation(async ({ ctx, input }) => {
        const { email, password } = input;
        const existing = await ctx.db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'Email already registered',
            });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = randomUUID();
        await ctx.db.query('INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)', [userId, email, passwordHash]);
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await ctx.db.query('INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)', [sessionId, userId, expiresAt]);
        return { sessionId };
    }),
    login: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string(),
    }))
        .mutation(async ({ ctx, input }) => {
        const { email, password } = input;
        const result = await ctx.db.query('SELECT id, password_hash FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid credentials',
            });
        }
        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid credentials',
            });
        }
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await ctx.db.query('INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)', [sessionId, user.id, expiresAt]);
        return { sessionId };
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
        if (ctx.sessionId) {
            await ctx.db.query('DELETE FROM sessions WHERE id = $1', [ctx.sessionId]);
        }
        return { success: true };
    }),
});
//# sourceMappingURL=auth.js.map