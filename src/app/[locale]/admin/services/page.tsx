import { getServicesData } from "@/app/actions/services"
import { ServicesAdminClient } from "./services-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const services = await getServicesData()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <ServicesAdminClient
                initialServices={services as any}
                userRole={user?.role}
            />
        </div>
    )
}
