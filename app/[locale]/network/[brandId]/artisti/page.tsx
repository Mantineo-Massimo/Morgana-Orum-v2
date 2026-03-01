"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Mic2, Music, Star, Palette, Users, Play, Search, X } from "lucide-react"

// ── ARTISTI DATA ─────────────────────────────────────────────────────────────
const CATEGORIES = ["Tutti", "Musica", "Danza", "Pittura", "Performance"] as const
type Category = typeof CATEGORIES[number]

const ARTISTS: {
    id: number
    name: string
    role: string
    category: Category
    bio: string
    image: string
    badge?: string
}[] = [
        {
            id: 1,
            name: "Artista 1",
            role: "Live Band",
            category: "Musica",
            bio: "Una band emergente dal cuore di Messina con sonorità indie-rock che mescola influenze moderne e tradizionali.",
            image: "/assets/slides/1.jpg",
            badge: "Headliner"
        },
        {
            id: 2,
            name: "Artista 2",
            role: "DJ Set",
            category: "Musica",
            bio: "DJ di fama locale con un set elettronico coinvolgente, capace di far ballare migliaia di persone.",
            image: "/assets/slides/2.jpg",
        },
        {
            id: 3,
            name: "Artista 3",
            role: "Danza Contemporanea",
            category: "Danza",
            bio: "Compagnia di danza contemporanea che intreccia movimento e narrazione poetica in spettacoli unici.",
            image: "/assets/slides/3.jpg",
        },
        {
            id: 4,
            name: "Artista 4",
            role: "Acoustic Solo",
            category: "Musica",
            bio: "Singer-songwriter dalla voce potente e testi introspettivi. Un momento acustico di grande emozione.",
            image: "/assets/slides/4.jpg",
        },
        {
            id: 5,
            name: "Artista 5",
            role: "Street Art / Pittura",
            category: "Pittura",
            bio: "Artista visivo specializzato in estemporanee di pittura. Crea opere dal vivo davanti al pubblico.",
            image: "/assets/slides/1.jpg",
        },
        {
            id: 6,
            name: "Artista 6",
            role: "Performance Teatrale",
            category: "Performance",
            bio: "Performer teatrale con spettacoli interattivi che coinvolgono direttamente il pubblico.",
            image: "/assets/slides/2.jpg",
            badge: "Special Guest"
        },
        {
            id: 7,
            name: "Artista 7",
            role: "Hip-Hop",
            category: "Musica",
            bio: "MC e rapper con testi impegnati e un flow incisivo, portavoce della nuova scena underground siciliana.",
            image: "/assets/slides/3.jpg",
        },
        {
            id: 8,
            name: "Artista 8",
            role: "Danza Classica",
            category: "Danza",
            bio: "Ballerino classico formato alla scuola dell'Università di Messina, con esibizioni di tecnica sopraffina.",
            image: "/assets/slides/4.jpg",
        },
    ]

const CATEGORY_ICONS: Record<string, any> = {
    "Musica": Mic2,
    "Danza": Star,
    "Pittura": Palette,
    "Performance": Play,
    "Tutti": Users,
}

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function ArtistiPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("Tutti")
    const [search, setSearch] = useState("")

    const filtered = ARTISTS.filter(a => {
        const matchCat = activeCategory === "Tutti" || a.category === activeCategory
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* HERO */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: THEME.secondary }}></div>
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
                        Gli <span style={{ color: THEME.secondary }}>Artisti</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-serif leading-relaxed">
                        Talenti emergenti dal territorio siciliano e non solo. Scopri chi si esibirà alla Piazza dell&apos;Arte.
                    </p>
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full" style={{ backgroundColor: THEME.secondary }}></div>
                </div>
            </section>

            {/* SEARCH + FILTER */}
            <section className="pb-12">
                <div className="container max-w-3xl mx-auto space-y-5">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-white/40" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cerca per nome o ruolo..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-12 py-4 text-white placeholder:text-white/30 text-base focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="size-5" />
                            </button>
                        )}
                    </div>

                    {/* Category pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((cat) => {
                            const Icon = CATEGORY_ICONS[cat]
                            const active = activeCategory === cat
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 border ${active
                                        ? "text-[#18182e] border-transparent shadow-lg scale-105"
                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                                        }`}
                                    style={active ? { backgroundColor: THEME.primary, borderColor: THEME.primary } : {}}
                                >
                                    <Icon className="size-4" />
                                    {cat}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* RESULTS COUNT */}
            {(search || activeCategory !== "Tutti") && (
                <div className="container pb-4">
                    <p className="text-white/40 text-sm text-center">
                        {filtered.length} artista{filtered.length !== 1 ? "i" : ""} trovati
                    </p>
                </div>
            )}

            {/* ARTISTS GRID */}
            <section className="pb-24">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                        {filtered.map((artist) => (
                            <div key={artist.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-zinc-800 cursor-pointer">
                                <Image
                                    src={artist.image}
                                    alt={artist.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10"></div>

                                {artist.badge && (
                                    <div
                                        className="absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg"
                                        style={{ backgroundColor: THEME.primary, color: "#18182e" }}
                                    >
                                        {artist.badge}
                                    </div>
                                )}

                                <div className="absolute top-4 right-4 z-20 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/20">
                                    {artist.category}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block"
                                        style={{ color: THEME.secondary }}
                                    >
                                        {artist.role}
                                    </span>
                                    <h3 className="text-lg font-black uppercase leading-tight mb-2">{artist.name}</h3>
                                    <p className="text-xs text-white/70 leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500">
                                        {artist.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 text-white/40">
                            <Search className="size-12 mx-auto mb-4 opacity-40" />
                            <p className="text-lg">Nessun artista trovato per &quot;{search}&quot;.</p>
                            <button
                                onClick={() => { setSearch(""); setActiveCategory("Tutti") }}
                                className="mt-4 text-sm underline hover:text-white/70 transition-colors"
                            >
                                Reimposta filtri
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-white/10">
                <div className="container text-center">
                    <p className="text-white/60 mb-2 text-lg font-serif">Sei un artista?</p>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-8" style={{ color: THEME.primary }}>
                        Partecipa anche tu
                    </h2>
                    <Link
                        href="https://fantapiazza.vercel.app"
                        target="_blank"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                        style={{ backgroundColor: THEME.primary, color: "#18182e" }}
                    >
                        Candidati ora
                    </Link>
                </div>
            </section>
        </div>
    )
}
