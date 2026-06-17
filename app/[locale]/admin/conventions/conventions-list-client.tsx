"use client"

import { useState } from "react"
import { Search, MapPin, Edit, Trash2, Globe, Facebook, Instagram, ArrowUpDown, ArrowUp, ArrowDown, Copy, Plus, Tag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { deleteConvention, duplicateConvention } from "@/app/actions/conventions"
import { useRouter } from "next/navigation"

interface Convention {
    id: string
    name: string
    category: string
    location: string
    logo: string | null
    social: string | null
    website: string | null
}

export default function ConventionsListClient({ initialData }: { initialData: Convention[] }) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null } | null>(null)

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc'
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc'
            else if (sortConfig.direction === 'desc') direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    const filtered = initialData.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        if (!sortConfig) return 0
        const { key, direction } = sortConfig
        if (!direction) return 0

        const valA = (a[key as keyof Convention] || "").toString().toLowerCase()
        const valB = (b[key as keyof Convention] || "").toString().toLowerCase()

        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
    })

    async function handleDelete(id: string) {
        if (!confirm("Sei sicuro di voler eliminare questa convenzione?")) return

        setIsDeleting(id)
        const res = await deleteConvention(id)
        if (res.success) {
            router.refresh()
        } else {
            alert(res.error)
        }
        setIsDeleting(null)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-xl">
                            <Tag className="size-6" />
                        </div>
                        Gestione Convenzioni
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Aggiungi, modifica o rimuovi le attività convenzionate per gli studenti.
                    </p>
                </div>
                <Link
                    href={`/admin/conventions/new`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all shadow-sm shrink-0"
                >
                    <Plus className="size-4" />
                    Nuova Convenzione
                </Link>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca per nome o categoria..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-500">
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-foreground transition-colors group"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Attività {sortConfig?.key === 'name' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-center cursor-pointer hover:text-foreground transition-colors group"
                                    onClick={() => requestSort('location')}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        Località {sortConfig?.key === 'location' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center">Contatti</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 font-medium">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-400">
                                        Nessuna convenzione trovata.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="relative size-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                                                    {c.logo ? (
                                                        <Image src={c.logo} alt={c.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Globe className="size-5 text-zinc-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground">{c.name}</div>
                                                    <div className="text-[10px] text-zinc-400 uppercase tracking-wide">{c.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold">
                                                <MapPin className="size-3" /> {c.location}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                {c.social && <div className="size-2 rounded-full bg-blue-500" title="Social collegato" />}
                                                {c.website && <div className="size-2 rounded-full bg-zinc-900" title="Sito web collegato" />}
                                                {!c.social && !c.website && <span className="text-zinc-300">-</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/conventions/${c.id}/edit`}
                                                    className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                    title="Modifica"
                                                >
                                                    <Edit className="size-4" />
                                                </Link>
                                                <button
                                                    onClick={async () => {
                                                        const res = await duplicateConvention(c.id)
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
                                                    onClick={() => handleDelete(c.id)}
                                                    disabled={isDeleting === c.id}
                                                    className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
