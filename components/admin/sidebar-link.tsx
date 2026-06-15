"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarLinkProps {
    href: string
    exact?: boolean
    children: React.ReactNode
}

export function SidebarLink({ href, exact, children }: SidebarLinkProps) {
    const pathname = usePathname()
    const isActive = exact
        ? pathname === href
        : pathname.startsWith(href)

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                isActive
                    ? "bg-zinc-800 text-white font-bold border-l-4 border-red-500 rounded-l-none pl-3 shadow-inner"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
        >
            {children}
        </Link>
    )
}
