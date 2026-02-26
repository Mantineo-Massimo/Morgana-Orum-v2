import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowRight, Calendar, ChevronLeft } from "lucide-react"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Association } from "@prisma/client"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    const config = BRAND_CONFIG[params.brandId as keyof typeof BRAND_CONFIG]
    if (!config) return {}

    return {
        title: config.name,
        description: config.subtitle,
        openGraph: {
            title: config.name,
            description: config.subtitle,
            images: [config.logo, config.bg],
        }
    }
}

const BRAND_CONFIG: Record<string, { id: string, name: string, logo: string, bg: string, subtitle: string, desc: string, association: Association }> = {
    unimhealth: {
        id: "unimhealth",
        name: "Unimhealth",
        logo: "/assets/unimhealth.png",
        bg: "/assets/policlinico.png",
        subtitle: "L'eccellenza della rappresentanza nell'area medico-sanitaria.",
        desc: "Unimhealth è l'anima del network dedicata agli studenti dell'area biomedica e sanitaria. Ci impegniamo ogni giorno per garantire una formazione di qualità e servizi all'altezza delle sfide del futuro medico.",
        association: Association.UNIMHEALTH
    },
    economia: {
        id: "studentieconomia",
        name: "Studenti Economia",
        logo: "/assets/studentieconomia.png",
        bg: "/assets/economia.png",
        subtitle: "Protagonisti del cambiamento nell'area economica e giuridica.",
        desc: "Studenti Economia rappresenta il punto di riferimento per chi vive il Dipartimento di Economia. Passione, competenza e un forte spirito di gruppo al servizio della crescita accademica e professionale.",
        association: Association.ECONOMIA
    },
    matricole: {
        id: "unimematricole",
        name: "Unime Matricole",
        logo: "/assets/unimematricole.png",
        bg: "/assets/matricole.png",
        subtitle: "Il tuo primo passo sicuro nel mondo universitario.",
        desc: "Siamo qui per guidare i nuovi studenti nel loro ingresso in Ateneo. Dall'orientamento burocratico al supporto didattico, Unime Matricole è il tuo miglior alleato fin dal primo giorno.",
        association: Association.MATRICOLE
    },
    scipog: {
        id: "studentiscipog",
        name: "Studenti Scipog",
        logo: "/assets/studentiscipog.png",
        bg: "/assets/scipog.png",
        subtitle: "La voce degli studenti tra Scienze Politiche e Giuridiche.",
        desc: "Passione civile e impegno costante definiscono Studenti Scipog. Lavoriamo per un dipartimento inclusivo, dinamico e capace di valorizzare il percorso di ogni singolo studente.",
        association: Association.SCIPOG
    },
    dicam: {
        id: "insidedicam",
        name: "Inside Dicam",
        logo: "/assets/insidedicam.png",
        bg: "/assets/dicam.png",
        subtitle: "Creatività e cultura: l'anima del Dipartimento DICAM.",
        desc: "Inside Dicam è la realtà di riferimento per gli studenti dell'area umanistica. Promuoviamo la cultura, l'arte e il dialogo, garantendo una rappresentanza attenta alle esigenze di ogni corso di laurea.",
        association: Association.INSIDE_DICAM
    },
}

export default async function NetworkSubPage({ params }: { params: { brandId: string, locale: string } }) {
    const { brandId, locale } = params
    const config = BRAND_CONFIG[brandId as keyof typeof BRAND_CONFIG]

    if (!config) notFound()

    const t = await getTranslations("Network")
    const tb = await getTranslations("Brands")
    const te = await getTranslations("Events")
    const th = await getTranslations("HomePage")
    const ts = await getTranslations("Search")

    const notizie = await prisma.news.findMany({
        where: {
            published: true,
            associations: { has: config.association }
        },
        orderBy: { date: 'desc' },
        take: 3
    });

    const eventi = await prisma.event.findMany({
        where: {
            date: { gte: new Date() },
            associations: { has: config.association }
        },
        orderBy: { date: 'asc' },
        take: 3
    });

    return (
        <div className="flex flex-col min-h-screen">
            {/* SUB-SITE HERO */}
            <section className="relative h-[600px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <Image src={config.bg} fill className="object-cover opacity-40 shadow-inner" alt="" sizes="100vw" priority />

                {/* Overlay Personalizzato per il Brand */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-background/90 mix-blend-multiply opacity-95"></div>
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="container relative z-10 flex flex-col items-center">
                    <div className="size-32 md:size-48 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/20 p-4 mb-8 transform hover:rotate-3 transition-transform duration-500">
                        <Image src={config.logo} width={180} height={180} className="w-full h-full object-contain" alt={config.name} />
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white text-center leading-tight mb-4 drop-shadow-2xl uppercase tracking-tighter">
                        {config.name}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 font-serif max-w-2xl text-center leading-relaxed drop-shadow-md italic">
                        &ldquo;{tb(`${brandId}.subtitle` as any)}&rdquo;
                    </p>

                    <Link href="/" className="mt-10 flex items-center gap-2 text-white/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 group text-sm md:text-base font-bold uppercase tracking-widest shadow-xl">
                        <ChevronLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
                        {t("back_link")}
                    </Link>
                </div>
            </section>

            {/* CHI SIAMO SNAPSHOT */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-8 uppercase tracking-widest">
                            {t("passion_title")}
                        </h2>
                        <div className="w-24 h-1.5 bg-primary mx-auto mb-10 rounded-full"></div>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                            {tb(`${brandId}.desc` as any)}
                        </p>
                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <div className="bg-muted px-8 py-6 rounded-2xl border border-border/50 text-center flex-1 min-w-[200px]">
                                <span className="block text-4xl font-black text-primary mb-1">100%</span>
                                <span className="text-sm uppercase tracking-widest font-bold opacity-70">{t("dedication")}</span>
                            </div>
                            <div className="bg-muted px-8 py-6 rounded-2xl border border-border/50 text-center flex-1 min-w-[200px]">
                                <span className="block text-4xl font-black text-primary mb-1">H24</span>
                                <span className="text-sm uppercase tracking-widest font-bold opacity-70">{t("support")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </section>

            {/* EVENTI E NOTIZIE CONDIZIONALI */}
            {brandId !== "matricole" && (
                <>
                    {/* EVENTI ASSOCIATION */}
                    <section className="py-20 bg-zinc-50 border-y border-border/50">
                        <div className="container">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground uppercase tracking-tighter leading-none mb-2">
                                        {te("upcoming")}
                                    </h2>
                                    <div className="h-1.5 w-full bg-primary rounded-full"></div>
                                </div>
                                <Link href={`/network/${brandId}/events`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                                    {te("tab_past")} <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {eventi.map((evento: any) => (
                                    <Link href={`/network/${brandId}/events/${evento.id}`} key={evento.id} className="relative group overflow-hidden bg-muted aspect-[4/5] flex items-end p-8 border-b-8 border-primary shadow-2xl hover:-translate-y-2 transition-all duration-500 block rounded-2xl">
                                        {evento.image && (
                                            <Image src={evento.image} alt={evento.title} fill className="object-cover z-0 group-hover:scale-110 transition-transform duration-700" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"></div>

                                        {/* Date Badge Overlay */}
                                        <div className="absolute top-6 left-6 z-20 bg-white text-foreground text-center p-3 rounded-xl shadow-2xl transform group-hover:scale-110 transition-transform">
                                            <span className="block text-xs font-black uppercase text-primary">
                                                {evento.date.toLocaleDateString(locale, { month: 'short' })}
                                            </span>
                                            <span className="block text-3xl font-black leading-none">
                                                {evento.date.toLocaleDateString(locale, { day: '2-digit' })}
                                            </span>
                                        </div>

                                        <div className="relative z-20 text-white w-full">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-3 block">
                                                {evento.category}
                                            </span>
                                            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                {evento.title}
                                            </h3>
                                            <div className="mt-4 pt-4 border-t border-white/20 text-xs flex items-center justify-between gap-2 opacity-80">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-3" /> {evento.location}
                                                </div>
                                                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {eventi.length === 0 && (
                                    <div className="md:col-span-3 text-center py-20 text-muted-foreground bg-white rounded-3xl border-2 border-dashed border-border/50">
                                        {t("no_events")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* NOTIZIE ASSOCIATION */}
                    <section className="py-24 bg-zinc-50 border-y border-border/50 relative">
                        <div className="container">
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex flex-col">
                                    <h2 className="text-3xl md:text-4xl font-serif font-black text-foreground uppercase tracking-tighter leading-none mb-2">
                                        {th("news_title")}
                                    </h2>
                                    <div className="h-1.5 w-full bg-primary rounded-full"></div>
                                </div>
                                <Link href={`/network/${brandId}/news`} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                                    {th("news_all")} <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-3 gap-10">
                                {notizie.map((news: any) => (
                                    <Link href={`/network/${brandId}/news/${news.id}`} key={news.id} className="group block">
                                        <div className="relative aspect-video overflow-hidden rounded-2xl mb-6 shadow-lg border border-border/50">
                                            {news.image ? (
                                                <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <Image src={config.logo} width={64} height={64} className="opacity-20" alt="" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                {news.category || "General"}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                                                {news.date.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
                                            </span>
                                            <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {news.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                                {news.description}
                                            </p>
                                            <div className="pt-2">
                                                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                                                    {ts("read_more")} <ArrowRight className="size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                                {notizie.length === 0 && (
                                    <div className="md:col-span-3 text-center py-20 text-muted-foreground bg-zinc-50 rounded-3xl border border-zinc-100">
                                        {t("no_news")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* UNISCITI A NOI */}
            <section className="py-24 bg-[#18182e] text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <Image src="/assets/slides/1.jpg" fill className="object-cover grayscale" alt="" sizes="100vw" />
                </div>
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>

                <div className="container relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-serif font-black mb-6 uppercase tracking-tighter">
                            {t("join_title")}
                        </h2>
                        <p className="text-xl text-white/80 mb-12 font-serif font-light leading-relaxed">
                            {t("join_desc", { name: config.name })}
                        </p>
                        <Link href="/about" className="inline-flex items-center gap-3 bg-white text-zinc-900 border-2 border-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-transparent hover:text-white transition-all duration-300 group shadow-2xl text-sm md:text-base">
                            {t("learn_more")} <ArrowRight className="size-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
