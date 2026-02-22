import { getEventCategories } from "@/app/actions/events"
import { getSession } from "@/app/actions/auth"
import EventForm from "@/components/admin/event-form"

export const dynamic = "force-dynamic"

export default async function NewEventPage() {
    const [categories, user] = await Promise.all([
        getEventCategories(),
        getSession()
    ])

    return <EventForm categories={categories} userRole={user?.role} userAssociation={user?.association} />
}
