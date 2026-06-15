"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Users, Award, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

type Member = {
    name: string
    role: string
    email?: string | null
}

type Structure = {
    presidency: Member[]
    board: Member[]
    departments: { name: string; coordinator: string }[]
}

interface OrganigrammaClientProps {
    initialMembers: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Organigramma",
        subtitle: "I componenti del direttivo, i coordinatori dei dipartimenti e la struttura organizzativa interna delle nostre associazioni.",
        tabMorgana: "Associazione Morgana",
        tabOrum: "O.R.U.M.",
        presidency: "Presidenza",
        board: "Consiglio Direttivo",
        departments: "Dipartimenti & Aree",
        coordinator: "Coordinatore"
    },
    en: {
        title: "Organization Chart",
        subtitle: "The members of the executive board, department coordinators, and internal organizational structure of our associations.",
        tabMorgana: "Morgana Association",
        tabOrum: "O.R.U.M.",
        presidency: "Presidency",
        board: "Executive Board",
        departments: "Departments & Areas",
        coordinator: "Coordinator"
    }
}

export function OrganigrammaClient({ initialMembers, locale }: OrganigrammaClientProps) {
    const [activeTab, setActiveTab] = useState<"morgana" | "orum">("morgana")
    const isMorgana = activeTab === "morgana"
    
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    // Helper to extract structure from database members
    const getRole = (m: any) => (locale === "en" && m.roleEn) ? m.roleEn : m.role

    const assocMembers = initialMembers.filter(
        m => m.association.toUpperCase() === activeTab.toUpperCase()
    )

    const presidency = assocMembers
        .filter(m => m.section === "PRESIDENCY")
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(m => ({ name: m.name, role: getRole(m), email: m.email }))

    const board = assocMembers
        .filter(m => m.section === "BOARD")
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(m => ({ name: m.name, role: getRole(m), email: m.email }))

    const departments = assocMembers
        .filter(m => m.section === "DEPARTMENT")
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(m => ({ name: getRole(m), coordinator: m.name }))

    const current: Structure = { presidency, board, departments }

    const brandColor = isMorgana ? "text-[#c12830]" : "text-[#18182e]"
    const bgBrandColor = isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
    const shadowColor = isMorgana ? "shadow-red-500/10" : "shadow-blue-900/10"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 mb-6 uppercase tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        {t.subtitle}
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
                        {t.tabMorgana}
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
                        {t.tabOrum}
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
                        {current.presidency.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 justify-center">
                                    <Shield className={cn("size-6", brandColor)} />
                                    <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                        {t.presidency}
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
                        )}

                        {/* 2. Board Section */}
                        {current.board.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 justify-center">
                                    <Users className={cn("size-6", brandColor)} />
                                    <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                        {t.board}
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
                        )}

                        {/* 3. Departments Section */}
                        {current.departments.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 justify-center">
                                    <Award className={cn("size-6", brandColor)} />
                                    <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                        {t.departments}
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                    {current.departments.map((dept) => (
                                        <div
                                            key={dept.name}
                                            className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow text-left"
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-2">{dept.name}</span>
                                            <h3 className="text-lg font-bold text-zinc-900 mb-1">{t.coordinator}</h3>
                                            <p className="text-sm font-semibold text-zinc-600">{dept.coordinator}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
