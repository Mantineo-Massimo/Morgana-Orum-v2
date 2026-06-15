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
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden",
                isActive
                    ? "bg-gradient-to-r from-red-600/10 to-blue-600/5 text-white font-semibold shadow-[0_0_20px_rgba(239,68,68,0.05)] border-l-2 border-red-500 pl-[14px]"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30 pl-4"
            )}
        >
            {/* Glow effect on hover/active */}
            {isActive && (
                <span className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-red-500 to-blue-600" />
            )}
            {children}
        </Link>
    )
}

