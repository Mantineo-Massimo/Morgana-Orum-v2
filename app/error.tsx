"use client"

import { useEffect } from "react"
import { RotateCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-20">
            <div className="bg-red-50 p-4 rounded-full mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                    <svg
                        className="size-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Qualcosa è andato storto!</h2>
            <p className="text-zinc-500 max-w-md mx-auto mb-8">
                Si è verificato un errore durante il caricamento di questa sezione.
            </p>

            <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 font-medium"
            >
                <RotateCcw className="size-4" />
                Riprova
            </button>
        </div>
    )
}
