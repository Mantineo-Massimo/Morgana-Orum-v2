"use client"

import { Instagram, Facebook, Youtube, Share2, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export const dynamic = "force-dynamic"

type SocialLink = {
    name: string
    handle: string
    url: string
    platform: "instagram" | "facebook" | "youtube"
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
        name: "Instagram Unime Matricole",
        handle: "@unime.matricole",
        url: "https://www.instagram.com/unime.matricole",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        descKey: "matricole_desc"
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
                        : Youtube
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
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Share2 className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
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

                {/* Community Section */}
                <div className="mt-20 border-t border-zinc-200 pt-16 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif font-black text-foreground mb-4 uppercase tracking-tight">
                        {t("community_title")}
                    </h2>
                    <p className="text-zinc-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
                        {t("community_subtitle")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                        {/* Morgana Logo */}
                        <a
                            href="https://www.instagram.com/associazione.morgana"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center p-6 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-48 h-48"
                        >
                            <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/assets/morgana.webp"
                                    alt="Morgana Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </a>

                        {/* Orum Logo */}
                        <a
                            href="https://www.instagram.com/orum_unime"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center justify-center p-6 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-48 h-48"
                        >
                            <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-300">
                                <Image
                                    src="/assets/orum.webp"
                                    alt="O.R.U.M. Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    )
}
