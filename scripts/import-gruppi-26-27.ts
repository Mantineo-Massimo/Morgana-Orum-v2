import { PrismaClient, WhatsAppGroupCategory } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Manual parsing of .env file (to support direct running via npx tsx)
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
  const jsonPath = '/home/massimo/.gemini/antigravity-ide/brain/05abbf9d-8321-4020-9f44-5c08defabdeb/scratch/cleaned_groups.json'
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf8')
  const groupsToImport = JSON.parse(fileContent)
  
  const targetYear = '2026/2027'
  console.log(`Starting import process for year ${targetYear}...`)
  
  // 1. Ensure AcademicYear exists
  await prisma.academicYear.upsert({
    where: { year: targetYear },
    update: {},
    create: { year: targetYear }
  })
  console.log(`[+] Confirmed academic year "${targetYear}" in database.`)

  // 2. Clear existing groups for this year to prevent duplicates
  const deleted = await prisma.whatsAppGroup.deleteMany({
    where: {
      category: 'ACADEMIC',
      semester: targetYear
    }
  })
  console.log(`[-] Cleared ${deleted.count} existing academic groups for year ${targetYear}.`)

  // 3. Create all new groups
  let createdCount = 0
  for (const g of groupsToImport) {
    try {
      await prisma.whatsAppGroup.create({
        data: {
          name: g.name,
          link: g.link,
          category: g.category as WhatsAppGroupCategory,
          department: g.department,
          order: g.order,
          semester: g.semester,
          isGeneral: g.isGeneral
        }
      })
      createdCount++
    } catch (err: any) {
      console.error(`[X] Error creating group "${g.name}":`, err.message || err)
    }
  }

  console.log("\n==================================")
  console.log("IMPORT COMPLETE:")
  console.log(`Total parsed:  ${groupsToImport.length}`)
  console.log(`Created in DB: ${createdCount}`)
  console.log("==================================")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
