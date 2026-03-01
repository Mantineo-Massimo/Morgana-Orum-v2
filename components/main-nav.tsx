"use client"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { logoutAction } from "@/app/actions/auth"
import { LogOut, User, Menu, X, Mail, Search } from "lucide-react"
import { useBrand } from "@/components/brand-provider"
import { SearchModal } from "./search-modal"
import { useTranslations } from "next-intl"

export function MainNav({
    className,
    isScrolled = true,
    isLoggedIn = false,
    ...props
}: React.HTMLAttributes<HTMLElement> & { isScrolled?: boolean, isLoggedIn?: boolean }) {
    const t = useTranslations("Footer")
    const nt = useTranslations("Navigation")
    const pathname = usePathname()
    const { brand } = useBrand()
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const routes: { href: string; label: string; active: boolean; color?: string }[] = [
        {
            href: brand ? `/network/${brand}` : `/`,
            label: nt("home"),
            active: brand ? pathname === `/network/${brand}` : (pathname === "/" || pathname === ``),
        },
        {
            href: brand ? `/network/${brand}/about` : `/about`,
            label: nt("about"),
            active: pathname === (brand ? `/network/${brand}/about` : "/about"),
        },
        ...(brand !== 'matricole' ? [{
            href: brand ? `/network/${brand}/news` : `/news`,
            label: nt("news"),
            active: pathname === (brand ? `/network/${brand}/news` : "/news") || pathname.startsWith(brand ? `/network/${brand}/news/` : "/news/"),
        }] : []),
        ...(brand !== 'matricole' ? [{
            href: brand ? `/network/${brand}/events` : `/events`,
            label: nt("events"),
            active: pathname === (brand ? `/network/${brand}/events` : "/events") || pathname.startsWith(brand ? `/network/${brand}/events/` : "/events/"),
        }] : []),
        ...(brand !== 'matricole' && brand !== 'piazzadellarte' ? [{
            href: brand ? `/network/${brand}/representatives` : `/representatives`,
            label: nt("representatives"),
            active: pathname === (brand ? `/network/${brand}/representatives` : "/representatives"),
        }] : []),
    ]

    // Aggiungi link extra per Piazza dell'Arte
    if (brand === 'piazzadellarte') {
        routes.splice(1, 4, // Rimuovi About, News (verrà riaggiunto), Events, Representatives
            {
                href: `/network/piazzadellarte/about`,
                label: nt("cose"),
                active: false,
                color: "text-[#27a85d]" // Green
            },
            {
                href: `/network/piazzadellarte#programma`,
                label: nt("programma"),
                active: false,
                color: "text-[#f9a620]" // Yellow
            },
            {
                href: `/network/piazzadellarte#artisti`,
                label: nt("artisti"),
                active: false,
                color: "text-[#27a85d]" // Green
            },
            {
                href: `/network/piazzadellarte#media`,
                label: nt("media"),
                active: false,
                color: "text-[#1fbcd3]" // Cyan
            },
            {
                href: `https://fantapiazza.vercel.app`,
                label: "FantaPiazza",
                active: false,
                color: "text-[#f34ab4]" // Pink/Accent
            }
        )
        // Update Home color too
        routes[0].color = "text-[#f9a620]" // Gold (Home)
    }

    // Aggiungi link extra per Unime Matricole
    if (brand === 'matricole') {
        routes.push(
            {
                href: `/network/matricole/guides`,
                label: nt("guides"),
                active: pathname === `/network/matricole/guides`,
            },
            {
                href: `/network/matricole/whatsapp`,
                label: nt("whatsapp"),
                active: pathname === `/network/matricole/whatsapp`,
            }
        )
    }

    const textColor = isScrolled ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white"
    const activeColor = isScrolled ? "text-primary after:bg-primary" : "text-white after:bg-white"
    const hoverLineColor = isScrolled ? "after:bg-primary" : "after:bg-white"

    // Brand Colors Unificati
    const brandColor = brand === "unimhealth" ? "bg-[#c9041a]" :
        brand === "economia" ? "bg-[#202549]" :
            brand === "matricole" ? "bg-[#f4b716]" :
                brand === "scipog" ? "bg-[#fbc363]" :
                    brand === "dicam" ? "bg-[#f34ab4]" :
                        brand === "piazzadellarte" ? "bg-[#f9a620]" : // Gold instead of Cyan
                            "bg-primary" // Morgana Red default

    return (
        <>
            {/* Desktop Navigation */}
            <nav
                className={cn("hidden lg:flex items-center space-x-4 lg:space-x-2 xl:space-x-4", className)}
                {...props}
            >
                {routes.map((route: any) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                            route.active
                                ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                                : brand === 'piazzadellarte' && route.color
                                    ? `${route.color} hover:opacity-70 after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-current after:transition-all after:duration-300`
                                    : `${textColor} hover:after:w-full after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] ${hoverLineColor} after:transition-all after:duration-300`
                        )}
                    >
                        {route.label}
                    </Link>
                ))}

                {/* Search Icon Trigger - Desktop */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className={cn(
                        "p-1.5 rounded-full transition-all ml-2",
                        isScrolled ? "text-zinc-500 hover:text-primary hover:bg-zinc-100" : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                    title={nt("search_placeholder")}
                >
                    <Search className="size-5" />
                </button>

                {isLoggedIn ? (
                    <div className="flex items-center gap-3 ml-4">
                        <Link
                            href={`/dashboard`}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-white font-bold uppercase tracking-widest text-[10px] xl:text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg max-w-[140px] leading-none text-center min-h-[40px] justify-center",
                                brandColor
                            )}
                        >
                            <User className="size-4 shrink-0" />
                            <span className="flex flex-col justify-center pt-0.5">
                                {nt("reserved_area")}
                            </span>
                        </Link>

                        <button
                            onClick={() => logoutAction()}
                            className="p-1.5 xl:p-2 rounded-full text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                            title={nt("logout")}
                        >
                            <LogOut className="size-5" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`/login`}
                        className={cn(
                            "ml-4 px-6 py-1.5 rounded-full text-white font-bold uppercase tracking-widest text-[10px] xl:text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg max-w-[150px] leading-none text-center flex items-center justify-center min-h-[40px]",
                            brandColor
                        )}
                    >
                        <span className="pt-0.5">{nt("reserved_area")}</span>
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
                            className="p-2 text-foreground rounded-full hover:bg-zinc-100 transition-colors"
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
                                        route.active
                                            ? "text-foreground"
                                            : brand === 'piazzadellarte' && route.color
                                                ? route.color
                                                : "text-zinc-400 hover:text-zinc-600"
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
                                        <User className="size-5" /> {nt("reserved_area")}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            logoutAction();
                                        }}
                                        className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-100 text-zinc-600 hover:text-red-600 font-bold uppercase tracking-widest text-sm transition-colors"
                                    >
                                        <LogOut className="size-5" /> {nt("logout")}
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
                                    {nt("reserved_area")}
                                </Link>
                            )}

                            {/* Mobile only Newsletter CTA */}
                            <div className="pt-6 mt-2 border-t border-zinc-100">
                                <Link
                                    href={`#`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-100 text-foreground font-bold uppercase tracking-widest text-sm transition-colors"
                                >
                                    <Mail className="size-5" /> {t("newsletter_title")}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    )
}