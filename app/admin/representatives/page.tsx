import { getRepresentatives } from "@/app/actions/representatives"
import { Plus } from "lucide-react"
import Link from "next/link"
import { RepresentativesFilter } from "@/components/admin/representatives-filter"
import { RepresentativesAdminClient } from "./representatives-admin-client"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

export default async function AdminRepresentativesPage({
    params,
    searchParams
}: {
    params: { brand: string },
    searchParams?: {
        query?: string
        list?: string
        category?: string
    }
}) {
    const query = searchParams?.query || ""
    const list = searchParams?.list || ""
    const category = searchParams?.category || ""

    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const reps = await getRepresentatives(
        query,
        list,
        category,
        undefined,
        user?.role === "ADMIN_NETWORK" ? user.association : undefined
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestione Rappresentanti</h1>
                    <p className="text-zinc-500">Gestisci l&apos;elenco dei rappresentanti eletti negli organi.</p>
                </div>
                <Link
                    href={`/admin/representatives/new`}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 self-start md:self-auto"
                >
                    <Plus className="size-4" /> Aggiungi Nuovo
                </Link>
            </div>

            <RepresentativesFilter />

            <RepresentativesAdminClient
                initialReps={reps as any}
                userRole={user?.role}
                userAssociation={user?.association}
            />
        </div>
    )
}
