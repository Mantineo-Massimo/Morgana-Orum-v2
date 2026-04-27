import { Cookie, ShieldAlert, Settings, Info, MousePointer2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function CookiePage() {
    const t = useTranslations("Cookie")

    const sections = [
        { id: "intro", icon: Info },
        { id: "technical", icon: Cookie },
        { id: "analytics", icon: MousePointer2 },
        { id: "management", icon: Settings },
    ]

    return (
        <main className="min-h-screen bg-[#fafafa] pt-32 pb-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[20%] left-[-5%] w-[30%] h-[30%] bg-zinc-200/50 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-zinc-200">
                        <Cookie className="size-3" />
                        <span>{t("title")}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter mb-8 text-zinc-900">
                        Cookie Policy
                    </h1>
                    <p className="text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        {t("intro")}
                    </p>
                </div>

                {/* Grid Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, idx) => (
                        <section 
                            key={section.id}
                            className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-10"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="size-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500 mb-8">
                                <section.icon className="size-6" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                                    {t(`${section.id}_title`)}
                                </h2>
                                <div className="prose prose-zinc prose-sm text-zinc-500 leading-relaxed font-medium">
                                    {t.rich(`${section.id}_desc`, {
                                        p: (chunks) => <p className="mb-4">{chunks}</p>,
                                        b: (chunks) => <strong className="text-zinc-900">{chunks}</strong>,
                                        li: (chunks) => <li className="ml-4 list-disc mb-1">{chunks}</li>,
                                        ul: (chunks) => <ul className="mb-4">{chunks}</ul>
                                    })}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Final Alert */}
                <div className="mt-12 bg-zinc-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-8 animate-in fade-in zoom-in duration-1000">
                    <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <ShieldAlert className="size-8 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">Sicurezza e Trasparenza</h3>
                        <p className="text-white/60 text-sm leading-relaxed">
                            L&apos;Associazione Morgana e l&apos;Associazione O.R.U.M. si impegnano a garantire la massima trasparenza sull&apos;uso dei tuoi dati. Per qualsiasi dubbio, contattaci tramite la pagina dedicata.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
