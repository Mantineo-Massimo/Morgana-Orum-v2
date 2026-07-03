import { getUserDashboardData } from "@/app/actions/users"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/dashboard-client"

export default async function DashboardPage() {
    const data = await getUserDashboardData()

    if (!data) {
        redirect("/login")
    }

    const { user, events } = data

    // Calculate stats on the server
    const attendedCount = events.filter((e: any) => e.status === "Partecipato" || e.status === "CFU Convalidati").length
    const eventCount = events.length

    // Identify next event (first event with status "In attesa")
    const nextEvent = events.find((e: any) => e.status === "In attesa")

    const enrichedUserData = {
        ...user,
        stats: {
            attendedCount,
            eventCount
        },
        nextEvent
    }

    return <DashboardClient userData={enrichedUserData} />
}
