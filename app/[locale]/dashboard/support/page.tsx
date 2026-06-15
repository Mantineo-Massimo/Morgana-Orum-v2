"use client"

import { useState } from "react"
import { Mail, MessageCircle, Phone, Send, ChevronDown, ChevronUp, Loader2, CheckCircle2, Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { sendSupportMessage } from "@/app/actions/support"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default function SupportPage() {
    const t = useTranslations("Dashboard")
    const isMorgana = true
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

    const faqs = [
        {
            question: t("faq_1_q"),
            answer: t("faq_1_a")
        },
        {
            question: t("faq_2_q"),
            answer: t("faq_2_a")
        },
        {
            question: t("faq_3_q"),
            answer: t("faq_3_a")
        },
        {
            question: t("faq_4_q"),
            answer: t("faq_4_a")
        }
    ]

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus("idle")
        setErrorMessage("")

        const form = e.currentTarget
        const formData = new FormData(form)
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
        }

        if (!data.name || !data.email || !data.message) {
            setStatus("error")
            setErrorMessage(t("validation_fields"))
            setIsSubmitting(false)
            return
        }

        const result = await sendSupportMessage(data)

        if (result.success) {
            setStatus("success")
            form.reset()
        } else {
            setStatus("error")
            setErrorMessage(result.error || t("cancel_error"))
        }
        setIsSubmitting(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1.5">{t("support_title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{t("support_desc")}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Mail className="size-5 text-zinc-400" /> {t("send_message")}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-755">{t("form_name")}</label>
                                    <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium text-sm text-slate-800" placeholder={t("placeholder_name")} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-755">{t("form_email")}</label>
                                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium text-sm text-slate-800" placeholder={t("placeholder_email")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-755">{t("form_subject")}</label>
                                <select name="subject" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-semibold text-sm text-zinc-600">
                                    <option value="Richiesta Informazioni Generali">{t("subj_general")}</option>
                                    <option value="Problema con Iscrizione Evento">{t("subj_booking")}</option>
                                    <option value="Problema Tecnico Sito/App">{t("subj_tech")}</option>
                                    <option value="Proposta Collaborazione">{t("subj_collab")}</option>
                                    <option value="Altro">{t("subj_other")}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-755">{t("form_message")}</label>
                                <textarea name="message" required className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all font-medium min-h-[150px] resize-none text-sm text-slate-800" placeholder={t("placeholder_message")}></textarea>
                            </div>

                            {status === "success" && (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200/60 flex items-center gap-3">
                                    <CheckCircle2 className="size-5 shrink-0" />
                                    <p className="text-sm font-bold">{t("send_success")}</p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200/60">
                                    <p className="text-sm font-bold">{errorMessage}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                                    isMorgana
                                        ? "bg-slate-950 hover:bg-black shadow-slate-950/20 animate-pulse-subtle"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 shadow-blue-600/20",
                                    isSubmitting && "opacity-70 pointer-events-none"
                                )}
                            >
                                {isSubmitting ? (
                                    <>{t("sending")} <Loader2 className="size-4 animate-spin" /></>
                                ) : (
                                    <>{t("send_btn")} <Send className="size-4" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <MessageCircle className="size-5 text-zinc-400" /> {t("faqs_title")}
                        </h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-4.5 bg-slate-50 hover:bg-slate-100/70 transition-colors text-left"
                                    >
                                        <span className="font-extrabold text-foreground text-sm tracking-tight">{faq.question}</span>
                                        {openFaq === index ? <ChevronUp className="size-4 text-zinc-450" /> : <ChevronDown className="size-4 text-zinc-450" />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="p-4.5 bg-white text-sm text-zinc-500 leading-relaxed border-t border-slate-100 font-medium">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Direct Contacts Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-950 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-xl border border-slate-900/50">
                        <div className="relative z-10">
                            <h3 className="text-xl font-extrabold tracking-tight mb-5">{t("direct_contacts")}</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Email Morgana</p>
                                    <a href="mailto:associazionemorgana@gmail.com" className="text-sm font-bold text-red-100 hover:text-red-300 hover:underline transition-colors">associazionemorgana@gmail.com</a>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Email O.R.U.M.</p>
                                    <a href="mailto:orum_unime@gmail.com" className="text-sm font-bold text-blue-100 hover:text-blue-300 hover:underline transition-colors">orum_unime@gmail.com</a>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">{t("office_network")}</p>
                                    <p className="font-medium text-sm text-zinc-300 leading-relaxed">Via Sant&apos;Elia, 11,<br />98122 Messina (ME)</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Morgana Social</p>
                                    <div className="flex gap-3">
                                        <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-red-500 transition-colors">
                                            <Facebook className="size-4" />
                                        </a>
                                        <a href="https://www.instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-pink-600 transition-colors">
                                            <Instagram className="size-4" />
                                        </a>
                                        <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-red-600 transition-colors">
                                            <Youtube className="size-4" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">O.R.U.M. Social</p>
                                    <div className="flex gap-3">
                                        <a href="https://www.facebook.com/AssociazioneOrum/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-blue-600 transition-colors">
                                            <Facebook className="size-4" />
                                        </a>
                                        <a href="https://www.instagram.com/orum_unime" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-blue-500 transition-colors">
                                            <Instagram className="size-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Abstract bg decoration */}
                        <div className="absolute -bottom-10 -right-10 size-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    </div>

                    <div className="bg-blue-50/50 rounded-[2rem] p-6 border border-blue-150 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100/50 p-3 rounded-2xl text-blue-600 border border-blue-200/50 shrink-0">
                                <Phone className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-blue-900 mb-1 tracking-tight text-base">{t("exam_emergency")}</h4>
                                <p className="text-xs text-blue-700/80 leading-relaxed mb-4 font-medium">
                                    {t("exam_emergency_desc")}
                                </p>
                                <Link
                                    href="/representatives"
                                    className="text-xs font-black uppercase tracking-wider text-blue-700 hover:text-blue-900 hover:underline inline-block transition-colors"
                                >
                                    {t("chat_rep")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
