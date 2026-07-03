import { getTranslations } from "next-intl/server"
import { FileText, Shield, Scale, HelpCircle, AlertTriangle, PenTool, Info } from "lucide-react"

export default async function TermsPage() {
    const t = await getTranslations("Terms")

    const sections = [
        { id: "general", icon: Info },
        { id: "services", icon: HelpCircle },
        { id: "user_rules", icon: PenTool },
        { id: "intellectual_property", icon: Shield },
        { id: "liability", icon: AlertTriangle },
        { id: "modifications", icon: FileText },
        { id: "governing_law", icon: Scale },
    ]

    return (
        <main className="min-h-screen bg-[#fafafa] pt-32 pb-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 max-w-5xl">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="size-20 bg-slate-500/10 text-slate-600 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Scale className="size-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        {t("title")}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        {t("intro")}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        <div className="w-12 h-px bg-zinc-200" />
                        <span>{t("last_update")}</span>
                        <div className="w-12 h-px bg-zinc-200" />
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <section
                            key={section.id}
                            className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="size-16 rounded-3xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 shrink-0">
                                    <section.icon className="size-8" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                                        {t(`${section.id}_title`)}
                                    </h2>
                                    <div className="prose prose-zinc max-w-none text-zinc-500 leading-relaxed font-medium">
                                        {t.rich(`${section.id}_desc`, {
                                            p: (chunks) => <p className="mb-4">{chunks}</p>,
                                            b: (chunks) => <strong className="text-zinc-900">{chunks}</strong>,
                                            li: (chunks) => <li className="ml-4 list-disc mb-1">{chunks}</li>,
                                            ul: (chunks) => <ul className="mb-4">{chunks}</ul>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    )
}
