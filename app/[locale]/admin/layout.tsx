import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserDashboardData } from "@/app/actions/users"
import { LayoutDashboard, Users, User, LogOut, Settings, Shield, Newspaper, Calendar, Tag, BarChart3, Sparkles, BookOpen, Phone, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth"
import { getAssociationName } from "@/lib/associations"
import { SidebarClock } from "@/components/admin/sidebar-clock"

import { MobileNav } from "@/components/admin/mobile-nav"
import { SidebarLink } from "@/components/admin/sidebar-link"

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: { brand: string }
}) {

    const data = await getUserDashboardData()
    const userRole = data?.user.role

    // 1. Auth & Role Check - Any admin role is allowed in admin area
    if (!data || userRole === "USER") {
        redirect(`/login`)
    }

    const navigation = [
        {
            section: "Panoramica",
            items: [
                {
                    label: "Dashboard",
                    href: `/admin`,
                    iconName: "LayoutDashboard",
                    exact: true
                },
                {
                    label: "Analytics Sito",
                    href: `/admin/analytics`,
                    iconName: "BarChart3",
                    exact: false
                },
            ]
        },
        {
            section: "Gestione Contenuti",
            items: [
                {
                    label: "Rappresentanti",
                    href: `/admin/representatives`,
                    iconName: "Users",
                    exact: false
                },
                {
                    label: "Servizi",
                    href: `/admin/services`,
                    iconName: "BookOpen",
                    exact: false
                },
                {
                    label: "Organigramma",
                    href: `/admin/organigramma`,
                    iconName: "Shield",
                    exact: false
                },
                {
                    label: "Gruppi WhatsApp",
                    href: `/admin/whatsapp-groups`,
                    iconName: "Phone",
                    exact: false
                },
                {
                    label: "Guide",
                    href: `/admin/guides`,
                    iconName: "Compass",
                    exact: false
                },
                {
                    label: "Notizie",
                    href: `/admin/news`,
                    iconName: "Newspaper",
                    exact: false
                },
                {
                    label: "Eventi",
                    href: `/admin/events`,
                    iconName: "Calendar",
                    exact: false
                },
            ]
        },
    ]

    // Only SUPER_ADMIN sees Conventions and User Management
    if (userRole === "SUPER_ADMIN") {
        navigation.push({
            section: "Amministrazione",
            items: [
                {
                    label: "Convenzioni",
                    href: `/admin/conventions`,
                    iconName: "Tag",
                    exact: false
                },
                {
                    label: "Utenti",
                    href: `/admin/users`,
                    iconName: "User",
                    exact: false
                },
            ]
        })
    }

    const isMorgana = true; // TODO: Portale Unificato - Tema neutro o in base all'utente

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row" data-admin-area>
            {/* Mobile Navigation Header & Drawer */}
            <MobileNav
                navigation={navigation}
                user={{
                    name: data?.user?.name || "Admin",
                    surname: data?.user?.surname || "",
                    role: userRole || "ADMIN"
                }}
                logoutAction={logoutAction}
            />

            {/* Desktop Sidebar */}
            <aside className="w-66 shrink-0 bg-[#0d0d12] border-r border-zinc-800/60 text-zinc-300 hidden lg:flex flex-col sticky top-0 h-screen z-40 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
                <div className="p-6 border-b border-zinc-800/60 flex items-center gap-3 bg-[#0a0a0f]">
                    <div className="size-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.25)]">
                        <Shield className="size-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-black text-sm tracking-widest text-white uppercase">Morgana</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Control Panel</p>
                        <SidebarClock />
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                    {navigation.map((section) => (
                        <div key={section.section} className="space-y-2.5">
                            <h2 className="px-4 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                                {section.section}
                            </h2>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                     const IconComponent = ({
                                         LayoutDashboard: LayoutDashboard,
                                         BarChart3: BarChart3,
                                         Users: Users,
                                         Newspaper: Newspaper,
                                         Calendar: Calendar,
                                         Tag: Tag,
                                         User: User,
                                         Sparkles: Sparkles,
                                         Shield: Shield,
                                         BookOpen: BookOpen,
                                         Phone: Phone,
                                         Compass: Compass
                                     } as Record<string, any>)[item.iconName] || LayoutDashboard

                                    return (
                                        <SidebarLink
                                            key={item.href}
                                            href={item.href}
                                            exact={item.exact}
                                        >
                                            <IconComponent className="size-[18px] transition-colors text-inherit" />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </SidebarLink>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-zinc-800/60 space-y-1 bg-[#09090d]/40">
                    <Link
                        href={`/piazza-admin`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-[#f9a620] hover:bg-zinc-800/30 transition-all group text-xs font-bold uppercase tracking-widest"
                    >
                        <Sparkles className="size-4 text-[#f9a620] animate-pulse" />
                        Piazza dell&apos;Arte
                    </Link>
                    <Link
                        href={`/dashboard`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20 transition-all group text-xs font-semibold"
                    >
                        ← Area Personale
                    </Link>
                </div>

                <div className="p-4 border-t border-zinc-800/60 bg-[#07070a]">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/40">
                        <div className="size-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                            {(data?.user?.name || "A").charAt(0)}{(data?.user?.surname || "").charAt(0)}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-xs font-bold text-zinc-200 truncate">{data?.user?.name || "Admin"} {data?.user?.surname || ""}</p>
                            <p className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5">
                                {userRole === "SUPER_ADMIN" ? "Super Admin" :
                                 userRole === "ADMIN_NETWORK" ? "Admin Network" : "Admin Morgana/Orum"}
                            </p>
                        </div>
                    </div>
                    <form action={async () => {
                        "use server"
                        await logoutAction()
                    }} className="mt-2.5">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-widest border border-transparent hover:border-red-500/20">
                            <LogOut className="size-3.5" /> Esci
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 mt-16 lg:mt-0 overflow-y-auto max-h-screen">
                {children}
            </main>
        </div>
    )
}
