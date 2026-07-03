import { Metadata } from "next"
import { getPiazzaMedia } from "@/app/actions/piazza"
import { MediaClient } from "@/components/piazza/media-client"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Media | Piazza dell'Arte 2026",
        description: "Rivivi i momenti più belli della Piazza dell'Arte: esibizioni, interviste esclusive e la galleria fotografica."
    }
}

export default async function MediaPage() {
    const media = await getPiazzaMedia()

    return <MediaClient media={media} />
}
