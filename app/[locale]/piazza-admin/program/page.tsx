import { getPiazzaProgram } from "@/app/actions/piazza"
import { ProgramManager } from "@/components/admin/piazza/program-manager"

export const dynamic = 'force-dynamic'

export default async function PiazzaProgramPage() {
    const program = await getPiazzaProgram()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProgramManager program={program} />
        </div>
    )
}
