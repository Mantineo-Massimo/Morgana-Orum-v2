import { Metadata } from "next"
import IniziativeClient from "./iniziative-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "IniziativePage" })
    return {
        title: t("title"),
        description: t("description")
    }
}

export default function IniziativePage() {
    return <IniziativeClient />
}
