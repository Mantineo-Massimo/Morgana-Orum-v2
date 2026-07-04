import { getWhatsAppGroups, getAcademicYears } from "@/app/actions/whatsapp-groups"
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
    const years = await getAcademicYears()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <WhatsAppGroupsAdminClient
                initialGroups={groups as any}
                initialYears={years}
                userRole={user?.role}
            />
        </div>
    )
}
