"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, Edit3, Copy, Search, Phone, Users,
    Film, Home as HomeIcon, Info, ExternalLink, Loader2, Sparkles
} from "lucide-react"
import { translateText } from "@/app/actions/translate"
import {
    createWhatsAppGroup,
    updateWhatsAppGroup,
    deleteWhatsAppGroup
} from "@/app/actions/whatsapp-groups"
import { WhatsAppGroupCategory } from "@prisma/client"
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
    { value: "COMMUNITY", label: "Community & Tematici" },
    { value: "SANITARY_VET", label: "Area Sanitaria & Veterinaria" }
]

const DEPARTMENTS = [
    "BIOMORF (Scienze Biomediche e Odontoiatriche)",
    "CHIBIOFARAM (Scienze Chimiche, Biologiche, Farmaceutiche)",
    "COSPECS (Scienze Cognitive e Pedagogiche)",
    "Civiltà Antiche e Moderne (DICAM)",
    "Economia",
    "Giurisprudenza",
    "Ingegneria",
    "MIFT (Scienze Matematiche, Fisiche e della Terra)",
    "Medicina Clinica e Sperimentale",
    "Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"",
    "SCIPOG (Scienze Politiche e Giuridiche)",
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
    { name: "blue", label: "Blu", classes: "text-blue-500 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/30 hover:bg-blue-500/15" },
    { name: "purple", label: "Viola", classes: "text-purple-500 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/30 hover:bg-purple-500/15" },
    { name: "amber", label: "Arancione", classes: "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/30 hover:bg-amber-500/15" },
    { name: "green", label: "Verde (WhatsApp)", classes: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/15" }
]

export function WhatsAppGroupsAdminClient({ initialGroups, userRole }: WhatsAppGroupsAdminClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedDept, setSelectedDept] = useState<string>("all")

    // Form modal state
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isTranslating, setIsTranslating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleTranslate = async () => {
        if (!form.name && !form.description) {
            alert("Inserisci il Nome o la Descrizione in italiano prima di tradurre.")
            return
        }

        setIsTranslating(true)
        try {
            const namePromise = form.name ? translateText(form.name) : Promise.resolve({ success: true, translation: "" })
            const descPromise = form.description ? translateText(form.description) : Promise.resolve({ success: true, translation: "" })

            const [nameRes, descRes] = await Promise.all([namePromise, descPromise])

            setForm(prev => ({
                ...prev,
                nameEn: nameRes.success ? (nameRes.translation || prev.nameEn) : prev.nameEn,
                descriptionEn: descRes.success ? (descRes.translation || prev.descriptionEn) : prev.descriptionEn
            }))
        } catch (err) {
            console.error("Translation error:", err)
            alert("Errore durante la traduzione automatica.")
        } finally {
            setIsTranslating(false)
        }
    }

    const [form, setForm] = useState({
        name: "",
        nameEn: "",
        link: "",
        category: "ACADEMIC",
        department: "Civiltà Antiche e Moderne (DICAM)",
        description: "",
        descriptionEn: "",
        icon: "Users",
        theme: THEME_PRESETS[0].classes,
        order: 0,
        semester: "",
        subcategory: "",
        isGeneral: false
    })

    const handleOpenAdd = () => {
        setEditingId(null)
        const cat = selectedCategory !== "all" ? selectedCategory : "ACADEMIC"
        setForm({
            name: "",
            nameEn: "",
            link: "",
            category: cat,
            department: selectedDept !== "all" ? selectedDept : "Civiltà Antiche e Moderne (DICAM)",
            description: "",
            descriptionEn: "",
            icon: "Users",
            theme: THEME_PRESETS[0].classes,
            order: initialGroups.length,
            semester: "",
            subcategory: cat === "SANITARY_VET" ? "MEDICINA" : "",
            isGeneral: cat === "SANITARY_VET"
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
            department: g.department || "Civiltà Antiche e Moderne (DICAM)",
            description: g.description || "",
            descriptionEn: g.descriptionEn || "",
            icon: g.icon || "Users",
            theme: g.theme || THEME_PRESETS[0].classes,
            order: g.order || 0,
            semester: g.semester || "",
            subcategory: g.subcategory || "",
            isGeneral: g.isGeneral || false
        })
        setIsOpen(true)
    }

    const handleDuplicate = async (g: any) => {
        if (!confirm(`Vuoi duplicare ${g.name}?`)) return
        setLoading(true)
        try {
            const res = await createWhatsAppGroup({
                name: `${g.name} (Copia)`,
                nameEn: g.nameEn ? `${g.nameEn} (Copy)` : undefined,
                link: g.link,
                category: g.category as WhatsAppGroupCategory,
                department: g.department || undefined,
                description: g.description || undefined,
                descriptionEn: g.descriptionEn || undefined,
                icon: g.icon || undefined,
                theme: g.theme || undefined,
                order: (g.order || 0) + 1,
                semester: g.semester || undefined,
                subcategory: g.subcategory || undefined,
                isGeneral: g.isGeneral || false
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
            const isSanitaryVetCategory = form.category === "SANITARY_VET"
            const payload = {
                name: form.name,
                nameEn: form.nameEn || undefined,
                link: form.link,
                category: form.category as WhatsAppGroupCategory,
                department: form.category === "ACADEMIC" ? form.department : undefined,
                description: (form.category === "COMMUNITY" || form.category === "SANITARY_VET") ? form.description : undefined,
                descriptionEn: (form.category === "COMMUNITY" || form.category === "SANITARY_VET") ? form.descriptionEn : undefined,
                icon: form.category === "COMMUNITY" ? form.icon : undefined,
                theme: form.category === "COMMUNITY" ? form.theme : undefined,
                order: Number(form.order) || 0,
                semester: undefined,
                subcategory: isSanitaryVetCategory ? (form.subcategory || "MEDICINA") : undefined,
                isGeneral: isSanitaryVetCategory ? true : false
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
    const sanitaryVetGroups = filteredGroups.filter(g => g.category === "SANITARY_VET")

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                            <Phone className="size-6" />
                        </div>
                        Gestione Gruppi WhatsApp
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                        Gestisci i link e le descrizioni dei gruppi WhatsApp ufficiali delle community e dei corsi di laurea.
                    </p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all rounded-xl shadow-sm group"
                >
                    <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                    Aggiungi Gruppo
                </button>
            </div>

            {/* Category Tab Switcher */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                <button
                    onClick={() => { setSelectedCategory("all"); setSelectedDept("all"); }}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border",
                        selectedCategory === "all"
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                >
                    Tutti ({initialGroups.length})
                </button>
                <button
                    onClick={() => { setSelectedCategory("ACADEMIC"); setSelectedDept("all"); }}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border",
                        selectedCategory === "ACADEMIC"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-955"
                    )}
                >
                    Corsi Accademici ({initialGroups.filter(g => g.category === "ACADEMIC").length})
                </button>
                <button
                    onClick={() => { setSelectedCategory("COMMUNITY"); setSelectedDept("all"); }}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border",
                        selectedCategory === "COMMUNITY"
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                    )}
                >
                    Community ({initialGroups.filter(g => g.category === "COMMUNITY").length})
                </button>
                <button
                    onClick={() => { setSelectedCategory("SANITARY_VET"); setSelectedDept("all"); }}
                    className={cn(
                        "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border",
                        selectedCategory === "SANITARY_VET"
                            ? "bg-[#c9041a] text-white border-[#c9041a] shadow-sm"
                            : "bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                    )}
                >
                    Area Sanitaria & Vet ({initialGroups.filter(g => g.category === "SANITARY_VET").length})
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cerca per corso o dipartimento..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                    />
                </div>

                <div className="flex flex-wrap w-full md:w-auto gap-3 items-center justify-end">
                    {selectedCategory === "ACADEMIC" && (
                        <select
                            value={selectedDept}
                            onChange={e => setSelectedDept(e.target.value)}
                            className="px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 outline-none transition-all cursor-pointer font-semibold text-slate-700 min-w-[200px]"
                        >
                            <option value="all">Tutti i Dipartimenti</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    )}

                    {(selectedDept !== "all" || search !== "") && (
                        <button
                            onClick={() => { setSelectedDept("all"); setSearch(""); }}
                            className="text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
                        >
                            Resetta
                        </button>
                    )}
                </div>
            </div>

            {/* Grids Layout */}
            <div className="space-y-10">
                {/* 1. Community Section */}
                {(selectedCategory === "all" || selectedCategory === "COMMUNITY") && communityGroups.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 shrink-0">Community & Gruppi Tematici</h3>
                            <div className="h-px w-full bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communityGroups.map(group => {
                                const Icon = ICON_MAP[group.icon || "Users"] || Users
                                return (
                                    <div key={group.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
                                        {/* Glowing line overlay */}
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className={cn(
                                                    "size-10 rounded-xl flex items-center justify-center border text-blue-500 bg-blue-500/5 border-blue-500/10"
                                                )}>
                                                    <Icon className="size-5" />
                                                </div>
                                                <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                                    Community
                                                </span>
                                            </div>

                                            <h4 className="font-bold text-slate-800 leading-snug text-lg uppercase tracking-tight">{group.name}</h4>
                                            {group.nameEn && <p className="text-[10px] text-slate-400 italic mt-0.5">EN: {group.nameEn}</p>}
                                            {group.description && <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed font-medium">{group.description}</p>}
                                            {group.descriptionEn && <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed italic">EN: {group.descriptionEn}</p>}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                            <a href={group.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                                <Phone className="size-3.5" /> Entra nel gruppo
                                            </a>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(group)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Modifica">
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button onClick={() => handleDuplicate(group)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Duplica">
                                                    <Copy className="size-4" />
                                                </button>
                                                <button onClick={() => handleDelete(group.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Elimina">
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

                {/* 2. Sanitary Vet Section */}
                {(selectedCategory === "all" || selectedCategory === "SANITARY_VET") && sanitaryVetGroups.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-black uppercase tracking-wider text-[#c9041a] shrink-0">Area Sanitaria & Veterinaria</h3>
                            <div className="h-px w-full bg-slate-100"></div>
                            <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200/30 px-2 py-0.5 rounded">{sanitaryVetGroups.length}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sanitaryVetGroups.map(group => {
                                return (
                                    <div key={group.id} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#c12830] to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-100">
                                                        Sanitaria & Vet
                                                    </span>
                                                    {group.subcategory && (
                                                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                                            {group.subcategory}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200/30">Ordine: {group.order}</span>
                                            </div>

                                            <h4 className="font-bold text-slate-800 leading-snug text-lg uppercase tracking-tight">{group.name}</h4>
                                            {group.nameEn && <p className="text-[10px] text-slate-400 italic mt-0.5">EN: {group.nameEn}</p>}
                                            {group.description && <p className="text-xs text-slate-500 mt-3 line-clamp-3 leading-relaxed font-medium">{group.description}</p>}
                                            {group.descriptionEn && <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed italic">EN: {group.descriptionEn}</p>}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                                            <a href={group.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                                <Phone className="size-3.5" /> Entra nel gruppo
                                            </a>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(group)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Modifica">
                                                    <Edit3 className="size-4" />
                                                </button>
                                                <button onClick={() => handleDuplicate(group)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Duplica">
                                                    <Copy className="size-4" />
                                                </button>
                                                <button onClick={() => handleDelete(group.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-slate-200" title="Elimina">
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

                {/* 3. Academic Sections by Department */}
                {(selectedCategory === "all" || selectedCategory === "ACADEMIC") && DEPARTMENTS.map(dept => {
                    const deptGroups = academicGroups.filter(g => g.department === dept)
                    if (deptGroups.length === 0) return null
                    return (
                        <div key={dept} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 shrink-0">{dept}</h3>
                                <div className="h-px w-full bg-slate-100"></div>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200/30 px-2 py-0.5 rounded">{deptGroups.length}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {deptGroups.map(group => (
                                    <div key={group.id} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div>
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                                                        Corso
                                                    </span>
                                                    {group.semester && (
                                                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                                            {group.semester}° Sem.
                                                        </span>
                                                    )}
                                                    {group.subcategory && (
                                                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                                                            {group.subcategory}
                                                        </span>
                                                    )}
                                                    {group.isGeneral && (
                                                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                                                            Generale
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-mono text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200/30">Ordine: {group.order}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-800 leading-snug">{group.name}</h4>
                                            {group.nameEn && <p className="text-[10px] text-slate-400 italic mt-0.5">EN: {group.nameEn}</p>}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                                            <a href={group.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                                                <Phone className="size-3.5" /> Entra
                                            </a>
                                            <div className="flex items-center gap-0.5">
                                                <button onClick={() => handleEdit(group)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200" title="Modifica">
                                                    <Edit3 className="size-3.5" />
                                                </button>
                                                <button onClick={() => handleDuplicate(group)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200" title="Duplica">
                                                    <Copy className="size-3.5" />
                                                </button>
                                                <button onClick={() => handleDelete(group.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-slate-200" title="Elimina">
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
                    <div className="text-center py-16 text-slate-400 italic bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                        Nessun gruppo WhatsApp trovato corrispondente alla ricerca.
                    </div>
                )}
            </div>

            {/* Dialog Form */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-2xl shadow-2xl bg-white animate-in zoom-in-95 duration-200">
                    <form onSubmit={handleSave} className="space-y-6 p-6">
                        <DialogHeader className="flex flex-row justify-between items-center pr-10 gap-4">
                            <DialogTitle className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                                <div className="p-2 bg-green-50 text-green-600 rounded-xl shrink-0">
                                    <Phone className="size-5" />
                                </div>
                                <span className="truncate">{editingId ? "Modifica Gruppo" : "Nuovo Gruppo"}</span>
                            </DialogTitle>
                            <button
                                type="button"
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-sm"
                            >
                                {isTranslating ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <Sparkles className="size-3.5" />
                                )}
                                Traduci IT ➔ EN
                            </button>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome Gruppo (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                    placeholder="Es: L18 Economia aziendale"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome Gruppo (EN)</label>
                                <input
                                    type="text"
                                    value={form.nameEn}
                                    onChange={e => setForm({ ...form, nameEn: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                    placeholder="Es: General Group"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Link WhatsApp (URL) *</label>
                                <input
                                    type="url"
                                    required
                                    value={form.link}
                                    onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Categoria *</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                >
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ordine</label>
                                <input
                                    type="number"
                                    value={form.order}
                                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                />
                            </div>

                            {form.category === "ACADEMIC" && (
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Dipartimento *</label>
                                    <select
                                        value={form.department}
                                        onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                    >
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            )}

                            {form.category === "COMMUNITY" && (
                                <>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione (IT) *</label>
                                        <textarea
                                            required
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 h-24 resize-none"
                                            placeholder="Descrizione del gruppo..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione (EN)</label>
                                        <textarea
                                            value={form.descriptionEn}
                                            onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 h-24 resize-none"
                                            placeholder="Group description in English..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Tema Colore Preset</label>
                                        <select
                                            value={form.theme}
                                            onChange={e => setForm({ ...form, theme: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-xs font-black uppercase tracking-wider text-slate-800 cursor-pointer"
                                        >
                                            {THEME_PRESETS.map(t => <option key={t.name} value={t.classes}>{t.label}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Seleziona Icona</label>
                                        <div className="flex gap-2 h-11 items-center">
                                            {AVAILABLE_ICONS.map(item => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() => setForm({ ...form, icon: item.name })}
                                                    className={cn(
                                                        "flex items-center justify-center size-9 rounded-xl border transition-all hover:bg-slate-50",
                                                        form.icon === item.name
                                                            ? "border-slate-900 bg-zinc-900 text-white shadow-sm"
                                                            : "border-slate-200 text-slate-500 bg-white"
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

                            {form.category === "SANITARY_VET" && (
                                <>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione (IT) *</label>
                                        <textarea
                                            required
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 h-24 resize-none"
                                            placeholder="Descrizione del gruppo..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione (EN)</label>
                                        <textarea
                                            value={form.descriptionEn}
                                            onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 h-24 resize-none"
                                            placeholder="Group description in English..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Sotto-categoria *</label>
                                        <select
                                            value={form.subcategory}
                                            onChange={e => setForm({ ...form, subcategory: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                        >
                                            <option value="MEDICINA">Medicina Generale</option>
                                            <option value="PROFESSIONI_SANITARIE">Professioni Sanitarie</option>
                                            <option value="VETERINARIA">Veterinaria</option>
                                            <option value="GENERALE">Generale</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors text-sm"
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 text-sm shadow-sm"
                            >
                                {loading ? (
                                    <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                ) : (
                                    editingId ? "Salva Modifiche" : "Crea Gruppo"
                                )}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
