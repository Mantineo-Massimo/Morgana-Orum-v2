"use client"

import { Instagram, Facebook, Youtube, Share2, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

type SocialLink = {
    name: string
    handle: string
    url: string
    platform: "instagram" | "facebook" | "youtube"
    color: string
    hoverColor: string
    bg: string
    desc: string
}

const SOCIALS: SocialLink[] = [
    {
        name: "Instagram Morgana",
        handle: "@associazione.morgana",
        url: "https://www.instagram.com/associazione.morgana",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        desc: "Notizie ufficiali, attività e orientamento dell'Associazione Morgana."
    },
    {
        name: "Instagram O.R.U.M.",
        handle: "@orum_unime",
        url: "https://www.instagram.com/orum_unime",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        desc: "Diritto allo studio, rappresentanza e news dell'Associazione O.R.U.M."
    },
    {
        name: "Instagram Unime Matricole",
        handle: "@unime.matricole",
        url: "https://www.instagram.com/unime.matricole",
        platform: "instagram",
        color: "text-pink-600",
        hoverColor: "hover:bg-pink-50 hover:border-pink-200",
        bg: "bg-pink-500",
        desc: "Orientamento, guide e gruppi dedicati alle matricole."
    },
    {
        name: "Facebook Morgana",
        handle: "Associazione Morgana",
        url: "https://www.facebook.com/Morgana.Associazione/",
        platform: "facebook",
        color: "text-blue-600",
        hoverColor: "hover:bg-blue-50 hover:border-blue-200",
        bg: "bg-blue-600",
        desc: "La nostra pagina Facebook per aggiornamenti ed eventi."
    },
    {
        name: "Facebook O.R.U.M.",
        handle: "Associazione ORUM",
        url: "https://www.facebook.com/AssociazioneOrum/",
        platform: "facebook",
        color: "text-blue-600",
        hoverColor: "hover:bg-blue-50 hover:border-blue-200",
        bg: "bg-blue-600",
        desc: "La pagina Facebook ufficiale dell'Associazione O.R.U.M."
    },
    {
        name: "YouTube Morgana",
        handle: "Associazione Morgana",
        url: "https://www.youtube.com/@morganaassociazione5592",
        platform: "youtube",
        color: "text-red-600",
        hoverColor: "hover:bg-red-50 hover:border-red-200",
        bg: "bg-red-600",
        desc: "Riprese video di eventi, conferenze e video guide universitarie."
    }
]

export default function SocialPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Share2 className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        I Nostri Canali Social
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        Rimani sempre aggiornato sulle novità di Unime. Seguici sui nostri canali ufficiali per news, eventi, guide e scadenze universitarie.
                    </p>
                </div>

                {/* Social Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {SOCIALS.map((s) => {
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
                                        {s.desc}
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
            </div>
        </div>
    )
}
