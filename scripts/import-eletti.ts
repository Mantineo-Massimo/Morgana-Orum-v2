import { PrismaClient, Association } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Helper function to capitalize names nicely
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!word) return ''
      // Handle apostrophes like D'AMICO or MULE'
      if (word.includes("'")) {
        return word.split("'").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("'")
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
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

// Department name mapping
const deptMapping: Record<string, string> = {
  'GIURISPRUDENZA': 'Dipartimento di Giurisprudenza',
  'DICAM': 'Dipartimento di Civiltà Antiche e Moderne (DICAM)',
  'ECONOMIA': 'Dipartimento di Economia',
  'INGEGNERIA': 'Dipartimento di Ingegneria',
  'DIMED': 'Dipartimento di Medicina Clinica e Sperimentale (DIMED)',
  'PATOLOGIAUMANADETEV': 'Dipartimento di Patologia Umana dell\'Adulto e dell\'Età Evolutiva "Gaetano Barresi"',
  'BIOMORF': 'Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)',
  'CHIBIOFARAM': 'Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)',
  'COSPECS': 'Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)',
  'MIFT': 'Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)',
  'SCIPOG': 'Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)',
  'VETERINARIA': 'Dipartimento di Scienze Veterinarie'
}

async function main() {
  const jsonPath = '/home/massimo/.gemini/antigravity-ide/brain/d7c22f63-ca60-449a-a726-4d3e4889dd89/scratch/parsed_eletti.json'
  
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found at ${jsonPath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf8')
  const jsonRes = JSON.parse(fileContent)
  
  const dipartimentiRows = jsonRes.data.DIPARTIMENTI
  
  let currentDeptName = ''
  let createdCount = 0
  let skippedCount = 0
  let errorCount = 0
  
  console.log("Starting import process...")
  
  for (const r of dipartimentiRows) {
    const cells = r.cells
    const aVal = (cells.A || '').trim()
    const bVal = (cells.B || '').trim()
    const cVal = (cells.C || '').trim()
    
    // Check if it's a department section title row
    if (aVal && !bVal && !cVal) {
      if (deptMapping[aVal]) {
        currentDeptName = deptMapping[aVal]
      } else {
        currentDeptName = aVal
      }
      console.log(`\nProcessing Department Section: "${currentDeptName}"`)
      continue
    }
    
    // If not a title and we have a name (excluding header row)
    if (bVal && aVal !== "COGNOME") {
      const cognome = aVal
      const nome = bVal
      
      const cleanNome = toTitleCase(nome)
      const cleanCognome = toTitleCase(cognome)
      const fullName = `${cleanNome} ${cleanCognome}`
      
      const isDip = (cells.H || '').toLowerCase().trim() === 'x'
      const isCdl = (cells.I || '').toLowerCase().trim() === 'x'
      
      // Determine the role
      let role = 'Rappresentante'
      if (isDip && isCdl) {
        role = 'Consiglio di Dipartimento e Corso di Laurea'
      } else if (isDip) {
        role = 'Consiglio di Dipartimento'
      } else if (isCdl) {
        role = 'Consiglio di Corso di Laurea'
      }
      
      // Determine list name
      const listInSheet = (cells.E || '').trim()
      const listName = listInSheet === 'ORUM' ? 'O.R.U.M.' : listInSheet
      
      // Determine email and phone
      const rawEmail = (cells.F || '').trim()
      const email = (rawEmail === 'Non trovato' || !rawEmail) ? null : rawEmail
      
      const rawPhone = (cells.G || '').trim()
      const phone = !rawPhone ? null : rawPhone
      
      // Check if representative already exists in DB
      try {
        const existing = await prisma.representative.findFirst({
          where: {
            name: {
              equals: fullName,
              mode: 'insensitive'
            },
            category: 'DEPARTMENT',
            department: currentDeptName
          }
        })
        
        if (existing) {
          console.log(`[-] Skipped: "${fullName}" (already exists in DB)`)
          skippedCount++
        } else {
          // Create representative
          await prisma.representative.create({
            data: {
              name: fullName,
              listName: listName,
              category: 'DEPARTMENT',
              department: currentDeptName,
              role: role,
              term: '2025-2027',
              mandateYears: 2,
              email: email,
              phone: phone,
              association: Association.MORGANA_ORUM
            }
          })
          console.log(`[+] Created: "${fullName}" | List: ${listName} | Role: ${role}`)
          createdCount++
        }
      } catch (err: any) {
        console.error(`[X] Error creating "${fullName}":`, err.message || err)
        errorCount++
      }
    }
  }
  
  console.log("\n==================================")
  console.log("IMPORT SUMMARY:")
  console.log(`Created: ${createdCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Errors:  ${errorCount}`)
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
