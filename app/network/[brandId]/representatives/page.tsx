import { getRepresentatives } from "@/app/actions/representatives"
import RepresentativesClient from "@/app/representatives/representatives-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAND_TO_DEPT: Record<string, string[]> = {
    unimhealth: ["Patologia", "DIMED", "BIOMORF"],
    economia: ["Economia"],
    matricole: ["Matricole"],
    scipog: ["SCIPOG"],
    dicam: ["DICAM"],
}

const BRAND_TO_COLOR: Record<string, string> = {
    unimhealth: "#c12830",
    economia: "#0055a4",
    matricole: "#afafaf",
    scipog: "#ffcc00",
    dicam: "#d81b60",
}

const BRAND_TO_VOTES: Record<string, number> = {
    unimhealth: 361 + 370 + 255, // Patologia + DIMED + BIOMORF
    economia: 258 + 27,
    scipog: 201 + 33,
    dicam: 95,
    matricole: 0, // Not provided, setting to 0 or could be any other value
}

export default async function Page({ params }: { params: { brandId: string } }) {
    const deptFilters = BRAND_TO_DEPT[params.brandId]

    if (!deptFilters) {
        notFound()
    }

    // Fetch representatives
    // For unimhealth we need multiple departments + SIR
    let allReps: any[] = []

    // Fetch by departments
    for (const filter of deptFilters) {
        const reps = await getRepresentatives(undefined, undefined, "DEPARTMENT", filter)
        allReps = [...allReps, ...reps]
    }

    // Remove duplicates if any
    allReps = Array.from(new Map(allReps.map(rep => [rep.id, rep])).values())

    // Group into departments map
    const departmentsMap = new Map<string, any[]>()
    allReps.forEach((rep: any) => {
        const dept = rep.department || "Altro"
        if (!departmentsMap.has(dept)) {
            departmentsMap.set(dept, [])
        }
        departmentsMap.get(dept)?.push(rep)
    })

    // Special case for Unimhealth: Add SIR
    if (params.brandId === "unimhealth") {
        // Query more specifically for "SIR (" to avoid matching names like "Siria" or "Desirà"
        const potentialSirReps = await getRepresentatives("SIR (", undefined, undefined, undefined)

        // Exact filter for role containing the full official acronym or structure name
        const sirReps = potentialSirReps.filter(m =>
            m.role && (
                m.role.includes("SIR (") ||
                m.role.includes("Struttura Interdipartimentale di Raccordo")
            )
        )

        if (sirReps.length > 0) {
            departmentsMap.set("SIR (Struttura Interdipartimentale di Raccordo di &quot;Facoltà di Medicina e Chirurgia&quot;)", sirReps)
        }
    }

    const departments = Array.from(departmentsMap.entries()).map(([name, members]) => {
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE UNIVERITARIA")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE UNIVERITARIA", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => {
        // Prioritize SIR sections to the top
        const aIsSir = a.name.includes("SIR")
        const bIsSir = b.name.includes("SIR")
        if (aIsSir && !bIsSir) return -1
        if (!aIsSir && bIsSir) return 1
        return a.name.localeCompare(b.name)
    })

    return (
        <div className="pt-20">
            <RepresentativesClient
                nationalBodies={[]}
                centralBodies={[]}
                departments={departments}
                isSubSite={true}
                brandColor={BRAND_TO_COLOR[params.brandId]}
                votesCount={BRAND_TO_VOTES[params.brandId]}
            />
        </div>
    )
}
