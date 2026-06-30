"use client"

import { useEffect } from "react"
import { RotateCcw } from "lucide-react"
import "./globals.css"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global Error Caught:", error)
    }, [error])

    return (
        <html lang="it">
            <body className="bg-zinc-50 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center justify-center px-6 text-center py-20 max-w-md mx-auto">
                    <div className="bg-red-50 p-4 rounded-full mb-6 ring-8 ring-red-50/50">
                        <div className="bg-red-100 p-4 rounded-full">
                            <svg
                                className="size-8 text-red-600 animate-pulse"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold font-serif text-foreground mb-4">Qualcosa è andato storto!</h2>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        Si è verificato un errore critico durante il caricamento del sito. Prova a ricaricare la pagina.
                    </p>

                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#18182e] text-white rounded-xl hover:bg-[#20203d] transition-all active:scale-95 font-medium shadow-lg shadow-zinc-200"
                    >
                        <RotateCcw className="size-4" />
                        Riprova
                    </button>
                </div>
            </body>
        </html>
    )
}
