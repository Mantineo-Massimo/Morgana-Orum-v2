"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, Mail, MapPin, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrganigrammaClientProps {
    initialMembers: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Organigramma",
        subtitle: "La struttura organizzativa interna, i coordinatori delle aree e i responsabili d'ateneo delle nostre associazioni.",
        tabAree: "Aree dell'Associazione",
        tabDipartimenti: "Responsabili d'Ateneo",
        coordinators: "Coordinatori",
        responsibles: "Responsabili",
        departments: "Responsabili di Dipartimento",
        filterDepartment: "Filtra per Dipartimento",
        allDepartments: "Tutti i Dipartimenti",
        noMembers: "Nessun rappresentante trovato per questo dipartimento."
    },
    en: {
        title: "Organization Chart",
        subtitle: "The internal organizational structure, area coordinators, and university managers of our associations.",
        tabAree: "Association Areas",
        tabDipartimenti: "University Managers",
        coordinators: "Coordinators",
        responsibles: "Managers",
        departments: "Department Managers",
        filterDepartment: "Filter by Department",
        allDepartments: "All Departments",
        noMembers: "No representatives found for this department."
    }
}

const DEPARTMENTS = [
    "Dipartimento Civiltà Antiche e Moderne (DICAM)",
    "Dipartimento di Economia",
    "Dipartimento di Giurisprudenza",
    "Dipartimento di Ingegneria",
    "Dipartimento Medicina Clinica e Sperimentale (DIMED)",
    "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva",
    "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)",
    "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)",
    "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)",
    "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)",
    "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)",
    "Dipartimento Scienze Veterinarie (VET)"
]


export function OrganigrammaClient({ initialMembers, locale }: OrganigrammaClientProps) {
    const [activeTab, setActiveTab] = useState<"aree" | "ateneo">("aree")
    const [selectedDept, setSelectedDept] = useState<string>("all")
    const isAree = activeTab === "aree"
    
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    // Helper to extract structure from database members
    const getRole = (m: any) => (locale === "en" && m.roleEn) ? m.roleEn : m.role

    // Filter Aree dell'Associazione (Tab 1)
    const coordinators = initialMembers
        .filter(m => m.section === "COORDINATOR")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const responsibles = initialMembers
        .filter(m => m.section === "RESPONSIBLE")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    // Filter Responsabili d'Ateneo (Tab 2)
    const departments = initialMembers
        .filter(m => m.section === "DEPARTMENT" && (selectedDept === "all" || m.role === selectedDept))
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const brandColor = "text-[#18182e]"

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
                        onClick={() => setActiveTab("ateneo")}
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
                            <div className="space-y-16 w-full">
                                {/* 1. Coordinators Section */}
                                {coordinators.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Award className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.coordinators}
                                            </h2>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                            {coordinators.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="bg-white p-6 rounded-3xl border border-zinc-150/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                                >
                                                    <div className="size-12 rounded-xl bg-zinc-50 text-zinc-650 flex items-center justify-center mb-4 font-serif text-lg font-black border border-zinc-100">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <h3 className="font-bold text-zinc-900 mb-1">{m.name}</h3>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{getRole(m)}</p>
                                                    {m.email && (
                                                        <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 w-fit">
                                                            <Mail className="size-3.5" /> {m.email}
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Responsibles Section */}
                                {responsibles.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 justify-center">
                                            <Award className={cn("size-6", brandColor)} />
                                            <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                                {t.responsibles}
                                            </h2>
                                        </div>
                                        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                            {responsibles.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="bg-white p-6 rounded-3xl border border-zinc-150/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                                >
                                                    <div className="size-12 rounded-xl bg-zinc-50 text-zinc-650 flex items-center justify-center mb-4 font-serif text-lg font-black border border-zinc-100">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <h3 className="font-bold text-zinc-900 mb-1">{m.name}</h3>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{getRole(m)}</p>
                                                    {m.email && (
                                                        <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 w-fit">
                                                            <Mail className="size-3.5" /> {m.email}
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12 w-full">
                                {/* Department selector */}
                                <div className="max-w-md mx-auto bg-white p-6 rounded-[2rem] border border-zinc-250/50 shadow-sm flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">{t.filterDepartment}</label>
                                    <select
                                        value={selectedDept}
                                        onChange={e => setSelectedDept(e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200/50 rounded-2xl outline-none font-bold text-xs uppercase tracking-wider text-zinc-800 cursor-pointer"
                                    >
                                        <option value="all">{t.allDepartments}</option>
                                        {DEPARTMENTS.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* 3. Departments Section */}
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 justify-center">
                                        <BookOpen className={cn("size-6", brandColor)} />
                                        <h2 className="text-2xl font-serif font-black uppercase tracking-wider text-zinc-800">
                                            {t.departments}
                                        </h2>
                                    </div>
                                    {departments.length > 0 ? (
                                        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                            {departments.map((m) => (
                                                <div
                                                    key={m.id}
                                                    className="bg-white p-6 rounded-3xl border border-zinc-150/60 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center"
                                                >
                                                    <div className="size-12 rounded-xl bg-zinc-50 text-zinc-650 flex items-center justify-center mb-4 font-serif text-lg font-black border border-zinc-100">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <h3 className="font-bold text-zinc-900 mb-1">{m.name}</h3>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{getRole(m)}</p>
                                                    {m.email && (
                                                        <a href={`mailto:${m.email}`} className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 w-fit">
                                                            <Mail className="size-3.5" /> {m.email}
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-3xl border border-zinc-150/60 max-w-2xl mx-auto p-8 shadow-sm">
                                            <p className="text-sm font-bold text-zinc-450 italic">{t.noMembers}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
