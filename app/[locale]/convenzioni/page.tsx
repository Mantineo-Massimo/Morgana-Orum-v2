import { getConventions } from "@/app/actions/conventions"
import OffersClient from "@/app/[locale]/dashboard/offers/offers-client"

export const dynamic = "force-dynamic"

export default async function ConvenzioniPage() {
    const conventions = await getConventions()

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-4 tracking-tight text-foreground">
                        Convenzioni Studentesche
                    </h1>
                    <p className="text-xl md:text-2xl font-medium text-zinc-500 mb-8 italic">
                        Sconti esclusivi e vantaggi commerciali dedicati agli studenti universitari iscritti alle associazioni Morgana e O.R.U.M. presso librerie, negozi, palestre e ristoranti a Messina e Melilli.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-[#f9a620]/10 border border-[#f9a620]/20 text-[#d97706] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">
                        Mostra la tua tessera associativa digitale in negozio per usufruirne!
                    </div>
                </div>

                <OffersClient initialData={conventions} />
            </div>
        </div>
    )
}
