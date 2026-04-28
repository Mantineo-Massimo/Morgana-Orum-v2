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
    const baseSponsors = sponsors.length > 0 ? sponsors : [
        { id: "s1", name: "Sponsor 1" },
        { id: "s2", name: "Sponsor 2" },
        { id: "s3", name: "Sponsor 3" },
        { id: "s4", name: "Sponsor 4" },
        { id: "s5", name: "Sponsor 5" },
    ]

    // We need multiple copies to ensure a seamless loop
    const displaySponsors = [...baseSponsors, ...baseSponsors, ...baseSponsors, ...baseSponsors]

    return (
        <section className="py-20 bg-white border-y border-zinc-100 overflow-hidden flex flex-col items-center">
            <div className="mb-12 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">
                    Con il supporto di
                </h3>
                <div className="h-0.5 w-12 bg-zinc-200 mx-auto rounded-full"></div>
            </div>

            {/* Wrapper that hides horizontal overflow */}
            <div className="w-full relative overflow-hidden flex" style={{ 
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
                maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
            }}>
                <motion.div
                    className="flex min-w-max py-4 items-center"
                    animate={{ 
                        x: [0, "-50%"] 
                    }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20, // Adjust speed here
                    }}
                >
                    {displaySponsors.map((s, idx) => (
                        <div key={`${s.id}-${idx}`} className="mx-12 md:mx-20 transition-all duration-500 opacity-60 hover:opacity-100 flex items-center justify-center min-w-[120px] md:min-w-[160px]">
                            {s.logo ? (
                                <a 
                                    href={s.website || "#"} 
                                    target={s.website ? "_blank" : undefined} 
                                    rel="noopener noreferrer"
                                    className="relative w-32 md:w-40 h-16 transition-transform hover:scale-110 block"
                                >
                                    <Image 
                                        src={s.logo} 
                                        alt={s.name} 
                                        fill 
                                        className="object-contain" 
                                        sizes="(max-width: 768px) 128px, 160px"
                                    />
                                </a>
                            ) : (
                                <div className="text-xs md:text-sm font-black text-zinc-300 uppercase tracking-widest border-2 border-dashed border-zinc-100 px-6 py-3 rounded-xl whitespace-nowrap">
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
