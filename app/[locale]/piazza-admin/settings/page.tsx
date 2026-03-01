import { getPiazzaSettings } from "@/app/actions/piazza"
import { SettingsManager } from "@/components/admin/piazza/settings-manager"

export const dynamic = 'force-dynamic'

export default async function PiazzaSettingsPage() {
    const settings = await getPiazzaSettings()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SettingsManager settings={settings} />
        </div>
    )
}
