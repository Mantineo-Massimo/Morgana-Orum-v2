import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { cookies } from "next/headers"
import EventsClient from "@/app/[locale]/events/events-client"
import { Association } from "@prisma/client"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
    const association = Association.PIAZZA_DELLARTE
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
