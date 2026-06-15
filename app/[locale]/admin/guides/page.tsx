import { getGuidesData } from "@/app/actions/guides"
import { GuidesAdminClient } from "./guides-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminGuidesPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const guides = await getGuidesData()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Gestione Guide Universitarie</h1>
                    <p className="text-zinc-500">Gestisci i moduli delle guide, i passaggi (step) e i relativi contenuti informativi per le matricole.</p>
                </div>
            </div>

            <GuidesAdminClient
                initialGuides={guides as any}
                userRole={user?.role}
            />
        </div>
    )
}
