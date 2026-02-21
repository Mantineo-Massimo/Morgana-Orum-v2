import { getEventCategories } from "@/app/actions/events"
import EventForm from "@/components/admin/event-form"

export const dynamic = "force-dynamic"

export default async function NewEventPage() {
    const categories = await getEventCategories()
    return <EventForm categories={categories} />
}
