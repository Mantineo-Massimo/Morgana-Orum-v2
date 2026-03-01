"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const ARTISTS = [
    { id: 1, name: "Artista 1", role: "Live Performance", image: 1 },
    { id: 2, name: "Artista 2", role: "DJ Set", image: 2 },
    { id: 3, name: "Artista 3", role: "Live Band", image: 3 },
    { id: 4, name: "Artista 4", role: "Acoustic", image: 4 },
    { id: 5, name: "Artista 5", role: "Special Guest", image: 1 },
    { id: 6, name: "Artista 6", role: "Performance", image: 2 },
    { id: 7, name: "Artista 7", role: "DJ Set", image: 3 },
    { id: 8, name: "Artista 8", role: "Live Band", image: 4 },
]

export function ArtistiCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
    })

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback((emblaApi: any) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return (
        <div className="relative group">
            {/* Carousel Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {ARTISTS.map((artist) => (
                        <div
                            key={artist.id}
                            // Responsive sizing: full width on mobile, half on tablet, 1/4th on desktop
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 pl-4"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-zinc-200 h-full">
                                <Image
                                    src={`/assets/slides/${artist.image}.jpg`}
                                    alt={artist.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 flex items-end p-6 z-20">
                                    <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#27a85d] mb-2 block">{artist.role}</span>
                                        <h3 className="text-xl md:text-2xl font-bold uppercase leading-tight">{artist.name}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                className="absolute top-1/2 -left-4 md:-left-8 -translate-y-1/2 size-12 rounded-full bg-white shadow-xl text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-0 z-30 ring-1 ring-black/5"
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                aria-label="Previous Artist"
            >
                <ChevronLeft className="size-6" />
            </button>
            <button
                className="absolute top-1/2 -right-4 md:-right-8 -translate-y-1/2 size-12 rounded-full bg-white shadow-xl text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-0 z-30 ring-1 ring-black/5"
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                aria-label="Next Artist"
            >
                <ChevronRight className="size-6" />
            </button>
        </div>
    )
}
