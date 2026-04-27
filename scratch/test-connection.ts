import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany({ take: 1 })
    console.log('Connection successful, users found:', users.length)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
