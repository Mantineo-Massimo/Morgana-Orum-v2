import { getPiazzaArtists } from "@/app/actions/piazza"
import { ArtistsManager } from "@/components/admin/piazza/artists-manager"

export const dynamic = 'force-dynamic'

export default async function PiazzaArtistsPage() {
    const artists = await getPiazzaArtists()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ArtistsManager artists={artists} />
        </div>
    )
}
