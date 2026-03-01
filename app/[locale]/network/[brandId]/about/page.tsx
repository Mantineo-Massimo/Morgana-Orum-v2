import { Link } from "@/i18n/routing"
import Image from "next/image"
import { ArrowRight, Sparkles, Calendar, Users, HeartHandshake, Award } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAND_CONFIG: Record<string, { name: string, logo: string, bg: string, subtitle: string, desc: string, mission: string, values: string[], theme?: { primary: string, secondary: string, accent: string } }> = {
    unimhealth: {
        name: "Unimhealth",
        logo: "/assets/unimhealth.png",
        bg: "/assets/policlinico.png",
        subtitle: "L&apos;eccellenza della rappresentanza nell&apos;area medico-sanitaria.",
        desc: "Unimhealth è l'associazione di riferimento per gli studenti dell'area medica e delle professioni sanitarie dell'Università di Messina. Nata dalla fusione di passione per la sanità e impegno civile, ci occupiamo di tutelare i diritti degli studenti nei policlinici e nelle aule.",
        mission: "Garantire una formazione di qualità e un ambiente di tirocinio sicuro e dignitoso per tutti i futuri professionisti della salute.",
        values: ["Passione", "Professionalità", "Tutela", "Solidarietà"]
    },
    economia: {
        name: "Studenti Economia",
        logo: "/assets/studentieconomia.png",
        bg: "/assets/economia.png",
        subtitle: "Protagonisti del cambiamento nel Dipartimento di Economia.",
        desc: "Siamo il punto di riferimento per gli studenti di Economia a Messina. Organizziamo seminari tecnici, workshop e supportiamo quotidianamente i colleghi nel loro percorso accademico, facilitando il dialogo con i docenti.",
        mission: "Creare un ponte concreto tra l'università e il mondo del lavoro, valorizzando il merito e le competenze.",
        values: ["Merito", "Innovazione", "Impresa", "Dialogo"]
    },
    matricole: {
        name: "Unime Matricole",
        logo: "/assets/unimematricole.png",
        bg: "/assets/matricole.png",
        subtitle: "La tua bussola nel mondo universitario messinese.",
        desc: "Unime Matricole nasce con l'obiettivo di non lasciare nessuno indietro. Sappiamo quanto sia difficile il primo impatto con l'università: burocrazia, aule, esami. Noi siamo qui per guidarti passo dopo passo.",
        mission: "Semplificare l'accesso all'università e supportare i nuovi studenti nella loro integrazione.",
        values: ["Accoglienza", "Orientamento", "Sostegno", "Inclusione"]
    },
    scipog: {
        name: "Studenti Scipog",
        logo: "/assets/studentiscipog.png",
        bg: "/assets/scipog.png",
        subtitle: "La voce tra Scienze Politiche e Giuridiche.",
        desc: "Studenti Scipog è la realtà che unisce gli studenti di Scienze Politiche e Giuridiche. Promuoviamo il dibattito democratico, la conoscenza del diritto e la partecipazione attiva alla vita di dipartimento.",
        mission: "Promuovere la cultura della legalità e della partecipazione politica attiva tra gli studenti.",
        values: ["Democrazia", "Diritto", "Partecipazione", "Confronto"]
    },
    dicam: {
        name: "Inside Dicam",
        logo: "/assets/insidedicam.png",
        bg: "/assets/dicam.png",
        subtitle: "Passione per le Lettere e la Cultura a Messina.",
        desc: "Inside Dicam è l'anima culturale del Dipartimento di Civiltà Antiche e Moderne. Ci battiamo per valorizzare il patrimonio umanistico e per offrire agli studenti spazi di espressione artistica e letteraria.",
        mission: "Custodire e rinnovare il valore delle materie umanistiche attraverso la rappresentanza e la cultura.",
        values: ["Cultura", "Arte", "Lettere", "Identità"]
    },
    piazzadellarte: {
        name: "Piazza Dell'Arte",
        logo: "/assets/piazzadellarte.png",
        bg: "/assets/piazza.png",
        subtitle: "Il cuore pulsante della creatività studentesca.",
        desc: "Piazza Dell'Arte è l'importante evento socio-culturale che trasforma l'Università in un palcoscenico a cielo aperto.",
        mission: "Due storie, una missione: Morgana e Orum uniscono le forze per trasformare l'università in un luogo di opportunità, diritti e crescita. Scopri chi siamo e cosa facciamo ogni giorno per te.",
        values: ["Arte", "Cultura", "Musica", "Spettacolo"],
        theme: {
            primary: "#f9a620",
            secondary: "#27a85d",
            accent: "#1fbcd3"
        }
    }
}

export default function Page({ params }: { params: { brandId: string } }) {
    const config = BRAND_CONFIG[params.brandId]
    const igHandle = SOCIAL_MAPPING[params.brandId] || "unime.matricole"

    if (!config) {
        notFound()
    }

    if (params.brandId === "piazzadellarte") {
        return (
            <div className="min-h-screen bg-white">
                <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-zinc-50">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <Image src="/assets/piazza.png" fill className="object-cover grayscale" alt="" priority />
                    </div>
                    <div className="container relative z-10">
                        <div className="max-w-4xl mx-auto text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-6 text-[#27a85d]">
                                Cos&apos;è la Piazza dell&apos;Arte?
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                                La <strong>Piazza dell&apos;Arte</strong> è un importante evento socio-culturale che si svolge a Messina, organizzato principalmente dall&apos;Associazione Universitaria Morgana e O.R.U.M. È diventato uno degli appuntamenti più attesi della primavera messinese, capace di trasformare gli spazi accademici in un palcoscenico a cielo aperto.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white text-zinc-900 relative">
                    <div className="container relative z-10">
                        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
                            {/* Left Column: Cosa facciamo */}
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-widest text-[#1fbcd3] mb-6 inline-flex items-center gap-3">
                                        Il Progetto
                                        <div className="h-1 w-12 bg-[#1fbcd3] rounded-full"></div>
                                    </h3>
                                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                        L&apos;evento nasce con l&apos;obiettivo di valorizzare i giovani talenti del territorio, offrendo loro una vetrina gratuita e partecipata. Si svolge solitamente nel Cortile Centrale dell&apos;Università di Messina e sulla suggestiva Scalinata del Rettorato.
                                    </p>
                                    <div className="space-y-6">
                                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                                <span className="text-[#f9a620]"><Sparkles className="size-5" /></span>
                                                Mattina e Pomeriggio
                                            </h4>
                                            <p className="text-muted-foreground">Laboratori artistici, estemporanee di pittura (spesso in collaborazione con il Liceo Artistico &quot;E. Basile&quot;) e seminari culturali (come il &quot;Simposio&quot;).</p>
                                        </div>
                                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                                <span className="text-[#27a85d]"><Sparkles className="size-5" /></span>
                                                Sera
                                            </h4>
                                            <p className="text-muted-foreground">Il momento clou con esibizioni dal vivo di band, solisti, ballerini, attori e performer.</p>
                                        </div>
                                        <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                                <span className="text-[#1fbcd3]"><Sparkles className="size-5" /></span>
                                                Contest
                                            </h4>
                                            <p className="text-muted-foreground">Include spesso mostre fotografiche e concorsi (come quello dedicato a Michelangelo Vizzini) con premiazioni dal vivo.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Le Associazioni & Perchè è importante */}
                            <div className="bg-[#18182e] p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#27a85d] rounded-full blur-[80px] opacity-50"></div>
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#1fbcd3] rounded-full blur-[80px] opacity-50"></div>

                                <h3 className="text-2xl font-black uppercase tracking-widest text-[#27a85d] mb-6 relative z-10">
                                    Le Associazioni Coinvolte
                                </h3>
                                <p className="text-white/80 mb-8 relative z-10 text-lg">
                                    Sebbene l&apos;organizzazione principale faccia capo all&apos;Associazione Morgana e O.R.U.M., l&apos;evento è il risultato di una rete di collaborazioni:
                                </p>
                                <ul className="space-y-6 relative z-10">
                                    <li className="flex gap-4">
                                        <div className="mt-1 shrink-0 text-[#f9a620]">
                                            <ArrowRight className="size-5" />
                                        </div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Associazione Morgana e O.R.U.M.</strong>
                                            <span className="text-white/70">È il motore dell&apos;iniziativa. Si occupa della logistica, dei bandi per gli artisti e del coordinamento dei volontari.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 shrink-0 text-[#1fbcd3]">
                                            <ArrowRight className="size-5" />
                                        </div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Partner Istituzionali</strong>
                                            <span className="text-white/70">L&apos;evento gode del supporto dell&apos;Università degli Studi di Messina (UniMe) e dell&apos;ERSU.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="mt-1 shrink-0 text-[#27a85d]">
                                            <ArrowRight className="size-5" />
                                        </div>
                                        <div>
                                            <strong className="block text-white text-lg mb-1">Altre Realtà</strong>
                                            <span className="text-white/70">Spesso sostenuta da altre associazioni studentesche o culturali (es. Forum dei giovani, Decimo Sommerso) rendendo l&apos;evento un momento di unità per tutta la comunità.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Full-width below: Perché è importante? */}
                        <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-zinc-100">
                            <h3 className="text-3xl font-black uppercase tracking-widest text-zinc-900 mb-10 text-center">
                                Perché è importante?
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                    <div className="size-14 bg-[#1fbcd3]/10 group-hover:bg-[#1fbcd3] text-[#1fbcd3] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                        <span className="font-bold text-xl">1</span>
                                    </div>
                                    <strong className="block text-zinc-900 text-lg mb-2">Connessione</strong>
                                    <span className="text-sm text-muted-foreground leading-relaxed">Apre le porte dell&apos;Ateneo a tutta la cittadinanza, non solo agli studenti.</span>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                    <div className="size-14 bg-[#f9a620]/10 group-hover:bg-[#f9a620] text-[#f9a620] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                        <span className="font-bold text-xl">2</span>
                                    </div>
                                    <strong className="block text-zinc-900 text-lg mb-2">Talento</strong>
                                    <span className="text-sm text-muted-foreground leading-relaxed">Permette a giovani artisti emergenti di esibirsi davanti a migliaia di persone gratuitamente.</span>
                                </div>
                                <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                    <div className="size-14 bg-[#27a85d]/10 group-hover:bg-[#27a85d] text-[#27a85d] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                        <span className="font-bold text-xl">3</span>
                                    </div>
                                    <strong className="block text-zinc-900 text-lg mb-2">Aggregazione</strong>
                                    <span className="text-sm text-muted-foreground leading-relaxed">Esempio di &quot;cittadinanza attiva&quot; dove gli studenti promuovono cultura e divertimento sano.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* HERO ABOUT */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src={config.bg} fill className="object-cover opacity-5 grayscale" alt="" sizes="100vw" priority />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50"></div>
                </div>

                <div className="container mx-auto text-center max-w-4xl relative z-10">
                    <div className="size-24 md:size-32 mx-auto mb-8 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 border border-zinc-100">
                        <Image src={config.logo} width={96} height={96} className="w-full h-full object-contain" alt={config.name} />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground uppercase">
                        Chi Siamo
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-primary mb-8 italic">
                        {config.name}
                    </p>
                    <p className="text-lg md:text-xl text-zinc-600 leading-relaxed text-balance">
                        {config.desc}
                    </p>
                </div>
            </section>

            {/* MISSION & VALUES */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">La nostra Missione</h3>
                                <p className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight">
                                    &ldquo;{config.mission}&rdquo;
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {config.values.map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                                        <Award className="size-5 text-primary" />
                                        <span className="font-bold text-sm uppercase tracking-wider">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group">
                            <Image src={config.bg} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="" sizes="(max-width: 768px) 100vw, 50vw" />
                            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-60"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <p className="text-white/90 italic font-serif text-lg">
                                    &ldquo;{config.subtitle}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COUNTERS LOCAL */}
            <section className="py-20 bg-zinc-900 text-white">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <Users className="size-8 mb-4 opacity-50" />
                        <span className="text-5xl font-black font-serif mb-2 tracking-tight">20+</span>
                        <span className="text-sm uppercase tracking-widest font-bold opacity-70">Rappresentanti</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <HeartHandshake className="size-8 mb-4 opacity-50" />
                        <span className="text-5xl font-black font-serif mb-2 tracking-tight">1.500+</span>
                        <span className="text-sm uppercase tracking-widest font-bold opacity-70">Studenti Attivi</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Calendar className="size-8 mb-4 opacity-50" />
                        <span className="text-5xl font-black font-serif mb-2 tracking-tight">15+</span>
                        <span className="text-sm uppercase tracking-widest font-bold opacity-70">Eventi Annuali</span>
                    </div>
                </div>
            </section>

            {/* JOIN CTA */}
            <section className="py-24 bg-zinc-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <Image src={config.bg} fill className="object-cover grayscale" alt="" sizes="100vw" />
                </div>
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 uppercase tracking-tight">Entra a far parte della squadra!</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Se credi nel valore della rappresentanza e vuoi fare la differenza nel tuo dipartimento, unisciti a {config.name}.
                    </p>
                    <a
                        href={`https://www.instagram.com/${igHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-zinc-900 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                    >
                        Contattaci su Instagram <ArrowRight className="size-5" />
                    </a>
                </div>
            </section>
        </div>
    )
}

const SOCIAL_MAPPING: Record<string, string> = {
    matricole: "unime.matricole",
    unimhealth: "unimhealth",
    economia: "studentieconomia",
    scipog: "studentiscipog",
    dicam: "insidedicam"
}
