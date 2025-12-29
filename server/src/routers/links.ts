import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc.js';

export const linksRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query(
      'SELECT id, platform, url, display_order FROM links WHERE user_id = $1 ORDER BY display_order ASC',
      [ctx.user.id]
    );
    return result.rows;
  }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query(
        'SELECT id, platform, url FROM links WHERE user_id = $1 ORDER BY display_order ASC',
        [input.userId]
      );
      return result.rows;
    }),

  create: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { platform, url } = input;

      const maxOrder = await ctx.db.query(
        'SELECT COALESCE(MAX(display_order), -1) as max FROM links WHERE user_id = $1',
        [ctx.user.id]
      );

      const displayOrder = maxOrder.rows[0].max + 1;

      const result = await ctx.db.query(
        'INSERT INTO links (user_id, platform, url, display_order) VALUES ($1, $2, $3, $4) RETURNING id, platform, url, display_order',
        [ctx.user.id, platform, url, displayOrder]
      );

      return result.rows[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, platform, url } = input;

      const result = await ctx.db.query(
        'UPDATE links SET platform = $1, url = $2 WHERE id = $3 AND user_id = $4 RETURNING id, platform, url, display_order',
        [platform, url, id, ctx.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Link not found');
      }

      return result.rows[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.query(
        'DELETE FROM links WHERE id = $1 AND user_id = $2',
        [input.id, ctx.user.id]
      );

      return { success: true };
    }),

  reorder: protectedProcedure
    .input(
      z.object({
        links: z.array(
          z.object({
            id: z.number(),
            position: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const client = await ctx.db.connect();
      try {
        await client.query('BEGIN');

        for (const link of input.links) {
          await client.query(
            'UPDATE links SET display_order = $1 WHERE id = $2 AND user_id = $3',
            [link.position, link.id, ctx.user.id]
          );
        }

        await client.query('COMMIT');
        return { success: true };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }),
});
