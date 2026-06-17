import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const notifications = await prisma.notification.findMany()
    const toDelete: string[] = []

    for (const n of notifications) {
        if (!n.link) continue

        // Extract the resource ID from the URL
        // Pattern: /news/<uuid> or /events/<integer>
        const newsMatch = n.link.match(/\/news\/([a-f0-9-]{36})/)
        const eventMatch = n.link.match(/\/events\/(\d+)/)

        if (newsMatch) {
            const newsId = newsMatch[1]
            const exists = await prisma.news.findUnique({ where: { id: newsId } })
            if (!exists) {
                console.log(`❌ News not found → deleting notification: "${n.title}"`)
                console.log(`   Link: ${n.link}`)
                toDelete.push(n.id)
            } else {
                console.log(`✅ News exists → keeping notification: "${n.title}"`)
            }
        } else if (eventMatch) {
            const eventId = parseInt(eventMatch[1])
            const exists = await prisma.event.findUnique({ where: { id: eventId } })
            if (!exists) {
                console.log(`❌ Event not found → deleting notification: "${n.title}"`)
                console.log(`   Link: ${n.link}`)
                toDelete.push(n.id)
            } else {
                console.log(`✅ Event exists → keeping notification: "${n.title}"`)
            }
        }
    }

    if (toDelete.length > 0) {
        await prisma.notification.deleteMany({ where: { id: { in: toDelete } } })
        console.log(`\nDone. Deleted ${toDelete.length} orphaned notifications.`)
    } else {
        console.log(`\nNo orphaned notifications found.`)
    }
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
