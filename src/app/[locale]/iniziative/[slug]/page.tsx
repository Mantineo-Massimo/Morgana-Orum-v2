import { Metadata } from "next"
import InitiativeDetailClient from "./initiative-detail-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string; slug: string }
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
    const prefixMap: Record<string, string> = {
        "cineforum": "cineforum",
        "piazza-dell-arte": "piazza",
        "notte-dei-regali": "regali",
        "conferenze": "conferenze",
        "sport": "sport",
        "svago": "svago"
    }

    const prefix = prefixMap[slug]
    if (!prefix) {
        return {
            title: "Iniziativa non trovata"
        }
    }

    const t = await getTranslations({ locale, namespace: "IniziativePage" })
    return {
        title: t(`${prefix}_title`),
        description: t(`${prefix}_desc`)
    }
}

export default function Page() {
    return <InitiativeDetailClient />
}
