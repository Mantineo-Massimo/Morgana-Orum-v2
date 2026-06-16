import { getUploadedMedia } from "@/app/actions/media"
import { MediaAdminClient } from "./media-admin-client"

export const dynamic = "force-dynamic"

export default async function MediaAdminPage() {
    const mediaItems = await getUploadedMedia()

    return <MediaAdminClient initialMedia={mediaItems} />
}
