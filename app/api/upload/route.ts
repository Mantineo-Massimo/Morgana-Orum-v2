import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null
        const folder = (formData.get("folder") as string) || "others"

        if (!file) {
            return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 })
        }

        // Validate file type
        const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
        const docTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]

        let allowedTypes = [...imageTypes, ...docTypes, ...videoTypes]

        if (!allowedTypes.includes(file.type) && folder !== "attachments") {
            // Basic check, allows more if in attachments but let's keep it safe
            if (!file.type.startsWith("image/") && !file.type.startsWith("application/") && !file.type.startsWith("video/")) {
                return NextResponse.json({ error: "Tipo di file non supportato." }, { status: 400 })
            }
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Il file è troppo grande. Massimo 10MB." }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Vercel Blob
        const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filename = `morgana-orum/${folder}/${Date.now()}_${cleanOriginalName}`

        const blob = await put(filename, buffer, {
            access: "public",
            contentType: file.type,
        })

        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Errore durante il caricamento su Vercel Blob" }, { status: 500 })
    }
}
