"use client"

import { Link } from "@/i18n/routing"
import Image from "next/image"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCardProps {
    event: {
        id: string
        title: string
        image: string | null
        date: Date
        category: string
        location: string
    }
    locale: string
    href: string
    variant?: "default" | "network"
    primaryColor?: string
    accentColor?: string
}

export function EventCard({ event, locale, href, variant = "default", primaryColor, accentColor }: EventCardProps) {
    const isNetwork = variant === "network"

    return (
        <Link
            href={href}
            className={cn(
                "group flex flex-col bg-white overflow-hidden transition-all duration-300",
                isNetwork
                    ? "rounded-2xl border-b-8 shadow-xl hover:-translate-y-1"
                    : "border border-zinc-100 rounded-xl hover:shadow-xl hover:border-primary/20"
            )}
            style={isNetwork && accentColor ? { borderBottomColor: accentColor } : undefined}
        >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
                {event.image ? (
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover z-0 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                        <Calendar className="size-10 text-zinc-300" />
                    </div>
                )}

                {/* Date Badge Overlay */}
                <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-sm text-foreground text-center p-1.5 min-w-[3rem] shadow-lg rounded-lg border border-black/5">
                    <span
                        className="block text-[10px] font-bold uppercase text-muted-foreground leading-none mb-1"
                        style={isNetwork && primaryColor ? { color: primaryColor } : undefined}
                    >
                        {event.date.toLocaleDateString(locale, { month: 'short' })}
                    </span>
                    <span className="block text-xl font-black leading-none text-foreground">
                        {event.date.toLocaleDateString(locale, { day: '2-digit' })}
                    </span>
                </div>

                {/* Optional: Subtle gradient on image for badge visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-3">
                    <span
                        className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded flex-shrink-0",
                            !isNetwork ? "bg-primary text-white" : ""
                        )}
                        style={isNetwork && primaryColor ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                    >
                        {event.category}
                    </span>
                </div>

                <h3 className="text-lg font-serif font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-4">
                    {event.title}
                </h3>

                <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center gap-2 text-zinc-500 text-[11px] font-medium italic">
                    <Calendar className="size-3 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                </div>
            </div>
        </Link>
    )
}
