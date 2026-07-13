"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Users, CheckCircle2, AlertCircle, ArrowRight, Search, ArrowLeft, Shield } from "lucide-react"

interface SanitariaVeterinariaClientProps {
    initialGroups: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Gruppi Semestre Filtro & Area Sanitaria",
        subtitle: "Canali di informazione, bacheche e community generali dedicate esclusivamente al semestre filtro e all'area sanitaria.",
        searchPlaceholder: "Cerca tra i gruppi generali...",
        noGroups: "Nessun gruppo generale trovato.",
        backBtn: "Torna a tutti i gruppi",
        sanitarySection: "Area Sanitaria & Medica",
        veterinarySection: "Area Veterinaria",
        officialGroup: "Gruppo Generale Ufficiale",
        joinGroup: "Entra nel gruppo",
        activeMod: "Moderazione attiva",
        verifiedInfo: "Solo info verificate",
        collabWith: "In collaborazione con"
    },
    en: {
        title: "Semester Filter & Healthcare Area Groups",
        subtitle: "Information channels, bulletin boards, and general communities dedicated exclusively to the semester filter and healthcare area.",
        searchPlaceholder: "Search general groups...",
        noGroups: "No general groups found.",
        backBtn: "Back to all groups",
        sanitarySection: "Healthcare & Medical Area",
        veterinarySection: "Veterinary Area",
        officialGroup: "Official General Group",
        joinGroup: "Join group",
        activeMod: "Active moderation",
        verifiedInfo: "Verified info only",
        collabWith: "In collaboration with"
    }
}

export function SanitariaVeterinariaClient({ initialGroups, locale }: SanitariaVeterinariaClientProps) {
    const [search, setSearch] = useState("")
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const getGroupName = (g: any) => (locale === "en" && g.nameEn) ? g.nameEn : g.name
    const getGroupDesc = (g: any) => (locale === "en" && g.descriptionEn) ? g.descriptionEn : g.description

    const getSubcategoryLabel = (sub: string) => {
        switch (sub) {
            case "MEDICINA": return "Medicina Generale"
            case "PROFESSIONI_SANITARIE": return "Professioni Sanitarie"
            case "VETERINARIA": return "Veterinaria"
            case "GENERALE": return "Generale"
            default: return sub || "Generale"
        }
    }

    // Filter only general groups
    const generalGroups = initialGroups.filter(g => g.isGeneral === true || g.category === "SANITARY_VET")

    // Group into Sanitary vs Veterinary
    const sanitaryGeneral = generalGroups.filter(g => 
        g.department === "Dipartimento di Medicina Clinica e Sperimentale (DIMED)" ||
        g.department === "Dipartimento di Scienze Biomediche, Odontoiatriche e delle Immagini Morfologiche e Funzionali (BIOMORF)" ||
        g.department === "Dipartimento di Patologia Umana dell'Adulto e dell'Età Evolutiva \"Gaetano Barresi\"" ||
        g.subcategory === "MEDICINA" || 
        g.subcategory === "PROFESSIONI_SANITARIE" ||
        (g.subcategory === "GENERALE" && (!g.department || g.department.toLowerCase().includes("medicina") || g.department.toLowerCase().includes("biomorf") || g.department.toLowerCase().includes("patologia")))
    ).filter(g => getGroupName(g).toLowerCase().includes(search.toLowerCase()))

    const veterinaryGeneral = generalGroups.filter(g => 
        g.department === "Dipartimento di Scienze Veterinarie" || 
        g.subcategory === "VETERINARIA" ||
        (g.subcategory === "GENERALE" && g.department?.toLowerCase().includes("veterinaria"))
    ).filter(g => getGroupName(g).toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col justify-center pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl w-full">
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
                    <div className="size-20 bg-[#c9041a]/10 text-[#c9041a] rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3 shadow-md shadow-red-600/5">
                        <Phone className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-4 tracking-tight text-foreground uppercase">
                        {t.title}
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-zinc-500 mb-6 italic">
                        {t.subtitle}
                    </p>

                    {/* Collaboration badge with Unimhealth (clickable & larger) */}
                    <a
                        href="https://www.instagram.com/unimhealth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm border border-zinc-150 mb-8 hover:shadow-md hover:border-red-500/20 transition-all hover:scale-[1.02] group/collab"
                    >
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 group-hover/collab:text-zinc-600 transition-colors">
                            {t.collabWith}
                        </span>
                        <div className="bg-zinc-50 rounded-full p-1.5 aspect-square h-10 w-10 flex items-center justify-center border border-zinc-200/50 group-hover/collab:scale-105 transition-transform">
                            <Image
                                src="/assets/backgrounds/unimhealth.webp"
                                alt="Unimhealth Logo"
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                            />
                        </div>
                        <span className="text-xs font-serif font-black uppercase text-zinc-800 tracking-wider group-hover/collab:text-[#c9041a] transition-colors">
                            Unimhealth
                        </span>
                    </a>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-zinc-500 mb-12">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <CheckCircle2 className="size-4 text-emerald-500" /> {t.activeMod}
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <AlertCircle className="size-4 text-indigo-500" /> {t.verifiedInfo}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-zinc-200 bg-white focus:ring-2 focus:ring-zinc-900/5 transition-all outline-none text-sm shadow-sm"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-16">
                    {/* Sanitary Section */}
                    {sanitaryGeneral.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-black uppercase tracking-widest text-[#c9041a] bg-red-50 border border-red-100/50 px-4 py-1.5 rounded-full shrink-0">
                                    {t.sanitarySection}
                                </h2>
                                <div className="h-px w-full bg-zinc-200"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sanitaryGeneral.map((group, idx) => {
                                    const groupName = getGroupName(group)
                                    return (
                                        <div key={idx} className="group relative bg-white border border-zinc-100 rounded-2xl p-5 hover:border-[#c9041a]/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-zinc-900 group-hover:text-[#c9041a] transition-colors leading-tight">
                                                        {groupName}
                                                    </h4>
                                                    <span className="block text-xs font-semibold text-zinc-400 mt-1">
                                                        {getSubcategoryLabel(group.subcategory)}
                                                    </span>
                                                </div>
                                                <a
                                                    href={group.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 size-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center group-hover:bg-[#c9041a] transition-all duration-300 shadow-lg shadow-zinc-200 group-hover:shadow-red-500/20"
                                                >
                                                    <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Veterinary Section */}
                    {veterinaryGeneral.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full shrink-0">
                                    {t.veterinarySection}
                                </h2>
                                <div className="h-px w-full bg-zinc-200"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {veterinaryGeneral.map((group, idx) => {
                                    const groupName = getGroupName(group)
                                    return (
                                        <div key={idx} className="group relative bg-white border border-zinc-100 rounded-2xl p-5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                        {groupName}
                                                    </h4>
                                                    <span className="block text-xs font-semibold text-zinc-400 mt-1">
                                                        {getSubcategoryLabel(group.subcategory)}
                                                    </span>
                                                </div>
                                                <a
                                                    href={group.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 size-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-zinc-200 group-hover:shadow-indigo-500/20"
                                                >
                                                    <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {sanitaryGeneral.length === 0 && veterinaryGeneral.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-zinc-150 shadow-sm max-w-2xl mx-auto px-6">
                            <Search className="size-16 mx-auto mb-4 text-zinc-300 opacity-50" />
                            <h3 className="text-xl font-bold text-zinc-800 mb-2 font-serif uppercase tracking-tight">{t.noGroups}</h3>
                            <p className="text-zinc-400 text-sm">
                                Puoi crearne uno dal pannello di amministrazione spuntando la voce &quot;Gruppo Generale&quot;.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
