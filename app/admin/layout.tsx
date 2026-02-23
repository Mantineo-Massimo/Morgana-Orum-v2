import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserDashboardData } from "@/app/actions/users"
import { LayoutDashboard, Users, User, LogOut, Settings, Shield, Newspaper, Calendar, Tag, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth"
import { getAssociationName } from "@/lib/associations"
import { SidebarClock } from "@/components/admin/sidebar-clock"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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
                    icon: LayoutDashboard,
                    exact: true
                },
                {
                    label: "Analytics Sito",
                    href: `/admin/analytics`,
                    icon: BarChart3,
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
                    icon: Users,
                    exact: false
                },
                {
                    label: "Notizie",
                    href: `/admin/news`,
                    icon: Newspaper,
                    exact: false
                },
                {
                    label: "Eventi",
                    href: `/admin/events`,
                    icon: Calendar,
                    exact: false
                },
            ]
        }
    ]

    // Only SUPER_ADMIN sees Conventions and User Management
    if (userRole === "SUPER_ADMIN") {
        navigation.push({
            section: "Amministrazione",
            items: [
                {
                    label: "Convenzioni",
                    href: `/admin/conventions`,
                    icon: Tag,
                    exact: false
                },
                {
                    label: "Utenti",
                    href: `/admin/users`,
                    icon: User,
                    exact: false
                },
            ]
        })
    }

    const isMorgana = true; // TODO: Portale Unificato - Tema neutro o in base all'utente

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row relative" data-admin-area>
            <AdminSidebar
                navigation={navigation}
                user={{
                    name: data.user.name,
                    surname: data.user.surname,
                    role: userRole === "ADMIN_NETWORK" ? "Admin Network" :
                        userRole === "ADMIN_MORGANA" ? "Admin Morgana/Orum" : "Super Admin"
                }}
                logoutAction={async () => {
                    "use server"
                    await logoutAction()
                }}
            />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 lg:p-10 transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
