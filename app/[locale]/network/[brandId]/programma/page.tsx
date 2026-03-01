import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    if (params.brandId !== 'piazzadellarte') return {}
    return {
        title: "Programma | Piazza Dell'Arte",
    }
}

export default async function ProgrammaPage({ params }: { params: { brandId: string, locale: string } }) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    const tb = await getTranslations("Brands")

    return (
        <div className="min-h-screen pt-32 pb-24 bg-zinc-950 text-white overflow-hidden relative">
            <div className="container relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-4">
                        {tb("piazzadellarte.schedule_title" as any)}
                    </h1>
                    <div className="w-24 h-1.5 bg-accent mx-auto rounded-full" style={{ backgroundColor: THEME.accent }}></div>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="group bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                        <div className="size-12 rounded-2xl mb-6 flex items-center justify-center text-2xl font-black shadow-lg" style={{ backgroundColor: THEME.primary }}>
                            01
                        </div>
                        <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest" style={{ color: THEME.primary }}>Mattina & Pomeriggio</h3>
                        <p className="text-lg text-white/70 leading-relaxed font-serif">
                            {tb("piazzadellarte.schedule_morning" as any)}
                        </p>
                    </div>
                    <div className="group bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-500">
                        <div className="size-12 rounded-2xl mb-6 flex items-center justify-center text-2xl font-black shadow-lg" style={{ backgroundColor: THEME.secondary }}>
                            02
                        </div>
                        <h3 className="text-2xl font-bold mb-4 uppercase tracking-widest" style={{ color: THEME.secondary }}>Dalla Sera a Notte</h3>
                        <p className="text-lg text-white/70 leading-relaxed font-serif">
                            {tb("piazzadellarte.schedule_night" as any)}
                        </p>
                    </div>
                </div>
            </div>
            {/* Abstract background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle, ${THEME.primary}, transparent)` }}></div>
        </div>
    )
}
