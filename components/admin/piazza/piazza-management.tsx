"use client"

import { useState } from "react"
import {
    Plus, Trash2, X, Palette, Settings, Music, Play, Camera, Mic2
} from "lucide-react"
import {
    createPiazzaArtist, deletePiazzaArtist,
    createPiazzaProgramItem, deletePiazzaProgramItem,
    createPiazzaMediaItem, deletePiazzaMediaItem,
    updatePiazzaSettings
} from "@/app/actions/piazza"
import Image from "next/image"
import { cn } from "@/lib/utils"


interface PiazzaManagementProps {
    artists: any[]
    program: any[]
    media: any[]
    settings: {
        year: string
        eventDate: Date | null | string
        countdownVisible: boolean
    }
}

const CATEGORIES = ["Musica", "Danza", "Pittura", "Performance"]
const SLOTS = ["Mattino", "Pomeriggio", "Sera"]
const MEDIA_TYPES = ["VIDEO", "PHOTO", "INTERVIEW"]

export function PiazzaManagement({
    artists: initialArtists,
    program: initialProgram,
    media: initialMedia,
    settings: initialSettings
}: PiazzaManagementProps) {
    const [activeTab, setActiveTab] = useState<"artists" | "program" | "media" | "settings">("artists")
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form states
    const [artistForm, setArtistForm] = useState({ name: "", role: "", category: "Musica", bio: "", image: "", badge: "", order: 0 })
    const [programForm, setProgramForm] = useState({ title: "", description: "", timeSlot: "Mattino", startTime: "", endTime: "", icon: "Palette", order: 0 })
    const [mediaForm, setMediaForm] = useState({ type: "VIDEO", title: "", description: "", url: "", thumbnail: "", personName: "", personRole: "", duration: "", order: 0 })
    // Settings Form State
    const [settingsForm, setSettingsForm] = useState({
        year: initialSettings.year,
        eventDate: initialSettings.eventDate ? new Date(initialSettings.eventDate).toISOString().slice(0, 16) : '',
        countdownVisible: initialSettings.countdownVisible
    })

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const result = await updatePiazzaSettings({
                year: settingsForm.year,
                eventDate: settingsForm.eventDate ? new Date(settingsForm.eventDate) : undefined, // Pass as Date object or undefined
                countdownVisible: settingsForm.countdownVisible
            })
            if (result.success) {
                alert("Impostazioni aggiornate con successo")
                window.location.reload() // Reload to reflect changes
            } else {
                alert(result.error)
            }
        } catch (error) {
            alert("Errore nell'aggiornamento")
        } finally {
            setLoading(false)
        }
    }

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
                    <button
                        onClick={() => { setActiveTab("settings"); setIsAdding(false) }}
                        className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === "settings" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                    >
                        Impostazioni
                    </button>
                </div>

                {!isAdding && activeTab !== "settings" && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18182e] text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg"
                    >
                        <Plus className="size-4" /> Aggiungi {activeTab === "artists" ? "Artista" : activeTab === "program" ? "Attività" : "Media"}
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
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
                                    <input type="text" value={mediaForm.title} onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-[#18182e] outline-none" placeholder="Titolo del video/foto" />
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

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-8 animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <Settings className="size-6 text-zinc-400" />
                        <h3 className="text-xl font-bold uppercase tracking-tight text-zinc-900">Impostazioni Globali</h3>
                    </div>

                    <div className="max-w-md space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Anno dell&apos;Evento</label>
                                <input
                                    value={settingsForm.year}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettingsForm({ ...settingsForm, year: e.target.value })}
                                    placeholder="Es: 2026"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-medium bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-widest text-zinc-500">Data e Ora Inizio Evento (Countdown)</label>
                                <input
                                    type="datetime-local"
                                    value={settingsForm.eventDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettingsForm({ ...settingsForm, eventDate: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900/10 outline-none font-medium bg-white"
                                />
                                <p className="text-[10px] text-zinc-400 italic">Questa data verrà utilizzata per il timer del countdown in tutto il sito.</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium">L&apos;anno verrà mostrato nel titolo delle pagine della Piazza.</p>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <div>
                                <p className="font-bold text-zinc-900">Visibilità Countdown</p>
                                <p className="text-xs text-zinc-500">Mostra il banner con il countdown nelle home di Morgana e ORUM.</p>
                            </div>
                            <button
                                onClick={() => setSettingsForm({ ...settingsForm, countdownVisible: !settingsForm.countdownVisible })}
                                className={cn(
                                    "w-14 h-8 rounded-full transition-all relative",
                                    settingsForm.countdownVisible ? "bg-emerald-500" : "bg-zinc-300"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 size-6 bg-white rounded-full shadow-md transition-all",
                                    settingsForm.countdownVisible ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>

                        <button
                            onClick={handleUpdateSettings}
                            disabled={loading}
                            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
                        >
                            {loading ? "Salvataggio..." : "Salva Impostazioni"}
                        </button>
                    </div>
                </div>
            )}

            {/* LISTS (only for non-settings) */}
            {activeTab !== "settings" && (
                <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-zinc-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Dettagli</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Classificazione</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Extra</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {activeTab === "artists" && initialArtists.map((a: any) => (
                                <tr key={a.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-lg overflow-hidden shrink-0 relative border border-zinc-100">
                                                <Image src={a.image || "/assets/slides/1.jpg"} fill className="object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-zinc-900">{a.name}</p>
                                                <p className="text-[10px] text-zinc-500 italic font-medium">{a.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full text-zinc-600">{a.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                        {a.badge && <span className="text-amber-600 mr-2">{a.badge}</span>}
                                        Pos: {a.order}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteArtist(a.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === "program" && initialProgram.map((p: any) => (
                                <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-zinc-900">{p.title}</p>
                                        <p className="text-[10px] text-zinc-500 truncate max-w-[200px] font-medium">{p.description}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full text-zinc-600">{p.timeSlot}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase">
                                        {p.startTime} {p.endTime && `- ${p.endTime}`} <br />
                                        <span className="text-zinc-400">Icona: {p.icon}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteProgram(p.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
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
                                                <div className="size-10 rounded-lg overflow-hidden shrink-0 relative border border-zinc-100">
                                                    <Image src={m.thumbnail} fill className="object-cover" alt="" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm text-zinc-900">{m.title}</p>
                                                <p className="text-[10px] text-zinc-500 italic max-w-[200px] truncate font-medium">{m.url}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 rounded-full text-zinc-600">{m.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                        {m.personName && <span>{m.personName} ({m.personRole})</span>}
                                        {m.duration && <span>{m.duration}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteMedia(m.id)} className="p-2 text-zinc-300 hover:text-red-500 transition-colors">
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
                            <div className="py-20 text-center text-zinc-400 font-serif italic text-sm">
                                Nessun elemento presente in questa categoria.
                            </div>
                        )}
                </div>
            )}
        </div>
    )
}
