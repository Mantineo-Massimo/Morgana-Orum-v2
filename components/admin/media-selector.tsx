"use client"

import { useState, useEffect } from "react"
import { getUploadedMedia, MediaItem } from "@/app/actions/media"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaSelectorProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (url: string) => void
}

export function MediaSelector({ isOpen, onClose, onSelect }: MediaSelectorProps) {
    const [media, setMedia] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSource, setSelectedSource] = useState("Tutti")

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            getUploadedMedia()
                .then((data) => {
                    setMedia(data)
                })
                .catch((err) => {
                    console.error("Error loading media:", err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [isOpen])

    const sources = ["Tutti", ...Array.from(new Set(media.map((m) => m.source)))]

    const filteredMedia = media.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.url.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSource = selectedSource === "Tutti" || item.source === selectedSource
        return matchesSearch && matchesSource
    })

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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
                <DialogHeader className="pb-4 border-b border-zinc-100">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ImageIcon className="size-5 text-indigo-600" />
                        Scegli da Libreria Media
                    </DialogTitle>
                    <p className="text-xs text-zinc-500 mt-1">
                        Seleziona un&apos;immagine precedentemente caricata nel database per riutilizzarla.
                    </p>
                </DialogHeader>

                {/* Filters */}
                <div className="py-4 flex flex-col sm:flex-row gap-3 border-b border-zinc-150">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cerca per titolo o URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium"
                        />
                    </div>

                    {/* Source Filters */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {sources.map((source) => (
                            <button
                                key={source}
                                type="button"
                                onClick={() => setSelectedSource(source)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border",
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

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto py-6 min-h-[300px] max-h-[50vh] custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <Loader2 className="size-8 animate-spin mb-4 text-indigo-600" />
                            <p className="text-sm font-medium">Caricamento immagini in corso...</p>
                        </div>
                    ) : filteredMedia.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredMedia.map((item) => (
                                <button
                                    key={item.url}
                                    type="button"
                                    onClick={() => {
                                        onSelect(item.url)
                                        onClose()
                                    }}
                                    className="group relative flex flex-col text-left rounded-xl border border-zinc-150 overflow-hidden hover:border-zinc-400 hover:shadow-md transition-all duration-200 bg-white"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video bg-zinc-50 border-b border-zinc-100 overflow-hidden flex items-center justify-center">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={item.url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 space-y-1">
                                        <span className={cn(
                                            "inline-block text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border",
                                            getSourceBadgeColor(item.source)
                                        )}>
                                            {item.source}
                                        </span>
                                        <h4 className="font-bold text-zinc-900 text-xs line-clamp-1 leading-snug" title={item.title}>
                                            {item.title}
                                        </h4>
                                        <p className="text-[9px] text-zinc-400 truncate font-mono select-none">
                                            {item.url}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-zinc-50/50 rounded-2xl border border-zinc-100 max-w-md mx-auto">
                            <ImageIcon className="size-10 mx-auto mb-3 text-zinc-300" />
                            <h4 className="font-bold text-zinc-700 mb-1">Nessuna immagine trovata</h4>
                            <p className="text-xs text-zinc-400">
                                {searchQuery
                                    ? "Nessun risultato corrisponde ai criteri di ricerca."
                                    : "Non ci sono ancora immagini caricate nel database."}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
