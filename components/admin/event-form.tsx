"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, X, File, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { createEvent, updateEvent } from "@/app/actions/events"
import { departmentsData } from "@/lib/departments"

type EventFormProps = {
    initialData?: {
        id: number
        title: string
        description: string
        details: string | null
        date: Date
        endDate: Date | null
        location: string
        cfuValue: string | null
        cfuType: string | null
        cfuDepartments: string | null
        image: string | null
        category: string
        bookingOpen: boolean
        bookingStart: Date | null
        bookingEnd: Date | null
        attachments: string | null
        association?: string
    }
}

const EVENT_CATEGORIES = ["Seminari CFU", "Sociale", "Cultura", "Sportivo", "Istituzionale"]

// Extract list of department names for checklists
const DEPARTMENTS_LIST = Object.keys(departmentsData)

function dateToInputValue(d: Date | null | undefined): string {
    if (!d) return ''
    const dt = new Date(d)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const day = String(dt.getDate()).padStart(2, '0')
    const h = String(dt.getHours()).padStart(2, '0')
    const min = String(dt.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${day}T${h}:${min}`
}

export default function EventForm({ initialData }: EventFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")
    const [bookingOpen, setBookingOpen] = useState(initialData?.bookingOpen ?? false)

    // CFU State
    const [cfuType, setCfuType] = useState<string>(initialData?.cfuType || "")
    const [selectedDeps, setSelectedDeps] = useState<Set<string>>(
        new Set(initialData?.cfuDepartments ? initialData.cfuDepartments.split(',').map(d => d.trim()) : [])
    )

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null)
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
    const [existingAttachments, setExistingAttachments] = useState<string[]>(
        initialData?.attachments ? initialData.attachments.split(',').map(a => a.trim()).filter(Boolean) : []
    )

    async function uploadFile(file: File, folder: string) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", folder)
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}))
            throw new Error(errData.error || "Errore upload file")
        }
        const data = await res.json()
        return data.url
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")

        try {
            const formData = new FormData(e.currentTarget)

            // Upload image
            let imageUrl = imagePreview
            if (imageFile) {
                imageUrl = await uploadFile(imageFile, "events")
            }

            // Upload attachments
            const uploadedAttachmentUrls = []
            for (const file of attachmentFiles) {
                const url = await uploadFile(file, "attachments")
                uploadedAttachmentUrls.push(url)
            }

            // Combine attachments
            const finalAttachments = [...existingAttachments, ...uploadedAttachmentUrls].join(',')

            const cfuValueRaw = formData.get("cfuValue") as string
            const finalCfuValue = cfuValueRaw.trim() !== "" ? cfuValueRaw : undefined
            const finalCfuType = finalCfuValue ? cfuType : undefined
            const finalCfuDeps = (finalCfuValue && finalCfuType === "DIPARTIMENTO" && selectedDeps.size > 0)
                ? Array.from(selectedDeps).join(', ')
                : undefined

            const rawData = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                details: (formData.get("details") as string) || undefined,
                date: formData.get("date") as string,
                endDate: (formData.get("endDate") as string) || undefined,
                location: formData.get("location") as string,
                cfuValue: finalCfuValue,
                cfuType: finalCfuType,
                cfuDepartments: finalCfuDeps,
                image: imageUrl || undefined,
                category: formData.get("category") as string,
                bookingOpen: bookingOpen,
                bookingStart: (formData.get("bookingStart") as string) || undefined,
                bookingEnd: (formData.get("bookingEnd") as string) || undefined,
                attachments: finalAttachments || undefined,
                association: formData.get("association") as string,
            }

            const result = initialData
                ? await updateEvent(initialData.id, rawData)
                : await createEvent(rawData)

            if (result.success) {
                router.push(`/admin/events`)
                router.refresh()
            } else {
                setError(result.error || "Errore sconosciuto")
            }
        } catch (err: any) {
            setError(err.message || "Errore durante il salvataggio")
        } finally {
            setIsPending(false)
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 text-sm"
    const labelClass = "block text-sm font-bold text-zinc-700 mb-2"

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link
                    href={`/admin/events`}
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-2 text-sm font-medium mb-4"
                >
                    <ArrowLeft className="size-4" /> Torna alla lista
                </Link>
                <h1 className="text-3xl font-bold text-zinc-900">
                    {initialData ? "Modifica Evento" : "Nuovo Evento"}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                {/* Copertina */}
                <div>
                    <label className={labelClass}>Copertina</label>
                    <div className="flex items-start gap-4">
                        {imagePreview && (
                            <div className="relative size-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImagePreview(null); setImageFile(null) }}
                                    className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-zinc-700 hover:text-red-500 hover:bg-white"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setImageFile(file)
                                        setImagePreview(URL.createObjectURL(file))
                                    }
                                }}
                                className={cn(inputClass, "pt-2")}
                                title="Carica una copertina"
                            />
                            <p className="text-xs text-zinc-500 mt-2">JPG, PNG, WebP o GIF. Max 10MB.</p>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className={labelClass}>Titolo *</label>
                    <input name="title" defaultValue={initialData?.title} required className={inputClass} placeholder="Es: Seminario AI e Diritto" />
                </div>

                {/* Description */}
                <div>
                    <label className={labelClass}>Descrizione breve *</label>
                    <textarea name="description" defaultValue={initialData?.description} required rows={3} className={cn(inputClass, "resize-none")} placeholder="Descrizione sintetica dell'evento..." />
                </div>

                {/* Details */}
                <div>
                    <label className={labelClass}>Dettagli (programma, info aggiuntive)</label>
                    <textarea name="details" defaultValue={initialData?.details || ""} rows={6} className={cn(inputClass, "resize-none")} placeholder="Programma dettagliato, relatori, informazioni pratiche..." />
                </div>



                {/* Date & End Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Data e Ora Inizio *</label>
                        <input type="datetime-local" name="date" defaultValue={dateToInputValue(initialData?.date)} required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Data e Ora Fine</label>
                        <input type="datetime-local" name="endDate" defaultValue={dateToInputValue(initialData?.endDate)} className={inputClass} />
                        <p className="text-xs text-zinc-400 mt-1">Solo per eventi multi-giorno</p>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className={labelClass}>Luogo *</label>
                    <input name="location" defaultValue={initialData?.location} required className={inputClass} placeholder="Es: Aula Magna – Rettorato UniMe" />
                </div>

                {/* Category */}
                <div>
                    <label className={labelClass}>Categoria *</label>
                    <select name="category" defaultValue={initialData?.category || ""} className={cn(inputClass, "bg-white")} required>
                        <option value="" disabled>Seleziona...</option>
                        {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Association */}
                <div>
                    <label className={labelClass}>Associazione Organizzatrice</label>
                    <select name="association" defaultValue={initialData?.association || "Morgana & O.R.U.M."} className={cn(inputClass, "bg-white")} required>
                        <option value="Morgana">Morgana</option>
                        <option value="O.R.U.M.">O.R.U.M.</option>
                        <option value="Morgana & O.R.U.M.">Morgana & O.R.U.M.</option>
                    </select>
                </div>

                {/* CFU Advanced Section */}
                <div className="border-t border-zinc-100 pt-6">
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">Crediti Formativi Universitari (CFU)</h3>

                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Valore CFU (lascia vuoto se non previsti)</label>
                            <input name="cfuValue" defaultValue={initialData?.cfuValue || ""} className={inputClass} placeholder="Es: 1 or 0.5" />
                        </div>

                        {/* Radio for CFU Type */}
                        <div>
                            <label className={labelClass}>Validità CFU</label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cfuTypeRadio"
                                        value="SENATO"
                                        checked={cfuType === "SENATO"}
                                        onChange={() => setCfuType("SENATO")}
                                        className="size-4 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <span className="text-sm font-medium text-zinc-700">Senato (Tutto l&apos;ateneo)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cfuTypeRadio"
                                        value="DIPARTIMENTO"
                                        checked={cfuType === "DIPARTIMENTO"}
                                        onChange={() => setCfuType("DIPARTIMENTO")}
                                        className="size-4 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    <span className="text-sm font-medium text-zinc-700">Specifici Dipartimenti</span>
                                </label>
                            </div>
                        </div>

                        {/* Department Checkboxes */}
                        {cfuType === "DIPARTIMENTO" && (
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                <label className="block text-xs font-bold text-zinc-700 mb-3 uppercase tracking-wider">Seleziona Dipartimenti</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {DEPARTMENTS_LIST.map(dep => (
                                        <label key={dep} className="flex items-start gap-2 p-2 hover:bg-zinc-100 rounded-lg cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mt-1 size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                checked={selectedDeps.has(dep)}
                                                onChange={(e) => {
                                                    const next = new Set(selectedDeps)
                                                    if (e.target.checked) next.add(dep)
                                                    else next.delete(dep)
                                                    setSelectedDeps(next)
                                                }}
                                            />
                                            <span className="text-sm text-zinc-700 leading-tight">{dep}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Section */}
                <div className="border-t border-zinc-100 pt-6">
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">Prenotazione</h3>

                    {/* Booking Open Toggle */}
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setBookingOpen(!bookingOpen)}
                            className={cn(
                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                                bookingOpen ? "bg-green-500" : "bg-zinc-300"
                            )}
                        >
                            <span className={cn(
                                "inline-block size-4 transform rounded-full bg-white transition-transform shadow-sm",
                                bookingOpen ? "translate-x-6" : "translate-x-1"
                            )} />
                        </button>
                        <label className="text-sm font-bold text-zinc-700">
                            Prenotazione {bookingOpen ? "aperta" : "chiusa"}
                        </label>
                    </div>

                    {/* Booking Dates */}
                    {bookingOpen && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Apertura prenotazione</label>
                                <input type="datetime-local" name="bookingStart" defaultValue={dateToInputValue(initialData?.bookingStart)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Chiusura prenotazione</label>
                                <input type="datetime-local" name="bookingEnd" defaultValue={dateToInputValue(initialData?.bookingEnd)} className={inputClass} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Attachments */}
                <div className="border-t border-zinc-100 pt-6">
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Allegati</h3>
                    <p className="text-xs text-zinc-400 mb-4">Carica i documenti (es. Programma completo, locandina PDF).</p>

                    <div className="space-y-4">
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setAttachmentFiles(prev => [...prev, ...Array.from(e.target.files!)])
                                }
                                e.target.value = '' // Reset
                            }}
                            className={cn(inputClass, "pt-2")}
                            title="Carica documenti"
                        />

                        {/* List Existing */}
                        {existingAttachments.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-zinc-700">File già presenti:</p>
                                {existingAttachments.map((url, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg border border-zinc-200 text-sm">
                                        <div className="flex items-center gap-2 truncate">
                                            <File className="size-4 text-zinc-400 shrink-0" />
                                            <a href={url} target="_blank" rel="noreferrer" className="truncate text-blue-600 hover:underline">{url.split('/').pop()}</a>
                                        </div>
                                        <button type="button" onClick={() => setExistingAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-500">
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* List New */}
                        {attachmentFiles.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-zinc-700">File da caricare:</p>
                                {attachmentFiles.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg border border-blue-100 text-sm">
                                        <div className="flex items-center gap-2 truncate">
                                            <Upload className="size-4 text-blue-400 shrink-0" />
                                            <span className="truncate text-blue-900">{file.name}</span>
                                        </div>
                                        <button type="button" onClick={() => setAttachmentFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-zinc-400 hover:text-red-500">
                                            <X className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isPending ? <><Loader2 className="size-4 animate-spin" /> Salvataggio...</> : <><Save className="size-4" /> {initialData ? "Aggiorna Evento" : "Crea Evento"}</>}
                </button>
            </form>
        </div>
    )
}
