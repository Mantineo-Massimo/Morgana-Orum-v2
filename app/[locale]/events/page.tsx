import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { cookies } from "next/headers"
import EventsClient from "./events-client"

export const dynamic = "force-dynamic"

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const sessionEmail = cookies().get("session_email")?.value || null

    const [events, categories] = await Promise.all([
        getAllEvents(sessionEmail, undefined, 'upcoming', locale),
        getEventCategories()
    ])

    return (
        <EventsClient
            events={events}
            categories={categories}
            mode="upcoming"
        />
    )
}
