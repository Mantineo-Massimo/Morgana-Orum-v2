"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Users, Award, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganigrammaClientProps {
    initialMembers: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Organigramma",
        subtitle: "I componenti del direttivo, i coordinatori dei dipartimenti e la struttura organizzativa interna delle nostre associazioni.",
        tabAree: "Aree dell'Associazione",
        tabDipartimenti: "Responsabili di Dipartimento",
        presidency: "Presidenza",
        board: "Consiglio Direttivo",
        departments: "Dipartimenti & Aree",
        coordinator: "Coordinatore"
    },
    en: {
        title: "Organization Chart",
        subtitle: "The members of the executive board, department coordinators, and internal organizational structure of our associations.",
        tabAree: "Association Areas",
        tabDipartimenti: "Department Managers",
        presidency: "Presidency",
        board: "Executive Board",
        departments: "Departments & Areas",
        coordinator: "Coordinator"
    }
}

export function OrganigrammaClient({ initialMembers, locale }: OrganigrammaClientProps) {
    const [activeTab, setActiveTab] = useState<"aree" | "dipartimenti">("aree")
    const isAree = activeTab === "aree"
    
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    // Helper to extract structure from database members
    const getRole = (m: any) => (locale === "en" && m.roleEn) ? m.roleEn : m.role

    const presidency = initialMembers
        .filter(m => m.section === "PRESIDENCY")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const board = initialMembers
        .filter(m => m.section === "BOARD")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const departments = initialMembers
        .filter(m => m.section === "DEPARTMENT")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const brandColor = "text-[#18182e]"
    const bgBrandColor = "bg-[#18182e]"
    const shadowColor = "shadow-blue-900/10"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 mb-6 uppercase tracking-tight bg-gradient-to-r from-[#c9041a] to-[#18182e] bg-clip-text text-transparent">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        {t.subtitle}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 max-w-xl mx-auto">
                    <button
                        onClick={() => setActiveTab("aree")}
                        className={cn(
                            "w-full px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border",
                            isAree
                                ? "bg-gradient-to-r from-[#c9041a] to-[#18182e] text-white shadow-lg shadow-red-500/20 scale-105 border-transparent"
                                : "bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        {t.tabAree}
                    </button>
                    <button
                        onClick={() => setActiveTab("dipartimenti")}
                        className={cn(
                            "w-full px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border",
                            !isAree
                                ? "bg-gradient-to-r from-[#c9041a] to-[#18182e] text-white shadow-lg shadow-red-500/20 scale-105 border-transparent"
                                : "bg-white text-zinc-400 border-zinc-200 hover:bg-zinc-50"
                        )}
                    >
                        {t.tabDipartimenti}
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
                        {isAree ? (
                            <>
                                {/* 1. Presidency Section */}
                                {presidency.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Shield className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.presidency}
                                            </h2>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                            {presidency.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className={cn(
                                                        "bg-white p-8 rounded-3xl border border-zinc-150/60 shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center",
                                                        shadowColor
                                                    )}
                                                >
                                                    {m.association === "MORGANA" ? (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-3 py-1 bg-red-50 text-[#c9041a] rounded-full border border-red-100/50 mb-6">
                                                            Associazione Morgana
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-3 py-1 bg-blue-50 text-[#18182e] rounded-full border border-blue-100/50 mb-6">
                                                            O.R.U.M.
                                                        </span>
                                                    )}

                                                    <div className={cn("size-16 rounded-2xl flex items-center justify-center text-white mb-6 font-serif text-2xl font-black", m.association === "MORGANA" ? "bg-[#c9041a]" : "bg-[#18182e]")}>
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-zinc-900 mb-1">{m.name}</h3>
                                                    <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">{getRole(m)}</p>
                                                    {m.email && (
                                                        <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                                                            <Mail className="size-3.5" /> {m.email}
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Board Section */}
                                {board.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Users className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.board}
                                            </h2>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                            {board.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="bg-white p-6 rounded-3xl border border-zinc-150/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                                >
                                                    {m.association === "MORGANA" ? (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-red-50 text-[#c9041a] rounded-full border border-red-100/55 mb-4">
                                                            Morgana
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-blue-50 text-[#18182e] rounded-full border border-blue-100/55 mb-4">
                                                            O.R.U.M.
                                                        </span>
                                                    )}

                                                    <div className="size-12 rounded-xl bg-zinc-50 text-zinc-650 flex items-center justify-center mb-4 font-serif text-lg font-black border border-zinc-100">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <h3 className="font-bold text-zinc-900 mb-1">{m.name}</h3>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{getRole(m)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* 3. Departments Section */
                            departments.length > 0 && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 justify-center">
                                        <Award className={cn("size-6", brandColor)} />
                                        <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                            {t.departments}
                                        </h2>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                        {departments.map((m) => (
                                            <div
                                                key={m.id}
                                                className="bg-white p-6 rounded-3xl border border-zinc-150/60 shadow-sm hover:shadow-md transition-shadow text-left flex flex-col justify-between"
                                            >
                                                <div>
                                                    {m.association === "MORGANA" ? (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-red-50 text-[#c9041a] rounded-full border border-red-100/55 mb-4">
                                                            Morgana
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block text-[9px] font-black tracking-widest uppercase px-2 py-0.5 bg-blue-50 text-[#18182e] rounded-full border border-blue-100/55 mb-4">
                                                            O.R.U.M.
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">{getRole(m)}</span>
                                                    <h3 className="text-lg font-bold text-zinc-900 mb-1">{t.coordinator}</h3>
                                                    <p className="text-sm font-semibold text-zinc-650">{m.name}</p>
                                                </div>
                                                {m.email && (
                                                    <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 mt-4 transition-colors flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 w-fit">
                                                        <Mail className="size-3.5" /> {m.email}
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
