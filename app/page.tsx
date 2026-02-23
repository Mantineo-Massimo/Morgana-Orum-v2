import Link from "next/link"
import Image from "next/image"
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
        gradient: "from-[#c12830]/80 to-[#18182e]/90", // Gradient Morgana -> Orum
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
                        <h2 className="text-3xl font-serif font-bold text-foreground uppercase tracking-tight pl-4 border-l-4 border-primary">
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
                                    <Image src={evento.image} alt={evento.title} fill className="object-cover z-0" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                                {/* Date Badge */}
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
                                Nessun evento programmato al momento.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* LATEST NEWS GRID - DINAMICA DAL DB */}
            <section className="py-16 bg-muted/20 border-b border-border/50">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold text-foreground uppercase tracking-tight pl-4 border-l-4 border-primary">
                            Ultime Notizie
                        </h2>
                        <Link href={`/news`} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline" >
                            Tutte le Notizie
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {ultimeNotizie.map((news) => (
                            <Link href={`/news/${news.id}`} key={news.id} className="relative group overflow-hidden bg-muted aspect-[4/3] flex items-end p-6 border-b-4 border-primary shadow-sm hover:shadow-lg transition-all block">
                                {news.image && (
                                    <Image src={news.image} alt={news.title} fill className="object-cover z-0" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

                                <div className="relative z-20 text-white mt-auto">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80 bg-primary px-2 py-0.5 mb-2 inline-block">
                                        {news.category}
                                    </span>
                                    <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-primary underline-offset-4">
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
                                Nessuna notizia trovata.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* OUR NETWORK SECTION */}
            <section className="bg-zinc-900 border-b border-white/5 relative z-0">
                {/* Network Header */}
                <div className="relative h-[180px] md:h-[280px] flex items-center justify-center overflow-hidden">
                    <Image
                        src="/assets/unime.png"
                        fill
                        className="object-cover opacity-20"
                        alt=""
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                    <div className="container relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-14 px-6 text-center">
                        <Image src="/assets/morgana.png" width={112} height={112} className="h-12 sm:h-20 md:h-28 w-auto object-contain drop-shadow-2xl" alt="Morgana" />
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            Scopri il nostro network!
                        </h2>
                        <Image src="/assets/orum.png" width={112} height={112} className="h-12 sm:h-20 md:h-28 w-auto object-contain drop-shadow-2xl" alt="O.R.U.M." />
                    </div>
                </div>

                {/* Diagonal Network Grid */}
                <div className="flex flex-col md:flex-row h-auto md:h-[450px] overflow-hidden">
                    {/* Unimhealth */}
                    <Link href="/network/unimhealth" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#c12830] overflow-hidden md:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)] z-40 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/policlinico.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:pr-20">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/unimhealth.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unimhealth" />
                            </div>
                        </div>
                    </Link>

                    {/* Studenti Economia */}
                    <Link href="/network/economia" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#0055a4] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-30 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/economia.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/studentieconomia.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Economia" />
                            </div>
                        </div>
                    </Link>

                    {/* Unime Matricole */}
                    <Link href="/network/matricole" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-gradient-to-br from-[#ffffff] to-[#afafaf] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-20 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/matricole.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/unimematricole.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unime Matricole" />
                            </div>
                        </div>
                    </Link>

                    {/* Studenti Scipog */}
                    <Link href="/network/scipog" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#ffcc00] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-10 transition-all hover:flex-[1.3] duration-500">
                        <Image src="/assets/scipog.png" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="" sizes="(max-width: 768px) 100vw, 20vw" />
                        <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                            <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                <Image src="/assets/studentiscipog.png" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Scipog" />
                            </div>
                        </div>
                    </Link>

                    {/* Inside Dicam */}
                    <Link href="/network/dicam" className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#d81b60] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)] md:-ml-[8%] z-0 transition-all hover:flex-[1.3] duration-500">
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