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
    Laptop,
    User,
    Award,
    Heart,
    Target,
    MessageSquare,
    LucideIcon
} from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface DetailItem {
    label: string
    value: string
    icon: LucideIcon
}

interface InitiativeConfig {
    prefix: string
    image: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
    themeColor: string
    badgeIt: string
    badgeEn: string
    highlightsIt: string[]
    highlightsEn: string[]
    detailsIt: DetailItem[]
    detailsEn: DetailItem[]
}

const slugMap: Record<string, InitiativeConfig> = {
    "cineforum": {
        prefix: "cineforum",
        image: "/assets/slides/2.webp",
        icon: Film,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50 border-amber-100",
        themeColor: "#f59e0b", // Amber
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
            { label: "Sviluppo Tecnico", value: "CIAM (Centro Informatico)", icon: Laptop },
            { label: "Proposta", value: "Rappr. Senato (Lavinia Parisi)", icon: User },
            { label: "Sede Storica", value: "Palazzo Mariani / Aule Ateneo", icon: MapPin }
        ],
        detailsEn: [
            { label: "Technical Dev", value: "CIAM (University IT Center)", icon: Laptop },
            { label: "Proponent", value: "Senate Representative (Lavinia Parisi)", icon: User },
            { label: "Historic Venue", value: "Palazzo Mariani / Campus Halls", icon: MapPin }
        ]
    },
    "piazza-dell-arte": {
        prefix: "piazza",
        image: "/assets/piazza.webp",
        icon: Sparkles,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-50 border-purple-100",
        themeColor: "#a855f7", // Purple
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
            { label: "Edizione", value: "XI Edizione Primavera", icon: Calendar },
            { label: "Location", value: "Cortile Centrale e Scalinata Rettorato", icon: MapPin },
            { label: "Gamification", value: "FantArte (100 Armoni)", icon: Award }
        ],
        detailsEn: [
            { label: "Edition", value: "11th Spring Edition", icon: Calendar },
            { label: "Location", value: "Central Courtyard & Rectorate Staircase", icon: MapPin },
            { label: "Gamification", value: "FantArte (100 Armoni)", icon: Award }
        ]
    },
    "notte-dei-regali": {
        prefix: "regali",
        image: "/assets/slides/3.webp",
        icon: Gift,
        iconColor: "text-red-500",
        iconBg: "bg-red-50 border-red-100",
        themeColor: "#ef4444", // Red
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
            { label: "Hub Logistico", value: "Sede Morgana - Via Del Vespro", icon: MapPin },
            { label: "Beneficiari", value: "Pediatria Policlinico & Case Famiglia", icon: Users },
            { label: "Partner Sociali", value: "Gli Invisibili, ACR, Leo Club", icon: Heart }
        ],
        detailsEn: [
            { label: "Logistics Hub", value: "Morgana HQ - Via Del Vespro", icon: MapPin },
            { label: "Beneficiaries", value: "Policlinico Pediatric & Shelters", icon: Users },
            { label: "Social Partners", value: "Gli Invisibili, ACR, Leo Club", icon: Heart }
        ]
    },
    "conferenze": {
        prefix: "conferenze",
        image: "/assets/programma.webp",
        icon: BookOpen,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50 border-blue-100",
        themeColor: "#3b82f6", // Blue
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
            { label: "Iniziative Chiave", value: "Winter School Amnesty, Dibattiti Geopolitici", icon: BookOpen },
            { label: "Crediti Didattici", value: "CFU accademici (0,25 - 1,50 CFU)", icon: Award },
            { label: "Relatori", value: "Magistrati, storici ed accademici", icon: Users }
        ],
        detailsEn: [
            { label: "Key Initiatives", value: "Amnesty Winter School, Geopolitical Debates", icon: BookOpen },
            { label: "Academic Credits", value: "CFU accreditation (0.25 - 1.50 CFU)", icon: Award },
            { label: "Speakers", value: "Judges, historians, journalists & academics", icon: Users }
        ]
    },
    "sport": {
        prefix: "sport",
        image: "/assets/slides/1.webp",
        icon: Trophy,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50 border-emerald-100",
        themeColor: "#10b981", // Emerald
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
            { label: "Location", value: "Cittadella Sportiva (Polo Annunziata)", icon: MapPin },
            { label: "Crediti Sportivi", value: "0,25 CFU accreditati dall'Ateneo", icon: Award },
            { label: "Collaboratori", value: "SSD Unime & CUS Messina", icon: Users }
        ],
        detailsEn: [
            { label: "Location", value: "University Sports Citadel (Annunziata)", icon: MapPin },
            { label: "Sports Credits", value: "0.25 CFU accredited by the Uni", icon: Award },
            { label: "Collaborators", value: "SSD Unime & CUS Messina", icon: Users }
        ]
    },
    "svago": {
        prefix: "svago",
        image: "/assets/artisti.webp",
        icon: Sparkles,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50 border-rose-100",
        themeColor: "#f43f5e", // Rose
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
            { label: "Rete Scuole", value: "Liceo Caminiti Trimarchi, Pugliatti", icon: BookOpen },
            { label: "Canali Informativi", value: "Video guide YouTube, WhatsApp e Social", icon: Laptop },
            { label: "Tutorato Matricole", value: "Simulazioni test, giornate accoglienza", icon: Users }
        ],
        detailsEn: [
            { label: "School Network", value: "Caminiti Trimarchi Lyceum, Pugliatti", icon: BookOpen },
            { label: "Info Channels", value: "YouTube video guides, WhatsApp & Social", icon: Laptop },
            { label: "Freshman Support", value: "Mock tests, welcome days guidance", icon: Users }
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
        <div className="min-h-screen bg-zinc-50 pt-28 pb-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Back Button */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/iniziative"
                        className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors"
                    >
                        <div className="size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-50 transition-colors">
                            <ArrowLeft className="size-4" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">
                            {locale === 'it' ? "Torna alle iniziative" : "Back to initiatives"}
                        </span>
                    </Link>
                    
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block sm:hidden">
                        {badge}
                    </span>
                </div>

                {/* Cinematic Hero Container */}
                <div className="relative h-[400px] md:h-[550px] w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl border border-zinc-200/50">
                    <Image
                        src={config.image}
                        alt={title}
                        fill
                        priority
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        className="object-cover"
                    />
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
                    
                    {/* Floating Info Card */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] p-6 md:p-8 text-white max-w-3xl shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/20 text-white border border-white/10 shadow-sm">
                                    {badge}
                                </span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-5">
                                <div className="size-16 rounded-2xl flex items-center justify-center bg-white border border-zinc-100 shadow-md shrink-0 transition-transform hover:scale-105 duration-300">
                                    <config.icon className={cn("size-8", config.iconColor)} />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight text-white mb-2 leading-none">
                                        {title}
                                    </h1>
                                    <p className="text-white/80 text-sm md:text-base font-medium italic leading-relaxed line-clamp-2">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 2-Column Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Descriptions */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Description */}
                        <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-12 shadow-sm relative overflow-hidden group">
                            {/* Theme color side accent */}
                            <div 
                                className="absolute top-0 left-0 w-2 h-full transition-all duration-300 group-hover:w-3"
                                style={{ backgroundColor: config.themeColor }}
                            />
                            
                            <h3 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-3">
                                <BookOpen className="size-6 text-zinc-900" />
                                {locale === 'it' ? "Presentazione del Progetto" : "Project Presentation"}
                            </h3>
                            <p className="text-zinc-600 leading-relaxed font-medium text-base md:text-lg whitespace-pre-line">
                                {content}
                            </p>
                        </div>

                        {/* Highlights Grid */}
                        <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-12 shadow-sm">
                            <h3 className="text-2xl font-bold font-serif text-foreground mb-8 flex items-center gap-3">
                                <Target className="size-6 text-zinc-900" />
                                {locale === 'it' ? "Punti Chiave dell'Iniziativa" : "Key Pillars"}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {highlights.map((point, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex gap-4 hover:shadow-md hover:border-zinc-200 transition-all duration-300"
                                    >
                                        <CheckCircle2 className={cn("size-6 shrink-0", config.iconColor)} />
                                        <span className="text-zinc-600 font-semibold text-sm leading-relaxed">
                                            {point}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 shadow-sm lg:sticky lg:top-24">
                            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-6 pb-2 border-b border-zinc-100">
                                {locale === 'it' ? "Scheda Informativa" : "Info Sheet"}
                            </h4>
                            <div className="space-y-6">
                                {details.map((detail, index) => {
                                    const DetailIcon = detail.icon;
                                    return (
                                        <div key={index} className="flex gap-4 items-start">
                                            <div className="size-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 text-zinc-500 shadow-sm">
                                                <DetailIcon className="size-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                                                    {detail.label}
                                                </span>
                                                <span className="text-sm font-bold text-foreground block mt-0.5 leading-snug">
                                                    {detail.value}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Contact Box Callout */}
                            <div className="mt-8 pt-6 border-t border-zinc-100">
                                <Link
                                    href="/contact"
                                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zinc-900 text-white font-black uppercase tracking-widest text-xs shadow-lg hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 transition-all text-center"
                                >
                                    <MessageSquare className="size-4" />
                                    <span>{locale === 'it' ? "Scrivici" : "Write us"}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
