import { getOrganigrammaMembers } from "@/app/actions/organigramma"
import { OrganigrammaAdminClient } from "./organigramma-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminOrganigrammaPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    if (!user || user.role !== "SUPER_ADMIN") {
        redirect("/admin")
    }

    const members = await getOrganigrammaMembers()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Gestione Organigramma</h1>
                    <p className="text-zinc-500">Gestisci i componenti dei direttivi, presidenze e dipartimenti delle associazioni.</p>
                </div>
            </div>

            <OrganigrammaAdminClient
                initialMembers={members as any}
                userRole={user?.role}
            />
        </div>
    )
}
