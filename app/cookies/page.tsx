import Link from "next/link"
import { ArrowLeft, Cookie } from "lucide-react"

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container max-w-4xl mx-auto px-6">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Torna alla Home</span>
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-16 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                            <Cookie className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            Cookie Policy
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            Utilizziamo i cookie per migliorare la tua esperienza di navigazione. In questa pagina trovi tutte le informazioni su quali cookie utilizziamo e come gestirli.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">1. Cosa sono i Cookie?</h2>
                        <p>
                            I cookie sono piccoli file di testo che i siti visitati dall&apos;utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">2. Tipologie di Cookie utilizzati</h2>
                        <ul>
                            <li><strong>Cookie Tecnici (Necessari):</strong> Indispensabili per il corretto funzionamento del sito, come la gestione delle sessioni di login. Non possono essere disattivati.</li>
                            <li><strong>Cookie Analitici (Google Analytics 4):</strong> Utilizzati per raccogliere informazioni in forma anonima sul numero degli utenti e su come questi visitano il sito. Vengono attivati solo previo consenso esplicito tramite il banner informativo.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">3. Come disabilitare i Cookie</h2>
                        <p>
                            Puoi modificare le tue preferenze in qualsiasi momento cliccando sul tasto di gestione consenso (se presente) o agendo sulle impostazioni del tuo browser.
                        </p>
                        <ul className="mt-4">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" className="text-primary hover:underline">Impostazioni Cookie in Chrome</a></li>
                            <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" className="text-primary hover:underline">Impostazioni Cookie in Firefox</a></li>
                            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" className="text-primary hover:underline">Impostazioni Cookie in Safari</a></li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">4. Diritti dell&apos;Interessato</h2>
                        <p>
                            Puoi esercitare i tuoi diritti previsti dal GDPR contattandoci via email. Per maggiori dettagli su come trattiamo i tuoi dati, consulta la nostra <Link href="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
