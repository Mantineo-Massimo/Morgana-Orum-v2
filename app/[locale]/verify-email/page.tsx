"use client"

import { useState, useEffect } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { useSearchParams, useParams } from "next/navigation"
import { verifyEmailAction } from "@/app/actions/auth"
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export default function VerifyEmailPage() {
    const t = useTranslations("Auth")
    const searchParams = useSearchParams()
    const params = useParams()
    const router = useRouter()
    
    const token = searchParams.get("token")
    const locale = (params?.locale as string) || "it"

    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
    const [errorMsg, setErrorMsg] = useState("")
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setErrorMsg(t("email_verification_failed"))
            return
        }

        async function verifyToken() {
            try {
                const result = await verifyEmailAction(token!, locale)
                if (result.success) {
                    if (result.alreadyVerified) {
                        setIsAlreadyVerified(true)
                    }
                    setStatus("success")
                } else {
                    setStatus("error")
                    setErrorMsg(result.error || t("email_verification_failed"))
                }
            } catch (err) {
                console.error("Verification error:", err)
                setStatus("error")
                setErrorMsg(t("something_wrong"))
            }
        }

        verifyToken()
    }, [token, locale, t])

    return (
        <div className="min-h-screen grid items-center justify-center bg-zinc-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-zinc-100 text-center">
                
                {status === "verifying" && (
                    <div className="space-y-6 py-6">
                        <Loader2 className="size-16 text-[#18182e] animate-spin mx-auto" />
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold text-foreground">{t("verifying_email")}</h1>
                            <p className="text-sm text-zinc-500">Stiamo elaborando la tua richiesta di attivazione...</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="size-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                            <CheckCircle className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">
                                {isAlreadyVerified ? t("email_already_verified") : t("email_verified_success")}
                            </h1>
                            <p className="text-sm text-zinc-500">
                                {isAlreadyVerified ? t("email_already_verified_desc") : t("email_verified_success_desc")}
                            </p>
                        </div>
                        <Link
                            href={isAlreadyVerified ? "/login" : "/dashboard"}
                            className="w-full py-4 bg-[#18182e] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
                        >
                            {isAlreadyVerified ? t("go_to_login") : t("go_to_dashboard")} <ArrowRight className="size-5" />
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="size-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertCircle className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-foreground">Verifica Fallita</h1>
                            <p className="text-sm text-red-500 font-semibold">{errorMsg}</p>
                        </div>
                        <div className="pt-4 space-y-3">
                            <Link
                                href="/login"
                                className="block w-full py-3 border-2 border-zinc-200 hover:border-zinc-950 text-zinc-600 hover:text-foreground font-bold rounded-xl transition-all text-sm"
                            >
                                Torna al Login
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
