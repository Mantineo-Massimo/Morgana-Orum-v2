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
            "Dibattiti post-proiezione guidati da esperti del settore cinematografico e sociale.",
            "Approfondimento di macro-temi di attualità, ambiente e diritti civili."
        ],
        highlightsEn: [
            "Completely free screenings for the entire university community.",
            "Post-screening debates led by cinema and social experts.",
            "In-depth analysis of contemporary, environmental, and civil rights themes."
        ],
        detailsIt: [
            { label: "Frequenza", value: "Ciclica durante l'anno accademico" },
            { label: "Target", value: "Tutti gli studenti iscritti" },
            { label: "Ingresso", value: "Gratuito" }
        ],
        detailsEn: [
            { label: "Frequency", value: "Cyclical throughout the academic year" },
            { label: "Target", value: "All enrolled students" },
            { label: "Entry", value: "Free" }
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
            "Grande festival primaverile con performance live di band, solisti e ballerini.",
            "Estemporanee di pittura e laboratori creativi nel cortile dell'Ateneo.",
            "FantArte: l'esclusivo gioco di curatori d'arte virtuale per coinvolgere gli studenti."
        ],
        highlightsEn: [
            "Large spring festival featuring live performances by bands, soloists, and dancers.",
            "Live painting and creative workshops in the University courtyard.",
            "FantArte: the exclusive virtual art curation game to engage students."
        ],
        detailsIt: [
            { label: "Periodo", value: "Primavera (Maggio/Giugno)" },
            { label: "Location", value: "Cortile Centrale Ateneo e Scalinata Rettorato" },
            { label: "Partecipazione", value: "Esposizione gratuita per artisti emergenti" }
        ],
        detailsEn: [
            { label: "Period", value: "Spring (May/June)" },
            { label: "Location", value: "Central Courtyard and Rectorate Staircase" },
            { label: "Participation", value: "Free showcase for emerging artists" }
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
            "Raccolta benefica di giocattoli, libri e regali natalizi coordinata dagli studenti.",
            "Donazione diretta ai bambini dei reparti di pediatria del Policlinico di Messina.",
            "Supporto attivo a case famiglia e associazioni di volontariato del territorio."
        ],
        highlightsEn: [
            "Charitable collection of toys, books, and Christmas gifts managed by students.",
            "Direct donation to children in the pediatric wards of the Policlinico of Messina.",
            "Active support for local family shelters and non-profit volunteer organizations."
        ],
        detailsIt: [
            { label: "Periodo", value: "Dicembre (Festività Natalizie)" },
            { label: "Beneficiari", value: "Reparti pediatrici e case famiglia locali" },
            { label: "Tipo di Raccolta", value: "Giocattoli nuovi, libri e articoli da regalo" }
        ],
        detailsEn: [
            { label: "Period", value: "December (Christmas Holidays)" },
            { label: "Beneficiaries", value: "Pediatric wards and local family shelters" },
            { label: "Collection Type", value: "New toys, books, and gift items" }
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
            "Convegni e seminari di alto spessore istituzionale e accademico.",
            "Incontri con magistrati, giornalisti, storici e accademici di fama nazionale.",
            "Possibilità di conseguire CFU per le attività didattiche a scelta dello studente."
        ],
        highlightsEn: [
            "Conferences and seminars of high institutional and academic standing.",
            "Encounters with nationally renowned judges, journalists, historians, and academics.",
            "Opportunity to earn university training credits (CFU) for elective courses."
        ],
        detailsIt: [
            { label: "Riconoscimento", value: "Rilascio CFU (previa approvazione dipartimento)" },
            { label: "Tematiche", value: "Legalità, Geopolitica, Sviluppo Professionale" },
            { label: "Modalità", value: "In presenza e webinar online" }
        ],
        detailsEn: [
            { label: "Recognition", value: "CFU accreditation (subject to dept. approval)" },
            { label: "Themes", value: "Legality, Geopolitics, Career Development" },
            { label: "Format", value: "In-person and online webinars" }
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
            "Svolti in collaborazione con il CUS Messina presso la Cittadella Sportiva dell'Annunziata.",
            "Promozione dell'aggregazione giovanile e del benessere psico-fisico attraverso lo sport."
        ],
        highlightsEn: [
            "Interdepartmental futsal, volleyball, and basketball tournaments (men/women).",
            "Held in partnership with CUS Messina at the Annunziata Sports Citadel.",
            "Promotion of youth integration and mental/physical well-being through sport."
        ],
        detailsIt: [
            { label: "Location", value: "Cittadella Sportiva Universitaria (Polo Annunziata)" },
            { label: "Discipline", value: "Calcio a 5, Basket 3x3, Pallavolo" },
            { label: "Premiazioni", value: "Coppe, medaglie e riconoscimenti associativi" }
        ],
        detailsEn: [
            { label: "Location", value: "University Sports Citadel (Annunziata Campus)" },
            { label: "Disciplines", value: "Futsal, 3x3 Basketball, Volleyball" },
            { label: "Awards", value: "Cups, medals, and association recognitions" }
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
            "Aperitivi di benvenuto e giornate informative per l'integrazione delle matricole.",
            "Attività ricreative, tornei di giochi da tavolo ed eventi di socializzazione.",
            "Creazione di una community inclusiva al di fuori delle aule universitarie."
        ],
        highlightsEn: [
            "Welcome gatherings and info days to support freshman integration.",
            "Recreational activities, board game tournaments, and social events.",
            "Building an inclusive community environment outside the classrooms."
        ],
        detailsIt: [
            { label: "Obiettivo", value: "Networking e integrazione delle matricole" },
            { label: "Attività", value: "Socialità, orienteering e feste di benvenuto" },
            { label: "Frequenza", value: "Incontri periodici e benvenuto autunnale" }
        ],
        detailsEn: [
            { label: "Goal", value: "Networking and freshman integration" },
            { label: "Activities", value: "Socializing, orienteering, and welcome parties" },
            { label: "Frequency", value: "Periodic meetups and fall welcome events" }
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
