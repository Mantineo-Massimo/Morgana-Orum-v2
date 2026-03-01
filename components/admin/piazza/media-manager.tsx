"use client"

import { useState } from "react"
import { Plus, Trash2, X, Play, Camera, Mic2, Video as VideoIcon } from "lucide-react"
import { createPiazzaMediaItem, deletePiazzaMediaItem } from "@/app/actions/piazza"
import Image from "next/image"

const MEDIA_TYPES = ["VIDEO", "PHOTO", "INTERVIEW"]

interface MediaManagerProps {
    media: any[]
}

export function MediaManager({ media }: MediaManagerProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })

    const handleAdd = async () => {
        setLoading(true)
        const res = await createPiazzaMediaItem(form)
        if (res.success) {
            setIsAdding(false)
            setForm({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
            window.location.reload()
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo contenuto?")) return
        const res = await deletePiazzaMediaItem(id)
        if (res.success) window.location.reload()
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "VIDEO": return <Play className="size-4" />
            case "PHOTO": return <Camera className="size-4" />
            case "INTERVIEW": return <Mic2 className="size-4" />
            default: return <VideoIcon className="size-4" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <VideoIcon className="size-5 text-[#f9a620]" /> Gestione Media
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4" /> Aggiungi Media
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h4 className="text-lg font-bold uppercase tracking-tight">Nuovo Contenuto</h4>
                        <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600"><X className="size-6" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tipo Contenuto</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-white">
                                {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Titolo del contenuto" />
                        </div>

                        {form.type === "INTERVIEW" && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Persona</label>
                                    <input type="text" value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Jane Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ruolo Persona</label>
                                    <input type="text" value={form.personRole} onChange={e => setForm({ ...form, personRole: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Scrittrice" />
                                </div>
                            </>
                        )}

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Link URL / Citazione</label>
                            <input type="text" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="YouTube URL o Testo citazione" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Thumbnail / Foto (Path)</label>
                            <input type="text" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="/assets/media/1.jpg" />
                        </div>
                        {form.type === "VIDEO" && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Durata</label>
                                <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: 3:45" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button onClick={handleAdd} disabled={loading} className="w-full py-4 bg-[#f9a620] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest hover:bg-[#e89a1c] disabled:opacity-50 transition-all shadow-lg shadow-amber-100">
                                {loading ? "Salvataggio..." : "Salva Media"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Contenuto</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Tipo</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Info Extra</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {media.map((m: any) => (
                            <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg overflow-hidden shrink-0 relative border border-zinc-100 bg-zinc-100 flex items-center justify-center">
                                            {m.thumbnail ? (
                                                <Image src={m.thumbnail} fill className="object-cover" alt="" />
                                            ) : (
                                                <VideoIcon className="size-5 text-zinc-300" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-zinc-900">{m.title}</p>
                                            <p className="text-[10px] text-zinc-500 italic max-w-[250px] truncate font-medium">{m.url}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 px-2 rounded-full bg-zinc-100 flex items-center gap-1.5 text-zinc-600">
                                            {getIcon(m.type)}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{m.type}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                        {m.personName && <span className="text-zinc-600">{m.personName} ({m.personRole})</span>}
                                        {m.duration && <span>Durata: {m.duration}</span>}
                                        <span>Pos: {m.order}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {media.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-zinc-400 font-serif italic text-sm">
                                    Nessun media caricato.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
