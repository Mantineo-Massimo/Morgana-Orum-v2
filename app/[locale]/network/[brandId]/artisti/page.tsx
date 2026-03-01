import { getPiazzaArtists } from "@/app/actions/piazza"
import { ArtistiClient } from "@/components/piazza/artisti-client"

interface Props {
    params: { locale: string; brandId: string }
}

export default async function ArtistiPage({ params }: Props) {
    // If brandId is not piazzadellarte, we might want to handle it, but for now we assume it's correct
    const artists = await getPiazzaArtists()

    return <ArtistiClient artists={artists} />
}
