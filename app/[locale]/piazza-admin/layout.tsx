import { redirect } from "next/navigation"
import Link from "next/link"
import { getUserDashboardData } from "@/app/actions/users"
import { Sparkles, Users, Calendar, Video, Settings, LogOut, Shield, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/app/actions/auth"
import { SidebarClock } from "@/components/admin/sidebar-clock"

export const dynamic = 'force-dynamic'

export default async function PiazzaAdminLayout({
    children
}: {
    children: React.ReactNode
}) {
    const data = await getUserDashboardData()
    const userRole = data?.user.role

    // Access restricted to ADMIN_MORGANA, ADMIN_NETWORK, or SUPER_ADMIN
    if (!data || userRole === "USER") {
        redirect(`/login`)
    }

    const navigation = [
        {
            label: "Dashboard",
            href: `/piazza-admin`,
            icon: Sparkles
        },
        {
            label: "Artisti",
            href: `/piazza-admin/artists`,
            icon: Users
        },
        {
            label: "Programma",
            href: `/piazza-admin/program`,
            icon: Calendar
        },
        {
            label: "Media & Video",
            href: `/piazza-admin/media`,
            icon: Video
        },
        {
            label: "Impostazioni",
            href: `/piazza-admin/settings`,
            icon: Settings
        }
    ]

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row" data-admin-area>
            {/* Desktop Sidebar */}
            <aside className="w-64 shrink-0 bg-[#0f172a] text-white hidden lg:flex flex-col sticky top-0 max-h-screen overflow-y-auto z-40">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <Shield className="size-6 text-[#f9a620]" />
                    <div>
                        <h1 className="font-bold text-lg tracking-wide uppercase text-[#f9a620]">Piazza Admin</h1>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Control Center</p>
                        <SidebarClock />
                    </div>
                </div>

                {/* Back to Personal Area - MOVED ABOVE NAV as requested */}
                <div className="p-4 border-b border-zinc-800/50">
                    <Link
                        href={`/dashboard`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-[#f9a620] hover:bg-white/5 transition-all group text-xs font-bold uppercase tracking-widest"
                    >
                        ← Area Personale
                    </Link>
                </div>

                <div className="flex-1 py-6 px-4 space-y-8">
                    <div className="space-y-2">
                        <h2 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                            Gestione Evento
                        </h2>
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
                                    >
                                        <Icon className="size-5 text-[#f9a620]/70 group-hover:text-[#f9a620] transition-colors" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="size-8 rounded-full bg-[#f9a620] flex items-center justify-center text-[#0f172a] text-xs font-bold">
                            {(data?.user?.name || "A").charAt(0)}{(data?.user?.surname || "").charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{data?.user?.name || "Admin"}</p>
                            <p className="text-[10px] text-[#f9a620] uppercase font-bold tracking-tighter">
                                Event Manager
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

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 mt-16 lg:mt-0">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
