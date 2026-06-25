import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionUser } from "@/lib/session"

// ---------------------------------------------------------------------------
// Magic-byte signatures for each allowed MIME type.
// We read the first bytes of the buffer and compare them to known signatures,
// ignoring the client-declared Content-Type which can be trivially spoofed.
// ---------------------------------------------------------------------------
const MAGIC_SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
    // Images
    { mime: "image/jpeg",  bytes: [0xff, 0xd8, 0xff] },
    { mime: "image/png",   bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
    { mime: "image/gif",   bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF8
    { mime: "image/webp",  bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 }, // RIFF????WEBP
    // Documents
    { mime: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
    // Office formats share the same ZIP-based magic bytes — validated further by extension
    { mime: "application/zip", bytes: [0x50, 0x4b, 0x03, 0x04] }, // PK\x03\x04
    // Video
    { mime: "video/mp4",  bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 }, // ftyp at byte 4
    { mime: "video/webm", bytes: [0x1a, 0x45, 0xdf, 0xa3] }, // EBML
    { mime: "video/ogg",  bytes: [0x4f, 0x67, 0x67, 0x53] }, // OggS
]

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
    "image/jpeg":       [".jpg", ".jpeg"],
    "image/png":        [".png"],
    "image/gif":        [".gif"],
    "image/webp":       [".webp"],
    "application/pdf":  [".pdf"],
    // Office docs use the generic ZIP magic — we restrict by extension
    "application/zip":  [".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"],
    "video/mp4":        [".mp4", ".m4v"],
    "video/webm":       [".webm"],
    "video/ogg":        [".ogg", ".ogv"],
    "video/quicktime":  [], // handled separately (no reliable magic)
}

function detectMimeFromBuffer(buffer: Buffer): string | null {
    for (const sig of MAGIC_SIGNATURES) {
        const offset = sig.offset ?? 0
        if (buffer.length < offset + sig.bytes.length) continue

        const match = sig.bytes.every((byte, i) => buffer[offset + i] === byte)
        if (match) return sig.mime
    }

    // QuickTime / MOV: check for 'ftyp' or 'moov' boxes in the first 12 bytes
    if (buffer.length >= 12) {
        const boxType = buffer.slice(4, 8).toString("ascii")
        if (boxType === "ftyp" || boxType === "moov" || boxType === "mdat") {
            return "video/quicktime"
        }
    }

    return null
}

function getExtension(filename: string): string {
    const idx = filename.lastIndexOf(".")
    return idx !== -1 ? filename.slice(idx).toLowerCase() : ""
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
    // ── Auth check: only admin roles can upload ──────────────────────────────
    const sessionUser = await getSessionUser()
    if (
        !sessionUser ||
        !["ADMIN_MORGANA", "ADMIN_NETWORK", "SUPER_ADMIN"].includes(sessionUser.role)
    ) {
        return NextResponse.json(
            { error: "Non autorizzato. Effettua il login come amministratore." },
            { status: 401 }
        )
    }

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File | null
        const folder = (formData.get("folder") as string) || "others"

        if (!file) {
            return NextResponse.json({ error: "Nessun file caricato" }, { status: 400 })
        }

        // ── Size check (max 10 MB) ───────────────────────────────────────────
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Il file è troppo grande. Massimo 10MB." },
                { status: 400 }
            )
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // ── Magic-byte validation ────────────────────────────────────────────
        const detectedMime = detectMimeFromBuffer(buffer)
        if (!detectedMime) {
            return NextResponse.json(
                { error: "Tipo di file non riconosciuto o non supportato." },
                { status: 400 }
            )
        }

        // ── Extension cross-check ─────────────────────────────────────────────
        const ext = getExtension(file.name)
        const allowedExts = ALLOWED_EXTENSIONS[detectedMime] ?? []
        if (allowedExts.length > 0 && !allowedExts.includes(ext)) {
            return NextResponse.json(
                { error: `Estensione file non valida per il tipo rilevato (${detectedMime}).` },
                { status: 400 }
            )
        }

        // ── Upload to Vercel Blob ────────────────────────────────────────────
        const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filename = `morgana-orum/${folder}/${Date.now()}_${cleanOriginalName}`

        const blob = await put(filename, buffer, {
            access: "public",
            contentType: detectedMime, // use server-detected MIME, not client-declared
        })

        return NextResponse.json({ url: blob.url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { error: "Errore durante il caricamento su Vercel Blob" },
            { status: 500 }
        )
    }
}
