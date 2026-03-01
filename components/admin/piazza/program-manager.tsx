"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Trash2, X, Calendar, Clock,
    Palette, Mic2, Music, Camera, Star,
    Coffee, User, Users, MapPin, Ticket,
    Play, Smile, Heart, Zap, Image as ImageIcon
} from "lucide-react"
import { createPiazzaProgramItem, deletePiazzaProgramItem } from "@/app/actions/piazza"
import { cn } from "@/lib/utils"

const SLOTS = ["Mattino", "Pomeriggio", "Sera"]

const AVAILABLE_ICONS = [
    { name: "Palette", icon: Palette },
    { name: "Mic2", icon: Mic2 },
    { name: "Music", icon: Music },
    { name: "Camera", icon: Camera },
    { name: "Star", icon: Star },
    { name: "Coffee", icon: Coffee },
    { name: "User", icon: User },
    { name: "Users", icon: Users },
    { name: "MapPin", icon: MapPin },
    { name: "Ticket", icon: Ticket },
    { name: "Play", icon: Play },
    { name: "Smile", icon: Smile },
    { name: "Heart", icon: Heart },
    { name: "Zap", icon: Zap },
    { name: "ImageIcon", icon: ImageIcon }
]

const ICON_MAP: Record<string, any> = {
    Palette, Mic2, Music, Camera, Star, Coffee, User, Users, MapPin, Ticket, Play, Smile, Heart, Zap, ImageIcon
}

interface ProgramManagerProps {
    program: any[]
}

export function ProgramManager({ program }: ProgramManagerProps) {
    const router = useRouter()
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: "",
        description: "",
        timeSlot: "Mattino",
        startTime: "",
        endTime: "",
        icon: "Palette",
        order: 0
    })

    const handleAdd = async () => {
        setLoading(true)
        try {
            const res = await createPiazzaProgramItem(form)
            if (res.success) {
                setIsAdding(false)
                setForm({ title: "", description: "", timeSlot: "Mattino", startTime: "", endTime: "", icon: "Palette", order: 0 })
                router.refresh()
            } else {
                alert(res.error)
            }
        } catch (error) {
            console.error("Save error:", error)
            alert("Errore durante il salvataggio. Riprova.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questa attività?")) return
        const res = await deletePiazzaProgramItem(id)
        if (res.success) router.refresh()
    }

    const getIconComponent = (iconName: string) => {
        const Icon = ICON_MAP[iconName] || Palette
        return <Icon className="size-3 text-[#f9a620]" />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <Calendar className="size-5 text-[#f9a620]" /> Gestione Programma
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4" /> Aggiungi Attività
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h4 className="text-lg font-bold uppercase tracking-tight">Nuova Attività</h4>
                        <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600"><X className="size-6" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Attività</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Il Simposio" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Fascia Oraria</label>
                            <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-white">
                                {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 underline decoration-[#f9a620]/30">
                                <Clock className="size-3" /> Orario Inizio (Opzionale)
                            </label>
                            <input
                                type="time"
                                value={form.startTime}
                                onChange={e => setForm({ ...form, startTime: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-zinc-50/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5 underline decoration-[#f9a620]/30">
                                <Clock className="size-3" /> Orario Fine (Opzionale)
                            </label>
                            <input
                                type="time"
                                value={form.endTime}
                                onChange={e => setForm({ ...form, endTime: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-zinc-50/50"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none h-32 resize-none" placeholder="Descrizione dell'attività..." />
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Seleziona Icona</label>
                            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                {AVAILABLE_ICONS.map((item) => (
                                    <button
                                        key={item.name}
                                        type="button"
                                        onClick={() => setForm({ ...form, icon: item.name })}
                                        className={cn(
                                            "flex items-center justify-center p-3 rounded-xl border transition-all hover:bg-zinc-50",
                                            form.icon === item.name
                                                ? "border-[#f9a620] bg-amber-50 text-[#f9a620] shadow-sm"
                                                : "border-zinc-100 text-zinc-400"
                                        )}
                                        title={item.name}
                                    >
                                        <item.icon className="size-5" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button onClick={handleAdd} disabled={loading} className="w-full py-4 bg-[#f9a620] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest hover:bg-[#e89a1c] disabled:opacity-50 transition-all shadow-lg shadow-amber-100">
                                {loading ? "Salvataggio..." : "Salva Attività"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Attività</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Fascia</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Orari / Icona</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {program.map((p: any) => (
                            <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-sm text-zinc-900">{p.title}</p>
                                    <p className="text-[10px] text-zinc-500 truncate max-w-[250px] font-medium">{p.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full text-zinc-600">{p.timeSlot}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
                                            <Clock className="size-3 text-[#f9a620]" />
                                            {p.startTime || "--:--"} {p.endTime && `- ${p.endTime}`}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-zinc-400 font-medium uppercase tracking-tighter">Icona:</span>
                                            {getIconComponent(p.icon)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {program.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-zinc-400 font-serif italic text-sm">
                                    Nessuna attività in programma.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
