import Link from "next/link"
import { Bus, ArrowLeft, MapPin, Clock, ExternalLink, Info } from "lucide-react"

const TRANSPORT_DATA = [
    {
        pole: "Polo Policlinico",
        color: "red",
        lines: [
            { id: "9", name: "S.Filippo Superiore", scheduleId: "9" },
            { id: "10", name: "S. Giovannello", scheduleId: "10" },
            { id: "12", name: "Bordonaro Inf.", scheduleId: "12" },
            { id: "12 BIS", name: "Navetta Parcheggi", scheduleId: "412" },
            { id: "36", name: "Terminal Zir - Policlinico", scheduleId: "36" }
        ]
    },
    {
        pole: "Polo Annunziata",
        color: "green",
        lines: [
            { id: "22", name: "Annunziata - Villa Dante", scheduleId: "22" },
            { id: "22 BIS", name: "Zir - Annunziata", scheduleId: "329" },
            { id: "23", name: "S.S. Annunziata", scheduleId: "23" },
            { id: "23U", name: "Cavallotti - Museo - Cittadella Universitaria", scheduleId: "230" }
        ]
    },
    {
        pole: "Polo Papardo",
        color: "purple",
        lines: [
            { id: "24", name: "Papardo", scheduleId: "24" },
            { id: "31", name: "Torre Faro - Papardo", scheduleId: "31" },
            { id: "32", name: "Villafranca - Spartà - Mortelle - Terminal Museo (provvisorio) e navette di collegamento", scheduleId: "32" },
            { id: "39", name: "S. Margherita - Papardo (A20)", scheduleId: "39" }
        ]
    },
    {
        pole: "Polo Centrale: Aulario",
        color: "blue",
        lines: [
            { id: "16", name: "Montepiselli", scheduleId: "16" },
            { id: "16 BIS", name: "Montepiselli", scheduleId: "326" }
        ]
    },
    {
        pole: "Rettorato",
        color: "zinc",
        lines: [
            { id: "1", name: "Shuttle 100", scheduleId: "1" },
            { id: "5", name: "Mili - Terminal Zir", scheduleId: "5" },
            { id: "6", name: "Tipoldo", scheduleId: "6" },
            { id: "8", name: "S.Lucia - S.Filippo Inf", scheduleId: "8" },
            { id: "8 BIS", name: "S.Lucia - S.Filippo Inf", scheduleId: "999" },
            { id: "9", name: "S.Filippo Superiore", scheduleId: "9" },
            { id: "10", name: "S. Giovannello", scheduleId: "10" },
            { id: "15 BIS", name: "Vill. UNRRA - Case Incis", scheduleId: "48" },
            { id: "16", name: "Montepiselli", scheduleId: "16" },
            { id: "17", name: "Città Nuova - Terminal Cavallotti", scheduleId: "17" },
            { id: "18", name: "S. Michele - Terminal Cavallotti", scheduleId: "18" },
            { id: "18 BIS", name: "Giampilieri - S. Michele - Terminal Cavallotti", scheduleId: "47" },
            { id: "19", name: "Giostra - Via Ogliastri", scheduleId: "19" },
            { id: "19 BIS", name: "Granatari - V.le Giostra - Stazione", scheduleId: "44" },
            { id: "20", name: "S. Licandro", scheduleId: "20" },
            { id: "21", name: "Circonvallazione", scheduleId: "21" },
            { id: "32", name: "Villafranca - Spartà - Mortelle - Terminal Museo (provvisorio) e navette di collegamento", scheduleId: "32" },
            { id: "33", name: "Ponte Gallo (A20)", scheduleId: "33" },
            { id: "37", name: "Shopping", scheduleId: "37" }
        ]
    }
]

export default function TransportGuidePage({ params }: { params: { brandId: string } }) {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <Link
                        href={`/network/${params.brandId}/guides`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="size-4" /> Torna alle guide
                    </Link>
                    <div className="size-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Bus className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        Trasporti e Mobilità
                    </h1>
                    <p className="text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
                        Muoversi a Messina non è mai stato così semplice. Scopri tutte le linee ATM dedicate per raggiungere ogni polo universitario.
                    </p>
                </div>

                {/* Info Card */}
                <div className="max-w-5xl mx-auto mb-12 bg-zinc-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-amber-400 mb-4">
                                <Info className="size-5" />
                                <span className="font-bold uppercase tracking-widest text-xs">Informazioni Utili</span>
                            </div>
                            <h2 className="text-3xl font-serif font-bold mb-4">ATM Messina</h2>
                            <p className="text-zinc-400 leading-relaxed mb-6">
                                Il servizio di trasporto pubblico a Messina è gestito dall&apos;ATM. Per gli studenti universitari sono spesso disponibili abbonamenti agevolati. Ti consigliamo di scaricare l&apos;app ufficiale per monitorare i bus in tempo reale.
                            </p>
                            <a
                                href="https://www.atmmessinaspa.it/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all uppercase tracking-widest"
                            >
                                Sito Ufficiale ATM <ExternalLink className="size-4" />
                            </a>
                        </div>
                        <div className="size-48 md:size-64 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-3xl border border-white/10">
                            <Bus className="size-24 text-white/20" />
                        </div>
                    </div>
                    {/* Pattern Decorativo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Search / Filter (Visual only for now) */}
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TRANSPORT_DATA.map((item, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-xl transition-all group">
                            <div className={`p-6 border-b border-zinc-50 flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                        <MapPin className="size-5" />
                                    </div>
                                    <h3 className="font-black text-foreground uppercase tracking-tight">{item.pole}</h3>
                                </div>
                            </div>
                            <div className="p-6 flex-1 space-y-3 bg-zinc-50/30">
                                {item.lines.map((line, li) => (
                                    <a
                                        key={li}
                                        href={`https://www.atmmessinaspa.it/linea.php?tipo=1&lin=${line.scheduleId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm group/line hover:border-primary/30 transition-all hover:shadow-md active:scale-[0.98]"
                                    >
                                        <span className="shrink-0 size-10 flex items-center justify-center bg-zinc-900 text-white rounded-lg text-xs font-black px-2 shadow-md">
                                            {line.id}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-zinc-800 leading-tight group-hover/line:text-primary transition-colors">
                                                {line.name}
                                            </p>
                                        </div>
                                        <ExternalLink className="size-3 text-zinc-300 group-hover/line:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                            <div className="p-6 pt-0 mt-auto bg-zinc-50/30">
                                <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-zinc-200 flex items-center gap-3">
                                    <Clock className="size-4 text-zinc-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Controlla orari in App</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shuttle Recall */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <div className="bg-primary/5 rounded-[40px] p-8 md:p-16 border border-primary/10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-serif font-black text-foreground mb-6 leading-tight uppercase tracking-tighter">
                                Il Cuore della Mobilità: <span className="text-primary">Shuttle 100</span>
                            </h2>
                            <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                                Lo Shuttle 100 è la linea portante che attraversa tutta la città da Giampilieri a Torre Faro, passando per il Terminal Zir, il Rettorato e il Terminal Museo. È la scelta più rapida per spostarsi tra i poli principali.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
                                    <div className="size-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-bold text-xs uppercase tracking-widest">Alta Frequenza</span>
                                </div>
                                <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center gap-3">
                                    <MapPin className="size-4 text-primary" />
                                    <span className="font-bold text-xs uppercase tracking-widest">38 fermate</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <div className="size-48 md:size-72 bg-white rounded-[50px] shadow-2xl flex items-center justify-center p-8 rotate-3 hover:rotate-0 transition-transform duration-500 border border-zinc-100">
                                <Bus className="size-32 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
