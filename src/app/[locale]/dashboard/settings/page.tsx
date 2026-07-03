import { getUserDashboardData } from "@/app/actions/users"
import SettingsClient from "./settings-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const data = await getUserDashboardData()

    if (!data) {
        redirect("/login")
    }

    return <SettingsClient initialUser={data.user} />
}
