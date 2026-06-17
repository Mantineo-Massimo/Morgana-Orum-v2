import { getAllUsers } from "@/app/actions/users"
import { redirect } from "next/navigation"
import UsersAdminClient from "./users-admin-client"

export const dynamic = "force-dynamic"

export default async function UsersAdminPage() {
    const users = await getAllUsers()

    if (!users) {
        redirect("/admin")
    }

    return (
        <div className="space-y-8">
            <UsersAdminClient initialUsers={users} />
        </div>
    )
}
