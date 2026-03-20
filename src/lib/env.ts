import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file explicitly for Prisma
const envPath = resolve(process.cwd(), '.env')
config({ path: envPath, override: true })

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL'] as const

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not defined`)
  }
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  DIRECT_URL: process.env.DIRECT_URL!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
} as const
