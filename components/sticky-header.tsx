"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MainNav } from "@/components/main-nav"
import { cn } from "@/lib/utils"

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
    const brandColorClass = "bg-[linear-gradient(45deg,#c12830_0%,#18182e_50%)]"

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
                            ? "w-[75%] sm:w-[65%] md:w-[50%] lg:w-[50%] xl:w-[40%]"
                            : "w-[80%] sm:w-[70%] md:w-[60%] lg:w-[49%] xl:w-[42%]"
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
                <Link href={`/`} className="flex items-center gap-4 group">
                    {/* Logos Container */}
                    <div
                        className={cn(
                            "relative transition-all duration-500 flex items-center backdrop-blur-sm rounded-2xl",
                            isScrolled
                                ? "h-10 md:h-14 gap-1.5 md:gap-2 p-1.5 md:p-2"
                                : "h-12 sm:h-16 md:h-28 gap-1.5 md:gap-4 p-1 md:p-2"
                        )}
                    >
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
                    </div>

                    {/* Text Brand */}
                    <div className="flex flex-col text-white justify-center">
                        <span className={cn(
                            "font-serif font-black uppercase tracking-tight leading-none transition-all duration-500 line-clamp-1",
                            isScrolled ? "text-sm md:text-xl" : "text-[15px] sm:text-xl md:text-2xl"
                        )}>
                            Morgana & O.R.U.M.
                        </span>
                        <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-normal md:tracking-[0.2em] font-bold mt-0.5 md:mt-1.5 opacity-90 leading-tight">
                            Associazioni Universitarie
                        </span>
                    </div>
                </Link>

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

