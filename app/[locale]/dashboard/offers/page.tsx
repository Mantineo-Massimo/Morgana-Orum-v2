import { getConventions } from "@/app/actions/conventions"
import OffersClient from "./offers-client"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export default async function Page() {
    const initialConventions = await getConventions()
    const t = await getTranslations("Dashboard")

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1.5">{t("offers_title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{t("offers_desc")}</p>
            </div>

            <OffersClient initialData={initialConventions} />
        </div>
    )
}
