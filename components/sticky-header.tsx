"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { cn } from "@/lib/utils"
import { useBrand } from "@/components/brand-provider"

export function StickyHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Brand Colors Unificati
    const { brand } = useBrand()

    const brandColorClass = brand === "unimhealth" ? "bg-[#c12830]" :
        brand === "economia" ? "bg-[#0055a4]" :
            brand === "matricole" ? "bg-gradient-to-r from-[#ffffff] to-[#afafaf]" :
                brand === "scipog" ? "bg-[#ffcc00]" :
                    brand === "dicam" ? "bg-[#d81b60]" :
                        "bg-[linear-gradient(45deg,#c12830_0%,#18182e_50%)]"

    // Mapping per i loghi e nomi del network
    const networkInfo: Record<string, { name: string, logo: string, motto: string }> = {
        unimhealth: { name: "Unimhealth", logo: "/assets/unimhealth.png", motto: "Rappresentanza medico-sanitaria" },
        economia: { name: "Studenti Economia", logo: "/assets/studentieconomia.png", motto: "Protagonisti del cambiamento" },
        matricole: { name: "Unime Matricole", logo: "/assets/unimematricole.png", motto: "Il tuo primo passo in Ateneo" },
        scipog: { name: "Studenti Scipog", logo: "/assets/studentiscipog.png", motto: "La voce tra Scienze Politiche e Giuridiche" },
        dicam: { name: "Inside Dicam", logo: "/assets/insidedicam.png", motto: "Creatività e cultura al DICAM" },
    }

    const currentNetwork = brand && networkInfo[brand] ? networkInfo[brand] : null

    if (!hasMounted) return null

    return (
        <header
            id="site-header"
            className={cn(
                "sticky top-0 z-50 transition-all duration-500 ease-in-out shadow-md",
                "bg-white" // Base is always white now
            )}
        >
            {/* BACKGROUND LAYER - Handles Colors & Shapes */}
            <div className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-hidden">
                {/* Colored Part OVERLAY */}
                <div
                    className={cn(
                        "absolute top-0 left-0 h-full transition-all duration-500 z-10",
                        brandColorClass,
                        "rounded-br-[100px]",
                        // Dynamic width logic
                        isScrolled
                            ? brand ? "w-[85%] sm:w-[75%] md:w-[50%] lg:w-[45%] xl:w-[40%]" : "w-[75%] sm:w-[65%] md:w-[45%] lg:w-[45%] xl:w-[40%]"
                            : brand ? "w-[90%] sm:w-[80%] md:w-[60%] lg:w-[48%] xl:w-[42%]" : "w-[80%] sm:w-[70%] md:w-[55%] lg:w-[48%] xl:w-[42%]"
                    )}
                />
            </div>

            {/* CONTENT LAYER - Handles Alignment with Container */}
            <div
                className={cn(
                    "container relative z-20 flex items-center transition-all duration-500 justify-between",
                    isScrolled ? "h-20 md:h-24" : "h-32 md:h-40"
                )}
            >
                {/* Logo Section - Left Aligned */}
                <div className="flex items-center gap-1.5 md:gap-4">
                    {/* Logo - Leads to Sub-site Home */}
                    <Link
                        href={currentNetwork ? `/network/${brand}` : "/"}
                        className="relative transition-all duration-500 flex items-center backdrop-blur-sm rounded-2xl"
                        style={{ height: isScrolled ? 'fit-content' : 'auto' }}
                    >
                        <div
                            className={cn(
                                "relative transition-all duration-500 flex items-center",
                                isScrolled
                                    ? "h-14 md:h-20 gap-1.5 md:gap-2 p-1 md:p-1.5"
                                    : "h-12 sm:h-16 md:h-28 gap-1.5 md:gap-4 p-1 md:p-2"
                            )}
                        >
                            {currentNetwork ? (
                                <div className="relative h-full aspect-square">
                                    <Image
                                        src={currentNetwork.logo}
                                        alt={currentNetwork.name}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="relative h-full aspect-square">
                                        <Image
                                            src={`/assets/morgana.png`}
                                            alt="Morgana logo"
                                            fill
                                            className="object-contain"
                                            priority
                                            sizes="(max-width: 768px) 96px, 128px"
                                        />
                                    </div>
                                    <div className="h-full w-px bg-white/20" />
                                    <div className="relative h-full aspect-square">
                                        <Image
                                            src={`/assets/orum.png`}
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
                    </Link>

                    {/* Text Section - Stacked Vertically */}
                    <div className="flex flex-col text-white justify-center">
                        <Link
                            href={currentNetwork ? `/network/${brand}` : "/"}
                            className="flex flex-col gap-0.5 hover:opacity-80 transition-opacity"
                        >
                            <span className={cn(
                                "font-serif font-black uppercase tracking-tight leading-none transition-all duration-500",
                                isScrolled ? "text-sm md:text-xl" : "text-[15px] sm:text-xl md:text-2xl"
                            )}>
                                {currentNetwork ? currentNetwork.name : "Morgana & O.R.U.M."}
                            </span>
                        </Link>

                        {currentNetwork ? (
                            <Link
                                href="/"
                                className="text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-normal md:tracking-[0.15em] font-bold mt-1.5 md:mt-2 opacity-70 leading-tight hover:underline underline-offset-2 hover:opacity-100 transition-all border-t border-white/10 pt-1"
                            >
                                Torna al sito Morgana & O.R.U.M.
                            </Link>
                        ) : (
                            <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-normal md:tracking-[0.2em] font-bold mt-0.5 md:mt-1.5 opacity-90 leading-tight">
                                Associazioni Universitarie
                            </span>
                        )}
                    </div>
                </div>

                {/* Navigation Section - Right Aligned (including Mobile Menu) */}
                <div className="flex items-center">
                    <MainNav
                        isScrolled={true} // Always white background style
                        isLoggedIn={isLoggedIn}
                    />
                </div>
            </div>
        </header>

    )
}

