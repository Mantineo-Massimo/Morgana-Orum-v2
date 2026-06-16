import { getRepresentatives } from "@/app/actions/representatives"
import RepresentativesClient from "./representatives-client"

export const dynamic = "force-dynamic"
export default async function RepresentativesPage() {
    // Fetch data from DB
    const allReps = await getRepresentatives()

    return (
        <RepresentativesClient
            allReps={allReps}
        />
    )
}
