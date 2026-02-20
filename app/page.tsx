import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import prisma from "@/lib/prisma" // 1. Importiamo il nostro database

export const dynamic = "force-dynamic"

// 2. Aggiungiamo 'async' alla funzione per poter aspettare i dati dal database
export default async function BrandHomePage() {

    // 3. CHIAMATA AL DATABASE: Peschiamo le vere notizie
    const ultimeNotizie = await prisma.news.findMany({
        where: { published: true },
        orderBy: { date: 'desc' }, // Dalla più recente alla più vecchia
        take: 3 // Ne prendiamo massimo 3 per la home
    });

    const prossimiEventi = await prisma.event.findMany({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        take: 3
    });

    // Content Configuration Unificata
    const content = {
        subtitle: "Passione, competenza e visione: il cuore pulsante della rappresentanza a Messina. Un network dinamico per darti voce, servizi e opportunità in tutto l'Ateneo.",
        gradient: "from-[#c12830]/80 via-purple-900/60 to-[#18182e]/90", // Gradient Morgana -> Orum
    }

    return (
        <div className="flex flex-col min-h-screen">

            {/* HERO SECTION - Carousel & New Text */}
            <section className="relative h-[600px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                {/* Background Carousel */}
                <HeroCarousel />

                {/* Overlay Gradient (Unified) */}
                <div className={`absolute inset-0 bg-gradient-to-r ${content.gradient} mix-blend-multiply opacity-90`}></div>
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Content */}
                <div className="container relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-tight mb-6 drop-shadow-lg">
                        Sempre dalla parte dello studente !
                    </h1>
                    <p className="text-lg md:text-2xl text-white/90 font-serif max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                        {content.subtitle}
                    </p>
                </div>
            </section>

            {/* HIGHLIGHTED EVENTS SECTION (Eventi in Evidenza) */}
            <section className="py-12 bg-white border-b border-border/50">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold text-black uppercase tracking-tight pl-4 border-l-4 border-primary">
                            Prossimi Eventi
                        </h2>
                        <Link href={`/events`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" >
                            Calendario Completo
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {prossimiEventi.map((evento) => (
                            <Link href={`/events/${evento.id}`} key={evento.id} className="relative group overflow-hidden bg-muted aspect-[4/3] flex items-end p-6 border-b-4 border-primary shadow-sm hover:shadow-lg transition-all block">
                                {evento.image && (
                                    <img src={evento.image} alt={evento.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 z-20 bg-white text-black text-center p-2 min-w-[3.5rem] shadow-sm">
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
                                Nessun evento programmato al momento.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* LATEST NEWS GRID - DINAMICA DAL DB */}
            <section className="py-16 bg-muted/20">
                <div className="container">
                    <div className="flex items-center justify-between mb-10 pb-4">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-primary uppercase tracking-tight">
                                Ultime Notizie
                            </h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl">
                                Non perderti le ultime iniziative:
                            </p>
                        </div>
                        <Link href={`/news`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors shrink-0 ml-4 border p-2 rounded-lg">
                            Vedi tutte
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ultimeNotizie.map((news) => (
                            <Link href={`/news/${news.id}`} key={news.id} className="group flex flex-col bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
                                {/* Image Placeholder */}
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {news.image && (
                                        <img src={news.image} alt={news.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors"></div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-bold uppercase tracking-wider">
                                        <span className="text-primary">{news.category}</span>
                                        <span>•</span>
                                        <span>{news.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                                        {news.description}
                                    </p>
                                    <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-primary">
                                        Leggi <ArrowRight className="size-3 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div >
    )
}