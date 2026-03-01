import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Sun, Sunset, Music, Palette, Users, Camera, Trophy, Mic2, Star } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
        description: "Scopri il programma completo della Piazza dell'Arte: laboratori e seminari al mattino, attività pomeridiane e la grande serata di spettacoli dal vivo."
    }
}

export default async function ProgrammaPage({ params }: { params: { brandId: string, locale: string } }) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* HERO */}
            <section className="relative pt-36 pb-20 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: THEME.primary }}></div>
                    <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{ backgroundColor: THEME.accent }}></div>
                </div>

                <div className="container relative z-10 text-center">
                    <Link
                        href="/network/piazzadellarte"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-widest group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Torna alla home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter mb-6">
                        Il <span style={{ color: THEME.primary }}>Programma</span>
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto font-serif leading-relaxed">
                        Una giornata intera dedicata all&apos;arte, alla cultura e alla musica. Scopri tutti gli appuntamenti della Piazza dell&apos;Arte.
                    </p>
                    <div className="w-24 h-1.5 mx-auto mt-8 rounded-full" style={{ backgroundColor: THEME.accent }}></div>
                </div>
            </section>

            {/* TIMELINE SECTIONS */}
            <section className="pb-24">
                <div className="container max-w-5xl mx-auto space-y-8">

                    {/* ── MATTINO ── */}
                    <div className="relative">
                        {/* Time Label */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.primary, color: "#18182e" }}>
                                <Sun className="size-5" />
                                Mattino
                            </div>
                            <span className="text-white/40 text-sm font-bold tracking-widest">09:00 — 13:00</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.primary }}>
                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.primary}25` }}>
                                        <Palette className="size-5" style={{ color: THEME.primary }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.primary }}>
                                        Estemporanee di Pittura
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Artisti emergenti si sfidano dal vivo nel Cortile Centrale dell&apos;Università, spesso in collaborazione con il Liceo Artistico <strong className="text-white">&quot;E. Basile&quot;</strong>. Il pubblico può osservare la nascita delle opere in tempo reale.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.primary}25` }}>
                                        <Users className="size-5" style={{ color: THEME.primary }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.primary }}>
                                        Il Simposio
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Seminari e tavole rotonde su temi culturali, artistici e sociali. Un momento di confronto e dibattito aperto alla comunità studentesca e ai cittadini.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── POMERIGGIO ── */}
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.secondary, color: "#fff" }}>
                                <Sunset className="size-5" />
                                Pomeriggio
                            </div>
                            <span className="text-white/40 text-sm font-bold tracking-widest">14:00 — 19:00</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.secondary }}>
                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.secondary}25` }}>
                                        <Palette className="size-5" style={{ color: THEME.secondary }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.secondary }}>
                                        Laboratori Artistici
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Workshop creativi aperti a tutti: pittura, scultura, street art, musica e teatro. Un&apos;opportunità unica per esprimere il proprio talento con l&apos;aiuto di artisti professionisti.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.secondary}25` }}>
                                        <Camera className="size-5" style={{ color: THEME.secondary }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.secondary }}>
                                        Mostra Fotografica & Contest
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Esposizione delle opere finaliste del concorso fotografico, tra cui il premio dedicato a <strong className="text-white">Michelangelo Vizzini</strong>. La giuria delibera e i vincitori vengono premiati in serata.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── SERA ── */}
                    <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg" style={{ backgroundColor: THEME.accent, color: "#18182e" }}>
                                <Music className="size-5" />
                                Sera
                            </div>
                            <span className="text-white/40 text-sm font-bold tracking-widest">20:00 — Fine</span>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-5 pl-2 border-l-2" style={{ borderColor: THEME.accent }}>
                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.accent}25` }}>
                                        <Mic2 className="size-5" style={{ color: THEME.accent }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.accent }}>
                                        Live Music
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Band e solisti emergenti si esibiscono sul palco principale della Scalinata del Rettorato davanti a migliaia di spettatori.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.accent}25` }}>
                                        <Star className="size-5" style={{ color: THEME.accent }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.accent }}>
                                        Danza & Spettacoli
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Esibizioni di danza, teatro e performance artistiche. Ballerini, attori e performer animano la scena con i loro talenti.
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm p-7 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${THEME.accent}25` }}>
                                        <Trophy className="size-5" style={{ color: THEME.accent }} />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wide" style={{ color: THEME.accent }}>
                                        Premiazioni
                                    </h3>
                                </div>
                                <p className="text-white/70 leading-relaxed">
                                    Il gran finale con la cerimonia di premiazione dei contest: fotografia, pittura e altre categorie. Lo spettacolo si chiude in grande stile.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="py-16 border-t border-white/10">
                <div className="container text-center">
                    <p className="text-white/60 mb-6 text-lg font-serif">Vuoi esibirti o partecipare?</p>
                    <Link
                        href="https://fantapiazza.vercel.app"
                        target="_blank"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                        style={{ backgroundColor: THEME.primary, color: "#18182e" }}
                    >
                        Scopri FantaPiazza
                    </Link>
                </div>
            </section>
        </div>
    )
}
