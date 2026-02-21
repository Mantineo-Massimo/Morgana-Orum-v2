import { BookOpen, Map, Coffee, Bus, GraduationCap, ArrowRight, Building2, MapPin, Navigation, Landmark, HeartPulse, Stethoscope, Briefcase, GraduationCap as GradIcon } from "lucide-react"

const GUIDES = [
    {
        title: "Iscrizioni e Burocrazia",
        desc: "Tutto quello che devi sapere su tasse, piani di studio e scadenze amministrative.",
        icon: GraduationCap,
        color: "blue",
        href: "#"
    },
    {
        title: "Poli Didattici",
        desc: "Una mappa dettagliata per non perderti tra i vari plessi dell'Ateneo.",
        icon: Map,
        color: "green",
        map: true,
        href: "guides/map" // Relative link to the new map subpage
    },
    {
        title: "Mensa e Ristorazione",
        desc: "Dove mangiare con le convenzioni ERSU e i migliori posti vicino alle aule.",
        icon: Coffee,
        color: "orange",
        href: "#"
    },
    {
        title: "Trasporti e Mobilità",
        desc: "Come raggiungere i poli universitari con bus, tram e navette dedicate.",
        icon: Bus,
        color: "purple",
        href: "#"
    }
]

const POLI = [
    {
        name: "Polo Centrale",
        address: "Piazza Pugliatti, 1",
        departments: ["Giurisprudenza", "Economia", "Scienze Politiche", "Lettere (DICAM)"],
        icon: Landmark,
        color: "blue",
        mapsLink: "https://maps.app.goo.gl/w1qf41CZbZ2h8h8j7"
    },
    {
        name: "Polo Annunziata",
        address: "Viale J. Palatucci, 13",
        departments: ["Veterinaria", "Lettere", "CUS UniMe", "Mensa ERSU"],
        icon: Briefcase,
        color: "green",
        mapsLink: "https://maps.app.goo.gl/YwJmD1X2qWj6hK2r6"
    },
    {
        name: "Polo Papardo",
        address: "Viale F. Stagno d'Alcontres, 31",
        departments: ["Ingegneria", "Scienze Matematiche, Fisiche e Naturali"],
        icon: BookOpen,
        color: "purple",
        mapsLink: "https://maps.app.goo.gl/yM4tU9kR8Q7KzP1H6"
    },
    {
        name: "Polo Policlinico",
        address: "Via Consolare Valeria, 1",
        departments: ["Medicina", "Professioni Sanitarie", "Odontoiatria"],
        icon: HeartPulse,
        color: "red",
        mapsLink: "https://maps.app.goo.gl/QcZ9wR4yU3HkK6h2A"
    }
]

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 italic">Unime Matricole</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">Le Guide Accademiche</h1>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        Abbiamo raccolto qui tutte le informazioni essenziali per aiutarti a muovere i primi passi nell'Ateneo di Messina senza stress.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {GUIDES.map((guide, i) => {
                        const Icon = guide.icon

                        return (
                            <div key={i} className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                                <div>
                                    <div className={`size-16 rounded-2xl bg-${guide.color}-50 text-${guide.color}-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="size-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">{guide.title}</h3>
                                    <p className="text-zinc-500 mb-6 leading-relaxed">
                                        {guide.desc}
                                    </p>
                                </div>
                                <a href={guide.href} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground hover:text-blue-600 transition-colors mt-8 pt-6 border-t border-zinc-100 w-fit">
                                    {guide.map ? "Vedi Mappa" : "Leggi la guida"} <ArrowRight className="size-4" />
                                </a>
                            </div>
                        )
                    })}
                </div>

                {/* Footer AIuto */}
                <div className="mt-20 max-w-2xl mx-auto bg-blue-50/50 border border-blue-100 rounded-3xl p-8 text-center text-blue-900">
                    <h3 className="text-xl font-bold mb-3 font-serif">Hai bisogno di altro aiuto?</h3>
                    <p className="opacity-80 mb-6 text-sm md:text-base">
                        I nostri rappresentanti sono sempre disponibili per aiutarti a destreggiarti tra le pratiche universitarie.
                    </p>
                    <a href="https://instagram.com/morganamessina" target="_blank" rel="noopener noreferrer" className="inline-block font-bold uppercase tracking-widest text-xs border-2 border-blue-900/20 px-6 py-3 rounded-full hover:bg-blue-900 hover:text-white transition-colors">
                        Contattaci su IG
                    </a>
                </div>
            </div>
        </div>
    )
}
