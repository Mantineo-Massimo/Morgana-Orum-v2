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
  console.log("Fixing representative terms in DB...")
  
  // 1. Update ALL representatives to standard 2025-2027 term
  const allUpdate = await prisma.representative.updateMany({
    data: {
      term: '2025-2027',
      mandateYears: 2
    }
  })
  console.log(`Reset all ${allUpdate.count} representatives to term 2025-2027 (2 years).`)

  // 2. Override ERSU representatives to 2023-2027 term
  const ersuUpdate = await prisma.representative.updateMany({
    where: {
      OR: [
        { role: { contains: 'ERSU', mode: 'insensitive' } },
        { department: { contains: 'ERSU', mode: 'insensitive' } }
      ]
    },
    data: {
      term: '2023-2027',
      mandateYears: 4
    }
  })
  console.log(`Updated ${ersuUpdate.count} ERSU representatives to term 2023-2027 (4 years).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
