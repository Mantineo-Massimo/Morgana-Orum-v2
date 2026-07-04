import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { notFound } from "next/navigation"
import { Association } from "@prisma/client"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { CountdownTimer } from "@/components/widgets/countdown-timer"
import { SponsorsCarousel } from "@/components/shared/sponsors-carousel"
import { getPiazzaSettings, getPiazzaSponsors } from "@/app/actions/piazza"

export const dynamic = 'force-dynamic'

const BRAND_CONFIG = {
    piazzadellarte: {
        id: "piazzadellarte",
        name: "Piazza dell'Arte 2026",
        logo: "/assets/backgrounds/piazzadellarte.webp",
        bg: "/assets/backgrounds/piazza.webp",
        subtitle: "Il cuore pulsante della creatività studentesca.",
        desc: "Piazza Dell'Arte è il nuovo spazio dedicato alla libera espressione creativa. Un luogo dove l'arte incontra la vita studentesca, promuovendo eventi, mostre e workshop per valorizzare ogni talento.",
        association: "PIAZZA_DELLARTE" as Association,
        theme: {
            primary: "#f9a620",   // Gold (Oro)
            secondary: "#27a85d", // Verde
            accent: "#1fbcd3"    // Cyan (Azzurrino)
        }
    },
}

export async function generateMetadata(): Promise<Metadata> {
    const config = BRAND_CONFIG.piazzadellarte
    const icons = {
        icon: [
            { url: "/assets/piazzadellarte/favicon.ico" },
            { url: "/assets/piazzadellarte/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/assets/piazzadellarte/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
            { url: "/assets/piazzadellarte/apple-touch-icon.png" },
        ],
    }

    return {
        title: config.name,
        description: config.subtitle,
        openGraph: {
            title: config.name,
            description: config.subtitle,
            images: [config.logo, config.bg],
        },
        icons
    }
}

export default async function PiazzaPage({ params }: { params: { locale: string } }) {
    const { locale } = params
    const brandId = "piazzadellarte"
    const config = BRAND_CONFIG.piazzadellarte

    const [t, tb, settings, piazzaSponsors] = await Promise.all([
        getTranslations("Network"),
        getTranslations("Brands"),
        getPiazzaSettings(),
        getPiazzaSponsors()
    ])

    // Dynamic brand config for Piazza
    const dynamicConfig = { ...config }
    dynamicConfig.name = `Piazza dell'Arte ${settings.year}`

    return (
        <div className="flex flex-col min-h-screen">
            {/* SUB-SITE HERO */}
            <section className="relative min-h-[600px] lg:min-h-[700px] w-full bg-slate-900 flex items-center justify-center overflow-hidden py-16">
                <Image src={dynamicConfig.bg} fill className="object-cover opacity-40 shadow-inner" alt="" sizes="100vw" priority />

                {/* Overlay Personalizzato per il Brand */}
                <div
                    className="absolute inset-0 opacity-95 mix-blend-multiply"
                    style={{
                        background: `linear-gradient(to right, ${dynamicConfig.theme.primary}CC, ${dynamicConfig.theme.secondary}E6)`
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="container relative z-10 flex flex-col items-center">
                    <div className="size-32 md:size-48 flex items-center justify-center overflow-hidden p-4 mb-8 transform hover:rotate-3 transition-transform duration-500">
                        <Image src={dynamicConfig.logo} width={180} height={180} className="w-full h-full object-contain" alt={dynamicConfig.name} />
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white text-center leading-tight mb-4 drop-shadow-2xl uppercase tracking-tighter">
                        {dynamicConfig.name}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 font-serif max-w-2xl text-center leading-relaxed drop-shadow-md italic mb-4">
                        &ldquo;{tb(`${brandId}.subtitle` as any)}&rdquo;
                    </p>

                    <div className="mt-8 mb-4">
                        <CountdownTimer targetDate={settings.eventDate ? new Date(settings.eventDate) : new Date(`${settings.year}-05-22T09:00:00`)} />
                    </div>

                    <a 
                        href={locale === 'it' ? 'https://www.morganaorum.it' : `https://www.morganaorum.it/${locale}`}
                        className="mt-8 md:mt-10 mb-8 md:mb-16 flex items-center gap-2 text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 group text-sm md:text-base font-bold uppercase tracking-widest shadow-xl"
                    >
                        <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                        {t("back_link")}
                    </a>
                </div>
            </section>

            {/* COS'E SECTION (SUMMARY) */}
            <section id="cos-e" className="py-24 bg-white text-zinc-900 relative overflow-hidden">
                <div className="container relative z-10 text-center">
                    <div className="max-w-4xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter mb-6 text-[#27a85d]">
                            Cos&apos;è la Piazza dell&apos;Arte?
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                            La <strong>Piazza dell&apos;Arte</strong> è un importante evento socio-culturale che si svolge a Messina, organizzato principalmente dall&apos;Associazione Universitaria Morgana e O.R.U.M. È diventato uno degli appuntamenti più attesi della primavera messinese, capace di trasformare gli spazi accademici in un palcoscenico a cielo aperto.
                        </p>
                    </div>
                    <Link href="/piazzadellarte/about" className="inline-flex items-center gap-3 bg-[#27a85d] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#1f874a] transition-all duration-300 group shadow-xl hover:-translate-y-1 text-sm md:text-base">
                        Scopri di più <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* ESPLORA SECTION — links to dedicated pages */}
            <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
                {/* Glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-10 pointer-events-none" style={{ backgroundColor: config.theme.primary }}></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[160px] opacity-10 pointer-events-none" style={{ backgroundColor: config.theme.accent }}></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-4">
                            Esplora
                        </h2>
                        <div className="w-24 h-1.5 mx-auto rounded-full" style={{ backgroundColor: config.theme.primary }}></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Programma */}
                        <Link href="/piazzadellarte/programma" className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <Image src="/assets/backgrounds/programma.webp" fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" alt="Programma" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: config.theme.primary, color: "#18182e" }}>
                                        Programma
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-black uppercase tracking-wide text-white mb-2" style={{ color: config.theme.primary }}>Il Programma</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">Mattino, pomeriggio e sera: scopri tutti gli appuntamenti della giornata divisi per fascia oraria.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group-hover:gap-3" style={{ color: config.theme.primary }}>
                                    Scopri <ArrowRight className="size-4" />
                                </span>
                            </div>
                        </Link>

                        {/* Artisti */}
                        <Link href="/piazzadellarte/artisti" className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <Image src="/assets/backgrounds/artisti.webp" fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" alt="Artisti" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: config.theme.secondary, color: "#fff" }}>
                                        Artisti
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-black uppercase tracking-wide mb-2" style={{ color: config.theme.secondary }}>Gli Artisti</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">Musica, danza, pittura e performance. Scopri i talenti che si esibiranno sul palco e nel cortile.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group-hover:gap-3" style={{ color: config.theme.secondary }}>
                                    Scopri <ArrowRight className="size-4" />
                                </span>
                            </div>
                        </Link>

                        {/* Media */}
                        <Link href="/piazzadellarte/media" className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            <div className="relative aspect-video overflow-hidden">
                                <Image src="/assets/slides/3.webp" fill className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70" alt="Media" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: config.theme.accent, color: "#18182e" }}>
                                        Media
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-black uppercase tracking-wide mb-2" style={{ color: config.theme.accent }}>Media</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">Esibizioni, interviste esclusive e la galleria fotografica dei momenti più belli dell&apos;evento.</p>
                                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group-hover:gap-3" style={{ color: config.theme.accent }}>
                                    Scopri <ArrowRight className="size-4" />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SPONSORS SECTION */}
            <SponsorsCarousel sponsors={piazzaSponsors} />
        </div>
    )
}
