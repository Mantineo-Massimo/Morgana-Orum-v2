"use client"

import { useState } from "react"
import { Sun, Sunset, Music, Palette, Users, Camera, Trophy, Mic2, Star, Clock, MapPin, Coffee, Ticket, Play, Smile, Heart, Zap, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

const ICONS: Record<string, any> = {
    Sun, Sunset, Music, Palette, Users, Camera, Trophy, Mic2, Star, Coffee, Ticket, Play, Smile, Heart, Zap, ImageIcon
}

interface Props {
    program: any[]
}

export function ProgrammaClient({ program }: Props) {
    const [selectedItem, setSelectedItem] = useState<any>(null)

    const morningItems = program.filter(p => p.timeSlot === "Mattino")
    const afternoonItems = program.filter(p => p.timeSlot === "Pomeriggio")
    const eveningItems = program.filter(p => p.timeSlot === "Sera")

    const renderItem = (item: any, color: string) => {
        const Icon = ICONS[item.icon] || Palette
        return (
            <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}25` }}>
                        <Icon className="size-5" style={{ color: color }} />
                    </div>
                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: color }}>
                        {item.title}
                    </h3>
                </div>
                <p className="text-white/70 leading-relaxed line-clamp-2">
                    {item.description}
                </p>

                <div className="flex items-center gap-4 mt-4">
                    {(item.startTime || item.endTime) && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
                            <Clock className="size-3" /> {item.startTime} {item.endTime && `— ${item.endTime}`}
                        </p>
                    )}
                    {item.location && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
                            <MapPin className="size-3" /> {item.location}
                        </p>
                    )}
                </div>
            </div>
        )
    }

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
                                {morningItems.map(item => renderItem(item, THEME.primary))}
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
                                {afternoonItems.map(item => renderItem(item, THEME.secondary))}
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
                                {eveningItems.map(item => renderItem(item, THEME.accent))}
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

            {/* DETAIL DIALOG */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-zinc-900 rounded-3xl shadow-2xl">
                    <div className="relative pb-12">
                        {/* Background blobs */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20" style={{ backgroundColor: THEME.primary }}></div>
                        </div>

                        <div className="relative z-10 p-8 md:p-12 space-y-8">
                            <DialogHeader>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="size-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${THEME.primary}25` }}>
                                        {selectedItem && (() => {
                                            const Icon = ICONS[selectedItem.icon] || Palette
                                            return <Icon className="size-7" style={{ color: THEME.primary }} />
                                        })()}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
                                        Attività {selectedItem?.timeSlot}
                                    </span>
                                </div>
                                <DialogTitle className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter text-white">
                                    {selectedItem?.title}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5">
                                {(selectedItem?.startTime || selectedItem?.endTime) && (
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                                            <Clock className="size-4" style={{ color: THEME.primary }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-none mb-1">Orario</p>
                                            <p className="text-sm font-bold text-white/80">{selectedItem?.startTime} {selectedItem?.endTime && `— ${selectedItem?.endTime}`}</p>
                                        </div>
                                    </div>
                                )}
                                {selectedItem?.location && (
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                                            <MapPin className="size-4" style={{ color: THEME.accent }} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-none mb-1">Luogo</p>
                                            <p className="text-sm font-bold text-white/80">{selectedItem?.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Descrizione</h4>
                                <p className="text-lg text-white/70 font-serif leading-relaxed italic">
                                    &quot;{selectedItem?.description}&quot;
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:bg-white/10 border border-white/10"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

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
