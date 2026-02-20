import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { cookies } from "next/headers"
import EventsClient from "./events-client"

export const dynamic = "force-dynamic"

export default async function Page() {
    const sessionEmail = cookies().get("session_email")?.value || null

    const [events, categories] = await Promise.all([
        getAllEvents(sessionEmail),
        getEventCategories()
    ])

    return (
        <EventsClient
            events={events}
            categories={categories}
        />
    )
}
