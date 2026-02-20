import { getConventions } from "@/app/actions/conventions"
import OffersClient from "./offers-client"

export const dynamic = "force-dynamic"

export default async function Page() {
    const initialConventions = await getConventions()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Convenzioni & Offerte</h1>
                <p className="text-zinc-500">Sconti esclusivi riservati ai membri di Morgana e O.R.U.M. nelle attività locali.</p>
            </div>

            <OffersClient initialData={initialConventions} />
        </div>
    )
}
