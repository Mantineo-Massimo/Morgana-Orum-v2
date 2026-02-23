"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { logAnalyticEvent } from "@/app/actions/analytics-logger"

export function ClientLogger() {
    const pathname = usePathname()
    const lastPathname = useRef<string | null>(null)

    useEffect(() => {
        // Only log if the pathname has changed (prevents duplicate logs on re-renders)
        if (pathname !== lastPathname.current) {
            logAnalyticEvent("VISIT", pathname)
            lastPathname.current = pathname
        }

        // Add event listener for general clicks (optional, but requested by user via "click" metric)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const closestLink = target.closest('a')
            const closestButton = target.closest('button')

            if (closestLink || closestButton) {
                logAnalyticEvent("CLICK", pathname, undefined, {
                    element: closestLink ? 'link' : 'button',
                    text: closestLink?.innerText || closestButton?.innerText || 'unknown',
                    href: closestLink?.href
                })
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [pathname])

    return null
}
