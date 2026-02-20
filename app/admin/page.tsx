import prisma from "@/lib/prisma"
import { Users, Building2, Calendar, Newspaper } from "lucide-react"


export const dynamic = 'force-dynamic'

async function getStats() {
    const totalReps = await prisma.representative.count()
    const totalUsers = await prisma.user.count()
    const totalEvents = await prisma.event.count()
    const totalNews = await prisma.news.count()

    return {
        representatives: totalReps,
        users: totalUsers,
        events: totalEvents,
        news: totalNews,
    }
}

export default async function AdminPage() {
    const stats = await getStats()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-foreground">Panoramica</h1>

            <div className="grid md:grid-cols-4 gap-6">
                <StatCard
                    label="Rappresentanti"
                    value={stats.representatives}
                    icon={Building2}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Utenti Registrati"
                    value={stats.users}
                    icon={Users}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatCard
                    label="Eventi"
                    value={stats.events}
                    icon={Calendar}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    label="Notizie"
                    value={stats.news}
                    icon={Newspaper}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color, bg }: { label: string, value: number, icon: any, color: string, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-3xl font-black text-foreground">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon className="size-6" />
            </div>
        </div>
    )
}
