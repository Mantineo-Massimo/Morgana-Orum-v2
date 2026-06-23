import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Resetting 'matricole' guide in database...")

    // Delete existing if it exists (including its steps)
    try {
        await prisma.guide.delete({
            where: { id: "matricole" }
        })
        console.log("Existing 'matricole' guide deleted.")
    } catch (e) {
        console.log("No existing 'matricole' guide to delete.")
    }

    console.log("Creating new 'Guide & Strumenti' guide...")

    const guide = await prisma.guide.create({
        data: {
            id: "matricole",
            title: "Guide & Strumenti",
            titleEn: "Guides & Tools",
            description: "Esplora le nostre guide informative e utilizza gli strumenti interattivi.",
            descriptionEn: "Explore our informative guides and use the interactive tools.",
            icon: "BookOpen",
            color: "blue",
            order: 0,
            hasCustomComponent: false
        }
    })

    console.log("Guide & Strumenti guide created successfully!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
