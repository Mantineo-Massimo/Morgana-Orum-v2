import { getConventionById } from "@/app/actions/conventions"
import ConventionForm from "@/components/admin/convention-form"
import { notFound } from "next/navigation"

export default async function EditConventionPage({ params }: { params: { id: string } }) {
    const convention = await getConventionById(params.id)

    if (!convention) {
        notFound()
    }

    return <ConventionForm initialData={convention} />
}
