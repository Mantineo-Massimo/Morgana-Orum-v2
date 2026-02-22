"use client"

import { useState } from "react"
import { updateUserRole, deleteUser } from "@/app/actions/users"
import { MoreHorizontal, Trash2, Shield, User, Globe, Crown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Association } from "@prisma/client"
import { ASSOCIATIONS } from "@/lib/associations"

type UserItem = {
    id: number
    email: string
    name: string
    surname: string
    role: "USER" | "ADMIN_NETWORK" | "ADMIN_MORGANA" | "SUPER_ADMIN"
    association: "MORGANA_ORUM" | "UNIMHEALTH" | "ECONOMIA" | "SCIPOG" | "DICAM" | "MATRICOLE" | "INSIDE_DICAM"
    matricola: string
    createdAt: Date
}

export default function UsersAdminClient({ initialUsers }: { initialUsers: UserItem[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [search, setSearch] = useState("")

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        `${u.name} ${u.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        u.matricola.includes(search)
    )

    const handleRoleChange = async (userId: number, newRole: UserItem["role"]) => {
        if (!confirm(`Sei sicuro di voler cambiare il ruolo in ${newRole}?`)) return

        const user = users.find(u => u.id === userId)
        if (!user) return

        setLoadingId(userId)
        const res = await updateUserRole(userId, newRole)
        if (res.success) {
            // Follow server-side logic:
            let finalAssoc = user.association
            if (newRole === "SUPER_ADMIN" || newRole === "ADMIN_MORGANA") {
                finalAssoc = "MORGANA_ORUM"
            } else if (newRole === "ADMIN_NETWORK" && user.association === "MORGANA_ORUM") {
                finalAssoc = "UNIMHEALTH"
            }

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, association: finalAssoc as UserItem["association"] } : u))
        } else {
            alert("Errore durante l'aggiornamento: " + res.error)
        }
        setLoadingId(null)
    }

    const handleAssociationChange = async (userId: number, newAssociation: string) => {
        const user = users.find(u => u.id === userId)
        if (!user) return

        setLoadingId(userId)
        const res = await updateUserRole(userId, user.role, newAssociation as Association)
        if (res.success) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, association: newAssociation as UserItem["association"] } : u))
        } else {
            alert("Errore durante l'aggiornamento: " + res.error)
        }
        setLoadingId(null)
    }

    const handleDelete = async (userId: number) => {
        if (!confirm("Sei sicuro di voler eliminare definitivamente questo utente? Questa azione non è reversibile.")) return

        setLoadingId(userId)
        const res = await deleteUser(userId)
        if (res.success) {
            setUsers(prev => prev.filter(u => u.id !== userId))
        } else {
            alert("Errore durante l'eliminazione: " + res.error)
        }
        setLoadingId(null)
    }

    const roles = [
        { id: "USER", label: "Utente", icon: User, color: "bg-zinc-100 text-zinc-600" },
        { id: "ADMIN_NETWORK", label: "Admin Network", icon: Globe, color: "bg-blue-100 text-blue-600" },
        { id: "ADMIN_MORGANA", label: "Admin Morgana/Orum", icon: Crown, color: "bg-red-100 text-red-600" },
        { id: "SUPER_ADMIN", label: "Super Admin", icon: Shield, color: "bg-purple-100 text-purple-600" },
    ]

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Cerca per email, nome o matricola..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Utente</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Matricola</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Ruolo</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest">Associazione</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-zinc-400 uppercase tracking-widest">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-foreground capitalize">{user.name} {user.surname}</p>
                                            <p className="text-xs text-zinc-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs font-mono px-2 py-1 bg-zinc-100 rounded text-zinc-600">
                                            {user.matricola}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                className={cn(
                                                    "text-xs font-bold px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none text-center min-w-[140px]",
                                                    roles.find(r => r.id === user.role)?.color
                                                )}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as UserItem["role"])}
                                                disabled={loadingId === user.id}
                                            >
                                                {roles.map(r => (
                                                    <option key={r.id} value={r.id}>{r.label}</option>
                                                ))}
                                            </select>
                                            {loadingId === user.id && <Loader2 className="size-3 animate-spin text-zinc-400" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="text-sm bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                                                value={user.association}
                                                onChange={(e) => handleAssociationChange(user.id, e.target.value)}
                                                disabled={loadingId === user.id || user.role !== "ADMIN_NETWORK"}
                                            >
                                                {ASSOCIATIONS
                                                    .filter(a => user.role !== "ADMIN_NETWORK" || a.id !== "MORGANA_ORUM")
                                                    .map(a => (
                                                        <option key={a.id} value={a.id}>{a.name}</option>
                                                    ))}
                                                {/* In case association is not in the list (legacy/manual) */}
                                                {!ASSOCIATIONS.find(a => a.id === user.association) && (
                                                    <option value={user.association}>{user.association}</option>
                                                )}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                            disabled={loadingId === user.id}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-zinc-400">
                                {`Nessun utente trovato per la ricerca "${search}".`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
