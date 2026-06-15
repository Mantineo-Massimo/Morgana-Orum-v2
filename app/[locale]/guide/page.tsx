import { getServicesData } from "@/app/actions/services"
import { GuideClient } from "./guide-client"

export const dynamic = "force-dynamic"

export default async function GuidePage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const categories = await getServicesData()
    return <GuideClient categories={categories} locale={locale} />
}
