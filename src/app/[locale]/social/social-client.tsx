"use client"

import { Instagram, Facebook, Youtube, Share2, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

const TiktokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
)

export const dynamic = "force-dynamic"

type SocialLink = {
    name: string
    handle: string
    url: string
    platform: "instagram" | "facebook" | "youtube" | "tiktok"
    color: string
    hoverColor: string
    bg: string
    descKey: string
}

const MORGANA_SOCIALS: SocialLink[] = [
    {
        name: "Instagram Morgana",
        handle: "@associazione.morgana",
        url: "https://www.instagram.com/associazione.morgana",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        descKey: "morgana_desc"
    },
    {
        name: "TikTok Morgana",
        handle: "@associazione.morgana",
        url: "https://www.tiktok.com/@associazione.morgana",
        platform: "tiktok",
        color: "text-zinc-900",
        hoverColor: "hover:bg-zinc-50 hover:border-zinc-200",
        bg: "bg-zinc-900",
        descKey: "morgana_tt_desc"
    },
    {
        name: "Facebook Morgana",
        handle: "Associazione Morgana",
        url: "https://www.facebook.com/Morgana.Associazione/",
        platform: "facebook",
        color: "text-blue-600",
        hoverColor: "hover:bg-blue-50 hover:border-blue-200",
        bg: "bg-blue-600",
        descKey: "morgana_fb_desc"
    },
    {
        name: "YouTube Morgana",
        handle: "Associazione Morgana",
        url: "https://www.youtube.com/@morganaassociazione5592",
        platform: "youtube",
        color: "text-red-600",
        hoverColor: "hover:bg-red-50 hover:border-red-200",
        bg: "bg-red-600",
        descKey: "morgana_yt_desc"
    }
]

const ORUM_SOCIALS: SocialLink[] = [
    {
        name: "Instagram O.R.U.M.",
        handle: "@orum_unime",
        url: "https://www.instagram.com/orum_unime",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        descKey: "orum_desc"
    },
    {
        name: "Facebook O.R.U.M.",
        handle: "Associazione ORUM",
        url: "https://www.facebook.com/AssociazioneOrum/",
        platform: "facebook",
        color: "text-blue-600",
        hoverColor: "hover:bg-blue-50 hover:border-blue-200",
        bg: "bg-blue-600",
        descKey: "orum_fb_desc"
    }
]

export default function SocialPage() {
    const t = useTranslations("SocialPage")

    const renderGrid = (socials: SocialLink[]) => {
        return (
            <div className="grid md:grid-cols-2 gap-6">
                {socials.map((s) => {
                    const Icon = s.platform === "instagram" ? Instagram 
                        : s.platform === "facebook" ? Facebook 
                        : s.platform === "youtube" ? Youtube
                        : TiktokIcon
                    return (
                        <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between transition-all duration-300 ${s.hoverColor} hover:shadow-xl hover:-translate-y-1 group`}
                        >
                            <div>
                                <div className={`size-12 rounded-2xl flex items-center justify-center text-white mb-6 ${s.bg}`}>
                                    <Icon className="size-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                                    {s.platform}
                                </span>
                                <h3 className="text-2xl font-serif font-black text-zinc-900 mb-2 leading-none">
                                    {s.name}
                                </h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
                                    {t(s.descKey)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                <span className={`text-sm font-black tracking-tight ${s.color}`}>
                                    {s.handle}
                                </span>
                                <span className="p-2 rounded-xl bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-colors text-zinc-400">
                                    <ArrowRight className="size-4" />
                                </span>
                            </div>
                        </a>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-0 flex flex-col justify-between">
            <div className="container mx-auto px-6 max-w-5xl mb-20 flex-1">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Share2 className="size-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        {t("title")}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Morgana Section */}
                <div className="mb-20">
                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground uppercase tracking-tight pl-4 border-l-4 border-[#c12830]">
                            {t("morgana_section")}
                        </h2>
                    </div>
                    {renderGrid(MORGANA_SOCIALS)}
                </div>

                {/* Orum Section */}
                <div className="mb-20">
                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-2xl md:text-3xl font-serif font-black text-foreground uppercase tracking-tight pl-4 border-l-4 border-[#18182e]">
                            {t("orum_section")}
                        </h2>
                    </div>
                    {renderGrid(ORUM_SOCIALS)}
                </div>
            </div>

            {/* Community Section (Full Width Diagonal Grid) */}
            <section className="bg-zinc-900 border-t border-white/5 relative z-0 w-full">
                {/* Network Header */}
                <div className="relative h-[180px] md:h-[280px] flex items-center justify-center overflow-hidden">
                    <Image
                         src="/assets/backgrounds/unime.webp"
                         fill
                         className="object-cover opacity-20"
                         alt=""
                         priority
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                    <div className="container relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-14 px-6 text-center">
                        <div className="relative h-12 sm:h-20 md:h-28 w-12 sm:w-20 md:w-28 shrink-0">
                            <Image src="/assets/backgrounds/morgana.webp" fill className="object-contain drop-shadow-2xl" alt="Morgana" />
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none whitespace-nowrap">
                            {t("community_title")}
                        </h2>
                        <div className="relative h-12 sm:h-20 md:h-28 w-12 sm:w-20 md:w-28 shrink-0">
                            <Image src="/assets/backgrounds/orum.webp" fill className="object-contain drop-shadow-2xl" alt="O.R.U.M." />
                        </div>
                    </div>
                </div>

                {/* Diagonal Network Grid */}
                <div className="flex flex-col md:flex-row h-auto md:h-[450px] overflow-hidden">
                    {/* Unimhealth */}
                    <a 
                         href="https://www.instagram.com/unimhealth"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#c12830] overflow-hidden md:[clip-path:polygon(0_0,100%_0,75%_100%,0_100%)] z-40 transition-all hover:flex-[1.3] duration-500"
                    >
                         <Image src="/assets/backgrounds/policlinico.webp" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Unimhealth Background" sizes="(max-width: 768px) 100vw, 20vw" />
                         <div className="absolute inset-0 flex items-center justify-center p-8 md:pr-20">
                             <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                 <Image src="/assets/backgrounds/unimhealth.webp" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unimhealth Logo" />
                             </div>
                         </div>
                    </a>

                    {/* Studenti Economia */}
                    <a 
                         href="https://www.instagram.com/studentieconomia"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#0055a4] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-30 transition-all hover:flex-[1.3] duration-500"
                    >
                         <Image src="/assets/backgrounds/economia.webp" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Economia Background" sizes="(max-width: 768px) 100vw, 20vw" />
                         <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                             <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                 <Image src="/assets/backgrounds/studentieconomia.webp" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Economia Logo" />
                             </div>
                         </div>
                    </a>

                    {/* Unime Matricole */}
                    <a 
                         href="https://www.instagram.com/unime.matricole"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative group flex-1 min-h-[250px] md:min-h-0 bg-gradient-to-br from-[#ffffff] to-[#afafaf] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-20 transition-all hover:flex-[1.3] duration-500"
                    >
                         <Image src="/assets/backgrounds/matricole.webp" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Matricole Background" sizes="(max-width: 768px) 100vw, 20vw" />
                         <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                             <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                 <Image src="/assets/backgrounds/unimematricole.webp" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Unime Matricole Logo" />
                             </div>
                         </div>
                    </a>

                    {/* Studenti Scipog */}
                    <a 
                         href="https://www.instagram.com/studentiscipog"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#ffcc00] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,75%_100%,0_100%)] md:-ml-[8%] z-10 transition-all hover:flex-[1.3] duration-500"
                    >
                         <Image src="/assets/backgrounds/scipog.webp" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Scipog Background" sizes="(max-width: 768px) 100vw, 20vw" />
                         <div className="absolute inset-0 flex items-center justify-center p-8 md:px-16">
                             <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                 <Image src="/assets/backgrounds/studentiscipog.webp" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Studenti Scipog Logo" />
                             </div>
                         </div>
                    </a>

                    {/* Inside Dicam */}
                    <a 
                         href="https://www.instagram.com/inside_dicam"
                         target="_blank"
                         rel="noopener noreferrer"
                         className="relative group flex-1 min-h-[250px] md:min-h-0 bg-[#d81b60] overflow-hidden md:[clip-path:polygon(25%_0,100%_0,100%_100%,0_100%)] md:-ml-[8%] z-0 transition-all hover:flex-[1.3] duration-500"
                    >
                         <Image src="/assets/backgrounds/dicam.webp" fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" alt="Dicam Background" sizes="(max-width: 768px) 100vw, 20vw" />
                         <div className="absolute inset-0 flex items-center justify-center p-8 md:pl-20">
                             <div className="size-32 md:size-40 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500 border-4 border-white/20">
                                 <Image src="/assets/backgrounds/insidedicam.webp" width={160} height={160} className="w-[85%] h-[85%] object-contain transition-transform group-hover:scale-125 duration-500" alt="Inside Dicam Logo" />
                             </div>
                         </div>
                    </a>
                </div>
            </section>
        </div>
    )
}
