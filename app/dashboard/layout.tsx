"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, Loader2, HelpCircle } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { useEffect, useState } from "react"
import { getUserDashboardData } from "@/app/actions/users"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const pathname = usePathname()
    // TODO: Gestire i colori base al piano unificato (o in base all'associazione dell'utente dal db)
    const isMorgana = true

    const [userData, setUserData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
        async function loadUser() {
            setLoading(true)
            const data = await getUserDashboardData()
            if (data) {
                setUserData(data.user)
            }
            setLoading(false)
        }
        loadUser()
    }, [])

    const navItems = [
        {
            label: "Panoramica",
            href: `/dashboard`,
            icon: LayoutDashboard,
            exact: true
        },
        {
            label: "I Miei Eventi",
            href: `/dashboard/events`,
            icon: Calendar,
            exact: false
        },
        {
            label: "Documenti",
            href: `/dashboard/documents`,
            icon: FileText,
            exact: false
        },
        {
            label: "Assistenza",
            href: `/dashboard/support`,
            icon: HelpCircle,
            exact: false
        },
        {
            label: "Impostazioni",
            href: `/dashboard/settings`,
            icon: Settings,
            exact: false
        }
    ]

    if (!hasMounted || loading) {
        return <div className="min-h-screen bg-zinc-50 flex items-center justify-center"><Loader2 className="size-8 animate-spin text-zinc-300" /></div>
    }

    if (!userData) {
        return <div className="min-h-screen bg-zinc-50 flex items-center justify-center">Errore nel caricamento del profilo.</div>
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row">
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-white border-r border-zinc-200 flex-shrink-0 md:h-screen sticky top-0 md:flex flex-col z-40">
                <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg",
                        isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
                    )}>
                        {userData.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 text-sm">{userData.name} {userData.surname}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userData.role === "ADMIN" ? "Amministratore" : "Studente"}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? (isMorgana ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-900")
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "size-5 transition-colors",
                                    isActive
                                        ? (isMorgana ? "text-orange-600" : "text-blue-900")
                                        : "text-zinc-400 group-hover:text-zinc-600"
                                )} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-100">
                    <form action={logoutAction}>
                        <button type="submit" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
                            <LogOut className="size-5" />
                            Esci
                        </button>
                    </form>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-6 md:p-10 pb-32 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
