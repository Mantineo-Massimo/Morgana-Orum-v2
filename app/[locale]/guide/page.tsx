import { getServicesData } from "@/app/actions/services"
import { getGuidesData } from "@/app/actions/guides"
import { GuideClient } from "./guide-client"

export const dynamic = "force-dynamic"

export default async function GuidePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const categories = await getServicesData()
    const guides = await getGuidesData()
    return <GuideClient categories={categories} initialGuides={guides} locale={locale} />
}
