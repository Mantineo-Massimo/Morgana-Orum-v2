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
        title: "Artisti | Piazza Dell'Arte",
    }
}

export default async function ArtistiPage({ params }: { params: { brandId: string, locale: string } }) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    const navT = await getTranslations("Navigation")

    return (
        <div className="min-h-screen pt-32 pb-24 bg-zinc-50 text-foreground relative overflow-hidden flex flex-col items-center">
            <div className="container relative z-10 w-full flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-4">
                        {navT("artisti")}
                    </h1>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" style={{ backgroundColor: THEME.primary }}></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-zinc-200">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute inset-0 flex items-end p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                <div className="text-white">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1 block">Live Performance</span>
                                    <h3 className="text-xl font-bold uppercase leading-tight">Artista {i}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center max-w-xl mx-auto">
                    <p className="text-xl text-muted-foreground font-serif italic mb-8">
                        Molti altri talenti si alterneranno sul palco e nel cortile...
                    </p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        </div>
    )
}
