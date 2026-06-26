import { getConventions } from "@/app/actions/conventions"
import OffersClient from "@/app/[locale]/dashboard/offers/offers-client"
import { Ticket } from "lucide-react"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEn = locale === "en"
    return {
        title: isEn ? "Student Benefits & Discounts" : "Convenzioni Studentesche",
        description: isEn
            ? "Exclusive discounts and benefits for students enrolled in Morgana and O.R.U.M. associations in Messina and Melilli."
            : "Sconti esclusivi e vantaggi commerciali dedicati agli studenti universitari iscritti alle associazioni Morgana e O.R.U.M. a Messina e Melilli."
    }
}

export default async function ConvenzioniPage() {
    const conventions = await getConventions()

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <div className="size-20 bg-[#f9a620]/10 text-[#d97706] rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <Ticket className="size-10" />
                    </div>
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
