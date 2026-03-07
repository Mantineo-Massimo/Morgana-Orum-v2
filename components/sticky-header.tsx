"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { cn } from "@/lib/utils"
import { useBrand } from "@/components/brand-provider"
import { useTranslations } from "next-intl"

export function StickyHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const t = useTranslations("Footer")
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Brand Colors Unificati
    const { brand } = useBrand()

    const brandColorClass = brand === "unimhealth" ? "bg-[#c9041a]" :
        brand === "economia" ? "bg-[#202549]" :
            brand === "matricole" ? "bg-[#f4b716]" :
                brand === "scipog" ? "bg-[#fbc363]" :
                    brand === "dicam" ? "bg-[#f34ab4]" :
                        brand === "piazzadellarte" ? "bg-[linear-gradient(45deg,#14C5D9_0%,#2EA662_50%,#F29829_100%)]" :
                            "bg-[linear-gradient(45deg,#c9041a_0%,#18182e_50%)]"

    // Mapping per i loghi e nomi del network
    const networkInfo: Record<string, { name: string, logo: string, motto: string }> = {
        unimhealth: { name: "Unimhealth", logo: "/assets/unimhealth.webp", motto: "Rappresentanza medico-sanitaria" },
        economia: { name: "Studenti Economia", logo: "/assets/studentieconomia.webp", motto: "Protagonisti del cambiamento" },
        matricole: { name: "Unime Matricole", logo: "/assets/unimematricole.webp", motto: "Il tuo primo passo in Ateneo" },
        scipog: { name: "Studenti Scipog", logo: "/assets/studentiscipog.webp", motto: "La voce tra Scienze Politiche e Giuridiche" },
        dicam: { name: "Inside Dicam", logo: "/assets/insidedicam.webp", motto: "Creatività e cultura al DICAM" },
        piazzadellarte: { name: "Piazza Dell'Arte 2026", logo: "/assets/piazzadellarte.webp", motto: "Il cuore della creatività studentesca" },
    }

    const currentNetwork = brand && networkInfo[brand] ? networkInfo[brand] : null

    return (
        <header
            id="site-header"
            className={cn(
                "sticky top-0 z-50 transition-all duration-500 ease-in-out",
                "h-24 md:h-28" // Constant height to prevent CLS
            )}
        >
            {/* BACKGROUND LAYER - Handles Colors & Shapes */}
            <div className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-hidden bg-white">
                {/* Colored Part OVERLAY */}
                <div
                    className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-700 ease-in-out z-10",
                        brandColorClass,
                        "rounded-br-[80px]",
                        // Unified width logic for absolute stability
                        brand === "piazzadellarte"
                            ? "w-[75%] sm:w-[65%] md:w-[45%] lg:w-[35%] xl:w-[37%] 2xl:w-[38%]"
                            : brand ? "w-[90%] sm:w-[80%] md:w-[58%] lg:w-[40%] xl:w-[42%] 2xl:w-[44%]" : "w-[80%] sm:w-[70%] md:w-[52%] lg:w-[40%] xl:w-[42%] 2xl:w-[44%]"
                    )}
                />
            </div>

            {/* CONTENT LAYER - Handles Alignment with Container */}
            <div
                className={cn(
                    "container relative z-20 flex items-center transition-all duration-500 justify-between h-full",
                    "py-4" // Constant padding to avoid content jumping
                )}
            >
                {/* Logo Section - Left Aligned */}
                <div className="flex items-center gap-1.5 md:gap-2 xl:gap-4 h-full">
                    {/* Logo - Leads to Sub-site Home */}
                    <Link
                        href={currentNetwork ? `/network/${brand}` : "/"}
                        className="relative transition-all duration-500 flex items-center h-full"
                    >
                        <div className="relative transition-all duration-500 flex items-center h-full">
                            <div className="relative h-12 md:h-16 flex items-center gap-2 md:gap-4 p-1">
                                {currentNetwork ? (
                                    <div className={cn(
                                        "relative h-full flex items-center justify-center transition-all duration-500",
                                        brand !== "piazzadellarte" ? "aspect-square bg-white rounded-full shadow-sm p-1" : "aspect-square p-0 scale-[1.2]"
                                    )}>
                                        <div className={cn(
                                            "relative",
                                            brand === "piazzadellarte" ? "w-full h-full" : "w-4/5 h-4/5"
                                        )}>
                                            <Image
                                                src={currentNetwork.logo}
                                                alt={currentNetwork.name}
                                                fill
                                                className="object-contain"
                                                priority
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative h-full aspect-square">
                                            <Image
                                                src={`/assets/morgana.webp`}
                                                alt="Morgana logo"
                                                fill
                                                className="object-contain"
                                                priority
                                                sizes="(max-width: 768px) 96px, 128px"
                                            />
                                        </div>
                                        <div className="h-full w-px bg-white/20 mx-1" />
                                        <div className="relative h-full aspect-square">
                                            <Image
                                                src={`/assets/orum.webp`}
                                                alt="Orum logo"
                                                fill
                                                className="object-contain"
                                                priority
                                                sizes="(max-width: 768px) 96px, 128px"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Text Section - Stacked Vertically */}
                    <div className="flex flex-col text-white justify-center transition-all duration-500">
                        <Link
                            href={currentNetwork ? `/network/${brand}` : "/"}
                            className="flex flex-col gap-0.5 hover:opacity-80 transition-opacity"
                        >
                            <span className={cn(
                                "font-serif font-black uppercase tracking-tight leading-none transition-all duration-500 whitespace-nowrap",
                                isScrolled ? "text-[14px] md:text-lg lg:text-xl" : "text-[15px] sm:text-lg lg:text-xl xl:text-2xl"
                            )}>
                                {currentNetwork ? currentNetwork.name : "Morgana & O.R.U.M."}
                            </span>
                        </Link>

                        {currentNetwork ? (
                            <Link
                                href="/"
                                className="text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-normal md:tracking-[0.15em] font-bold mt-1 md:mt-1.5 opacity-70 leading-tight hover:underline underline-offset-2 hover:opacity-100 transition-all border-t border-white/10 pt-1"
                            >
                                {t("back_to_main")}
                            </Link>
                        ) : (
                            <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-normal md:tracking-[0.2em] font-bold mt-0.5 md:mt-1 opacity-90 leading-tight">
                                {t("brand_tagline")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Section - Right Aligned (including Mobile Menu) */}
                <div className={cn(
                    "flex items-center transition-all duration-500",
                    brand === "piazzadellarte"
                        ? "ml-2 md:ml-4 lg:ml-6 xl:ml-8 2xl:ml-12"
                        : "ml-4 md:ml-8 lg:ml-8 xl:ml-12 2xl:ml-16"
                )}>
                    <MainNav
                        isScrolled={true} // Always white background style
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            </div>
        </header>
    )
}

