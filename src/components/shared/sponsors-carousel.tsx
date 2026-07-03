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
    // If no sponsors, show nothing or placeholders
    if (!sponsors || sponsors.length === 0) {
        return null;
    }

    // If only one sponsor, just center it without animation
    if (sponsors.length === 1) {
        const s = sponsors[0];
        return (
            <section className="py-20 bg-white border-y border-zinc-100 flex flex-col items-center">
                <div className="mb-12 text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">
                        Con il supporto di
                    </h3>
                    <div className="h-0.5 w-12 bg-zinc-200 mx-auto rounded-full"></div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="transition-all duration-500 flex items-center justify-center">
                        {s.logo ? (
                            <a 
                                href={s.website || "#"} 
                                target={s.website ? "_blank" : undefined} 
                                rel="noopener noreferrer"
                                className="relative w-48 h-24 md:w-64 md:h-32 transition-transform hover:scale-105 block"
                            >
                                <Image 
                                    src={s.logo} 
                                    alt={s.name} 
                                    fill 
                                    className="object-contain" 
                                    sizes="(max-width: 768px) 192px, 256px"
                                />
                            </a>
                        ) : (
                            <div className="text-xl font-black text-zinc-900 uppercase tracking-widest border-2 border-zinc-200 px-10 py-5 rounded-2xl">
                                {s.name}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // For multiple sponsors, use the carousel
    const displaySponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors]

    return (
        <section className="py-20 bg-white border-y border-zinc-100 overflow-hidden flex flex-col items-center">
            <div className="mb-12 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">
                    Con il supporto di
                </h3>
                <div className="h-0.5 w-12 bg-zinc-200 mx-auto rounded-full"></div>
            </div>

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
                        duration: 30,
                    }}
                >
                    {displaySponsors.map((s, idx) => (
                        <div key={`${s.id}-${idx}`} className="mx-12 md:mx-20 transition-all duration-500 hover:scale-110 flex items-center justify-center min-w-[120px] md:min-w-[160px]">
                            {s.logo ? (
                                <a 
                                    href={s.website || "#"} 
                                    target={s.website ? "_blank" : undefined} 
                                    rel="noopener noreferrer"
                                    className="relative w-32 md:w-40 h-16 block"
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
                                <div className="text-xs md:text-sm font-black text-zinc-900 uppercase tracking-widest border-2 border-zinc-200 px-6 py-3 rounded-xl whitespace-nowrap">
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
