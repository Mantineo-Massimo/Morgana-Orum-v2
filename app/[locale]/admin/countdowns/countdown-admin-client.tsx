"use client"

import { useState } from "react"
import {
    DeadlineCountdownData,
    createCountdown,
    updateCountdown,
    deleteCountdown,
    toggleCountdownVisibility
} from "@/app/actions/countdowns"
import {
    Clock, Plus, Trash2, Pencil, X, Loader2, Eye, EyeOff,
    AlertTriangle, CheckCircle2, Calendar, GraduationCap, FileText,
    ChevronDown, ChevronUp, Save
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toUtcFromRome, toRomeDateInputString, getRomeParts } from "@/lib/date"


const CATEGORY_OPTIONS = [
    { value: "burocrazia", label: "Scadenza Burocratica", icon: FileText, color: "bg-[#18182e]/5 text-[#18182e] border-[#18182e]/10" },
    { value: "sessione", label: "Sessione d'Esame", icon: GraduationCap, color: "bg-[#c12830]/5 text-[#c12830] border-[#c12830]/10" }
]

type FormData = {
    title: string
    titleEn: string
    category: string
    date: string // ISO date input value
    time: string // HH:mm input value
    description: string
    descriptionEn: string
    visible: boolean
    order: number
}

const emptyForm = (): FormData => ({
    title: "",
    titleEn: "",
    category: "burocrazia",
    date: "",
    time: "23:59",
    description: "",
    descriptionEn: "",
    visible: true,
    order: 0
})

const itemToForm = (item: DeadlineCountdownData): FormData => {
    const parts = getRomeParts(new Date(item.date))
    const dateStr = toRomeDateInputString(item.date)
    const timeStr = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`
    return {
        title: item.title,
        titleEn: item.titleEn || "",
        category: item.category,
        date: dateStr,
        time: timeStr,
        description: item.description,
        descriptionEn: item.descriptionEn || "",
        visible: item.visible,
        order: item.order
    }
}

function getCountdownDiff(target: Date): { d: number; h: number; m: number; expired: boolean; close: boolean } {
    const diff = target.getTime() - Date.now()
    if (diff <= 0) return { d: 0, h: 0, m: 0, expired: true, close: false }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / 1000 / 60) % 60)
    return { d, h, m, expired: false, close: d < 15 }
}

interface Props {
    initialItems: DeadlineCountdownData[]
}

export function CountdownAdminClient({ initialItems }: Props) {
    const [items, setItems] = useState<DeadlineCountdownData[]>(initialItems)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormData>(emptyForm())
    const [saving, setSaving] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toggling, setToggling] = useState<string | null>(null)

    const formTitle = editingId ? "Modifica Countdown" : "Nuovo Countdown"

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm())
        setShowForm(true)
    }

    const openEdit = (item: DeadlineCountdownData) => {
        setEditingId(item.id)
        setForm(itemToForm(item))
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            const dateObj = toUtcFromRome(`${form.date}T${form.time}:00`)
            const payload = {
                title: form.title,
                titleEn: form.titleEn || undefined,
                category: form.category,
                date: dateObj,
                description: form.description,
                descriptionEn: form.descriptionEn || undefined,
                visible: form.visible,
                order: form.order
            }

            if (editingId) {
                const res = await updateCountdown(editingId, payload)
                if (!res.success) { alert(res.error); return }
                setItems(prev => prev.map(i => i.id === editingId ? {
                    ...i, ...payload,
                    titleEn: form.titleEn || null,
                    descriptionEn: form.descriptionEn || null,
                    updatedAt: new Date()
                } : i))
            } else {
                const res = await createCountdown(payload)
                if (!res.success) { alert(res.error); return }
                // Refresh
                const { getCountdowns } = await import("@/app/actions/countdowns")
                setItems(await getCountdowns())
            }
            closeForm()
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteConfirm) return
        setDeleting(true)
        try {
            const res = await deleteCountdown(deleteConfirm)
            if (res.success) setItems(prev => prev.filter(i => i.id !== deleteConfirm))
            else alert(res.error)
        } finally {
            setDeleting(false)
            setDeleteConfirm(null)
        }
    }

    const handleToggle = async (item: DeadlineCountdownData) => {
        setToggling(item.id)
        try {
            const res = await toggleCountdownVisibility(item.id, !item.visible)
            if (res.success) setItems(prev => prev.map(i => i.id === item.id ? { ...i, visible: !i.visible } : i))
            else alert(res.error)
        } finally {
            setToggling(null)
        }
    }

    const moveOrder = async (id: string, dir: "up" | "down") => {
        const idx = items.findIndex(i => i.id === id)
        if (dir === "up" && idx === 0) return
        if (dir === "down" && idx === items.length - 1) return
        const swapIdx = dir === "up" ? idx - 1 : idx + 1
        const newItems = [...items]
        const temp = newItems[idx].order
        newItems[idx] = { ...newItems[idx], order: newItems[swapIdx].order }
        newItems[swapIdx] = { ...newItems[swapIdx], order: temp }
        ;[newItems[idx], newItems[swapIdx]] = [newItems[swapIdx], newItems[idx]]
        setItems(newItems)
        await updateCountdown(newItems[idx].id, { order: newItems[idx].order })
        await updateCountdown(newItems[swapIdx].id, { order: newItems[swapIdx].order })
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock className="size-6" />
                        </div>
                        Countdown & Scadenze
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Gestisci le scadenze e sessioni d&apos;esame visibili nello Scadenziario degli studenti.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all shadow-sm shrink-0"
                >
                    <Plus className="size-4" />
                    Nuovo Countdown
                </button>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Totale", value: items.length, color: "bg-zinc-50 border-zinc-200 text-zinc-900" },
                    { label: "Visibili", value: items.filter(i => i.visible).length, color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
                    { label: "Nascosti", value: items.filter(i => !i.visible).length, color: "bg-zinc-50 border-zinc-200 text-zinc-500" },
                    { label: "Scaduti", value: items.filter(i => new Date(i.date) < new Date()).length, color: "bg-amber-50 border-amber-100 text-amber-700" },
                ].map(stat => (
                    <div key={stat.label} className={cn("p-4 rounded-2xl border text-center", stat.color)}>
                        <p className="text-2xl font-black">{stat.value}</p>
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Items list */}
            {items.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                    <Clock className="size-12 mx-auto mb-4 text-zinc-300 animate-pulse" />
                    <h3 className="font-bold text-zinc-700 mb-1">Nessun countdown</h3>
                    <p className="text-sm text-zinc-400 mb-6">Crea il primo elemento con il pulsante qui sopra.</p>
                    <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-bold hover:bg-zinc-700 transition-all">
                        <Plus className="size-4" /> Crea countdown
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, idx) => {
                        const { d, h, m, expired, close } = getCountdownDiff(new Date(item.date))
                        const catInfo = CATEGORY_OPTIONS.find(c => c.value === item.category)
                        const CatIcon = catInfo?.icon || Clock

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "bg-white rounded-2xl border p-5 flex items-start gap-4 shadow-sm transition-all hover:shadow-md",
                                    !item.visible && "opacity-60",
                                    close && !expired && "border-amber-300 ring-1 ring-amber-200",
                                    expired && "border-zinc-200 bg-zinc-50/50"
                                )}
                            >
                                {/* Order arrows */}
                                <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                                    <button onClick={() => moveOrder(item.id, "up")} disabled={idx === 0} className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 disabled:opacity-20 transition-all">
                                        <ChevronUp className="size-3.5" />
                                    </button>
                                    <button onClick={() => moveOrder(item.id, "down")} disabled={idx === items.length - 1} className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 disabled:opacity-20 transition-all">
                                        <ChevronDown className="size-3.5" />
                                    </button>
                                </div>

                                {/* Icon */}
                                <div className={cn("p-2.5 rounded-xl border shrink-0", catInfo?.color || "bg-zinc-50 text-zinc-600 border-zinc-200")}>
                                    <CatIcon className="size-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", catInfo?.color || "")}>
                                            {catInfo?.label}
                                        </span>
                                        {expired && (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-500">
                                                <CheckCircle2 className="size-3" /> Scaduto
                                            </span>
                                        )}
                                        {close && !expired && (
                                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                                                <AlertTriangle className="size-3" /> Scade a breve!
                                            </span>
                                        )}
                                        {!item.visible && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-400">
                                                Nascosto
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-zinc-900 text-base leading-tight">{item.title}</h3>
                                    {item.titleEn && <p className="text-xs text-zinc-400 italic">{item.titleEn}</p>}
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-bold">
                                        <Calendar className="size-3.5" />
                                        {new Date(item.date).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" })}
                                    </div>
                                </div>

                                {/* Countdown mini */}
                                <div className="shrink-0 hidden md:flex items-center gap-1.5">
                                    {[{ label: "g", val: d }, { label: "h", val: h }, { label: "m", val: m }].map((blk) => (
                                        <div key={blk.label} className={cn(
                                            "size-12 rounded-xl flex flex-col items-center justify-center border text-center",
                                            expired ? "bg-zinc-50 border-zinc-100 text-zinc-300" : close ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-zinc-900 border-zinc-900 text-white"
                                        )}>
                                            <span className="text-sm font-black font-mono leading-none">{String(blk.val).padStart(2, "0")}</span>
                                            <span className={cn("text-[7px] font-black uppercase", expired ? "text-zinc-300" : close ? "text-amber-500" : "text-[#c12830]")}>{blk.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => handleToggle(item)}
                                        disabled={toggling === item.id}
                                        className={cn(
                                            "p-2 rounded-xl border transition-all",
                                            item.visible
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                                : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100"
                                        )}
                                        title={item.visible ? "Nascondi" : "Rendi visibile"}
                                    >
                                        {toggling === item.id ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : item.visible ? (
                                            <Eye className="size-4" />
                                        ) : (
                                            <EyeOff className="size-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 transition-all"
                                        title="Modifica"
                                    >
                                        <Pencil className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(item.id)}
                                        className="p-2 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                                        title="Elimina"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Create/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-10 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-6 my-auto animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="font-black text-xl text-zinc-900 flex items-center gap-2.5">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                    <Clock className="size-5" />
                                </div>
                                {formTitle}
                            </h2>
                            <button onClick={closeForm} className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 transition-all">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Category */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-2">Categoria *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setForm({ ...form, category: opt.value })}
                                            className={cn(
                                                "flex items-center gap-2.5 p-3 rounded-xl border text-sm font-bold transition-all text-left",
                                                form.category === opt.value
                                                    ? opt.color + " ring-2 ring-offset-1"
                                                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                                            )}
                                        >
                                            <opt.icon className="size-4 shrink-0" />
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Titles */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Titolo (IT) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="Es. Sessione d'esami autunnale"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Titolo (EN)</label>
                                    <input
                                        type="text"
                                        value={form.titleEn}
                                        onChange={e => setForm({ ...form, titleEn: e.target.value })}
                                        placeholder="Es. Autumn Exam Session"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Data *</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Ora *</label>
                                    <input
                                        type="time"
                                        required
                                        value={form.time}
                                        onChange={e => setForm({ ...form, time: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Descrizione (IT) *</label>
                                    <textarea
                                        required
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        placeholder="Descrizione per gli studenti..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-600 mb-1.5">Descrizione (EN)</label>
                                    <textarea
                                        value={form.descriptionEn}
                                        onChange={e => setForm({ ...form, descriptionEn: e.target.value })}
                                        rows={3}
                                        placeholder="Description for students..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Options row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                {/* Visible toggle */}
                                <div className="flex items-center gap-3 flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, visible: !form.visible })}
                                        className={cn(
                                            "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
                                            form.visible ? "bg-emerald-500" : "bg-zinc-300"
                                        )}
                                    >
                                        <span className={cn(
                                            "absolute top-0.5 size-5 bg-white rounded-full shadow-sm transition-all duration-300",
                                            form.visible ? "left-5.5" : "left-0.5"
                                        )} />
                                    </button>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">{form.visible ? "Visibile" : "Nascosto"}</p>
                                        <p className="text-[10px] text-zinc-400">Mostrato nello scadenziario</p>
                                    </div>
                                </div>

                                {/* Order */}
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-zinc-500">Ordine</label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                                        className="w-20 px-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                        min={0}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="flex-1 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-all"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-gradient-to-br from-[#c12830] to-[#18182e] text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {saving ? (
                                        <><Loader2 className="size-4 animate-spin" /> Salvataggio...</>
                                    ) : (
                                        <><Save className="size-4" /> {editingId ? "Aggiorna" : "Crea Countdown"}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-50 text-red-500 shrink-0">
                                <AlertTriangle className="size-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-zinc-900 text-lg">Elimina countdown</h3>
                                <p className="text-sm text-zinc-500 mt-1">Questa azione è irreversibile. Il countdown verrà rimosso definitivamente.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-all"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? <><Loader2 className="size-4 animate-spin" />Eliminazione...</> : <><Trash2 className="size-4" />Elimina</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
