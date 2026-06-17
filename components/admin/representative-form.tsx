"use client"

import { createRepresentative, updateRepresentative } from "@/app/actions/representatives"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ASSOCIATIONS } from "@/lib/associations"
import { Association } from "@prisma/client"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { MediaSelector } from "@/components/admin/media-selector"


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
    "CUG (Comitato Unico di Garanzia)",
]

const nationalRolesList = [
    "CNSU (Consiglio Nazionale degli Studenti Universitari)",
]

export default function RepresentativeForm({
    initialData,
    userRole,
    userAssociation,
    onSuccess,
    onCancel
}: {
    initialData?: any
    userRole?: string
    userAssociation?: Association
    onSuccess?: () => void
    onCancel?: () => void
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null)
    const [isUploading, setIsUploading] = useState(false)
    const [isMediaOpen, setIsMediaOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEditing = !!initialData

    const [description, setDescription] = useState(initialData?.description || "")
    const [roleDescription, setRoleDescription] = useState(initialData?.roleDescription || "")

    // Logic for association selection
    const isNetworkAdmin = userRole === "ADMIN_NETWORK"
    const availableAssociations = isNetworkAdmin
        ? ASSOCIATIONS.filter(a => a.id === userAssociation)
        : ASSOCIATIONS

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
            mandateYears: Number(formData.get("mandateYears")) || 2,
            image: imageUrl || null,
            email: formData.get("email") as string || null,
            phone: formData.get("phone") as string || null,
            instagram: formData.get("instagram") as string || null,
            description: description || null,
            roleDescription: roleDescription || null,
            association: formData.get("association") as Association,
        }

        const result = isEditing
            ? await updateRepresentative(initialData.id, rawData)
            : await createRepresentative(rawData)

        if (result.success) {
            if (onSuccess) {
                onSuccess()
            } else {
                router.push(`/admin/representatives`)
                router.refresh()
            }
        } else {
            setError(result.error || "Errore sconosciuto")
            setIsLoading(false)
        }
    }

    // Determine default/initial state for conditional fields
    const [category, setCategory] = useState<"CENTRAL" | "DEPARTMENT" | "NATIONAL">(initialData?.category || "DEPARTMENT")

    const inputClass = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
    const labelClass = "block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5"

    return (
        <div className={cn(
            !onSuccess && "max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500"
        )}>
            {!onSuccess && (
                <div className="mb-8">
                    <Link
                        href={`/admin/representatives`}
                        className="text-zinc-500 hover:text-foreground flex items-center gap-2 text-sm font-medium mb-4"
                    >
                        <ArrowLeft className="size-4" /> Torna alla lista
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">
                        {isEditing ? "Modifica Rappresentante" : "Nuovo Rappresentante"}
                    </h1>
                    <p className="text-zinc-500">
                        {isEditing ? "Aggiorna i dettagli" : "Inserisci i dati del nuovo eletto"}
                    </p>
                </div>
            )}

            <form action={handleSubmit} className={cn(
                "space-y-6",
                !onSuccess && "bg-white border border-zinc-100 rounded-xl p-8 shadow-sm"
            )}>
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
                            <div className="flex-1 flex flex-col gap-2">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                                    onDrop={(e) => {
                                        e.preventDefault(); e.stopPropagation()
                                        const file = e.dataTransfer.files[0]
                                        if (file) handleImageUpload(file)
                                    }}
                                    className="border-2 border-dashed border-zinc-300 rounded-xl p-4 text-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all"
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
                                <button
                                    type="button"
                                    onClick={() => setIsMediaOpen(true)}
                                    className="w-full py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <ImageIcon className="size-3.5 text-zinc-500" />
                                    Oppure scegli dalla Libreria Media
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Nome e Cognome</label>
                        <input
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className={inputClass}
                            placeholder="Es. Mario Rossi"
                        />
                    </div>

                    {/* Association Selection */}
                    <div>
                        <label className={labelClass}>Associazione di Appartenenza</label>
                        <select
                            name="association"
                            defaultValue={initialData?.association || userAssociation || "MORGANA_ORUM"}
                            disabled={isNetworkAdmin}
                            required
                            className={cn(inputClass, "bg-white disabled:bg-zinc-50 disabled:text-zinc-500")}
                        >
                            {availableAssociations.map(assoc => (
                                <option key={assoc.id} value={assoc.id}>{assoc.name}</option>
                            ))}
                        </select>
                        {isNetworkAdmin && (
                            <p className="text-[10px] text-zinc-400 mt-1">
                                Come Admin di Rete, puoi gestire solo i rappresentanti del tuo network.
                            </p>
                        )}
                        <input type="hidden" name="association" value={initialData?.association || userAssociation || "MORGANA_ORUM"} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* List Name */}
                        <div>
                            <label className={labelClass}>Lista</label>
                            <select
                                name="listName"
                                defaultValue={initialData?.listName || "MORGANA"}
                                className={cn(inputClass, "bg-white")}
                            >
                                <option value="MORGANA">MORGANA</option>
                                <option value="O.R.U.M.">O.R.U.M.</option>
                                <option value="AZIONE UNIVERITARIA">AZIONE UNIVERITARIA</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select
                                name="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className={cn(inputClass, "bg-white")}
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
                            <label className={labelClass}>Dipartimento</label>
                            <select
                                name="department"
                                defaultValue={initialData?.department || ""}
                                required={category === "DEPARTMENT"}
                                className={cn(inputClass, "bg-white")}
                            >
                                <option value="" disabled>Seleziona un dipartimento</option>
                                {departmentsList.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className={labelClass}>Ruolo / Organo</label>
                            <select
                                name="role"
                                defaultValue={initialData?.role || ""}
                                required={category === "CENTRAL" || category === "NATIONAL"}
                                className={cn(inputClass, "bg-white")}
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

                    {/* Term and Mandate Years */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Mandato / Annata</label>
                            <input
                                type="text"
                                disabled
                                value={initialData?.term || "2025-2027"}
                                className={cn(inputClass, "bg-zinc-50 text-zinc-500 font-mono text-sm cursor-not-allowed select-none")}
                            />
                            <input
                                type="hidden"
                                name="term"
                                value={initialData?.term || "2025-2027"}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Durata Mandato (Anni)</label>
                            <select
                                name="mandateYears"
                                defaultValue={initialData?.mandateYears ?? 2}
                                className={cn(inputClass, "bg-white")}
                            >
                                <option value={2}>2 Anni (Standard)</option>
                                <option value={3}>3 Anni</option>
                                <option value={4}>4 Anni</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Email (Opzionale)</label>
                            <input
                                name="email"
                                type="email"
                                defaultValue={initialData?.email}
                                className={inputClass}
                                placeholder="email@studenti.unime.it"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Telefono (Opzionale)</label>
                            <input
                                name="phone"
                                type="tel"
                                defaultValue={initialData?.phone}
                                className={inputClass}
                                placeholder="+39 123 456 7890"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Instagram (Opzionale)</label>
                            <input
                                name="instagram"
                                defaultValue={initialData?.instagram}
                                className={inputClass}
                                placeholder="@username"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Descrizione Persona (Rich Text)</label>
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                            placeholder="Breve descrizione del rappresentante..."
                        />
                    </div>

                    {/* Role Description */}
                    <div>
                        <label className={labelClass}>Descrizione Ruolo (Rich Text)</label>
                        <RichTextEditor
                            value={roleDescription}
                            onChange={setRoleDescription}
                            placeholder="Descrizione del ruolo istituzionale..."
                        />
                    </div>

                </div>

                <div className="pt-4 flex justify-end gap-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 border border-slate-200 bg-white rounded-xl transition-all"
                        >
                            Annulla
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-br from-[#c12830] to-[#18182e] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Salvataggio in corso...</span>
                            </>
                        ) : (
                            <>
                                <Save className="size-5" />
                                <span>{isEditing ? "Salva Modifiche" : "Crea Rappresentante"}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <MediaSelector
                isOpen={isMediaOpen}
                onClose={() => setIsMediaOpen(false)}
                onSelect={(url) => setImageUrl(url)}
            />
        </div>
    )
}
