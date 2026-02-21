import Link from "next/link"
import {
    ArrowLeft,
    Landmark,
    Users,
    BookOpen,
    Heart,
    ShieldCheck,
    Bus,
    CreditCard,
    Info,
    ExternalLink,
    GraduationCap,
    Building,
    Wifi,
    Headset,
    Wallet,
    Home,
    Utensils,
    Search,
    Stethoscope,
    Scale
} from "lucide-react"

const SERVICES = [
    {
        id: "accademici",
        title: "1. Servizi Accademici e Amministrativi",
        icon: GraduationCap,
        color: "blue",
        items: [
            {
                name: "Welcome Point",
                desc: "Accoglienza e supporto per nuovi studenti nazionali e internazionali nelle procedure di immatricolazione.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/welcome-point"
            },
            {
                name: "Segreterie Studenti",
                desc: "Assistenza per iscrizioni, tasse, certificati e pergamene per tutti i Corsi di Laurea.",
                href: "https://www.unime.it/it/studenti/segreterie-studenti"
            },
            {
                name: "Master e Alta Formazione",
                desc: "Corsi di perfezionamento, master di I e II livello e percorsi di alta formazione professionale.",
                href: "https://www.unime.it/didattica/post-laurea/master-e-corsi-di-perfezionamento"
            },
            {
                name: "Scuole di Specializzazione",
                desc: "Accesso e informazioni sulle scuole di specializzazione dell'Ateneo.",
                href: "https://www.unime.it/didattica/post-laurea/scuole-di-specializzazione"
            },
            {
                name: "Esami di Stato",
                desc: "Procedure e scadenze per l'abilitazione all'esercizio delle professioni.",
                href: "https://www.unime.it/it/esami-stato/esami-di-stato"
            },
            {
                name: "Formazione Insegnanti",
                desc: "Percorsi formativi abilitanti e specializzazione per il sostegno (TFA).",
                href: "https://www.unime.it/didattica/post-laurea/formazione-insegnanti"
            },
            {
                name: "Orientamento e Placement",
                desc: "Career Service, AlmaLaurea e supporto nella scelta del corso di studi.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/orientamento-e-placement"
            },
            {
                name: "URP",
                desc: "Ufficio Relazioni con il Pubblico: sportello informativo per la trasparenza e l'ascolto.",
                href: "http://www.unime.it/it/ateneo/ufficio-relazioni-con-il-pubblico"
            },
            {
                name: "Protocollo Generale",
                desc: "Consegna documenti ufficiali e recapiti PEC dell'Ateneo.",
                href: "https://www.unime.it/ateneo/amministrazione/protocollo-consegna-documenti"
            }
        ]
    },
    {
        id: "ersu",
        title: "2. Diritto allo Studio e Servizi ERSU",
        icon: Home,
        color: "orange",
        items: [
            {
                name: "Agevolazioni Economiche",
                desc: "Borse di studio, contributi affitto e premi di laurea gestiti dall'ERSU.",
                href: "https://www.ersumessina.it/borse-di-studio/"
            },
            {
                name: "Servizi Residenziali",
                desc: "Posti alloggio presso le residenze universitarie (Annunziata, Castelli, Papardo).",
                href: "https://www.ersumessina.it/servizi-residenziali/"
            },
            {
                name: "Servizio Ristorazione",
                desc: "Accesso alle mense tramite APP ERSU. Orari e tariffe basate su fascia ISEE.",
                href: "https://www.ersumessina.it/servizio-mensa/"
            }
        ]
    },
    {
        id: "biblioteche",
        title: "3. Servizi Bibliotecari (SBA)",
        icon: BookOpen,
        color: "green",
        items: [
            {
                name: "Portale SBA",
                desc: "Catalogo unico (OPAC), sale studio e servizi di prestito locale e interbibliotecario.",
                href: "https://antonello.unime.it"
            },
            {
                name: "Biblioteca Digitale",
                desc: "Accesso remoto a banche dati, periodici online e risorse scientifiche.",
                href: "https://antonello.unime.it/sottoscrizioni-attive-2/"
            }
        ]
    },
    {
        id: "inclusione",
        title: "4. Servizi per l'Inclusione",
        icon: Heart,
        color: "red",
        items: [
            {
                name: "Disabilità e DSA",
                desc: "Modulistica, tutorato didattico e misure compensative per lezioni ed esami.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/servizi-disabilita-e-dsa"
            },
            {
                name: "Valutazione DSA (CeRIP)",
                desc: "Prenotazione appuntamenti per valutazione DSA tramite il centro specializzato d'Ateneo.",
                href: "https://www.unime.it/it/centri/cerip/appuntamento-valutazione-dsa"
            }
        ]
    },
    {
        id: "servizi-it",
        title: "5. Servizi IT e Connettività",
        icon: Wifi,
        color: "blue",
        items: [
            {
                name: "Account Studenti",
                desc: "Attivazione e gestione delle credenziali per i servizi online di Ateneo.",
                href: "https://www.unime.it/ciam/ict/account/studenti"
            },
            {
                name: "Posta Elettronica",
                desc: "Accesso alla mail istituzionale @studenti.unime.it.",
                href: "https://www.unime.it/ciam/ict/account/posta"
            },
            {
                name: "Wi-Fi d&apos;Ateneo",
                desc: "Istruzioni per l'accesso alla rete Wi-Fi nelle sedi universitarie.",
                href: "https://www.unime.it/ciam/ict/wifi"
            },
            {
                name: "Rete Eduroam",
                desc: "Accesso alla rete Wi-Fi internazionale per la comunità scientifica.",
                href: "https://www.unime.it/ciam/ict/eduroam"
            }
        ]
    },
    {
        id: "tutela",
        title: "6. Organi di Tutela e Garanzia",
        icon: ShieldCheck,
        color: "purple",
        items: [
            {
                name: "Garante degli Studenti",
                desc: "Tutela da disfunzioni e abusi. Monitoraggio del rispetto dei diritti degli studenti.",
                href: "https://www.unime.it/ateneo/organi/garante-degli-studenti"
            },
            {
                name: "Consulente di Fiducia",
                desc: "Supporto in caso di molestie o discriminazioni all'interno dell'Ateneo.",
                href: "https://www.unime.it/ateneo/organi/consulente-di-fiducia"
            },
            {
                name: "Comitato Unico di Garanzia (CUG)",
                desc: "Focalizzato sulla cultura delle pari opportunità e contrasto alle discriminazioni.",
                href: "https://www.unime.it/cug"
            }
        ]
    },
    {
        id: "mobilita",
        title: "7. Mobilità e Trasporti",
        icon: Bus,
        color: "zinc",
        items: [
            {
                name: "Student Mobility Card",
                desc: "Acquisto online tramite portale Esse3 (sezione Tasse) a tariffa agevolata di 30 euro.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/trasporti"
            },
            {
                name: "Parcheggi",
                desc: "Uso gratuito dei parcheggi di interscambio per gli abbonati studenti.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/trasporti"
            }
        ]
    },
    {
        id: "bancari",
        title: "8. Servizi Bancari Agevolati",
        icon: CreditCard,
        color: "emerald",
        items: [
            {
                name: "Genius Card UNIME",
                desc: "Carta prepagata UniCredit a canone azzerato per pagamenti e incassi universitari.",
                href: "https://www.unime.it/didattica/servizi-e-agevolazioni/genius-card"
            }
        ]
    }
]

const SOCIAL_MAPPING: Record<string, string> = {
    matricole: "unime.matricole",
    unimhealth: "unimhealth",
    economia: "studentieconomia",
    scipog: "studentiscipog",
    dicam: "insidedicam"
}

export default function ServicesGuidePage({ params }: { params: { brandId: string } }) {
    const igHandle = SOCIAL_MAPPING[params.brandId] || "unime.matricole"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <Link
                        href={`/network/${params.brandId}/guides`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="size-4" /> Torna alle guide
                    </Link>
                    <div className="size-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Landmark className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight leading-none">
                        Servizi UniMe
                    </h1>
                    <p className="text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                        Tutte le agevolazioni, i supporti e le infrastrutture che l&apos;Ateneo mette a disposizione per il tuo percorso universitario.
                    </p>
                </div>

                {/* Quick Navigation */}
                <div className="max-w-5xl mx-auto mb-16 flex flex-wrap justify-center gap-3">
                    {SERVICES.map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="px-4 py-2 bg-white rounded-full border border-zinc-200 text-xs font-bold text-zinc-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all uppercase tracking-widest"
                        >
                            {s.title.split('. ')[1]}
                        </a>
                    ))}
                </div>

                {/* Services Sections */}
                <div className="max-w-5xl mx-auto space-y-12">
                    {SERVICES.map((section) => {
                        const Icon = section.icon
                        return (
                            <section key={section.id} id={section.id} className="scroll-mt-32">
                                <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden p-8 md:p-12 relative group hover:shadow-xl transition-shadow duration-500">
                                    <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 relative z-10">
                                        <div className="shrink-0">
                                            <div className="size-16 md:size-20 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                <Icon className="size-8 md:size-10" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground mb-8 uppercase tracking-tight">
                                                {section.title}
                                            </h2>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {section.items.map((item: any, i) => {
                                                    const Content = (
                                                        <>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="font-black text-foreground text-sm uppercase tracking-tight group-hover/item:text-orange-600 transition-colors">
                                                                    {item.name}
                                                                </h4>
                                                                {item.href && <ExternalLink className="size-3 text-zinc-300 group-hover/item:text-orange-400 transition-colors" />}
                                                            </div>
                                                            <p className="text-zinc-500 text-sm leading-relaxed">
                                                                {item.desc}
                                                            </p>
                                                        </>
                                                    )

                                                    if (item.href) {
                                                        return (
                                                            <a
                                                                key={i}
                                                                href={item.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block p-6 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:bg-white hover:border-orange-100 transition-all group/item shadow-sm hover:shadow-md"
                                                            >
                                                                {Content}
                                                            </a>
                                                        )
                                                    }

                                                    return (
                                                        <div key={i} className="p-6 rounded-3xl bg-zinc-50/50 border border-zinc-100 transition-all">
                                                            {Content}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Background Element */}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                                        <Icon className="size-48 md:size-64" />
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </div>

                {/* Footer Alert */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <div className="bg-zinc-900 rounded-[40px] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <Info className="size-12 text-orange-400 mx-auto mb-6" />
                            <h3 className="text-2xl md:text-4xl font-serif font-black mb-6 uppercase tracking-tight">
                                Hai dubbi su una procedura?
                            </h3>
                            <p className="text-zinc-400 text-lg mb-8">
                                I nostri rappresentanti sono pronti ad assisterti nel dialogo con le segreterie e con gli uffici d&apos;Ateneo. Non esitare a contattarci.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="https://www.unime.it/didattica/servizi-e-agevolazioni"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-zinc-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 transition-colors flex items-center gap-2"
                                >
                                    Sito Ufficiale UniMe <ExternalLink className="size-4" />
                                </a>
                                <a
                                    href={`https://www.instagram.com/${igHandle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-zinc-800 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-700 transition-colors border border-zinc-700"
                                >
                                    Contatta Rappresentanti
                                </a>
                            </div>
                        </div>
                        {/* Blur Background */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-orange-400/20 blur-[100px] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
