"use client"

import { useState } from "react"
import { Pencil, Trash2, User, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X, Copy } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { deleteRepresentative, duplicateRepresentative } from "@/app/actions/representatives"
import { useRouter } from "next/navigation"

import { Association } from "@prisma/client"
import { ASSOCIATION_DEPARTMENT_KEYWORDS } from "@/lib/associations"

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
    const router = useRouter()
    const [reps, setReps] = useState(initialReps)
    const [searchTerm, setSearchTerm] = useState("")
    const [listFilter, setListFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Representative, direction: 'asc' | 'desc' | null } | null>(null)

    const requestSort = (key: keyof Representative) => {
        let direction: 'asc' | 'desc' | null = 'asc'
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc'
            else if (sortConfig.direction === 'desc') direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    const filteredReps = reps.filter(rep => {
        const matchesSearch = searchTerm === "" ||
            rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rep.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rep.department?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesList = listFilter === "all" || rep.listName === listFilter
        const matchesCategory = categoryFilter === "all" || rep.category === categoryFilter

        return matchesSearch && matchesList && matchesCategory
    })

    const sortedReps = [...filteredReps].sort((a, b) => {
        if (!sortConfig) return 0

        const { key, direction } = sortConfig
        if (!direction) return 0

        const valA = (a[key] || "").toString().toLowerCase()
        const valB = (b[key] || "").toString().toLowerCase()

        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
    })

    const SortIcon = ({ columnKey }: { columnKey: keyof Representative }) => {
        if (sortConfig?.key !== columnKey) return <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        return sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-red-600" />
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cerca per nome o ruolo..."
                        className="w-full pl-10 pr-10 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-foreground"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white text-sm"
                        value={listFilter}
                        onChange={(e) => setListFilter(e.target.value)}
                    >
                        <option value="all">Tutte le Liste</option>
                        <option value="MORGANA">Morgana</option>
                        <option value="O.R.U.M.">O.R.U.M.</option>
                        <option value="AZIONE UNIVERITARIA">Azione Universitaria</option>
                    </select>

                    <select
                        className="px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white text-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Tutte le Categorie</option>
                        <option value="DEPARTMENT">Dipartimenti</option>
                        <option value="CENTRAL">Organi Centrali</option>
                        <option value="NATIONAL">Organi Nazionali</option>
                    </select>
                </div>
            </div>

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
                                    <div className="flex justify-end gap-2">
                                        {/* Permission check: ADMIN_NETWORK can edit own assoc OR own department if Morgana */}
                                        {(() => {
                                            const keywords = ASSOCIATION_DEPARTMENT_KEYWORDS[userAssociation as string] || []
                                            const isDeptMatch = rep.department && keywords.some(kw =>
                                                rep.department?.toLowerCase().includes(kw.toLowerCase())
                                            )

                                            if (userRole !== "ADMIN_NETWORK" || rep.association === userAssociation || isDeptMatch) {
                                                return (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/representatives/${rep.id}/edit`}
                                                            className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                            title="Modifica"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                        <button
                                                            onClick={async () => {
                                                                const res = await duplicateRepresentative(rep.id)
                                                                if (res.success) {
                                                                    router.refresh()
                                                                } else {
                                                                    alert(res.error || "Errore durante la duplicazione")
                                                                }
                                                            }}
                                                            className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
                                                            title="Copia"
                                                        >
                                                            <Copy className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm("Sei sicuro di voler eliminare questo rappresentante?")) {
                                                                    await deleteRepresentative(rep.id)
                                                                    setReps(reps.filter(r => r.id !== rep.id))
                                                                }
                                                            }}
                                                            className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30"
                                                            title="Elimina"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                            return <span className="text-xs font-bold text-zinc-400 italic bg-zinc-100 px-2 py-1 rounded-md">Solo lettura</span>
                                        })()}
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
        </div>
    )
}
