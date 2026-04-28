import { getPiazzaSponsors } from "@/app/actions/piazza"
import { SponsorsManager } from "@/components/admin/piazza/sponsors-manager"

export const dynamic = 'force-dynamic'

export default async function PiazzaSponsorsPage() {
    const sponsors = await getPiazzaSponsors()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SponsorsManager sponsors={sponsors} />
        </div>
    )
}
