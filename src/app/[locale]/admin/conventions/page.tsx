import { getConventions } from "@/app/actions/conventions"
import ConventionsListClient from "./conventions-list-client"

export const dynamic = "force-dynamic"

export default async function AdminConventionsPage() {
    const conventions = await getConventions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <ConventionsListClient initialData={conventions} />
        </div>
    )
}
