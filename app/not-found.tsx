import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center py-20">
            <h1 className="text-9xl font-black text-zinc-100">404</h1>
            <div className="space-y-4 -mt-12 relative z-10">
                <h2 className="text-3xl font-bold text-zinc-900">Pagina non trovata</h2>
                <p className="text-zinc-500 max-w-md mx-auto">
                    La risorsa che stai cercando non è disponibile all&apos;interno di questa sezione.
                </p>
                <Link
                    href="./"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all active:scale-95 font-medium"
                >
                    <ArrowLeft className="size-4" />
                    Torna alla Home
                </Link>
            </div>
        </div>
    )
}
