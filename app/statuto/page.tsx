import Link from "next/link"
import { ArrowLeft, FileText, Download } from "lucide-react"

export default function StatutoPage() {
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
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <FileText className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            Statuto Associativo
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            Lo Statuto è il documento fondamentale che definisce i nostri valori, la nostra struttura e le regole di partecipazione alla vita associativa.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Estratto dei Principi Fondamentali</h2>
                        <p>
                            Le Associazioni Morgana e O.R.U.M. nascono con l&apos;obiettivo di:
                        </p>
                        <ul>
                            <li>Rappresentare gli interessi degli studenti in tutti gli organi accademici dell&apos;Università di Messina.</li>
                            <li>Promuovere attività culturali, didattiche e ricreative che favoriscano la crescita umana e professionale degli iscritti.</li>
                            <li>Favorire l&apos;integrazione dei nuovi studenti (matricole) e il supporto costante durante tutto il percorso di studi.</li>
                        </ul>

                        <div className="my-16 p-8 bg-zinc-50 border border-zinc-200 rounded-3xl flex flex-col items-center text-center">
                            <h3 className="text-xl font-bold text-foreground mb-4">Documentazione Integrale</h3>
                            <p className="text-sm text-zinc-500 mb-8 max-w-md">
                                Puoi consultare o scaricare lo statuto completo in formato PDF cliccando sul bottone qui sotto.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 bg-[#18182e] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all group"
                            >
                                <Download className="size-5 group-hover:translate-y-1 transition-transform" />
                                Scarica Statuto (PDF)
                            </a>
                            <p className="mt-4 text-[10px] text-zinc-400 uppercase tracking-widest">Version: 2024.1.0</p>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">Trasparenza e Partecipazione</h2>
                        <p>
                            La vita associativa è regolata dal principio di democrazia e partecipazione attiva. Ogni studente iscritto ha il diritto di partecipare alle assemblee e contribuire alla definizione delle linee programmatiche.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
