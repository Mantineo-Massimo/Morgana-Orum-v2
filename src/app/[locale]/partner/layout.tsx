import { getPartnerSession, partnerLogoutAction } from "@/app/actions/partner"
import { QrCode, LayoutDashboard, Tag, LogOut, Store } from "lucide-react"
import { Link } from "@/i18n/routing"
import Image from "next/image"

export default async function PartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const partner = await getPartnerSession()

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#18182e] text-white border-b border-slate-800 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl flex items-center justify-between h-16 sm:h-20">
                    {/* Brand / Partner Info */}
                    <div className="flex items-center gap-3">
                        {partner?.conventionLogo ? (
                            <div className="relative size-10 rounded-xl overflow-hidden bg-white border border-slate-700 shrink-0">
                                <Image
                                    src={partner.conventionLogo}
                                    alt={partner.conventionName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="size-10 rounded-xl bg-gradient-to-tr from-[#c9041a] to-[#18182e] flex items-center justify-center text-white border border-slate-700 shrink-0">
                                <Store className="size-5" />
                            </div>
                        )}
                        <div>
                            <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                Portale Convenzione
                            </span>
                            <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                                {partner ? partner.conventionName : "Area Partner"}
                            </h1>
                        </div>
                    </div>

                    {/* Navigation Items (If Logged In) */}
                    {partner && (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <nav className="flex items-center gap-1 sm:gap-2">
                                <Link
                                    href="/partner/scanner"
                                    className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                                >
                                    <QrCode className="size-4" />
                                    <span className="hidden sm:inline">Scanner QR</span>
                                </Link>

                                <Link
                                    href="/partner/dashboard"
                                    className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200"
                                >
                                    <LayoutDashboard className="size-4" />
                                    <span className="hidden sm:inline">Report</span>
                                </Link>

                                <Link
                                    href="/partner/discounts"
                                    className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200"
                                >
                                    <Tag className="size-4" />
                                    <span className="hidden sm:inline">Sconti</span>
                                </Link>
                            </nav>

                            <form action={partnerLogoutAction}>
                                <button
                                    type="submit"
                                    title="Esci"
                                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors text-xs font-bold flex items-center gap-1.5 border border-slate-700"
                                >
                                    <LogOut className="size-4" />
                                    <span className="hidden md:inline">Esci</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-6xl py-8">
                {children}
            </main>
        </div>
    )
}
