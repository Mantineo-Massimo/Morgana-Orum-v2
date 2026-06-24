"use client"

import { useState } from "react"
import { Phone, Users, CheckCircle2, AlertCircle, ArrowRight, Search, ArrowLeft, Stethoscope } from "lucide-react"

interface SanitariaClientProps {
    initialGroups: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Gruppi Area Sanitaria",
        subtitle: "Corsi di laurea, bacheche e gruppi di studio ufficiali dedicati all'area medica e alle professioni sanitarie.",
        searchPlaceholder: "Cerca il tuo corso dell'area sanitaria...",
        noGroups: "Nessun corso trovato.",
        backBtn: "Torna a tutti i gruppi",
        officialGroup: "Gruppo Ufficiale Morgana & O.R.U.M.",
        joinGroup: "Entra nel gruppo",
        activeMod: "Moderazione attiva",
        verifiedInfo: "Solo info verificate",
        filterAll: "Tutti i Corsi",
        filterMedicina: "Medicina Generale",
        filterProfessioni: "Professioni Sanitarie",
        semesterAll: "Tutti i Semestri",
        semester1: "1° Semestre",
        semester2: "2° Semestre"
    },
    en: {
        title: "Healthcare Area Groups",
        subtitle: "Official degree courses, boards, and study groups dedicated to the medical and healthcare professions area.",
        searchPlaceholder: "Search your healthcare area course...",
        noGroups: "No courses found.",
        backBtn: "Back to all groups",
        officialGroup: "Official Morgana & O.R.U.M. Group",
        joinGroup: "Join group",
        activeMod: "Active moderation",
        verifiedInfo: "Verified info only",
        filterAll: "All Courses",
        filterMedicina: "General Medicine",
        filterProfessioni: "Healthcare Professions",
        semesterAll: "All Semesters",
        semester1: "1st Semester",
        semester2: "2nd Semester"
    }
}

export function SanitariaClient({ initialGroups, locale }: SanitariaClientProps) {
    const [search, setSearch] = useState("")
    const [selectedSub, setSelectedSub] = useState("ALL")
    const [selectedSem, setSelectedSem] = useState("ALL")

    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const getGroupName = (g: any) => (locale === "en" && g.nameEn) ? g.nameEn : g.name
    const getGroupDesc = (g: any) => (locale === "en" && g.descriptionEn) ? g.descriptionEn : g.description

    // Helper function for subcategory classification (Option A fallback)
    const getGroupSubcategory = (g: any) => {
        if (g.subcategory) return g.subcategory
        const name = g.name.toLowerCase()
        if (name.includes("medicina") || name.includes("odontoiatria") || name.includes("lm41") || name.includes("lm46")) {
            return "MEDICINA"
        }
        if (name.includes("snt") || name.includes("infermieristica") || name.includes("ostetricia") || name.includes("fisioterapia") || name.includes("logopedia") || name.includes("terapia") || name.includes("tecniche") || name.includes("ortottica") || name.includes("riabilitazione")) {
            return "PROFESSIONI_SANITARIE"
        }
        return "ALTRO"
    }

    // Helper function for semester classification (Option A fallback)
    const getGroupSemester = (g: any) => {
        if (g.semester) return g.semester
        return g.name.length % 2 === 0 ? "1" : "2"
    }

    // Filter only academic groups for the Healthcare department
    const allSanitaryGroups = initialGroups.filter(
        g => g.category === "ACADEMIC" &&
        g.department === "Medicina, Professioni Sanitarie e Scienze Motorie" &&
        !g.isGeneral
    )

    // Apply search and classification filters
    const filteredSanitaryGroups = allSanitaryGroups.filter(g => {
        const matchesSearch = getGroupName(g).toLowerCase().includes(search.toLowerCase())
        const matchesSubcategory = selectedSub === "ALL" || getGroupSubcategory(g) === selectedSub
        const matchesSemester = selectedSem === "ALL" || getGroupSemester(g) === selectedSem
        return matchesSearch && matchesSubcategory && matchesSemester
    })

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Back button */}
                <a 
                    href={`/${locale}/gruppi`} 
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-950 font-black text-xs uppercase tracking-widest mb-8 transition-colors group"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                    {t.backBtn}
                </a>

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="size-20 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3 shadow-lg shadow-emerald-500/10">
                        <Stethoscope className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-4 tracking-tight text-foreground uppercase">
                        {t.title}
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-zinc-500 mb-8 italic">
                        {t.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-zinc-500 mb-12">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <CheckCircle2 className="size-4 text-emerald-500" /> {t.activeMod}
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <AlertCircle className="size-4 text-teal-500" /> {t.verifiedInfo}
                        </div>
                    </div>

                    {/* Search and Filters panel */}
                    <div className="space-y-6 max-w-2xl mx-auto">
                        {/* Search bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder={t.searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none text-sm shadow-sm"
                            />
                        </div>

                        {/* Interactive Filters */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {/* Subcategory Selector */}
                            <div className="flex bg-zinc-200/50 p-1 rounded-2xl border border-zinc-200/30 w-full sm:w-auto">
                                <button
                                    onClick={() => setSelectedSub("ALL")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSub === "ALL"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.filterAll}
                                </button>
                                <button
                                    onClick={() => setSelectedSub("MEDICINA")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSub === "MEDICINA"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.filterMedicina}
                                </button>
                                <button
                                    onClick={() => setSelectedSub("PROFESSIONI_SANITARIE")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSub === "PROFESSIONI_SANITARIE"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.filterProfessioni}
                                </button>
                            </div>

                            {/* Semester Selector */}
                            <div className="flex bg-zinc-200/50 p-1 rounded-2xl border border-zinc-200/30 w-full sm:w-auto">
                                <button
                                    onClick={() => setSelectedSem("ALL")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSem === "ALL"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.semesterAll}
                                </button>
                                <button
                                    onClick={() => setSelectedSem("1")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSem === "1"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.semester1}
                                </button>
                                <button
                                    onClick={() => setSelectedSem("2")}
                                    className={`flex-1 sm:flex-initial px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                        selectedSem === "2"
                                            ? "bg-white text-zinc-950 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    {t.semester2}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div>
                    {filteredSanitaryGroups.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200/60 shadow-sm max-w-2xl mx-auto px-6">
                            <Search className="size-16 mx-auto mb-4 text-zinc-300 opacity-50" />
                            <h3 className="text-xl font-bold text-zinc-800 mb-2 font-serif uppercase tracking-tight">{t.noGroups}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSanitaryGroups.map((group, idx) => {
                                const groupName = getGroupName(group)
                                const sub = getGroupSubcategory(group)
                                const sem = getGroupSemester(group)
                                return (
                                    <div key={idx} className="group relative bg-white border border-zinc-150 rounded-3xl p-6 hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between h-full">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full">
                                                    {sub === "MEDICINA" ? t.filterMedicina : t.filterProfessioni}
                                                </span>
                                                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100/50 px-2.5 py-1 rounded-full">
                                                    {sem === "1" ? t.semester1 : t.semester2}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-emerald-600 transition-colors leading-snug font-serif uppercase tracking-tight">
                                                {groupName}
                                            </h3>
                                            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter mb-6">
                                                {t.officialGroup}
                                            </p>
                                        </div>
                                        <a
                                            href={group.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-emerald-500/20"
                                        >
                                            {t.joinGroup} <ArrowRight className="size-4" />
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
