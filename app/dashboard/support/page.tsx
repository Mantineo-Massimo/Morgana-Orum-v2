"use client"

import { useState } from "react"
import { Mail, MessageCircle, Phone, Send, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

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
                        <form className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Nome</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium" placeholder="Il tuo nome" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium" placeholder="tua@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Oggetto</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium text-zinc-600">
                                    <option>Richiesta Informazioni Generali</option>
                                    <option>Problema con Iscrizione Evento</option>
                                    <option>Problema Tecnico Sito/App</option>
                                    <option>Proposta Collaborazione</option>
                                    <option>Altro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Messaggio</label>
                                <textarea className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-medium min-h-[150px] resize-none" placeholder="Descrivi qui la tua richiesta..."></textarea>
                            </div>
                            <button className={cn(
                                "w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2",
                                isMorgana
                                    ? "bg-zinc-900 hover:bg-black shadow-zinc-900/20"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 shadow-blue-600/20"
                            )}>
                                Invia Messaggio <Send className="size-4" />
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
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Email Generale</p>
                                    <a href="mailto:info@associazione.it" className="text-lg font-bold hover:underline">info@associazione.it</a>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Segreteria Studenti</p>
                                    <a href="tel:+390901234567" className="text-lg font-bold hover:underline">+39 090 123 4567</a>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Ufficio</p>
                                    <p className="font-medium text-zinc-300">Piazza Pugliatti 1,<br />98122 Messina (ME)</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-xs text-zinc-400 mb-3">Seguici sui social</p>
                                <div className="flex gap-4">
                                    <a href="#" className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                        <span className="font-bold">Ig</span>
                                    </a>
                                    <a href="#" className="flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                        <span className="font-bold">Fb</span>
                                    </a>
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
                                <button className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline">
                                    Chatta con un rappresentante →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
