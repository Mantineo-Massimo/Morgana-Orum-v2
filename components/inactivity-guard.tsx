"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { logoutAction } from "@/app/actions/auth"

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000  // 30 minutes
const WARNING_BEFORE_MS    =  2 * 60 * 1000  //  2 minutes before logout

// Events that count as "user is active"
const ACTIVITY_EVENTS = [
    "mousemove", "mousedown", "keydown", "touchstart", "scroll", "click",
] as const

/**
 * InactivityGuard
 *
 * Detects client-side inactivity and automatically logs the user out after
 * INACTIVITY_TIMEOUT_MS of no interaction.
 *
 * Shows a modal warning dialog 2 minutes before logout, with a live countdown
 * and a "Stay logged in" button to reset the timer.
 *
 * Only rendered when the user is authenticated (isLoggedIn === true).
 */
export function InactivityGuard({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [showWarning, setShowWarning] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(Math.round(WARNING_BEFORE_MS / 1000))

    const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const warningTimer    = useRef<ReturnType<typeof setTimeout> | null>(null)
    const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null)

    const clearAllTimers = () => {
        if (inactivityTimer.current)    clearTimeout(inactivityTimer.current)
        if (warningTimer.current)       clearTimeout(warningTimer.current)
        if (countdownInterval.current)  clearInterval(countdownInterval.current)
    }

    const startCountdown = useCallback(() => {
        setSecondsLeft(Math.round(WARNING_BEFORE_MS / 1000))
        if (countdownInterval.current) clearInterval(countdownInterval.current)
        countdownInterval.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    if (countdownInterval.current) clearInterval(countdownInterval.current)
                    return 0
                }
                return s - 1
            })
        }, 1000)
    }, [])

    const resetTimers = useCallback(() => {
        if (!isLoggedIn) return
        clearAllTimers()
        setShowWarning(false)

        // After (TIMEOUT - WARNING) ms of inactivity → show warning
        warningTimer.current = setTimeout(() => {
            setShowWarning(true)
            startCountdown()

            // After WARNING_BEFORE_MS more → force logout
            inactivityTimer.current = setTimeout(async () => {
                await logoutAction()
            }, WARNING_BEFORE_MS)
        }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS)
    }, [isLoggedIn, startCountdown])

    // Start listening for activity events
    useEffect(() => {
        if (!isLoggedIn) return

        resetTimers()

        const handleActivity = () => {
            // Only reset if the warning is not already showing
            // (user must explicitly click "Stay logged in" to dismiss)
            if (!showWarning) resetTimers()
        }

        ACTIVITY_EVENTS.forEach(evt =>
            window.addEventListener(evt, handleActivity, { passive: true })
        )

        return () => {
            clearAllTimers()
            ACTIVITY_EVENTS.forEach(evt =>
                window.removeEventListener(evt, handleActivity)
            )
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn])

    const handleStayLoggedIn = () => {
        resetTimers()
    }

    const handleLogoutNow = async () => {
        clearAllTimers()
        await logoutAction()
    }

    if (!isLoggedIn || !showWarning) return null

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const timeStr = minutes > 0
        ? `${minutes}:${String(seconds).padStart(2, "0")} min`
        : `${seconds} sec`

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inactivity-title"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        >
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
                {/* Colored top bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500" />

                <div className="p-8 text-center space-y-5">
                    {/* Icon */}
                    <div className="size-16 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center mx-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-8 text-amber-500"
                            fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
                        </svg>
                    </div>

                    {/* Text */}
                    <div>
                        <h2 id="inactivity-title" className="text-xl font-bold text-zinc-800 mb-2">
                            Sessione in scadenza
                        </h2>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            Sei rimasto inattivo per quasi 30 minuti.<br />
                            Verrai disconnesso automaticamente tra:
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="inline-flex items-center justify-center gap-1 px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200">
                        <span className="text-3xl font-black font-mono text-amber-600 tabular-nums">
                            {timeStr}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            id="inactivity-stay-btn"
                            onClick={handleStayLoggedIn}
                            className="w-full py-3.5 px-6 rounded-2xl bg-[#18182e] text-white font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                        >
                            Rimani connesso
                        </button>
                        <button
                            id="inactivity-logout-btn"
                            onClick={handleLogoutNow}
                            className="w-full py-3 px-6 rounded-2xl bg-zinc-100 text-zinc-500 font-semibold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all"
                        >
                            Disconnetti ora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
