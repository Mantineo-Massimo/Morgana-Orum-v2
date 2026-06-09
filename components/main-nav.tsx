"use client"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { logoutAction } from "@/app/actions/auth"
import { 
    LogOut, User, Menu, X, Mail, Search, Calendar, ChevronDown, 
    BookOpen, Users, Phone, Tag, Share2, FileDown, HelpCircle 
} from "lucide-react"
import { useBrand } from "@/components/brand-provider"
import { SearchModal } from "./search-modal"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"

export function MainNav({
    className,
    isScrolled = true,
    isLoggedIn = false,
    ...props
}: React.HTMLAttributes<HTMLElement> & { isScrolled?: boolean; isLoggedIn?: boolean }) {
    const t = useTranslations("Footer")
    const nt = useTranslations("Navigation")
    const pathname = usePathname()
    const { brand } = useBrand()
    const [isOpen, setIsOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    // Dropdown States
    const [isAssocOpen, setIsAssocOpen] = useState(false)
    const [isServiziOpen, setIsServiziOpen] = useState(false)

    // Mobile Collapsible States
    const [isAssocMobileOpen, setIsAssocMobileOpen] = useState(false)
    const [isServiziMobileOpen, setIsServiziMobileOpen] = useState(false)

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
            href: brand === 'piazzadellarte' ? '/piazzadellarte' : brand ? `/network/${brand}` : `/`,
            label: nt("home"),
            active: brand === 'piazzadellarte' ? pathname === '/piazzadellarte' : brand ? pathname === `/network/${brand}` : (pathname === "/" || pathname === ``),
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
    ]

    // Aggiungi link extra per Piazza dell'Arte
    if (brand === 'piazzadellarte') {
        routes.splice(1, 4, 
            {
                href: `/piazzadellarte/about`,
                label: nt("cose"),
                active: pathname === `/piazzadellarte/about`,
                color: "text-[#27a85d]" // Green
            },
            {
                href: `/piazzadellarte/programma`,
                label: nt("programma"),
                active: pathname === `/piazzadellarte/programma`,
                color: "text-[#f9a620]" // Gold
            },
            {
                href: `/piazzadellarte/artisti`,
                label: nt("artisti"),
                active: pathname === `/piazzadellarte/artisti`,
                color: "text-[#1fbcd3]" // Cyan
            },
            {
                href: `/piazzadellarte/media`,
                label: nt("media"),
                active: pathname === `/piazzadellarte/media`,
                color: "text-[#27a85d]" // Green
            },
            {
                href: `https://fantapiazza.vercel.app`,
                label: "FantArte",
                active: false,
                color: "text-[#f9a620]" // Gold
            }
        )
        routes[0].color = "text-[#1fbcd3]" // Cyan (Home)
    }

    const textColor = isScrolled ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white"
    const activeColor = isScrolled ? "text-primary after:bg-primary" : "text-white after:bg-white"
    const hoverLineColor = isScrolled ? "after:bg-primary" : "after:bg-white"

    const brandColor = brand === "piazzadellarte" ? "bg-[#f9a620]" : "bg-primary"

    return (
        <>
            {/* Desktop Navigation */}
            <nav
                className={cn("hidden lg:flex items-center space-x-6 xl:space-x-8", className)}
                {...props}
            >
                {/* Home Link */}
                <Link
                    href={brand === 'piazzadellarte' ? '/piazzadellarte' : `/`}
                    className={cn(
                        "text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap pb-1",
                        (brand === 'piazzadellarte' ? pathname === '/piazzadellarte' : (pathname === "/" || pathname === ``))
                            ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                            : `${textColor} hover:after:w-full after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] ${hoverLineColor} after:transition-all after:duration-300`
                    )}
                >
                    {nt("home")}
                </Link>

                {brand === 'piazzadellarte' ? (
                    // Piazza dell'Arte Custom Flat Links
                    <>
                        {routes.slice(1).map((route: any) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap pb-1",
                                    route.active
                                        ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                                        : route.color
                                            ? `${route.color} hover:opacity-70 after:absolute after:bottom-[-4px] after:left-0 after:w-0 hover:after:w-full after:h-[2px] after:bg-current after:transition-all after:duration-300`
                                            : `${textColor} hover:after:w-full after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] ${hoverLineColor} after:transition-all after:duration-300`
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </>
                ) : (
                    // Main Site Dropdowns
                    <>
                        {/* Le Associazioni Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsAssocOpen(true)}
                            onMouseLeave={() => setIsAssocOpen(false)}
                        >
                            <button
                                className={cn(
                                    "text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-1 pb-1",
                                    (pathname.startsWith("/about") || pathname.startsWith("/organigramma") || pathname.startsWith("/contact"))
                                        ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                                        : `${textColor}`
                                )}
                            >
                                Le Associazioni <ChevronDown className="size-4 transition-transform duration-300" style={{ transform: isAssocOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </button>
                            <AnimatePresence>
                                {isAssocOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-100 p-3 z-50 flex flex-col gap-1 text-left"
                                    >
                                        <Link
                                            href="/about"
                                            onClick={() => setIsAssocOpen(false)}
                                            className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors"
                                        >
                                            <span className="text-xs font-black uppercase tracking-wider text-zinc-800">Chi Siamo</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">Storia, presentazione e valori</span>
                                        </Link>
                                        <Link
                                            href="/organigramma"
                                            onClick={() => setIsAssocOpen(false)}
                                            className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors"
                                        >
                                            <span className="text-xs font-black uppercase tracking-wider text-zinc-800">Organigramma</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">I componenti e la struttura</span>
                                        </Link>
                                        <Link
                                            href="/contact"
                                            onClick={() => setIsAssocOpen(false)}
                                            className="flex flex-col p-3 rounded-xl hover:bg-zinc-50 transition-colors"
                                        >
                                            <span className="text-xs font-black uppercase tracking-wider text-zinc-800">Contattaci</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">Form di contatto e info sedi</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Servizi Mega Menu */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsServiziOpen(true)}
                            onMouseLeave={() => setIsServiziOpen(false)}
                        >
                            <button
                                className={cn(
                                    "text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap flex items-center gap-1 pb-1",
                                    (pathname.startsWith("/representatives") || pathname.startsWith("/gruppi") || pathname.startsWith("/guide") || pathname.startsWith("/faq") || pathname.startsWith("/events") || pathname.startsWith("/convenzioni") || pathname.startsWith("/social") || pathname.startsWith("/media-kit"))
                                        ? `${activeColor} after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px]`
                                        : `${textColor}`
                                )}
                            >
                                Servizi <ChevronDown className="size-4 transition-transform duration-300" style={{ transform: isServiziOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                            </button>
                            <AnimatePresence>
                                {isServiziOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-[650px] bg-white rounded-3xl shadow-2xl border border-zinc-100 p-6 grid grid-cols-2 gap-6 z-50 text-left"
                                    >
                                        {/* Column 1: Vita Accademica */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">
                                                Vita Accademica
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                <Link 
                                                    href="/representatives" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Users className="size-4 mt-1 text-[#c9041a] shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Rappresentanti</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">La squadra eletta nei dipartimenti</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/gruppi" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Phone className="size-4 mt-1 text-green-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Gruppi</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Link diretti alle community WhatsApp</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/guide" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <BookOpen className="size-4 mt-1 text-blue-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Guide</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Materiale utile e burocrazia</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/faq" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <HelpCircle className="size-4 mt-1 text-purple-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">FAQ</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Domande frequenti e risposte rapide</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Column 2: Community & Extra */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">
                                                Community & Extra
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                <Link 
                                                    href="/events" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Calendar className="size-4 mt-1 text-[#f9a620] shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Le Nostre Iniziative</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Piazza dell&apos;Arte, seminari e progetti</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/convenzioni" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Tag className="size-4 mt-1 text-rose-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Convenzioni</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Sconti e vantaggi per gli studenti</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/social" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <Share2 className="size-4 mt-1 text-cyan-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Social</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Collegamenti rapidi alle community</span>
                                                    </div>
                                                </Link>
                                                <Link 
                                                    href="/media-kit" 
                                                    onClick={() => setIsServiziOpen(false)}
                                                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 transition-colors"
                                                >
                                                    <FileDown className="size-4 mt-1 text-emerald-500 shrink-0" />
                                                    <div>
                                                        <span className="text-xs font-black uppercase tracking-wider text-zinc-800 block">Media Kit</span>
                                                        <span className="text-[10px] text-zinc-400 font-medium leading-none">Loghi e grafiche ufficiali</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}

                {/* Search Icon Trigger - Desktop */}
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className={cn(
                        "p-1.5 rounded-full transition-all ml-2",
                        isScrolled ? "text-zinc-500 hover:text-primary hover:bg-zinc-100" : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                    aria-label={nt("search_placeholder")}
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
                            aria-label={nt("logout")}
                            title={nt("logout")}
                        >
                            <LogOut className="size-5" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 ml-4">
                        <Link
                            href={`/login`}
                            className={cn(
                                "px-6 py-1.5 rounded-full text-white font-bold uppercase tracking-widest text-[10px] xl:text-xs transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg max-w-[150px] leading-none text-center flex items-center justify-center min-h-[40px]",
                                brandColor
                            )}
                        >
                            <span className="pt-0.5">{nt("reserved_area")}</span>
                        </Link>
                    </div>
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
                <div className="fixed inset-0 z-[100] bg-white flex flex-col lg:hidden animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
                    <div className="flex items-center justify-end p-6 h-20 md:h-24">
                        <button
                            className="p-2 text-foreground rounded-full hover:bg-zinc-100 transition-colors"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Menu"
                        >
                            <X className="size-8" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col px-8 pb-12">
                        <nav className="flex flex-col space-y-5 text-center my-auto">
                            {/* Home */}
                            <Link
                                href={brand === 'piazzadellarte' ? '/piazzadellarte' : `/`}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-2xl font-black uppercase tracking-widest transition-colors",
                                    (brand === 'piazzadellarte' ? pathname === '/piazzadellarte' : (pathname === "/" || pathname === ``))
                                        ? "text-foreground"
                                        : "text-zinc-400 hover:text-zinc-600"
                                )}
                            >
                                {nt("home")}
                            </Link>

                            {brand === 'piazzadellarte' ? (
                                // Piazza Mobile Menu
                                <>
                                    {routes.slice(1).map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "text-2xl font-black uppercase tracking-widest transition-colors",
                                                route.active
                                                    ? "text-foreground"
                                                    : route.color ? route.color : "text-zinc-400 hover:text-zinc-600"
                                            )}
                                        >
                                            {route.label}
                                        </Link>
                                    ))}
                                </>
                            ) : (
                                // Main Site Mobile Menu
                                <>
                                    {/* Le Associazioni Mobile Accordion */}
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={() => setIsAssocMobileOpen(!isAssocMobileOpen)}
                                            className="text-2xl font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1 justify-center"
                                        >
                                            Le Associazioni 
                                            <ChevronDown className="size-5 transition-transform duration-300" style={{ transform: isAssocMobileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                        </button>
                                        <AnimatePresence>
                                            {isAssocMobileOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden flex flex-col gap-3 mt-3 bg-zinc-50 w-full py-4 rounded-2xl border border-zinc-100"
                                                >
                                                    <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Chi Siamo</Link>
                                                    <Link href="/organigramma" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Organigramma</Link>
                                                    <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Contattaci</Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Servizi Mobile Accordion */}
                                    <div className="flex flex-col items-center">
                                        <button
                                            onClick={() => setIsServiziMobileOpen(!isServiziMobileOpen)}
                                            className="text-2xl font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1 justify-center"
                                        >
                                            Servizi 
                                            <ChevronDown className="size-5 transition-transform duration-300" style={{ transform: isServiziMobileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                        </button>
                                        <AnimatePresence>
                                            {isServiziMobileOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden flex flex-col gap-3 mt-3 bg-zinc-50 w-full py-4 rounded-2xl border border-zinc-100 max-h-[300px] overflow-y-auto"
                                                >
                                                    <Link href="/representatives" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Rappresentanti</Link>
                                                    <Link href="/gruppi" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Gruppi</Link>
                                                    <Link href="/guide" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Guide</Link>
                                                    <Link href="/faq" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">FAQ</Link>
                                                    <Link href="/events" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Le Nostre Iniziative</Link>
                                                    <Link href="/convenzioni" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Convenzioni</Link>
                                                    <Link href="/social" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Social</Link>
                                                    <Link href="/media-kit" onClick={() => setIsOpen(false)} className="text-lg font-bold text-zinc-600">Media Kit</Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                        </nav>

                        <div className="mt-8 flex flex-col gap-4">
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