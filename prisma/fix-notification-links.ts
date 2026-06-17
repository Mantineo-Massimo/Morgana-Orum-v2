import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
    const notifications = await prisma.notification.findMany()

    let fixed = 0

    for (const n of notifications) {
        if (!n.link) continue

        let newLink = n.link

        // Fix absolute URLs with old /network/ paths
        newLink = newLink.replace(
            /https?:\/\/[^/]+\/([a-z]{2})\/network\/[^/]+\/news\//g,
            "https://www.morganaorum.it/$1/news/"
        )
        newLink = newLink.replace(
            /https?:\/\/[^/]+\/([a-z]{2})\/network\/[^/]+\/events\//g,
            "https://www.morganaorum.it/$1/events/"
        )
        // Fix relative paths
        newLink = newLink.replace(/\/network\/[^/]+\/news\//g, "/news/")
        newLink = newLink.replace(/\/network\/[^/]+\/events\//g, "/events/")

        if (newLink !== n.link) {
            await prisma.notification.update({
                where: { id: n.id },
                data: { link: newLink }
            })
            console.log(`✅ Fixed: ${n.title}`)
            console.log(`   Old: ${n.link}`)
            console.log(`   New: ${newLink}\n`)
            fixed++
        }
    }

    console.log(`\nDone. Fixed ${fixed}/${notifications.length} notifications.`)
}

main()
    .catch(e => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
