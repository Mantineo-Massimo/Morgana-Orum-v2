import { getRepresentatives, getBienniumConfigs } from "@/app/actions/representatives"
import RepresentativesClient from "./representatives-client"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Representatives" })
    return {
        title: t("title"),
        description: t("subtitle")
    }
}
export default async function RepresentativesPage() {
    // Fetch data from DB
    const [allReps, configs] = await Promise.all([
        getRepresentatives(),
        getBienniumConfigs()
    ])

    return (
        <RepresentativesClient
            allReps={allReps}
            bienniumConfigs={configs}
        />
    )
}
