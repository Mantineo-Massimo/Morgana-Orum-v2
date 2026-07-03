import { getOrganigrammaMembers, getOrganigrammaConfig } from "@/app/actions/organigramma"
import { OrganigrammaAdminClient } from "./organigramma-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
    const config = await getOrganigrammaConfig()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <OrganigrammaAdminClient
                initialMembers={members as any}
                userRole={user?.role}
                initialVisible={config.visible}
            />
        </div>
    )
}
