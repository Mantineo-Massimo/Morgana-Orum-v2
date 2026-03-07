import { getUserDashboardData } from "@/app/actions/users"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const data = await getUserDashboardData()

    if (!data) {
        redirect("/login")
    }

    const { user } = data

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
            <DashboardSidebar userData={user} />

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 md:p-10 pb-12 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

