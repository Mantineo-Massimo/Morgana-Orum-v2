"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, Edit3, Copy, Search, Phone, Users,
    Film, Home as HomeIcon, Info, ExternalLink, Loader2, Sparkles
} from "lucide-react"
import { translateText } from "@/app/actions/translate"
import {
    createWhatsAppGroup,
    updateWhatsAppGroup,
    deleteWhatsAppGroup,
    duplicateYearWhatsAppGroups,
    deleteYearWhatsAppGroups
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
    "Dipartimento di Civiltà Antiche e Moderne (DICAM)",
    "Dipartimento di Economia",
    "Dipartimento di Giurisprudenza",
    "Dipartimento di Ingegneria",
    "Dipartimento di Medicina Clinica e Sperimentale (DIMED)",
    "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"",
    "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)",
    "Dipartimento di Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)",
    "Dipartimento di Scienze Cognitive, Psicologiche, Pedagogiche e degli Studi Culturali (COSPECS)",
    "Dipartimento di Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)",
    "Dipartimento di Scienze Politiche e Giuridiche (SCIPOG)",
    "Dipartimento di Scienze Veterinarie"
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
    { name: "green", label: "Verde (WhatsApp)", classes: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/30 hover:bg-emerald-500/15" },
    { name: "red", label: "Rosso", classes: "text-red-500 bg-red-500/10 border-red-500/20 hover:border-red-500/30 hover:bg-red-500/15" }
]

export function WhatsAppGroupsAdminClient({ initialGroups, userRole }: WhatsAppGroupsAdminClientProps) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedDept, setSelectedDept] = useState<string>("all")
    const [selectedYear, setSelectedYear] = useState<string>(() => {
        const years = new Set<string>()
        initialGroups.forEach(g => {
            if (g.semester && /^\d{4}\/\d{4}$/.test(g.semester)) {
                years.add(g.semester)
            }
        })
        const sorted = Array.from(years).sort()
        return sorted[sorted.length - 1] || "2025/2026"
    })
    const [customYears, setCustomYears] = useState<string[]>([])

    // Dialog state for adding a new year
    const [isYearDialogOpen, setIsYearDialogOpen] = useState(false)
    const [newYearName, setNewYearName] = useState("")
    const [sourceYearForCloning, setSourceYearForCloning] = useState("")
    const [cloneFromExisting, setCloneFromExisting] = useState(true)
    const [yearDialogLoading, setYearDialogLoading] = useState(false)

    // Extract unique years from initialGroups + customYears (filtering for format YYYY/YYYY)
    const availableYears = useMemo(() => {
        const years = new Set<string>()
        initialGroups.forEach(g => {
            if (g.semester && /^\d{4}\/\d{4}$/.test(g.semester)) {
                years.add(g.semester)
            }
        })
        customYears.forEach(y => years.add(y))
        return Array.from(years).sort()
    }, [initialGroups, customYears])

    const defaultYear = useMemo(() => {
        return availableYears[availableYears.length - 1] || "2025/2026"
    }, [availableYears])

    // Form modal state
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isTranslating, setIsTranslating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isCustomSemester, setIsCustomSemester] = useState(false)

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
        department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)",
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
        setIsCustomSemester(false)
        const cat = selectedCategory !== "all" ? selectedCategory : "ACADEMIC"
        const defaultSem = cat === "ACADEMIC" ? selectedYear : "2025/2026"
        setIsCustomSemester(defaultSem ? !["2025/2026", "2026/2027"].includes(defaultSem) : false)
        setForm({
            name: "",
            nameEn: "",
            link: "",
            category: cat,
            department: selectedDept !== "all" ? selectedDept : "Dipartimento di Civiltà Antiche e Moderne (DICAM)",
            description: "",
            descriptionEn: "",
            icon: "Users",
            theme: THEME_PRESETS[0].classes,
            order: initialGroups.length,
            semester: defaultSem,
            subcategory: cat === "SANITARY_VET" ? "MEDICINA" : "",
            isGeneral: cat === "SANITARY_VET"
        })
        setIsOpen(true)
    }

    const handleAddYearSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedYear = newYearName.trim()
        if (!/^\d{4}\/\d{4}$/.test(trimmedYear)) {
            alert("Per favore, inserisci un anno accademico valido nel formato YYYY/YYYY (es. 2026/2027).")
            return
        }

        if (availableYears.includes(trimmedYear)) {
            alert("Questo anno accademico esiste già.")
            return
        }

        if (cloneFromExisting && sourceYearForCloning) {
            setYearDialogLoading(true)
            try {
                const res = await duplicateYearWhatsAppGroups(sourceYearForCloning, trimmedYear)
                if (res.success) {
                    alert(`Nuovo anno ${trimmedYear} creato con successo copiando ${res.count} gruppi!`)
                    setCustomYears(prev => [...prev, trimmedYear])
                    setSelectedYear(trimmedYear)
                    setIsYearDialogOpen(false)
                    setNewYearName("")
                    router.refresh()
                } else {
                    alert(res.error)
                }
            } catch (err) {
                console.error(err)
                alert("Errore durante la clonazione dei gruppi.")
            } finally {
                setYearDialogLoading(false)
            }
        } else {
            // No source year chosen (or clone disabled): create a placeholder group to persist the year in the DB
            setYearDialogLoading(true)
            try {
                const res = await createWhatsAppGroup({
                    name: `Nuovo Corso da configurare (${trimmedYear})`,
                    link: "https://chat.whatsapp.com/placeholder",
                    category: "ACADEMIC" as any,
                    department: "Dipartimento di Civiltà Antiche e Moderne (DICAM)",
                    semester: trimmedYear,
                    order: 0
                })
                if (res.success) {
                    alert(`Anno ${trimmedYear} creato! Trovi un gruppo segnaposto da configurare.`)
                    setCustomYears(prev => [...prev, trimmedYear])
                    setSelectedYear(trimmedYear)
                    setIsYearDialogOpen(false)
                    setNewYearName("")
                    router.refresh()
                } else {
                    alert(res.error || "Errore durante la creazione dell'anno.")
                }
            } catch (err) {
                console.error(err)
                alert("Errore durante la creazione del nuovo anno.")
            } finally {
                setYearDialogLoading(false)
            }
        }
    }

    const handleEdit = (g: any) => {
        setEditingId(g.id)
        setIsCustomSemester(g.semester ? !["2025/2026", "2026/2027"].includes(g.semester) : false)
        setForm({
            name: g.name,
            nameEn: g.nameEn || "",
            link: g.link,
            category: g.category,
            department: g.department || "Dipartimento di Civiltà Antiche e Moderne (DICAM)",
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
        // Find the group being deleted
        const groupToDelete = initialGroups.find(g => g.id === id)
        const groupYear = groupToDelete?.semester

        // Check if this is the last group for its academic year
        const isLastGroupOfYear = groupYear
            ? initialGroups.filter(g => g.semester === groupYear && g.category === "ACADEMIC").length === 1
            : false

        let confirmMsg = "Sicuro di voler eliminare questo gruppo?"
        if (isLastGroupOfYear) {
            confirmMsg = `Attenzione: questo è l'unico gruppo dell'anno ${groupYear}.\n\nEliminandolo, l'anno scomparirà dalla lista.\n\nContinuare?`
        }

        if (!confirm(confirmMsg)) return
        setLoading(true)
        try {
            const res = await deleteWhatsAppGroup(id)
            if (res.success) {
                // If it was the last group of the year, remove year from customYears state too
                if (isLastGroupOfYear && groupYear) {
                    setCustomYears(prev => prev.filter(y => y !== groupYear))
                }
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
                semester: form.category === "ACADEMIC" ? (form.semester || undefined) : undefined,
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
        const matchesYear = g.category !== "ACADEMIC" || g.semester === selectedYear
        return matchesSearch && matchesCategory && matchesDept && matchesYear
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    {(selectedCategory === "all" || selectedCategory === "ACADEMIC") && (
                        <>
                            {/* Year filter select */}
                            <select
                                value={selectedYear}
                                onChange={e => setSelectedYear(e.target.value)}
                                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 outline-none transition-all cursor-pointer font-semibold text-slate-700 min-w-[150px]"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => {
                                    setSourceYearForCloning(availableYears[availableYears.length - 1] || "2025/2026")
                                    setIsYearDialogOpen(true)
                                }}
                                className="flex items-center justify-center px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all rounded-xl shadow-sm whitespace-nowrap bg-white"
                            >
                                + Anno
                            </button>

                            <button
                                onClick={async () => {
                                    if (!confirm(`Sei sicuro di voler eliminare interamente l'anno ${selectedYear} e TUTTI i gruppi ad esso associati? Questa operazione non può essere annullata.`)) return;
                                    setLoading(true);
                                    try {
                                        const res = await deleteYearWhatsAppGroups(selectedYear);
                                        if (res.success) {
                                            alert(`Anno ${selectedYear} eliminato con successo. Rimossi ${res.count} gruppi.`);
                                            // Fallback year logic
                                            const remaining = availableYears.filter(y => y !== selectedYear);
                                            setSelectedYear(remaining[remaining.length - 1] || "2025/2026");
                                            router.refresh();
                                        } else {
                                            alert(res.error);
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Errore durante l'eliminazione dell'anno.");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-3 border border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 text-sm font-bold transition-all rounded-xl shadow-sm whitespace-nowrap bg-white disabled:opacity-50"
                            >
                                Elimina Anno
                            </button>
                        </>
                    )}

                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all rounded-xl shadow-sm group whitespace-nowrap"
                    >
                        <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                        Aggiungi Gruppo
                    </button>
                </div>
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

                    {(selectedDept !== "all" || selectedYear !== defaultYear || search !== "") && (
                        <button
                            onClick={() => { setSelectedDept("all"); setSelectedYear(defaultYear); setSearch(""); }}
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
                                                            {group.semester}
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
                                <>
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
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Anno Accademico</label>
                                        <select
                                            value={isCustomSemester ? "custom" : (form.semester || "")}
                                            onChange={e => {
                                                const val = e.target.value
                                                if (val === "custom") {
                                                    setIsCustomSemester(true)
                                                } else {
                                                    setIsCustomSemester(false)
                                                    setForm({ ...form, semester: val })
                                                }
                                            }}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                        >
                                            <option value="">Nessuno</option>
                                            <option value="2025/2026">2025/2026 (Attuale)</option>
                                            <option value="2026/2027">2026/2027 (Prossimo)</option>
                                            <option value="custom">Personalizzato...</option>
                                        </select>
                                        
                                        {isCustomSemester && (
                                            <div className="pt-2">
                                                <input
                                                    type="text"
                                                    value={form.semester}
                                                    onChange={e => setForm({ ...form, semester: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                                    placeholder="Es: 2027/2028"
                                                />
                                            </div>
                                        )}
                                        <p className="text-[10px] text-zinc-400 mt-1">Esempio: 2025/2026 per l&apos;attuale, 2026/2027 per il prossimo.</p>
                                    </div>
                                </>
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

            {/* Year dialog */}
            <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl border border-slate-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-900 font-serif">Aggiungi Nuovo Anno</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddYearSubmit} className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nuovo Anno Accademico *</label>
                            <input
                                required
                                type="text"
                                value={newYearName}
                                onChange={e => setNewYearName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                placeholder="Es: 2026/2027"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="cloneFromExisting"
                                checked={cloneFromExisting}
                                onChange={e => setCloneFromExisting(e.target.checked)}
                                className="rounded border-slate-350 text-[#c9041a] focus:ring-[#c9041a]/10 cursor-pointer size-4"
                            />
                            <label htmlFor="cloneFromExisting" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                Copia i gruppi da un anno esistente
                            </label>
                        </div>

                        {cloneFromExisting && availableYears.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Anno di origine *</label>
                                <select
                                    value={sourceYearForCloning}
                                    onChange={e => setSourceYearForCloning(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                >
                                    {availableYears.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-zinc-400 mt-1">Crea copie di tutti i gruppi del dipartimento del suddetto anno per iniziare velocemente.</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsYearDialogOpen(false)}
                                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors text-sm"
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                disabled={yearDialogLoading}
                                className="px-8 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 text-sm shadow-sm"
                            >
                                {yearDialogLoading ? (
                                    <><Loader2 className="size-4 animate-spin" /> Creazione...</>
                                ) : (
                                    "Aggiungi Anno"
                                )}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
