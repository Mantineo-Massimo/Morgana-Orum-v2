import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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

        let allowedTypes = [...imageTypes, ...docTypes]

        if (!allowedTypes.includes(file.type) && folder !== "attachments") {
            // Basic check, allows more if in attachments but let's keep it safe
            if (!file.type.startsWith("image/") && !file.type.startsWith("application/")) {
                return NextResponse.json({ error: "Tipo di file non supportato." }, { status: 400 })
            }
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Il file è troppo grande. Massimo 10MB." }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Cloudinary using a Promise to handle the stream
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `morgana-orum/${folder}`,
                    resource_type: "auto", // Automatically detect if image or raw (PDF/Doc)
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        }) as any

        return NextResponse.json({ url: uploadResult.secure_url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Errore durante il caricamento su Cloudinary" }, { status: 500 })
    }
}
