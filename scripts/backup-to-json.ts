import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Manual parsing of .env file to load variables
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

// Map variables for Prisma Client
if (process.env.DATABASE_URL && !process.env.POSTGRES_PRISMA_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL
}
if (process.env.DIRECT_URL && !process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DIRECT_URL
}

const prisma = new PrismaClient()

// List of all Prisma models in camelCase (matching Prisma Client property names)
const models = [
  'user',
  'event',
  'registration',
  'representative',
  'news',
  'convention',
  'newsCategory',
  'eventCategory',
  'notification',
  'analyticEvent',
  'newsletterSubscriber',
  'piazzaArtist',
  'piazzaProgramItem',
  'piazzaMediaItem',
  'piazzaSettings',
  'piazzaSponsor',
  'organigrammaMember',
  'serviceCategory',
  'serviceItem',
  'whatsAppGroup',
  'guide',
  'guideStep',
  'gradeSimulation',
  'bienniumConfig',
  'organigrammaConfig',
  'mediaLibraryItem',
  'deadlineCountdown',
  'deadlineAlert',
  'rateLimit'
]

async function main() {
  console.log('🔄 Avvio del backup del database in formato JSON...')
  
  const backupData: Record<string, any> = {
    metadata: {
      timestamp: new Date().toISOString(),
      version: '1.0'
    },
    tables: {}
  }
  
  for (const model of models) {
    try {
      console.log(`📡 Lettura tabella: ${model}...`)
      // @ts-ignore
      const records = await prisma[model].findMany()
      backupData.tables[model] = records
      console.log(`   ✅ Letti ${records.length} record.`)
    } catch (err: any) {
      console.error(`   ❌ Errore durante la lettura della tabella ${model}:`, err.message)
    }
  }
  
  // Ensure the backups directory exists
  const backupsDir = path.resolve(__dirname, '../backups')
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true })
  }
  
  // Save backup file
  const dateStr = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-')
  const backupFileName = `db_backup_${dateStr}.json`
  const backupFilePath = path.join(backupsDir, backupFileName)
  
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8')
  console.log(`\n🎉 Backup completato con successo!`)
  console.log(`💾 File salvato in: ${backupFilePath}`)
}

main()
  .catch((e) => {
    console.error('❌ Errore critico durante il backup:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
