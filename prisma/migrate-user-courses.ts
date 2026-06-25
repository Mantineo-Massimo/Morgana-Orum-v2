import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mapping for user degreeCourse and department values
const MIGRATIONS = [
    {
        oldCourse: "Scienze e Tecniche Psicologiche (L-24)",
        newCourse: "Scienze e Tecniche Psicologiche (L-24 R) - Messina",
        newDept: "COSPECS (Scienze Cognitive e Pedagogiche)"
    },
    {
        oldCourse: "Scienze Politiche e Amministrazione (L-16 & L-36)",
        newCourse: "Scienze Politiche, Amministrazione e Servizi (L-16 R) - Messina",
        newDept: "SCIPOG (Scienze Politiche e Giuridiche)"
    },
    {
        oldCourse: "Informatica (L-31)",
        newCourse: "Informatica (L-31 R)",
        newDept: "MIFT (Scienze Matematiche, Fisiche e della Terra)"
    },
    {
        oldCourse: "Giurisprudenza (LMG/01)",
        newCourse: "Giurisprudenza (LMG/01 R) - Messina",
        newDept: "Giurisprudenza"
    },
    {
        oldCourse: "Medicina e Chirurgia (LM-41)",
        newCourse: "Medicina e Chirurgia (LM-41 R)",
        newDept: "Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\""
    },
    {
        oldCourse: "Ingegneria Elettronica e Informatica (L-8)",
        newCourse: "Ingegneria Elettronica e Informatica (L-8 R)",
        newDept: "Ingegneria"
    },
    {
        oldCourse: "Infermieristica (L/SNT1)",
        newCourse: "Infermieristica (L/SNT1) - Messina, Siracusa",
        newDept: "Medicina Clinica e Sperimentale"
    }
]

async function main() {
    console.log("Starting DB migration for user departments and degree courses...")
    
    let updatedCount = 0
    for (const m of MIGRATIONS) {
        const users = await prisma.user.findMany({
            where: {
                degreeCourse: m.oldCourse
            }
        })
        
        if (users.length > 0) {
            console.log(`Found ${users.length} user(s) with course "${m.oldCourse}". Migrating...`)
            const res = await prisma.user.updateMany({
                where: {
                    degreeCourse: m.oldCourse
                },
                data: {
                    degreeCourse: m.newCourse,
                    department: m.newDept
                }
            })
            updatedCount += res.count
        }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} users.`)
}

main()
    .catch(err => {
        console.error("Migration failed:", err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
