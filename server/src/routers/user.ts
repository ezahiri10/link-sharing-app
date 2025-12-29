import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary.js';

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query(
      'SELECT id, email, first_name, last_name, image FROM users WHERE id = $1',
      [ctx.user.id]
    );
    return result.rows[0] || null;
  }),

  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query(
        'SELECT id, first_name, last_name, image FROM users WHERE id = $1',
        [input.userId]
      );
      return result.rows[0] || null;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string(),
        avatarBase64: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, avatarBase64 } = input;
      let imageUrl: string | undefined;

      if (avatarBase64) {
        const currentUser = await ctx.db.query(
          'SELECT image FROM users WHERE id = $1',
          [ctx.user.id]
        );

        if (currentUser.rows[0]?.image && currentUser.rows[0].image !== 'https://via.placeholder.com/500') {
          await deleteFromCloudinary(currentUser.rows[0].image).catch(() => {});
        }

        imageUrl = await uploadToCloudinary(avatarBase64);
      }

      const updateQuery = imageUrl
        ? 'UPDATE users SET first_name = $1, last_name = $2, image = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, image'
        : 'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, email, first_name, last_name, image';

      const values = imageUrl
        ? [firstName, lastName, imageUrl, ctx.user.id]
        : [firstName, lastName, ctx.user.id];

      const result = await ctx.db.query(updateQuery, values);
      return result.rows[0];
    }),
});
