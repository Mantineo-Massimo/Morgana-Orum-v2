"use client"

import { useState } from "react"
import { BookOpen, Bus, Info, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import nextDynamic from "next/dynamic"
import { ServicesGuide } from "@/components/features/services-guide"
import { TransportGuide } from "@/components/features/transport-guide"
import { TaxCalculator } from "@/components/widgets/tax-calculator"
import { AcademicDictionary } from "@/components/features/academic-dictionary"
import { SessionsCountdown } from "@/components/widgets/sessions-countdown"
import { GradeSimulator } from "@/components/widgets/grade-simulator"
import { ErsuMeritChecker } from "@/components/features/ersu-merit-checker"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Calculator, Clock, GraduationCap, ShieldCheck, Home, Heart, Wifi, CreditCard, FileText, Download } from "lucide-react"

const InteractiveMap = nextDynamic(
    () => import("@/components/features/interactive-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full bg-zinc-50 border border-zinc-100 animate-pulse rounded-[2rem] flex items-center justify-center text-zinc-400 font-semibold text-xs tracking-wider">
                Caricamento mappa interattiva / Loading map...
            </div>
        )
    }
)

interface GuideClientProps {
    categories: any[]
    initialGuides: any[]
    locale: string
    isLoggedIn?: boolean
    sessionEmail?: string | null
    countdownItems?: any[]
}

const ICON_MAP: Record<string, any> = {
    BookOpen,
    Bus,
    Info,
    MapPin,
    GraduationCap,
    ShieldCheck,
    Home,
    Heart,
    Wifi,
    CreditCard
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        title: "Guide Universitarie",
        subtitle: "Tutto il materiale informativo di cui hai bisogno per affrontare la tua vita universitaria a Messina in modo semplice.",
        featuredLabel: "Guida In Primo Piano"
    },
    en: {
        title: "University Guides",
        subtitle: "All the information you need to easily tackle your university life in Messina.",
        featuredLabel: "Featured Guide"
    }
}

const getColorClasses = (color: string) => {
    switch (color) {
        case "blue":
            return {
                color: "text-blue-600",
                bg: "bg-blue-50/60",
                border: "border-blue-100/80"
            }
        case "orange":
        case "#f9a620":
            return {
                color: "text-amber-600",
                bg: "bg-amber-50/60",
                border: "border-amber-100/80"
            }
        case "emerald":
        case "green":
            return {
                color: "text-emerald-600",
                bg: "bg-emerald-50/60",
                border: "border-emerald-100/80"
            }
        case "purple":
            return {
                color: "text-purple-600",
                bg: "bg-purple-50/60",
                border: "border-purple-100/80"
            }
        default:
            return {
                color: "text-zinc-600",
                bg: "bg-zinc-50/60",
                border: "border-zinc-100/80"
            }
    }
}

export function GuideClient({ categories, initialGuides, locale, isLoggedIn = false, sessionEmail = null, countdownItems = [] }: GuideClientProps) {
    const [selectedGuide, setSelectedGuide] = useState<string>("matricole")
    const [activeToolModal, setActiveToolModal] = useState<"tasse" | "dizionario" | "countdown" | "media" | "ersu" | null>(null)
    const [activeInfoGuide, setActiveInfoGuide] = useState<any | null>(null)

    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const getGuideTitle = (g: any) => (locale === "en" && g.titleEn) ? g.titleEn : g.title
    const getGuideDesc = (g: any) => (locale === "en" && g.descriptionEn) ? g.descriptionEn : g.description
    const getStepTitle = (s: any) => (locale === "en" && s.titleEn) ? s.titleEn : s.title
    const getStepDesc = (s: any) => (locale === "en" && s.descriptionEn) ? s.descriptionEn : s.description

    const guides = (initialGuides || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(g => ({
            ...g,
            title: getGuideTitle(g),
            description: getGuideDesc(g),
            steps: (g.steps || [])
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((s: any) => ({
                    title: getStepTitle(s),
                    desc: getStepDesc(s),
                    attachments: s.attachments
                }))
        }))

    const activeGuideData = guides.find(g => g.id === selectedGuide) || guides[0]
    const activeColorClasses = activeGuideData ? getColorClasses(activeGuideData.color) : getColorClasses("blue")

    if (guides.length === 0) {
        return (
            <div className="min-h-screen bg-zinc-50 pt-32 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-zinc-500">Nessuna guida disponibile / No guides available.</p>
                </div>
            </div>
        )
    }

    const getCardThemeClasses = (id: string, isSelected: boolean) => {
        switch (id) {
            case "matricole":
                return isSelected
                    ? "bg-white border-blue-500/30 ring-4 ring-blue-500/5 shadow-[0_20px_50px_rgba(59,130,246,0.12)] -translate-y-1.5 scale-[1.015]"
                    : "bg-white border-zinc-200/50 hover:border-blue-500/20 hover:shadow-[0_15px_30px_rgba(59,130,246,0.04)] hover:-translate-y-0.5"
            case "trasporti":
                return isSelected
                    ? "bg-white border-amber-500/30 ring-4 ring-amber-500/5 shadow-[0_20px_50px_rgba(245,158,11,0.12)] -translate-y-1.5 scale-[1.015]"
                    : "bg-white border-zinc-200/50 hover:border-amber-500/20 hover:shadow-[0_15px_30px_rgba(245,158,11,0.04)] hover:-translate-y-0.5"
            case "servizi":
                return isSelected
                    ? "bg-white border-emerald-500/30 ring-4 ring-emerald-500/5 shadow-[0_20px_50px_rgba(16,185,129,0.12)] -translate-y-1.5 scale-[1.015]"
                    : "bg-white border-zinc-200/50 hover:border-emerald-500/20 hover:shadow-[0_15px_30px_rgba(16,185,129,0.04)] hover:-translate-y-0.5"
            case "mappa":
                return isSelected
                    ? "bg-white border-purple-500/30 ring-4 ring-purple-500/5 shadow-[0_20px_50px_rgba(168,85,247,0.12)] -translate-y-1.5 scale-[1.015]"
                    : "bg-white border-zinc-200/50 hover:border-purple-500/20 hover:shadow-[0_15px_30px_rgba(168,85,247,0.04)] hover:-translate-y-0.5"
            default:
                return isSelected
                    ? "bg-white border-zinc-900 ring-4 ring-zinc-900/5 shadow-xl -translate-y-1.5 scale-[1.015]"
                    : "bg-white border-zinc-200/50 hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5"
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50/40 pt-32 pb-20 relative overflow-hidden">
            {/* Radial Glow Blobs for premium design */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-300/10 blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-1/4 right-1/4 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-300/10 blur-[150px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-emerald-300/8 blur-[130px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/3 translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-300/8 blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="relative size-20 mx-auto mb-8">
                        <div className="size-full bg-purple-500/10 text-purple-600 rounded-3xl flex items-center justify-center rotate-3 hover:rotate-6 transition-all duration-300">
                            <BookOpen className="size-10" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-zinc-900 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-700">
                        {t.title}
                    </h1>
                    {t.subtitle && (
                        <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic max-w-2xl mx-auto leading-relaxed">
                            {t.subtitle}
                        </p>
                    )}
                </div>

                {/* Grid of Guide Choices */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {guides
                        .filter((g) => ["matricole", "mappa", "servizi", "trasporti"].includes(g.id))
                        .map((g) => {
                            const Icon = ICON_MAP[g.icon] || BookOpen
                            const isSelected = selectedGuide === g.id
                            const colorClasses = getColorClasses(g.color)
                            return (
                                <button
                                    key={g.id}
                                    onClick={() => setSelectedGuide(g.id)}
                                    className={cn(
                                        "p-6 rounded-[2rem] border text-left flex flex-col justify-between transition-all duration-300 group",
                                        getCardThemeClasses(g.id, isSelected)
                                    )}
                                >
                                    <div className={cn(
                                        "size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300",
                                        colorClasses.bg,
                                        colorClasses.color,
                                        isSelected ? "scale-110" : "group-hover:scale-105"
                                    )}>
                                        <Icon className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 mb-2">{g.title}</h3>
                                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{g.description}</p>
                                    </div>
                                </button>
                            )
                        })}
                </div>

                {/* Expanded Details Section */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-zinc-200/50 shadow-[0_30px_100px_rgba(0,0,0,0.05)] p-8 md:p-12 relative overflow-hidden">
                    {/* Inner glowing accent gradient aligned with selection color */}
                    <div className={cn(
                        "absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 -z-10 transition-all duration-500",
                        selectedGuide === "matricole" && "bg-blue-400",
                        selectedGuide === "trasporti" && "bg-amber-400",
                        selectedGuide === "servizi" && "bg-emerald-400",
                        selectedGuide === "mappa" && "bg-purple-400"
                    )} />

                    <div className={cn("mx-auto relative z-10", (selectedGuide === "mappa" || selectedGuide === "servizi" || selectedGuide === "trasporti" || selectedGuide === "matricole") ? "max-w-full" : "max-w-4xl")}>
                        <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-4 border transition-all duration-300",
                            selectedGuide === "matricole" && "bg-blue-50 text-blue-600 border-blue-100",
                            selectedGuide === "trasporti" && "bg-amber-50 text-amber-600 border-amber-100",
                            selectedGuide === "servizi" && "bg-emerald-50 text-emerald-600 border-emerald-100",
                            selectedGuide === "mappa" && "bg-purple-50 text-purple-600 border-purple-100"
                        )}>
                            <span className={cn(
                                "size-1.5 rounded-full animate-pulse",
                                selectedGuide === "matricole" && "bg-blue-500",
                                selectedGuide === "trasporti" && "bg-amber-500",
                                selectedGuide === "servizi" && "bg-emerald-500",
                                selectedGuide === "mappa" && "bg-purple-500"
                            )} />
                            {t.featuredLabel}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-zinc-900 mb-4 tracking-tight">
                            <span className={cn(
                                "bg-clip-text text-transparent bg-gradient-to-r transition-all duration-500",
                                selectedGuide === "matricole" && "from-blue-600 to-indigo-600",
                                selectedGuide === "trasporti" && "from-amber-600 to-orange-600",
                                selectedGuide === "servizi" && "from-emerald-600 to-teal-600",
                                selectedGuide === "mappa" && "from-purple-600 to-pink-600"
                            )}>
                                {activeGuideData.title}
                            </span>
                        </h2>
                        <p className="text-zinc-500 mb-10 text-base md:text-lg leading-relaxed max-w-4xl">
                            {activeGuideData.description}
                        </p>

                        {selectedGuide === "mappa" ? (
                            <div className="mt-8 z-10 relative">
                                <InteractiveMap />
                            </div>
                        ) : selectedGuide === "servizi" ? (
                            <div className="mt-8 z-10 relative">
                                <ServicesGuide categories={categories} locale={locale} />
                            </div>
                        ) : selectedGuide === "trasporti" ? (
                            <div className="mt-8 z-10 relative">
                                <TransportGuide />
                            </div>
                        ) : selectedGuide === "matricole" ? (
                            <div className="space-y-12">
                                {/* Guide Informative */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                                        <span className="h-6 w-1 rounded-full bg-gradient-to-b from-[#c12830] to-[#e13a43]" />
                                        {locale === "en" ? "Informative Guides" : "Guide Informative"}
                                    </h3>
                                    {guides.filter((g) => !g.hasCustomComponent && g.id !== "matricole").length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {guides
                                                .filter((g) => !g.hasCustomComponent && g.id !== "matricole")
                                                .map((g) => {
                                                    const IconComponent = ICON_MAP[g.icon] || BookOpen
                                                    return (
                                                        <button
                                                            key={g.id}
                                                            onClick={() => setActiveInfoGuide(g)}
                                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white/50 hover:bg-white hover:border-blue-500/20 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(59,130,246,0.05)] transition-all duration-300 transform hover:-translate-y-1"
                                                        >
                                                            <div>
                                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                                                    <IconComponent className="size-6" />
                                                                </div>
                                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                                                                    {locale === "en" && g.titleEn ? g.titleEn : g.title}
                                                                </h4>
                                                                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                                                                    {locale === "en" && g.descriptionEn ? g.descriptionEn : g.description}
                                                                </p>
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase tracking-wider text-[#c12830] mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                                {locale === "en" ? "Read Guide" : "Leggi la Guida"} &rarr;
                                                            </div>
                                                        </button>
                                                    )
                                                })}
                                        </div>
                                    ) : (
                                        <p className="text-zinc-500 text-sm italic">
                                            {locale === "en" ? "No informative guides available at the moment." : "Nessuna guida informativa disponibile al momento."}
                                        </p>
                                    )}
                                </div>

                                {/* Strumenti Utili */}
                                <div className="pt-10 border-t border-zinc-100 mt-10 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                                            <span className="h-6 w-1 rounded-full bg-gradient-to-b from-[#c12830] to-[#e13a43]" />
                                            {locale === "en" ? "Interactive Tools" : "Strumenti Utili"}
                                        </h3>
                                        <p className="text-sm text-zinc-500 leading-relaxed mt-2">
                                            {locale === "en"
                                                ? "Use our interactive tools designed to help you quickly calculate university taxes or decipher common terms."
                                                : "Utilizza i nostri strumenti interattivi creati appositamente per calcolare rapidamente le tasse o decifrare i termini universitari più comuni."}
                                        </p>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                        {/* Tax Simulator Card */}
                                        <button
                                            onClick={() => setActiveToolModal("tasse")}
                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white hover:border-emerald-500/30 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(16,185,129,0.06)] transition-all duration-300 transform hover:-translate-y-1.5"
                                        >
                                            <div>
                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-emerald-600 group-hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] transition-all duration-300">
                                                    <Calculator className="size-6" />
                                                </div>
                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                                                    {locale === "en" ? "Tuition Fees Calculator" : "Calcolatore Tasse & COA"}
                                                </h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    {locale === "en"
                                                        ? "Calculate your contribution bracket, exemptions, discounts, and visual payment deadlines schedule."
                                                        : "Simula la tua fascia di tasse, gli esoneri, le agevolazioni e lo scadenziario dei pagamenti."}
                                                </p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                            </div>
                                        </button>

                                        {/* Dictionary Card */}
                                        <button
                                            onClick={() => setActiveToolModal("dizionario")}
                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white hover:border-violet-500/30 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(139,92,246,0.06)] transition-all duration-300 transform hover:-translate-y-1.5"
                                        >
                                            <div>
                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-violet-600 group-hover:shadow-[0_8px_20px_rgba(139,92,246,0.25)] transition-all duration-300">
                                                    <BookOpen className="size-6" />
                                                </div>
                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-violet-600 transition-colors">
                                                    {locale === "en" ? "Freshman Dictionary" : "Dizionario della Matricola"}
                                                </h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    {locale === "en"
                                                        ? "Unsure about CFU, Appello, Esse3, or verbalizzazione? Search common terms here."
                                                        : "Non conosci i termini come CFU, Appello, Esse3 o Verbalizzazione? Cercali velocemente qui."}
                                                </p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-wider text-violet-600 mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                            </div>
                                        </button>

                                        {/* Sessions Countdown Card */}
                                        <button
                                            onClick={() => setActiveToolModal("countdown")}
                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white hover:border-amber-500/30 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(245,158,11,0.06)] transition-all duration-300 transform hover:-translate-y-1.5"
                                        >
                                            <div>
                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-amber-500 group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.25)] transition-all duration-300">
                                                    <Clock className="size-6" />
                                                </div>
                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                                                    {locale === "en" ? "Deadlines & Countdowns" : "Countdown Accademico"}
                                                </h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    {locale === "en"
                                                        ? "Track the remaining days for official exam sessions and important UniMe deadlines."
                                                        : "Visualizza i giorni mancanti all'inizio delle sessioni d'esame e alle scadenze burocratiche."}
                                                </p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                            </div>
                                        </button>

                                        {/* Grade Simulator Card */}
                                        <button
                                            onClick={() => setActiveToolModal("media")}
                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white hover:border-indigo-500/30 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(99,102,241,0.06)] transition-all duration-300 transform hover:-translate-y-1.5"
                                        >
                                            <div>
                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-indigo-600 group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.25)] transition-all duration-300">
                                                    <GraduationCap className="size-6" />
                                                </div>
                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                                    {locale === "en" ? "GPA & Degree Simulator" : "Simulatore Media & Laurea"}
                                                </h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    {locale === "en"
                                                        ? "Simulate your weighted GPA, track ECTS credits progress, and estimate your graduation mark."
                                                        : "Simula la tua media ponderata, i crediti CFU acquisiti e stima il voto di partenza per la tesi."}
                                                </p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                            </div>
                                        </button>

                                        {/* ERSU Merit Checker Card */}
                                        <button
                                            onClick={() => setActiveToolModal("ersu")}
                                            className="group p-6 rounded-[2rem] border border-zinc-200/50 bg-white hover:border-teal-500/30 text-left flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(20,184,166,0.06)] transition-all duration-300 transform hover:-translate-y-1.5"
                                        >
                                            <div>
                                                <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-100 group-hover:bg-teal-600 group-hover:shadow-[0_8px_20px_rgba(20,184,166,0.25)] transition-all duration-300">
                                                    <ShieldCheck className="size-6" />
                                                </div>
                                                <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight group-hover:text-teal-600 transition-colors">
                                                    {locale === "en" ? "ERSU Merit Checker" : "Requisiti Borsa ERSU"}
                                                </h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">
                                                    {locale === "en"
                                                        ? "Check if you meet the CFU and merit requirements for the ERSU Messina scholarship."
                                                        : "Verifica se sei in linea con i criteri di meritocrazia (CFU) richiesti per mantenere la borsa di studio ERSU."}
                                                </p>
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-wider text-teal-600 mt-6 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
                                                {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {activeGuideData.steps.map((step: any, index: number) => (
                                    <div key={index} className={cn(
                                        "flex gap-6 items-start p-6 rounded-2xl border transition-all duration-300",
                                        "border-zinc-200/50 bg-white/50 hover:bg-white",
                                        selectedGuide === "matricole" && "hover:border-blue-500/20 hover:shadow-[0_15px_30px_rgba(59,130,246,0.03)]",
                                        selectedGuide === "trasporti" && "hover:border-amber-500/20 hover:shadow-[0_15px_30px_rgba(245,158,11,0.03)]",
                                        selectedGuide === "servizi" && "hover:border-emerald-500/20 hover:shadow-[0_15px_30px_rgba(16,185,129,0.03)]",
                                        selectedGuide === "mappa" && "hover:border-purple-500/20 hover:shadow-[0_15px_30px_rgba(168,85,247,0.03)]"
                                    )}>
                                        <div className={cn(
                                            "size-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm",
                                            activeColorClasses.bg,
                                            activeColorClasses.color
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <h4 className="text-lg font-bold text-zinc-900 leading-tight">{step.title}</h4>
                                            <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                                            {step.attachments && (() => {
                                                try {
                                                    const list = JSON.parse(step.attachments)
                                                    if (Array.isArray(list) && list.length > 0) {
                                                        return (
                                                            <div className="flex flex-wrap gap-2 mt-3.5">
                                                                {list.map((att: any, idx: number) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={att.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-xl text-xs font-bold transition-all shadow-sm group"
                                                                    >
                                                                        <FileText className="size-3.5 text-zinc-400 group-hover:text-zinc-600" />
                                                                        <span>{att.name}</span>
                                                                        <Download className="size-3 text-zinc-300 group-hover:text-zinc-500" />
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )
                                                    }
                                                } catch(e) {}
                                                return null
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal for Tuition Calculator */}
            <Dialog open={activeToolModal === "tasse"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-5xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <TaxCalculator locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Academic Dictionary */}
            <Dialog open={activeToolModal === "dizionario"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-5xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <AcademicDictionary locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Sessions Countdown */}
            <Dialog open={activeToolModal === "countdown"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-5xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <SessionsCountdown locale={locale} initialItems={countdownItems} sessionEmail={sessionEmail} />
                </DialogContent>
            </Dialog>

            {/* Modal for Grade Simulator */}
            <Dialog open={activeToolModal === "media"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-5xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <GradeSimulator locale={locale} isLoggedIn={isLoggedIn} />
                </DialogContent>
            </Dialog>

            {/* Modal for ERSU Merit Checker */}
            <Dialog open={activeToolModal === "ersu"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-5xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <ErsuMeritChecker locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Informative Guide Steps */}
            <Dialog open={activeInfoGuide !== null} onOpenChange={(open) => !open && setActiveInfoGuide(null)}>
                <DialogContent className="!w-[95vw] md:!w-full !max-w-[95vw] md:!max-w-3xl bg-white !p-3 md:!p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    {activeInfoGuide && (
                        <div className="space-y-6 text-zinc-950">
                            <div className="flex items-center gap-3 pb-4 border-b border-zinc-150">
                                <div className="size-12 shrink-0 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-lg shadow-zinc-200">
                                    {(() => {
                                        const IconComponent = ICON_MAP[activeInfoGuide.icon] || BookOpen
                                        return <IconComponent className="size-6" />
                                    })()}
                                </div>
                                <div>
                                    <h3 className="font-serif font-black text-xl text-zinc-900 uppercase tracking-tight">
                                        {activeInfoGuide.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                        {activeInfoGuide.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {activeInfoGuide.steps && activeInfoGuide.steps.length > 0 ? (
                                    activeInfoGuide.steps.map((step: any, index: number) => (
                                        <div key={index} className="flex gap-6 items-start p-5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/20 hover:bg-white transition-all">
                                            <div className="size-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-md shadow-zinc-200">
                                                {index + 1}
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <h4 className="text-lg font-bold text-zinc-900 leading-tight">
                                                    {locale === "en" && step.titleEn ? step.titleEn : step.title}
                                                </h4>
                                                <p className="text-sm text-zinc-500 leading-relaxed">
                                                    {locale === "en" && step.descriptionEn ? step.descriptionEn : (step.description || step.desc)}
                                                </p>
                                                {step.attachments && (() => {
                                                    try {
                                                        const list = JSON.parse(step.attachments)
                                                        if (Array.isArray(list) && list.length > 0) {
                                                            return (
                                                                <div className="flex flex-wrap gap-2 mt-3">
                                                                    {list.map((att: any, idx: number) => (
                                                                        <a
                                                                            key={idx}
                                                                            href={att.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-xl text-xs font-bold transition-all shadow-sm group"
                                                                        >
                                                                            <FileText className="size-3.5 text-zinc-400 group-hover:text-zinc-600" />
                                                                            <span>{att.name}</span>
                                                                            <Download className="size-3 text-zinc-300 group-hover:text-zinc-500" />
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            )
                                                        }
                                                    } catch(e) {}
                                                    return null
                                                })()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-zinc-400 italic text-xs py-8">
                                        {locale === "en" ? "No chapters available for this guide." : "Nessun capitolo disponibile per questa guida."}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
