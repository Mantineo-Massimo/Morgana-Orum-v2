import { getWhatsAppGroups } from "@/app/actions/whatsapp-groups"
import { WhatsAppGroupsAdminClient } from "./whatsapp-groups-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminWhatsAppGroupsPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const groups = await getWhatsAppGroups()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Gestione Gruppi WhatsApp</h1>
                    <p className="text-zinc-500">Gestisci i link e le descrizioni dei gruppi WhatsApp ufficiali delle community e dei corsi di laurea.</p>
                </div>
            </div>

            <WhatsAppGroupsAdminClient
                initialGroups={groups as any}
                userRole={user?.role}
            />
        </div>
    )
}
