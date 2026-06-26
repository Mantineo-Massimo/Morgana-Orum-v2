import { Metadata } from "next"
import ContactClient from "./contact-client"
import { getTranslations } from "next-intl/server"

type Props = {
    params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Footer" })
    return {
        title: t("contact"),
        description: t("contact_desc")
    }
}

export default function ContactPage() {
    return <ContactClient />
}
