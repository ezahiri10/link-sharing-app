import { z } from 'zod'
import { router, protectedProcedure } from './router'

export const linksRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query(
      `SELECT * FROM links
       WHERE user_id = $1
       ORDER BY display_order ASC`,
      [ctx.user.id]
    )

    return result.rows
  }),

  create: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db.query(
        `INSERT INTO links (user_id, platform, url)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [ctx.user.id, input.platform, input.url]
      )

      return result.rows[0]
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        platform: z.string(),
        url: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db.query(
        `UPDATE links
         SET platform = $1, url = $2
         WHERE id = $3 AND user_id = $4
         RETURNING *`,
        [input.platform, input.url, input.id, ctx.user.id]
      )

      return result.rows[0]
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.query(
        `DELETE FROM links
         WHERE id = $1 AND user_id = $2`,
        [input.id, ctx.user.id]
      )

      return { success: true }
    }),
})
