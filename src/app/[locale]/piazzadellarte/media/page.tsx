import { Metadata } from "next"
import { getPiazzaMedia } from "@/app/actions/piazza"
import { MediaClient } from "@/components/piazza/media-client"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Piazza.media" })
    return {
        title: t("metadata_title"),
        description: t("metadata_desc")
    }
}

export default async function MediaPage() {
    const media = await getPiazzaMedia()

    return <MediaClient media={media} />
}
