import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPiazzaMedia } from "@/app/actions/piazza"
import { MediaClient } from "@/components/piazza/media-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    if (params.brandId !== 'piazzadellarte') return {}
    return {
        title: "Media | Piazza dell'Arte 2026",
        description: "Rivivi i momenti più belli della Piazza dell'Arte: esibizioni, interviste esclusive e la galleria fotografica."
    }
}

interface Props {
    params: { locale: string; brandId: string }
}

export default async function MediaPage({ params }: Props) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    const media = await getPiazzaMedia()

    return <MediaClient media={media} />
}
