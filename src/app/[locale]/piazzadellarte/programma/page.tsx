import { Metadata } from "next"
import { getPiazzaProgram } from "@/app/actions/piazza"
import { ProgrammaClient } from "@/components/piazza/programma-client"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "Piazza.program" })
    return {
        title: t("metadata_title"),
        description: t("metadata_desc")
    }
}

export default async function ProgrammaPage() {
    const program = await getPiazzaProgram()

    return <ProgrammaClient program={program} />
}
