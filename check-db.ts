
import { PrismaClient, Association } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const news = await prisma.news.findMany({
        where: {
            published: true,
            date: { lte: new Date() },
            associations: { hasSome: [Association.INSIDE_DICAM, Association.MORGANA_ORUM] }
        }
    })
    console.log('News visible for DICAM:', news.length)
    news.forEach(n => console.log(' - ', n.title, n.associations))

    const allNews = await prisma.news.findMany()
    console.log('Total news in DB:', allNews.length)
    allNews.forEach(n => console.log(' - ALL:', n.title, n.associations))
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
