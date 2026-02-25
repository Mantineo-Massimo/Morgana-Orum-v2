import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import prisma from "@/lib/prisma"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function BrandHomePage() {
    const t = await getTranslations("HomePage")

    // CHIAMATA AL DATABASE: Peschiamo le vere notizie
    const ultimeNotizie = await prisma.news.findMany({
        where: { published: true },
        orderBy: { date: 'desc' },
        take: 3
    });

    const prossimiEventi = await prisma.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 3
    });

    // Content Configuration Unificata
    const content = {
        gradient: "from-[#c12830]/80 to-[#18182e]/90",
    }

    return (
        <div className="flex flex-col min-h-screen">

            {/* HERO SECTION - Carousel & New Text */}
            <section className="relative h-[600px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <HeroCarousel />
                <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} mix-blend-multiply opacity-90`}></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="container relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-tight mb-6 drop-shadow-lg">
                        {t("hero_title")}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 font-serif max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                        {t("hero_subtitle")}
                    </p>
                </div>
            </section>

            {/* HIGHLIGHTED EVENTS SECTION */}
            <section className="py-12 bg-white border-b border-border/50">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold text-foreground uppercase tracking-tight pl-4 border-l-4 border-primary">
                            {t("events_title")}
                        </h2>
                        <Link href={`/events`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" >
                            {t("events_all")}
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {prossimiEventi.map((evento) => (
                            <Link href={`/events/${evento.id}`} key={evento.id} className="relative group overflow-hidden bg-muted aspect-[4/3] flex items-end p-6 border-b-4 border-primary shadow-sm hover:shadow-lg transition-all block">
                                {evento.image && (
                                    <Image src={evento.image} alt={evento.title} fill className="object-cover z-0" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                                <div className="absolute top-4 left-4 z-20 bg-white text-foreground text-center p-2 min-w-[3.5rem] shadow-sm">
                                    <span className="block text-xs font-bold uppercase text-muted-foreground">
                                        {evento.date.toLocaleDateString('it-IT', { month: 'short' })}
                                    </span>
                                    <span className="block text-2xl font-black leading-none">
                                        {evento.date.toLocaleDateString('it-IT', { day: '2-digit' })}
                                    </span>
                                </div>

                                <div className="relative z-20 text-white mt-auto">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80 bg-primary px-2 py-0.5 mb-2 inline-block">
                                        {evento.category}
                                    </span>
                                    <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-primary underline-offset-4">
                                        {evento.title}
                                    </h3>
                                    <div className="mt-2 text-xs flex items-center gap-2 opacity-80">
                                        <Calendar className="size-3" /> {evento.location}
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {prossimiEventi.length === 0 && (
                            <div className="md:col-span-3 text-center py-12 text-zinc-500 bg-zinc-50 rounded-2xl border border-zinc-100">
                                {t("events_empty")}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* RECENT NEWS SECTION */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="flex items-end justify-between mb-12">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tighter">
                                {t("news_title")}
                            </h2>
                            <div className="h-1.5 w-24 bg-primary rounded-full"></div>
                        </div>
                        <Link href="/news" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary hover:gap-4 transition-all group">
                            {t("news_all")} <ArrowRight className="size-4 group-hover:animate-pulse" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ultimeNotizie.map((news) => (
                            <Link href={`/news/${news.id}`} key={news.id} className="group cursor-pointer">
                                <div className="relative h-64 w-full overflow-hidden rounded-3xl mb-6 shadow-xl ring-1 ring-black/5">
                                    <Image
                                        src={news.image || "/assets/morgana.png"}
                                        alt={news.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
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
                                        <Calendar className="size-3" /> {news.date.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
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
                </div>
            </section>

            {/* OUR NETWORK SECTION */}
            <section className="bg-[#18182e] border-b border-white/5 relative z-0">
                <div className="relative h-[180px] md:h-[280px] flex items-center justify-center overflow-hidden">
                    <Image src="/assets/unime.png" fill className="object-cover opacity-20" alt="" sizes="100vw" />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                    <div className="container relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-14 px-6 text-center">
                        <Image src="/assets/morgana.png" width={112} height={112} className="h-12 sm:h-20 md:h-28 w-auto object-contain drop-shadow-2xl" alt="Morgana" />
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            {t("network_title")}
                        </h2>
                        <Image src="/assets/orum.png" width={112} height={112} className="h-12 sm:h-20 md:h-28 w-auto object-contain drop-shadow-2xl" alt="O.R.U.M." />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row h-auto md:h-[450px] overflow-hidden">
                    <Link href="/network/unimhealth" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#c9041a] overflow-hidden md:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)] z-40 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/policlinico.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:pr-20">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/unimhealth.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unimhealth" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/network/economia" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#202549] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-30 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/economia.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/studentieconomia.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Economia" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/network/matricole" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#f6f6f6] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-20 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/matricole.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/unimematricole.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unime Matricole" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/network/scipog" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#fbc363] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-10 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/scipog.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/studentiscipog.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Scipog" />
                            </div>
                        </div>
                    </Link>

                    <Link href="/network/dicam" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#f34ab4] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)] md:-ml-[8%] z-0 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/dicam.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:pl-20">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/insidedicam.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Inside Dicam" />
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </div >
    )
}
