"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { ArrowLeft, Play, Camera, Mic2, ChevronRight, X, Download, Sparkles, Share2 } from "lucide-react"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

const TABS = ["Concorso Foto", "Social", "Esibizioni", "Interviste", "Foto"] as const
type Tab = typeof TABS[number]

interface Props {
    media: any[]
}

export function MediaClient({ media }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("Esibizioni")
    const [selectedMedia, setSelectedMedia] = useState<any>(null)

    const esibizioni = media.filter(m => m.type === "ESIBIZIONI")
    const interviste = media.filter(m => m.type === "INTERVISTE")
    const foto = media.filter(m => m.type === "FOTO")
    const concorso = media.filter(m => m.type === "CONCORSO_FOTO")
    const social = media.filter(m => m.type === "SOCIAL")

    const TAB_ICONS: Record<Tab, any> = {
        "Concorso Foto": Sparkles,
        "Social": Share2,
        "Esibizioni": Play,
        "Interviste": Mic2,
        "Foto": Camera,
    }

    const TAB_COLORS: Record<Tab, string> = {
        "Concorso Foto": THEME.primary,
        "Social": "#E1306C", // Instagram-ish
        "Esibizioni": THEME.accent,
        "Interviste": THEME.primary,
        "Foto": THEME.secondary,
    }

    const getEmbedUrl = (url: string) => {
        if (!url) return null
        
        // YouTube
        const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
        if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
        
        // Instagram Reel
        const igMatch = url.match(/instagram\.com\/(?:reels|p|reel)\/([^/?#&]+)/)
        if (igMatch) return `https://www.instagram.com/reels/${igMatch[1]}/embed`
        
        return null
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* HERO */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: THEME.accent }}></div>
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{ backgroundColor: THEME.primary }}></div>
                </div>

                <div className="container relative z-10 text-center">
                    <Link
                        href="/piazzadellarte"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-widest group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Torna alla home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter mb-6">
                        Me<span style={{ color: THEME.accent }}>dia</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-serif leading-relaxed">
                        Rivivi i momenti più belli della Piazza dell&apos;Arte: esibizioni, interviste esclusive e la galleria fotografica.
                    </p>
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full" style={{ backgroundColor: THEME.accent }}></div>
                </div>
            </section>

            {/* TABS */}
            <section className="pb-12">
                <div className="container">
                    <div className="flex justify-center">
                        <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1">
                            {TABS.map((tab) => {
                                const Icon = TAB_ICONS[tab]
                                const active = activeTab === tab
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`inline-flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${active ? "text-[#18182e] shadow-lg" : "text-white/50 hover:text-white"
                                            }`}
                                        style={active ? { backgroundColor: TAB_COLORS[tab] } : {}}
                                    >
                                        <Icon className="size-4" />
                                        {tab}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* TAB CONTENT */}
            <section className="pb-24">
                <div className="container max-w-6xl mx-auto">
                    {/* ── CONCORSO FOTO ── */}
                    {activeTab === "Concorso Foto" && (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {concorso.map((f) => (
                                <div 
                                    key={f.id} 
                                    onClick={() => setSelectedMedia(f)}
                                    className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer"
                                >
                                    <div className="relative">
                                        <Image
                                            src={f.thumbnail || f.url || "/assets/slides/1.webp"}
                                            alt={f.title}
                                            width={600}
                                            height={400}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                                            <span className="text-white text-xs font-black uppercase tracking-widest">{f.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {concorso.length === 0 && <p className="col-span-full text-center text-white/40 py-20 font-serif">Nessuna foto del concorso disponibile.</p>}
                        </div>
                    )}

                    {/* ── SOCIAL ── */}
                    {activeTab === "Social" && (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {social.map((video) => (
                                <div 
                                    key={video.id} 
                                    onClick={() => setSelectedMedia(video)}
                                    className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                                >
                                    <div className={`relative ${video.duration === "9:16" ? "aspect-[9/16]" : "aspect-video"}`}>
                                        <Image src={video.thumbnail || "/assets/slides/1.webp"} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#E1306C" }}>
                                                <Play className="size-6 fill-white text-white ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-black text-base uppercase tracking-wide mb-1.5 group-hover:text-[#E1306C] transition-colors">{video.title}</h3>
                                        {video.description && <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{video.description}</p>}
                                    </div>
                                </div>
                            ))}
                            {social.length === 0 && <p className="col-span-full text-center text-white/40 py-20 font-serif">Nessun contenuto social disponibile.</p>}
                        </div>
                    )}

                    {/* ── ESIBIZIONI ── */}
                    {activeTab === "Esibizioni" && (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            {esibizioni.map((video) => (
                                <div 
                                    key={video.id} 
                                    onClick={() => setSelectedMedia(video)}
                                    className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                                >
                                    <div className={`relative ${video.duration === "9:16" ? "aspect-[9/16]" : "aspect-video"}`}>
                                        <Image src={video.thumbnail || "/assets/slides/1.webp"} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-14 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: THEME.accent }}>
                                                <Play className="size-6 fill-[#18182e] text-[#18182e] ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-black text-base uppercase tracking-wide mb-1.5 group-hover:text-[#1fbcd3] transition-colors">{video.title}</h3>
                                        {video.description && <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{video.description}</p>}
                                    </div>
                                </div>
                            ))}
                            {esibizioni.length === 0 && <p className="col-span-full text-center text-white/40 py-20 font-serif">Nessuna esibizione disponibile.</p>}
                        </div>
                    )}

                    {/* ── INTERVISTE ── */}
                    {activeTab === "Interviste" && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {interviste.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedMedia(item)}
                                    className="group flex gap-6 p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative shrink-0 size-20 md:size-24 rounded-2xl overflow-hidden bg-zinc-800 ring-2 ring-white/10">
                                        <Image src={item.thumbnail || "/assets/slides/1.webp"} alt={item.personName} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-3">
                                            <strong className="block text-white font-black text-lg">{item.personName}</strong>
                                            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: THEME.primary }}>{item.personRole}</span>
                                        </div>
                                        <p className="text-white/70 leading-relaxed italic text-base line-clamp-3">
                                            &ldquo;{item.description || item.title}&rdquo;
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-black uppercase tracking-widest transition-colors group-hover:text-white text-white/40">
                                            Guarda l&apos;intervista <ChevronRight className="size-4" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {interviste.length === 0 && <p className="text-center text-white/40 py-20 font-serif">Nessuna intervista disponibile.</p>}
                        </div>
                    )}

                    {/* ── FOTO ── */}
                    {activeTab === "Foto" && (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {foto.map((f) => (
                                <div 
                                    key={f.id} 
                                    onClick={() => setSelectedMedia(f)}
                                    className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer"
                                >
                                    <div className="relative">
                                        <Image
                                            src={f.thumbnail || f.url || "/assets/slides/1.webp"}
                                            alt={f.title}
                                            width={600}
                                            height={400}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                                            <span className="text-white text-xs font-black uppercase tracking-widest">{f.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {foto.length === 0 && <p className="col-span-full text-center text-white/40 py-20 font-serif">Nessuna foto disponibile.</p>}
                        </div>
                    )}

                </div>
            </section>

            {/* LIGHTBOX MODAL */}
            {selectedMedia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}></div>
                    
                    <div className={`relative w-full ${selectedMedia.duration === "9:16" ? "max-w-[400px] aspect-[9/16]" : "max-w-5xl aspect-video"} bg-black rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300`}>
                        <button 
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-6 right-6 z-50 size-12 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all"
                        >
                            <X className="size-6" />
                        </button>

                        <div className="w-full h-full flex flex-col">
                            <div className="flex-1 min-h-0 bg-black flex items-center justify-center">
                                {selectedMedia.type === "PHOTO" ? (
                                    <div className="relative w-full h-full p-4">
                                        <Image 
                                            src={selectedMedia.url || selectedMedia.thumbnail} 
                                            alt={selectedMedia.title} 
                                            fill 
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    (() => {
                                        const embedUrl = getEmbedUrl(selectedMedia.url)
                                        if (embedUrl) {
                                            return (
                                                <iframe 
                                                    src={embedUrl}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                ></iframe>
                                            )
                                        } else if (selectedMedia.url?.match(/\.(mp4|webm|ogg)$/i) || !selectedMedia.url?.startsWith('http')) {
                                            return (
                                                <video 
                                                    src={selectedMedia.url} 
                                                    controls 
                                                    autoPlay 
                                                    className="w-full h-full max-h-full"
                                                ></video>
                                            )
                                        } else {
                                            return (
                                                <div className="text-center p-10">
                                                    <p className="text-white/40 mb-4 font-serif italic text-lg">Contenuto non incorporabile direttamente.</p>
                                                    <a 
                                                        href={selectedMedia.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs"
                                                    >
                                                        Visualizza su {selectedMedia.url.includes('instagram') ? 'Instagram' : 'Sorgente'} <ChevronRight className="size-4" />
                                                    </a>
                                                </div>
                                            )
                                        }
                                    })()
                                )}
                            </div>
                            
                            <div className="p-6 md:p-8 bg-zinc-900/50 backdrop-blur-md border-t border-white/5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: selectedMedia.type === "PHOTO" ? THEME.secondary : selectedMedia.type === "INTERVIEW" ? THEME.primary : THEME.accent, color: "#18182e" }}>
                                                {selectedMedia.type}
                                            </span>
                                            {selectedMedia.personName && (
                                                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                                    Intervista a: <span className="text-white">{selectedMedia.personName}</span>
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{selectedMedia.title}</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {selectedMedia.url && (
                                            <a 
                                                href={selectedMedia.url} 
                                                download 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-6 py-3 bg-[#f9a620] text-[#18182e] rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#e89a1c] transition-all shadow-lg shadow-amber-900/20"
                                            >
                                                <Download className="size-4" /> Scarica File
                                            </a>
                                        )}
                                        <div className="text-white/60 text-sm max-w-md font-serif italic leading-relaxed">
                                            {selectedMedia.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
