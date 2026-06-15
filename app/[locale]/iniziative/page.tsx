"use client"

import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { 
    GraduationCap, 
    BookOpen, 
    Globe, 
    Bus, 
    Laptop, 
    Compass, 
    Wallet, 
    Trophy, 
    HeartHandshake, 
    MessageSquare,
    HelpCircle,
    Film,
    Gift,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default function IniziativePage() {
    const t = useTranslations("IniziativePage")
    const locale = useLocale()

    const areas = [
        {
            title: t("didattica_title"),
            desc: t("didattica_desc"),
            tag: t("didattica_tag"),
            icon: GraduationCap,
            iconColor: "text-red-600",
            iconBg: "bg-red-50 border-red-100",
            glowColor: "group-hover:shadow-red-500/10"
        },
        {
            title: t("aule_title"),
            desc: t("aule_desc"),
            tag: t("aule_tag"),
            icon: BookOpen,
            iconColor: "text-amber-600",
            iconBg: "bg-amber-50 border-amber-100",
            glowColor: "group-hover:shadow-amber-500/10"
        },
        {
            title: t("internazionalizzazione_title"),
            desc: t("internazionalizzazione_desc"),
            tag: t("internazionalizzazione_tag"),
            icon: Globe,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50 border-blue-100",
            glowColor: "group-hover:shadow-blue-500/10"
        },
        {
            title: t("trasporti_title"),
            desc: t("trasporti_desc"),
            tag: t("trasporti_tag"),
            icon: Bus,
            iconColor: "text-emerald-600",
            iconBg: "bg-emerald-50 border-emerald-100",
            glowColor: "group-hover:shadow-emerald-500/10"
        },
        {
            title: t("digitalizzazione_title"),
            desc: t("digitalizzazione_desc"),
            tag: t("digitalizzazione_tag"),
            icon: Laptop,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50 border-purple-100",
            glowColor: "group-hover:shadow-purple-500/10"
        },
        {
            title: t("orientamento_title"),
            desc: t("orientamento_desc"),
            tag: t("orientamento_tag"),
            icon: Compass,
            iconColor: "text-cyan-600",
            iconBg: "bg-cyan-50 border-cyan-100",
            glowColor: "group-hover:shadow-cyan-500/10"
        },
        {
            title: t("diritto_title"),
            desc: t("diritto_desc"),
            tag: t("diritto_tag"),
            icon: Wallet,
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-50 border-indigo-100",
            glowColor: "group-hover:shadow-indigo-500/10"
        },
        {
            title: t("attivita_title"),
            desc: t("attivita_desc"),
            tag: t("attivita_tag"),
            icon: Trophy,
            iconColor: "text-orange-600",
            iconBg: "bg-orange-50 border-orange-100",
            glowColor: "group-hover:shadow-orange-500/10"
        },
        {
            title: t("salute_title"),
            desc: t("salute_desc"),
            tag: t("salute_tag"),
            icon: HeartHandshake,
            iconColor: "text-rose-600",
            iconBg: "bg-rose-50 border-rose-100",
            glowColor: "group-hover:shadow-rose-500/10"
        }
    ]

    const majorInitiatives = [
        {
            slug: "cineforum",
            title: t("cineforum_title"),
            desc: t("cineforum_desc"),
            image: "/assets/slides/2.webp",
            icon: Film,
            iconColor: "text-red-600",
            themeColor: "#c12830",
            bgClass: "from-red-500/5 to-rose-500/5 border-red-100/30",
            badge: locale === 'it' ? "CULTURA" : "CULTURE"
        },
        {
            slug: "piazza-dell-arte",
            title: t("piazza_title"),
            desc: t("piazza_desc"),
            image: "/assets/piazza.webp",
            icon: Sparkles,
            iconColor: "text-[#f9a620]",
            themeColor: "linear-gradient(to right, #1fbcd3, #27a85d, #f9a620)",
            bgClass: "from-[#1fbcd3]/5 via-[#27a85d]/5 to-[#f9a620]/5 border-[#27a85d]/20",
            badge: locale === 'it' ? "ARTE & MUSICA" : "ART & MUSIC"
        },
        {
            slug: "notte-dei-regali",
            title: t("regali_title"),
            desc: t("regali_desc"),
            image: "/assets/slides/3.webp",
            icon: Gift,
            iconColor: "text-amber-500",
            themeColor: "#eab308",
            bgClass: "from-amber-500/5 to-yellow-500/5 border-amber-100/30",
            badge: locale === 'it' ? "SOLIDARIETÀ" : "SOLIDARITY"
        },
        {
            slug: "conferenze",
            title: t("conferenze_title"),
            desc: t("conferenze_desc"),
            image: "/assets/programma.webp",
            icon: BookOpen,
            iconColor: "text-blue-500",
            themeColor: "#3b82f6",
            bgClass: "from-blue-500/5 to-cyan-500/5 border-blue-100/30",
            badge: locale === 'it' ? "FORMAZIONE & CFU" : "CFU SEMINARS"
        },
        {
            slug: "sport",
            title: t("sport_title"),
            desc: t("sport_desc"),
            image: "/assets/slides/1.webp",
            icon: Trophy,
            iconColor: "text-emerald-500",
            themeColor: "#10b981",
            bgClass: "from-emerald-500/5 to-teal-500/5 border-emerald-100/30",
            badge: locale === 'it' ? "SPORT & BENESSERE" : "SPORTS"
        },
        {
            slug: "svago",
            title: t("svago_title"),
            desc: t("svago_desc"),
            image: "/assets/artisti.webp",
            icon: Sparkles,
            iconColor: "text-violet-500",
            themeColor: "#8b5cf6",
            bgClass: "from-violet-500/5 to-purple-500/5 border-violet-100/30",
            badge: locale === 'it' ? "SOCIALITÀ" : "SOCIAL"
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
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
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="size-20 bg-zinc-900/5 text-zinc-900 rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3 border border-zinc-900/10">
                        <HelpCircle className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg md:text-xl font-medium text-zinc-500 italic mb-6">
                        {t("subtitle")}
                    </p>
                    <p className="text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>

                {/* Major Initiatives Section Header */}
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground mb-4 uppercase tracking-tight">
                        {t("major_title")}
                    </h2>
                    <p className="text-lg text-zinc-600 font-medium italic">
                        {t("major_subtitle")}
                    </p>
                </div>

                {/* Major Initiatives Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
                    {majorInitiatives.map((item, idx) => (
                        <Link
                            key={idx}
                            href={`/iniziative/${item.slug}`}
                            className="block group"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="bg-white rounded-[2.5rem] border border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative h-[450px] shadow-sm"
                                style={{ 
                                    border: "1px solid transparent", 
                                    backgroundImage: `linear-gradient(white, white), ${item.themeColor.includes("gradient") ? item.themeColor : `linear-gradient(${item.themeColor}, ${item.themeColor})`}`, 
                                    backgroundOrigin: "border-box", 
                                    backgroundClip: "padding-box, border-box" 
                                }}
                            >
                                {/* Image Container */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute top-6 right-6 z-10">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white shadow-sm border border-zinc-100 text-zinc-500">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                                        <div 
                                            className="size-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-foreground font-bold shadow-sm border border-zinc-200"
                                            style={{ 
                                                border: "1.5px solid transparent", 
                                                backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), ${item.themeColor.includes("gradient") ? item.themeColor : `linear-gradient(${item.themeColor}, ${item.themeColor})`}`, 
                                                backgroundOrigin: "border-box", 
                                                backgroundClip: "padding-box, border-box" 
                                            }}
                                        >
                                            <item.icon 
                                                className="size-5" 
                                                style={{ stroke: item.themeColor.includes("gradient") ? "url(#piazza-gradient)" : item.themeColor }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground mb-3 font-serif">
                                            {item.title}
                                        </h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed mb-4 font-medium line-clamp-3">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex items-center justify-between text-xs font-bold text-zinc-400 border-t border-zinc-100">
                                        <span>Scopri di più</span>
                                        <span 
                                            className="transition-transform duration-300 group-hover:translate-x-1 font-bold"
                                            style={{ 
                                                backgroundImage: item.themeColor.includes("gradient") ? item.themeColor : `linear-gradient(${item.themeColor}, ${item.themeColor})`,
                                                WebkitBackgroundClip: "text",
                                                WebkitTextFillColor: "transparent",
                                                backgroundClip: "text",
                                                color: "transparent"
                                            }}
                                        >
                                            →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Areas Section Header */}
                <div className="mt-32 mb-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground mb-4 uppercase tracking-tight">
                        {t("areas_title")}
                    </h2>
                </div>

                {/* Areas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {areas.map((area, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className={cn(
                                "bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden",
                                area.glowColor
                            )}
                        >
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-125 transition-transform duration-500" />
                            
                            <div>
                                <div className={cn("size-14 rounded-2xl flex items-center justify-center mb-6 border font-bold shadow-sm transition-transform duration-500 group-hover:scale-105", area.iconBg)}>
                                    <area.icon className={cn("size-7", area.iconColor)} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-zinc-900 transition-colors font-serif leading-tight">
                                    {area.title}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium">
                                    {area.desc}
                                </p>
                            </div>
                            <div className="border-t border-zinc-100 pt-4 flex items-center text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                <span>{area.tag}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Box */}
                <div className="mt-32 bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl">
                    <div className="relative z-10 flex-1 text-center lg:text-left space-y-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                            <MessageSquare className="size-3 text-red-400" />
                            <span>Contatto Diretto</span>
                        </span>
                        <h3 className="text-2xl md:text-4xl font-serif font-black uppercase tracking-tight leading-none">
                            {t("cta_title")}
                        </h3>
                        <p className="text-white/60 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                            {t("cta_desc")}
                        </p>
                    </div>
                    <a
                        href="/contact"
                        className="relative z-10 inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-zinc-900 font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl hover:scale-105 hover:bg-zinc-50 transition-all shrink-0 w-full sm:w-auto"
                    >
                        {t("cta_button")}
                    </a>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
                </div>
            </div>
        </div>
    )
}

