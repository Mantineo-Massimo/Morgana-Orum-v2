"use client"

import { useTranslations, useLocale } from "next-intl"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
    ArrowLeft, 
    Film, 
    Gift, 
    Sparkles, 
    BookOpen, 
    Trophy, 
    CheckCircle2, 
    Calendar,
    Users,
    MapPin,
    LucideIcon
} from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface InitiativeConfig {
    prefix: string
    image: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
    badgeIt: string
    badgeEn: string
    highlightsIt: string[]
    highlightsEn: string[]
    detailsIt: { label: string; value: string }[]
    detailsEn: { label: string; value: string }[]
}

const slugMap: Record<string, InitiativeConfig> = {
    "cineforum": {
        prefix: "cineforum",
        image: "/assets/slides/2.webp",
        icon: Film,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50 border-amber-100",
        badgeIt: "CULTURA",
        badgeEn: "CULTURE",
        highlightsIt: [
            "Proiezioni ad ingresso totalmente gratuito per tutta la comunità studentesca.",
            "Ideato dal Senato Accademico e sviluppato dal Centro Informatico CIAM dal 2019.",
            "Approfondimento di macro-temi di attualità, ambiente e diritti civili con dibattito."
        ],
        highlightsEn: [
            "Completely free screenings for the entire university community.",
            "Conceived by the Academic Senate and developed by the CIAM IT Center since 2019.",
            "In-depth analysis of contemporary, environmental, and civil rights themes with debate."
        ],
        detailsIt: [
            { label: "Sviluppo Tecnico", value: "CIAM (Centro Informatico Ateneo)" },
            { label: "Proposta", value: "Rappr. Senato Accademico (Lavinia Parisi)" },
            { label: "Sede Storica", value: "Palazzo Mariani / Aule di Ateneo" }
        ],
        detailsEn: [
            { label: "Technical Dev", value: "CIAM (University IT Center)" },
            { label: "Proponent", value: "Senate Representative (Lavinia Parisi)" },
            { label: "Historic Venue", value: "Palazzo Mariani / Campus Halls" }
        ]
    },
    "piazza-dell-arte": {
        prefix: "piazza",
        image: "/assets/piazza.webp",
        icon: Sparkles,
        iconColor: "text-purple-600",
        iconBg: "bg-purple-50 border-purple-100",
        badgeIt: "ARTE & MUSICA",
        badgeEn: "ART & MUSIC",
        highlightsIt: [
            "Grande festival primaverile giunto alla XI edizione con band, solisti e ballerini live.",
            "Estemporanee di pittura, laboratori creativi ed esposizione di sculture.",
            "FantArte: la prima piattaforma di gamification dell'arte a Messina (www.fantarte.it)."
        ],
        highlightsEn: [
            "Large spring festival now in its 11th edition featuring live bands, soloists, and dancers.",
            "Live painting, creative workshops, and sculpture showcase.",
            "FantArte: the first art gamification platform in Messina (www.fantarte.it)."
        ],
        detailsIt: [
            { label: "Edizione", value: "XI Edizione Primavera" },
            { label: "Location", value: "Cortile Centrale Ateneo e Scalinata Rettorato" },
            { label: "Gamification", value: "FantArte (budget di 100 Armoni)" }
        ],
        detailsEn: [
            { label: "Edition", value: "11th Spring Edition" },
            { label: "Location", value: "Central Courtyard and Rectorate Staircase" },
            { label: "Gamification", value: "FantArte (100 Armoni budget)" }
        ]
    },
    "notte-dei-regali": {
        prefix: "regali",
        image: "/assets/slides/3.webp",
        icon: Gift,
        iconColor: "text-red-600",
        iconBg: "bg-red-50 border-red-100",
        badgeIt: "SOLIDARIETÀ",
        badgeEn: "SOLIDARITY",
        highlightsIt: [
            "Raccolta benefica natalizia di giocattoli, libri e regali coordinata dagli studenti.",
            "Collaborazione con Gli Invisibili Onlus, Leo Club Messina Host, UGL e ACR Messina.",
            "Centralizzata presso l'hub logistico di Via del Vespro a supporto di case famiglia e pediatrie."
        ],
        highlightsEn: [
            "Charitable Christmas collection of toys, books, and gifts managed by students.",
            "Partnership with Gli Invisibili Onlus, Leo Club Messina Host, UGL, and ACR Messina.",
            "Centralized at the Via del Vespro logistics hub supporting family shelters and pediatric wards."
        ],
        detailsIt: [
            { label: "Hub Logistico", value: "Sede Morgana - Via Del Vespro" },
            { label: "Beneficiari", value: "Reparti Pediatria Policlinico e Case Famiglia" },
            { label: "Partner Sociali", value: "Gli Invisibili Onlus, ACR Messina, Leo Club" }
        ],
        detailsEn: [
            { label: "Logistics Hub", value: "Morgana HQ - Via Del Vespro" },
            { label: "Beneficiaries", value: "Policlinico Pediatric Wards & Local Shelters" },
            { label: "Social Partners", value: "Gli Invisibili Onlus, ACR Messina, Leo Club" }
        ]
    },
    "conferenze": {
        prefix: "conferenze",
        image: "/assets/programma.webp",
        icon: BookOpen,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50 border-blue-100",
        badgeIt: "FORMAZIONE & CFU",
        badgeEn: "CFU SEMINARS",
        highlightsIt: [
            "Seminari e convegni accreditati per l'ottenimento di CFU accademici.",
            "Focus su legalità e relazioni internazionali, come il dibattito 'Due popoli in due Stati'.",
            "Winter School annuale in collaborazione con Amnesty International ed il dipartimento Scipog."
        ],
        highlightsEn: [
            "Accredited seminars and conferences for earning university credits (CFU).",
            "Focus on legality and international relations, such as the 'Two Peoples, Two States' debate.",
            "Annual Winter School in partnership with Amnesty International and the Scipog department."
        ],
        detailsIt: [
            { label: "Iniziative Chiave", value: "Winter School Amnesty, Dibattiti Geopolitici" },
            { label: "Crediti Didattici", value: "Riconoscimento CFU accademici (0,25 - 1,50 CFU)" },
            { label: "Relatori", value: "Magistrati, storici, giornalisti ed accademici" }
        ],
        detailsEn: [
            { label: "Key Initiatives", value: "Amnesty Winter School, Geopolitical Debates" },
            { label: "Academic Credits", value: "CFU accreditation (0.25 - 1.50 CFU)" },
            { label: "Speakers", value: "Judges, historians, journalists, and academics" }
        ]
    },
    "sport": {
        prefix: "sport",
        image: "/assets/slides/1.webp",
        icon: Trophy,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50 border-emerald-100",
        badgeIt: "SPORT & BENESSERE",
        badgeEn: "SPORTS",
        highlightsIt: [
            "Tornei interdipartimentali di calcio a 5, pallavolo e basket maschile/femminile.",
            "Partenariato ufficiale con SSD Unime e CUS Messina per l'uso delle strutture olimpiche.",
            "Valenza accademica con rilascio di crediti formativi (0,25 CFU) ai partecipanti dei tornei."
        ],
        highlightsEn: [
            "Interdepartmental futsal, volleyball, and basketball tournaments (men/women).",
            "Official partnership with SSD Unime and CUS Messina for Olympic facility use.",
            "Academic value with format credits (0.25 CFU) awarded to tournament participants."
        ],
        detailsIt: [
            { label: "Location", value: "Cittadella Sportiva Universitaria (Polo Annunziata)" },
            { label: "Crediti Sportivi", value: "0,25 CFU accreditati dall'Ateneo" },
            { label: "Collaboratori", value: "SSD Unime & CUS Messina" }
        ],
        detailsEn: [
            { label: "Location", value: "University Sports Citadel (Annunziata Campus)" },
            { label: "Sports Credits", value: "0.25 CFU accredited by the University" },
            { label: "Collaborators", value: "SSD Unime & CUS Messina" }
        ]
    },
    "svago": {
        prefix: "svago",
        image: "/assets/artisti.webp",
        icon: Sparkles,
        iconColor: "text-rose-600",
        iconBg: "bg-rose-50 border-rose-100",
        badgeIt: "SOCIALITÀ",
        badgeEn: "SOCIAL",
        highlightsIt: [
            "Orientamento e tutorato in ingresso per agevolare l'integrazione accademica.",
            "Coordinamento della 'Rete Contatti Unime 2027' per le scuole secondarie provinciali.",
            "Iniziative ricreative, guide all'immatricolazione e community di supporto digitale."
        ],
        highlightsEn: [
            "Incoming guidance and tutoring to ease academic integration.",
            "Coordination of the 'Unime Contatti 2027' network for provincial high schools.",
            "Recreational initiatives, enrollment guides, and digital support communities."
        ],
        detailsIt: [
            { label: "Rete Scuole", value: "Liceo Caminiti Trimarchi, Pugliatti Furci/Taormina" },
            { label: "Canali Informativi", value: "Video guide YouTube, Gruppi WhatsApp e Social" },
            { label: "Supporto Matricole", value: "Simulazioni test, giornate accoglienza, wayfinding" }
        ],
        detailsEn: [
            { label: "School Network", value: "Caminiti Trimarchi Lyceum, Pugliatti Furci/Taormina" },
            { label: "Info Channels", value: "YouTube video guides, WhatsApp & Social groups" },
            { label: "Freshman Support", value: "Mock tests, welcome days, wayfinding assistance" }
        ]
    }
}

export default function InitiativeDetailPage() {
    const t = useTranslations("IniziativePage")
    const locale = useLocale()
    const { slug } = useParams() as { slug: string }

    const config = slugMap[slug]

    if (!config) {
        return (
            <div className="min-h-screen bg-zinc-50 pt-32 pb-20 flex flex-col items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <h1 className="text-3xl font-bold font-serif text-foreground mb-4">
                        Iniziativa non trovata
                    </h1>
                    <p className="text-zinc-500 mb-8 font-medium">
                        La pagina che stai cercando non esiste o l&apos;iniziativa non è più disponibile nel nostro catalogo.
                    </p>
                    <Link
                        href="/iniziative"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-zinc-950 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-zinc-800 transition-all"
                    >
                        Tutte le iniziative
                    </Link>
                </div>
            </div>
        )
    }

    const title = t(`${config.prefix}_title`)
    const desc = t(`${config.prefix}_desc`)
    const content = t(`${config.prefix}_content`)
    const badge = locale === 'it' ? config.badgeIt : config.badgeEn
    const highlights = locale === 'it' ? config.highlightsIt : config.highlightsEn
    const details = locale === 'it' ? config.detailsIt : config.detailsEn

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back Button */}
                <Link
                    href="/iniziative"
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <div className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">
                        {locale === 'it' ? "Torna alle iniziative" : "Back to initiatives"}
                    </span>
                </Link>

                <article>
                    {/* Header Section */}
                    <header className="mb-12">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg bg-zinc-900 text-white">
                                {badge}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className={cn("size-14 rounded-2xl flex items-center justify-center border shadow-sm", config.iconBg)}>
                                <config.icon className={cn("size-7", config.iconColor)} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground leading-[1.1] tracking-tight">
                                {title}
                            </h1>
                        </div>

                        <p className="text-xl md:text-2xl text-zinc-500 font-medium italic border-l-4 border-zinc-200 pl-6 py-2 leading-relaxed">
                            {desc}
                        </p>
                    </header>

                    {/* Hero Image */}
                    <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-16 shadow-2xl shadow-zinc-200 ring-1 ring-zinc-200">
                        <Image
                            src={config.image}
                            alt={title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 896px"
                            className="object-cover"
                        />
                    </div>

                    {/* Detailed Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Left Main Content */}
                        <div className="md:col-span-8 space-y-8">
                            <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 md:p-12 shadow-sm">
                                <h3 className="text-xl font-bold font-serif text-foreground mb-6">
                                    {locale === 'it' ? "Presentazione del Progetto" : "Project Presentation"}
                                </h3>
                                <p className="text-zinc-600 leading-relaxed font-medium text-base md:text-lg">
                                    {content}
                                </p>
                            </div>

                            {/* Highlights Card */}
                            <div className="bg-white rounded-[2rem] border border-zinc-100 p-8 md:p-12 shadow-sm space-y-6">
                                <h3 className="text-xl font-bold font-serif text-foreground">
                                    {locale === 'it' ? "Punti Chiave dell'Iniziativa" : "Key Pillars"}
                                </h3>
                                <ul className="space-y-4">
                                    {highlights.map((point, index) => (
                                        <motion.li 
                                            key={index} 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <CheckCircle2 className={cn("size-5 mt-1 shrink-0", config.iconColor)} />
                                            <span className="text-zinc-600 font-medium text-sm md:text-base leading-relaxed">
                                                {point}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right Sidebar Details */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-white rounded-[2rem] border border-zinc-100 p-6 shadow-sm">
                                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6 pb-2 border-b border-zinc-50">
                                    {locale === 'it' ? "Dettagli Iniziativa" : "Details"}
                                </h4>
                                <div className="space-y-4">
                                    {details.map((detail, index) => (
                                        <div key={index} className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                                                {detail.label}
                                            </span>
                                            <span className="text-sm font-bold text-foreground block">
                                                {detail.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
