"use client"

import { useState, useTransition } from "react"
import { updateUserRole, deleteUser, adminCreateUser, adminUpdateUser } from "@/app/actions/users"
import { MoreHorizontal, Trash2, Shield, User, Globe, Crown, Loader2, Search, Plus, X, Edit2, ArrowUp, ArrowDown, ArrowUpDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Association, Role } from "@prisma/client"
import { ASSOCIATIONS } from "@/lib/associations"
import { departmentsData } from "@/lib/departments"

type UserItem = {
    id: number
    email: string
    name: string
    surname: string
    role: Role
    association: Association
    matricola: string
    createdAt: Date
    birthDate?: string | Date
    department?: string
    degreeCourse?: string
    isFuorisede?: boolean
    newsletter?: boolean
}

export default function UsersAdminClient({ initialUsers }: { initialUsers: UserItem[] }) {
    const [users, setUsers] = useState(initialUsers)
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [assocFilter, setAssocFilter] = useState<string>("all")
    const [deptFilter, setDeptFilter] = useState<string>("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserItem | null>(null)
    const [isPending, startTransition] = useTransition()

    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null } | null>(null)

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' | null = 'asc'
        if (sortConfig && sortConfig.key === key) {
            if (sortConfig.direction === 'asc') direction = 'desc'
            else if (sortConfig.direction === 'desc') direction = null
        }
        setSortConfig(direction ? { key, direction } : null)
    }

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        email: "",
        password: "",
        birthDate: "",
        matricola: "",
        department: "",
        degreeCourse: "",
        isFuorisede: false,
        newsletter: false,
        role: "USER" as Role,
        association: "MORGANA_ORUM" as Association
    })

    const filteredUsers = users
        .filter(u => {
            const matchesSearch =
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                `${u.name} ${u.surname}`.toLowerCase().includes(search.toLowerCase()) ||
                u.matricola.includes(search)

            const matchesRole = roleFilter === "all" || u.role === roleFilter
            const matchesAssoc = assocFilter === "all" || u.association === assocFilter
            const matchesDept = deptFilter === "all" || u.department === deptFilter

            return matchesSearch && matchesRole && matchesAssoc && matchesDept
        })
        .sort((a, b) => {
            if (!sortConfig) return 0
            const { key, direction } = sortConfig
            if (!direction) return 0

            const valA = (a[key as keyof UserItem] || "").toString().toLowerCase()
            const valB = (b[key as keyof UserItem] || "").toString().toLowerCase()

            if (valA < valB) return direction === 'asc' ? -1 : 1
            if (valA > valB) return direction === 'asc' ? 1 : -1
            return 0
        })

    const openModal = (user?: UserItem) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: "",
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : "",
                matricola: user.matricola,
                department: user.department || "",
                degreeCourse: user.degreeCourse || "",
                isFuorisede: user.isFuorisede || false,
                newsletter: user.newsletter || false,
                role: user.role,
                association: user.association
            })
        } else {
            setEditingUser(null)
            setFormData({
                name: "",
                surname: "",
                email: "",
                password: "",
                birthDate: "",
                matricola: "",
                department: "",
                degreeCourse: "",
                isFuorisede: false,
                newsletter: false,
                role: "USER",
                association: "MORGANA_ORUM"
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const res = editingUser
                ? await adminUpdateUser(editingUser.id, formData)
                : await adminCreateUser(formData)

            if (res.success && res.user) {
                if (editingUser) {
                    setUsers(prev => (Array.isArray(prev) ? prev : []).map(u => u.id === editingUser.id ? { ...u, ...res.user } as UserItem : u))
                } else {
                    setUsers(prev => [res.user as UserItem, ...(Array.isArray(prev) ? prev : [])])
                }
                setIsModalOpen(false)
            } else {
                alert(res.error)
            }
        })
    }

    const handleRoleChange = async (userId: number, newRole: Role) => {
        if (!confirm(`Sei sicuro di voler cambiare il ruolo in ${newRole}?`)) return

        const user = users.find(u => u.id === userId)
        if (!user) return

        setLoadingId(userId)
        const res = await updateUserRole(userId, newRole)
        if (res.success) {
            let finalAssoc = user.association
            if (newRole === "SUPER_ADMIN" || newRole === "ADMIN_MORGANA") {
                finalAssoc = "MORGANA_ORUM"
            } else if (newRole === "ADMIN_NETWORK" && user.association === "MORGANA_ORUM") {
                finalAssoc = "UNIMHEALTH"
            }

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, association: finalAssoc as Association } : u))
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
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, association: newAssociation as Association } : u))
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

    const rolesList = [
        { id: "USER", label: "Utente", icon: User, color: "bg-zinc-100 text-zinc-600" },
        { id: "ADMIN_NETWORK", label: "Admin Network", icon: Globe, color: "bg-blue-100 text-blue-600" },
        { id: "ADMIN_MORGANA", label: "Admin Morgana/Orum", icon: Crown, color: "bg-red-100 text-red-600" },
        { id: "SUPER_ADMIN", label: "Super Admin", icon: Shield, color: "bg-purple-100 text-purple-600" },
    ]

    return (
        <div className="space-y-4">
            {/* Header with Search and Add button */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Cerca per email, nome o matricola..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all font-bold group shadow-lg shadow-zinc-200"
                >
                    <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                    Nuovo Utente
                </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-500 mr-2">
                    <Filter className="size-4" />
                    <span className="text-sm font-bold">Filtri:</span>
                </div>

                <select
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer min-w-[140px]"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">Tutti i Ruoli</option>
                    {rolesList.map(r => (
                        <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                </select>

                <select
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer min-w-[160px]"
                    value={assocFilter}
                    onChange={(e) => setAssocFilter(e.target.value)}
                >
                    <option value="all">Tutte le Associazioni</option>
                    {ASSOCIATIONS.map(assoc => (
                        <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                    ))}
                </select>

                <select
                    className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer max-w-[200px]"
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                >
                    <option value="all">Tutti i Dipartimenti</option>
                    {Object.keys(departmentsData).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                {(roleFilter !== "all" || assocFilter !== "all" || deptFilter !== "all" || search !== "") && (
                    <button
                        onClick={() => {
                            setSearch("")
                            setRoleFilter("all")
                            setAssocFilter("all")
                            setDeptFilter("all")
                        }}
                        className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors ml-auto"
                    >
                        Resetta filtri
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-600 transition-colors group"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Utente
                                        {sortConfig?.key === 'name' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-600 transition-colors group"
                                    onClick={() => handleSort('matricola')}
                                >
                                    <div className="flex items-center gap-1">
                                        Matricola
                                        {sortConfig?.key === 'matricola' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-600 transition-colors group"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center gap-1">
                                        Ruolo
                                        {sortConfig?.key === 'role' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-600 transition-colors group"
                                    onClick={() => handleSort('association')}
                                >
                                    <div className="flex items-center gap-1">
                                        Associazione
                                        {sortConfig?.key === 'association' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-red-600" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
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
                                                    rolesList.find(r => r.id === user.role)?.color
                                                )}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                                disabled={loadingId === user.id}
                                            >
                                                {rolesList.map(r => (
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
                                                {!ASSOCIATIONS.find(a => a.id === user.association) && (
                                                    <option value={user.association}>{user.association}</option>
                                                )}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="p-2 rounded-xl border border-zinc-100 text-zinc-500 hover:text-foreground hover:border-zinc-200 hover:bg-zinc-50 transition-all"
                                                title="Modifica"
                                            >
                                                <Edit2 className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 rounded-xl border border-zinc-100 text-zinc-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                disabled={loadingId === user.id}
                                                title="Elimina"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 p-2 hover:bg-zinc-100 rounded-full transition-colors z-10"
                        >
                            <X className="size-5 text-zinc-400" />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-black text-zinc-900 mb-6">
                                {editingUser ? "Modifica Utente" : "Crea Nuovo Utente"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cognome</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.surname}
                                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                            Password {editingUser && "(lascia vuoto per non cambiare)"}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            placeholder={editingUser ? "••••••••" : ""}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Matricola</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.matricola}
                                            onChange={(e) => setFormData({ ...formData, matricola: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Data di Nascita</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dipartimento</label>
                                        <select
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value, degreeCourse: "" })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            <option value="" disabled>Seleziona Dipartimento...</option>
                                            {Object.keys(departmentsData).map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Corso di Laurea</label>
                                        <select
                                            required
                                            value={formData.degreeCourse}
                                            onChange={(e) => setFormData({ ...formData, degreeCourse: e.target.value })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                                            disabled={!formData.department}
                                        >
                                            <option value="" disabled>Seleziona Corso...</option>
                                            {(() => {
                                                const courses = formData.department ? departmentsData[formData.department] : []
                                                const triennali = courses.filter(c => c.includes("(L-") || c.includes("(L/"))
                                                const magistrali = courses.filter(c => c.includes("(LM-"))
                                                const altri = courses.filter(c => !c.includes("(L-") && !c.includes("(L/") && !c.includes("(LM-"))

                                                return (
                                                    <>
                                                        {triennali.length > 0 && (
                                                            <optgroup label="--- TRIENNALI ---">
                                                                {triennali.map(course => (
                                                                    <option key={course} value={course}>{course}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        {magistrali.length > 0 && (
                                                            <optgroup label="--- MAGISTRALI ---">
                                                                {magistrali.map(course => (
                                                                    <option key={course} value={course}>{course}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        {altri.length > 0 && (
                                                            <optgroup label="--- ALTRI (Ciclo Unico / Master) ---">
                                                                {altri.map(course => (
                                                                    <option key={course} value={course}>{course}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                    </>
                                                )
                                            })()}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ruolo</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            {rolesList.map(r => (
                                                <option key={r.id} value={r.id}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Associazione</label>
                                        <select
                                            value={formData.association}
                                            onChange={(e) => setFormData({ ...formData, association: e.target.value as Association })}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            {ASSOCIATIONS.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-50">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFuorisede}
                                            onChange={(e) => setFormData({ ...formData, isFuorisede: e.target.checked })}
                                            className="size-4 rounded border-zinc-300 text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">Studente Fuorisede</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.newsletter}
                                            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                            className="size-4 rounded border-zinc-300 text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900">Iscritto alla Newsletter</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-8 py-3 bg-zinc-900 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" />
                                                <span>Salvataggio...</span>
                                            </>
                                        ) : (
                                            <span>{editingUser ? "Salva Modifiche" : "Crea Utente"}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
