"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Shield, LogOut, ChevronRight, LayoutDashboard, BarChart3, Users, Newspaper, Calendar, Tag, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarClock } from "./sidebar-clock"

interface NavItem {
    label: string
    href: string
    iconName: string
    exact?: boolean
}

interface NavSection {
    section: string
    items: NavItem[]
}

interface MobileNavProps {
    navigation: NavSection[]
    user: {
        name: string
        surname: string
        role: string
    }
    logoutAction: (formData?: FormData) => Promise<void>
}

export function MobileNav({ navigation, user, logoutAction }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const iconMap: Record<string, any> = {
        LayoutDashboard,
        BarChart3,
        Users,
        Newspaper,
        Calendar,
        Tag,
        User
    }

    // Close menu on navigation
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <div className="lg:hidden">
            {/* Header Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <Shield className="size-6 text-red-500" />
                    <div>
                        <h1 className="font-bold text-sm tracking-wide uppercase text-white leading-none">Admin</h1>
                        <SidebarClock />
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <Menu className="size-6" />
                </button>
            </header>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside className={cn(
                "fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-zinc-900 text-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Drawer Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="size-6 text-red-500" />
                        <h2 className="font-bold text-lg tracking-wide uppercase">Menu</h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                {/* Navigation content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {navigation.map((section) => (
                        <div key={section.section} className="space-y-3">
                            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-2">
                                {section.section}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = item.exact
                                        ? pathname === item.href
                                        : pathname.startsWith(item.href)

                                    const IconComponent = iconMap[item.iconName] || LayoutDashboard

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-3 rounded-2xl transition-all group",
                                                isActive
                                                    ? "bg-zinc-800 text-white"
                                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <IconComponent className={cn(
                                                    "size-5 transition-colors",
                                                    isActive ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-300"
                                                )} />
                                                <span className="font-bold text-sm">{item.label}</span>
                                            </div>
                                            <ChevronRight className={cn(
                                                "size-4 opacity-0 transition-all",
                                                isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0"
                                            )} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer / User Info */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="size-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-sm font-black border border-zinc-700">
                            {user.name.charAt(0)}{user.surname.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black truncate">{user.name} {user.surname}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                                {user.role.replace('_', ' ')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                        >
                            ← Torna all&apos;Area Personale
                        </Link>

                        <form action={async () => {
                            await logoutAction()
                        }}>
                            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 text-xs font-black uppercase tracking-widest transition-all hover:text-white">
                                <LogOut className="size-4" /> Esci dal Pannello
                            </button>
                        </form>
                    </div>
                </div>
            </aside>
        </div>
    )
}
