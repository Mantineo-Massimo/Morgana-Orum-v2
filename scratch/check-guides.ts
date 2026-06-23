import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const guides = await prisma.guide.findMany({
        include: { steps: true }
    })
    console.log('Guides in DB:')
    guides.forEach(g => {
        console.log(`- ID: ${g.id}, Title: ${g.title}, hasCustomComponent: ${g.hasCustomComponent}, stepsCount: ${g.steps.length}`)
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
