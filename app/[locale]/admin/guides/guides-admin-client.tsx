"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, Edit3, Compass, Info, Loader2,
    BookOpen, Bus, MapPin, GraduationCap, Home, Heart, Wifi, ShieldCheck, CreditCard,
    FolderPlus, ArrowRight, Settings, Copy, HelpCircle, ArrowUp, ArrowDown
} from "lucide-react"
import {
    createGuide,
    updateGuide,
    deleteGuide,
    createGuideStep,
    updateGuideStep,
    deleteGuideStep
} from "@/app/actions/guides"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface GuidesAdminClientProps {
    initialGuides: any[]
    userRole?: string
}

const AVAILABLE_ICONS = [
    { name: "BookOpen", icon: BookOpen },
    { name: "Bus", icon: Bus },
    { name: "MapPin", icon: MapPin },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Home", icon: Home },
    { name: "Heart", icon: Heart },
    { name: "Wifi", icon: Wifi },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "CreditCard", icon: CreditCard },
    { name: "Info", icon: Info }
]

const ICON_MAP: Record<string, any> = {
    BookOpen, Bus, MapPin, GraduationCap, Home, Heart, Wifi, ShieldCheck, CreditCard, Info
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

export function GuidesAdminClient({ initialGuides, userRole }: GuidesAdminClientProps) {
    const router = useRouter()
    const [selectedGuideId, setSelectedGuideId] = useState<string | null>(
        initialGuides.length > 0 ? initialGuides[0].id : null
    )

    // Modals visibility state
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)
    const [isStepModalOpen, setIsStepModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Guide form state
    const [editingGuideId, setEditingGuideId] = useState<string | null>(null)
    const [guideForm, setGuideForm] = useState({
        id: "",
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        icon: "BookOpen",
        color: "blue",
        order: 0,
        hasCustomComponent: false
    })

    // Step form state
    const [editingStepId, setEditingStepId] = useState<string | null>(null)
    const [stepForm, setStepForm] = useState({
        title: "",
        titleEn: "",
        description: "",
        descriptionEn: "",
        order: 0
    })

    const activeGuide = initialGuides.find(g => g.id === selectedGuideId)

    // --- GUIDE ACTIONS ---
    const handleOpenAddGuide = () => {
        setEditingGuideId(null)
        setGuideForm({
            id: "",
            title: "",
            titleEn: "",
            description: "",
            descriptionEn: "",
            icon: "BookOpen",
            color: "blue",
            order: initialGuides.length,
            hasCustomComponent: false
        })
        setIsGuideModalOpen(true)
    }

    const handleEditGuide = (guide: any) => {
        setEditingGuideId(guide.id)
        setGuideForm({
            id: guide.id,
            title: guide.title,
            titleEn: guide.titleEn || "",
            description: guide.description || "",
            descriptionEn: guide.descriptionEn || "",
            icon: guide.icon || "BookOpen",
            color: guide.color || "blue",
            order: guide.order || 0,
            hasCustomComponent: guide.hasCustomComponent || false
        })
        setIsGuideModalOpen(true)
    }

    const handleDeleteGuide = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questa guida e tutti i suoi step?")) return
        setLoading(true)
        try {
            const res = await deleteGuide(id)
            if (res.success) {
                const remaining = initialGuides.filter(g => g.id !== id)
                if (remaining.length > 0) {
                    setSelectedGuideId(remaining[0].id)
                } else {
                    setSelectedGuideId(null)
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

    const handleSaveGuide = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!guideForm.title || !guideForm.description) {
            alert("Titolo e Descrizione sono obbligatori")
            return
        }

        setLoading(true)
        try {
            let res
            if (editingGuideId) {
                res = await updateGuide(editingGuideId, {
                    title: guideForm.title,
                    titleEn: guideForm.titleEn || undefined,
                    description: guideForm.description,
                    descriptionEn: guideForm.descriptionEn || undefined,
                    icon: guideForm.icon,
                    color: guideForm.color,
                    order: Number(guideForm.order) || 0,
                    hasCustomComponent: guideForm.hasCustomComponent
                })
            } else {
                const cleanId = guideForm.id.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') || 
                                 guideForm.title.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
                res = await createGuide({
                    id: cleanId,
                    title: guideForm.title,
                    titleEn: guideForm.titleEn || undefined,
                    description: guideForm.description,
                    descriptionEn: guideForm.descriptionEn || undefined,
                    icon: guideForm.icon,
                    color: guideForm.color,
                    order: Number(guideForm.order) || 0,
                    hasCustomComponent: guideForm.hasCustomComponent
                })
                if (res.success) {
                    setSelectedGuideId(cleanId)
                }
            }

            if (res.success) {
                setIsGuideModalOpen(false)
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

    // --- STEP ACTIONS ---
    const handleOpenAddStep = () => {
        if (!selectedGuideId) {
            alert("Seleziona prima una guida")
            return
        }
        setEditingStepId(null)
        setStepForm({
            title: "",
            titleEn: "",
            description: "",
            descriptionEn: "",
            order: activeGuide?.steps?.length || 0
        })
        setIsStepModalOpen(true)
    }

    const handleEditStep = (step: any) => {
        setEditingStepId(step.id)
        setStepForm({
            title: step.title,
            titleEn: step.titleEn || "",
            description: step.description,
            descriptionEn: step.descriptionEn || "",
            order: step.order || 0
        })
        setIsStepModalOpen(true)
    }

    const handleDuplicateStep = async (step: any) => {
        if (!selectedGuideId) return
        setLoading(true)
        try {
            const res = await createGuideStep({
                title: `${step.title} (Copia)`,
                titleEn: step.titleEn ? `${step.titleEn} (Copy)` : undefined,
                description: step.description,
                descriptionEn: step.descriptionEn || undefined,
                order: (step.order || 0) + 1,
                guideId: selectedGuideId
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

    const handleDeleteStep = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo step?")) return
        setLoading(true)
        try {
            const res = await deleteGuideStep(id)
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

    const handleSaveStep = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedGuideId) return
        if (!stepForm.title || !stepForm.description) {
            alert("Titolo e Descrizione dello step sono obbligatori")
            return
        }

        setLoading(true)
        try {
            const payload = {
                title: stepForm.title,
                titleEn: stepForm.titleEn || undefined,
                description: stepForm.description,
                descriptionEn: stepForm.descriptionEn || undefined,
                order: Number(stepForm.order) || 0,
                guideId: selectedGuideId
            }

            let res
            if (editingStepId) {
                res = await updateGuideStep(editingStepId, payload)
            } else {
                res = await createGuideStep(payload)
            }

            if (res.success) {
                setIsStepModalOpen(false)
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

    const handleReorderStep = async (step: any, direction: "up" | "down") => {
        if (!activeGuide) return
        const steps = [...(activeGuide.steps || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
        const index = steps.findIndex(s => s.id === step.id)
        if (index === -1) return
        
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= steps.length) return
        
        const otherStep = steps[targetIndex]
        
        setLoading(true)
        try {
            const originalOrder = step.order
            const targetOrder = otherStep.order
            
            const newOrderSelf = targetOrder === originalOrder ? (direction === "up" ? originalOrder - 1 : originalOrder + 1) : targetOrder
            const newOrderOther = originalOrder
            
            const res1 = await updateGuideStep(step.id, {
                title: step.title,
                titleEn: step.titleEn || undefined,
                description: step.description,
                descriptionEn: step.descriptionEn || undefined,
                order: newOrderSelf,
                guideId: selectedGuideId!
            })
            
            const res2 = await updateGuideStep(otherStep.id, {
                title: otherStep.title,
                titleEn: otherStep.titleEn || undefined,
                description: otherStep.description,
                descriptionEn: otherStep.descriptionEn || undefined,
                order: newOrderOther,
                guideId: selectedGuideId!
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
        const Icon = ICON_MAP[iconName] || BookOpen
        return <Icon className="size-4" />
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Pane: Guides List */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-red-100 text-red-650"><Compass className="size-4" /></span>
                            Elenco Guide
                        </h3>
                    </div>

                    <div className="space-y-2.5">
                        {initialGuides.map(guide => {
                            const isSelected = guide.id === selectedGuideId
                            return (
                                <div
                                    key={guide.id}
                                    onClick={() => setSelectedGuideId(guide.id)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border text-left cursor-pointer flex items-center justify-between transition-all duration-300 group relative overflow-hidden",
                                        isSelected
                                            ? "bg-slate-950 border-slate-950 text-white shadow-md"
                                            : "bg-slate-50/50 border-slate-200/60 hover:border-slate-300 text-slate-700 hover:bg-white"
                                    )}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={cn(
                                            "size-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            isSelected ? "bg-zinc-800 text-white" : "bg-white text-slate-800 border border-slate-150"
                                        )}>
                                            {getIconComponent(guide.icon)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-xs truncate">{guide.title}</p>
                                            <p className={cn("text-[10px] font-mono mt-0.5 truncate", isSelected ? "text-slate-400" : "text-slate-400")}>#{guide.id}</p>
                                        </div>
                                    </div>

                                    {guide.id === "matricole" && (
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleEditGuide(guide)
                                                }}
                                                className={cn(
                                                    "p-1.5 rounded-lg hover:bg-zinc-800 transition-all",
                                                    isSelected ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                                                )}
                                                title="Modifica"
                                            >
                                                <Edit3 className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteGuide(guide.id)
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
                                    )}
                                </div>
                            )
                        })}

                        {initialGuides.length === 0 && (
                            <div className="text-center py-8 text-slate-400 italic text-xs">
                                Nessuna guida definita.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Pane: Steps List */}
            <div className="lg:col-span-2 space-y-6">
                {activeGuide ? (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                        "inline-flex text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border",
                                        activeGuide.color === "blue" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                                        activeGuide.color === "orange" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                                        activeGuide.color === "green" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                                        activeGuide.color === "red" && "bg-red-500/10 text-red-600 border-red-500/20",
                                        activeGuide.color === "purple" && "bg-purple-500/10 text-purple-600 border-purple-500/20",
                                        activeGuide.color === "zinc" && "bg-slate-500/10 text-slate-600 border-slate-500/20",
                                        activeGuide.color === "emerald" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    )}>
                                        Colore: {activeGuide.color}
                                    </span>
                                    {activeGuide.hasCustomComponent && (
                                        <span className="inline-flex text-[9px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-amber-200 bg-amber-500/10 text-amber-700">
                                            Vista Integrata
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">{activeGuide.title}</h2>
                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl font-medium">{activeGuide.description}</p>
                            </div>
                            {activeGuide.id === "matricole" && (
                                <button
                                    onClick={handleOpenAddStep}
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Plus className="size-4" /> Aggiungi Step
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {(activeGuide.steps || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((step: any, index: number, arr: any[]) => (
                                <div
                                    key={step.id}
                                    className="p-6 bg-slate-50/50 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-slate-300 hover:bg-white transition-all duration-300 shadow-sm relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    {/* Reorder Arrows on the left of each step */}
                                    {activeGuide.id === "matricole" && (
                                        <div className="flex md:flex-col gap-1 shrink-0 mr-2 border border-slate-200/60 p-1 bg-white rounded-xl shadow-sm">
                                            <button
                                                type="button"
                                                disabled={index === 0 || loading}
                                                onClick={() => handleReorderStep(step, "up")}
                                                className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                                title="Sposta su"
                                            >
                                                <ArrowUp className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={index === arr.length - 1 || loading}
                                                onClick={() => handleReorderStep(step, "down")}
                                                className="p-1 hover:bg-slate-50 disabled:opacity-30 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                                title="Sposta giù"
                                            >
                                                <ArrowDown className="size-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-1.5 flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-tight truncate">
                                            {step.title}
                                        </h4>
                                        {step.titleEn && (
                                            <p className="text-[10px] text-slate-400 italic">EN: {step.titleEn}</p>
                                        )}
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {step.description}
                                        </p>
                                        {step.descriptionEn && (
                                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                                EN: {step.descriptionEn}
                                            </p>
                                        )}
                                        <div className="text-[10px] text-slate-400 font-mono pt-1">
                                            <span>Ordine: {step.order}</span>
                                        </div>
                                    </div>

                                    {activeGuide.id === "matricole" && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => handleEditStep(step)}
                                                className="p-2 bg-white hover:bg-slate-50 border border-slate-200/65 rounded-xl text-slate-500 hover:text-slate-800 transition-all shadow-sm"
                                                title="Modifica"
                                            >
                                                <Edit3 className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDuplicateStep(step)}
                                                className="p-2 bg-white hover:bg-slate-50 border border-slate-200/65 rounded-xl text-slate-500 hover:text-slate-800 transition-all shadow-sm"
                                                title="Duplica"
                                            >
                                                <Copy className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteStep(step.id)}
                                                className="p-2 bg-white hover:bg-red-50 border border-slate-200/65 hover:border-red-150 rounded-xl text-red-500 transition-all shadow-sm"
                                                title="Elimina"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {(!activeGuide.steps || activeGuide.steps.length === 0) && (
                                <div className="text-center py-12 text-slate-400 italic text-sm">
                                    Nessuno step definito per questa guida. Aggiungine uno con il pulsante in alto.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-16 text-center text-slate-400 rounded-3xl border border-slate-200/60 shadow-sm italic">
                        Seleziona o crea una guida a sinistra per gestirne i passaggi.
                    </div>
                )}
            </div>

            {/* Dialog Form for Guide */}
            <Dialog open={isGuideModalOpen} onOpenChange={setIsGuideModalOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                    <form onSubmit={handleSaveGuide} className="bg-white p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Compass className="size-6 text-zinc-900" />
                                {editingGuideId ? "Modifica Guida" : "Nuova Guida"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            {!editingGuideId && (
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">ID / Slug Guida *</label>
                                    <input
                                        type="text"
                                        required
                                        value={guideForm.id}
                                        onChange={e => setGuideForm({ ...guideForm, id: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-mono text-sm"
                                        placeholder="Es: matricole, trasporti (usato per link di ancoraggio)"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Guida (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={guideForm.title}
                                    onChange={e => setGuideForm({ ...guideForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: Guida Matricole"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Guida (EN)</label>
                                <input
                                    type="text"
                                    value={guideForm.titleEn}
                                    onChange={e => setGuideForm({ ...guideForm, titleEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: Freshmen Guide"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione Guida (IT) *</label>
                                <textarea
                                    required
                                    value={guideForm.description}
                                    onChange={e => setGuideForm({ ...guideForm, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-16 resize-none font-medium text-sm"
                                    placeholder="Breve descrizione generale della guida..."
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione Guida (EN)</label>
                                <textarea
                                    value={guideForm.descriptionEn}
                                    onChange={e => setGuideForm({ ...guideForm, descriptionEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-16 resize-none font-medium text-sm"
                                    placeholder="Brief guide description in English..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Colore Estetico *</label>
                                <select
                                    value={guideForm.color}
                                    onChange={e => setGuideForm({ ...guideForm, color: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none bg-white font-bold"
                                >
                                    {AVAILABLE_COLORS.map(col => <option key={col.name} value={col.name}>{col.label}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                <input
                                    type="number"
                                    value={guideForm.order}
                                    onChange={e => setGuideForm({ ...guideForm, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center gap-3 py-2 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
                                <input
                                    type="checkbox"
                                    id="hasCustomComponent"
                                    checked={guideForm.hasCustomComponent}
                                    onChange={e => setGuideForm({ ...guideForm, hasCustomComponent: e.target.checked })}
                                    className="size-4 rounded border-zinc-200 text-zinc-900 focus:ring-zinc-900/10"
                                />
                                <div className="space-y-0.5">
                                    <label htmlFor="hasCustomComponent" className="text-xs font-bold uppercase tracking-widest text-zinc-800 cursor-pointer">Rendering Vista Integrata</label>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-tight">Se attivo, renderizzerà un componente dedicato (es. Mappa Interattiva, Servizi ERSU) anziché solo la lista di step.</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Icona *</label>
                                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                    {AVAILABLE_ICONS.map(item => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => setGuideForm({ ...guideForm, icon: item.name })}
                                            className={cn(
                                                "flex items-center justify-center p-3 rounded-xl border transition-all hover:bg-zinc-50",
                                                guideForm.icon === item.name
                                                    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                                                    : "border-zinc-100 text-zinc-500"
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
                                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-150 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                    ) : (
                                        editingGuideId ? "Aggiorna Guida" : "Salva Guida"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Form for Step */}
            <Dialog open={isStepModalOpen} onOpenChange={setIsStepModalOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                    <form onSubmit={handleSaveStep} className="bg-white p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                <Settings className="size-6 text-zinc-900" />
                                {editingStepId ? "Modifica Step" : "Nuovo Step"}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Step (IT) *</label>
                                <input
                                    type="text"
                                    required
                                    value={stepForm.title}
                                    onChange={e => setStepForm({ ...stepForm, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: Registrazione su Esse3"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Step (EN)</label>
                                <input
                                    type="text"
                                    value={stepForm.titleEn}
                                    onChange={e => setStepForm({ ...stepForm, titleEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                    placeholder="Es: Esse3 Registration"
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione Step (IT) *</label>
                                <textarea
                                    required
                                    value={stepForm.description}
                                    onChange={e => setStepForm({ ...stepForm, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-24 resize-none font-medium text-sm leading-relaxed"
                                    placeholder="Cosa fare in questo step..."
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione Step (EN)</label>
                                <textarea
                                    value={stepForm.descriptionEn}
                                    onChange={e => setStepForm({ ...stepForm, descriptionEn: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none h-24 resize-none font-medium text-sm leading-relaxed"
                                    placeholder="Step description in English..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                <input
                                    type="number"
                                    value={stepForm.order}
                                    onChange={e => setStepForm({ ...stepForm, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-bold"
                                />
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-150 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                    ) : (
                                        editingStepId ? "Aggiorna Step" : "Salva Step"
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
