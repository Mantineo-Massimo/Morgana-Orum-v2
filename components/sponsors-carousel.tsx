"use client"

import { motion } from "framer-motion"

export function SponsorsCarousel() {
    return (
        <section className="py-12 bg-white border-b border-border/50 overflow-hidden flex flex-col items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-8">
                Con il supporto di
            </h3>
            {/* Wrapper that hides horizontal overflow */}
            <div className="w-full relative overflow-hidden flex" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                <motion.div
                    className="flex min-w-max py-4"
                    animate={{ x: [0, 1000] }} // Adjust duration and x value based on width
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 15
                    }}
                >
                    {/* First set of logos */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="mx-8 md:mx-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center justify-center min-w-[120px]">
                            <div className="text-xl font-black text-zinc-400 uppercase tracking-widest border-2 border-zinc-200 px-6 py-3 rounded-lg">
                                Sponsor {i}
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for seamless looping */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={`dup-${i}`} className="mx-8 md:mx-16 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center justify-center min-w-[120px]">
                            <div className="text-xl font-black text-zinc-400 uppercase tracking-widest border-2 border-zinc-200 px-6 py-3 rounded-lg">
                                Sponsor {i}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
