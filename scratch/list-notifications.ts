import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: "desc" }
    })
    console.log("Found notifications:")
    notifications.forEach(n => {
        console.log(`- ID: ${n.id} | Title: ${n.title} | Link: ${n.link}`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
