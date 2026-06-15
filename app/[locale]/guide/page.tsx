"use client"

import { useState } from "react"
import { BookOpen, Bus, Info, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import nextDynamic from "next/dynamic"
import { ServicesGuide } from "@/components/services-guide"
import { TransportGuide } from "@/components/transport-guide"

const InteractiveMap = nextDynamic(
    () => import("@/components/interactive-map"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[600px] w-full bg-zinc-50 border border-zinc-100 animate-pulse rounded-[2rem] flex items-center justify-center text-zinc-400 font-semibold text-xs tracking-wider">
                Caricamento mappa interattiva...
            </div>
        )
    }
)

export const dynamic = "force-dynamic"

export default function GuidePage() {
    const [selectedGuide, setSelectedGuide] = useState<string>("matricole")

    const guides = [
        {
            id: "matricole",
            title: "Guida Matricole",
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-50",
            border: "border-blue-100",
            description: "La guida completa per orientarsi tra tasse, segreterie, iscrizioni e portale dello studente (ESSE3).",
            steps: [
                { title: "Registrazione su Esse3", desc: "Crea il tuo account sul portale Esse3 per gestire la tua carriera accademica." },
                { title: "Immatricolazione & Tasse", desc: "Presenta la domanda online e paga la prima rata per confermare l'iscrizione." },
                { title: "ISEE Università", desc: "Richiedi l'ISEE-U entro la scadenza per calcolare le rate successive in base alla tua fascia." },
                { title: "Badge Digitale", desc: "Scarica l'app Unime per avere sempre con te il tesserino universitario virtuale." }
            ]
        },
        {
            id: "trasporti",
            title: "Trasporti & Mobilità",
            icon: Bus,
            color: "text-[#f9a620]",
            bg: "bg-[#f9a620]/10",
            border: "border-[#f9a620]/20",
            description: "Tutte le informazioni su tram, autobus ATM e abbonamenti speciali a tariffa agevolata per studenti.",
            steps: [
                { title: "Abbonamento Studenti ATM", desc: "Abbonamento annuale bus + tram a soli 20€ all'anno per tutti gli iscritti Unime." },
                { title: "Shuttle Papardo-Annunziata", desc: "Navette ATM dedicate che collegano regolarmente i poli universitari periferici." },
                { title: "Parcheggi di Interscambio", desc: "Usa i parcheggi ATM della città e muoviti in tram per raggiungere il centro." }
            ]
        },
        {
            id: "servizi",
            title: "Servizi & Diritto allo Studio",
            icon: Info,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            description: "Borse di studio ERSU, alloggi universitari, mense e aule studio presenti in ogni dipartimento.",
            steps: [
                { title: "Borse di studio ERSU", desc: "Partecipa al bando annuale dell'ERSU per ottenere esenzioni e contributi monetari." },
                { title: "Mense Universitarie", desc: "Pasti caldi a tariffe ridotte (o gratuiti per i borsisti) presso i punti ristoro autorizzati." },
                { title: "Residenze Studentesche", desc: "Alloggi a tariffa agevolata nei pressi dei poli universitari per studenti fuori sede." }
            ]
        },
        {
            id: "mappa",
            title: "Mappe dei Poli",
            icon: MapPin,
            color: "text-purple-500",
            bg: "bg-purple-50",
            border: "border-purple-100",
            description: "Coordinate e indicazioni per raggiungere facilmente aule, segreterie e laboratori nei quattro poli cittadini.",
            steps: [
                { title: "Polo Centrale (Rettorato/Giurisprudenza/Economia)", desc: "Situato nel cuore di Messina, facilmente raggiungibile a piedi dalla stazione o in tram." },
                { title: "Polo Papardo (Scienze/MIFT/Ingegneria)", desc: "Sulla collina nord di Ganzirri, servito dal bus linea 39 ATM." },
                { title: "Polo Annunziata (Lettere/Veterinaria/Farmacia)", desc: "Lungo il viale Annunziata, servito dalle navette interne." },
                { title: "Polo Policlinico (Medicina/Professioni Sanitarie)", desc: "Polo sud dell'Ateneo, situato all'interno del padiglione ospedaliero." }
            ]
        }
    ]

    const activeGuideData = guides.find(g => g.id === selectedGuide) || guides[0]

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 mb-6 uppercase tracking-tight">
                        Guide Universitarie
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        Tutto il materiale informativo di cui hai bisogno per affrontare la tua vita universitaria a Messina in modo semplice.
                    </p>
                </div>

                {/* Grid of Guide Choices */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {guides.map((g) => {
                        const Icon = g.icon
                        const isSelected = selectedGuide === g.id
                        return (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGuide(g.id)}
                                className={cn(
                                    "p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300",
                                    isSelected 
                                        ? "bg-white border-zinc-900 shadow-xl -translate-y-1 scale-[1.02]" 
                                        : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md"
                                )}
                            >
                                <div className={cn("size-12 rounded-2xl flex items-center justify-center mb-6", g.bg, g.color)}>
                                    <Icon className="size-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-2">{g.title}</h3>
                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{g.description}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Expanded Details Section */}
                <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-2xl p-8 md:p-12">
                    <div className={cn("mx-auto", (selectedGuide === "mappa" || selectedGuide === "servizi" || selectedGuide === "trasporti") ? "max-w-full" : "max-w-4xl")}>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 block mb-2">
                            Guida In Primo Piano
                        </span>
                        <h2 className="text-3xl font-serif font-black text-zinc-900 mb-4 flex items-center gap-3">
                            <span className={activeGuideData.color}>{activeGuideData.title}</span>
                        </h2>
                        <p className="text-zinc-500 mb-10 text-base leading-relaxed">
                            {activeGuideData.description}
                        </p>

                        {selectedGuide === "mappa" ? (
                            <div className="mt-8 z-10 relative">
                                <InteractiveMap />
                            </div>
                        ) : selectedGuide === "servizi" ? (
                            <div className="mt-8 z-10 relative">
                                <ServicesGuide />
                            </div>
                        ) : selectedGuide === "trasporti" ? (
                            <div className="mt-8 z-10 relative">
                                <TransportGuide />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {activeGuideData.steps.map((step, index) => (
                                    <div key={index} className="flex gap-6 items-start">
                                        <div className={cn("size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", activeGuideData.bg, activeGuideData.color)}>
                                            {index + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-zinc-900 leading-tight">{step.title}</h4>
                                            <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
