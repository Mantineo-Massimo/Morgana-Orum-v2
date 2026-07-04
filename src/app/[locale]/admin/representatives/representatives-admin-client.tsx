"use client"

import { useState, useMemo } from "react"
import { Pencil, Trash2, User, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, X, Copy, Plus, CalendarRange, Eye, EyeOff } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { deleteRepresentative, duplicateRepresentative, createNewBienniumAction, toggleBienniumVisibilityAction } from "@/app/actions/representatives"
import { useRouter } from "next/navigation"
import RepresentativeForm from "@/components/admin/representative-form"

import { Association } from "@prisma/client"
import { ASSOCIATION_DEPARTMENT_KEYWORDS } from "@/lib/associations"

interface Representative {
    id: string
    name: string
    term: string
    mandateYears?: number
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
    initialConfigs?: { term: string, visible: boolean }[]
}

export function RepresentativesAdminClient({ initialReps, userRole, userAssociation, initialConfigs }: RepresentativesAdminClientProps) {
    const router = useRouter()
    const [reps, setReps] = useState(initialReps)
    const [configs, setConfigs] = useState<{ term: string, visible: boolean }[]>(initialConfigs || [])

    const handleToggleVisibility = async (e: React.MouseEvent, term: string) => {
        e.stopPropagation()
        const currentVal = configs.find(c => c.term === term)?.visible ?? true
        const newVal = !currentVal

        setConfigs(prev => {
            const existing = prev.find(c => c.term === term)
            if (existing) {
                return prev.map(c => c.term === term ? { ...c, visible: newVal } : c)
            } else {
                return [...prev, { term, visible: newVal }]
            }
        })

        const res = await toggleBienniumVisibilityAction(term, newVal)
        if (!res.success) {
            alert(res.error || "Errore durante il salvataggio delle modifiche.")
            setConfigs(prev => prev.map(c => c.term === term ? { ...c, visible: currentVal } : c))
        } else {
            router.refresh()
        }
    }
    const [searchTerm, setSearchTerm] = useState("")
    const [listFilter, setListFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [sortConfig, setSortConfig] = useState<{ key: keyof Representative, direction: 'asc' | 'desc' | null } | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRep, setEditingRep] = useState<Representative | null>(null)

    // Biennium Rollover state
    const [isBienniumModalOpen, setIsBienniumModalOpen] = useState(false)
    const [bienniumLoading, setBienniumLoading] = useState(false)
    const [bienniumError, setBienniumError] = useState<string | null>(null)
    const [bienniumSuccess, setBienniumSuccess] = useState<string | null>(null)

    const existingTerms = useMemo(() => {
        const startYears = reps.map(r => parseInt(r.term.split("-")[0])).filter(y => !isNaN(y))
        if (startYears.length === 0) return []
        const minYear = Math.min(...startYears)
        const maxActiveStartYears = reps.map(r => {
            const sy = parseInt(r.term.split("-")[0])
            if (isNaN(sy)) return 2025
            const extraYears = Math.floor(((r.mandateYears || 2) - 1) / 2) * 2
            return sy + extraYears
        })
        const maxYear = Math.max(...maxActiveStartYears)
        const terms = []
        for (let y = minYear; y <= maxYear; y += 2) {
            terms.push(`${y}-${y+2}`)
        }
        return terms.sort().reverse()
    }, [reps])
    const [selectedBiennium, setSelectedBiennium] = useState<string | null>(null)
    const [sourceTerm, setSourceTerm] = useState(existingTerms[0] || "2025-2027")
    const [targetTerm, setTargetTerm] = useState("")

    const handleSourceTermChange = (val: string) => {
        setSourceTerm(val)
    }

    const openModal = (rep?: Representative) => {
        setEditingRep(rep || null)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingRep(null)
    }

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
        const matchesTerm = !selectedBiennium || (() => {
            const startYear = parseInt(rep.term.split("-")[0])
            const selectedStartYear = parseInt(selectedBiennium.split("-")[0])
            if (!isNaN(startYear) && !isNaN(selectedStartYear)) {
                const endYear = startYear + (rep.mandateYears || 2)
                return startYear <= selectedStartYear && endYear > selectedStartYear
            }
            return rep.term === selectedBiennium
        })()

        return matchesSearch && matchesList && matchesCategory && matchesTerm
    })

    const sortedReps = (Array.isArray(filteredReps) ? [...filteredReps] : []).sort((a, b) => {
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
        return sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
    }

    return (
        <div className="space-y-8">
            {!selectedBiennium ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <CalendarRange className="size-6" />
                                </div>
                                Gestione Eletti per Biennio
                            </h1>
                            <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                                Seleziona il biennio dei rappresentanti che desideri gestire o crea un nuovo mandato.
                            </p>
                        </div>
                        {(userRole === "SUPER_ADMIN" || userRole === "ADMIN_MORGANA") && (
                            <button
                                onClick={() => {
                                    setTargetTerm("")
                                    setIsBienniumModalOpen(true)
                                }}
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all rounded-xl shadow-sm"
                            >
                                <Plus className="size-4" /> Nuovo Biennio
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {existingTerms.map((term) => {
                            const count = reps.filter(r => r.term === term).length
                            return (
                                <div
                                    key={term}
                                    onClick={() => setSelectedBiennium(term)}
                                    className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-355 transition-all flex flex-col justify-between cursor-pointer group"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="size-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform">
                                                <CalendarRange className="size-6 text-slate-400" />
                                            </div>
                                            {(userRole === "SUPER_ADMIN" || userRole === "ADMIN_MORGANA") && (() => {
                                                const isVisible = configs.find(c => c.term === term)?.visible ?? true
                                                return (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleToggleVisibility(e, term)}
                                                        className={cn(
                                                            "p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-bold shadow-sm",
                                                            isVisible 
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100" 
                                                                : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"
                                                        )}
                                                        title={isVisible ? "Visibile (Clicca per nascondere)" : "Nascosto (Clicca per mostrare)"}
                                                    >
                                                        {isVisible ? <Eye className="size-4 shrink-0" /> : <EyeOff className="size-4 shrink-0" />}
                                                        <span>{isVisible ? "Visibile" : "Nascosto"}</span>
                                                    </button>
                                                )
                                            })()}
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#c9041a] transition-colors">
                                            Biennio {term}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                                            {count} {count === 1 ? 'eletto' : 'eletti'}
                                        </p>
                                    </div>
                                    <button
                                        className="mt-6 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all w-full text-center"
                                    >
                                        Gestisci Rappresentanti
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <button
                                onClick={() => setSelectedBiennium(null)}
                                className="text-slate-500 hover:text-slate-900 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2 transition-colors"
                            >
                                &larr; Seleziona Bienni
                            </button>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <User className="size-6" />
                                </div>
                                Eletti Biennio {selectedBiennium}
                            </h1>
                            <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                                Gestisci i rappresentanti eletti per il mandato {selectedBiennium}.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-2xl border border-slate-200/60 items-center shadow-sm">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cerca per nome o ruolo..."
                                className="w-full pl-11 pr-10 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2">
                            <select
                                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-xs font-bold uppercase tracking-wider bg-white cursor-pointer"
                                value={listFilter}
                                onChange={(e) => setListFilter(e.target.value)}
                            >
                                <option value="all">Tutte le Liste</option>
                                <option value="MORGANA">Morgana</option>
                                <option value="O.R.U.M.">O.R.U.M.</option>
                                <option value="AZIONE UNIVERITARIA">Azione Universitaria</option>
                            </select>

                            <select
                                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-xs font-bold uppercase tracking-wider bg-white cursor-pointer"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">Tutte le Categorie</option>
                                <option value="DEPARTMENT">Dipartimenti</option>
                                <option value="CENTRAL">Organi Centrali</option>
                                <option value="NATIONAL">Organi Nazionali</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => openModal()}
                                className="bg-gradient-to-br from-[#c12830] to-[#18182e] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap grow md:grow-0 justify-center shadow-sm"
                            >
                                <Plus className="size-4" /> Aggiungi Nuovo
                            </button>
                        </div>
                    </div>

            <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[900px]">
                        <thead className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-slate-900 transition-colors group"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Nome <SortIcon columnKey="name" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-slate-900 transition-colors group"
                                    onClick={() => requestSort('term')}
                                >
                                    <div className="flex items-center gap-2">
                                        Mandato <SortIcon columnKey="term" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-slate-900 transition-colors group"
                                    onClick={() => requestSort('listName')}
                                >
                                    <div className="flex items-center gap-2">
                                        Lista <SortIcon columnKey="listName" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-slate-900 transition-colors group"
                                    onClick={() => requestSort('category')}
                                >
                                    <div className="flex items-center gap-2">
                                        Categoria <SortIcon columnKey="category" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 cursor-pointer hover:text-slate-900 transition-colors group"
                                    onClick={() => requestSort('department')}
                                >
                                    <div className="flex items-center gap-2">
                                        Ruolo / Dipartimento <SortIcon columnKey="department" />
                                    </div>
                                </th>
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
                                                ? "bg-[#c9041a] text-white border-[#c9041a]"
                                                : rep.listName === "O.R.U.M."
                                                    ? "bg-[#18182e] text-white border-[#18182e]"
                                                    : "bg-sky-50 text-sky-700 border-sky-100"
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
                                                            <button
                                                                onClick={() => openModal(rep)}
                                                                className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                                title="Modifica"
                                                            >
                                                                <Pencil className="size-4" />
                                                            </button>
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
            </div>
            )}

            {/* Representative Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 custom-scrollbar">
                        <button
                            onClick={closeModal}
                            className="absolute right-6 top-6 p-1.5 hover:bg-slate-100 rounded-lg transition-colors z-10"
                        >
                            <X className="size-4 text-slate-400" />
                        </button>

                        <div className="p-6">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <User className="size-5" />
                                </div>
                                {editingRep ? "Modifica Rappresentante" : "Nuovo Rappresentante"}
                            </h2>

                            <RepresentativeForm
                                initialData={editingRep || (selectedBiennium ? { term: selectedBiennium } : undefined)}
                                userRole={userRole}
                                userAssociation={userAssociation}
                                onSuccess={() => {
                                    closeModal()
                                    router.refresh()
                                }}
                                onCancel={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* New Biennium Modal */}
            {isBienniumModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => {
                                setIsBienniumModalOpen(false)
                                setBienniumError(null)
                                setBienniumSuccess(null)
                            }}
                            className="absolute right-6 top-6 p-1.5 hover:bg-slate-100 rounded-lg transition-colors z-10"
                        >
                            <X className="size-4 text-slate-400" />
                        </button>

                        <div className="p-6 space-y-6">
                            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <CalendarRange className="size-5" />
                                </div>
                                Nuovo Biennio
                            </h2>
                            <p className="text-slate-500 text-sm font-medium font-sans">
                                Crea un nuovo biennio e copia automaticamente tutti i rappresentanti del biennio sorgente con un mandato pluriennale (3 o 4 anni) attivo.
                            </p>

                            {bienniumError && (
                                <div className="bg-red-50 text-red-650 p-4 rounded-xl text-sm font-medium border border-red-100 animate-in fade-in">
                                    {bienniumError}
                                </div>
                            )}

                            {bienniumSuccess && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 animate-in fade-in font-semibold">
                                    {bienniumSuccess}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Biennio Sorgente</label>
                                    <select
                                        value={sourceTerm}
                                        onChange={(e) => handleSourceTermChange(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all bg-white"
                                    >
                                        {existingTerms.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nuovo Biennio</label>
                                    <input
                                        type="text"
                                        placeholder="Es. 2027-2029"
                                        value={targetTerm}
                                        onChange={(e) => setTargetTerm(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all font-mono"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        Formato richiesto: YYYY-YYYY (es. 2027-2029)
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsBienniumModalOpen(false)
                                        setBienniumError(null)
                                        setBienniumSuccess(null)
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="button"
                                    disabled={bienniumLoading}
                                    onClick={async () => {
                                        setBienniumLoading(true)
                                        setBienniumError(null)
                                        setBienniumSuccess(null)

                                        const res = await createNewBienniumAction(sourceTerm, targetTerm)
                                        if (res.success) {
                                            setBienniumSuccess(`Biennio creato con successo! ${res.carriedOverCount} rappresentanti sono stati importati nel nuovo biennio ${targetTerm}.`)
                                            setTimeout(() => {
                                                setIsBienniumModalOpen(false)
                                                setBienniumSuccess(null)
                                                router.refresh()
                                            }, 3000)
                                        } else {
                                            setBienniumError(res.error || "Errore durante la creazione del biennio")
                                        }
                                        setBienniumLoading(false)
                                    }}
                                    className="bg-gradient-to-br from-[#c12830] to-[#18182e] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {bienniumLoading ? (
                                        <>
                                            <span className="size-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                            <span>Elaborazione...</span>
                                        </>
                                    ) : (
                                        <span>Crea e Copia</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
