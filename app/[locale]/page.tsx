import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { getNews } from "@/app/actions/news"
import { getAllEvents } from "@/app/actions/events"
import { Association } from "@prisma/client"
import { getTranslations } from "next-intl/server"
import { PiazzaTeaserBanner } from "@/components/piazza-teaser-banner"
import { EventCard } from "@/components/event-card"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { NextDeadlineWidget } from "@/components/next-deadline-widget"


export const dynamic = "force-dynamic"
export default async function BrandHomePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations("HomePage")
    const sessionEmail = cookies().get("session_email")?.value || null

    // Content Configuration Unificata
    const content = {
        gradient: "from-[#c12830]/80 to-[#18182e]/90",
    }

    return (
        <div className="flex flex-col min-h-screen">

            {/* HERO SECTION - Carousel & New Text */}
            <section className="relative min-h-[500px] md:h-[600px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <HeroCarousel />
                <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} mix-blend-multiply opacity-90`}></div>
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="container relative z-10 text-center px-4 py-20">
                    <h1 className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl font-serif font-bold text-white leading-[1.1] mb-6 tracking-tight text-balance antialiased drop-shadow-sm">
                        {t("hero_title")}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 font-serif max-w-4xl mx-auto leading-relaxed antialiased drop-shadow-sm">
                        {t("hero_subtitle")}
                    </p>
                </div>
            </section>

            <NextDeadlineWidget locale={locale} />


            {/* HIGHLIGHTED EVENTS SECTION */}
            <section className="py-16 md:py-20 bg-white border-b border-border/50">
                <div className="container px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tighter">
                                {t("events_title")}
                            </h2>
                            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                        </div>
                        <Link href="/events" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
                            {t("events_all")} <ArrowRight className="size-4 group-hover:animate-pulse" />
                        </Link>
                    </div>

                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-100 rounded-2xl"></div>)}
                    </div>}>
                        <EventsList locale={locale} />
                    </Suspense>
                </div>
            </section>

            {/* PIAZZA DELL'ARTE TEASER */}
            <PiazzaTeaserBanner />

            {/* RECENT NEWS SECTION */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tighter">
                                {t("news_title")}
                            </h2>
                            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                        </div>
                        <Link href="/news" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
                            {t("news_all")} <ArrowRight className="size-4 group-hover:animate-pulse" />
                        </Link>
                    </div>

                    <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-zinc-100 rounded-3xl"></div>)}
                    </div>}>
                        <NewsList locale={locale} />
                    </Suspense>
                </div>
            </section>

        </div>
    )
}

async function EventsList({ locale }: { locale: string }) {
    const t = await getTranslations("HomePage")
    const sessionEmail = cookies().get("session_email")?.value || null
    const prossimiEventi = await getAllEvents(sessionEmail, Association.MORGANA_ORUM, 'upcoming', locale).then(events => events.slice(0, 3))

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {prossimiEventi.map((evento) => (
                <EventCard
                    key={evento.id}
                    event={evento}
                    locale={locale}
                    href={`/events/${evento.id}`}
                />
            ))}
            {prossimiEventi.length === 0 && (
                <div className="md:col-span-3 text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-100">
                    {t("events_empty")}
                </div>
            )}
        </div>
    )
}

async function NewsList({ locale }: { locale: string }) {
    const t = await getTranslations("HomePage")
    const ultimeNotizie = await getNews(undefined, undefined, Association.MORGANA_ORUM, locale).then(news => news.slice(0, 3))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ultimeNotizie.map((news) => (
                <Link href={`/news/${news.id}`} key={news.id} className="group cursor-pointer">
                    <div className="relative h-64 w-full overflow-hidden rounded-3xl mb-6 shadow-xl ring-1 ring-black/5">
                        <Image
                            src={news.image || "/assets/morgana.webp"}
                            alt={news.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="text-[10px] font-bold uppercase tracking-widest bg-primary px-2 py-1 inline-block mb-2">
                                {news.category}
                            </div>
                        </div>
                    </div>
                    <div className="px-2">
                        <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-2">
                            <Calendar className="size-3" /> {news.date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <h3 className="text-xl font-serif font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {news.title}
                        </h3>
                        <p className="mt-2 text-xs opacity-80 line-clamp-2">
                            {news.description}
                        </p>
                    </div>
                </Link>
            ))}
            {ultimeNotizie.length === 0 && (
                <div className="md:col-span-3 text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-100">
                    {t("news_empty")}
                </div>
            )}
        </div>
    )
}