import { z } from 'zod';
import { router, publicProcedure } from './trpc.js';
import { hashPassword, comparePassword, generateUserId, createSession, deleteSession } from '../lib/auth.js';
import { TRPCError } from '@trpc/server';
export const authRouter = router({
    register: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        // Check if user exists
        const existingUser = await ctx.db.query('SELECT id FROM users WHERE email = $1', [input.email]);
        if (existingUser.rows.length > 0) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User already exists. Use another email.',
            });
        }
        // Hash password
        const passwordHash = await hashPassword(input.password);
        const userId = generateUserId();
        // Create user
        const result = await ctx.db.query('INSERT INTO users (id, email, password_hash, first_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, image, created_at', [userId, input.email, passwordHash, input.name || input.email.split('@')[0]]);
        // Create session
        const sessionId = await createSession(userId);
        // Set cookie
        ctx.res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
        return { user: result.rows[0], session: sessionId };
    }),
    login: publicProcedure
        .input(z.object({
        email: z.string().email(),
        password: z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        // Find user
        const result = await ctx.db.query('SELECT * FROM users WHERE email = $1', [input.email]);
        const user = result.rows[0];
        if (!user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid email or password',
            });
        }
        // Verify password
        const isValid = await comparePassword(input.password, user.password_hash);
        if (!isValid) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid email or password',
            });
        }
        // Create session
        const sessionId = await createSession(user.id);
        // Set cookie
        ctx.res.setHeader('Set-Cookie', `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`);
        return {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                image: user.image,
                created_at: user.created_at,
            },
            session: sessionId,
        };
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
        const sessionId = ctx.req.headers.cookie?.split('session_id=')[1]?.split(';')[0];
        if (sessionId) {
            await deleteSession(sessionId);
        }
        // Clear cookie
        ctx.res.setHeader('Set-Cookie', 'session_id=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
        return { success: true };
    }),
});
//# sourceMappingURL=auth.js.map