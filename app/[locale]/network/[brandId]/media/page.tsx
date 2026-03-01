"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Play, Camera, Mic2, ChevronRight } from "lucide-react"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

const TABS = ["Esibizioni", "Interviste", "Foto"] as const
type Tab = typeof TABS[number]

// ── PLACEHOLDER DATA ──────────────────────────────────────────────────────────

const ESIBIZIONI = [
    { id: 1, title: "Artista 1 – Live Set", duration: "4:32", image: "/assets/slides/1.jpg", desc: "La straordinaria performance dell'headliner della serata." },
    { id: 2, title: "Artista 3 – Danza Contemporanea", duration: "6:10", image: "/assets/slides/2.jpg", desc: "Il racconto in movimento della compagnia di danza." },
    { id: 3, title: "Artista 4 – Acoustic Set", duration: "3:48", image: "/assets/slides/3.jpg", desc: "Un momento intimo e toccante davanti a migliaia di spettatori." },
    { id: 4, title: "Finale – Premiazioni", duration: "8:22", image: "/assets/slides/4.jpg", desc: "La cerimonia di premiazione dei contest con tutti gli artisti sul palco." },
]

const INTERVISTE = [
    { id: 1, person: "Artista 1", role: "Headliner", image: "/assets/slides/1.jpg", quote: "Esibirsi alla Piazza dell'Arte è un sogno che diventa realtà. L'energia del pubblico è unica." },
    { id: 2, person: "Artista 6", role: "Special Guest", image: "/assets/slides/2.jpg", quote: "Ogni anno questo evento cresce. È la dimostrazione che i giovani hanno tantissimo da dire." },
    { id: 3, person: "Organizzatori", role: "Morgana & O.R.U.M.", image: "/assets/slides/3.jpg", quote: "La Piazza dell'Arte nasce dal desiderio di aprire l'università alla città, offrendo spazio a chi ha talento." },
]

const FOTO_GALLERIES = [
    { id: 1, image: "/assets/slides/1.jpg", label: "Palco principale" },
    { id: 2, image: "/assets/slides/2.jpg", label: "Cortile Centrale" },
    { id: 3, image: "/assets/slides/3.jpg", label: "Laboratori artistici" },
    { id: 4, image: "/assets/slides/4.jpg", label: "Pubblico" },
    { id: 5, image: "/assets/slides/1.jpg", label: "Contest fotografia" },
    { id: 6, image: "/assets/slides/2.jpg", label: "Backstage" },
    { id: 7, image: "/assets/slides/3.jpg", label: "Premiazioni" },
    { id: 8, image: "/assets/slides/4.jpg", label: "Mattino – Estemporanee" },
    { id: 9, image: "/assets/slides/1.jpg", label: "Scalinata del Rettorato" },
]

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function MediaPage() {
    const [activeTab, setActiveTab] = useState<Tab>("Esibizioni")

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
                        Rivivivi i momenti più belli della Piazza dell&apos;Arte: esibizioni, interviste esclusive e la galleria fotografica.
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
                            {ESIBIZIONI.map((video) => (
                                <div key={video.id} className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer">
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video">
                                        <Image src={video.image} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                        {/* Play button */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="size-16 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300"
                                                style={{ backgroundColor: THEME.accent }}
                                            >
                                                <Play className="size-7 fill-[#18182e] text-[#18182e] ml-1" />
                                            </div>
                                        </div>
                                        {/* Duration badge */}
                                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-lg">
                                            {video.duration}
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-6">
                                        <h3 className="font-black text-lg uppercase tracking-wide mb-2 group-hover:text-[#1fbcd3] transition-colors">{video.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed">{video.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── INTERVISTE ── */}
                    {activeTab === "Interviste" && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {INTERVISTE.map((item) => (
                                <div key={item.id} className="group flex gap-6 p-7 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer">
                                    {/* Avatar */}
                                    <div className="relative shrink-0 size-20 md:size-24 rounded-2xl overflow-hidden bg-zinc-800 ring-2 ring-white/10">
                                        <Image src={item.image} alt={item.person} fill className="object-cover" />
                                    </div>
                                    {/* Quote */}
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-3">
                                            <strong className="block text-white font-black text-lg">{item.person}</strong>
                                            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: THEME.primary }}>{item.role}</span>
                                        </div>
                                        <p className="text-white/70 leading-relaxed italic text-base">
                                            &ldquo;{item.quote}&rdquo;
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 mt-4 text-xs font-black uppercase tracking-widest transition-colors group-hover:text-white text-white/40">
                                            Guarda l&apos;intervista <ChevronRight className="size-4" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── FOTO ── */}
                    {activeTab === "Foto" && (
                        <div className="columns-2 md:columns-3 gap-4 space-y-4">
                            {FOTO_GALLERIES.map((foto) => (
                                <div key={foto.id} className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-zinc-800 cursor-pointer">
                                    <div className="relative">
                                        <Image
                                            src={foto.image}
                                            alt={foto.label}
                                            width={600}
                                            height={400}
                                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-5">
                                            <span className="text-white text-sm font-bold uppercase tracking-widest">{foto.label}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </section>
        </div>
    )
}
