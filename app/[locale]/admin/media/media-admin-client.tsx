"use client"

import { useState } from "react"
import { MediaItem } from "@/app/actions/media"
import { Search, Image as ImageIcon, Copy, Check, ExternalLink, RefreshCw } from "lucide-react"
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

    // Extract unique sources for filtering
    const sources = ["Tutti", ...Array.from(new Set(initialMedia.map(m => m.source)))]

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
            // Import and run server action client-side
            const { getUploadedMedia } = await import("@/app/actions/media")
            const updated = await getUploadedMedia()
            setMedia(updated)
        } catch (e) {
            console.error(e)
        } finally {
            setRefreshing(false)
        }
    }

    const getSourceBadgeColor = (source: string) => {
        switch (source) {
            case "Notizia":
                return "bg-red-50 text-[#c12830] border-red-100"
            case "Evento":
                return "bg-[#18182e]/5 text-[#18182e] border-[#18182e]/10"
            case "Rappresentante":
                return "bg-amber-50 text-amber-600 border-amber-100"
            case "Organigramma":
                return "bg-indigo-50 text-indigo-600 border-indigo-100"
            case "Convenzione":
                return "bg-teal-50 text-teal-600 border-teal-100"
            default:
                return "bg-slate-50 text-slate-600 border-slate-100"
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <ImageIcon className="size-6" />
                        </div>
                        Libreria Media
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Visualizza e copia le immagini già caricate nel database per riutilizzarle senza duplicati.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 hover:bg-zinc-50 hover:shadow-sm transition-all disabled:opacity-50 shrink-0"
                >
                    <RefreshCw className={cn("size-4 text-zinc-500", refreshing && "animate-spin")} />
                    Aggiorna
                </button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Search */}
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cerca per titolo o URL dell'immagine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium"
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
                                    ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                                    : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                            )}
                        >
                            {source}
                        </button>
                    ))}
                </div>
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
        </div>
    )
}
