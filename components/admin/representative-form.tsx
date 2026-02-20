"use client"

import { createRepresentative, updateRepresentative } from "@/app/actions/representatives"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Mapping for Department dropdown
const departmentsList = [
    "Dipartimento Civiltà Antiche e Moderne (DICAM)",
    "Dipartimento di Economia",
    "Dipartimento di Giurisprudenza",
    "Dipartimento di Ingegneria",
    "Dipartimento Medicina Clinica e Sperimentale (DIMED)",
    "Dipartimento Patologia Umana dell'Adulto e dell'Età Evolutiva",
    "Dipartimento Scienze Biomediche, Odontoiatriche e delle Immagini (BIOMORF)",
    "Dipartimento Scienze Chimiche, Biologiche, Farmaceutiche e Ambientali (CHIBIOFARAM)",
    "Dipartimento Scienze Cognitive, Psicologiche, Pedagogiche e Studi Culturali (COSPECS)",
    "Dipartimento Scienze Matematiche e Informatiche, Scienze Fisiche e Scienze della Terra (MIFT)",
    "Dipartimento Scienze Politiche e Giuridiche (SCIPOG)",
    "Dipartimento Scienze Veterinarie (VET)"
]

const centralRolesList = [
    "SA (Senato Accademico)",
    "CdA (Consiglio di Amministrazione)",
    "CdS (Consiglio degli Studenti)",
    "CSASU (Comitato per lo Sport Universitario)",
    "ERSU (Ente Regionale per il Diritto allo Studio Universitario)",
    "SIR (Struttura Interdipartimentale di Raccordo di \"Facoltà di Medicina e Chirurgia\")",
    "Altro"
]

const nationalRolesList = [
    "CNSU (Consiglio Nazionale degli Studenti Universitari)",
    "Altro"
]

export default function RepresentativeForm({
    initialData
}: {
    initialData?: any
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEditing = !!initialData

    async function handleImageUpload(file: File) {
        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            const data = await res.json()
            if (res.ok) {
                setImageUrl(data.url)
            } else {
                setError(data.error || "Errore nel caricamento dell'immagine")
            }
        } catch {
            setError("Errore nel caricamento dell'immagine")
        } finally {
            setIsUploading(false)
        }
    }

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const rawData = {
            name: formData.get("name") as string,
            listName: formData.get("listName") as "MORGANA" | "O.R.U.M." | "AZIONE UNIVERITARIA",
            category: formData.get("category") as "CENTRAL" | "DEPARTMENT" | "NATIONAL",
            department: formData.get("department") as string || undefined,
            role: formData.get("role") as string || undefined,
            term: formData.get("term") as string || "2025-2027",
            image: imageUrl || null,
            email: formData.get("email") as string || null,
            phone: formData.get("phone") as string || null,
            instagram: formData.get("instagram") as string || null,
            description: formData.get("description") as string || null,
            roleDescription: formData.get("roleDescription") as string || null,
        }

        const result = isEditing
            ? await updateRepresentative(initialData.id, rawData)
            : await createRepresentative(rawData)

        if (result.success) {
            router.push(`/admin/representatives`)
            router.refresh()
        } else {
            setError(result.error || "Errore sconosciuto")
            setIsLoading(false)
        }
    }

    // Determine default/initial state for conditional fields
    const [category, setCategory] = useState<"CENTRAL" | "DEPARTMENT" | "NATIONAL">(initialData?.category || "DEPARTMENT")

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link
                    href={`/admin/representatives`}
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-2 text-sm font-medium mb-4"
                >
                    <ArrowLeft className="size-4" /> Torna alla lista
                </Link>
                <h1 className="text-3xl font-bold text-zinc-900">
                    {isEditing ? "Modifica Rappresentante" : "Nuovo Rappresentante"}
                </h1>
                <p className="text-zinc-500">
                    {isEditing ? "Aggiorna i dettagli" : "Inserisci i dati del nuovo eletto"}
                </p>
            </div>

            <form action={handleSubmit} className="bg-white border border-zinc-100 rounded-xl p-8 shadow-sm space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Foto (Opzionale)</label>
                        <div className="flex items-start gap-6">
                            {/* Preview */}
                            <div className="relative size-24 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                    <>
                                        <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl(null)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="size-8 text-zinc-400" />
                                )}
                            </div>
                            {/* Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                                onDrop={(e) => {
                                    e.preventDefault(); e.stopPropagation()
                                    const file = e.dataTransfer.files[0]
                                    if (file) handleImageUpload(file)
                                }}
                                className="flex-1 border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                            >
                                {isUploading ? (
                                    <div className="flex items-center justify-center gap-2 text-zinc-500">
                                        <Loader2 className="size-5 animate-spin" />
                                        <span className="text-sm">Caricamento...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <Upload className="size-5 text-zinc-400" />
                                        <span className="text-sm text-zinc-500">Clicca o trascina un&apos;immagine</span>
                                        <span className="text-xs text-zinc-400">JPG, PNG, WebP — max 5MB</span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(file)
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Nome e Cognome</label>
                        <input
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                            placeholder="Es. Mario Rossi"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* List Name */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Lista</label>
                            <select
                                name="listName"
                                defaultValue={initialData?.listName || "MORGANA"}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                            >
                                <option value="MORGANA">MORGANA</option>
                                <option value="O.R.U.M.">O.R.U.M.</option>
                                <option value="AZIONE UNIVERITARIA">AZIONE UNIVERITARIA</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Categoria</label>
                            <select
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                            >
                                <option value="DEPARTMENT">Dipartimento</option>
                                <option value="CENTRAL">Organo Centrale</option>
                                <option value="NATIONAL">Organo Nazionale</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional Fields */}
                    {category === "DEPARTMENT" ? (
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Dipartimento</label>
                            <select
                                name="department"
                                defaultValue={initialData?.department || ""}
                                required={category === "DEPARTMENT"}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                            >
                                <option value="" disabled>Seleziona un dipartimento</option>
                                {departmentsList.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Ruolo / Organo</label>
                            <select
                                name="role"
                                defaultValue={initialData?.role || ""}
                                required={category === "CENTRAL" || category === "NATIONAL"}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                            >
                                <option value="" disabled>Seleziona un organo</option>
                                {category === "CENTRAL"
                                    ? centralRolesList.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))
                                    : nationalRolesList.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))
                                }
                            </select>
                        </div>
                    )}

                    {/* Term */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Mandato / Annata</label>
                        <input
                            name="term"
                            defaultValue={initialData?.term || "2025-2027"}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all font-mono text-sm"
                            placeholder="Es. 2025-2027"
                        />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Email (Opzionale)</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={initialData?.email}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                                placeholder="email@studenti.unime.it"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Telefono (Opzionale)</label>
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={initialData?.phone}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                                placeholder="+39 123 456 7890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Instagram (Opzionale)</label>
                            <input
                                name="instagram"
                                defaultValue={initialData?.instagram}
                                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                                placeholder="@username"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Descrizione Persona (Opzionale)</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description ?? ""}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-y"
                            placeholder="Breve descrizione del rappresentante..."
                        />
                    </div>

                    {/* Role Description */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Descrizione Ruolo (Opzionale)</label>
                        <textarea
                            name="roleDescription"
                            defaultValue={initialData?.roleDescription ?? ""}
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-y"
                            placeholder="Descrizione del ruolo istituzionale..."
                        />
                    </div>

                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                        {isEditing ? "Salva Modifiche" : "Crea Rappresentante"}
                    </button>
                </div>
            </form>
        </div>
    )
}
