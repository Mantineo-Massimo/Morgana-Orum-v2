"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, FileText, Settings, LogOut, HelpCircle, Bell } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { getAssociationName } from "@/lib/associations"
import { useTranslations } from "next-intl"

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
    const t = useTranslations("Dashboard")
    const isMorgana = true // Same logic as before

    const navItems = [
        {
            label: t("sidebar_overview"),
            href: `/dashboard`,
            icon: LayoutDashboard,
            exact: true
        },
        {
            label: t("sidebar_bookings"),
            href: `/dashboard/events`,
            icon: Calendar,
            exact: false
        },
        {
            label: t("sidebar_documents"),
            href: `/dashboard/documents`,
            icon: FileText,
            exact: false
        },
        {
            label: t("sidebar_support"),
            href: `/dashboard/support`,
            icon: HelpCircle,
            exact: false
        },
        {
            label: t("sidebar_messages"),
            href: `/dashboard/messages`,
            icon: Bell,
            exact: false
        },
        {
            label: t("sidebar_settings"),
            href: `/dashboard/settings`,
            icon: Settings,
            exact: false
        }
    ]

    const userInitials = userData.name.charAt(0)
    const userFullName = `${userData.name} ${userData.surname}`
    const userRoleLabel = userData.role === "USER"
        ? t("sidebar_student")
        : userData.role === "ADMIN_NETWORK"
        ? t("sidebar_admin_network", { association: getAssociationName(userData.association) })
        : userData.role === "ADMIN_MORGANA"
        ? t("sidebar_admin_morgana")
        : t("sidebar_super_admin")

    return (
        <>
            {/* MOBILE HEADER */}
            <div className="md:hidden bg-[#0d0d12] border-b border-zinc-800/60 p-4 sticky top-0 z-30 flex items-center justify-between text-zinc-100">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_10px_rgba(99,102,241,0.25)]">
                        {userInitials}
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-tight text-white">{userFullName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mt-0.5">{userRoleLabel}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className="p-2 text-zinc-400 hover:text-red-400 transition-colors">
                        <LogOut className="size-5" />
                    </button>
                </form>
            </div>

            {/* SIDEBAR NAVIGATION (Desktop) */}
            <aside className="hidden md:flex w-66 bg-[#0d0d12] border-r border-zinc-800/60 flex-shrink-0 h-screen sticky top-0 flex-col z-40 text-zinc-300 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
                <div className="p-6 border-b border-zinc-800/60 flex items-center gap-3 bg-[#0a0a0f]">
                    <div className="size-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_12px_rgba(99,102,241,0.25)]">
                        {userInitials}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white truncate max-w-[140px]">{userFullName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-0.5">{userRoleLabel}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden",
                                    isActive
                                        ? "bg-gradient-to-r from-violet-600/15 to-indigo-600/5 text-white shadow-[0_0_20px_rgba(139,92,246,0.1)] border-l-2 border-violet-500 pl-[14px]"
                                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30 pl-4"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-violet-400 to-indigo-500" />
                                )}
                                <item.icon className={cn(
                                    "size-5 transition-colors text-inherit"
                                )} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800/60 bg-[#07070a]">
                    <form action={logoutAction}>
                        <button type="submit" className="flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full border border-transparent hover:border-red-500/20 transition-all duration-200">
                            <LogOut className="size-4" />
                            {t("sidebar_logout")}
                        </button>
                    </form>
                </div>
            </aside>

            {/* BOTTOM NAVIGATION (Mobile) */}
            <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-zinc-800/60 z-30 flex items-center justify-around p-1 pb-6 shadow-[0_-4px_10px_rgba(0,0,0,0.15)] w-full overflow-hidden text-zinc-400">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 p-1 px-0.5 flex-1 min-w-0 transition-all duration-200",
                                isActive
                                    ? "text-white font-bold"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <item.icon className="size-5 text-inherit" />
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

