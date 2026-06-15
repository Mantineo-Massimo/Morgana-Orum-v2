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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground uppercase tracking-tight">Gestione Servizi</h1>
                    <p className="text-zinc-500">Gestisci la guida ai servizi d&apos;Ateneo per gli studenti.</p>
                </div>
            </div>

            <ServicesAdminClient
                initialServices={services as any}
                userRole={user?.role}
            />
        </div>
    )
}
