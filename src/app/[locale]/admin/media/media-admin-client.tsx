"use client"

import { useState, useRef } from "react"
import { MediaItem, addToMediaLibrary, deleteMediaLibraryItem } from "@/app/actions/media"
import {
    Search, Image as ImageIcon, Copy, Check, ExternalLink,
    RefreshCw, Upload, Trash2, AlertTriangle, X, Loader2, Info
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaAdminClientProps {
    initialMedia: MediaItem[]
}

export function MediaAdminClient({ initialMedia }: MediaAdminClientProps) {
    const [media, setMedia] = useState<MediaItem[]>(initialMedia)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSource, setSelectedSource] = useState("Tutti")
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<MediaItem | null>(null)
    const [deleting, setDeleting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Extract unique sources for filtering
    const sources = ["Tutti", "Libreria", ...Array.from(new Set(initialMedia.filter(m => m.source !== "Libreria").map(m => m.source)))]

    // Filter media items
    const filteredMedia = media.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.url.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSource = selectedSource === "Tutti" || item.source === selectedSource
        return matchesSearch && matchesSource
    })

    const handleCopy = (url: string, index: number) => {
        navigator.clipboard.writeText(url)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        try {
            const { getUploadedMedia } = await import("@/app/actions/media")
            const updated = await getUploadedMedia()
            setMedia(updated)
        } catch (e) {
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

    const handleUpload = async (file: File) => {
        setUploading(true)
        try {
            // Upload to Vercel Blob via the upload API
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", "library")
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (!res.ok) {
                alert(data.error || "Errore nel caricamento")
                return
            }

            // Save to MediaLibraryItem
            const result = await addToMediaLibrary(
                data.url,
                file.name.replace(/\.[^/.]+$/, ""), // name without extension
                file.type,
                file.size
            )

            if (!result.success) {
                alert(result.error || "Errore nel salvataggio in libreria")
                return
            }

            // Refresh media list
            await handleRefresh()
        } catch (e) {
            console.error(e)
            alert("Errore durante il caricamento")
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm?.libraryId) return
        setDeleting(true)
        try {
            const result = await deleteMediaLibraryItem(deleteConfirm.libraryId)
            if (result.success) {
                setMedia(prev => prev.filter(m => m.url !== deleteConfirm.url))
            } else {
                alert(result.error || "Errore durante l'eliminazione")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setDeleting(false)
            setDeleteConfirm(null)
        }
    }

    const getSourceBadgeColor = (source: string) => {
        switch (source) {
            case "Libreria":
                return "bg-indigo-50 text-indigo-600 border-indigo-200"
            case "Notizia":
                return "bg-red-50 text-[#c12830] border-red-100"
            case "Evento":
                return "bg-[#18182e]/5 text-[#18182e] border-[#18182e]/10"
            case "Rappresentante":
                return "bg-amber-50 text-amber-600 border-amber-100"
            case "Organigramma":
                return "bg-purple-50 text-purple-600 border-purple-100"
            case "Convenzione":
                return "bg-teal-50 text-teal-600 border-teal-100"
            default:
                return "bg-slate-50 text-slate-600 border-slate-100"
        }
    }

    const formatBytes = (bytes?: number | null) => {
        if (!bytes) return null
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl">
                            <ImageIcon className="size-6" />
                        </div>
                        Libreria Media
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                        Gestisci tutte le immagini: carica nuovi file, copia URL, elimina quelli non più necessari.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={cn("size-4 text-slate-500", refreshing && "animate-spin")} />
                        Aggiorna
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {uploading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Upload className="size-4" />
                        )}
                        Carica Immagine
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                                handleUpload(file)
                                e.target.value = ""
                            }
                        }}
                    />
                </div>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation()
                    const file = e.dataTransfer.files[0]
                    if (file?.type.startsWith("image/")) handleUpload(file)
                }}
                className="border-2 border-dashed border-pink-200 rounded-2xl p-6 text-center bg-pink-50/30 hover:bg-pink-50/50 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-2 text-pink-600">
                        <Loader2 className="size-8 animate-spin" />
                        <span className="text-sm font-bold">Caricamento in corso...</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-pink-550">
                        <Upload className="size-8 text-pink-500" />
                        <p className="text-sm font-bold">Trascina qui un&apos;immagine o clicca per caricare</p>
                        <p className="text-xs text-pink-400">JPG, PNG, WebP, GIF — max 10MB</p>
                    </div>
                )}
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-700">
                <Info className="size-4 shrink-0 mt-0.5" />
                <div className="font-medium font-sans">
                    <span className="font-bold">Nota: </span>
                    Le immagini con badge <span className="font-bold text-pink-600">Libreria</span> sono caricate direttamente qui e possono essere eliminate. Le altre provengono da record del sito (Notizie, Eventi, ecc.) e devono essere gestite dal rispettivo form.
                </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Search */}
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca per titolo o URL dell'immagine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                    />
                </div>

                {/* Sources Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {sources.map(source => (
                        <button
                            key={source}
                            onClick={() => setSelectedSource(source)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
                                selectedSource === source
                                    ? "bg-gradient-to-br from-[#c12830] to-[#18182e] border-transparent text-white shadow-sm"
                                    : "bg-white text-slate-500 border-slate-200/60 hover:bg-slate-50"
                            )}
                        >
                            {source}
                            {source !== "Tutti" && (
                                <span className="ml-1.5 opacity-60 text-[10px]">
                                    ({media.filter(m => m.source === source).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats row */}
            <div className="text-xs text-zinc-400 font-medium">
                {filteredMedia.length} immagini trovate {selectedSource !== "Tutti" && `in "${selectedSource}"`}
                {searchQuery && ` per "${searchQuery}"`}
            </div>

            {/* Grid */}
            {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMedia.map((item, idx) => (
                        <div
                            key={item.url}
                            className="group bg-white rounded-2xl border border-zinc-150 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-zinc-50 border-b border-zinc-100 overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                {/* Delete button — only for library items */}
                                {item.libraryId && (
                                    <button
                                        onClick={() => setDeleteConfirm(item)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        title="Elimina dalla libreria"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                            getSourceBadgeColor(item.source)
                                        )}>
                                            {item.source}
                                        </span>
                                        {item.sizeBytes && (
                                            <span className="text-[10px] text-zinc-400 font-mono">
                                                {formatBytes(item.sizeBytes)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-zinc-900 text-sm line-clamp-1 leading-snug" title={item.title}>
                                        {item.title}
                                    </h3>
                                    <p className="text-[10px] text-zinc-400 font-mono truncate select-all" title={item.url}>
                                        {item.url}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    <button
                                        onClick={() => handleCopy(item.url, idx)}
                                        className={cn(
                                            "flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all",
                                            copiedIndex === idx
                                                ? "bg-green-50 border-green-200 text-green-600"
                                                : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-900"
                                        )}
                                    >
                                        {copiedIndex === idx ? (
                                            <>
                                                <Check className="size-3.5" />
                                                Copiato!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="size-3.5" />
                                                Copia URL
                                            </>
                                        )}
                                    </button>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all"
                                        title="Apri in una nuova scheda"
                                    >
                                        <ExternalLink className="size-3.5" />
                                    </a>
                                    {item.libraryId && (
                                        <button
                                            onClick={() => setDeleteConfirm(item)}
                                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 hover:text-red-700 transition-all"
                                            title="Elimina dalla libreria"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-zinc-100 shadow-sm max-w-md mx-auto">
                    <ImageIcon className="size-12 mx-auto mb-4 text-zinc-300 animate-pulse" />
                    <h3 className="font-bold text-zinc-700 mb-1">Nessuna immagine trovata</h3>
                    <p className="text-sm text-zinc-400">
                        {searchQuery
                            ? "Prova a modificare i filtri o la query di ricerca."
                            : "Non ci sono ancora immagini salvate nel database."}
                    </p>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 my-auto animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-50 text-red-500 shrink-0">
                                <AlertTriangle className="size-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-black text-slate-900 text-lg">Elimina immagine</h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                                    Questa azione è irreversibile. L&apos;immagine verrà eliminata dalla libreria e da Vercel Blob.
                                </p>
                            </div>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={deleteConfirm.url}
                                alt={deleteConfirm.title}
                                className="size-14 rounded-lg object-cover border border-slate-200/60 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm truncate">{deleteConfirm.title}</p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">{deleteConfirm.url}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="flex-1 py-3 rounded-xl bg-red-650 text-white font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <><Loader2 className="size-4 animate-spin" /> Eliminazione...</>
                                ) : (
                                    <><Trash2 className="size-4" /> Elimina</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
