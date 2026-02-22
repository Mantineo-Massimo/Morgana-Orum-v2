import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserDashboardData } from "@/app/actions/users"
import { LayoutDashboard, Users, User, LogOut, Settings, Shield, Newspaper, Calendar, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth"

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

    const navItems = [
        {
            label: "Dashboard",
            href: `/admin`,
            icon: LayoutDashboard,
            exact: true
        },
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
        {
            label: "Convenzioni",
            href: `/admin/conventions`,
            icon: Tag,
            exact: false
        },
    ]

    // Only SUPER_ADMIN sees User Management
    if (userRole === "SUPER_ADMIN") {
        navItems.push({
            label: "Utenti",
            href: `/admin/users`,
            icon: User,
            exact: false
        })
    }

    const isMorgana = true; // TODO: Portale Unificato - Tema neutro o in base all'utente

    return (
        <div className="min-h-screen bg-zinc-50 flex" data-admin-area>
            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-zinc-900 text-white flex flex-col sticky top-0 max-h-screen overflow-y-auto z-40">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <Shield className={cn("size-6", isMorgana ? "text-red-500" : "text-blue-500")} />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide">ADMIN</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Pannello di Controllo</p>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group"
                        >
                            <item.icon className={cn(
                                "size-5 group-hover:text-white transition-colors",
                                "text-zinc-500"
                            )} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <Link
                        href={`/dashboard`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all group text-xs font-medium"
                    >
                        ← Area Personale
                    </Link>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="size-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                            {data.user.name.charAt(0)}{data.user.surname.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{data.user.name}</p>
                            <p className="text-[10px] text-zinc-500 uppercase">
                                {userRole === "ADMIN_NETWORK" ? `Admin ${data.user.association}` :
                                    userRole === "ADMIN_MORGANA" ? "Admin Morgana/Orum" : "Super Admin"}
                            </p>
                        </div>
                    </div>
                    <form action={async () => {
                        "use server"
                        await logoutAction()
                    }}>
                        <button className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold uppercase tracking-widest">
                            <LogOut className="size-4" /> Esci
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
