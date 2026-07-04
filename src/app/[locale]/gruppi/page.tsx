import { getWhatsAppGroups, getAcademicYears } from "@/app/actions/whatsapp-groups"
import { GruppiClient } from "./gruppi-client"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Navigation" })
    const isEn = locale === "en"
    return {
        title: t("whatsapp"),
        description: isEn
            ? "Direct links and quick connections to university department and degree course WhatsApp communities."
            : "Collegamenti rapidi e link diretti alle community e gruppi WhatsApp di dipartimento e corso di laurea."
    }
}

export default async function GruppiPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const groups = await getWhatsAppGroups()
    const years = await getAcademicYears()
    return <GruppiClient initialGroups={groups} initialYears={years} locale={locale} />
}
