"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function HeroCarousel() {
    const slides = [1, 2, 3];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="absolute inset-0 z-0">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    {/* Real Image */}
                    {/* fallback to a color if image fails to load or is missing during dev */}
                    <div className="absolute inset-0 bg-slate-950" />

                    <Image
                        src={`/assets/slides/morgana/${slides[currentSlide]}.jpg`} // Temporaneo, useremo morgana come fallback per ora

                        alt={`Slide ${currentSlide + 1}`}
                        fill
                        className="object-cover opacity-60"
                        priority={currentSlide === 0}
                    />

                    {/* Pattern Overlay to make backgrounds interesting */}
                    <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-10 mix-blend-overlay"></div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
