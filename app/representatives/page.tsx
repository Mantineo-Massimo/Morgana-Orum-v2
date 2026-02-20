import { getRepresentatives } from "@/app/actions/representatives"
import RepresentativesClient from "./representatives-client"

export const dynamic = "force-dynamic"

export default async function RepresentativesPage() {

    // Fetch data from DB
    const allReps = await getRepresentatives()

    // Process data into structure
    // 1. Central Bodies
    const centralReps = allReps.filter((r: any) => r.category === "CENTRAL")

    // Group by Role
    const centralBodiesMap = new Map<string, any[]>()
    centralReps.forEach((rep: any) => {
        const role = rep.role || "Altro"
        if (!centralBodiesMap.has(role)) {
            centralBodiesMap.set(role, [])
        }
        centralBodiesMap.get(role)?.push(rep)
    })

    const centralBodies = Array.from(centralBodiesMap.entries()).map(([name, members]) => {
        // Group members by List
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))

    // 2. National Bodies
    const nationalReps = allReps.filter((r: any) => r.category === "NATIONAL")
    const nationalBodiesMap = new Map<string, any[]>()
    nationalReps.forEach((rep: any) => {
        const role = rep.role || "Altro"
        if (!nationalBodiesMap.has(role)) {
            nationalBodiesMap.set(role, [])
        }
        nationalBodiesMap.get(role)?.push(rep)
    })

    const nationalBodies = Array.from(nationalBodiesMap.entries()).map(([name, members]) => {
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))

    // 3. Departments
    const deptReps = allReps.filter((r: any) => r.category === "DEPARTMENT")
    const departmentsMap = new Map<string, any[]>()
    deptReps.forEach((rep: any) => {
        const dept = rep.department || "Altro"
        if (!departmentsMap.has(dept)) {
            departmentsMap.set(dept, [])
        }
        departmentsMap.get(dept)?.push(rep)
    })

    const departments = Array.from(departmentsMap.entries()).map(([name, members]) => {
        // Group members by List
        const morganaMembers = members.filter(m => m.listName === "MORGANA")
        const orumMembers = members.filter(m => m.listName === "O.R.U.M.")
        const azioneMembers = members.filter(m => m.listName === "AZIONE")

        const groups = []
        if (morganaMembers.length > 0) groups.push({ listName: "MORGANA", members: morganaMembers })
        if (orumMembers.length > 0) groups.push({ listName: "O.R.U.M.", members: orumMembers })
        if (azioneMembers.length > 0) groups.push({ listName: "AZIONE", members: azioneMembers })

        return { name, groups }
    }).sort((a, b) => a.name.localeCompare(b.name))


    return (
        <RepresentativesClient
            nationalBodies={nationalBodies}
            centralBodies={centralBodies}
            departments={departments}
        />
    )
}
