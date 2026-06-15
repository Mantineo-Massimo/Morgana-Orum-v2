"use client"

import { useState } from "react"
import { BookOpen, Bus, Info, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import nextDynamic from "next/dynamic"
import { ServicesGuide } from "@/components/services-guide"
import { TransportGuide } from "@/components/transport-guide"
import { TaxCalculator } from "@/components/tax-calculator"
import { AcademicDictionary } from "@/components/academic-dictionary"
import { SessionsCountdown } from "@/components/sessions-countdown"
import { GradeSimulator } from "@/components/grade-simulator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Calculator, Clock, GraduationCap } from "lucide-react"

const InteractiveMap = nextDynamic(
    () => import("@/components/interactive-map"),
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
}

const ICON_MAP: Record<string, any> = {
    BookOpen,
    Bus,
    Info,
    MapPin
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
                color: "text-blue-500",
                bg: "bg-blue-50",
                border: "border-blue-100"
            }
        case "orange":
        case "#f9a620":
            return {
                color: "text-[#f9a620]",
                bg: "bg-[#f9a620]/10",
                border: "border-[#f9a620]/20"
            }
        case "emerald":
        case "green":
            return {
                color: "text-emerald-500",
                bg: "bg-emerald-50",
                border: "border-emerald-100"
            }
        case "purple":
            return {
                color: "text-purple-500",
                bg: "bg-purple-50",
                border: "border-purple-100"
            }
        default:
            return {
                color: "text-zinc-500",
                bg: "bg-zinc-50",
                border: "border-zinc-100"
            }
    }
}

export function GuideClient({ categories, initialGuides, locale }: GuideClientProps) {
    const [selectedGuide, setSelectedGuide] = useState<string>("matricole")
    const [activeToolModal, setActiveToolModal] = useState<"tasse" | "dizionario" | "countdown" | "media" | null>(null)

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
                    desc: getStepDesc(s)
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

                {/* Grid of Guide Choices */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {guides.map((g) => {
                        const Icon = ICON_MAP[g.icon] || BookOpen
                        const isSelected = selectedGuide === g.id
                        const colorClasses = getColorClasses(g.color)
                        return (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGuide(g.id)}
                                className={cn(
                                    "p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300",
                                    isSelected 
                                        ? "bg-white border-zinc-900 shadow-xl -translate-y-1 scale-[1.02]" 
                                        : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md"
                                )}
                            >
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center mb-6", colorClasses.bg, colorClasses.color)}>
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
                <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl p-8 md:p-12">
                    <div className={cn("mx-auto", (selectedGuide === "mappa" || selectedGuide === "servizi" || selectedGuide === "trasporti") ? "max-w-full" : "max-w-4xl")}>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">
                            {t.featuredLabel}
                        </span>
                        <h2 className="text-3xl font-serif font-black text-zinc-900 mb-4 flex items-center gap-3">
                            <span className={activeColorClasses.color}>{activeGuideData.title}</span>
                        </h2>
                        <p className="text-zinc-500 mb-10 text-base leading-relaxed">
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
                        ) : (
                            <div className="space-y-12">
                                {/* Guide Steps Section */}
                                <div className="space-y-6">
                                    {selectedGuide === "matricole" && (
                                        <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                                            <span className="h-6 w-1 rounded-full bg-[#c9041a]" />
                                            {locale === "en" ? "Guide Chapters" : "I Capitoli della Guida"}
                                        </h3>
                                    )}
                                    <div className="space-y-6">
                                        {activeGuideData.steps.map((step: any, index: number) => (
                                            <div key={index} className="flex gap-6 items-start p-5 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/20 hover:bg-white transition-all">
                                                <div className={cn("size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", activeColorClasses.bg, activeColorClasses.color)}>
                                                    {index + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold text-zinc-900 leading-tight">{step.title}</h4>
                                                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Interactive Tools Section */}
                                {selectedGuide === "matricole" && (
                                    <div className="pt-10 border-t border-zinc-100 mt-10 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                                                <span className="h-6 w-1 rounded-full bg-[#c9041a]" />
                                                {locale === "en" ? "Interactive Tools" : "Strumenti Utili"}
                                            </h3>
                                            <p className="text-sm text-zinc-500 leading-relaxed mt-2">
                                                {locale === "en" 
                                                    ? "Use our interactive tools designed to help you quickly calculate university taxes or decipher common terms."
                                                    : "Utilizza i nostri strumenti interattivi creati appositamente per calcolare rapidamente le tasse o decifrare i termini universitari più comuni."}
                                            </p>
                                        </div>                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {/* Tax Simulator Card */}
                                            <button
                                                onClick={() => setActiveToolModal("tasse")}
                                                className="group p-6 rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-900 text-left flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                <div>
                                                    <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-200 group-hover:bg-[#c9041a] transition-all">
                                                        <Calculator className="size-6" />
                                                    </div>
                                                    <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight">
                                                        {locale === "en" ? "Tuition Fees Calculator" : "Calcolatore Tasse & COA"}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                                        {locale === "en"
                                                            ? "Calculate your contribution bracket, exemptions, discounts, and visual payment deadlines schedule."
                                                            : "Simula la tua fascia di tasse, gli esoneri, le agevolazioni e lo scadenziario dei pagamenti."}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-wider text-[#c9041a] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                                </div>
                                            </button>

                                            {/* Dictionary Card */}
                                            <button
                                                onClick={() => setActiveToolModal("dizionario")}
                                                className="group p-6 rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-900 text-left flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                <div>
                                                    <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-200 group-hover:bg-[#18182e] transition-all">
                                                        <BookOpen className="size-6" />
                                                    </div>
                                                    <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight">
                                                        {locale === "en" ? "Academic Dictionary" : "Dizionario Accademico"}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                                        {locale === "en"
                                                            ? "Unsure about CFU, Appello, Esse3, or verbalizzazione? Search common terms here."
                                                            : "Non conosci i termini come CFU, Appello, Esse3 o Verbalizzazione? Cercali velocemente qui."}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-wider text-[#c9041a] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                                </div>
                                            </button>

                                            {/* Sessions Countdown Card */}
                                            <button
                                                onClick={() => setActiveToolModal("countdown")}
                                                className="group p-6 rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-900 text-left flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                <div>
                                                    <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-200 group-hover:bg-[#f9a620] transition-all">
                                                        <Clock className="size-6" />
                                                    </div>
                                                    <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight">
                                                        {locale === "en" ? "Deadlines & Countdowns" : "Countdown Sessioni"}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                                        {locale === "en"
                                                            ? "Track the remaining days for official exam sessions and important UniMe deadlines."
                                                            : "Visualizza i giorni mancanti all'inizio delle sessioni d'esame e alle scadenze burocratiche."}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-wider text-[#c9041a] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                                </div>
                                            </button>

                                            {/* Grade Simulator Card */}
                                            <button
                                                onClick={() => setActiveToolModal("media")}
                                                className="group p-6 rounded-3xl border border-zinc-200/80 bg-white hover:border-zinc-900 text-left flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                            >
                                                <div>
                                                    <div className="size-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-md shadow-zinc-200 group-hover:bg-[#18182e] transition-all">
                                                        <GraduationCap className="size-6" />
                                                    </div>
                                                    <h4 className="text-lg font-serif font-black text-zinc-900 mb-2 uppercase tracking-tight">
                                                        {locale === "en" ? "GPA & Degree Simulator" : "Simulatore Media & Laurea"}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                                        {locale === "en"
                                                            ? "Simulate your weighted GPA, track ECTS credits progress, and estimate your graduation mark."
                                                            : "Simula la tua media ponderata, i crediti CFU acquisiti e stima il voto di partenza per la tesi."}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-wider text-[#c9041a] mt-6 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    {locale === "en" ? "Launch Tool" : "Apri Strumento"} &rarr;
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal for Tuition Calculator */}
            <Dialog open={activeToolModal === "tasse"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-5xl bg-white p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <TaxCalculator locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Academic Dictionary */}
            <Dialog open={activeToolModal === "dizionario"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-5xl bg-white p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <AcademicDictionary locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Sessions Countdown */}
            <Dialog open={activeToolModal === "countdown"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-5xl bg-white p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <SessionsCountdown locale={locale} />
                </DialogContent>
            </Dialog>

            {/* Modal for Grade Simulator */}
            <Dialog open={activeToolModal === "media"} onOpenChange={(open) => !open && setActiveToolModal(null)}>
                <DialogContent className="w-[95vw] md:w-full max-w-[95vw] md:max-w-5xl bg-white p-6 border-0 max-h-[90vh] overflow-x-hidden overflow-y-auto rounded-3xl shadow-2xl">
                    <GradeSimulator locale={locale} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
