import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import the map component with SSR disabled because Leaflet needs the window object
const InteractiveMap = dynamic(
    () => import("@/components/interactive-map"),
    {
        ssr: false, loading: () => (
            <div className="w-full h-full bg-zinc-100 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-zinc-400 font-medium">Caricamento mappa interattiva...</span>
            </div>
        )
    }
)

export default function MapPage({ params }: { params: { brandId: string } }) {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-8">
                    <Link href={`/network/${params.brandId}/guides`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                        <ArrowLeft className="size-4" /> Torna alle Guide
                    </Link>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-zinc-100 shadow-xl relative overflow-hidden">
                    {/* Decorative background blur */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-16 relative z-10">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                                    <MapPin className="size-8" />
                                </div>
                                <div>
                                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">Mappa Interattiva</span>
                                    <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tight">Poli Didattici</h1>
                                </div>
                            </div>
                            <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed">
                                L&apos;Ateneo di Messina è suddiviso in quattro grandi poli distribuiti per la città. Esplora la mappa interattiva o seleziona un polo per vederne i dettagli.
                            </p>

                            <div className="mt-6 bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 max-w-3xl shadow-sm">
                                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                                    <span className="text-xl">🍽️</span> Mense ERSU
                                </h3>
                                <p className="text-amber-800/90 text-sm leading-relaxed">
                                    L&apos;ERSU (Ente Regionale per il diritto allo Studio Universitario) dispone di quattro mense dislocate nelle immediate vicinanze dei poli universitari, in modo da consentire agli studenti di consumare i pasti senza allontanarsi dalla sede didattica frequentata. Usa la mappa qui sotto per vedere gli orari specifici di ciascun polo.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full z-10 relative mb-16 flex flex-col">
                        <InteractiveMap />
                    </div>

                    {/* Sedi Decentrate Section */}
                    <div className="relative z-10 border-t border-zinc-100 pt-12 mt-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-inner">
                                <MapPin className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-black text-foreground uppercase tracking-tight">Sedi Decentrate</h2>
                                <p className="text-sm text-zinc-500">Corsi di laurea offerti nei poli formativi distaccati</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Siracusa Card */}
                            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-indigo-600 transition-colors">Polo di Siracusa</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            Via Sebastiano Agati 10 - 96100 Siracusa (SR)
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">CdL Triennali e Ciclo Unico 25/26</h4>
                                        <ul className="space-y-2">
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Consulente del Lavoro e Scienze Dei Servizi Giuridici</li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Giurisprudenza</li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                                                Infermieristica (abilitante)
                                                <span className="block text-[10px] text-zinc-400 mt-1">Sede corso: Melilli, via Parroco Fiorillo</span>
                                            </li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Scienze Politiche, Amministrazione e Servizi</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Noto Card */}
                            <div className="bg-white border border-zinc-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="size-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-purple-600 transition-colors">Polo di Noto</h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed">
                                            Via A. Sofia, 78 Palazzo della Cultura Carlo Giavanti - 96017 Noto (SR)
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-2">CdL Triennali e Ciclo Unico 25/26</h4>
                                        <ul className="space-y-2 mb-4">
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Beni Archeologici: Territorio, Insediamenti, Cultura Materiale</li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Scienze della Formazione e della Comunicazione</li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Scienze e Tecniche Psicologiche</li>
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Scienze Gastronomiche</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-purple-500 mb-2">CdL Magistrali 25/26</h4>
                                        <ul className="space-y-2">
                                            <li className="text-sm text-zinc-600 bg-zinc-50 p-2 rounded-lg border border-zinc-100">Psicologia e Neuroscienze Cognitive</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
