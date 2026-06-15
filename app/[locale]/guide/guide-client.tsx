"use client"

import { useState } from "react"
import { BookOpen, Bus, Info, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import nextDynamic from "next/dynamic"
import { ServicesGuide } from "@/components/services-guide"
import { TransportGuide } from "@/components/transport-guide"

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
                            <div className="space-y-8">
                                {activeGuideData.steps.map((step: any, index: number) => (
                                    <div key={index} className="flex gap-6 items-start">
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
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
