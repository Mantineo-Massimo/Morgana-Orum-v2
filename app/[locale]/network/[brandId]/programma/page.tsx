import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPiazzaProgram } from "@/app/actions/piazza"
import { ProgrammaClient } from "@/components/piazza/programma-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { brandId: string } }): Promise<Metadata> {
    if (params.brandId !== 'piazzadellarte') return {}
    return {
        title: "Programma | Piazza dell'Arte 2026",
        description: "Scopri il programma completo della Piazza dell'Arte: laboratori e seminari al mattino, attività pomeridiane e la grande serata di spettacoli dal vivo."
    }
}

interface Props {
    params: { locale: string; brandId: string }
}

export default async function ProgrammaPage({ params }: Props) {
    if (params.brandId !== 'piazzadellarte') {
        notFound()
    }

    const program = await getPiazzaProgram()

    return <ProgrammaClient program={program} />
}
