"use client"

import { useState } from "react"
import { Phone, Users, CheckCircle2, AlertCircle, ArrowRight, Search, Film, Home as HomeIcon, Info } from "lucide-react"

type CourseGroup = { name: string; link: string }

interface GruppiClientProps {
    initialGroups: any[]
    locale: string
}

const ICON_MAP: Record<string, any> = {
    Users, Film, Home: HomeIcon, Phone, Info
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Gruppi WhatsApp",
        subtitle: "Unisciti alla più grande community di studenti dell'Ateneo. Seleziona il tuo gruppo ufficiale gestito dai nostri rappresentanti.",
        activeMod: "Moderazione attiva",
        verifiedInfo: "Solo info verificate",
        academicHeader: "Gruppi Corsi Accademici",
        academicSub: "Trova il gruppo WhatsApp del tuo corso di laurea selezionando il tuo dipartimento o utilizzando la barra di ricerca.",
        searchPlaceholder: "Cerca il tuo corso di laurea (es. Lettere, Economia)...",
        noGroups: "Nessun gruppo trovato per la tua ricerca.",
        officialGroup: "Gruppo Ufficiale",
        communityHeader: "Gruppi Community Morgana e O.R.U.M.",
        communitySub: "Entra a far parte delle nostre community tematiche per fare amicizia, restare informato ed essere parte attiva delle attività studentesche.",
        joinGroup: "Entra nel gruppo",
        missingHeader: "Non trovi il tuo corso?",
        missingSub: "Stiamo aggiornando costantemente l'elenco dei gruppi. Se il tuo corso non è presente, contattaci sui nostri canali social e ti forniremo il link dedicato.",
        writeInstagram: "Scrivici su Instagram"
    },
    en: {
        title: "WhatsApp Groups",
        subtitle: "Join the largest community of students at the University. Select your official group managed by our representatives.",
        activeMod: "Active moderation",
        verifiedInfo: "Verified info only",
        academicHeader: "Academic Course Groups",
        academicSub: "Find the WhatsApp group for your degree course by selecting your department or using the search bar.",
        searchPlaceholder: "Search for your degree course (e.g. Literature, Economics)...",
        noGroups: "No groups found matching your search.",
        officialGroup: "Official Group",
        communityHeader: "Morgana & O.R.U.M. Community Groups",
        communitySub: "Become part of our thematic communities to make friends, stay informed, and be active in student activities.",
        joinGroup: "Join group",
        missingHeader: "Can't find your course?",
        missingSub: "We are constantly updating the list of groups. If your course is not present, contact us on our social channels and we will provide the dedicated link.",
        writeInstagram: "Message us on Instagram"
    }
}

export function GruppiClient({ initialGroups, locale }: GruppiClientProps) {
    const [search, setSearch] = useState("")
    
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const getGroupName = (g: any) => (locale === "en" && g.nameEn) ? g.nameEn : g.name
    const getGroupDesc = (g: any) => (locale === "en" && g.descriptionEn) ? g.descriptionEn : g.description

    // 1. Filter and group Academic Groups by Department
    const academicGroups = initialGroups.filter(g => g.category === "ACADEMIC")
    
    // Group academic groups by department
    const groupedDepts = academicGroups.reduce((acc, g) => {
        const dept = g.department || "Generale"
        if (!acc[dept]) acc[dept] = []
        acc[dept].push(g)
        return acc
    }, {} as Record<string, any[]>)

    // Apply search filter on grouped departments
    const filteredDepartments = Object.entries(groupedDepts).reduce((acc, [dept, groups]) => {
        const matchingGroups = (groups as any[]).filter(g => 
            getGroupName(g).toLowerCase().includes(search.toLowerCase())
        )
        if (matchingGroups.length > 0) {
            acc[dept] = matchingGroups
        }
        return acc
    }, {} as Record<string, any[]>)

    // 2. Filter Community Groups
    const communityGroups = initialGroups
        .filter(g => g.category === "COMMUNITY")
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-[#25D366]/10 text-[#25D366] rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Phone className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        {t.title}
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                        {t.subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-medium text-zinc-500">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <CheckCircle2 className="size-4 text-green-500" /> {t.activeMod}
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-100">
                            <AlertCircle className="size-4 text-blue-500" /> {t.verifiedInfo}
                        </div>
                    </div>
                </div>

                {/* Section 1: Gruppi Community Morgana e O.R.U.M. */}
                {communityGroups.length > 0 && (
                    <section className="mb-24">
                        <div className="max-w-3xl mx-auto mb-16 text-center">
                            <h2 className="text-3xl font-serif font-black text-foreground mb-4 uppercase tracking-tight">
                                {t.communityHeader}
                            </h2>
                            <p className="text-zinc-500 text-sm max-w-xl mx-auto">
                                {t.communitySub}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {communityGroups.map((group, idx) => {
                                const Icon = ICON_MAP[group.icon] || Users
                                const groupName = getGroupName(group)
                                const groupDesc = getGroupDesc(group)
                                return (
                                    <div key={idx} className="group relative bg-white border border-zinc-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
                                        <div>
                                            <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 border transition-all ${group.theme || "text-blue-500 bg-blue-50 border-blue-100"}`}>
                                                <Icon className="size-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-[#25D366] transition-colors uppercase tracking-tight font-serif">
                                                {groupName}
                                            </h3>
                                            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                                                {groupDesc}
                                            </p>
                                        </div>
                                        <a
                                            href={group.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-[#25D366] font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-green-500/20"
                                        >
                                            {t.joinGroup} <ArrowRight className="size-4" />
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Divider */}
                {academicGroups.length > 0 && communityGroups.length > 0 && (
                    <div className="relative my-20">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-200/80"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-zinc-50 px-4 text-zinc-300 text-sm">✦</span>
                        </div>
                    </div>
                )}

                {/* Section 2: Gruppi Corsi Accademici */}
                {academicGroups.length > 0 && (
                    <section className="mb-24">
                        <div className="max-w-3xl mx-auto mb-12 text-center">
                            <h2 className="text-3xl font-serif font-black text-foreground mb-4 uppercase tracking-tight">
                                {t.academicHeader}
                            </h2>
                            <p className="text-zinc-500 mb-8 text-sm max-w-xl mx-auto">
                                {t.academicSub}
                            </p>

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

                        {/* Academic Groups Grid */}
                        <div className="space-y-12">
                            {Object.keys(filteredDepartments).length === 0 ? (
                                <div className="text-center py-16 text-zinc-400">
                                    <Search className="size-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">{t.noGroups}</p>
                                </div>
                            ) : (
                                Object.entries(filteredDepartments).map(([dept, groups]) => (
                                    <div key={dept} className="space-y-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-px flex-1 bg-zinc-200"></div>
                                            <h3 className="text-xs font-serif font-black uppercase tracking-widest text-zinc-400 px-4 text-center">
                                                {dept}
                                            </h3>
                                            <div className="h-px flex-1 bg-zinc-200"></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {groups.map((group, idx) => {
                                                const groupName = getGroupName(group)
                                                return (
                                                    <div key={idx} className="group relative bg-white border border-zinc-100 rounded-2xl p-5 hover:border-[#25D366]/30 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <h4 className="font-bold text-zinc-900 group-hover:text-[#25D366] transition-colors leading-tight">
                                                                    {groupName}
                                                                </h4>
                                                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-tighter">
                                                                    {t.officialGroup}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={group.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="shrink-0 size-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center group-hover:bg-[#25D366] transition-all duration-300 shadow-lg shadow-zinc-200 group-hover:shadow-green-500/20"
                                                            >
                                                                <ArrowRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {/* Footer box */}
                <div className="mt-20 max-w-2xl mx-auto bg-blue-50/50 border border-blue-100 rounded-3xl p-8 text-center text-blue-900">
                    <h3 className="text-xl font-bold mb-3 font-serif">{t.missingHeader}</h3>
                    <p className="opacity-80 mb-6 text-sm">
                        {t.missingSub}
                    </p>
                    <a href="https://instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="inline-block font-bold uppercase tracking-widest text-xs border-2 border-blue-900/20 px-6 py-3 rounded-full hover:bg-blue-900 hover:text-white transition-colors">
                        {t.writeInstagram}
                    </a>
                </div>
            </div>
        </div>
    )
}
