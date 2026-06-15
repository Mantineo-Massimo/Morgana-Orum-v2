import { getWhatsAppGroups } from "@/app/actions/whatsapp-groups"
import { GruppiClient } from "./gruppi-client"

export const dynamic = "force-dynamic"

export default async function GruppiPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const groups = await getWhatsAppGroups()
    return <GruppiClient initialGroups={groups} locale={locale} />
}
