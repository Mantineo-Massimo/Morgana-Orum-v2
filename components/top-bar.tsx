"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBrand } from "@/components/brand-provider"

export function TopBar() {
    const { brand } = useBrand()
    // Unificato: Colore neutro scuro per la top bar
    const bgColor = "bg-zinc-900"

    const SOCIAL_MAPPING: Record<string, string> = {
        matricole: "unime.matricol",
        unimhealth: "unimhealth",
        economia: "studentieconomia",
        scipog: "studentiscipog",
        dicam: "insidedicam"
    }

    const BRAND_NAMES: Record<string, string> = {
        matricole: "Unime Matricole",
        unimhealth: "Unimhealth",
        economia: "Studenti Economia",
        scipog: "Studenti Scipog",
        dicam: "Inside Dicam"
    }

    const networkIG = brand && SOCIAL_MAPPING[brand] ? SOCIAL_MAPPING[brand] : null
    const networkName = brand && BRAND_NAMES[brand] ? BRAND_NAMES[brand] : null

    return (
        <div id="site-topbar" className={cn("w-full text-white py-2 px-4 shadow-sm", bgColor)}>
            <div className="container mx-auto flex justify-center md:justify-between items-center text-xs md:text-sm font-medium">

                {/* Left Side: "Gazette" or similar CTA */}
                <div className="hidden md:flex items-center gap-2">
                    <Mail className="size-4" />
                    <span className="uppercase tracking-widest opacity-90 hover:opacity-100 cursor-pointer">
                        Iscriviti alla Newsletter
                    </span>
                </div>

                {/* Right Side: Socials */}
                <div className="flex items-center gap-3 md:gap-4">
                    {networkIG && (
                        <>
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <span className="text-[10px] md:text-xs uppercase font-bold text-orange-400 mr-0.5 md:mr-1">{networkName}:</span>
                                <a href={`https://www.instagram.com/${networkIG}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors"><Instagram className="size-3 md:size-3.5" /></a>
                            </div>
                            <div className="w-px h-3 md:h-4 bg-zinc-800"></div>
                        </>
                    )}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500 mr-0.5 md:mr-1">Morgana:</span>
                        <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><Facebook className="size-3 md:size-3.5" /></a>
                        <a href="https://www.instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors"><Instagram className="size-3 md:size-3.5" /></a>
                        <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors"><Youtube className="size-3 md:size-3.5" /></a>
                    </div>
                    <div className="w-px h-3 md:h-4 bg-zinc-800"></div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500 mr-0.5 md:mr-1">O.R.U.M.:</span>
                        <a href="https://www.facebook.com/AssociazioneOrum/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><Facebook className="size-3 md:size-3.5" /></a>
                        <a href="https://www.instagram.com/orum_unime" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><Instagram className="size-3 md:size-3.5" /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}
