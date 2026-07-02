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
  console.log("Identifying representatives to delete (Course of Study only)...")
  
  // Find representatives with category = DEPARTMENT whose role is not department-related
  const toDelete = await prisma.representative.findMany({
    where: {
      category: 'DEPARTMENT',
      NOT: {
        role: {
          in: ['Consiglio di Dipartimento', 'Consiglio di Dipartimento e Corso di Laurea']
        }
      }
    },
    select: {
      id: true,
      name: true,
      role: true,
      department: true
    }
  })
  
  console.log(`Found ${toDelete.length} representatives to delete.`)
  if (toDelete.length > 0) {
    console.log("Sample of representatives being deleted:")
    console.log(toDelete.slice(0, 10))
    
    // Delete them
    const deleteResult = await prisma.representative.deleteMany({
      where: {
        id: {
          in: toDelete.map(r => r.id)
        }
      }
    })
    console.log(`Successfully deleted ${deleteResult.count} representatives from the database.`)
  } else {
    console.log("No representatives to delete.")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
