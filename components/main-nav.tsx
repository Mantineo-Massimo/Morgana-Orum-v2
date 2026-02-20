"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { logoutAction } from "@/app/actions/auth"
import { LogOut, User, Menu, X, Mail } from "lucide-react"

export function MainNav({
    className,
    isScrolled = true,
    isLoggedIn = false,
    ...props
}: React.HTMLAttributes<HTMLElement> & { isScrolled?: boolean, isLoggedIn?: boolean }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const routes = [
        {
            href: ``,
            label: "Home",
            active: pathname === "/" || pathname === ``,
        },
        {
            href: `/about`,
            label: "Chi Siamo",
            active: pathname === "/about" || pathname === `/about`,
        },
        {
            href: `/news`,
            label: "Notizie",
            active: pathname === "/news" || pathname === `/news`,
        },
        {
            href: `/events`,
            label: "Eventi",
            active: pathname === "/events" || pathname === `/events`,
        },
        {
            href: `/representatives`,
            label: "Rappresentanti",
            active: pathname === "/representatives" || pathname === `/representatives`,
        },
    ]

    const textColor = isScrolled ? "text-muted-foreground hover:text-primary" : "text-white/80 hover:text-white"
    const activeColor = isScrolled ? "text-primary after:bg-primary" : "text-white after:bg-white"
    const hoverLineColor = isScrolled ? "after:bg-primary" : "after:bg-white"
    const brandColor = "bg-zinc-900" // Colore neutro scuro per pulsanti

    return (
        <>
            {/* Desktop Navigation */}
            <nav
                className={cn("hidden lg:flex items-center space-x-8 lg:space-x-10", className)}
                {...props}
            >
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm font-bold uppercase tracking-widest transition-colors relative",
                            route.active
                                ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                                : `${textColor} hover:after:w-full after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] ${hoverLineColor} after:transition-all after:duration-300`
                        )}
                    >
                        {route.label}
                    </Link>
                ))}

                {isLoggedIn ? (
                    <div className="flex items-center gap-3 ml-4">
                        <Link
                            href={`/dashboard`}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg",
                                brandColor
                            )}
                        >
                            <User className="size-4" /> Area Personale
                        </Link>

                        <button
                            onClick={() => logoutAction()}
                            className="p-2 rounded-full text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="size-5" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`/login`}
                        className={cn(
                            "ml-4 px-6 py-2 rounded-full text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg",
                            brandColor
                        )}
                    >
                        Accedi
                    </Link>
                )}
            </nav>

            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden p-2 text-white bg-zinc-900/50 backdrop-blur-md rounded-xl hover:bg-zinc-900/70 transition-all relative z-50 -mr-2 sm:-mr-4"
                onClick={() => setIsOpen(true)}
                aria-label="Open Menu"
            >
                <Menu className="size-8" />
            </button>

            {/* Mobile Fullscreen Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-end p-6 h-20 md:h-24">
                        <button
                            className="p-2 text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Menu"
                        >
                            <X className="size-8" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col justify-center px-8 pb-12">
                        <nav className="flex flex-col space-y-8 text-center">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "text-3xl font-black uppercase tracking-widest transition-colors",
                                        route.active ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
                                    )}
                                >
                                    {route.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-12 flex flex-col gap-4">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href={`/dashboard`}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold uppercase tracking-widest text-sm shadow-xl",
                                            brandColor
                                        )}
                                    >
                                        <User className="size-5" /> Area Personale
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            logoutAction();
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-100 text-zinc-600 hover:text-red-600 font-bold uppercase tracking-widest text-sm transition-colors"
                                    >
                                        <LogOut className="size-5" /> Esci
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href={`/login`}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "w-full py-4 rounded-2xl text-center text-white font-bold uppercase tracking-widest text-sm shadow-xl",
                                        brandColor
                                    )}
                                >
                                    Accedi
                                </Link>
                            )}

                            {/* Mobile only Newsletter CTA */}
                            <div className="pt-6 mt-2 border-t border-zinc-100">
                                <Link
                                    href={`#`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-100 text-zinc-900 font-bold uppercase tracking-widest text-sm transition-colors"
                                >
                                    <Mail className="size-5" /> Newsletter
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}