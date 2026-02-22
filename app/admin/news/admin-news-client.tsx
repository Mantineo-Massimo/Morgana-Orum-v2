"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Newspaper, Eye, EyeOff, Tag, X, Search, Filter, Clock, Calendar, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { deleteNews, createNewsCategory, deleteNewsCategory } from "@/app/actions/news"
import { useRouter } from "next/navigation"
import { ASSOCIATIONS } from "@/lib/associations"
import { Association } from "@prisma/client"

function getNewsStatus(item: any): "published" | "draft" | "scheduled" {
    if (!item.published) return "draft"
    if (new Date(item.date) > new Date()) return "scheduled"
    return "published"
}

export default function AdminNewsClient({
    brand,
    news,
    categoriesWithIds,
    categories,
    years,
    userRole,
    userAssociation
}: {
    brand?: string
    news: any[]
    categoriesWithIds: any[]
    categories: string[]
    years: number[]
    userRole?: string
    userAssociation?: Association
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterYear, setFilterYear] = useState("")
    const [filterAssociation, setFilterAssociation] = useState<Association | "">("")
    const [newCategory, setNewCategory] = useState("")
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null } | null>(null)

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc'
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc'
            else if (sortConfig.direction === 'desc') direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    const activeFilters = [searchQuery, filterCategory, filterStatus, filterYear, filterAssociation].filter(Boolean).length

    // Client-side filtering
    const filteredNews = (news || []).filter(item => {
        const matchesSearch = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const itemCats = item.category ? item.category.split(",").map((c: string) => c.trim()) : []
        const matchesCategory = !filterCategory || itemCats.includes(filterCategory)
        const status = getNewsStatus(item)
        const matchesStatus = !filterStatus || status === filterStatus
        const matchesYear = !filterYear || new Date(item.date).getFullYear().toString() === filterYear
        const matchesAssociation = !filterAssociation || (Array.isArray(item.associations) && item.associations.includes(filterAssociation as Association))
        return matchesSearch && matchesCategory && matchesStatus && matchesYear && matchesAssociation
    })

    // Group by year and sort within groups
    const groupedByYear: Record<number, any[]> = {}
    filteredNews.forEach(item => {
        const year = new Date(item.date).getFullYear()
        if (!groupedByYear[year]) groupedByYear[year] = []
        groupedByYear[year].push(item)
    })

    // Sort items within each year group based on sortConfig
    Object.keys(groupedByYear).forEach(yearKey => {
        const year = Number(yearKey)
        groupedByYear[year].sort((a, b) => {
            if (!sortConfig) return 0
            const { key, direction } = sortConfig
            if (!direction) return 0

            const valA = (a[key as keyof any] || "").toString().toLowerCase()
            const valB = (b[key as keyof any] || "").toString().toLowerCase()

            if (valA < valB) return direction === 'asc' ? -1 : 1
            if (valA > valB) return direction === 'asc' ? 1 : -1
            return 0
        })
    })

    const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a)


    async function handleDeleteNews(id: string) {
        startTransition(async () => {
            await deleteNews(id)
            router.refresh()
        })
    }

    async function handleCreateCategory(e: React.FormEvent) {
        e.preventDefault()
        if (!newCategory.trim()) return
        startTransition(async () => {
            await createNewsCategory(newCategory.trim())
            setNewCategory("")
            router.refresh()
        })
    }

    async function handleDeleteCategory(id: string) {
        startTransition(async () => {
            await deleteNewsCategory(id)
            router.refresh()
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Gestione Notizie</h1>
                    <p className="text-zinc-500">Crea, modifica ed elimina notizie e articoli.</p>
                </div>
                <Link
                    href={`/admin/news/new`}
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center gap-2 self-start md:self-auto"
                >
                    <Plus className="size-4" /> Nuova Notizia
                </Link>
            </div>

            {/* Category Management */}
            <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Tag className="size-4 text-zinc-400" /> Categorie
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {categoriesWithIds.map((cat: any) => (
                        <div key={cat.id} className="flex items-center gap-1 bg-zinc-100 rounded-full pl-4 pr-1 py-1.5">
                            <span className="text-sm font-medium text-zinc-700">{cat.name}</span>
                            <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                disabled={isPending}
                                className="p-1 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Elimina categoria"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                    {categoriesWithIds.length === 0 && (
                        <p className="text-sm text-zinc-400 italic">Nessuna categoria. Creane una!</p>
                    )}
                </div>
                <form onSubmit={handleCreateCategory} className="flex gap-2">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nuova categoria..."
                        className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                    />
                    <button
                        type="submit"
                        disabled={isPending || !newCategory.trim()}
                        className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-800 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        <Plus className="size-4" /> Aggiungi
                    </button>
                </form>
            </div>

            {/* Filters */}
            <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Filter className="size-4 text-zinc-400" /> Filtri
                    {activeFilters > 0 && (
                        <span className="ml-2 bg-zinc-900 text-white text-[10px] font-bold rounded-full size-5 flex items-center justify-center">
                            {activeFilters}
                        </span>
                    )}
                </h2>
                <div className="grid md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca..."
                            className="w-full pl-10 pr-8 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                <X className="size-3" />
                            </button>
                        )}
                    </div>

                    {/* Category */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                    >
                        <option value="">Tutte le categorie</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                    >
                        <option value="">Tutti gli stati</option>
                        <option value="published">✅ Pubblicata</option>
                        <option value="draft">📝 Bozza</option>
                        <option value="scheduled">⏰ Programmata</option>
                    </select>

                    {/* Year */}
                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                    >
                        <option value="">Tutte le annate</option>
                        {years.map(y => (
                            <option key={y} value={y.toString()}>{y}</option>
                        ))}
                    </select>

                    {/* Association */}
                    <select
                        value={filterAssociation}
                        onChange={(e) => setFilterAssociation(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                    >
                        <option value="">Tutte le zone</option>
                        {ASSOCIATIONS.map(assoc => (
                            <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                        ))}
                    </select>
                </div>

                {activeFilters > 0 && (
                    <button
                        onClick={() => { setSearchQuery(""); setFilterCategory(""); setFilterStatus(""); setFilterYear(""); setFilterAssociation("") }}
                        className="mt-3 text-xs font-bold text-zinc-500 hover:text-foreground transition-colors"
                    >
                        ✕ Resetta filtri
                    </button>
                )}
            </div>

            {/* Results */}
            <p className="text-sm text-zinc-500">
                {filteredNews.length} {filteredNews.length === 1 ? "notizia" : "notizie"} trovate
            </p>

            {/* Year Groups */}
            {sortedYears.map(year => (
                <div key={year}>
                    <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <Calendar className="size-4 text-zinc-400" />
                        {year}
                        <span className="text-xs font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                            {groupedByYear[year].length}
                        </span>
                    </h2>
                    <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm mb-6">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-medium uppercase tracking-wider text-xs">
                                <tr>
                                    <th
                                        className="px-6 py-3 cursor-pointer hover:text-foreground transition-colors group"
                                        onClick={() => requestSort('title')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Titolo {sortConfig?.key === 'title' ? (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-red-600" />
                                            ) : (
                                                <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3">Categoria</th>
                                    <th
                                        className="px-6 py-3 cursor-pointer hover:text-foreground transition-colors group"
                                        onClick={() => requestSort('date')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Data {sortConfig?.key === 'date' ? (
                                                sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-red-600" />
                                            ) : (
                                                <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3">Stato</th>
                                    <th className="px-6 py-3 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {groupedByYear[year].map((item: any) => {
                                    const status = getNewsStatus(item)
                                    return (
                                        <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 overflow-hidden flex-shrink-0 relative">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                    ) : (
                                                        <Newspaper className="size-4" />
                                                    )}
                                                </div>
                                                <span className="line-clamp-1">{item.title}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.category.split(",").map((cat: string) => (
                                                        <span key={cat.trim()} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-zinc-50 text-zinc-600 border-zinc-200">
                                                            {cat.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                                {new Date(item.date).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {status === "published" && (
                                                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                                        <Eye className="size-3" /> Pubblicata
                                                    </span>
                                                )}
                                                {status === "draft" && (
                                                    <span className="flex items-center gap-1 text-zinc-400 text-xs font-bold">
                                                        <EyeOff className="size-3" /> Bozza
                                                    </span>
                                                )}
                                                {status === "scheduled" && (
                                                    <span className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                                                        <Clock className="size-3" /> Programmata
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Condition: ADMIN_NETWORK can only edit if their association is present */}
                                                    {(userRole !== "ADMIN_NETWORK" || (item.associations && userAssociation && item.associations.includes(userAssociation))) ? (
                                                        <>
                                                            <Link
                                                                href={`/admin/news/${item.id}/edit`}
                                                                className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                                title="Modifica"
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    if (userRole === "ADMIN_NETWORK" && item.associations?.includes("MORGANA_ORUM")) {
                                                                        alert("Non puoi eliminare contenuti creati dall'amministrazione centrale.")
                                                                        return
                                                                    }
                                                                    handleDeleteNews(item.id)
                                                                }}
                                                                disabled={isPending || (userRole === "ADMIN_NETWORK" && item.associations?.includes("MORGANA_ORUM"))}
                                                                className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                                title={userRole === "ADMIN_NETWORK" && item.associations?.includes("MORGANA_ORUM") ? "Contenuto centrale protetto" : "Elimina"}
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
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {filteredNews.length === 0 && (
                <div className="bg-white border border-zinc-100 rounded-xl p-12 text-center shadow-sm">
                    <Newspaper className="size-12 text-zinc-200 mx-auto mb-4" />
                    <p className="text-zinc-400 text-lg">Nessuna notizia trovata con i filtri selezionati.</p>
                </div>
            )}
        </div>
    )
}
