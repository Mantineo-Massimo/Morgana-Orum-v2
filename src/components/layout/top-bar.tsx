import { Link } from "@/i18n/routing"
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { headers } from "next/headers"
import { Brand } from "@/components/layout/brand-provider"
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

export async function TopBar() {
    const t = await getTranslations("Footer")
    const brandHeader = headers().get("x-brand")
    const brand = (brandHeader && brandHeader !== "null" ? brandHeader : null) as Brand

    // Unificato: Colore neutro scuro per la top bar
    const bgColor = "bg-zinc-900"

    const SOCIAL_MAPPING: Record<string, string> = {
        matricole: "unime.matricole",
        unimhealth: "unimhealth",
        economia: "studentieconomia",
        scipog: "studentiscipog",
        dicam: "inside_dicam"
    }

    const BRAND_NAMES: Record<string, string> = {
        matricole: "Unime Matricole",
        unimhealth: "Unimhealth",
        economia: "Studenti Economia",
        scipog: "Studenti Scipog",
        dicam: "Inside Dicam"
    }

    const BRAND_COLORS: Record<string, string> = {
        unimhealth: "text-[#c9041a]",
        economia: "text-[#202549]",
        matricole: "text-[#0d6cab]",
        scipog: "text-[#fbc363]",
        dicam: "text-[#f34ab4]"
    }

    const BRAND_LOGOS: Record<string, string> = {
        unimhealth: "/assets/backgrounds/unimhealth.webp",
        economia: "/assets/backgrounds/studentieconomia.webp",
        matricole: "/assets/backgrounds/unimematricole.webp",
        scipog: "/assets/backgrounds/studentiscipog.webp",
        dicam: "/assets/backgrounds/insidedicam.webp"
    }

    const networkIG = brand && SOCIAL_MAPPING[brand] ? SOCIAL_MAPPING[brand] : null
    const networkName = brand && BRAND_NAMES[brand] ? BRAND_NAMES[brand] : null
    const networkColor = brand && BRAND_COLORS[brand] ? BRAND_COLORS[brand] : "text-zinc-500"
    const networkLogo = brand && BRAND_LOGOS[brand] ? BRAND_LOGOS[brand] : null

    return (
        <div id="site-topbar" className={cn("w-full text-white py-2 px-4 shadow-sm", bgColor)}>
            <div className="container mx-auto flex justify-center md:justify-between items-center text-xs md:text-sm font-medium">

                {/* Left Side: Newsletter CTA */}
                <div className="hidden md:flex items-center gap-2 text-white">
                    <Mail className="size-4" />
                    <span className="uppercase tracking-widest opacity-90 hover:opacity-100 cursor-pointer" role="button" aria-label={t("newsletter_title")}>
                        {t("newsletter_title")}
                    </span>
                </div>

                {/* Right Side: Socials */}
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 gap-y-2 md:gap-4 w-full md:w-auto">
                    {networkIG && (
                        <>
                            <div className="flex items-center gap-1 md:gap-4">
                                <div className="flex items-center gap-1 mr-1 shrink-0">
                                    {networkLogo && (
                                        <Image
                                            src={networkLogo}
                                            alt={networkName || "Logo"}
                                            width={16}
                                            height={16}
                                            className="object-contain rounded-full bg-white p-0.5 shrink-0"
                                        />
                                    )}
                                    <span className={cn(
                                        "hidden sm:inline text-[10px] md:text-xs uppercase font-bold",
                                        brand === "matricole" ? "text-white" : "text-zinc-300"
                                    )}>
                                        {networkName}:
                                    </span>
                                </div>
                                <a href={`https://www.instagram.com/${networkIG}`} target="_blank" rel="noopener noreferrer" className={cn("p-1 md:p-1.5 transition-colors", `hover:${networkColor}`)} aria-label={`Instagram ${networkName}`}><Instagram className="size-3.5 md:size-4" /></a>
                            </div>
                            <div className="hidden sm:block w-px h-4 md:h-5 bg-zinc-800 mx-1"></div>
                        </>
                    )}
                    <div className="flex items-center gap-1 md:gap-3">
                        <div className="flex items-center gap-1 mr-1 shrink-0">
                            <Image
                                src="/assets/backgrounds/morgana.webp"
                                alt="Morgana"
                                width={16}
                                height={16}
                                className="object-contain shrink-0"
                            />
                            <span className="hidden sm:inline text-[10px] md:text-xs uppercase font-bold text-zinc-300">Morgana:</span>
                        </div>
                        <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-red-500 transition-colors" aria-label="Facebook Associazione Morgana"><Facebook className="size-3.5 md:size-4" /></a>
                        <a href="https://www.instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-red-400 transition-colors" aria-label="Instagram Associazione Morgana"><Instagram className="size-3.5 md:size-4" /></a>
                        <a href="https://www.tiktok.com/@associazione.morgana" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-zinc-300 transition-colors" aria-label="TikTok Associazione Morgana"><TiktokIcon className="size-3.5 md:size-4" /></a>
                        <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-red-500 transition-colors" aria-label="YouTube Associazione Morgana"><Youtube className="size-3.5 md:size-4" /></a>
                    </div>
                    <div className="w-px h-4 md:h-5 bg-zinc-800 mx-1"></div>
                    <div className="flex items-center gap-1 md:gap-3">
                        <div className="flex items-center gap-1 mr-1 shrink-0">
                            <Image
                                src="/assets/backgrounds/orum.webp"
                                alt="O.R.U.M."
                                width={16}
                                height={16}
                                className="object-contain shrink-0"
                            />
                            <span className="hidden sm:inline text-[10px] md:text-xs uppercase font-bold text-zinc-300">O.R.U.M.:</span>
                        </div>
                        <a href="https://www.facebook.com/AssociazioneOrum/" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-blue-500 transition-colors" aria-label="Facebook Associazione Orum"><Facebook className="size-3.5 md:size-4" /></a>
                        <a href="https://www.instagram.com/orum_unime" target="_blank" rel="noopener noreferrer" className="p-1 md:p-1.5 hover:text-blue-400 transition-colors" aria-label="Instagram Associazione Orum"><Instagram className="size-3.5 md:size-4" /></a>
                    </div>
                    <div className="hidden sm:block w-px h-3 md:h-4 bg-zinc-800 mx-1"></div>

                    {/* Language Switcher integration */}
                    <div className="ml-1 md:ml-0 flex items-center">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </div>
    )
}
