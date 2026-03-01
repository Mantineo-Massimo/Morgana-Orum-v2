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
        <div className="min-h-screen bg-[#0a0f1c] text-zinc-100 flex flex-col lg:flex-row">
            {/* Desktop Sidebar */}
            <aside className="w-72 shrink-0 bg-[#0f172a] border-r border-zinc-800 hidden lg:flex flex-col sticky top-0 max-h-screen z-40">
                <div className="p-8 border-b border-zinc-800 flex flex-col items-center text-center">
                    <div className="size-20 rounded-2xl bg-[#f9a620] flex items-center justify-center mb-4 shadow-lg shadow-[#f9a620]/20">
                        <Shield className="size-10 text-[#0f172a]" />
                    </div>
                    <h1 className="font-serif font-black text-xl tracking-tighter uppercase text-[#f9a620]">
                        Piazza Admin
                    </h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Control Center</p>
                    <div className="mt-4 opacity-70">
                        <SidebarClock />
                    </div>
                </div>

                <div className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-5 py-3.5 rounded-2xl text-zinc-400 hover:text-[#f9a620] hover:bg-[#f9a620]/5 transition-all group border border-transparent hover:border-[#f9a620]/20"
                            >
                                <Icon className="size-5 transition-colors" />
                                <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="p-6 border-t border-zinc-800 bg-[#0a0f1c]/50">
                    <Link
                        href={`/network/piazzadellarte`}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft className="size-4" /> Torna al Sito
                    </Link>

                    <div className="mt-6 flex items-center gap-3 px-2">
                        <div className="size-10 rounded-full bg-[#f9a620] flex items-center justify-center text-[#0f172a] font-bold">
                            {(data?.user?.name || "A").charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate text-zinc-200">{data?.user?.name || "Admin"}</p>
                            <p className="text-[10px] text-[#f9a620] uppercase font-bold tracking-tighter">Event Manager</p>
                        </div>
                    </div>

                    <form action={async () => {
                        "use server"
                        await logoutAction()
                    }} className="mt-4">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
                            <LogOut className="size-4" /> Esci
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
