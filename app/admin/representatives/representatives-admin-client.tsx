"use client"

import { useState } from "react"
import { Pencil, Trash2, User, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { deleteRepresentative } from "@/app/actions/representatives"

import { Association } from "@prisma/client"

interface Representative {
    id: string
    name: string
    term: string
    listName: string
    category: string
    department?: string | null
    role?: string | null
    image?: string | null
    association: Association
}

interface RepresentativesAdminClientProps {
    initialReps: Representative[]
    userRole?: string
    userAssociation?: Association
}

export function RepresentativesAdminClient({ initialReps, userRole, userAssociation }: RepresentativesAdminClientProps) {
    const [reps, setReps] = useState(initialReps)
    const [sortConfig, setSortConfig] = useState<{ key: keyof Representative, direction: 'asc' | null } | null>(null)

    const requestSort = (key: keyof Representative) => {
        let direction: 'asc' | null = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    const sortedReps = [...reps].sort((a, b) => {
        if (!sortConfig) return 0

        const { key, direction } = sortConfig
        if (direction === 'asc') {
            const valA = (a[key] || "").toString().toLowerCase()
            const valB = (b[key] || "").toString().toLowerCase()
            return valA.localeCompare(valB)
        }
        return 0
    })

    const SortIcon = ({ columnKey }: { columnKey: keyof Representative }) => {
        if (sortConfig?.key !== columnKey) return <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        return <ArrowUp className="size-3 text-red-600" />
    }

    return (
        <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-medium uppercase tracking-wider text-xs">
                    <tr>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                            onClick={() => requestSort('name')}
                        >
                            <div className="flex items-center gap-2">
                                Nome <SortIcon columnKey="name" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                            onClick={() => requestSort('term')}
                        >
                            <div className="flex items-center gap-2">
                                Mandato <SortIcon columnKey="term" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                            onClick={() => requestSort('listName')}
                        >
                            <div className="flex items-center gap-2">
                                Lista <SortIcon columnKey="listName" />
                            </div>
                        </th>
                        <th
                            className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                            onClick={() => requestSort('category')}
                        >
                            <div className="flex items-center gap-2">
                                Categoria <SortIcon columnKey="category" />
                            </div>
                        </th>
                        <th className="px-6 py-4">Ruolo / Dipartimento</th>
                        <th className="px-6 py-4 text-right">Azioni</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                    {sortedReps.map((rep) => (
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
                                {rep.role || rep.department || "-"}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Permission check: ADMIN_NETWORK can only edit their own association */}
                                    {(userRole !== "ADMIN_NETWORK" || rep.association === userAssociation) ? (
                                        <>
                                            <Link
                                                href={`/admin/representatives/${rep.id}/edit`}
                                                className="p-2 text-zinc-400 hover:text-foreground hover:bg-zinc-100 rounded-lg transition-colors"
                                                title="Modifica"
                                            >
                                                <Pencil className="size-4" />
                                            </Link>

                                            <button
                                                onClick={async () => {
                                                    if (confirm("Sei sicuro di voler eliminare questo rappresentante?")) {
                                                        await deleteRepresentative(rep.id)
                                                        setReps(reps.filter(r => r.id !== rep.id))
                                                    }
                                                }}
                                                className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Elimina"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-xs font-bold text-zinc-400 italic bg-zinc-100 px-2 py-1 rounded-md">Solo lettura</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {sortedReps.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                                Nessun rappresentante trovato.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
