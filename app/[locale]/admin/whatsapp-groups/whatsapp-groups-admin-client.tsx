"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, Edit3, Copy, Search, Phone, Users,
    Film, Home as HomeIcon, Info, ExternalLink, Loader2
} from "lucide-react"
import {
    createWhatsAppGroup,
    updateWhatsAppGroup,
    deleteWhatsAppGroup
} from "@/app/actions/whatsapp-groups"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface WhatsAppGroupsAdminClientProps {
    initialGroups: any[]
    userRole?: string
}

const CATEGORIES = [
    { value: "ACADEMIC", label: "Corsi Accademici" },
    { value: "COMMUNITY", label: "Community & Tematici" }
]

const DEPARTMENTS = [
    "DICAM (Civiltà Antiche e Moderne)",
    "Economia",
    "Scienze Politiche e Giuridiche (SCIPOG) / Giurisprudenza",
    "Ingegneria",
    "Scienze, MIFT e CHIBIOFARAM",
    "Medicina, Professioni Sanitarie e Scienze Motorie",
    "Veterinaria"
]

const AVAILABLE_ICONS = [
    { name: "Users", icon: Users },
    { name: "Film", icon: Film },
    { name: "Home", icon: HomeIcon },
    { name: "Phone", icon: Phone },
    { name: "Info", icon: Info }
]

const ICON_MAP: Record<string, any> = {
    Users, Film, Home: HomeIcon, Phone, Info
}

const THEME_PRESETS = [
    { name: "blue", label: "Blu", classes: "text-blue-500 bg-blue-50 border-blue-100 hover:border-blue-200 hover:bg-blue-50/70" },
    { name: "purple", label: "Viola", classes: "text-purple-500 bg-purple-50 border-purple-100 hover:border-purple-200 hover:bg-purple-50/70" },
    { name: "amber", label: "Arancione", classes: "text-amber-500 bg-amber-50 border-amber-100 hover:border-amber-200 hover:bg-amber-50/70" },
    { name: "green", label: "Verde (WhatsApp)", classes: "text-green-500 bg-green-50 border-green-100 hover:border-green-200 hover:bg-green-50/70" }
]

export function WhatsAppGroupsAdminClient({ initialGroups, userRole }: WhatsAppGroupsAdminClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedDept, setSelectedDept] = useState<string>("all")

    // Form modal state
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState({
        name: "",
        nameEn: "",
        link: "",
        category: "ACADEMIC",
        department: "DICAM (Civiltà Antiche e Moderne)",
        description: "",
        descriptionEn: "",
        icon: "Users",
        theme: THEME_PRESETS[0].classes,
        order: 0
    })

    const handleOpenAdd = () => {
        setEditingId(null)
        setForm({
            name: "",
            nameEn: "",
            link: "",
            category: selectedCategory !== "all" ? selectedCategory : "ACADEMIC",
            department: selectedDept !== "all" ? selectedDept : "DICAM (Civiltà Antiche e Moderne)",
            description: "",
            descriptionEn: "",
            icon: "Users",
            theme: THEME_PRESETS[0].classes,
            order: initialGroups.length
        })
        setIsOpen(true)
    }

    const handleEdit = (g: any) => {
        setEditingId(g.id)
        setForm({
            name: g.name,
            nameEn: g.nameEn || "",
            link: g.link,
            category: g.category,
            department: g.department || "DICAM (Civiltà Antiche e Moderne)",
            description: g.description || "",
            descriptionEn: g.descriptionEn || "",
            icon: g.icon || "Users",
            theme: g.theme || THEME_PRESETS[0].classes,
            order: g.order || 0
        })
        setIsOpen(true)
    }

    const handleDuplicate = async (g: any) => {
        if (!confirm(`Vuoi duplicare ${g.name}?`)) return
        setLoading(true)
        try {
            const res = await createWhatsAppGroup({
                ...g,
                name: `${g.name} (Copia)`,
                nameEn: g.nameEn ? `${g.nameEn} (Copy)` : undefined,
                order: (g.order || 0) + 1
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
        if (!confirm("Sicuro di voler eliminare questo gruppo?")) return
        setLoading(true)
        try {
            const res = await deleteWhatsAppGroup(id)
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
        if (!form.name || !form.link) {
            alert("Nome e Link sono obbligatori")
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: form.name,
                nameEn: form.nameEn || undefined,
                link: form.link,
                category: form.category,
                department: form.category === "ACADEMIC" ? form.department : undefined,
                description: form.category === "COMMUNITY" ? form.description : undefined,
                descriptionEn: form.category === "COMMUNITY" ? form.descriptionEn : undefined,
                icon: form.category === "COMMUNITY" ? form.icon : undefined,
                theme: form.category === "COMMUNITY" ? form.theme : undefined,
                order: Number(form.order) || 0
            }

            let res
            if (editingId) {
                res = await updateWhatsAppGroup(editingId, payload)
            } else {
                res = await createWhatsAppGroup(payload)
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

    const filteredGroups = initialGroups.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                              (g.department && g.department.toLowerCase().includes(search.toLowerCase()))
        const matchesCategory = selectedCategory === "all" || g.category === selectedCategory
        const matchesDept = selectedDept === "all" || g.department === selectedDept
        return matchesSearch && matchesCategory && matchesDept
    })

    const academicGroups = filteredGroups.filter(g => g.category === "ACADEMIC")
    const communityGroups = filteredGroups.filter(g => g.category === "COMMUNITY")

    return (
        <div className="space-y-8">
            {/* Category Tab Switcher */}
            <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-2">
                <button
                    onClick={() => { setSelectedCategory("all"); setSelectedDept("all"); }}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedCategory === "all"
                            ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    )}
                >
                    Tutti ({initialGroups.length})
                </button>
                <button
                    onClick={() => { setSelectedCategory("ACADEMIC"); setSelectedDept("all"); }}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedCategory === "ACADEMIC"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    )}
                >
                    Corsi Accademici ({initialGroups.filter(g => g.category === "ACADEMIC").length})
                </button>
                <button
                    onClick={() => { setSelectedCategory("COMMUNITY"); setSelectedDept("all"); }}
                    className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                        selectedCategory === "COMMUNITY"
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-100"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    )}
                >
                    Community ({initialGroups.filter(g => g.category === "COMMUNITY").length})
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cerca per corso o dipartimento..."
                        className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:bg-white text-sm font-semibold transition-all"
                    />
                </div>

                <div className="flex flex-wrap w-full md:w-auto gap-3 items-center">
                    {selectedCategory === "ACADEMIC" && (
                        <select
                            value={selectedDept}
                            onChange={e => setSelectedDept(e.target.value)}
                            className="px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none text-xs font-bold uppercase tracking-wider cursor-pointer max-w-[200px]"
                        >
                            <option value="all">Tutti i Dipartimenti</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    )}

                    <button
                        onClick={handleOpenAdd}
                        className="grow md:grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
                    >
                        <Plus className="size-4" /> Aggiungi Gruppo
                    </button>
                </div>
            </div>

            {/* Grids Layout */}
            <div className="space-y-10">
                {/* 1. Community Section */}
                {(selectedCategory === "all" || selectedCategory === "COMMUNITY") && communityGroups.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 shrink-0">Community & Gruppi Tematici</h3>
                            <div className="h-px w-full bg-purple-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communityGroups.map(group => {
                                const Icon = ICON_MAP[group.icon || "Users"] || Users
                                return (
                                    <div key={group.id} className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group relative">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className={cn(
                                                    "size-10 rounded-2xl flex items-center justify-center border",
                                                    group.theme ? group.theme.split(" ").slice(0, 3).join(" ") : "text-purple-500 bg-purple-50 border-purple-100"
                                                )}>
                                                    <Icon className="size-5" />
                                                </div>
                                                <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border bg-purple-50 border-purple-100 text-purple-700">
                                                    Community
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-zinc-900 leading-snug font-serif text-lg uppercase tracking-tight">{group.name}</h4>
                                            {group.nameEn && <p className="text-[10px] text-zinc-400 italic mt-0.5">EN: {group.nameEn}</p>}
                                            {group.description && <p className="text-xs text-zinc-500 mt-2 line-clamp-3 leading-relaxed font-medium">{group.description}</p>}
                                            {group.descriptionEn && <p className="text-[11px] text-zinc-400 mt-1 line-clamp-3 leading-relaxed italic">EN: {group.descriptionEn}</p>}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-zinc-150/50 flex items-center justify-between gap-4">
                                            <a href={group.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline">
                                                <ExternalLink className="size-3.5" /> Entra
                                            </a>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(group)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all" title="Modifica">
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button onClick={() => handleDuplicate(group)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all" title="Duplica">
                                                    <Copy className="size-4" />
                                                </button>
                                                <button onClick={() => handleDelete(group.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Elimina">
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Academic Sections by Department */}
                {(selectedCategory === "all" || selectedCategory === "ACADEMIC") && DEPARTMENTS.map(dept => {
                    const deptGroups = academicGroups.filter(g => g.department === dept)
                    if (deptGroups.length === 0) return null
                    return (
                        <div key={dept} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 shrink-0">{dept}</h3>
                                <div className="h-px w-full bg-blue-100"></div>
                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">{deptGroups.length}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {deptGroups.map(group => (
                                    <div key={group.id} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group relative">
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border bg-blue-50 border-blue-100 text-blue-700">
                                                    Corso
                                                </span>
                                                <span className="text-[9px] font-mono text-zinc-400">Ordine: {group.order}</span>
                                            </div>
                                            <h4 className="font-bold text-zinc-900 leading-snug">{group.name}</h4>
                                            {group.nameEn && <p className="text-[10px] text-zinc-400 italic mt-0.5">EN: {group.nameEn}</p>}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-zinc-150/50 flex items-center justify-between gap-4">
                                            <a href={group.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline">
                                                <ExternalLink className="size-3.5" /> Entra
                                            </a>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(group)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all" title="Modifica">
                                                    <Edit3 className="size-3.5" />
                                                </button>
                                                <button onClick={() => handleDuplicate(group)} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all" title="Duplica">
                                                    <Copy className="size-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(group.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Elimina">
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {filteredGroups.length === 0 && (
                    <div className="text-center py-16 text-zinc-400 italic bg-white rounded-3xl border border-zinc-100 shadow-sm">
                        Nessun gruppo WhatsApp trovato corrispondente alla ricerca.
                    </div>
                )}
            </div>

            {/* Dialog Form */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                    <form onSubmit={handleSave} className="bg-white p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Phone className="size-6 text-zinc-900" />
                                {editingId ? "Modifica Gruppo WhatsApp" : "Nuovo Gruppo WhatsApp"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Gruppo (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: L18 Economia aziendale"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Gruppo (EN)</label>
                                <input
                                    type="text"
                                    value={form.nameEn}
                                    onChange={e => setForm({ ...form, nameEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: General Group"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Link WhatsApp (URL) *</label>
                                <input
                                    type="url"
                                    required
                                    value={form.link}
                                    onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-semibold text-sm"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria *</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none bg-white font-bold"
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                />
                            </div>

                            {form.category === "ACADEMIC" ? (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Dipartimento *</label>
                                    <select
                                        value={form.department}
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none bg-white font-bold"
                                    >
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione (IT) *</label>
                                        <textarea
                                            required={form.category === "COMMUNITY"}
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-20 resize-none font-medium text-sm"
                                            placeholder="Descrizione del gruppo..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione (EN)</label>
                                        <textarea
                                            value={form.descriptionEn}
                                            onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-20 resize-none font-medium text-sm"
                                            placeholder="Group description in English..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tema Colore Preset</label>
                                        <select
                                            value={form.theme}
                                            onChange={e => setForm({ ...form, theme: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none bg-white font-bold text-xs"
                                        >
                                            {THEME_PRESETS.map(t => <option key={t.name} value={t.classes}>{t.label}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Seleziona Icona</label>
                                        <div className="flex gap-2 h-11 items-center">
                                            {AVAILABLE_ICONS.map(item => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, icon: item.name })}
                                                    className={cn(
                                                        "flex items-center justify-center size-9 rounded-xl border transition-all hover:bg-zinc-50",
                                                        form.icon === item.name
                                                            ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                                                            : "border-zinc-100 text-zinc-500"
                                                    )}
                                                    title={item.name}
                                                >
                                                    <item.icon className="size-4" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-150 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                    ) : (
                                        editingId ? "Aggiorna Gruppo" : "Salva Gruppo"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
