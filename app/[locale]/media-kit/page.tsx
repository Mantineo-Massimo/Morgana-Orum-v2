"use client"

import { FileDown, Image as ImageIcon, Paintbrush, FileText, Check } from "lucide-react"

export const dynamic = "force-dynamic"

export default function MediaKitPage() {
    const brandColors = [
        { name: "Morgana Red", hex: "#c12830", desc: "Colore primario di Associazione Morgana" },
        { name: "Orum Blue", hex: "#18182e", desc: "Colore primario di Associazione O.R.U.M." },
        { name: "Piazza Gold", hex: "#f9a620", desc: "Colore primario di Piazza dell'Arte (Oro)" },
        { name: "Piazza Green", hex: "#27a85d", desc: "Colore secondario di Piazza dell'Arte" },
        { name: "Piazza Cyan", hex: "#1fbcd3", desc: "Colore d'accento di Piazza dell'Arte" }
    ]

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <FileDown className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        Media Kit
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        Loghi ufficiali, codici colore, tipografia e risorse grafiche per la stampa, sponsor, partner e rappresentanti.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* 1. Assets Downloads */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-wider text-zinc-800 font-serif">Loghi Ufficiali</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Morgana */}
                            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="h-24 flex items-center justify-center mb-6 bg-zinc-50 rounded-2xl border border-zinc-100 p-4">
                                        <span className="font-serif font-black text-xl text-[#c12830]">MORGANA LOGO</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Logo Associazione Morgana</h3>
                                    <p className="text-sm text-zinc-500 mb-6 font-medium">Disponibile nei formati vettoriale (SVG) e raster ad alta risoluzione (PNG).</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                                        Scarica SVG
                                    </button>
                                    <button className="flex-1 py-3 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                                        Scarica PNG
                                    </button>
                                </div>
                            </div>
                            {/* ORUM */}
                            <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="h-24 flex items-center justify-center mb-6 bg-zinc-50 rounded-2xl border border-zinc-100 p-4">
                                        <span className="font-serif font-black text-xl text-[#18182e]">O.R.U.M. LOGO</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Logo Associazione O.R.U.M.</h3>
                                    <p className="text-sm text-zinc-500 mb-6 font-medium">Disponibile nei formati vettoriale (SVG) e raster ad alta risoluzione (PNG).</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                                        Scarica SVG
                                    </button>
                                    <button className="flex-1 py-3 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                                        Scarica PNG
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Color Palette */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Paintbrush className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-wider text-zinc-800 font-serif">Tavolozza Colori</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {brandColors.map((color) => (
                                <div key={color.name} className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm text-center">
                                    <div
                                        className="w-full aspect-square rounded-2xl mb-4 shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                    ></div>
                                    <h3 className="font-bold text-zinc-900 leading-tight mb-1 text-sm">{color.name}</h3>
                                    <span className="font-mono text-xs font-black text-zinc-400 block mb-2">{color.hex}</span>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-tight">{color.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Typography & Guidelines */}
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
                                <FileText className="size-3.5 text-primary" /> Linee Guida
                            </div>
                            <h3 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tighter leading-none">Linee Guida del Brand</h3>
                            <p className="text-white/60 text-sm max-w-xl">
                                Scopri come combinare font, loghi e colori per creare materiali coerenti con l&apos;identità di Morgana e O.R.U.M.
                            </p>
                        </div>
                        <button className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shrink-0">
                            <Check className="size-4" /> Scarica Guida (.PDF)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
