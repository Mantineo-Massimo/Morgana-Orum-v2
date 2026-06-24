import { getWhatsAppGroups } from "@/app/actions/whatsapp-groups"
import { SanitariaClient } from "./sanitaria-client"

export const dynamic = "force-dynamic"

export default async function SanitariaPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const groups = await getWhatsAppGroups()
    return <SanitariaClient initialGroups={groups} locale={locale} />
}
