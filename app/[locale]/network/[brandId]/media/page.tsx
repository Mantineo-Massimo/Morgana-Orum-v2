import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import Image from "next/image"

export const dynamic = "force-dynamic"

const THEME = {
    primary: "#f9a620",
    secondary: "#27a85d",
    accent: "#1fbcd3"
}

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    if (params.brandId !== 'piazzadellarte') return {}
    return {
        title: "Media | Piazza Dell'Arte",
    }
}

export default async function MediaPage({ params }: { params: { brandId: string, locale: string } }) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    const t = await getTranslations("Navigation")

    // Placeholder images for media gallery
    const placeholders = [1, 2, 3, 4, 5, 6]

    return (
        <div className="min-h-screen pt-32 pb-24 bg-zinc-50 text-foreground relative overflow-hidden flex flex-col items-center">
            <div className="container relative z-10 w-full flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-4">
                        {t("media")}
                    </h1>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" style={{ backgroundColor: THEME.primary }}></div>
                    <p className="mt-8 text-xl text-muted-foreground font-serif max-w-2xl mx-auto">
                        Le immagini e i momenti migliori della Piazza Dell&apos;Arte. Scopri la nostra galleria in continuo aggiornamento.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {placeholders.map((i) => (
                        <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-zinc-200">
                            {/* In a real scenario, these would be real photos/videos */}
                            <Image src={`/assets/slides/${(i % 3) + 1}.jpg`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt={`Media ${i}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
