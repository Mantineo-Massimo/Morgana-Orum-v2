"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, Edit3, ExternalLink, Layers, Search, Loader2,
    BookOpen, Heart, ShieldCheck, Bus, CreditCard, Info, GraduationCap, Home, Wifi,
    FolderPlus, ArrowRight, Settings, Copy, ArrowUp, ArrowDown
} from "lucide-react"
import {
    createServiceCategory,
    updateServiceCategory,
    deleteServiceCategory,
    createServiceItem,
    updateServiceItem,
    deleteServiceItem
} from "@/app/actions/services"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ServicesAdminClientProps {
    initialServices: any[]
    userRole?: string
}

const AVAILABLE_ICONS = [
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Home", icon: Home },
    { name: "BookOpen", icon: BookOpen },
    { name: "Heart", icon: Heart },
    { name: "Wifi", icon: Wifi },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "Bus", icon: Bus },
    { name: "CreditCard", icon: CreditCard },
    { name: "Info", icon: Info }
]

const ICON_MAP: Record<string, any> = {
    GraduationCap, Home, BookOpen, Heart, Wifi, ShieldCheck, Bus, CreditCard, Info
}

const AVAILABLE_COLORS = [
    { name: "blue", label: "Azzurro", bg: "bg-blue-500" },
    { name: "orange", label: "Arancione", bg: "bg-orange-500" },
    { name: "green", label: "Verde", bg: "bg-green-500" },
    { name: "red", label: "Rosso", bg: "bg-red-500" },
    { name: "purple", label: "Viola", bg: "bg-purple-500" },
    { name: "zinc", label: "Grigio", bg: "bg-zinc-500" },
    { name: "emerald", label: "Smeraldo", bg: "bg-emerald-500" }
]

export function ServicesAdminClient({ initialServices, userRole }: ServicesAdminClientProps) {
    const router = useRouter()
    const [selectedCatId, setSelectedCatId] = useState<string | null>(
        initialServices.length > 0 ? initialServices[0].id : null
    )

    // Modals visibility state
    const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    const [isItemModalOpen, setIsItemModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Category form state
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [catForm, setCatForm] = useState({
        id: "",
        title: "",
        titleEn: "",
        icon: "GraduationCap",
        color: "blue",
        order: 0
    })

    // Item form state
    const [editingItemId, setEditingItemId] = useState<string | null>(null)
    const [itemForm, setItemForm] = useState({
        name: "",
        nameEn: "",
        description: "",
        descriptionEn: "",
        href: "",
        order: 0
    })

    const activeCategory = initialServices.find(c => c.id === selectedCatId)

    // --- CATEGORY ACTIONS ---
    const handleOpenAddCat = () => {
        setEditingCatId(null)
        setCatForm({
            id: "",
            title: "",
            titleEn: "",
            icon: "GraduationCap",
            color: "blue",
            order: initialServices.length
        })
        setIsCatModalOpen(true)
    }

    const handleEditCat = (cat: any) => {
        setEditingCatId(cat.id)
        setCatForm({
            id: cat.id,
            title: cat.title,
            titleEn: cat.titleEn || "",
            icon: cat.icon || "GraduationCap",
            color: cat.color || "blue",
            order: cat.order || 0
        })
        setIsCatModalOpen(true)
    }

    const handleDeleteCat = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questa categoria e tutti i suoi servizi?")) return
        setLoading(true)
        try {
            const res = await deleteServiceCategory(id)
            if (res.success) {
                // Select first category if we deleted the active one
                const remaining = initialServices.filter(c => c.id !== id)
                if (remaining.length > 0) {
                    setSelectedCatId(remaining[0].id)
                } else {
                    setSelectedCatId(null)
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

    const handleSaveCat = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!catForm.title) {
            alert("Il titolo è obbligatorio")
            return
        }

        setLoading(true)
        try {
            let res
            if (editingCatId) {
                res = await updateServiceCategory(editingCatId, {
                    title: catForm.title,
                    titleEn: catForm.titleEn || undefined,
                    icon: catForm.icon,
                    color: catForm.color,
                    order: Number(catForm.order) || 0
                })
            } else {
                // ID must be generated/clean for scroll-anchors
                const cleanId = catForm.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 
                                 catForm.title.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
                res = await createServiceCategory({
                    id: cleanId,
                    title: catForm.title,
                    titleEn: catForm.titleEn || undefined,
                    icon: catForm.icon,
                    color: catForm.color,
                    order: Number(catForm.order) || 0
                })
                if (res.success) {
                    setSelectedCatId(cleanId)
                }
            }

            if (res.success) {
                setIsCatModalOpen(false)
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

    // --- ITEM ACTIONS ---
    const handleOpenAddItem = () => {
        if (!selectedCatId) {
            alert("Seleziona prima una categoria")
            return
        }
        setEditingItemId(null)
        setItemForm({
            name: "",
            nameEn: "",
            description: "",
            descriptionEn: "",
            href: "",
            order: activeCategory?.items?.length || 0
        })
        setIsItemModalOpen(true)
    }

    const handleEditItem = (item: any) => {
        setEditingItemId(item.id)
        setItemForm({
            name: item.name,
            nameEn: item.nameEn || "",
            description: item.description,
            descriptionEn: item.descriptionEn || "",
            href: item.href || "",
            order: item.order || 0
        })
        setIsItemModalOpen(true)
    }

    const handleDuplicateItem = async (item: any) => {
        if (!selectedCatId) return
        setLoading(true)
        try {
            const res = await createServiceItem({
                name: `${item.name} (Copia)`,
                nameEn: item.nameEn ? `${item.nameEn} (Copy)` : undefined,
                description: item.description,
                descriptionEn: item.descriptionEn || undefined,
                href: item.href || undefined,
                order: (item.order || 0) + 1,
                categoryId: selectedCatId
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

    const handleDeleteItem = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo servizio?")) return
        setLoading(true)
        try {
            const res = await deleteServiceItem(id)
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

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCatId) return
        if (!itemForm.name || !itemForm.description) {
            alert("Nome e Descrizione sono obbligatori")
            return
        }

        setLoading(true)
        try {
            const payload = {
                name: itemForm.name,
                nameEn: itemForm.nameEn || undefined,
                description: itemForm.description,
                descriptionEn: itemForm.descriptionEn || undefined,
                href: itemForm.href || undefined,
                order: Number(itemForm.order) || 0,
                categoryId: selectedCatId
            }

            let res
            if (editingItemId) {
                res = await updateServiceItem(editingItemId, payload)
            } else {
                res = await createServiceItem(payload)
            }

            if (res.success) {
                setIsItemModalOpen(false)
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

    const handleReorderItem = async (item: any, direction: "up" | "down") => {
        if (!activeCategory) return
        const items = [...(activeCategory.items || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
        const index = items.findIndex(i => i.id === item.id)
        if (index === -1) return
        
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= items.length) return
        
        const otherItem = items[targetIndex]
        
        setLoading(true)
        try {
            const originalOrder = item.order
            const targetOrder = otherItem.order
            
            const newOrderSelf = targetOrder === originalOrder ? (direction === "up" ? originalOrder - 1 : originalOrder + 1) : targetOrder
            const newOrderOther = originalOrder
            
            const res1 = await updateServiceItem(item.id, {
                name: item.name,
                nameEn: item.nameEn || undefined,
                description: item.description,
                descriptionEn: item.descriptionEn || undefined,
                href: item.href || undefined,
                order: newOrderSelf,
                categoryId: selectedCatId!
            })
            
            const res2 = await updateServiceItem(otherItem.id, {
                name: otherItem.name,
                nameEn: otherItem.nameEn || undefined,
                description: otherItem.description,
                descriptionEn: otherItem.descriptionEn || undefined,
                href: otherItem.href || undefined,
                order: newOrderOther,
                categoryId: selectedCatId!
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

    const getIconComponent = (iconName: string) => {
        const Icon = ICON_MAP[iconName] || GraduationCap
        return <Icon className="size-4" />
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <BookOpen className="size-6" />
                        </div>
                        Gestione Servizi
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                        Gestisci la guida ai servizi d&apos;Ateneo per gli studenti.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Pane: Categories List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <Layers className="size-4 text-slate-500" /> Categorie
                        </h3>
                        <button
                            onClick={handleOpenAddCat}
                            className="p-2 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/40 rounded-xl transition-all text-slate-600"
                            title="Nuova Categoria"
                        >
                            <FolderPlus className="size-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {initialServices.map(cat => {
                            const isSelected = cat.id === selectedCatId
                            return (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCatId(cat.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border text-left cursor-pointer flex items-center justify-between transition-all group",
                                        isSelected
                                            ? "bg-slate-950 border-slate-950 text-white shadow-md"
                                            : "bg-slate-50/50 border-slate-200/60 hover:border-slate-300 text-slate-700 hover:bg-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn(
                                            "size-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            isSelected ? "bg-zinc-800 text-white" : "bg-white text-zinc-800 border border-zinc-100"
                                        )}>
                                            {getIconComponent(cat.icon)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-xs truncate">{cat.title}</p>
                                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">#{cat.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleEditCat(cat)
                                            }}
                                            className={cn(
                                                "p-1.5 rounded-lg hover:bg-zinc-800 transition-all",
                                                isSelected ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
                                            )}
                                            title="Modifica"
                                        >
                                            <Edit3 className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteCat(cat.id)
                                            }}
                                            className={cn(
                                                "p-1.5 rounded-lg hover:bg-red-500/20 transition-all",
                                                isSelected ? "text-red-400 hover:text-red-300" : "text-red-500 hover:bg-red-50"
                                            )}
                                            title="Elimina"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                        {initialServices.length === 0 && (
                            <div className="text-center py-8 text-zinc-400 italic text-xs">
                                Nessuna categoria definita.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Pane: Services List (Category Detail) */}
            <div className="lg:col-span-2 space-y-6">
                {activeCategory ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-150">
                            <div>
                                <span className={cn(
                                    "inline-flex text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border border-slate-200 mb-2",
                                    activeCategory.color === "blue" && "bg-blue-50 text-blue-600",
                                    activeCategory.color === "orange" && "bg-orange-50 text-orange-600",
                                    activeCategory.color === "green" && "bg-green-50 text-green-600",
                                    activeCategory.color === "red" && "bg-red-50 text-red-600",
                                    activeCategory.color === "purple" && "bg-purple-50 text-purple-600",
                                    activeCategory.color === "zinc" && "bg-slate-100 text-slate-655",
                                    activeCategory.color === "emerald" && "bg-emerald-50 text-emerald-600"
                                )}>
                                    Tag: {activeCategory.color}
                                </span>
                                <h2 className="text-xl font-bold text-slate-900">{activeCategory.title}</h2>
                                {activeCategory.titleEn && (
                                    <p className="text-xs text-slate-400 italic mt-0.5">EN: {activeCategory.titleEn}</p>
                                )}
                            </div>
                            <button
                                onClick={handleOpenAddItem}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors shadow-sm"
                            >
                                <Plus className="size-4" /> Aggiungi Servizio
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(activeCategory.items || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any, index: number, arr: any[]) => (
                                <div
                                    key={item.id}
                                    className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-slate-300 hover:bg-white transition-all shadow-sm"
                                >
                                    {/* Reorder Arrows on the left of each item */}
                                    <div className="flex md:flex-col gap-1 shrink-0 mr-2 border border-slate-200/60 p-1 bg-white rounded-xl shadow-sm">
                                        <button
                                            type="button"
                                            disabled={index === 0 || loading}
                                            onClick={() => handleReorderItem(item, "up")}
                                            className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-slate-500 transition-colors"
                                            title="Sposta su"
                                        >
                                            <ArrowUp className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={index === arr.length - 1 || loading}
                                            onClick={() => handleReorderItem(item, "down")}
                                            className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-slate-500 transition-colors"
                                            title="Sposta giù"
                                        >
                                            <ArrowDown className="size-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight truncate">
                                                {item.name}
                                            </h4>
                                            {item.href && (
                                                <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-655">
                                                    <ExternalLink className="size-3.5" />
                                                </a>
                                            )}
                                        </div>
                                        {item.nameEn && (
                                            <p className="text-[10px] text-slate-400 italic">EN: {item.nameEn}</p>
                                        )}
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {item.description}
                                        </p>
                                        {item.descriptionEn && (
                                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                                EN: {item.descriptionEn}
                                            </p>
                                        )}
                                        <div className="flex gap-2 text-[10px] text-slate-400 font-mono pt-1">
                                            <span>Ordine: {item.order}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 transition-opacity shrink-0">
                                        <button
                                            onClick={() => handleEditItem(item)}
                                            className="p-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-550 hover:text-slate-900 transition-all shadow-sm"
                                            title="Modifica"
                                        >
                                            <Edit3 className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDuplicateItem(item)}
                                            className="p-2 bg-white hover:bg-slate-50 border border-slate-200/60 rounded-xl text-slate-550 hover:text-slate-900 transition-all shadow-sm"
                                            title="Duplica"
                                        >
                                            <Copy className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="p-2 bg-white hover:bg-red-50 border border-slate-200/60 hover:border-red-100 rounded-xl text-red-500 transition-all shadow-sm"
                                            title="Elimina"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {(!activeCategory.items || activeCategory.items.length === 0) && (
                                <div className="text-center py-12 text-slate-400 italic text-sm">
                                    Nessun servizio in questa categoria. Aggiungine uno con il pulsante in alto.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-16 text-center text-slate-400 rounded-3xl border border-slate-200/60 shadow-sm italic">
                        Seleziona o crea una categoria a sinistra per gestirne i servizi.
                    </div>
                )}
            </div>
        </div>

        {/* Dialog Form for Category */}
        <Dialog open={isCatModalOpen} onOpenChange={setIsCatModalOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-y-auto max-h-[90vh] border-none rounded-2xl shadow-2xl">
                    <form onSubmit={handleSaveCat} className="bg-white p-6 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Layers className="size-5" />
                                </div>
                                {editingCatId ? "Modifica Categoria" : "Nuova Categoria"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            {!editingCatId && (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">ID / Slug Categoria *</label>
                                    <input
                                        type="text"
                                        required
                                        value={catForm.id}
                                        onChange={e => setCatForm({ ...catForm, id: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all font-mono"
                                        placeholder="Es: accademici, ersu (usato per link di ancoraggio)"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Titolo Categoria (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={catForm.title}
                                    onChange={e => setCatForm({ ...catForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="Es: 1. Servizi Accademici"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Titolo Categoria (EN)</label>
                                <input
                                    type="text"
                                    value={catForm.titleEn}
                                    onChange={e => setCatForm({ ...catForm, titleEn: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="Es: 1. Academic Services"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Colore Estetico *</label>
                                <select
                                    value={catForm.color}
                                    onChange={e => setCatForm({ ...catForm, color: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all bg-white font-bold"
                                >
                                    {AVAILABLE_COLORS.map(col => <option key={col.name} value={col.name}>{col.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ordine</label>
                                <input
                                    type="number"
                                    value={catForm.order}
                                    onChange={e => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all font-bold"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Icona Categoria *</label>
                                <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
                                    {AVAILABLE_ICONS.map(item => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => setCatForm({ ...catForm, icon: item.name })}
                                            className={cn(
                                                "flex items-center justify-center p-3 rounded-xl border transition-all",
                                                catForm.icon === item.name
                                                    ? "border-[#c9041a] bg-gradient-to-br from-[#c12830] to-[#18182e] text-white shadow-sm"
                                                    : "border-slate-200/60 text-slate-500 hover:bg-slate-50"
                                            )}
                                            title={item.name}
                                        >
                                            <item.icon className="size-5" />
                                        </button>
                                    ))}
                                </div>
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
                                        editingCatId ? "Aggiorna Categoria" : "Salva Categoria"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Form for Item */}
            <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
                <DialogContent className="max-w-2xl p-0 overflow-y-auto max-h-[90vh] border-none rounded-2xl shadow-2xl">
                    <form onSubmit={handleSaveItem} className="bg-white p-6 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-slate-900">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Settings className="size-5" />
                                </div>
                                {editingItemId ? "Modifica Servizio" : "Nuovo Servizio"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome Servizio (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={itemForm.name}
                                    onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="Es: Welcome Point"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome Servizio (EN)</label>
                                <input
                                    type="text"
                                    value={itemForm.nameEn}
                                    onChange={e => setItemForm({ ...itemForm, nameEn: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                                    placeholder="Es: Welcome Point"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione Servizio (IT) *</label>
                                <textarea
                                    required
                                    value={itemForm.description}
                                    onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all h-24 resize-none"
                                    placeholder="Descrivi brevemente il servizio fornito..."
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Descrizione Servizio (EN)</label>
                                <textarea
                                    value={itemForm.descriptionEn}
                                    onChange={e => setItemForm({ ...itemForm, descriptionEn: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all h-24 resize-none font-medium text-sm"
                                    placeholder="Describe the service in English..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Link di Riferimento (URL)</label>
                                <input
                                    type="url"
                                    value={itemForm.href}
                                    onChange={e => setItemForm({ ...itemForm, href: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all font-medium text-sm"
                                    placeholder="https://www.unime.it/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ordine</label>
                                <input
                                    type="number"
                                    value={itemForm.order}
                                    onChange={e => setItemForm({ ...itemForm, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
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
                                        editingItemId ? "Aggiorna Servizio" : "Salva Servizio"
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
