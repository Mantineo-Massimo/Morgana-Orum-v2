"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, X, Upload, Loader2, ImageIcon, Pencil, Link as LinkIcon, Building2 } from "lucide-react"
import { createPiazzaSponsor, updatePiazzaSponsor, deletePiazzaSponsor } from "@/app/actions/piazza"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

const TIERS = ["Main Partner", "PremiumPartner", "OfficialPartner", "FantaPartner"]

interface SponsorsManagerProps {
    sponsors: any[]
}

export function SponsorsManager({ sponsors }: SponsorsManagerProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [form, setForm] = useState({ name: "", logo: "", website: "", tier: "Main Partner", order: 0 })
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleImageUpload(file: File) {
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "piazza/sponsors")
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (res.ok) {
                setForm(prev => ({ ...prev, logo: data.url }))
            } else {
                alert(data.error || "Errore nel caricamento del logo")
            }
        } catch {
            alert("Errore nel caricamento del logo")
        } finally {
            setIsUploading(false)
        }
    }

    const handleOpenAdd = () => {
        setEditingId(null)
        setError(null)
        setForm({ name: "", logo: "", website: "", tier: "Main Partner", order: 0 })
        setIsOpen(true)
    }

    const handleEdit = (item: any) => {
        setEditingId(item.id)
        setError(null)
        setForm({
            name: item.name || "",
            logo: item.logo || "",
            website: item.website || "",
            tier: item.tier || "Main Partner",
            order: item.order || 0
        })
        setIsOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const res = editingId 
            ? await updatePiazzaSponsor(editingId, form)
            : await createPiazzaSponsor(form)
            
        if (res.success) {
            setIsOpen(false)
            setForm({ name: "", logo: "", website: "", tier: "Main Partner", order: 0 })
            router.refresh()
        } else {
            setError(res.error || "Errore durante il salvataggio")
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questo sponsor?")) return
        const res = await deletePiazzaSponsor(id)
        if (res.success) router.refresh()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-800 flex items-center gap-3">
                        <Building2 className="size-8 text-[#f9a620]" />
                        Sponsor & Partner
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">Gestisci i loghi e i link dei partner dell&apos;evento</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-[#f9a620] hover:bg-[#e89a1c] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-amber-900/10 active:scale-95"
                >
                    <Plus className="size-5" /> Aggiungi Sponsor
                </button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="bg-white">
                        <div className="p-8 space-y-6">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                    {editingId ? <Pencil className="size-6 text-[#f9a620]" /> : <Plus className="size-6 text-[#f9a620]" />}
                                    {editingId ? "Modifica Sponsor" : "Nuovo Sponsor"}
                                </DialogTitle>
                                <DialogDescription className="sr-only">
                                    Inserisci i dettagli dello sponsor o partner.
                                </DialogDescription>
                            </DialogHeader>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Azienda</label>
                                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" placeholder="Nome dello sponsor" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria / Tier</label>
                                        <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none bg-white">
                                            {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine Visualizzazione</label>
                                        <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Sito Web (opzionale)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="w-full pl-12 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#f9a620]/20 outline-none text-sm" placeholder="https://..." />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Logo Sponsor</label>
                                    <div className="flex items-center gap-6 p-4 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                                        <div className="relative size-24 rounded-xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                            {form.logo ? (
                                                <>
                                                    <Image src={form.logo} alt="Logo" fill className="object-contain p-2" />
                                                    <button type="button" onClick={() => setForm({ ...form, logo: "" })} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="size-3" />
                                                    </button>
                                                </>
                                            ) : (
                                                <ImageIcon className="size-8 text-zinc-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors disabled:opacity-50"
                                            >
                                                {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                                {form.logo ? "Cambia Logo" : "Carica Logo"}
                                            </button>
                                            <p className="text-[10px] text-zinc-400 font-medium text-center">PNG o SVG con sfondo trasparente consigliati</p>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500 hover:bg-zinc-200 transition-colors">
                                Annulla
                            </button>
                            <button type="submit" disabled={loading} className="px-10 py-3 bg-zinc-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-2">
                                {loading && <Loader2 className="size-3 animate-spin" />}
                                {editingId ? "Salva Modifiche" : "Crea Sponsor"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-50 border-b border-zinc-100">
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Logo</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Sponsor</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Categoria</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                        {sponsors.map((s) => (
                            <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="relative size-12 rounded-lg bg-white border border-zinc-100 flex items-center justify-center overflow-hidden">
                                        {s.logo ? <Image src={s.logo} alt={s.name} fill className="object-contain p-1" /> : <Building2 className="size-6 text-zinc-200" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-zinc-900">{s.name}</div>
                                    <div className="text-[10px] text-zinc-400 font-medium truncate max-w-[200px]">{s.website || "Nessun sito"}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-zinc-100 text-zinc-500">
                                        {s.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEdit(s)} className="p-2 text-zinc-400 hover:text-[#f9a620] hover:bg-[#f9a620]/10 rounded-lg transition-all">
                                            <Pencil className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sponsors.length === 0 && (
                    <div className="p-12 text-center">
                        <Building2 className="size-12 text-zinc-100 mx-auto mb-4" />
                        <p className="text-zinc-400 font-serif italic">Nessun sponsor registrato.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
