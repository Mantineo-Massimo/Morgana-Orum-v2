import { getPiazzaArtists } from "@/app/actions/piazza"
import { ArtistiClient } from "@/components/piazza/artisti-client"

export default async function ArtistiPage() {
    const artists = await getPiazzaArtists()

    return <ArtistiClient artists={artists} />
}
