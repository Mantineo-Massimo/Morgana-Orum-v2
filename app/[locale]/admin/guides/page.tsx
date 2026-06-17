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
            <GuidesAdminClient
                initialGuides={guides as any}
                userRole={user?.role}
            />
        </div>
    )
}
