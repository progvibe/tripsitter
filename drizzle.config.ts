import type { Config } from "drizzle-kit"

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_NEON_DATABASE_URL!,
    database: 'neondb',
    host: process.env.NEON_HOST,
  },
} satisfies Config
