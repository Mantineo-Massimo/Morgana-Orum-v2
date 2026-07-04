import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
    const t = await getTranslations("Piazza.about")

    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-zinc-50">
                <div className="absolute inset-0 z-0 opacity-10">
                    <Image src="/assets/backgrounds/piazza.webp" fill className="object-cover grayscale" alt="" priority />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-6 text-[#27a85d]">
                            {t("title")}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                            {t("desc")}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white text-zinc-900 relative">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-stretch max-w-6xl mx-auto">
                        {/* Left Column: Cosa facciamo */}
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-widest text-[#1fbcd3] mb-6 inline-flex items-center gap-3">
                                    {t("project_title")}
                                    <div className="h-1 w-12 bg-[#1fbcd3] rounded-full"></div>
                                </h3>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    {t("project_desc")}
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#f9a620]"><Sparkles className="size-5" /></span>
                                            {t("morning_afternoon")}
                                        </h4>
                                        <p className="text-muted-foreground">{t("morning_afternoon_desc")}</p>
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#27a85d]"><Sparkles className="size-5" /></span>
                                            {t("evening")}
                                        </h4>
                                        <p className="text-muted-foreground">{t("evening_desc")}</p>
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#1fbcd3]"><Sparkles className="size-5" /></span>
                                            {t("contest")}
                                        </h4>
                                        <p className="text-muted-foreground">{t("contest_desc")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Le Associazioni & Perchè è importante */}
                        <div className="bg-[#18182e] p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#27a85d] rounded-full blur-[80px] opacity-50"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#1fbcd3] rounded-full blur-[80px] opacity-50"></div>

                            <h3 className="text-2xl font-black uppercase tracking-widest text-[#27a85d] mb-6 relative z-10">
                                {t("associations_title")}
                            </h3>
                            <p className="text-white/80 mb-8 relative z-10 text-lg">
                                {t("associations_desc")}
                            </p>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#f9a620]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">{t("assoc_morgana_orum")}</strong>
                                        <span className="text-white/70">{t("assoc_morgana_orum_desc")}</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#1fbcd3]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">{t("partners_title")}</strong>
                                        <span className="text-white/70">{t("partners_desc")}</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#27a85d]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">{t("other_realities_title")}</strong>
                                        <span className="text-white/70">{t("other_realities_desc")}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Full-width below: Perché è importante? */}
                    <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-zinc-100">
                        <h3 className="text-3xl font-black uppercase tracking-widest text-zinc-900 mb-10 text-center">
                            {t("why_important")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#1fbcd3]/10 group-hover:bg-[#1fbcd3] text-[#1fbcd3] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">1</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">{t("connection_title")}</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">{t("connection_desc")}</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#f9a620]/10 group-hover:bg-[#f9a620] text-[#f9a620] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">2</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">{t("talent_title")}</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">{t("talent_desc")}</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#27a85d]/10 group-hover:bg-[#27a85d] text-[#27a85d] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">3</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">{t("aggregation_title")}</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">{t("aggregation_desc")}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
