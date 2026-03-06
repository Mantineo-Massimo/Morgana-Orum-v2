"use client"

import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { ArrowLeft, Play, Camera, Mic2, ChevronRight } from "lucide-react"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

const TABS = ["Esibizioni", "Interviste", "Foto"] as const
type Tab = typeof TABS[number]

interface Props {
    media: any[]
}

export function MediaClient({ media }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("Esibizioni")

    const esibizioni = media.filter(m => m.type === "VIDEO")
    const interviste = media.filter(m => m.type === "INTERVIEW")
    const foto = media.filter(m => m.type === "PHOTO")

    const TAB_ICONS: Record<Tab, any> = {
        "Esibizioni": Play,
        "Interviste": Mic2,
        "Foto": Camera,
    }

    const TAB_COLORS: Record<Tab, string> = {
        "Esibizioni": THEME.accent,
        "Interviste": THEME.primary,
        "Foto": THEME.secondary,
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
                        href="/network/piazzadellarte"
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

                    {/* ── ESIBIZIONI ── */}
                    {activeTab === "Esibizioni" && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {esibizioni.map((video) => (
                                <div key={video.id} className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
                                    <div className="relative aspect-video">
                                        <Image src={video.thumbnail || "/assets/slides/1.jpg"} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="size-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: THEME.accent }}>
                                                <Play className="size-7 fill-[#18182e] text-[#18182e] ml-1" />
                                            </div>
                                        </div>
                                        {video.duration && (
                                            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                                                {video.duration}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-black text-lg uppercase tracking-wide mb-2 group-hover:text-[#1fbcd3] transition-colors">{video.title}</h3>
                                        {video.description && <p className="text-white/60 text-sm leading-relaxed">{video.description}</p>}
                                    </div>
                                </div>
                            ))}
                            {esibizioni.length === 0 && <p className="col-span-2 text-center text-white/40 py-20 font-serif">Nessuna esibizione disponibile.</p>}
                        </div>
                    )}

                    {/* ── INTERVISTE ── */}
                    {activeTab === "Interviste" && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {interviste.map((item) => (
                                <div key={item.id} className="group flex gap-6 p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                                    <div className="relative shrink-0 size-20 md:size-24 rounded-2xl overflow-hidden bg-zinc-800 ring-2 ring-white/10">
                                        <Image src={item.thumbnail || "/assets/slides/1.jpg"} alt={item.personName} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-3">
                                            <strong className="block text-white font-black text-lg">{item.personName}</strong>
                                            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: THEME.primary }}>{item.personRole}</span>
                                        </div>
                                        <p className="text-white/70 leading-relaxed italic text-base">
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
                        <div className="columns-2 md:columns-3 gap-4 space-y-4">
                            {foto.map((f) => (
                                <div key={f.id} className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer">
                                    <div className="relative">
                                        <Image
                                            src={f.thumbnail || f.url || "/assets/slides/1.jpg"}
                                            alt={f.title}
                                            width={600}
                                            height={400}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                                            <span className="text-white text-sm font-bold uppercase tracking-widest">{f.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {foto.length === 0 && <p className="col-span-full text-center text-white/40 py-20 font-serif">Nessuna foto disponibile.</p>}
                        </div>
                    )}

                </div>
            </section>
        </div>
    )
}
