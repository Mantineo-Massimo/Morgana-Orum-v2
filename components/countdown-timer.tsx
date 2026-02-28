"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
    targetDate: Date;
    className?: string;
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date()

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    // Prevent hydration mismatch by returning empty space first
    if (!hasMounted) {
        return (
            <div className={cn("flex flex-wrap justify-center gap-4 opacity-0", className)}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-black/40 rounded-2xl min-w-[80px] md:min-w-[100px] h-[80px] md:h-[100px]"></div>
                ))}
            </div>
        )
    }

    const timeBlocks = [
        { label: "Giorni", value: timeLeft.days },
        { label: "Ore", value: timeLeft.hours },
        { label: "Minuti", value: timeLeft.minutes },
        { label: "Secondi", value: timeLeft.seconds }
    ]

    return (
        <div className={cn("flex flex-wrap justify-center gap-2 sm:gap-4", className)}>
            {timeBlocks.map((block, index) => (
                <div key={index} className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl p-3 sm:p-5 min-w-[70px] sm:min-w-[90px] md:min-w-[110px] border border-white/20 shadow-2xl">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)] mb-1 tabular-nums leading-none">
                        {String(block.value).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] md:text-[11px] font-black text-[#f9a620] uppercase tracking-[0.2em] mt-1">
                        {block.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
