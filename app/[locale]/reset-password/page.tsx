"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { resetPassword } from "@/app/actions/auth"
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {

    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    if (!token) {
        return (
            <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100 text-center">
                    <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-foreground mb-2">Token Mancante</h1>
                    <p className="text-sm text-zinc-500 mb-6">Il link di recupero non è valido o è incompleto.</p>
                    <Link href={`/forgot-password`} className="text-foreground font-bold hover:underline">
                        Richiedi un nuovo link
                    </Link>
                </div>
            </div>
        )
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        if (password !== confirmPassword) {
            setError("Le password non coincidono.")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("La password deve avere almeno 6 caratteri.")
            setIsLoading(false)
            return
        }

        const result = await resetPassword(token!, password)

        if (result.success) {
            setSuccess(true)
            setTimeout(() => {
                router.push(`/login`)
            }, 3000)
        } else {
            setError(result.error || "Errore durante il reset della password.")
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Nuova Password</h1>
                    <p className="text-sm text-zinc-500">Scegli una password sicura per il tuo account.</p>
                </div>

                {success ? (
                    <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-foreground">Password Aggiornata!</h3>
                            <p className="text-sm text-zinc-500">
                                Verrai reindirizzato al login tra pochi istanti...
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nuova Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Conferma Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#18182e] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin size-5" /> : <>Salva Password <Lock className="size-5" /></>}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
