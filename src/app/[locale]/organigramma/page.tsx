import { getOrganigrammaMembers, getOrganigrammaConfig } from "@/app/actions/organigramma"
import { OrganigrammaClient } from "./organigramma-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function OrganigrammaPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const config = await getOrganigrammaConfig()
    if (!config.visible) {
        notFound()
    }

    const members = await getOrganigrammaMembers()
    return <OrganigrammaClient initialMembers={members} locale={locale} />
}
