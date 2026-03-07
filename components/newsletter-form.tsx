"use client"

import { useState } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { subscribeToNewsletter } from "@/lib/newsletter"
import { useTranslations } from "next-intl"

export function NewsletterForm() {
    const t = useTranslations("Footer")
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")

        const formData = new FormData()
        formData.append("email", email)

        const result = await subscribeToNewsletter(formData)

        if (result.success) {
            setStatus("success")
            setEmail("")
            setMessage(t("newsletter_success"))
            setTimeout(() => {
                setStatus("idle")
                setMessage("")
            }, 5000)
        } else {
            setStatus("error")
            setMessage(result.error || t("newsletter_error"))
            setTimeout(() => setStatus("idle"), 5000)
        }
    }

    return (
        <form
            onSubmit={handleSubscribe}
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 relative"
        >
            <div className="flex flex-col gap-2 w-full">
                <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("newsletter_placeholder")}
                    className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/30 font-medium w-full sm:min-w-[300px]"
                    disabled={status === "loading"}
                />
                {message && (
                    <p className={cn(
                        "text-xs font-bold absolute -bottom-6 left-2 flex items-center gap-1",
                        status === "success" ? "text-green-400" : "text-red-400"
                    )}>
                        {status === "success" && <CheckCircle2 className="size-3" />}
                        {message}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-zinc-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shrink-0 flex items-center justify-center min-w-[140px]"
            >
                {status === "loading" ? (
                    <Loader2 className="size-5 animate-spin" />
                ) : (
                    t("newsletter_button")
                )}
            </button>
        </form>
    )
}
