"use client"

import { useState } from "react"
import { Mail, MessageCircle, Phone, Send, ChevronDown, ChevronUp, Loader2, CheckCircle2, Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { sendSupportMessage } from "@/app/actions/support"

export const dynamic = "force-dynamic"

const faqs = [
    {
        question: "Come posso rinnovare la mia iscrizione?",
        answer: "L'iscrizione ha validità annuale. Puoi rinnovarla direttamente dalla tua dashboard o recandoti presso i nostri uffici in università."
    },
    {
        question: "Come funzionano i CFU per gli eventi?",
        answer: "Dopo aver partecipato a un evento, la presenza viene registrata tramite QR Code. I CFU verranno accreditati automaticamente sul tuo profilo entro 48 ore dalla fine dell'evento."
    },
    {
        question: "Posso annullare l'iscrizione a un evento?",
        answer: "Sì, puoi annullare l'iscrizione fino a 24 ore prima dell'inizio dell'evento direttamente dalla sezione 'I Miei Eventi'."
    },
    {
        question: "Dove trovo le convenzioni attive?",
        answer: "Le convenzioni sono visibili nella sezione 'Vantaggi Esclusivi' della tua dashboard. Mostra la tua tessera digitale per usufruirne."
    }
]

export default function SupportPage() {

    const isMorgana = true
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

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
            setErrorMessage("Per favore compila tutti i campi obbligatori.")
            setIsSubmitting(false)
            return
        }

        const result = await sendSupportMessage(data)

        if (result.success) {
            setStatus("success")
            form.reset()
        } else {
            setStatus("error")
            setErrorMessage(result.error || "Errore durante l'invio del messaggio.")
        }
        setIsSubmitting(false)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Assistenza</h1>
                <p className="text-zinc-500">Hai bisogno di aiuto? Siamo qui per te.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Mail className="size-5 text-zinc-400" /> Inviaci un messaggio
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Nome *</label>
                                    <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium" placeholder="Il tuo nome" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Email *</label>
                                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium" placeholder="tua@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Oggetto</label>
                                <select name="subject" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium text-zinc-600">
                                    <option>Richiesta Informazioni Generali</option>
                                    <option>Problema con Iscrizione Evento</option>
                                    <option>Problema Tecnico Sito/App</option>
                                    <option>Proposta Collaborazione</option>
                                    <option>Altro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Messaggio *</label>
                                <textarea name="message" required className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium min-h-[150px] resize-none" placeholder="Descrivi qui la tua richiesta..."></textarea>
                            </div>

                            {status === "success" && (
                                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-3">
                                    <CheckCircle2 className="size-5 shrink-0" />
                                    <p className="text-sm font-bold">Messaggio inviato con successo! Ti risponderemo al più presto.</p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                                    <p className="text-sm font-bold">{errorMessage}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                                    isMorgana
                                        ? "bg-zinc-900 hover:bg-black shadow-zinc-900/20"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 shadow-blue-600/20",
                                    isSubmitting && "opacity-70 pointer-events-none"
                                )}
                            >
                                {isSubmitting ? (
                                    <>Invio in corso... <Loader2 className="size-4 animate-spin" /></>
                                ) : (
                                    <>Invia Messaggio <Send className="size-4" /></>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-8">
                        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <MessageCircle className="size-5 text-zinc-400" /> Domande Frequenti
                        </h2>
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-zinc-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
                                    >
                                        <span className="font-bold text-foreground text-sm">{faq.question}</span>
                                        {openFaq === index ? <ChevronUp className="size-4 text-zinc-400" /> : <ChevronDown className="size-4 text-zinc-400" />}
                                    </button>
                                    {openFaq === index && (
                                        <div className="p-4 bg-white text-sm text-zinc-600 leading-relaxed border-t border-zinc-100">
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
                    <div className="bg-zinc-900 text-white rounded-2xl p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4">Contatti Diretti</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Email Morgana</p>
                                    <a href="mailto:associazionemorgana@gmail.com" className="text-sm font-bold text-red-100 hover:underline">associazionemorgana@gmail.com</a>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Email O.R.U.M.</p>
                                    <a href="mailto:orum_unime@gmail.com" className="text-sm font-bold text-blue-100 hover:underline">orum_unime@gmail.com</a>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Ufficio Network</p>
                                    <p className="font-medium text-zinc-300">Via Sant&apos;Elia, 11,<br />98122 Messina (ME)</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Morgana Social</p>
                                    <div className="flex gap-3">
                                        <a href="https://www.facebook.com/Morgana.Associazione/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-red-500 transition-colors">
                                            <Facebook className="size-4" />
                                        </a>
                                        <a href="https://www.instagram.com/associazione.morgana" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-red-400 transition-colors">
                                            <Instagram className="size-4" />
                                        </a>
                                        <a href="https://www.youtube.com/@morganaassociazione5592" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-red-600 transition-colors">
                                            <Youtube className="size-4" />
                                        </a>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">O.R.U.M. Social</p>
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

                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                <Phone className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-1">Emergenza Esami?</h4>
                                <p className="text-xs text-blue-700/80 leading-relaxed mb-3">
                                    Hai problemi urgenti con la prenotazione esami o con la segreteria? Scrivici su WhatsApp per una risposta rapida.
                                </p>
                                <Link
                                    href="/representatives"
                                    className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline inline-block"
                                >
                                    Chatta con un rappresentante →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
