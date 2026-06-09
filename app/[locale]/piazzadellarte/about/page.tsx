import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-zinc-50">
                <div className="absolute inset-0 z-0 opacity-10">
                    <Image src="/assets/piazza.webp" fill className="object-cover grayscale" alt="" priority />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-serif font-black uppercase tracking-tighter mb-6 text-[#27a85d]">
                            Cos&apos;è la Piazza dell&apos;Arte?
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-serif">
                            La <strong>Piazza dell&apos;Arte</strong> è un importante evento socio-culturale che si svolge a Messina, organizzato principalmente dall&apos;Associazione Universitaria Morgana e O.R.U.M. È diventato uno degli appuntamenti più attesi della primavera messinese, capace di trasformare gli spazi accademici in un palcoscenico a cielo aperto.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white text-zinc-900 relative">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-stretch max-w-6xl mx-auto">
                        {/* Left Column: Cosa facciamo */}
                        <div className="space-y-10">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-widest text-[#1fbcd3] mb-6 inline-flex items-center gap-3">
                                    Il Progetto
                                    <div className="h-1 w-12 bg-[#1fbcd3] rounded-full"></div>
                                </h3>
                                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                    L&apos;evento nasce con l&apos;obiettivo di valorizzare i giovani talenti del territorio, offrendo loro una vetrina gratuita e partecipata. Si svolge solitamente nel Cortile Centrale dell&apos;Università di Messina e sulla suggestiva Scalinata del Rettorato.
                                </p>
                                <div className="space-y-6">
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#f9a620]"><Sparkles className="size-5" /></span>
                                            Mattina e Pomeriggio
                                        </h4>
                                        <p className="text-muted-foreground">Laboratori artistici, estemporanee di pittura (spesso in collaborazione con il Liceo Artistico &quot;E. Basile&quot;) e seminari culturali (come il &quot;Simposio&quot;).</p>
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#27a85d]"><Sparkles className="size-5" /></span>
                                            Sera
                                        </h4>
                                        <p className="text-muted-foreground">Il momento clou con esibizioni dal vivo di band, solisti, ballerini, attori e performer.</p>
                                    </div>
                                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="text-xl font-bold text-zinc-900 mb-2 flex items-center gap-2">
                                            <span className="text-[#1fbcd3]"><Sparkles className="size-5" /></span>
                                            Contest
                                        </h4>
                                        <p className="text-muted-foreground">Include spesso mostre fotografiche e concorsi (come quello dedicato a Michelangelo Vizzini) con premiazioni dal vivo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Le Associazioni & Perchè è importante */}
                        <div className="bg-[#18182e] p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden h-full">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[#27a85d] rounded-full blur-[80px] opacity-50"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-[#1fbcd3] rounded-full blur-[80px] opacity-50"></div>

                            <h3 className="text-2xl font-black uppercase tracking-widest text-[#27a85d] mb-6 relative z-10">
                                Le Associazioni Coinvolte
                            </h3>
                            <p className="text-white/80 mb-8 relative z-10 text-lg">
                                Sebbene l&apos;organizzazione principale faccia capo all&apos;Associazione Morgana e O.R.U.M., l&apos;evento è il risultato di una rete di collaborazioni:
                            </p>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#f9a620]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">Associazione Morgana e O.R.U.M.</strong>
                                        <span className="text-white/70">È il motore dell&apos;iniziativa. Si occupa della logistica, dei bandi per gli artisti e del coordinamento dei volontari.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#1fbcd3]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">Partner Istituzionali</strong>
                                        <span className="text-white/70">L&apos;evento gode del supporto dell&apos;Università degli Studi di Messina (UniMe) e dell&apos;ERSU.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="mt-1 shrink-0 text-[#27a85d]">
                                        <ArrowRight className="size-5" />
                                    </div>
                                    <div>
                                        <strong className="block text-white text-lg mb-1">Altre Realtà</strong>
                                        <span className="text-white/70">Spesso sostenuta da altre associazioni studentesche o culturali (es. Forum dei giovani, Decimo Sommerso) rendendo l&apos;evento un momento di unità per tutta la comunità.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Full-width below: Perché è importante? */}
                    <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-zinc-100">
                        <h3 className="text-3xl font-black uppercase tracking-widest text-zinc-900 mb-10 text-center">
                            Perché è importante?
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#1fbcd3]/10 group-hover:bg-[#1fbcd3] text-[#1fbcd3] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">1</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">Connessione</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">Apre le porte dell&apos;Ateneo a tutta la cittadinanza, non solo agli studenti.</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#f9a620]/10 group-hover:bg-[#f9a620] text-[#f9a620] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">2</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">Talento</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">Permette a giovani artisti emergenti di esibirsi davanti a migliaia di persone gratuitamente.</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg text-center group">
                                <div className="size-14 bg-[#27a85d]/10 group-hover:bg-[#27a85d] text-[#27a85d] group-hover:text-white transition-colors rounded-full flex items-center justify-center mx-auto mb-5">
                                    <span className="font-bold text-xl">3</span>
                                </div>
                                <strong className="block text-zinc-900 text-lg mb-2">Aggregazione</strong>
                                <span className="text-sm text-muted-foreground leading-relaxed">Esempio di &quot;cittadinanza attiva&quot; dove gli studenti promuovono cultura e divertimento sano.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
