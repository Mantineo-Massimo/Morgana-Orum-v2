"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, HelpCircle, Bell } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { getAssociationName } from "@/lib/associations"

interface DashboardSidebarProps {
    userData: {
        name: string
        surname: string
        role: string
        association: any
    }
}

export function DashboardSidebar({ userData }: DashboardSidebarProps) {
    const pathname = usePathname()
    const isMorgana = true // Same logic as before

    const navItems = [
        {
            label: "Panoramica",
            href: `/dashboard`,
            icon: LayoutDashboard,
            exact: true
        },
        {
            label: "Prenotazioni",
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
            label: "Messaggi",
            href: `/dashboard/messages`,
            icon: Bell,
            exact: false
        },
        {
            label: "Impostazioni",
            href: `/dashboard/settings`,
            icon: Settings,
            exact: false
        }
    ]

    const userInitials = userData.name.charAt(0)
    const userFullName = `${userData.name} ${userData.surname}`
    const userRoleLabel = userData.role === "USER" ? "Studente" :
        userData.role === "ADMIN_NETWORK" ? `Admin ${getAssociationName(userData.association)}` :
            userData.role === "ADMIN_MORGANA" ? "Admin Morgana/Orum" : "Super Admin"

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="md:hidden bg-white border-b border-zinc-200 p-4 sticky top-0 z-30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg",
                        isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
                    )}>
                        {userInitials}
                    </div>
                    <div>
                        <p className="font-bold text-foreground text-sm leading-tight">{userFullName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userRoleLabel}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className="p-2 text-zinc-400 hover:text-red-600 transition-colors">
                        <LogOut className="size-5" />
                    </button>
                </form>
            </div>

            {/* SIDEBAR NAVIGATION (Desktop) */}
            <aside className="hidden md:flex w-64 bg-white border-r border-zinc-200 flex-shrink-0 h-screen sticky top-0 flex-col z-40">
                <div className="p-6 border-b border-zinc-100 flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg",
                        isMorgana ? "bg-[#c12830]" : "bg-[#18182e]"
                    )}>
                        {userInitials}
                    </div>
                    <div>
                        <p className="font-bold text-foreground text-sm">{userFullName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{userRoleLabel}</p>
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
                                        ? (isMorgana ? "bg-[#18182e]/50 text-white" : "bg-blue-50 text-blue-900")
                                        : "text-zinc-500 hover:bg-zinc-50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "size-5 transition-colors",
                                    isActive
                                        ? (isMorgana ? "text-white" : "text-blue-900")
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

            {/* BOTTOM NAVIGATION (Mobile) */}
            <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 z-30 flex items-center justify-around p-1 pb-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] w-full overflow-hidden">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 p-1 px-0.5 flex-1 min-w-0 transition-all",
                                isActive
                                    ? (isMorgana ? "text-foreground font-black" : "text-blue-900")
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <item.icon className={cn(
                                "size-5",
                                isActive
                                    ? (isMorgana ? "text-foreground" : "text-blue-900")
                                    : ""
                            )} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full text-center">
                                {item.label.split(' ')[0]}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
