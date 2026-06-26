import { Metadata } from "next"
import AboutClient from "./about-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "AboutPage" })
    return {
        title: t("title"),
        description: t("description")
    }
}

export default function AboutPage() {
    return <AboutClient />
}
