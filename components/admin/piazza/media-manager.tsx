"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, X, Play, Camera, Mic2, Video as VideoIcon, Upload, Loader2, ImageIcon, Pencil } from "lucide-react"
import { createPiazzaMediaItem, updatePiazzaMediaItem, deletePiazzaMediaItem } from "@/app/actions/piazza"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const MEDIA_TYPES = ["VIDEO", "PHOTO", "INTERVIEW"]

interface MediaManagerProps {
    media: any[]
}

export function MediaManager({ media }: MediaManagerProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
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
                setForm(prev => ({ ...prev, thumbnail: data.url }))
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
        setForm({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
        setIsOpen(true)
    }

    const handleEdit = (item: any) => {
        setEditingId(item.id)
        setError(null)
        setForm({
            type: item.type || "VIDEO",
            title: item.title || "",
            description: item.description || "",
            url: item.url || "",
            thumbnail: item.thumbnail || "",
            personName: item.personName || "",
            personRole: item.personRole || "",
            duration: item.duration || "",
            order: item.order || 0
        })
        setIsOpen(true)
    }

    const handleSave = async () => {
        setLoading(true)
        setError(null)
        const res = editingId 
            ? await updatePiazzaMediaItem(editingId, form)
            : await createPiazzaMediaItem(form)
            
        if (res.success) {
            setIsOpen(false)
            setForm({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
            router.refresh()
        } else {
            setError(res.error || "Errore durante il salvataggio")
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
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4" /> Aggiungi Media
                </button>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="max-w-2xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                        <div className="bg-white p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    {editingId ? <Pencil className="size-6 text-[#f9a620]" /> : <Plus className="size-6 text-[#f9a620]" />}
                                    {editingId ? "Modifica Media" : "Nuovo Media"}
                                </DialogTitle>
                            </DialogHeader>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 uppercase tracking-widest">
                                    {error}
                                    </div>
                            )}

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
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Thumbnail / Foto Media</label>
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-40 h-24 rounded-2xl bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {form.thumbnail ? (
                                                <>
                                                    <Image src={form.thumbnail} alt="Preview" fill sizes="160px" className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setForm(prev => ({ ...prev, thumbnail: "" }))}
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
                                    <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-[#f9a620] text-[#0f172a] rounded-2xl font-black uppercase tracking-widest hover:bg-[#e89a1c] disabled:opacity-50 transition-all shadow-lg shadow-amber-100">
                                        {loading ? "Salvataggio..." : (editingId ? "Aggiorna Media" : "Salva Media")}
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
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => handleEdit(m)} className="p-2 text-zinc-300 hover:text-[#f9a620] transition-colors">
                                            <Pencil className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(m.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {media.length === 0 && !isOpen && (
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
