import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from './trpc.js'

export const userRouter = router({
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user || null
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        image: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db.query(
        `UPDATE users
         SET first_name = $1,
             last_name = $2,
             email = $3,
             image = $4
         WHERE id = $5
         RETURNING *`,
        [
          input.firstName,
          input.lastName,
          input.email,
          input.image ?? null,
          ctx.user.id,
        ]
      )

      return result.rows[0]
    }),

  getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const userResult = await ctx.db.query(
        `SELECT id, first_name, last_name, image
         FROM users
         WHERE id = $1`,
        [input.userId]
      )

      const linksResult = await ctx.db.query(
        `SELECT platform, url
         FROM links
         WHERE user_id = $1
         ORDER BY display_order ASC`,
        [input.userId]
      )

      return {
        user: userResult.rows[0],
        links: linksResult.rows,
      }
    }),
})
