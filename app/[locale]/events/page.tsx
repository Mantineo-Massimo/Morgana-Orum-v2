import { getAllEvents, getEventCategories } from "@/app/actions/events"
import { Association } from "@prisma/client"
import { cookies } from "next/headers"
import { getTranslations } from "next-intl/server"
import EventsClient from "./events-client"
import { Metadata } from "next"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const isEn = locale === "en"
    return {
        title: isEn ? "Events" : "Eventi",
        description: isEn
            ? "Calendar of upcoming academic events, sports tournaments, cineforums, and university seminars organized for students."
            : "Calendario dei prossimi eventi accademici, tornei sportivi, cineforum e seminari universitari organizzati per gli studenti."
    }
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
    const sessionEmail = cookies().get("session_email")?.value || null

    const [events, categories, t] = await Promise.all([
        getAllEvents(sessionEmail, Association.MORGANA_ORUM, 'upcoming', locale),
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
