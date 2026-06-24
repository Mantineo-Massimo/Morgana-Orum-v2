import { getWhatsAppGroups } from "@/app/actions/whatsapp-groups"
import { SanitariaVeterinariaClient } from "./sanitaria-veterinaria-client"

export const dynamic = "force-dynamic"

export default async function SanitariaVeterinariaPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const groups = await getWhatsAppGroups()
    return <SanitariaVeterinariaClient initialGroups={groups} locale={locale} />
}
