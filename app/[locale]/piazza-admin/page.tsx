import { getPiazzaArtists, getPiazzaProgram, getPiazzaMedia, getPiazzaSettings } from "@/app/actions/piazza"
import { PiazzaManagement } from "@/components/admin/piazza/piazza-management"

export const dynamic = 'force-dynamic'

export default async function PiazzaAdminPage() {
    // Fetch all data in parallel for the management console
    const [artists, program, media, settings] = await Promise.all([
        getPiazzaArtists(),
        getPiazzaProgram(),
        getPiazzaMedia(),
        getPiazzaSettings()
    ])

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#0f172a] p-8 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase tracking-tighter">
                        Piazza dell&apos;Arte <span className="text-[#f9a620]">{settings.year}</span>
                    </h2>
                    <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs mt-2">
                        Pannello di Controllo Evento
                    </p>
                </div>

                {/* Visual decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#f9a620]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            </div>

            <PiazzaManagement
                artists={artists}
                program={program}
                media={media}
                settings={settings}
            />
        </div>
    )
}
