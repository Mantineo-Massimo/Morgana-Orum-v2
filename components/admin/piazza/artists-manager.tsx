"use client"

import { useState } from "react"
import { Plus, Trash2, X, Users } from "lucide-react"
import { createPiazzaArtist, deletePiazzaArtist } from "@/app/actions/piazza"
import Image from "next/image"

const CATEGORIES = ["Musica", "Danza", "Pittura", "Performance"]

interface ArtistsManagerProps {
    artists: any[]
}

export function ArtistsManager({ artists }: ArtistsManagerProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })

    const handleAdd = async () => {
        setLoading(true)
        const res = await createPiazzaArtist(form)
        if (res.success) {
            setIsAdding(false)
            setForm({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
            window.location.reload()
        } else {
            alert(res.error)
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo artista?")) return
        const res = await deletePiazzaArtist(id)
        if (res.success) window.location.reload()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                    <Users className="size-5 text-[#f9a620]" /> Gestione Artisti
                </h3>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4" /> Aggiungi Artista
                </button>
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h4 className="text-lg font-bold uppercase tracking-tight">Nuovo Artista</h4>
                        <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600"><X className="size-6" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Artista</label>
                            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Mario Rossi" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ruolo/Genere</label>
                            <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Live Band" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-white">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Badge (Opzionale)</label>
                            <input type="text" value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Es: Headliner" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bio</label>
                            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none h-32 resize-none" placeholder="Breve biografia..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Immagine (Asset Path)</label>
                            <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="/assets/artisti/nome.webp" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" />
                        </div>
                        <div className="md:col-span-2 pt-4">
                            <button onClick={handleAdd} disabled={loading} className="w-full py-4 bg-[#f9a620] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest hover:bg-[#e89a1c] disabled:opacity-50 transition-all shadow-lg shadow-amber-100">
                                {loading ? "Salvataggio..." : "Salva Artista"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Artista</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Categoria</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Info</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {artists.map((a: any) => (
                            <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg overflow-hidden shrink-0 relative border border-zinc-100">
                                            <Image src={a.image || "/assets/slides/1.webp"} fill className="object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-zinc-900">{a.name}</p>
                                            <p className="text-[10px] text-zinc-500 italic font-medium">{a.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full text-zinc-600">{a.category}</span>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                    {a.badge && <span className="text-[#f9a620] mr-2">{a.badge}</span>}
                                    Pos: {a.order}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(a.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {artists.length === 0 && !isAdding && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-zinc-400 font-serif italic text-sm">
                                    Nessun artista presente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
