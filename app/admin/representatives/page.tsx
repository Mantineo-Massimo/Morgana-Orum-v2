import { getRepresentatives, deleteRepresentative } from "@/app/actions/representatives"
import { Plus, Pencil, Trash2, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { RepresentativesFilter } from "@/components/admin/representatives-filter"

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

    const reps = await getRepresentatives(query, list, category)

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

            <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Mandato</th>
                            <th className="px-6 py-4">Lista</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4">Ruolo / Dipartimento</th>
                            <th className="px-6 py-4 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {reps.map((rep) => (
                            <tr key={rep.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 overflow-hidden flex-shrink-0 relative">
                                        {rep.image ? (
                                            <Image src={rep.image} alt={rep.name} fill className="object-cover" />
                                        ) : (
                                            <User className="size-4" />
                                        )}
                                    </div>
                                    {rep.name}
                                </td>
                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                    {rep.term}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border",
                                        rep.listName === "MORGANA"
                                            ? "bg-red-50 text-red-700 border-red-100"
                                            : rep.listName === "O.R.U.M."
                                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                                : "bg-purple-50 text-purple-700 border-purple-100"
                                    )}>
                                        {rep.listName}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {rep.category === "CENTRAL" ? "Organo Centrale" :
                                        rep.category === "NATIONAL" ? "Organo Nazionale" :
                                            "Dipartimento"}
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {(rep as any).role || rep.department || "-"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            href={`/admin/representatives/${rep.id}/edit`}
                                            className="p-2 text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg transition-colors"
                                            title="Modifica"
                                        >
                                            <Pencil className="size-4" />
                                        </Link>

                                        <form action={async () => {
                                            "use server"
                                            await deleteRepresentative(rep.id)
                                        }}>
                                            <button
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Elimina"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {reps.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                    Nessun rappresentante trovato.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
