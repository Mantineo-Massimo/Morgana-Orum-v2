"use client"

import { useState } from "react"
import Link from "next/link"
import { requestPasswordReset } from "@/app/actions/auth"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function Page() {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string

        const result = await requestPasswordReset(email, "morgana") // Temporaneo finché non unifichiamo i template email

        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || "Errore durante la richiesta.")
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
                <div className="mb-8">
                    <Link
                        href={`/login`}
                        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
                    >
                        <ArrowLeft className="size-4" /> Torna al Login
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900">Recupero Password</h1>
                    <p className="text-sm text-zinc-500">Ti invieremo un link per impostare una nuova password.</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-zinc-900">Email Inviata!</h3>
                            <p className="text-sm text-zinc-500">
                                Se l&apos;indirizzo è registrato, riceverai a breve le istruzioni per il recupero.
                            </p>
                        </div>
                        <Link
                            href={`/login`}
                            className="block w-full py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all"
                        >
                            Torna al Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Email Universitaria</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="mario.rossi@studenti.unime.it"
                                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin size-5" /> : <>Invia Link <Mail className="size-5" /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
