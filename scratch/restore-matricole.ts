import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Checking if 'matricole' guide exists in the database...")
    const existing = await prisma.guide.findUnique({
        where: { id: "matricole" }
    })

    if (existing) {
        console.log("Guide 'matricole' already exists in the database. Skipping creation.")
        return
    }

    console.log("Guide 'matricole' is missing. Restoring...")

    const guide = await prisma.guide.create({
        data: {
            id: "matricole",
            title: "Guida Matricole",
            titleEn: "Freshmen Guide",
            description: "La guida completa per orientarsi tra tasse, segreterie, iscrizioni e portale dello studente (ESSE3).",
            descriptionEn: "The complete guide to navigate fees, secretariats, enrollment, and student portal (ESSE3).",
            icon: "BookOpen",
            color: "blue",
            order: 0,
            hasCustomComponent: false
        }
    })

    console.log("Guide 'matricole' created successfully. Inserting steps...")

    const steps = [
        { 
            title: "Registrazione su Esse3", 
            titleEn: "Esse3 Registration", 
            description: "Crea il tuo account sul portale Esse3 per gestire la tua carriera accademica.", 
            descriptionEn: "Create your account on the Esse3 portal to manage your academic career.", 
            order: 0 
        },
        { 
            title: "Immatricolazione & Tasse", 
            titleEn: "Enrollment & Fees", 
            description: "Presenta la domanda online e paga la prima rata per confermare l'iscrizione.", 
            descriptionEn: "Submit the application online and pay the first installment to confirm enrollment.", 
            order: 1 
        },
        { 
            title: "ISEE Università", 
            titleEn: "University ISEE", 
            description: "Richiedi l'ISEE-U entro la scadenza per calcolare le rate successive in base alla tua fascia.", 
            descriptionEn: "Request the ISEE-U before the deadline to calculate subsequent installments based on your bracket.", 
            order: 2 
        },
        { 
            title: "Badge Digitale", 
            titleEn: "Digital Badge", 
            description: "Scarica l'app Unime per avere sempre con te il tesserino universitario virtuale.", 
            descriptionEn: "Download the Unime app to always have your virtual student card with you.", 
            order: 3 
        }
    ]

    for (const step of steps) {
        await prisma.guideStep.create({
            data: {
                ...step,
                guideId: guide.id
            }
        })
    }

    console.log("Steps for 'matricole' created successfully!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
