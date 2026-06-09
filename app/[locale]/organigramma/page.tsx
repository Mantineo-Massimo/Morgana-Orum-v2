"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Users, Award, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

type Member = {
    name: string
    role: string
    email?: string
}

type Structure = {
    presidency: Member[]
    board: Member[]
    departments: { name: string; coordinator: string }[]
}

const MORGANA_STRUCTURE: Structure = {
    presidency: [
        { name: "Francesco Salvo", role: "Presidente", email: "presidenza.morgana@gmail.com" },
        { name: "Elena Crisafulli", role: "Vice Presidente", email: "vicepresidenza.morgana@gmail.com" }
    ],
    board: [
        { name: "Alessandro Trimarchi", role: "Segretario Generale" },
        { name: "Sofia D'Amico", role: "Tesoriere" },
        { name: "Valerio Puglisi", role: "Coordinatore Rappresentanti" }
    ],
    departments: [
        { name: "Dipartimento Attività Culturali", coordinator: "Giorgio Messina" },
        { name: "Dipartimento Comunicazione & Web", coordinator: "Marta Alibrandi" },
        { name: "Dipartimento Orientamento Matricole", coordinator: "Claudio Vinci" }
    ]
}

const ORUM_STRUCTURE: Structure = {
    presidency: [
        { name: "Giuseppe Campolo", role: "Presidente", email: "presidenza.orum@gmail.com" },
        { name: "Federica Smiroldo", role: "Vice Presidente", email: "vicepresidenza.orum@gmail.com" }
    ],
    board: [
        { name: "Domenico Barbaro", role: "Segretario" },
        { name: "Chiara Ruggeri", role: "Tesoriere" },
        { name: "Matteo Pappalardo", role: "Responsabile Organizzativo" }
    ],
    departments: [
        { name: "Dipartimento Didattica & Diritto allo Studio", coordinator: "Simona Castorina" },
        { name: "Dipartimento Grafica & Social Media", coordinator: "Luca Arena" },
        { name: "Dipartimento Relazioni Esterne & Convenzioni", coordinator: "Antonio Bruno" }
    ]
}

export default function OrganigrammaPage() {
    const [activeTab, setActiveTab] = useState<"morgana" | "orum">("morgana")
    const isMorgana = activeTab === "morgana"
    const current = isMorgana ? MORGANA_STRUCTURE : ORUM_STRUCTURE

    const brandColor = isMorgana ? "text-[#c12830]" : "text-[#18182e]"
    const bgBrandColor = isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
    const shadowColor = isMorgana ? "shadow-red-500/10" : "shadow-blue-900/10"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 mb-6 uppercase tracking-tight">
                        Organigramma
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        I componenti del direttivo, i coordinatori dei dipartimenti e la struttura organizzativa interna delle nostre associazioni.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center gap-4 mb-16">
                    <button
                        onClick={() => setActiveTab("morgana")}
                        className={cn(
                            "px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            isMorgana
                                ? "bg-[#c12830] text-white shadow-lg shadow-red-500/30 scale-105"
                                : "bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        Associazione Morgana
                    </button>
                    <button
                        onClick={() => setActiveTab("orum")}
                        className={cn(
                            "px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300",
                            !isMorgana
                                ? "bg-[#18182e] text-white shadow-lg shadow-blue-900/30 scale-105"
                                : "bg-white text-zinc-400 border border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        O.R.U.M.
                    </button>
                </div>

                {/* Structure Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-16"
                    >
                        {/* 1. Presidency Section */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 justify-center">
                                <Shield className={cn("size-6", brandColor)} />
                                <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                    Presidenza
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {current.presidency.map((m) => (
                                    <div
                                        key={m.name}
                                        className={cn(
                                            "bg-white p-8 rounded-3xl border border-zinc-100 shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center",
                                            shadowColor
                                        )}
                                    >
                                        <div className={cn("size-16 rounded-2xl flex items-center justify-center text-white mb-6 font-serif text-2xl font-black", bgBrandColor)}>
                                            {m.name.charAt(0)}
                                        </div>
                                        <h3 className="text-xl font-bold text-zinc-900 mb-1">{m.name}</h3>
                                        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">{m.role}</p>
                                        {m.email && (
                                            <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                                                <Mail className="size-3.5" /> {m.email}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Board Section */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 justify-center">
                                <Users className={cn("size-6", brandColor)} />
                                <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                    Consiglio Direttivo
                                </h2>
                            </div>
                            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {current.board.map((m) => (
                                    <div
                                        key={m.name}
                                        className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                    >
                                        <div className="size-12 rounded-xl bg-zinc-50 text-zinc-600 flex items-center justify-center mb-4 font-serif text-lg font-black border border-zinc-100">
                                            {m.name.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-zinc-900 mb-1">{m.name}</h3>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{m.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Departments Section */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 justify-center">
                                <Award className={cn("size-6", brandColor)} />
                                <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                    Dipartimenti & Aree
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {current.departments.map((dept) => (
                                    <div
                                        key={dept.name}
                                        className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow text-left"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">{dept.name}</span>
                                        <h3 className="text-lg font-bold text-zinc-900 mb-1">Coordinatore</h3>
                                        <p className="text-sm font-semibold text-zinc-600">{dept.coordinator}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
