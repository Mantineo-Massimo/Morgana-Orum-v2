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
            <div>
                <h1 className="text-3xl font-bold text-foreground">Gestione Utenti</h1>
                <p className="text-zinc-500 mt-2">Amministra i permessi e i ruoli di tutti gli utenti registrati.</p>
            </div>

            <UsersAdminClient initialUsers={users} />
        </div>
    )
}
