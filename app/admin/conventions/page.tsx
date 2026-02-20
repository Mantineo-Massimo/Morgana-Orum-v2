import { getConventions } from "@/app/actions/conventions"
import ConventionsListClient from "./conventions-list-client"
import Link from "next/link"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminConventionsPage() {
    const conventions = await getConventions()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Gestione Convenzioni</h1>
                    <p className="text-zinc-500">Aggiungi, modifica o rimuovi le attività convenzionate per gli studenti.</p>
                </div>
                <Link
                    href={`/admin/conventions/new`}
                    className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-sm"
                >
                    <Plus className="size-4" /> Nuova Convenzione
                </Link>
            </div>

            <ConventionsListClient initialData={conventions} />
        </div>
    )
}
