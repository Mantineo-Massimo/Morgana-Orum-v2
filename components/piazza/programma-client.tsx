"use client"

import { Sun, Sunset, Music, Palette, Users, Camera, Trophy, Mic2, Star } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

const ICONS: Record<string, any> = {
    Sun, Sunset, Music, Palette, Users, Camera, Trophy, Mic2, Star
}

interface Props {
    program: any[]
}

export function ProgrammaClient({ program }: Props) {
    const morningItems = program.filter(p => p.timeSlot === "Mattino")
    const afternoonItems = program.filter(p => p.timeSlot === "Pomeriggio")
    const eveningItems = program.filter(p => p.timeSlot === "Sera")

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* HERO */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: THEME.primary }}></div>
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{ backgroundColor: THEME.accent }}></div>
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
                        Il <span style={{ color: THEME.primary }}>Programma</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-serif leading-relaxed">
                        Una giornata intera dedicata all&apos;arte, alla cultura e alla musica. Scopri tutti gli appuntamenti della Piazza dell&apos;Arte.
                    </p>
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full" style={{ backgroundColor: THEME.accent }}></div>
                </div>
            </section>

            {/* TIMELINE SECTIONS */}
            <section className="pb-24">
                <div className="container max-w-5xl mx-auto space-y-16">

                    {/* ── MATTINO ── */}
                    {morningItems.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.primary, color: "#18182e" }}>
                                    <Sun className="size-5" />
                                    Mattino
                                </div>
                                <span className="text-white/40 text-sm font-bold tracking-widest">09:00 — 13:00</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.primary }}>
                                {morningItems.map((item: any) => {
                                    const Icon = ICONS[item.icon] || Palette
                                    return (
                                        <div key={item.id} className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.primary}25` }}>
                                                    <Icon className="size-5" style={{ color: THEME.primary }} />
                                                </div>
                                                <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.primary }}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-white/70 leading-relaxed">
                                                {item.description}
                                            </p>
                                            {(item.startTime || item.endTime) && (
                                                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                                    {item.startTime} {item.endTime && `— ${item.endTime}`}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── POMERIGGIO ── */}
                    {afternoonItems.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.secondary, color: "#fff" }}>
                                    <Sunset className="size-5" />
                                    Pomeriggio
                                </div>
                                <span className="text-white/40 text-sm font-bold tracking-widest">14:00 — 19:00</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.secondary }}>
                                {afternoonItems.map((item: any) => {
                                    const Icon = ICONS[item.icon] || Palette
                                    return (
                                        <div key={item.id} className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.secondary}25` }}>
                                                    <Icon className="size-5" style={{ color: THEME.secondary }} />
                                                </div>
                                                <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.secondary }}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-white/70 leading-relaxed">
                                                {item.description}
                                            </p>
                                            {(item.startTime || item.endTime) && (
                                                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                                    {item.startTime} {item.endTime && `— ${item.endTime}`}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── SERA ── */}
                    {eveningItems.length > 0 && (
                        <div className="relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.accent, color: "#18182e" }}>
                                    <Music className="size-5" />
                                    Sera
                                </div>
                                <span className="text-white/40 text-sm font-bold tracking-widest">20:00 — Fine</span>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.accent }}>
                                {eveningItems.map((item: any) => {
                                    const Icon = ICONS[item.icon] || Music
                                    return (
                                        <div key={item.id} className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.accent}25` }}>
                                                    <Icon className="size-5" style={{ color: THEME.accent }} />
                                                </div>
                                                <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.accent }}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-white/70 leading-relaxed">
                                                {item.description}
                                            </p>
                                            {(item.startTime || item.endTime) && (
                                                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                                    {item.startTime} {item.endTime && `— ${item.endTime}`}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {program.length === 0 && (
                        <div className="text-center py-20 text-white/40">
                            <p className="text-lg">Programma in fase di definizione. Torna a trovarci presto!</p>
                        </div>
                    )}

                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-white/10">
                <div className="container text-center">
                    <p className="text-white/60 mb-6 text-lg font-serif">Vuoi esibirti o partecipare?</p>
                    <Link
                        href="/network/piazzadellarte/artisti"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                        style={{ backgroundColor: THEME.primary, color: "#18182e" }}
                    >
                        Scopri gli Artisti
                    </Link>
                </div>
            </section>
        </div>
    )
}
