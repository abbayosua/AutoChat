import './env' // Import env first to load environment variables
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log the database URL being used (for debugging)
console.log('DATABASE_URL being used:', process.env.DATABASE_URL?.substring(0, 50) + '...')

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
