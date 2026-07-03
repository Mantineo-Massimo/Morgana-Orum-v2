"use client"

import { useState } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { loginAction, resendVerificationEmailAction } from "@/app/actions/auth"
import { Loader2, LogIn } from "lucide-react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"

export const dynamic = "force-dynamic"

export default function Page() {
    const t = useTranslations("Auth")
    const router = useRouter()
    const params = useParams()
    const locale = (params?.locale as string) || "it"

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showResend, setShowResend] = useState(false)
    const [unverifiedEmail, setUnverifiedEmail] = useState("")
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState("")

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError("")
        setResendSuccess("")

        const formData = new FormData(event.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const result = await loginAction(email, password)

        if (result.success) {
            router.push(`/dashboard`)
        } else {
            if (result.error === "VERIFICATION_REQUIRED") {
                setError(t("verification_required"))
                setUnverifiedEmail(email)
                setShowResend(true)
            } else {
                setError(result.error || t("login_failed"))
                setShowResend(false)
            }
            setIsLoading(false)
        }
    }

    async function handleResendEmail() {
        setResendLoading(true)
        setError("")
        setResendSuccess("")
        try {
            const result = await resendVerificationEmailAction(unverifiedEmail, locale)
            if (result.success) {
                setResendSuccess(t("resend_verification_success"))
                setShowResend(false)
            } else {
                setError(result.error || t("something_wrong"))
            }
        } catch (err) {
            console.error("Resend error:", err)
            setError(t("something_wrong"))
        } finally {
            setResendLoading(false)
        }
    }


    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground">{t("login_title")}</h1>
                    <p className="text-sm text-zinc-500">{t("login_subtitle")}</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">{t("email_label")}</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder={t("email_placeholder")}
                            className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">{t("password_label")}</label>
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
                                {t("forgot_password")}
                            </Link>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 font-bold text-center">{error}</p>}

                    {showResend && (
                        <div className="text-center pt-1">
                            <button
                                type="button"
                                onClick={handleResendEmail}
                                disabled={resendLoading}
                                className="text-xs font-bold text-[#18182e] hover:text-black hover:underline disabled:opacity-50 flex items-center justify-center gap-1 mx-auto"
                            >
                                {resendLoading ? (
                                    <Loader2 className="animate-spin size-3" />
                                ) : (
                                    t("resend_verification_btn")
                                )}
                            </button>
                        </div>
                    )}

                    {resendSuccess && (
                        <p className="text-xs text-green-600 font-bold text-center mt-1 animate-in fade-in">
                            {resendSuccess}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-[#18182e] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin size-5" /> : <>{t("login_btn")} <LogIn className="size-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-xs text-zinc-400">
                        {t("no_account")}
                    </p>
                    <Link
                        href={`/register`}
                        className="block w-full py-3 border-2 border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-foreground font-bold rounded-xl transition-all"
                    >
                        {t("register_btn")}
                    </Link>
                </div>
            </div >
        </div >
    )
}
