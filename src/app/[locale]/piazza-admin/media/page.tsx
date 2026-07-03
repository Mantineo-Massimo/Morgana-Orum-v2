import { getPiazzaMedia } from "@/app/actions/piazza"
import { MediaManager } from "@/components/admin/piazza/media-manager"

export const dynamic = 'force-dynamic'

export default async function PiazzaMediaPage() {
    const media = await getPiazzaMedia()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <MediaManager media={media} />
        </div>
    )
}
