import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, HeartHandshake, Award } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAND_CONFIG: Record<string, { name: string, logo: string, bg: string, subtitle: string, desc: string, mission: string, values: string[] }> = {
    unimehealth: {
        name: "Unime Health",
        logo: "/assets/unimehealth.png",
        bg: "/assets/policlinico.png",
        subtitle: "L&apos;eccellenza della rappresentanza nell&apos;area medico-sanitaria.",
        desc: "Unime Health è l'associazione di riferimento per gli studenti dell'area medica e delle professioni sanitarie dell'Università di Messina. Nata dalla fusione di passione per la sanità e impegno civile, ci occupiamo di tutelare i diritti degli studenti nei policlinici e nelle aule.",
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
        bg: "/assets/universita.png",
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
    }
}

export default function Page({ params }: { params: { brandId: string } }) {
    const config = BRAND_CONFIG[params.brandId]

    if (!config) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* HERO ABOUT */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src={config.bg} fill className="object-cover opacity-5 grayscale" alt="" />
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
                            <Image src={config.bg} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
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
            <section className="py-24 bg-primary text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 uppercase tracking-tight">Vuoi unirti a noi?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Se credi nel valore della rappresentanza e vuoi fare la differenza nel tuo dipartimento, scrivici subito.
                    </p>
                    <Link href={`/network/${params.brandId}`} className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                        Contattaci ora <ArrowRight className="size-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
