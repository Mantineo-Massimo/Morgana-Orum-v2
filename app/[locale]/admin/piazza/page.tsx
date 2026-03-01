import { getTranslations } from "next-intl/server"
import { PiazzaManagement } from "@/components/admin/piazza/piazza-management"
import { getPiazzaArtists, getPiazzaProgram, getPiazzaMedia, getPiazzaSettings } from "@/app/actions/piazza"
import { Sparkles } from "lucide-react"

export default async function PiazzaAdminPage() {
    const t = await getTranslations("Admin")

    const [artists, program, media, settings] = await Promise.all([
        getPiazzaArtists(),
        getPiazzaProgram(),
        getPiazzaMedia(),
        getPiazzaSettings()
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Sparkles className="size-6 text-amber-500" />
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
                            Piazza dell&apos;Arte {settings.year}
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gestione dinamica di artisti, programma, contenuti multimediali e impostazioni.
                    </p>
                </div>
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
