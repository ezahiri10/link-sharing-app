import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('📝 Register attempt:', input.email);
        
        const { email, password } = input;

        // Check if user exists
        const existing = await ctx.db.query(
          'SELECT id FROM users WHERE email = $1',
          [email]
        );

        if (existing.rows.length > 0) {
          throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const userId = randomUUID();
        await ctx.db.query(
          'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)',
          [userId, email, passwordHash]
        );

        console.log('✅ User created:', userId);

        // Create session
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await ctx.db.query(
          'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
          [sessionId, userId, expiresAt]
        );

        console.log('✅ Session created:', sessionId);

        return { sessionId };
      } catch (error) {
        console.error('❌ Registration error:', error);
        throw error;
      }
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('🔑 Login attempt:', input.email);
        
        const { email, password } = input;

        // Find user
        const result = await ctx.db.query(
          'SELECT id, password_hash FROM users WHERE email = $1',
          [email]
        );

        if (result.rows.length === 0) {
          throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Create session
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await ctx.db.query(
          'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
          [sessionId, user.id, expiresAt]
        );

        console.log('✅ Login successful:', sessionId);

        return { sessionId };
      } catch (error) {
        console.error('❌ Login error:', error);
        throw error;
      }
    }),
});
