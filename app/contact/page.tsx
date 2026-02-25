"use client"

import React from "react"
import { ArrowLeft, Send, Mail, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { submitContactForm } from "@/app/actions/contact"
import { cn } from "@/lib/utils"

export default function ContactPage() {
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
                    <h1 className="text-3xl font-serif font-black text-foreground mb-4">Messaggio Inviato!</h1>
                    <p className="text-zinc-500 mb-10 leading-relaxed font-medium">
                        Grazie per averci contattato. Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto via email.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-[#18182e] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all"
                    >
                        Torna alla Home
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
                    <span className="text-sm font-bold uppercase tracking-widest">Torna alla Home</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 leading-tight">
                                Contattaci
                            </h1>
                            <p className="text-lg text-zinc-500 font-medium leading-relaxed italic border-l-4 border-zinc-200 pl-6">
                                Hai domande, suggerimenti o vuoi collaborare con noi? Inviaci un messaggio e ti risponderemo entro 24 ore.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-primary shrink-0">
                                    <MapPin className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Sede Sociale</h3>
                                    <p className="text-sm text-zinc-500">Via Sant&apos;Elia 11, 98122 Messina (ME)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-primary shrink-0">
                                    <Mail className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">Email</h3>
                                    <p className="text-sm text-zinc-500">associazionemorgana@gmail.com</p>
                                    <p className="text-sm text-zinc-500">orum_unime@gmail.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Mini Plate */}
                        <div className="p-8 bg-zinc-900 rounded-[2rem] text-white shadow-2xl">
                            <h3 className="font-serif font-bold text-xl mb-4">Seguici sui Social</h3>
                            <p className="text-white/60 text-sm mb-6">Resta aggiornato su tutte le nostre attività e i nuovi eventi in tempo reale.</p>
                            <div className="flex gap-4">
                                <a href="https://instagram.com/associazione.morgana" target="_blank" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <span className="text-xs font-bold">M</span>
                                </a>
                                <a href="https://instagram.com/orum_unime" target="_blank" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <span className="text-xs font-bold">O</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-right-8 duration-700">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Nome Completo</label>
                                        <input
                                            required
                                            name="name"
                                            placeholder="Mario Rossi"
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
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
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Oggetto</label>
                                    <input
                                        required
                                        name="subject"
                                        placeholder="Informazioni su..."
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Messaggio</label>
                                    <textarea
                                        required
                                        name="message"
                                        rows={6}
                                        placeholder="Scrivi qui il tuo messaggio..."
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                                        {errorMessage}
                                    </div>
                                )}

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
                                            <span>Invio in corso...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            <span>Invia Messaggio</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-[10px] text-center text-zinc-400 font-medium px-8 leading-relaxed">
                                    Inviando questo modulo, accetti che i tuoi dati vengano trattati per rispondere alla tua richiesta, in conformità con la nostra <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
