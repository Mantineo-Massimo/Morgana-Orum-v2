"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, X, Users, Upload, Loader2, ImageIcon, Pencil } from "lucide-react"
import { createPiazzaArtist, updatePiazzaArtist, deletePiazzaArtist } from "@/app/actions/piazza"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const CATEGORIES = ["Musica", "Danza", "Pittura", "Performance"]

interface ArtistsManagerProps {
    artists: any[]
}

export function ArtistsManager({ artists }: ArtistsManagerProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleImageUpload(file: File) {
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

    const handleOpenAdd = () => {
        setEditingId(null)
        setError(null)
        setForm({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
        setIsOpen(true)
    }

    const handleEdit = (item: any) => {
        setEditingId(item.id)
        setError(null)
        setForm({
            name: item.name,
            role: item.role || "",
            category: item.category || "Musica",
            bio: item.bio || "",
            image: item.image || "",
            badge: item.badge || "",
            order: item.order || 0
        })
        setIsOpen(true)
    }

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        const res = editingId 
            ? await updatePiazzaArtist(editingId, form)
            : await createPiazzaArtist(form)
            
        if (res.success) {
            setIsOpen(false)
            setForm({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
            router.refresh()
        } else {
            setError(res.error || "Errore durante il salvataggio")
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
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4" /> Aggiungi Artista
                </button>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                        <div className="bg-white p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    {editingId ? <Pencil className="size-6 text-[#f9a620]" /> : <Plus className="size-6 text-[#f9a620]" />}
                                    {editingId ? "Modifica Artista" : "Nuovo Artista"}
                                </DialogTitle>
                            </DialogHeader>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

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
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Immagine Artista</label>
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-24 h-24 rounded-2xl bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {form.image ? (
                                                <>
                                                    <Image src={form.image} alt="Preview" fill sizes="96px" className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                                                    >
                                                        <X className="size-3" />
                                                    </button>
                                                </>
                                            ) : (
                                                <ImageIcon className="size-6 text-zinc-400" />
                                            )}
                                        </div>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                                            onDrop={(e) => {
                                                e.preventDefault(); e.stopPropagation()
                                                const file = e.dataTransfer.files[0]
                                                if (file) handleImageUpload(file)
                                            }}
                                            className="flex-1 border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#f9a620] hover:bg-[#f9a620]/5 transition-all h-24 flex items-center justify-center"
                                        >
                                            {isUploading ? (
                                                <div className="flex items-center justify-center gap-2 text-zinc-500">
                                                    <Loader2 className="size-5 animate-spin" />
                                                    <span className="text-sm font-bold uppercase tracking-widest">Caricamento...</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-1">
                                                    <Upload className="size-5 text-zinc-400 mb-1" />
                                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Clicca o trascina un&apos;immagine</span>
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
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-[#f9a620] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest hover:bg-[#e89a1c] disabled:opacity-50 transition-all shadow-lg shadow-amber-100">
                                        {loading ? "Salvataggio..." : (editingId ? "Aggiorna Artista" : "Salva Artista")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

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
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(a)} className="p-2 text-zinc-300 hover:text-[#f9a620] transition-colors">
                                            <Pencil className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {artists.length === 0 && !isOpen && (
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
