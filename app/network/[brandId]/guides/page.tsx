import { BookOpen, Map, Coffee, Bus, GraduationCap, ArrowRight, Building2, MapPin, Navigation, Landmark, HeartPulse, Stethoscope, Briefcase, GraduationCap as GradIcon } from "lucide-react"

const GUIDES = [
    {
        title: "Iscrizioni e Burocrazia",
        desc: "Tutto quello che devi sapere su tasse, piani di studio e scadenze amministrative.",
        icon: GraduationCap,
        color: "blue",
        href: "#",
        cta: "Prossimamente"
    },
    {
        title: "Poli Didattici",
        desc: "Una mappa dettagliata per non perderti tra i vari plessi dell&apos;Ateneo.",
        icon: Map,
        color: "green",
        map: true,
        href: "guides/map", // Relative link to the new map subpage
        cta: "Vedi Mappa"
    },
    {
        title: "Servizi UniMe",
        desc: "Borse di studio, alloggi, mense, biblioteche e supporti all&apos;inclusione.",
        icon: Landmark,
        color: "orange",
        href: "guides/servizi",
        cta: "Scopri i servizi"
    },
    {
        title: "Trasporti e Mobilità",
        desc: "Come raggiungere i poli universitari con bus, tram e navette dedicate.",
        icon: Bus,
        color: "purple",
        href: "guides/trasporti",
        cta: "Scopri le linee"
    }
]

const SOCIAL_MAPPING: Record<string, string> = {
    matricole: "unime.matricole",
    unimhealth: "unimhealth",
    economia: "studentieconomia",
    scipog: "studentiscipog",
    dicam: "insidedicam"
}

const BRAND_NAMES: Record<string, string> = {
    matricole: "Unime Matricole",
    unimhealth: "Unimhealth",
    economia: "Studenti Economia",
    scipog: "Studenti Scipog",
    dicam: "Inside Dicam"
}

export default function GuidesPage({ params }: { params: { brandId: string } }) {
    const igHandle = SOCIAL_MAPPING[params.brandId] || "unime.matricole"
    const brandName = BRAND_NAMES[params.brandId] || "Morgana & Orum"

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 italic">{brandName}</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">Le Guide Accademiche</h1>
                    <p className="text-lg text-zinc-600 leading-relaxed">
                        Abbiamo raccolto qui tutte le informazioni essenziali per aiutarti a muovere i primi passi nell&apos;Ateneo di Messina senza stress.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {GUIDES.map((guide, i) => {
                        const Icon = guide.icon
                        const isDisabled = guide.href === "#"

                        return (
                            <div key={i} className={`bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm transition-all flex flex-col justify-between ${!isDisabled ? 'hover:shadow-xl group' : 'opacity-70'}`}>
                                <div>
                                    <div className={`size-16 rounded-2xl bg-${guide.color}-50 text-${guide.color}-500 flex items-center justify-center mb-6 ${!isDisabled ? 'group-hover:scale-110 transition-transform' : ''}`}>
                                        <Icon className="size-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">{guide.title}</h3>
                                    <p className="text-zinc-500 mb-6 leading-relaxed">
                                        {guide.desc}
                                    </p>
                                </div>
                                {!isDisabled ? (
                                    <a href={guide.href} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-foreground hover:text-blue-600 transition-colors mt-8 pt-6 border-t border-zinc-100 w-fit">
                                        {guide.cta} <ArrowRight className="size-4" />
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-400 mt-8 pt-6 border-t border-zinc-100 w-fit">
                                        {guide.cta}
                                    </div>
                                )}
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
                    <a href={`https://www.instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer" className="inline-block font-bold uppercase tracking-widest text-xs border-2 border-blue-900/20 px-6 py-3 rounded-full hover:bg-blue-900 hover:text-white transition-colors">
                        Contattaci su IG
                    </a>
                </div>
            </div>
        </div>
    )
}
