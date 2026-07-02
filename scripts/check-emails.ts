import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Manual parsing of .env file
const envPath = path.resolve(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const index = trimmed.indexOf('=')
    if (index !== -1) {
      const key = trimmed.substring(0, index).trim()
      let val = trimmed.substring(index + 1).trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1)
      }
      process.env[key] = val
    }
  })
}

// Map variables for Prisma
if (process.env.DATABASE_URL && !process.env.POSTGRES_PRISMA_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL
}
if (process.env.DIRECT_URL && !process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DIRECT_URL
}

const prisma = new PrismaClient()

async function main() {
  const reps = await prisma.representative.findMany({
    where: {
      email: {
        not: null
      }
    },
    select: {
      name: true,
      email: true
    }
  })
  console.log("Representatives with email in DB:")
  console.log(reps)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
