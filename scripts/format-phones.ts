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

function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length === 12) {
    // Format: +39 340 244 4288 -> +## ### ### ####
    return `+${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 8)} ${digits.substring(8, 12)}`
  } else if (digits.length === 10) {
    // Format: 340 244 4288 (add default +39)
    return `+39 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 10)}`
  } else if (digits.length > 12 && digits.startsWith('39')) {
    // If it has country code 39 but is longer (e.g. 13 digits)
    const cc = digits.substring(0, 2)
    const rest = digits.substring(2)
    // Try to format rest by dividing remaining digits
    return `+${cc} ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`
  }
  
  // Fallback if not matching standard format
  return phone
}

async function main() {
  console.log("Fetching representatives with phone numbers...")
  const reps = await prisma.representative.findMany({
    where: {
      phone: {
        not: null
      }
    },
    select: {
      id: true,
      name: true,
      phone: true
    }
  })

  console.log(`Found ${reps.length} representatives with phone numbers.`)
  let updatedCount = 0

  for (const r of reps) {
    if (!r.phone) continue
    const formatted = formatPhone(r.phone)
    if (formatted !== r.phone) {
      await prisma.representative.update({
        where: { id: r.id },
        data: { phone: formatted }
      })
      console.log(`[*] Formatted phone for "${r.name}": '${r.phone}' -> '${formatted}'`)
      updatedCount++
    }
  }

  console.log(`\nUpdated ${updatedCount} phone numbers successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
