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
    consenso_marketing_orum?: boolean
    consenso_marketing_morgana?: boolean
    accettazione_termini_condivisi?: boolean
}

import { useTranslations } from "next-intl"

export default function UsersAdminClient({ initialUsers }: { initialUsers: UserItem[] }) {
    const tAdmin = useTranslations("AdminUsers")
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
        consenso_marketing_orum: false,
        consenso_marketing_morgana: false,
        accettazione_termini_condivisi: false,
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
                consenso_marketing_orum: user.consenso_marketing_orum || false,
                consenso_marketing_morgana: user.consenso_marketing_morgana || false,
                accettazione_termini_condivisi: user.accettazione_termini_condivisi || false,
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
                consenso_marketing_orum: false,
                consenso_marketing_morgana: false,
                accettazione_termini_condivisi: false,
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
        { id: "USER", label: "Utente", icon: User, color: "bg-slate-100 text-slate-600 border border-slate-200/40" },
        { id: "ADMIN_NETWORK", label: "Admin Network", icon: Globe, color: "bg-blue-50 text-blue-600 border border-blue-100" },
        { id: "ADMIN_MORGANA", label: "Admin Morgana/Orum", icon: Crown, color: "bg-red-50 text-red-600 border border-red-100" },
        { id: "SUPER_ADMIN", label: "Super Admin", icon: Shield, color: "bg-purple-50 text-purple-600 border border-purple-100" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <User className="size-6" />
                        </div>
                        Gestione Utenti
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium font-sans">
                        Visualizza e gestisci tutti gli utenti iscritti, i loro ruoli e le loro associazioni di appartenenza.
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white text-sm font-bold hover:opacity-90 transition-all rounded-xl shadow-sm group"
                >
                    <Plus className="size-4 group-hover:rotate-90 transition-transform" />
                    Nuovo Utente
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cerca per email, nome o matricola..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-slate-400 mr-2 text-xs font-black uppercase tracking-wider">
                        <Filter className="size-4" />
                        <span>Filtri:</span>
                    </div>

                    <select
                        className="px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 outline-none transition-all cursor-pointer min-w-[140px] font-semibold text-slate-700"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">Tutti i Ruoli</option>
                        {rolesList.map(r => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 outline-none transition-all cursor-pointer min-w-[160px] font-semibold text-slate-700"
                        value={assocFilter}
                        onChange={(e) => setAssocFilter(e.target.value)}
                    >
                        <option value="all">Tutte le Associazioni</option>
                        {ASSOCIATIONS.map(assoc => (
                            <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 bg-slate-50/50 border border-slate-200/60 rounded-xl text-sm focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 outline-none transition-all cursor-pointer max-w-[200px] font-semibold text-slate-700"
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
                            className="text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest ml-auto"
                        >
                            Resetta
                        </button>
                    )}
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th
                                    className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors group"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-1">
                                        Utente
                                        {sortConfig?.key === 'name' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-[#c9041a]" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors group"
                                    onClick={() => handleSort('matricola')}
                                >
                                    <div className="flex items-center gap-1">
                                        Matricola
                                        {sortConfig?.key === 'matricola' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-[#c9041a]" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors group"
                                    onClick={() => handleSort('role')}
                                >
                                    <div className="flex items-center gap-1">
                                        Ruolo
                                        {sortConfig?.key === 'role' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-[#c9041a]" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors group"
                                    onClick={() => handleSort('association')}
                                >
                                    <div className="flex items-center gap-1">
                                        Associazione
                                        {sortConfig?.key === 'association' ? (
                                            sortConfig.direction === 'asc' ? <ArrowUp className="size-3 text-[#c9041a]" /> : <ArrowDown className="size-3 text-blue-600" />
                                        ) : (
                                            <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-slate-900 capitalize">{user.name} {user.surname}</p>
                                            <p className="text-xs text-slate-500 font-medium font-sans">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-600 border border-slate-200/40">
                                            {user.matricola}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                className={cn(
                                                    "text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-[#c9041a]/10 cursor-pointer appearance-none text-center min-w-[140px] shadow-sm transition-all",
                                                    rolesList.find(r => r.id === user.role)?.color
                                                )}
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                                disabled={loadingId === user.id}
                                            >
                                                {rolesList.map(r => (
                                                    <option key={r.id} value={r.id} className="text-sm font-semibold normal-case tracking-normal text-slate-800 bg-white">{r.label}</option>
                                                ))}
                                            </select>
                                            {loadingId === user.id && <Loader2 className="size-3 animate-spin text-slate-400" />}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="text-xs font-semibold bg-slate-50/50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 disabled:opacity-50 text-slate-700 cursor-pointer"
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
                                                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all"
                                                title="Modifica"
                                            >
                                                <Edit2 className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 space-y-6 my-auto animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10 text-slate-400 hover:text-slate-600"
                        >
                            <X className="size-5" />
                        </button>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6">
                                {editingUser ? "Modifica Utente" : "Crea Nuovo Utente"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Nome</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Cognome</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.surname}
                                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                                            Password {editingUser && "(lascia vuoto per non cambiare)"}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            placeholder={editingUser ? "••••••••" : ""}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Matricola</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.matricola}
                                            onChange={(e) => setFormData({ ...formData, matricola: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Data di Nascita</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Dipartimento</label>
                                        <select
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value, degreeCourse: "" })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                        >
                                            <option value="" disabled>Seleziona Dipartimento...</option>
                                            {Object.keys(departmentsData).map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Corso di Laurea</label>
                                        <select
                                            required
                                            value={formData.degreeCourse}
                                            onChange={(e) => setFormData({ ...formData, degreeCourse: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 disabled:opacity-50 cursor-pointer"
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
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Ruolo</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                        >
                                            {rolesList.map(r => (
                                                <option key={r.id} value={r.id}>{r.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Associazione</label>
                                        <select
                                            value={formData.association}
                                            onChange={(e) => setFormData({ ...formData, association: e.target.value as Association })}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all text-slate-800 cursor-pointer"
                                        >
                                            {ASSOCIATIONS.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFuorisede}
                                            onChange={(e) => setFormData({ ...formData, isFuorisede: e.target.checked })}
                                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/10 focus:ring-offset-0 transition-colors cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors select-none">Studente Fuorisede</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.newsletter}
                                            onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/10 focus:ring-offset-0 transition-colors cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors select-none">{tAdmin("newsletter")}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.consenso_marketing_orum}
                                            onChange={(e) => setFormData({ ...formData, consenso_marketing_orum: e.target.checked })}
                                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/10 focus:ring-offset-0 transition-colors cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors select-none">{tAdmin("mktg_orum")}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.consenso_marketing_morgana}
                                            onChange={(e) => setFormData({ ...formData, consenso_marketing_morgana: e.target.checked })}
                                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/10 focus:ring-offset-0 transition-colors cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors select-none">{tAdmin("mktg_morgana")}</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.accettazione_termini_condivisi}
                                            onChange={(e) => setFormData({ ...formData, accettazione_termini_condivisi: e.target.checked })}
                                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/10 focus:ring-offset-0 transition-colors cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors select-none">{tAdmin("privacy_ok")}</span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors text-sm"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="px-8 py-3 bg-gradient-to-br from-[#c12830] to-[#18182e] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 text-sm shadow-sm"
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
