import { Link } from "@/i18n/routing"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center py-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="relative">
                <h1 className="text-[12rem] md:text-[16rem] font-black text-zinc-50 tracking-tighter leading-none select-none">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                </div>
            </div>

            <div className="space-y-6 -mt-8 relative z-10 max-w-lg">
                <h2 className="text-4xl md:text-5xl font-serif font-black text-foreground uppercase tracking-tight">
                    Pagina non trovata
                </h2>
                <p className="text-zinc-500 font-serif text-lg leading-relaxed">
                    Spiacenti, la risorsa che stai cercando non è disponibile o è stata spostata in un&apos;altra sezione del portale.
                </p>
                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full hover:bg-black transition-all active:scale-95 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-black/20"
                    >
                        <ArrowLeft className="size-5" />
                        Torna alla Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
