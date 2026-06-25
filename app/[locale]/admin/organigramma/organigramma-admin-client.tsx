"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
    Plus, Trash2, Mail, Shield, Users, Award,
    Edit3, Copy, Search, Loader2, ArrowUpDown, ArrowUp, ArrowDown,
    MapPin, BookOpen, ImageIcon, Upload, X
} from "lucide-react"
import {
    createOrganigrammaMember,
    updateOrganigrammaMember,
    deleteOrganigrammaMember,
    toggleOrganigrammaVisibility
} from "@/app/actions/organigramma"
import { cn } from "@/lib/utils"
import { OrganigrammaAssociation, OrganigrammaSection } from "@prisma/client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MediaSelector } from "@/components/admin/media-selector"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface OrganigrammaAdminClientProps {
    initialMembers: any[]
    userRole?: string
    initialVisible?: boolean
}

const SECTIONS = [
    { value: "COORDINATOR", label: "Coordinatore" },
    { value: "RESPONSIBLE", label: "Responsabile" },
    { value: "DEPARTMENT", label: "Responsabile di Dipartimento" }
]

const ASSOCIATIONS = [
    { value: "MORGANA", label: "Associazione Morgana" },
    { value: "ORUM", label: "O.R.U.M." }
]

const DEPARTMENTS = [
    "Dipartimento Civiltà Antiche e Moderne (DICAM)",
    "Dipartimento di Economia",
    "Dipartimento di Giurisprudenza",
    "Dipartimento di Ingegneria",
    "Dipartimento Medicina Clinica e Sperimentale (DIMED)",
    "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva",
    "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)",
    "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)",
    "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)",
    "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)",
    "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)",
    "Dipartimento Scienze Veterinarie (VET)"
]

export function OrganigrammaAdminClient({ initialMembers, userRole, initialVisible = true }: OrganigrammaAdminClientProps) {
    const router = useRouter()
    const [members, setMembers] = useState(initialMembers)
    const [search, setSearch] = useState("")
    const [selectedAssociation, setSelectedAssociation] = useState<string>("all")
    const [selectedSection, setSelectedSection] = useState<string>("all")

    // Visibility config state
    const [visible, setVisible] = useState(initialVisible)
    const [toggleLoading, setToggleLoading] = useState(false)

    const handleToggleVisibility = async () => {
        setToggleLoading(true)
        try {
            const nextVisible = !visible
            const res = await toggleOrganigrammaVisibility(nextVisible)
            if (res.success) {
                setVisible(nextVisible)
                router.refresh()
            } else {
                alert(res.error || "Errore durante il salvataggio")
            }
        } catch (error) {
            console.error(error)
            alert("Errore di rete o imprevisto")
        } finally {
            setToggleLoading(false)
        }
    }

    // Form modal state
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isMediaOpen, setIsMediaOpen] = useState(false)

    const handleImageUpload = async (file: File) => {
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (res.ok) {
                setForm(prev => ({ ...prev, image: data.url }))
            } else {
                alert(data.error || "Errore nel caricamento dell'immagine")
            }
        } catch {
            alert("Errore nel caricamento dell'immagine")
        } finally {
            setIsUploading(false)
        }
    }

    const [form, setForm] = useState({
        name: "",
        role: "",
        roleEn: "",
        email: "",
        association: "MORGANA",
        section: "COORDINATOR",
        order: 0,
        image: "",
        phone: "",
        instagram: "",
        description: ""
    })

    const handleOpenAdd = () => {
        setEditingId(null)
        setForm({
            name: "",
            role: "",
            roleEn: "",
            email: "",
            association: selectedAssociation !== "all" ? selectedAssociation : "MORGANA",
            section: selectedSection !== "all" ? selectedSection : "COORDINATOR",
            order: 0,
            image: "",
            phone: "",
            instagram: "",
            description: ""
        })
        setIsOpen(true)
    }

    const handleEdit = (m: any) => {
        setEditingId(m.id)
        setForm({
            name: m.name,
            role: m.role,
            roleEn: m.roleEn || "",
            email: m.email || "",
            association: m.association,
            section: m.section,
            order: m.order || 0,
            image: m.image || "",
            phone: m.phone || "",
            instagram: m.instagram || "",
            description: m.description || ""
        })
        setIsOpen(true)
    }

    const handleDuplicate = async (m: any) => {
        if (!confirm(`Vuoi duplicare ${m.name}?`)) return
        setLoading(true)
        try {
            const res = await createOrganigrammaMember({
                name: `${m.name} (Copia)`,
                role: m.role,
                roleEn: m.roleEn || undefined,
                email: m.email || undefined,
                association: m.association,
                section: m.section,
                order: (m.order || 0) + 1,
                image: m.image || undefined,
                phone: m.phone || undefined,
                instagram: m.instagram || undefined,
                description: m.description || undefined
            })
            if (res.success) {
                router.refresh()
            } else {
                alert(res.error)
            }
        } catch (error) {
            console.error(error)
            alert("Errore durante la duplicazione")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo componente?")) return
        setLoading(true)
        try {
            const res = await deleteOrganigrammaMember(id)
            if (res.success) {
                router.refresh()
            } else {
                alert(res.error)
            }
        } catch (error) {
            console.error(error)
            alert("Errore durante l'eliminazione")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name || !form.role) {
            alert("Nome e Ruolo sono obbligatori")
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: form.name,
                role: form.role,
                roleEn: form.roleEn || undefined,
                email: form.email || undefined,
                association: form.association as OrganigrammaAssociation,
                section: form.section as OrganigrammaSection,
                order: Number(form.order) || 0,
                image: form.image || undefined,
                phone: form.phone || undefined,
                instagram: form.instagram || undefined,
                description: form.description || undefined
            }

            let res
            if (editingId) {
                res = await updateOrganigrammaMember(editingId, payload)
            } else {
                res = await createOrganigrammaMember(payload)
            }

            if (res.success) {
                setIsOpen(false)
                router.refresh()
            } else {
                alert(res.error)
            }
        } catch (error) {
            console.error(error)
            alert("Errore durante il salvataggio")
        } finally {
            setLoading(false)
        }
    }

    const handleReorderMember = async (member: any, direction: "up" | "down") => {
        const sectionMembers = [...initialMembers]
            .filter(m => m.section === member.section)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            
        const index = sectionMembers.findIndex(m => m.id === member.id)
        if (index === -1) return
        
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= sectionMembers.length) return
        
        const otherMember = sectionMembers[targetIndex]
        
        setLoading(true)
        try {
            const originalOrder = member.order
            const targetOrder = otherMember.order
            
            const newOrderSelf = targetOrder === originalOrder ? (direction === "up" ? originalOrder - 1 : originalOrder + 1) : targetOrder
            const newOrderOther = originalOrder
            
            const res1 = await updateOrganigrammaMember(member.id, {
                name: member.name,
                role: member.role,
                roleEn: member.roleEn || undefined,
                email: member.email || undefined,
                association: member.association,
                section: member.section,
                order: newOrderSelf,
                image: member.image || undefined,
                phone: member.phone || undefined,
                instagram: member.instagram || undefined,
                description: member.description || undefined
            })
            
            const res2 = await updateOrganigrammaMember(otherMember.id, {
                name: otherMember.name,
                role: otherMember.role,
                roleEn: otherMember.roleEn || undefined,
                email: otherMember.email || undefined,
                association: otherMember.association,
                section: otherMember.section,
                order: newOrderOther,
                image: otherMember.image || undefined,
                phone: otherMember.phone || undefined,
                instagram: otherMember.instagram || undefined,
                description: otherMember.description || undefined
            })
            
            if (res1.success && res2.success) {
                router.refresh()
            } else {
                alert("Errore nel riordinamento: " + (res1.error || res2.error || ""))
            }
        } catch (error) {
            console.error(error)
            alert("Errore imprevisto nel riordinamento")
        } finally {
            setLoading(false)
        }
    }

    const filteredMembers = initialMembers.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                              m.role.toLowerCase().includes(search.toLowerCase())
        const matchesSection = selectedSection === "all" || m.section === selectedSection
        return matchesSearch && matchesSection
    })

    const getSectionBadge = (section: string) => {
        switch (section) {
            case "PRESIDENCY":
                return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100"><Shield className="size-3" /> Presidenza</span>
            case "BOARD":
                return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100"><Users className="size-3" /> Direttivo</span>
            case "COORDINATOR":
                return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100"><Award className="size-3" /> Coordinatore</span>
            case "RESPONSIBLE":
                return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100"><Users className="size-3" /> Responsabile</span>
            case "DEPARTMENT":
                return <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100"><BookOpen className="size-3" /> Dipartimento</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
                            <Shield className="size-6" />
                        </div>
                        Gestione Organigramma
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                        Gestisci i componenti dei direttivi, presidenze e dipartimenti delle associazioni.
                    </p>
                </div>

                <div className="flex items-center gap-4 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200/40 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-700">Visibilità Pubblica</span>
                        <span className="text-[10px] text-slate-400 font-medium">Mostra l&apos;organigramma sul sito</span>
                    </div>
                    <button
                        onClick={handleToggleVisibility}
                        disabled={toggleLoading}
                        className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50",
                            visible ? "bg-emerald-500" : "bg-slate-300"
                        )}
                    >
                        <span
                            className={cn(
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                visible ? "translate-x-5" : "translate-x-0"
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cerca per nome o ruolo..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                    />
                </div>

                <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">

                    <select
                        value={selectedSection}
                        onChange={e => setSelectedSection(e.target.value)}
                        className="px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-xs font-bold uppercase tracking-wider bg-white cursor-pointer"
                    >
                        <option value="all">Tutte le Aree</option>
                        {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>

                    <button
                        onClick={handleOpenAdd}
                        className="grow md:grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                    >
                        <Plus className="size-4" /> Aggiungi Componente
                    </button>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200/60">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Nome</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Area</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ruolo / Dipartimento</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Email</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ordine</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-sm">
                            {filteredMembers.map((m: any) => {
                                const sectionMembers = [...initialMembers]
                                    .filter(item => item.section === m.section)
                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                const idx = sectionMembers.findIndex(item => item.id === m.id)
                                const isFirst = idx === 0
                                const isLast = idx === sectionMembers.length - 1

                                return (
                                    <tr key={m.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-zinc-900">{m.name}</td>
                                        <td className="px-6 py-4">
                                            {getSectionBadge(m.section)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-zinc-800">{m.role}</div>
                                            {m.roleEn && <div className="text-xs text-zinc-400 italic">EN: {m.roleEn}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {m.email ? (
                                                <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
                                                    <Mail className="size-3.5" /> {m.email}
                                                </a>
                                            ) : (
                                                <span className="text-xs text-zinc-300 italic">Nessuna email</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-zinc-500">
                                            <div className="flex items-center gap-1">
                                                <span className="w-6 text-right">{m.order}</span>
                                                <div className="flex gap-0.5 ml-2 border border-zinc-100 p-0.5 bg-zinc-50 rounded-lg shadow-inner">
                                                    <button
                                                        type="button"
                                                        disabled={isFirst || loading}
                                                        onClick={() => handleReorderMember(m, "up")}
                                                        className="p-1 hover:bg-white disabled:opacity-30 rounded text-zinc-500 hover:text-zinc-900 transition-colors"
                                                        title="Sposta su"
                                                    >
                                                        <ArrowUp className="size-3" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isLast || loading}
                                                        onClick={() => handleReorderMember(m, "down")}
                                                        className="p-1 hover:bg-white disabled:opacity-30 rounded text-zinc-500 hover:text-zinc-900 transition-colors"
                                                        title="Sposta giù"
                                                    >
                                                        <ArrowDown className="size-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(m)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all" title="Modifica">
                                                <Edit3 className="size-4" />
                                            </button>
                                            <button onClick={() => handleDuplicate(m)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all" title="Duplica">
                                                <Copy className="size-4" />
                                            </button>
                                            <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Elimina">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-zinc-400 italic">
                                        Nessun componente trovato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialog Form */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-y-auto max-h-[90vh] border-none rounded-2xl shadow-2xl">
                    <form onSubmit={handleSave} className="bg-white p-6 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
                                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                                    <Shield className="size-5" />
                                </div>
                                {editingId ? "Modifica Componente" : "Nuovo Componente"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Foto (Opzionale)</label>
                                <div className="flex items-start gap-6">
                                    {/* Preview */}
                                    <div className="relative size-24 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                                        {form.image ? (
                                            <>
                                                <Image src={form.image} alt="Preview" fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </>
                                        ) : (
                                            <ImageIcon className="size-8 text-slate-350" />
                                        )}
                                    </div>
                                    {/* Upload Area */}
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                                            onDrop={(e) => {
                                                e.preventDefault(); e.stopPropagation()
                                                const file = e.dataTransfer.files[0]
                                                if (file) handleImageUpload(file)
                                            }}
                                            className="border border-dashed border-slate-200/60 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50/50 transition-all bg-slate-50/30"
                                        >
                                            {isUploading ? (
                                                <div className="flex items-center justify-center gap-2 text-slate-550">
                                                    <Loader2 className="size-5 animate-spin" />
                                                    <span className="text-sm font-semibold">Caricamento...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <Upload className="size-5 text-slate-400" />
                                                    <span className="text-xs text-slate-500 font-semibold">Clicca o trascina un&apos;immagine</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">JPG, PNG, WebP — max 5MB</span>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleImageUpload(file)
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsMediaOpen(true)}
                                            className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <ImageIcon className="size-3.5 text-slate-500" />
                                            Oppure scegli dalla Libreria Media
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome e Cognome *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="Es: Giorgio Messina"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Associazione *</label>
                                <select
                                    value={form.association}
                                    onChange={e => setForm({ ...form, association: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all bg-white"
                                >
                                    {ASSOCIATIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Area / Sezione *</label>
                                <select
                                    value={form.section}
                                    onChange={e => setForm({ ...form, section: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all bg-white"
                                >
                                    {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>

                            {form.section === "DEPARTMENT" ? (
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Dipartimento *</label>
                                    <select
                                        value={form.role}
                                        onChange={e => setForm({ ...form, role: e.target.value, roleEn: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all bg-white"
                                    >
                                        <option value="">Seleziona Dipartimento</option>
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ruolo (IT) *</label>
                                        <input
                                            type="text"
                                            required={form.section !== "DEPARTMENT"}
                                            value={form.role}
                                            onChange={e => setForm({ ...form, role: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                            placeholder="Es: Coordinatore Logistica, Responsabile, ..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ruolo (EN)</label>
                                        <input
                                            type="text"
                                            value={form.roleEn}
                                            onChange={e => setForm({ ...form, roleEn: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                            placeholder="Es: Logistics Coordinator, Manager, ..."
                                        />
                                    </div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Email Contatto</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all font-sans"
                                    placeholder="presidenza.morgana@gmail.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Telefono</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="+39 123 456 7890"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Instagram</label>
                                <input
                                    type="text"
                                    value={form.instagram}
                                    onChange={e => setForm({ ...form, instagram: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="@username"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ordine di Visualizzazione</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione Ruolo / Chi Sono (Rich Text)</label>
                                <RichTextEditor
                                    value={form.description}
                                    onChange={val => setForm({ ...form, description: val })}
                                    placeholder="Scrivi una breve descrizione per questo componente..."
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                    ) : (
                                        editingId ? "Aggiorna Componente" : "Salva Componente"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <MediaSelector
                isOpen={isMediaOpen}
                onClose={() => setIsMediaOpen(false)}
                onSelect={(url) => setForm(prev => ({ ...prev, image: url }))}
            />
        </div>
    )
}
