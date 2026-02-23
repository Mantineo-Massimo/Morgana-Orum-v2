"use client"

import { useState, useEffect } from "react"
import { Cookie, X, Check, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Controlla se il consenso è già stato dato
        const consent = document.cookie
            .split("; ")
            .find((row) => row.startsWith("cookie-consent="))

        if (!consent) {
            // Mostra il banner dopo un breve ritardo per un effetto più fluido
            const timer = setTimeout(() => setIsVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleConsent = (status: "accepted" | "rejected") => {
        // Imposta il cookie per 30 giorni
        const date = new Date()
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000))
        document.cookie = `cookie-consent=${status}; expires=${date.toUTCString()}; path=/; SameSite=Lax`

        setIsVisible(false)

        // Ricarica la pagina per attivare/disattivare gli script di tracciamento o semplicemente notifica il sistema
        if (status === "accepted") {
            window.location.reload()
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-transform group-hover:scale-110 duration-700" />

                <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-zinc-900 text-white rounded-2xl shadow-lg ring-4 ring-zinc-50">
                            <Cookie className="size-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Utilizziamo i Cookie</h3>
                            <p className="text-sm text-zinc-500 font-medium leading-relaxed mt-1">
                                Usiamo i cookie per migliorare la tua esperienza e per analizzare il traffico del sito.
                                <span className="block mt-1 text-zinc-400 text-xs italic">Aiutaci a crescere!</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={() => handleConsent("accepted")}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                        >
                            <Check className="size-4" />
                            Accetta Tutti
                        </button>
                        <button
                            onClick={() => handleConsent("rejected")}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-zinc-500 border border-zinc-200 rounded-2xl text-sm font-bold hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
                        >
                            <ShieldAlert className="size-4 opacity-50" />
                            Solo Essenziali
                        </button>
                    </div>

                    <p className="text-[10px] text-zinc-400 text-center mt-4">
                        Consultando il sito accetti la nostra <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
