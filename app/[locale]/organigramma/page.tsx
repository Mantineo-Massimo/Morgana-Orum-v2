import { getOrganigrammaMembers } from "@/app/actions/organigramma"
import { OrganigrammaClient } from "./organigramma-client"

export const dynamic = "force-dynamic"

export default async function OrganigrammaPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const members = await getOrganigrammaMembers()
    return <OrganigrammaClient initialMembers={members} locale={locale} />
}
