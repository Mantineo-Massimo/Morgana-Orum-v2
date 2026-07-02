import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Helper function to capitalize names nicely
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!word) return ''
      if (word.includes("'")) {
        return word.split("'").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("'")
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

// Helper to generate UniMe institutional email
function generateUnimeEmail(fullName: string): string {
  const cleanName = fullName
    .toLowerCase()
    .replace(/'/g, '') // remove apostrophes
    .trim()
    .replace(/\s+/g, '.') // replace spaces with dots
  return `${cleanName}@studenti.unime.it`
}

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
  const jsonPath = '/home/massimo/.gemini/antigravity-ide/brain/d7c22f63-ca60-449a-a726-4d3e4889dd89/scratch/parsed_eletti.json'
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf8')
  const jsonRes = JSON.parse(fileContent)
  const dipartimentiRows = jsonRes.data.DIPARTIMENTI
  
  console.log("Updating emails and roles with course names in DB...")
  let emailUpdatedCount = 0
  let roleUpdatedCount = 0

  for (const r of dipartimentiRows) {
    const cells = r.cells
    const aVal = (cells.A || '').trim()
    const bVal = (cells.B || '').trim()
    const cVal = (cells.C || '').trim()
    
    // Skip title rows and headers
    if ((aVal && !bVal && !cVal) || (bVal && aVal === "COGNOME")) {
      continue
    }

    if (bVal) {
      const cognome = aVal
      const nome = bVal
      const fullName = `${toTitleCase(nome)} ${toTitleCase(cognome)}`
      const corso = (cells.D || '').trim()
      
      const isDip = (cells.H || '').toLowerCase().trim() === 'x'
      const isCdl = (cells.I || '').toLowerCase().trim() === 'x'

      // We only care about representatives currently in the DB (which are only the department ones, isDip === true)
      if (!isDip) continue

      try {
        const dbRep = await prisma.representative.findFirst({
          where: {
            name: {
              equals: fullName,
              mode: 'insensitive'
            },
            category: 'DEPARTMENT'
          }
        })

        if (dbRep) {
          const updateData: any = {}
          
          // 1. Generate email if currently missing/null
          if (!dbRep.email) {
            updateData.email = generateUnimeEmail(fullName)
          }

          // 2. Format role to include CdL course if they have both roles
          if (isDip && isCdl) {
            updateData.role = `Consiglio di Dipartimento e CdL in ${corso}`
          } else {
            updateData.role = `Consiglio di Dipartimento`
          }

          // Check if updates are needed
          const needsEmailUpdate = updateData.email && dbRep.email !== updateData.email
          const needsRoleUpdate = updateData.role && dbRep.role !== updateData.role

          if (needsEmailUpdate || needsRoleUpdate) {
            await prisma.representative.update({
              where: { id: dbRep.id },
              data: updateData
            })

            if (needsEmailUpdate) {
              console.log(`[*] Email set for "${fullName}": -> '${updateData.email}'`)
              emailUpdatedCount++
            }
            if (needsRoleUpdate) {
              console.log(`[*] Role updated for "${fullName}": -> '${updateData.role}'`)
              roleUpdatedCount++
            }
          }
        }
      } catch (err: any) {
        console.error(`[X] Error updating "${fullName}":`, err.message || err)
      }
    }
  }

  console.log("\n==================================")
  console.log("UPDATE SUMMARY:")
  console.log(`Emails created: ${emailUpdatedCount}`)
  console.log(`Roles updated:  ${roleUpdatedCount}`)
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
