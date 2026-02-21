import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
    })

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'SUPER_ADMIN' }
        })
        console.log(`User ${user.email} promoted to SUPER_ADMIN`)
    } else {
        console.log('No users found in database')
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
