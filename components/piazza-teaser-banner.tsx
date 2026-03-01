"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"

const TARGET_DATE = new Date('2026-05-22T09:00:00')

export function PiazzaTeaserBanner() {
    return (
        <section className="py-16 relative overflow-hidden min-h-[240px]">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-[#18182e]">
                <Image
                    src="/assets/piazza.png"
                    fill
                    className="object-cover grayscale opacity-20"
                    alt=""
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#18182e] via-[#18182e]/95 to-[#18182e]/80"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#27a85d] rounded-full blur-[160px] opacity-15 -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1fbcd3] rounded-full blur-[160px] opacity-10 -ml-40 -mb-40 pointer-events-none"></div>
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl mx-auto">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Image
                            src="/assets/piazzadellarte.png"
                            width={120}
                            height={120}
                            alt="Piazza dell'Arte"
                            className="drop-shadow-2xl"
                        />
                    </div>

                    {/* Text + countdown */}
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[#27a85d] font-black text-sm uppercase tracking-widest mb-2">Prossimo evento speciale</p>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-white uppercase tracking-tighter mb-3">
                            Piazza dell&apos;Arte 2026
                        </h2>
                        <p className="text-white/60 font-serif mb-6">
                            L&apos;evento socio-culturale più atteso della primavera messinese. Musica, arte e spettacolo nel cuore dell&apos;università.
                        </p>
                        <CountdownTimer targetDate={TARGET_DATE} />
                    </div>

                    {/* CTA */}
                    <div className="shrink-0">
                        <Link
                            href="/network/piazzadellarte"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                            style={{ backgroundColor: "#f9a620", color: "#18182e" }}
                        >
                            Scopri di più <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
