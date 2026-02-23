import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { getAllAdminEvents, getEventCategories, getEventCategoriesWithIds } from "@/app/actions/events"
import Link from "next/link"
import { Plus, Calendar } from "lucide-react"
import EventsAdminClient from "./events-admin-client"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage() {
    const { cookies } = await import("next/headers")
    const userEmail = cookies().get("session_email")?.value
    const user = await prisma.user.findUnique({
        where: { email: userEmail }
    })

    const [events, categories, categoriesWithIds] = await Promise.all([
        getAllAdminEvents({
            userRole: user?.role,
            userAssociation: user?.association
        }),
        getEventCategories(),
        getEventCategoriesWithIds()
    ])

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EventsAdminClient
                initialEvents={events}
                categories={categories}
                categoriesWithIds={categoriesWithIds}
                userRole={user?.role}
                userAssociation={user?.association}
            />
        </div>
    )
}
