import { getUserDashboardData } from "@/app/actions/users"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { getAssociationName } from "@/lib/associations"
import { LogOut, ShieldCheck } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { Link } from "@/i18n/routing"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const data = await getUserDashboardData()

    if (!data) {
        redirect("/login")
    }

    const { user } = data
    const t = await getTranslations("Dashboard")

    const userInitials = `${user.name.charAt(0)}${user.surname.charAt(0)}`
    const userFullName = `${user.name} ${user.surname}`
    const userRoleLabel = user.role === "USER"
        ? t("sidebar_student")
        : user.role === "ADMIN_NETWORK"
        ? t("sidebar_admin_network", { association: getAssociationName(user.association) })
        : user.role === "ADMIN_MORGANA"
        ? t("sidebar_admin_morgana")
        : t("sidebar_super_admin")

    return (
        <div className="min-h-screen bg-zinc-50/50 pt-28 md:pt-32 pb-16">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                {/* USER SUMMARY CARD */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-tr from-[#c9041a] to-[#18182e] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_4px_15px_rgba(201,4,26,0.15)] shrink-0">
                            {userInitials}
                        </div>
                        <div>
                            <div className="flex items-center flex-wrap gap-2">
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{userFullName}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-600">
                                    #{user.matricola}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1.5">{userRoleLabel}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                        {user.role !== "USER" && (
                            <Link
                                href={`/admin`}
                                className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-2"
                            >
                                <ShieldCheck className="size-4 text-slate-800" />
                                <span>{t("admin_panel")}</span>
                            </Link>
                        )}
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-red-50 hover:bg-red-100 border border-red-150 text-red-650 flex items-center gap-2"
                            >
                                <LogOut className="size-4" />
                                <span>{t("sidebar_logout")}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* SUB-NAVIGATION TABS */}
                <DashboardNav />

                {/* CONTENT AREA */}
                <main className="w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
