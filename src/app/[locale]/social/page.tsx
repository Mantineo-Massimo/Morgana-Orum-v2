import { Metadata } from "next"
import SocialClient from "./social-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "SocialPage" })
    return {
        title: t("title"),
        description: t("subtitle")
    }
}

export default function SocialPage() {
    return <SocialClient />
}
