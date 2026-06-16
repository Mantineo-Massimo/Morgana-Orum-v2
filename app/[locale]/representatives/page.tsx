import { getRepresentatives, getBienniumConfigs } from "@/app/actions/representatives"
import RepresentativesClient from "./representatives-client"

export const dynamic = "force-dynamic"
export default async function RepresentativesPage() {
    // Fetch data from DB
    const [allReps, configs] = await Promise.all([
        getRepresentatives(),
        getBienniumConfigs()
    ])

    return (
        <RepresentativesClient
            allReps={allReps}
            bienniumConfigs={configs}
        />
    )
}
