import { getServicesData } from "@/app/actions/services"
import { getGuidesData } from "@/app/actions/guides"
import { getVisibleCountdowns } from "@/app/actions/countdowns"
import { GuideClient } from "./guide-client"
import { cookies } from "next/headers"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Navigation" })
    const isEn = locale === "en"
    return {
        title: t("guides"),
        description: isEn
            ? "Useful materials, enrollment procedures, bureaucratic support, and academic guidance for University of Messina students."
            : "Materiale utile, guide all'immatricolazione, guide burocratiche e supporto didattico per gli studenti dell'Università di Messina."
    }
}

export default async function GuidePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const categories = await getServicesData()
    const guides = await getGuidesData()
    const countdowns = await getVisibleCountdowns()
    const sessionEmail = cookies().get("session_email")?.value || null
    const isLoggedIn = !!sessionEmail

    return (
        <GuideClient 
            categories={categories} 
            initialGuides={guides} 
            locale={locale} 
            isLoggedIn={isLoggedIn}
            sessionEmail={sessionEmail}
            countdownItems={countdowns}
        />
    )
}
