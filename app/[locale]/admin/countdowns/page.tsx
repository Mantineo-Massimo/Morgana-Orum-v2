import { getCountdowns, seedDefaultCountdowns } from "@/app/actions/countdowns"
import { CountdownAdminClient } from "./countdown-admin-client"

export const dynamic = "force-dynamic"

export default async function CountdownAdminPage() {
    // Seed defaults if DB is empty
    await seedDefaultCountdowns()
    const items = await getCountdowns()
    return <CountdownAdminClient initialItems={items} />
}
