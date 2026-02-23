"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, LogOut, Menu, X, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarClock } from "./sidebar-clock"

interface NavItem {
    label: string
    href: string
    icon: any
    exact?: boolean
}

interface NavSection {
    section: string
    items: NavItem[]
}

interface UserData {
    name: string
    surname: string
    role: string
}

export function AdminSidebar({
    navigation,
    user,
    logoutAction
}: {
    navigation: NavSection[],
    user: UserData,
    logoutAction: () => Promise<void>
}) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    // Breakpoints: desktop is lg (1024px)
    const toggleSidebar = () => setIsOpen(!isOpen)
    const closeSidebar = () => setIsOpen(false)

    // Close sidebar on navigation change
    useEffect(() => {
        closeSidebar()
    }, [pathname])

    const isMorgana = true; // Still hardcoded for now

    return (
        <>
            {/* Mobile Header / Hamburger Row */}
            <div className="lg:hidden sticky top-0 z-50 bg-zinc-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                    <Shield className={cn("size-5", isMorgana ? "text-red-500" : "text-blue-500")} />
                    <span className="font-bold tracking-tight uppercase text-sm">Admin</span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar Shell */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Internal Sidebar Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className={cn("size-6", isMorgana ? "text-red-500" : "text-blue-500")} />
                        <div>
                            <h1 className="font-bold text-lg tracking-wide uppercase">Admin</h1>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Pannello di Controllo</p>
                            <SidebarClock />
                        </div>
                    </div>
                    <button onClick={closeSidebar} className="lg:hidden p-1.5 hover:bg-zinc-800 rounded-lg">
                        <X className="size-5 text-zinc-500" />
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {navigation.map((section) => (
                        <div key={section.section} className="space-y-2">
                            <h2 className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                                {section.section}
                            </h2>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href)

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                                isActive
                                                    ? "bg-zinc-800 text-white shadow-inner"
                                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "size-5 transition-colors",
                                                isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                            )} />
                                            <span className="font-medium text-sm">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-zinc-800 space-y-4 bg-zinc-900/50 backdrop-blur">
                    <Link
                        href={`/dashboard`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all group text-xs font-semibold"
                    >
                        <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
                        Area Personale
                    </Link>

                    <div className="pt-2">
                        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-2xl bg-zinc-800/50 border border-zinc-800 shadow-sm">
                            <div className="size-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold ring-2 ring-zinc-800">
                                {user.name.charAt(0)}{user.surname.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest truncate">
                                    {user.role}
                                </p>
                            </div>
                        </div>

                        <form action={logoutAction}>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest shadow-sm">
                                <LogOut className="size-4" /> Esci
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </>
    )
}
