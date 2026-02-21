import { Metadata } from "next"

const BRAND_ASSET_MAPPING: Record<string, string> = {
    unimhealth: "unimhealth",
    economia: "studentieconomia",
    scipog: "studentiscipog",
    dicam: "insidedicam",
    matricole: "unimematricole",
}

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    const folder = BRAND_ASSET_MAPPING[params.brandId] || "morganaorum"

    return {
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
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
