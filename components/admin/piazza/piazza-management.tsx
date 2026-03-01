"use client"

import { useState } from "react"
import {
    Plus, Trash2, Edit2, Save, X,
    User, Calendar, Play, Camera, Mic2,
    ChevronRight, ArrowRight, Star, Palette, Users
} from "lucide-react"
import {
    createPiazzaArtist, deletePiazzaArtist,
    createPiazzaProgramItem, deletePiazzaProgramItem,
    createPiazzaMediaItem, deletePiazzaMediaItem
} from "@/app/actions/piazza"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Props {
    artists: any[]
    program: any[]
    media: any[]
}

const CATEGORIES = ["Musica", "Danza", "Pittura", "Performance"]
const SLOTS = ["Mattino", "Pomeriggio", "Sera"]
const MEDIA_TYPES = ["VIDEO", "PHOTO", "INTERVIEW"]

export function PiazzaManagement({ artists: initialArtists, program: initialProgram, media: initialMedia }: Props) {
    const [activeTab, setActiveTab] = useState<"artists" | "program" | "media">("artists")
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form states
    const [artistForm, setArtistForm] = useState({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
    const [programForm, setProgramForm] = useState({ title: "", description: "", timeSlot: "Mattino", startTime: "", endTime: "", icon: "Palette", order: 0 })
    const [mediaForm, setMediaForm] = useState({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })

    const handleAddArtist = async () => {
        setLoading(true)
        const res = await createPiazzaArtist(artistForm)
        if (res.success) {
            setIsAdding(false)
            setArtistForm({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
            window.location.reload()
        }
        setLoading(false)
    }

    const handleDeleteArtist = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo artista?")) return
        const res = await deletePiazzaArtist(id)
        if (res.success) window.location.reload()
    }

    const handleAddProgram = async () => {
        setLoading(true)
        const res = await createPiazzaProgramItem(programForm)
        if (res.success) {
            setIsAdding(false)
            setProgramForm({ title: "", description: "", timeSlot: "Mattino", startTime: "", endTime: "", icon: "Palette", order: 0 })
            window.location.reload()
        }
        setLoading(false)
    }

    const handleDeleteProgram = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questa attività?")) return
        const res = await deletePiazzaProgramItem(id)
        if (res.success) window.location.reload()
    }

    const handleAddMedia = async () => {
        setLoading(true)
        const res = await createPiazzaMediaItem(mediaForm)
        if (res.success) {
            setIsAdding(false)
            setMediaForm({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
            window.location.reload()
        }
        setLoading(false)
    }

    const handleDeleteMedia = async (id: string) => {
        if (!confirm("Sicuro di voler eliminare questo contenuto?")) return
        const res = await deletePiazzaMediaItem(id)
        if (res.success) window.location.reload()
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex bg-zinc-200 p-1 rounded-xl">
                    <button
                        onClick={() => { setActiveTab("artists"); setIsAdding(false) }}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === "artists" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                    >
                        Artisti
                    </button>
                    <button
                        onClick={() => { setActiveTab("program"); setIsAdding(false) }}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === "program" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                    >
                        Programma
                    </button>
                    <button
                        onClick={() => { setActiveTab("media"); setIsAdding(false) }}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === "media" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                    >
                        Media
                    </button>
                </div>

                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18182e] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg"
                    >
                        <Plus className="size-4" /> Aggiungi {activeTab === "artists" ? "Artista" : activeTab === "program" ? "Attività" : "Media"}
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-xl font-bold uppercase tracking-tight">Nuovo {activeTab === "artists" ? "Artista" : activeTab === "program" ? "Attività" : "Media"}</h3>
                        <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600"><X className="size-6" /></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {activeTab === "artists" && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Artista</label>
                                    <input type="text" value={artistForm.name} onChange={e => setArtistForm({ ...artistForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Es: Artista 1" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ruolo/Genere</label>
                                    <input type="text" value={artistForm.role} onChange={e => setArtistForm({ ...artistForm, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Es: Live Band" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                                    <select value={artistForm.category} onChange={e => setArtistForm({ ...artistForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none bg-white">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Badge (Opzionale)</label>
                                    <input type="text" value={artistForm.badge} onChange={e => setArtistForm({ ...artistForm, badge: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Es: Headliner" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bio</label>
                                    <textarea value={artistForm.bio} onChange={e => setArtistForm({ ...artistForm, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none h-32 resize-none" placeholder="Breve biografia..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Immagine (Asset Path)</label>
                                    <input type="text" value={artistForm.image} onChange={e => setArtistForm({ ...artistForm, image: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="/assets/slides/1.jpg" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                    <input type="number" value={artistForm.order} onChange={e => setArtistForm({ ...artistForm, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button onClick={handleAddArtist} disabled={loading} className="w-full py-4 bg-[#18182e] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all">
                                        {loading ? "Salvataggio..." : "Salva Artista"}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === "program" && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo Attività</label>
                                    <input type="text" value={programForm.title} onChange={e => setProgramForm({ ...programForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Es: Il Simposio" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Fascia Oraria</label>
                                    <select value={programForm.timeSlot} onChange={e => setProgramForm({ ...programForm, timeSlot: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none bg-white">
                                        {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Orario Inizio (Opzionale)</label>
                                    <input type="text" value={programForm.startTime} onChange={e => setProgramForm({ ...programForm, startTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="09:00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Orario Fine (Opzionale)</label>
                                    <input type="text" value={programForm.endTime} onChange={e => setProgramForm({ ...programForm, endTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="13:00" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Descrizione</label>
                                    <textarea value={programForm.description} onChange={e => setProgramForm({ ...programForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none h-32 resize-none" placeholder="Descrizione dell'attività..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Icona (Lucide Name)</label>
                                    <input type="text" value={programForm.icon} onChange={e => setProgramForm({ ...programForm, icon: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Palette, Mic2, Star, etc." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ordine</label>
                                    <input type="number" value={programForm.order} onChange={e => setProgramForm({ ...programForm, order: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" />
                                </div>
                                <div className="md:col-span-2 pt-4">
                                    <button onClick={handleAddProgram} disabled={loading} className="w-full py-4 bg-[#18182e] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all">
                                        {loading ? "Salvataggio..." : "Salva Attività"}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === "media" && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tipo Contenuto</label>
                                    <select value={mediaForm.type} onChange={e => setMediaForm({ ...mediaForm, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none bg-white">
                                        {MEDIA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Titolo</label>
                                    <input type="text" value={mediaForm.title} onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Tito del video/foto" />
                                </div>
                                {mediaForm.type === "INTERVIEW" && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Nome Persona</label>
                                            <input type="text" value={mediaForm.personName} onChange={e => setMediaForm({ ...mediaForm, personName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ruolo Persona</label>
                                            <input type="text" value={mediaForm.personRole} onChange={e => setMediaForm({ ...mediaForm, personRole: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" />
                                        </div>
                                    </>
                                )}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Link URL / Citazione</label>
                                    <input type="text" value={mediaForm.url} onChange={e => setMediaForm({ ...mediaForm, url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="YouTube URL o Testo citazione (intervista)" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Thumbnail / Foto (Path)</label>
                                    <input type="text" value={mediaForm.thumbnail} onChange={e => setMediaForm({ ...mediaForm, thumbnail: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="/assets/slides/1.jpg" />
                                </div>
                                {mediaForm.type === "VIDEO" && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Durata</label>
                                        <input type="text" value={mediaForm.duration} onChange={e => setMediaForm({ ...mediaForm, duration: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Ex: 4:32" />
                                    </div>
                                )}
                                <div className="md:col-span-2 pt-4">
                                    <button onClick={handleAddMedia} disabled={loading} className="w-full py-4 bg-[#18182e] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all">
                                        {loading ? "Salvataggio..." : "Salva Media"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* LISTS */}
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-zinc-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Dettagli</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Classificazione</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Extra</th>
                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {activeTab === "artists" && initialArtists.map((a: any) => (
                            <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg overflow-hidden shrink-0 relative">
                                            <Image src={a.image || "/assets/slides/1.jpg"} fill className="object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{a.name}</p>
                                            <p className="text-xs text-zinc-500 italic">{a.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full">{a.category}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-zinc-500">
                                    {a.badge && <span className="text-amber-600 font-bold uppercase tracking-tighter mr-2">{a.badge}</span>}
                                    Ordine: {a.order}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteArtist(a.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {activeTab === "program" && initialProgram.map((p: any) => (
                            <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-sm">{p.title}</p>
                                    <p className="text-xs text-zinc-500 truncate max-w-[200px]">{p.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full">{p.timeSlot}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-zinc-500">
                                    {p.startTime} - {p.endTime} <br /> Icona: {p.icon}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteProgram(p.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {activeTab === "media" && initialMedia.map((m: any) => (
                            <tr key={m.id} className="hover:bg-zinc-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        {m.thumbnail && (
                                            <div className="size-10 rounded-lg overflow-hidden shrink-0 relative">
                                                <Image src={m.thumbnail} fill className="object-cover" alt="" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-sm">{m.title}</p>
                                            <p className="text-xs text-zinc-500 italic max-w-[200px] truncate">{m.url}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full">{m.type}</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-zinc-500">
                                    {m.personName && <span>{m.personName} ({m.personRole})</span>}
                                    {m.duration && <span>{m.duration}</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDeleteMedia(m.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="size-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {((activeTab === "artists" && initialArtists.length === 0) ||
                    (activeTab === "program" && initialProgram.length === 0) ||
                    (activeTab === "media" && initialMedia.length === 0)) && !isAdding && (
                        <div className="py-20 text-center text-zinc-400">
                            Nessun elemento presente in questa categoria.
                        </div>
                    )}
            </div>
        </div>
    )
}
