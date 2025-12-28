import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../lib/cloudinary.js';
export const userRouter = router({
    me: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.query('SELECT id, email, first_name, last_name, profile_email, image FROM users WHERE id = $1', [ctx.user.user_id]);
        return result.rows[0] || null;
    }),
    // PUBLIC ROUTE - for preview page
    getUserById: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ ctx, input }) => {
        const result = await ctx.db.query('SELECT id, first_name, last_name, profile_email, image FROM users WHERE id = $1', [input.userId]);
        return result.rows[0] || null;
    }),
    updateProfile: protectedProcedure
        .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string(),
        avatarBase64: z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
        const { firstName, lastName, email, avatarBase64 } = input;
        let imageUrl;
        if (avatarBase64) {
            const currentUser = await ctx.db.query('SELECT image FROM users WHERE id = $1', [ctx.user.user_id]);
            if (currentUser.rows[0]?.image && currentUser.rows[0].image !== 'https://via.placeholder.com/500') {
                await deleteFromCloudinary(currentUser.rows[0].image).catch(() => { });
            }
            imageUrl = await uploadToCloudinary(avatarBase64);
        }
        const profileEmail = email.trim() || null;
        const updateQuery = imageUrl
            ? 'UPDATE users SET first_name = $1, last_name = $2, profile_email = $3, image = $4 WHERE id = $5 RETURNING id, email, first_name, last_name, profile_email, image'
            : 'UPDATE users SET first_name = $1, last_name = $2, profile_email = $3 WHERE id = $4 RETURNING id, email, first_name, last_name, profile_email, image';
        const values = imageUrl
            ? [firstName, lastName, profileEmail, imageUrl, ctx.user.user_id]
            : [firstName, lastName, profileEmail, ctx.user.user_id];
        const result = await ctx.db.query(updateQuery, values);
        return result.rows[0];
    }),
});
//# sourceMappingURL=user.js.map