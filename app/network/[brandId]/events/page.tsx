import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { cookies } from "next/headers"
import EventsClient from "@/app/events/events-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const BRAND_TO_ASSOCIATION: Record<string, string> = {
    unimehealth: "Unimhealth",
    economia: "Studenti Economia",
    matricole: "Unime Matricole",
    scipog: "Studenti Scipog",
    dicam: "Inside Dicam",
}

export default async function Page({ params }: { params: { brandId: string } }) {
    const association = BRAND_TO_ASSOCIATION[params.brandId]

    if (!association) {
        notFound()
    }

    const sessionEmail = cookies().get("session_email")?.value || null

    const [events, categories] = await Promise.all([
        getAllEvents(sessionEmail, association),
        getEventCategories()
    ])

    return (
        <EventsClient
            events={events}
            categories={categories}
        />
    )
}
