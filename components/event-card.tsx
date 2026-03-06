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
                "relative group overflow-hidden bg-muted aspect-[4/3] flex items-end p-6 shadow-sm hover:shadow-lg transition-all block",
                isNetwork ? "rounded-2xl border-b-8 shadow-2xl hover:-translate-y-2 duration-500" : "border-b-4 border-primary"
            )}
            style={isNetwork && accentColor ? { borderBottomColor: accentColor } : undefined}
        >
            {event.image && (
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover z-0 group-hover:scale-110 transition-transform duration-700"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>

            <div className="absolute top-4 left-4 z-20 bg-white text-foreground text-center p-2 min-w-[3.5rem] shadow-sm rounded-lg sm:rounded-none">
                <span
                    className="block text-xs font-bold uppercase text-muted-foreground"
                    style={isNetwork && primaryColor ? { color: primaryColor } : undefined}
                >
                    {event.date.toLocaleDateString(locale, { month: 'short' })}
                </span>
                <span className="block text-2xl font-black leading-none text-foreground">
                    {event.date.toLocaleDateString(locale, { day: '2-digit' })}
                </span>
            </div>

            <div className="relative z-20 text-white mt-auto w-full">
                <span
                    className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/80 bg-primary px-2 py-0.5 mb-2 inline-block"
                    style={isNetwork && primaryColor ? { backgroundColor: primaryColor } : undefined}
                >
                    {event.category}
                </span>
                <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-primary underline-offset-4 line-clamp-2">
                    {event.title}
                </h3>
                <div className="mt-2 text-xs flex items-center gap-2 opacity-80 border-t border-white/20 pt-2">
                    <Calendar className="size-3" /> {event.location}
                </div>
            </div>
        </Link>
    )
}
