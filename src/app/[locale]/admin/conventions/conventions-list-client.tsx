"use client"

import { useState } from "react"
import { Search, MapPin, Edit, Trash2, Globe, Facebook, Instagram, ArrowUpDown, ArrowUp, ArrowDown, Copy, Plus, Tag, Store, Key, X, Loader2, CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { deleteConvention, duplicateConvention } from "@/app/actions/conventions"
import { createPartnerAccount } from "@/app/actions/partner"
import { useRouter } from "next/navigation"

interface Convention {
    id: string
    name: string
    category: string
    location: string
    logo: string | null
    social: string | null
    website: string | null
    partnerUsers?: { id: string, email: string, name: string }[]
}

export default function ConventionsListClient({ initialData }: { initialData: Convention[] }) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null } | null>(null)

    // Partner Account creation state
    const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null)
    const [partnerName, setPartnerName] = useState("")
    const [partnerEmail, setPartnerEmail] = useState("")
    const [partnerPassword, setPartnerPassword] = useState("")
    const [creatingPartner, setCreatingPartner] = useState(false)
    const [partnerStatus, setPartnerStatus] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const existingPartnerUser = selectedConvention?.partnerUsers?.[0]

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

    const handleCreatePartnerAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedConvention) return
        setPartnerStatus(null)
        setCreatingPartner(true)

        try {
            const res = await createPartnerAccount({
                email: partnerEmail,
                password: partnerPassword,
                name: partnerName || selectedConvention.name,
                conventionId: selectedConvention.id
            })

            if (res.success) {
                const msg = res.isUpdated 
                    ? 'Credenziali partner aggiornate con successo!' 
                    : 'Account partner creato con successo! Il negoziante può ora accedere su /partner/login.'
                setPartnerStatus({ type: 'success', text: msg })
                setPartnerPassword("")
                router.refresh()
            } else {
                setPartnerStatus({ type: 'error', text: res.error || 'Errore durante il salvataggio.' })
            }
        } catch (err) {
            setPartnerStatus({ type: 'error', text: 'Errore imprevisto durante il salvataggio.' })
        } finally {
            setCreatingPartner(false)
        }
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
                        Aggiungi, modifica o rimuovi le attività convenzionate e i relativi account negoziante.
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

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
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
                                <th className="px-6 py-4 text-center">Stato Partner</th>
                                <th className="px-6 py-4 text-center">Contatti</th>
                                <th className="px-6 py-4 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 font-medium">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-400">
                                        Nessuna convenzione trovata.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => {
                                    const hasPartner = c.partnerUsers && c.partnerUsers.length > 0
                                    const partnerUser = hasPartner ? c.partnerUsers![0] : null

                                    return (
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
                                                {hasPartner ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold" title={partnerUser?.email}>
                                                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                                                        Accreditato ({partnerUser?.email})
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                                                        Non accreditato
                                                    </span>
                                                )}
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
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            setSelectedConvention(c)
                                                            setPartnerName(hasPartner ? partnerUser!.name : c.name)
                                                            setPartnerEmail(hasPartner ? partnerUser!.email : "")
                                                            setPartnerPassword("")
                                                            setPartnerStatus(null)
                                                        }}
                                                        className={cn(
                                                            "p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1 cursor-pointer",
                                                            hasPartner
                                                                ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                                                : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                        )}
                                                        title={hasPartner ? "Modifica Account Partner" : "Crea Account Partner per Negoziante"}
                                                    >
                                                        <Key className="size-3.5" />
                                                        <span className="hidden xl:inline text-[11px]">
                                                            {hasPartner ? "Modifica Partner" : "Accredita Partner"}
                                                        </span>
                                                    </button>
                                                    <Link
                                                        href={`/admin/conventions/${c.id}/edit`}
                                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                        title="Modifica"
                                                    >
                                                        <Edit className="size-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={async (e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
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
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            handleDelete(c.id)
                                                        }}
                                                        disabled={isDeleting === c.id}
                                                        className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Elimina"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Partner Account Modal */}
            {selectedConvention && (
                <div className="fixed inset-0 z-[99999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            type="button"
                            onClick={() => setSelectedConvention(null)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-3 rounded-2xl border",
                                existingPartnerUser ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                            )}>
                                <Store className="size-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                    {existingPartnerUser ? "Gestisci Account Partner" : "Accredita Account Partner"}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    {selectedConvention.name}
                                </p>
                            </div>
                        </div>

                        {existingPartnerUser && (
                            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold space-y-1">
                                <div className="flex items-center gap-1.5 font-bold">
                                    <CheckCircle2 className="size-4 text-emerald-600" />
                                    <span>Account Partner Attivo</span>
                                </div>
                                <p className="text-[11px] text-emerald-700">Email login: <strong>{existingPartnerUser.email}</strong></p>
                            </div>
                        )}

                        {partnerStatus && (
                            <div className={`p-4 rounded-2xl border text-xs font-bold ${
                                partnerStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                                {partnerStatus.text}
                            </div>
                        )}

                        <form onSubmit={handleCreatePartnerAccount} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Nome Referente / Attività
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={partnerName}
                                    onChange={(e) => setPartnerName(e.target.value)}
                                    placeholder="Es. Elerent Messina"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Email Login Partner
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={partnerEmail}
                                    onChange={(e) => setPartnerEmail(e.target.value)}
                                    placeholder="partner@celerent.it"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                                    Password Login
                                </label>
                                <input
                                    type="password"
                                    required={!existingPartnerUser}
                                    minLength={6}
                                    value={partnerPassword}
                                    onChange={(e) => setPartnerPassword(e.target.value)}
                                    placeholder={existingPartnerUser ? "Nuova password (lascia vuoto per non modificare)" : "••••••••"}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-slate-900 text-slate-900"
                                />
                                {existingPartnerUser && (
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Inserisci una nuova password solo se desideri reimpostare l&apos;accesso.</p>
                                )}
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedConvention(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
                                >
                                    Chiudi
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingPartner}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                                >
                                    {creatingPartner && <Loader2 className="size-4 animate-spin" />}
                                    {existingPartnerUser ? "Aggiorna Account Partner" : "Crea Account Partner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
