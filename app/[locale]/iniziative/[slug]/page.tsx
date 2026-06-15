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
    Ticket,
    Globe,
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
    gallery: string[]
}

const slugMap: Record<string, InitiativeConfig> = {
    "cineforum": {
        prefix: "cineforum",
        image: "/assets/slides/2.webp",
        icon: Film,
        iconColor: "text-red-600",
        iconBg: "bg-red-50 border-red-100",
        themeColor: "#c12830", // Red
        badgeIt: "CULTURA",
        badgeEn: "CULTURE",
        highlightsIt: [
            "Tariffa agevolata: Ingresso a prezzo speciale ridotto presso il Cinema Apollo per la comunità studentesca.",
            "Dibattito aperto: Uno spazio per scambiare opinioni e condividere riflessioni tra studenti al termine del film.",
            "Cultura e riflessione: Film d'autore selezionati per diffondere la cultura cinematografica e stimolare idee.",
            "Riconoscimento CFU: Incontri accreditati dall'Ateneo per il rilascio di crediti formativi universitari."
        ],
        highlightsEn: [
            "Discounted rate: Special reduced ticket price at Cinema Apollo for the student community.",
            "Open discussion: A space to share opinions and thoughts among students at the end of the film.",
            "Culture & reflection: Selected quality films to spread cinema passion and stimulate critical thinking.",
            "Academic credits: University-accredited sessions offering training credits (CFU) for participating students."
        ],
        detailsIt: [
            { label: "Edizione", value: "IX Edizione", icon: Award },
            { label: "Destinatari", value: "Tutti gli studenti iscritti ad Unime", icon: Users },
            { label: "Periodo", value: "Ciclico durante l'anno accademico", icon: Calendar },
            { label: "Luogo", value: "Cinema Apollo", icon: MapPin },
            { label: "Costo", value: "4€ una proiezione / 10€ quattro proiezioni", icon: Ticket }
        ],
        detailsEn: [
            { label: "Edition", value: "9th Edition", icon: Award },
            { label: "Target", value: "All enrolled Unime students", icon: Users },
            { label: "Period", value: "Cyclical throughout the academic year", icon: Calendar },
            { label: "Locations", value: "Cinema Apollo", icon: MapPin },
            { label: "Admission", value: "Paid (4€ single screening / 10€ four screenings)", icon: Ticket }
        ],
        gallery: [
            "/assets/slides/2.webp",
            "/assets/programma.webp",
            "/assets/unime.webp"
        ]
    },
    "piazza-dell-arte": {
        prefix: "piazza",
        image: "/assets/piazza.webp",
        icon: Sparkles,
        iconColor: "text-[#f9a620]",
        iconBg: "bg-amber-50 border-amber-100",
        themeColor: "linear-gradient(to right, #1fbcd3, #27a85d, #f9a620)", // Piazza Colors Gradient
        badgeIt: "ARTE & MUSICA",
        badgeEn: "ART & MUSIC",
        highlightsIt: [
            "Grande festival primaverile giunto alla XI edizione con band, solisti e ballerini live.",
            "Estemporanee di pittura, laboratori creativi ed esposizione di sculture.",
            "FantArte: la prima piattaforma di gamification dell'arte a Messina (www.fantarte.it).",
            "Promozione e valorizzazione gratuita dei giovani talenti del territorio messinese."
        ],
        highlightsEn: [
            "Large spring festival now in its 11th edition featuring live bands, soloists, and dancers.",
            "Live painting, creative workshops, and sculpture showcases.",
            "FantArte: the first art gamification platform in Messina (www.fantarte.it).",
            "Free promotion and spotlighting of young local talents from Messina."
        ],
        detailsIt: [
            { label: "Sito Web", value: "piazzadellarte.morganaorum.it", icon: Globe },
            { label: "Periodo", value: "Primavera (Maggio/Giugno)", icon: Calendar },
            { label: "Luogo", value: "Cortile Centrale e Scalinata Rettorato", icon: MapPin },
            { label: "Destinatari", value: "Studenti, artisti e cittadinanza", icon: Users }
        ],
        detailsEn: [
            { label: "Website", value: "piazzadellarte.morganaorum.it", icon: Globe },
            { label: "Period", value: "Spring (May/June)", icon: Calendar },
            { label: "Locations", value: "Central Courtyard & Rectorate Staircase", icon: MapPin },
            { label: "Target", value: "Students, artists, and citizens", icon: Users }
        ],
        gallery: [
            "/assets/piazza.webp",
            "/assets/artisti.webp",
            "/assets/slides/1.webp"
        ]
    },
    "notte-dei-regali": {
        prefix: "regali",
        image: "/assets/slides/3.webp",
        icon: Gift,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50 border-amber-100",
        themeColor: "#eab308", // Yellow
        badgeIt: "SOLIDARIETÀ",
        badgeEn: "SOLIDARITY",
        highlightsIt: [
            "Raccolta benefica natalizia di giocattoli, libri e regali coordinata dagli studenti.",
            "Organizzata dalle associazioni Morgana e O.R.U.M. in collaborazione con le realtà del territorio.",
            "Punto di raccolta centrale presso l'hub di Via Sant'Elia 11 e nei vari dipartimenti universitari.",
            "Donazione diretta ai bambini dei reparti di pediatria del Policlinico e case famiglia."
        ],
        highlightsEn: [
            "Charitable Christmas collection of toys, books, and gifts managed by students.",
            "Organized by the Morgana and O.R.U.M. associations in partnership with local organizations.",
            "Central collection points at the Via Sant'Elia 11 hub and in various university departments.",
            "Direct donation to children in the Policlinico pediatric wards and local shelters."
        ],
        detailsIt: [
            { label: "Periodo", value: "Dicembre (Periodo Natalizio)", icon: Calendar },
            { label: "Luogo", value: "Via Sant'Elia 11, dipartimenti UniMe e reparti pediatrici", icon: MapPin },
            { label: "Destinatari", value: "Bambini in situazioni di fragilità del territorio", icon: Users }
        ],
        detailsEn: [
            { label: "Period", value: "December (Christmas Season)", icon: Calendar },
            { label: "Locations", value: "Via Sant'Elia 11, UniMe departments, and pediatric wards", icon: MapPin },
            { label: "Target", value: "Vulnerable and underprivileged local children", icon: Users }
        ],
        gallery: [
            "/assets/slides/3.webp",
            "/assets/policlinico.webp",
            "/assets/morgana.webp"
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
            "Winter School annuale in collaborazione con Amnesty International ed il dipartimento Scipog.",
            "Incontri con magistrati, storici, giornalisti ed accademici di rilievo nazionale."
        ],
        highlightsEn: [
            "Accredited seminars and conferences for earning university credits (CFU).",
            "Focus on legality and international relations, such as the 'Two Peoples, Two States' debate.",
            "Annual Winter School in partnership with Amnesty International and the Scipog department.",
            "Meetings with judges, historians, journalists, and national academics."
        ],
        detailsIt: [
            { label: "Periodo", value: "Ciclico (da Ottobre a Maggio)", icon: Calendar },
            { label: "Luogo", value: "Aula Magna e aule dipartimentali", icon: MapPin },
            { label: "Destinatari", value: "Studenti universitari e accademici", icon: Users }
        ],
        detailsEn: [
            { label: "Period", value: "Cyclical (from October to May)", icon: Calendar },
            { label: "Locations", value: "Aula Magna and department lecture halls", icon: MapPin },
            { label: "Target", value: "University students and academics", icon: Users }
        ],
        gallery: [
            "/assets/programma.webp",
            "/assets/unime.webp",
            "/assets/slides/2.webp"
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
            "Valenza accademica con rilascio di crediti formativi (0,25 CFU) ai partecipanti dei tornei.",
            "Promozione del benessere psicofisico e sani valori dello sport tra i poli d'Ateneo."
        ],
        highlightsEn: [
            "Interdepartmental futsal, volleyball, and basketball tournaments (men/women).",
            "Official partnership with SSD Unime and CUS Messina for Olympic facility use.",
            "Academic value with format credits (0.25 CFU) awarded to tournament participants.",
            "Promotion of physical/mental well-being and healthy values across campuses."
        ],
        detailsIt: [
            { label: "Periodo", value: "Sessioni Autunnali e Primaverili", icon: Calendar },
            { label: "Luogo", value: "Cittadella Sportiva Universitaria (Polo Annunziata)", icon: MapPin },
            { label: "Destinatari", value: "Studenti atleti e appassionati iscritti a Unime", icon: Users }
        ],
        detailsEn: [
            { label: "Period", value: "Fall and Spring Sessions", icon: Calendar },
            { label: "Locations", value: "University Sports Citadel (Annunziata)", icon: MapPin },
            { label: "Target", value: "Student athletes and Unime sports enthusiasts", icon: Users }
        ],
        gallery: [
            "/assets/slides/1.webp",
            "/assets/artisti.webp",
            "/assets/piazza.webp"
        ]
    },
    "svago": {
        prefix: "svago",
        image: "/assets/artisti.webp",
        icon: Sparkles,
        iconColor: "text-violet-500",
        iconBg: "bg-violet-50 border-violet-100",
        themeColor: "#8b5cf6", // Violet
        badgeIt: "SOCIALITÀ",
        badgeEn: "SOCIAL",
        highlightsIt: [
            "Orientamento e tutorato in ingresso per agevolare l'integrazione accademica.",
            "Coordinamento della 'Rete Contatti Unime 2027' per le scuole secondarie provinciali.",
            "Iniziative ricreative, guide all'immatricolazione e community di supporto digitale.",
            "Aperitivi di benvenuto e giornate informative per l'integrazione delle matricole."
        ],
        highlightsEn: [
            "Incoming guidance and tutoring to ease academic integration.",
            "Coordination of the 'Unime Contatti 2027' network for provincial high schools.",
            "Recreational initiatives, enrollment guides, and digital support communities.",
            "Welcome gatherings and info days to support freshman integration."
        ],
        detailsIt: [
            { label: "Periodo", value: "Inizio anno accademico (Settembre/Ottobre)", icon: Calendar },
            { label: "Luogo", value: "Aree esterne dell'Ateneo, poli didattici e social hub", icon: MapPin },
            { label: "Destinatari", value: "Nuove matricole e studenti iscritti ad Unime", icon: Users }
        ],
        detailsEn: [
            { label: "Period", value: "Start of the academic year (September/October)", icon: Calendar },
            { label: "Locations", value: "University outdoor areas, campuses, and social hubs", icon: MapPin },
            { label: "Target", value: "New freshmen and enrolled Unime students", icon: Users }
        ],
        gallery: [
            "/assets/artisti.webp",
            "/assets/matricole.webp",
            "/assets/slides/3.webp"
        ]
    }
}

function renderTextWithLinks(text: string) {
    if (!text) return null
    
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|piazzadellarte\.morganaorum\.it[^\s]*)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            const cleanPart = part.replace(/[.,)]+$/, "")
            const ending = part.slice(cleanPart.length)
            
            const href = cleanPart.startsWith("http") ? cleanPart : `https://${cleanPart}`
            
            return (
                <span key={index}>
                    <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="underline font-black hover:opacity-80 text-inherit"
                    >
                        {cleanPart}
                    </a>
                    {ending}
                </span>
            )
        }
        return part
    })
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

    const isPiazza = slug === "piazza-dell-arte";

    return (
        <div className="min-h-screen bg-zinc-50 pt-28 pb-20 animate-in fade-in duration-700">
            {/* SVG Gradient definition for Piazza dell'Arte */}
            <svg width="0" height="0" className="absolute" style={{ pointerEvents: "none" }}>
                <defs>
                    <linearGradient id="piazza-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1fbcd3" />
                        <stop offset="50%" stopColor="#27a85d" />
                        <stop offset="100%" stopColor="#f9a620" />
                    </linearGradient>
                </defs>
            </svg>
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
                                <div 
                                    className="size-16 rounded-2xl flex items-center justify-center bg-white border border-zinc-100 shadow-md shrink-0 transition-transform hover:scale-105 duration-300"
                                    style={{ 
                                        border: "2px solid transparent", 
                                        backgroundImage: `linear-gradient(white, white), ${config.themeColor.includes("gradient") ? config.themeColor : `linear-gradient(${config.themeColor}, ${config.themeColor})`}`, 
                                        backgroundOrigin: "border-box", 
                                        backgroundClip: "padding-box, border-box" 
                                    }}
                                >
                                    <config.icon 
                                        className="size-8" 
                                        style={{ stroke: config.themeColor.includes("gradient") ? "url(#piazza-gradient)" : config.themeColor }}
                                    />
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
                    {/* Left Column: Descriptions */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Description */}
                        <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-12 shadow-sm relative overflow-hidden group">
                            {/* Theme color side accent */}
                            <div
                                className="absolute top-0 left-0 w-2 h-full transition-all duration-300 group-hover:w-3"
                                style={{ background: config.themeColor }}
                            />

                            <h3 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-3">
                                <BookOpen className="size-6 text-zinc-900" />
                                {locale === 'it' ? "Presentazione del Progetto" : "Project Presentation"}
                            </h3>
                            <p className="text-zinc-600 leading-relaxed font-medium text-base md:text-lg whitespace-pre-line">
                                {renderTextWithLinks(content)}
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
                                        <CheckCircle2 
                                            className="size-6 shrink-0" 
                                            style={{ stroke: config.themeColor.includes("gradient") ? "url(#piazza-gradient)" : config.themeColor }}
                                        />
                                        <span className="text-zinc-600 font-semibold text-sm leading-relaxed">
                                            {renderTextWithLinks(point)}
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
                                            <div 
                                                className="size-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 text-zinc-500 shadow-sm"
                                                style={{ 
                                                    border: "1.5px solid transparent", 
                                                    backgroundImage: `linear-gradient(#f9fafb, #f9fafb), ${config.themeColor.includes("gradient") ? config.themeColor : `linear-gradient(${config.themeColor}, ${config.themeColor})`}`, 
                                                    backgroundOrigin: "border-box", 
                                                    backgroundClip: "padding-box, border-box" 
                                                }}
                                            >
                                                <DetailIcon 
                                                    className="size-5" 
                                                    style={{ stroke: config.themeColor.includes("gradient") ? "url(#piazza-gradient)" : config.themeColor }}
                                                />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                                                    {detail.label}
                                                </span>
                                                <span className="text-sm font-bold text-foreground block mt-0.5 leading-snug">
                                                    {renderTextWithLinks(detail.value)}
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

                {/* Gallery Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 md:p-12 shadow-sm"
                >
                    <h3 className="text-2xl font-bold font-serif text-foreground mb-8 flex items-center gap-3">
                        <Sparkles 
                            className="size-6"
                            style={{ stroke: config.themeColor.includes("gradient") ? "url(#piazza-gradient)" : config.themeColor }}
                        />
                        {locale === 'it' ? "Momenti dell'Iniziativa" : "Initiative Moments"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {config.gallery.map((img, index) => (
                            <div
                                key={index}
                                className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
                            >
                                <Image
                                    src={img}
                                    alt={`${title} moment ${index + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
