import { Metadata } from "next"
import { notFound } from "next/navigation"

const BRAND_ASSET_MAPPING: Record<string, string> = {
    unimhealth: "unimhealth",
    economia: "studentieconomia",
    scipog: "studentiscipog",
    dicam: "insidedicam",
    matricole: "unimematricole",
    piazzadellarte: "piazzadellarte",
}

const BRAND_NAMES: Record<string, string> = {
    unimhealth: "Unimhealth",
    economia: "Studenti Economia",
    scipog: "Studenti Scipog",
    dicam: "Inside Dicam",
    matricole: "Unime Matricole",
    piazzadellarte: "Piazza Dell'Arte",
}

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    if (params.brandId !== "piazzadellarte") return {}
    const folder = BRAND_ASSET_MAPPING[params.brandId] || "morganaorum"
    const brandName = BRAND_NAMES[params.brandId] || "Network"

    return {
        title: `${brandName} - Morgana & Orum`,
        icons: {
            icon: [
                { url: `/assets/${folder}/favicon.ico` },
                { url: `/assets/${folder}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
                { url: `/assets/${folder}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
            ],
            apple: [
                { url: `/assets/${folder}/apple-touch-icon.png` },
            ],
        }
    }
}

export default function NetworkLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { brandId: string }
}) {
    if (params.brandId !== "piazzadellarte") {
        notFound()
    }
    return <>{children}</>
}
