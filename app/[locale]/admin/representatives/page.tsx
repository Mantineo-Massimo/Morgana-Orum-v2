import { getRepresentatives } from "@/app/actions/representatives"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RepresentativesAdminClient } from "./representatives-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminRepresentativesPage() {
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const reps = await getRepresentatives({
        userRole: user?.role,
        userAssociation: user?.association
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestione Rappresentanti</h1>
                    <p className="text-zinc-500">Gestisci l&apos;elenco dei rappresentanti eletti negli organi.</p>
                </div>
            </div>

            <RepresentativesAdminClient
                initialReps={reps as any}
                userRole={user?.role}
                userAssociation={user?.association}
            />
        </div>
    )
}
