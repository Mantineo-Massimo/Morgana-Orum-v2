"use client"

import {
    BookOpen,
    Heart,
    ShieldCheck,
    Bus,
    CreditCard,
    Info,
    ExternalLink,
    GraduationCap,
    Home,
    Wifi
} from "lucide-react"
import { Link } from "@/i18n/routing"

const ICON_MAP: Record<string, any> = {
    BookOpen,
    Heart,
    ShieldCheck,
    Bus,
    CreditCard,
    Info,
    GraduationCap,
    Home,
    Wifi
}

interface ServicesGuideProps {
    categories: any[]
    locale: string
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
    it: {
        footerTitle: "Hai dubbi su una procedura?",
        footerText: "I nostri rappresentanti sono pronti ad assisterti nel dialogo con le segreterie e con gli uffici d'Ateneo. Non esitare a contattarci.",
        officialSite: "Sito Ufficiale UniMe",
        contactReps: "Contatta Rappresentanti"
    },
    en: {
        footerTitle: "Have doubts about a procedure?",
        footerText: "Our representatives are ready to assist you in communicating with secretariats and university offices. Do not hesitate to contact us.",
        officialSite: "UniMe Official Site",
        contactReps: "Contact Representatives"
    }
}

export function ServicesGuide({ categories, locale }: ServicesGuideProps) {
    const t = TRANSLATIONS[locale] || TRANSLATIONS.it

    const getCategoryTitle = (c: any) => (locale === "en" && c.titleEn) ? c.titleEn : c.title
    const getItemName = (item: any) => (locale === "en" && item.nameEn) ? item.nameEn : item.name
    const getItemDesc = (item: any) => (locale === "en" && item.descriptionEn) ? item.descriptionEn : (item.description || item.desc)

    return (
        <div className="space-y-12">
            {/* Quick Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((s) => {
                    const titleText = getCategoryTitle(s)
                    // Extract just the textual part if it has a number prefix like "1. Servizi..."
                    const navLabel = titleText.includes(". ") ? titleText.split(". ")[1] : titleText
                    return (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="px-4 py-2 bg-white rounded-full border border-zinc-200 text-xs font-bold text-zinc-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all uppercase tracking-widest"
                        >
                            {navLabel}
                        </a>
                    )
                })}
            </div>

            {/* Services Sections */}
            <div className="space-y-12">
                {categories.map((section) => {
                    const Icon = ICON_MAP[section.icon] || Info
                    const sectionTitle = getCategoryTitle(section)
                    return (
                        <section key={section.id} id={section.id} className="scroll-mt-32">
                            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden p-8 md:p-12 relative group hover:shadow-xl transition-shadow duration-500">
                                <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 relative z-10">
                                    <div className="shrink-0">
                                        <div className="size-16 md:size-20 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Icon className="size-8 md:size-10" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground mb-8 uppercase tracking-tight">
                                            {sectionTitle}
                                        </h2>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {section.items?.map((item: any, i: number) => {
                                                const itemName = getItemName(item)
                                                const itemDesc = getItemDesc(item)
                                                const Content = (
                                                    <>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-black text-foreground text-sm uppercase tracking-tight group-hover/item:text-orange-600 transition-colors">
                                                                {itemName}
                                                            </h4>
                                                            {item.href && <ExternalLink className="size-3 text-zinc-300 group-hover/item:text-orange-400 transition-colors" />}
                                                        </div>
                                                        <p className="text-zinc-500 text-sm leading-relaxed">
                                                            {itemDesc}
                                                        </p>
                                                    </>
                                                )

                                                if (item.href) {
                                                    return (
                                                        <a
                                                            key={i}
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block p-6 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:bg-white hover:border-orange-100 transition-all group/item shadow-sm hover:shadow-md"
                                                        >
                                                            {Content}
                                                        </a>
                                                    )
                                                }

                                                return (
                                                    <div key={i} className="p-6 rounded-3xl bg-zinc-50/50 border border-zinc-100 transition-all">
                                                        {Content}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Background Element */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                                    <Icon className="size-48 md:size-64" />
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>

            {/* Footer Alert */}
            <div className="mt-20">
                <div className="bg-zinc-900 rounded-[40px] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <Info className="size-12 text-orange-400 mx-auto mb-6" />
                        <h3 className="text-2xl md:text-4xl font-serif font-black mb-6 uppercase tracking-tight">
                            {t.footerTitle}
                        </h3>
                        <p className="text-zinc-400 text-lg mb-8">
                            {t.footerText}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="https://www.unime.it/didattica/servizi-e-agevolazioni"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-zinc-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 transition-colors flex items-center gap-2"
                            >
                                {t.officialSite} <ExternalLink className="size-4" />
                            </a>
                            <Link
                                href="/representatives"
                                className="bg-zinc-800 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 transition-colors border border-zinc-700"
                            >
                                {t.contactReps}
                            </Link>
                        </div>
                    </div>
                    {/* Blur Background */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-orange-400/20 blur-[100px] rounded-full"></div>
                </div>
            </div>
        </div>
    )
}
