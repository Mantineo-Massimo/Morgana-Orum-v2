import { Metadata } from "next"
import MediaKitClient from "./media-kit-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "MediaKitPage" })
    return {
        title: t("title"),
        description: t("subtitle")
    }
}

export default function MediaKitPage() {
    return <MediaKitClient />
}
