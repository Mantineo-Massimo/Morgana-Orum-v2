import { PrismaClient } from "@prisma/client"
import { departmentsData } from "../lib/departments"

const prisma = new PrismaClient()

// Helper to check if a class code from group matches a class code from course
// Group code could be "L18", "LM41", "L/SNT1"
// Course code could be "L-18 R", "LM-41 R", "L/SNT1"
function classCodeMatches(groupName: string, courseCode: string): boolean {
    const cleanGroup = groupName.toLowerCase().replace(/[^a-z0-9/]/g, "")
    const cleanCourse = courseCode.toLowerCase().replace(/[^a-z0-9/]/g, "")
    
    // Check direct inclusion or similarity
    if (cleanGroup.includes(cleanCourse) || cleanCourse.includes(cleanGroup)) {
        return true
    }
    
    // Check without "R" (reform indicator)
    const cleanCourseNoR = cleanCourse.replace(/r$/, "")
    if (cleanGroup.includes(cleanCourseNoR) || cleanCourseNoR.includes(cleanGroup)) {
        return true
    }
    
    return false
}

// Invert departmentsData to course-to-department map
const courseToDept: Record<string, string> = {}
for (const [dept, courses] of Object.entries(departmentsData)) {
    for (const course of courses) {
        courseToDept[course] = dept
    }
}

async function main() {
    const dryRun = process.argv.includes("--execute") ? false : true
    console.log(`Starting WhatsApp Group department migration (Dry-run: ${dryRun})...`)
    
    const groups = await prisma.whatsAppGroup.findMany({
        where: {
            category: "ACADEMIC"
        }
    })
    
    let matchedCount = 0
    let unmatchedCount = 0
    
    const updates: { id: string; name: string; oldDept: string; newDept: string }[] = []
    
    for (const g of groups) {
        let bestDept: string | null = null
        let bestMatchScore = 0
        let bestCourse: string | null = null
        
        // Try to match by finding course names and class codes in the group name
        for (const [course, dept] of Object.entries(courseToDept)) {
            // Extract the course name and class code: e.g. "Economia Aziendale (L-18 R)"
            const match = course.match(/^(.*?)\s*\((.*?)\)(?:\s*-\s*(.*))?$/)
            if (!match) continue
            
            const namePart = match[1].toLowerCase()
            const codePart = match[2].toLowerCase()
            
            const gNameLower = g.name.toLowerCase()
            
            // Check if both class code and name match in some way
            const codeMatches = classCodeMatches(g.name, codePart)
            
            // Check name overlap (e.g. number of words matching)
            const courseWords = namePart.split(/\s+/).filter(w => w.length > 2)
            const matchingWords = courseWords.filter(w => gNameLower.includes(w))
            const nameScore = matchingWords.length / Math.max(1, courseWords.length)
            
            if (codeMatches && nameScore > 0.3) {
                const totalScore = nameScore + 1.0 // Priority to class code matches
                if (totalScore > bestMatchScore) {
                    bestMatchScore = totalScore
                    bestDept = dept
                    bestCourse = course
                }
            } else if (gNameLower.includes(namePart) && namePart.length > 5) {
                const score = namePart.length / 100
                if (score > bestMatchScore) {
                    bestMatchScore = score
                    bestDept = dept
                    bestCourse = course
                }
            }
        }
        
        // Fallbacks based on name keywords if no course matches
        if (!bestDept) {
            const gNameLower = g.name.toLowerCase()
            if (gNameLower.includes("giurisprudenza") || gNameLower.includes("lmg/01")) {
                bestDept = "Giurisprudenza"
            } else if (gNameLower.includes("psicologia") || gNameLower.includes("psicologiche")) {
                bestDept = "COSPECS (Scienze Cognitive e Pedagogiche)"
            } else if (gNameLower.includes("veterinaria")) {
                bestDept = "Veterinaria"
            } else if (gNameLower.includes("economia")) {
                bestDept = "Economia"
            } else if (gNameLower.includes("lettere") || gNameLower.includes("lingue") || gNameLower.includes("dicam")) {
                bestDept = "Civiltà Antiche e Moderne (DICAM)"
            } else if (gNameLower.includes("ingegneria")) {
                bestDept = "Ingegneria"
            } else if (gNameLower.includes("informatica") || gNameLower.includes("matematica") || gNameLower.includes("fisica") || gNameLower.includes("l31")) {
                bestDept = "MIFT (Scienze Matematiche, Fisiche e della Terra)"
            } else if (gNameLower.includes("infermieristica") || gNameLower.includes("ostetricia")) {
                bestDept = "Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\""
            }
        }
        
        // Default simple mappings if still unmatched
        if (!bestDept && g.department) {
            if (g.department.includes("DICAM")) {
                bestDept = "Civiltà Antiche e Moderne (DICAM)"
            } else if (g.department.includes("Economia")) {
                bestDept = "Economia"
            } else if (g.department.includes("Ingegneria")) {
                bestDept = "Ingegneria"
            } else if (g.department.includes("Veterinaria")) {
                bestDept = "Veterinaria"
            }
        }
        
        if (bestDept) {
            matchedCount++
            updates.push({
                id: g.id,
                name: g.name,
                oldDept: g.department || "null",
                newDept: bestDept
            })
        } else {
            unmatchedCount++
            console.log(`❌ UNMATCHED: "${g.name}" | Current Dept: "${g.department}"`)
        }
    }
    
    console.log(`\nMatched: ${matchedCount} / Unmatched: ${unmatchedCount}`)
    
    if (!dryRun) {
        console.log("Executing updates in database...")
        for (const u of updates) {
            await prisma.whatsAppGroup.update({
                where: { id: u.id },
                data: { department: u.newDept }
            })
        }
        console.log(`Successfully updated ${updates.length} groups in database.`)
    } else {
        console.log("\nProposed Updates (first 15 for preview):")
        for (const u of updates.slice(0, 15)) {
            console.log(`- "${u.name}": "${u.oldDept}" ➔ "${u.newDept}"`)
        }
        console.log("Run with '--execute' to perform the database updates.")
    }
}

main()
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
