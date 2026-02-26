import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PrivacyPage() {
    const t = useTranslations("Footer")
    const tp = useTranslations("Privacy")
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container max-w-4xl mx-auto px-6">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t("back_to_main")}</span>
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-16 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            {tp("intro")}
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("data_controller_title")}</h2>
                        <p>
                            {tp("data_controller_desc")}
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("data_types_title")}</h2>
                        <p>
                            {tp("data_types_desc")}
                        </p>
                        <ul>
                            <li><strong>Dati di registrazione:</strong> Nome, cognome, email, matricola, dipartimento, corso di laurea forniti durante la creazione dell&apos;account.</li>
                            <li><strong>Dati di navigazione:</strong> Indirizzo IP, tipo di browser, tempo di permanenza (raccolti in modo anonimo tramite Google Analytics 4, previo consenso).</li>
                            <li><strong>Preferenze:</strong> Scelta di iscrizione alla newsletter.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("purposes_title")}</h2>
                        <p>
                            {tp("purposes_desc")}
                        </p>
                        <ul>
                            <li>Garantire l&apos;accesso ai servizi dell&apos;Area Riservata (prenotazione eventi, scarico attestati).</li>
                            <li>Inviare comunicazioni istituzionali e newsletter (solo se espressamente richiesto).</li>
                            <li>Analizzare in forma aggregata l&apos;utilizzo del sito per migliorarne i contenuti.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">4. Base Giuridica</h2>
                        <p>
                            Il trattamento si basa sul consenso dell&apos;interessato (per newsletter e cookie) e sull&apos;esecuzione di un contratto/servizio (per la gestione dell&apos;account e prenotazione eventi).
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("rights_title")}</h2>
                        <p>
                            {tp("rights_desc")}
                        </p>
                        <ul>
                            <li>Accedere ai tuoi dati e richiederne una copia.</li>
                            <li>Rettificare dati inesatti o incompleti.</li>
                            <li>Richiedere la cancellazione dei tuoi dati (&quot;diritto all&apos;oblio&quot;).</li>
                            <li>Revocare il consenso in qualsiasi momento.</li>
                        </ul>
                        <p className="mt-6">
                            Per esercitare i tuoi diritti, puoi scrivere a: <a href="mailto:associazionemorgana@gmail.com" className="text-primary hover:underline">associazionemorgana@gmail.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
