import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import EventsClient from "./events-client"

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const sessionEmail = cookies().get("session_email")?.value || null

    const [events, categories, t] = await Promise.all([
        getAllEvents(sessionEmail, undefined, 'upcoming', locale),
        getEventCategories(),
        getTranslations("Events")
    ])

    return (
        <EventsClient
            events={events}
            categories={categories}
            mode="upcoming"
        />
    )
}
