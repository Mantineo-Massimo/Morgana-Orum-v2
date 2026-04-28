"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface Sponsor {
    id: string
    name: string
    logo?: string | null
    website?: string | null
}

interface SponsorsCarouselProps {
    sponsors: Sponsor[]
}

export function SponsorsCarousel({ sponsors }: SponsorsCarouselProps) {
    // If no sponsors, show the placeholders
    const displaySponsors = sponsors.length > 0 ? sponsors : [
        { id: "1", name: "Sponsor 1" },
        { id: "2", name: "Sponsor 2" },
        { id: "3", name: "Sponsor 3" },
        { id: "4", name: "Sponsor 4" },
        { id: "5", name: "Sponsor 5" },
        { id: "6", name: "Sponsor 6" },
    ]

    return (
        <section className="py-16 bg-white border-y border-zinc-100 overflow-hidden flex flex-col items-center">
            <div className="mb-10 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">
                    Con il supporto di
                </h3>
                <div className="h-0.5 w-12 bg-zinc-200 mx-auto rounded-full"></div>
            </div>

            {/* Wrapper that hides horizontal overflow */}
            <div className="w-full relative overflow-hidden flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <motion.div
                    className="flex min-w-max py-4 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {/* First set of logos */}
                    {[...displaySponsors, ...displaySponsors].map((s, idx) => (
                        <div key={`${s.id}-${idx}`} className="mx-10 md:mx-16 grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center min-w-[140px]">
                            {s.logo ? (
                                <a 
                                    href={s.website || "#"} 
                                    target={s.website ? "_blank" : undefined} 
                                    rel="noopener noreferrer"
                                    className="relative w-32 h-16 transition-transform hover:scale-110"
                                >
                                    <Image src={s.logo} alt={s.name} fill className="object-contain" />
                                </a>
                            ) : (
                                <div className="text-sm font-black text-zinc-300 uppercase tracking-widest border-2 border-dashed border-zinc-100 px-6 py-3 rounded-xl">
                                    {s.name}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
