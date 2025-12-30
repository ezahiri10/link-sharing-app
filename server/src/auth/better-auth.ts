import { betterAuth } from "better-auth";
import { db, pool } from "../db/client.js";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    db: db,
    type: "postgres",
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    hooks: {
      before: [
        {
          matcher: (ctx) => ctx.path?.includes('/sign-in'),
          handler: async (ctx) => {
            console.log('🔍 Before sign-in hook');
            if (ctx.body && 'email' in ctx.body) {
              const email = ctx.body.email;
              console.log('📧 Login attempt for:', email);
              
              // Debug: manually check account
              const result = await pool.query(`
                SELECT a.id, a."userId", a."accountId", a."providerId",
                       LENGTH(a.password) as password_length,
                       SUBSTRING(a.password, 1, 20) as password_preview
                FROM account a
                JOIN users u ON a."userId" = u.id
                WHERE u.email = $1 AND a."providerId" = 'credential'
              `, [email]);
              
              console.log('🔍 Manual account check:', result.rows);
            }
            return { context: ctx };
          },
        },
      ],
    },
  },
  user: {
    additionalFields: {
      first_name: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      last_name: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      profile_email: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        console.log('🔐 Hashing password');
        const bcrypt = await import('bcrypt');
        return bcrypt.hash(password, 10);
      },
      verify: async (options: any) => {
        const { password, hash } = options;
        if (!password || !hash) return false;
        const bcrypt = await import('bcrypt');
        return bcrypt.compare(password, hash);
      },
    },
  },
  secret: process.env.AUTH_SECRET || "your-super-secret-key-change-in-production-min-32-chars-long",
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:5173"],
});
