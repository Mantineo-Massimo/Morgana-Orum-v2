"use client"

import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Calendar, FileText, Settings, HelpCircle, Bell } from "lucide-react"
import { useTranslations } from "next-intl"

export function DashboardNav() {
    const pathname = usePathname()
    const t = useTranslations("Dashboard")

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

    return (
        <nav className="w-full flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-x-auto scrollbar-none flex-nowrap mb-8">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)

                const Icon = item.icon

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all shrink-0 select-none",
                            isActive
                                ? "bg-primary/5 text-primary shadow-[0_4px_12px_rgba(var(--primary),0.02)] border border-primary/10"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-slate-50 border border-transparent"
                        )}
                    >
                        <Icon className={cn("size-4", isActive ? "text-primary" : "text-zinc-400")} />
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}
