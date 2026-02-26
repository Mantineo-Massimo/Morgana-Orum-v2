"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginAction } from "@/app/actions/auth"
import { Loader2, LogIn, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default function Page() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const result = await loginAction(email, password)

        if (result.success) {
            // In a real app, we would set a session cookie here
            router.push(`/dashboard`)
        } else {
            setError(result.error || "Login fallito.")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">Accedi</h1>
                    <p className="text-sm text-zinc-500">Benvenuto nella tua area riservata.</p>
                </div>

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
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                        <div className="flex justify-end mt-1">
                            <Link
                                href={`/forgot-password`}
                                className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hover:text-foreground transition-colors"
                            >
                                Password dimenticata?
                            </Link>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#18182e] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin size-5" /> : <>Accedi <LogIn className="size-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-xs text-zinc-400">
                        Non hai ancora un account?
                    </p>
                    <Link
                        href={`/register`}
                        className="block w-full py-3 border-2 border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-foreground font-bold rounded-xl transition-all"
                    >
                        Registrati
                    </Link>
                </div>
            </div >
        </div >
    )
}
