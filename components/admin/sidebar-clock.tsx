"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function SidebarClock() {
    const [time, setTime] = useState<string | null>(null)

    useEffect(() => {
        const update = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('it-IT', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }))
        }

        update()
        const interval = setInterval(update, 1000)
        return () => clearInterval(interval)
    }, [])

    if (!time) return null

    return (
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
            <Clock className="size-3" />
            <span>{time}</span>
        </div>
    )
}
