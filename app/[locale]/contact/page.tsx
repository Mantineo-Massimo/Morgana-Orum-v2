"use client"

import React from "react"
import { ArrowLeft, Send, Mail, Phone, MapPin, CheckCircle2, Loader2, Facebook, Instagram, Youtube } from "lucide-react"
import { Link } from "@/i18n/routing"
import { submitContactForm } from "@/app/actions/contact"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

const TiktokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
)

export default function ContactPage() {
    const t = useTranslations("Footer")
    const tp = useTranslations("Privacy")
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = React.useState("")

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setStatus('loading')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        }

        try {
            const res = await submitContactForm(data)
            if (res.success) {
                setStatus('success')
            } else {
                setStatus('error')
                setErrorMessage(res.error || "Errore sconosciuto")
            }
        } catch (err) {
            setStatus('error')
            setErrorMessage("Errore di connessione")
        }
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-zinc-50 pt-32 pb-20 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-zinc-100 animate-in zoom-in-95 duration-500">
                    <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="size-10" />
                    </div>
                    <h1 className="text-3xl font-serif font-black text-foreground mb-4">{t("contact_success_title")}</h1>
                    <p className="text-zinc-500 mb-10 leading-relaxed font-medium">
                        {t("contact_success_desc")}
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#18182e] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                        {t("back_to_main")}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container max-w-6xl mx-auto px-6">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t("back_to_main")}</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <div>
                            <div className="size-20 bg-emerald-500/10 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                                <Mail className="size-10" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                                {t("contact")}
                            </h1>
                            <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                                {t("contact_desc")}
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-primary shrink-0">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{t("office_title")}</h3>
                                    <p className="text-sm text-zinc-500">{t("orum_address")}</p>
                                    <p className="text-sm text-zinc-500 mt-1">{t("morgana_address")}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-primary shrink-0">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{t("email")}</h3>
                                    <p className="text-sm text-zinc-500">{t("orum_email")}</p>
                                    <p className="text-sm text-zinc-500">{t("morgana_email")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Mini Plate */}
                        <div className="p-8 bg-zinc-900 rounded-[2rem] text-white shadow-2xl">
                            <h3 className="font-serif font-bold text-xl mb-4">{t("social_title")}</h3>
                            <p className="text-white/60 text-sm mb-6">{t("social_desc")}</p>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Associazione Morgana</span>
                                    <div className="flex gap-3">
                                        <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-red-500 transition-all" aria-label="Facebook Morgana">
                                            <Facebook className="size-5" />
                                        </a>
                                        <a href="https://instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-red-400 transition-all" aria-label="Instagram Morgana">
                                            <Instagram className="size-5" />
                                        </a>
                                        <a href="https://www.tiktok.com/@associazione.morgana" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-zinc-300 transition-all" aria-label="TikTok Morgana">
                                            <TiktokIcon className="size-5" />
                                        </a>
                                        <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-red-500 transition-all" aria-label="YouTube Morgana">
                                            <Youtube className="size-5" />
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Associazione O.R.U.M.</span>
                                    <div className="flex gap-3">
                                        <a href="https://www.facebook.com/AssociazioneOrum/" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-blue-500 transition-all" aria-label="Facebook ORUM">
                                            <Facebook className="size-5" />
                                        </a>
                                        <a href="https://instagram.com/orum_unime" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:text-blue-400 transition-all" aria-label="Instagram ORUM">
                                            <Instagram className="size-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-right-8 duration-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{t("form_name")}</label>
                                        <input
                                            required
                                            name="name"
                                            placeholder={t("form_name_placeholder")}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{t("email")}</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="mario.rossi@esempio.it"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{t("form_subject")}</label>
                                    <input
                                        required
                                        name="subject"
                                        placeholder={t("form_subject_placeholder")}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">{t("form_message")}</label>
                                    <textarea
                                        required
                                        name="message"
                                        rows={6}
                                        placeholder={t("form_message_placeholder")}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="space-y-4 pt-2">
                                    <label className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl cursor-pointer hover:bg-zinc-100 transition-colors">
                                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                                            {tp("contact_privacy_notice")}
                                        </p>
                                    </label>
                                </div>

                                <button
                                    disabled={status === 'loading'}
                                    type="submit"
                                    className={cn(
                                        "w-full bg-[#18182e] text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 group relative overflow-hidden",
                                        status === 'loading' && "opacity-70 cursor-not-allowed"
                                    )}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            <span>{t("contact_sending")}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span>{t("contact_button")}</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
