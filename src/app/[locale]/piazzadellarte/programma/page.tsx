import { Metadata } from "next"
import { getPiazzaProgram } from "@/app/actions/piazza"
import { ProgrammaClient } from "@/components/piazza/programma-client"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Programma | Piazza dell'Arte 2026",
        description: "Scopri il programma completo della Piazza dell'Arte: laboratori e seminari al mattino, attività pomeridiane e la grande serata di spettacoli dal vivo."
    }
}

export default async function ProgrammaPage() {
    const program = await getPiazzaProgram()

    return <ProgrammaClient program={program} />
}
