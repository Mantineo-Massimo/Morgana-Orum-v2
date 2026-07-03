"use client"

import { createNews, updateNews } from "@/app/actions/news"
import { Association } from "@prisma/client"
import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon, Sparkles, File } from "lucide-react"
import { translateText } from "@/app/actions/translate"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { MediaSelector } from "@/components/admin/media-selector"
import { getRomeParts, toUtcFromRome } from "@/lib/date"




export default function NewsForm({
    initialData,
    categories = [],
    userRole,
    userAssociation,
    isModal = false,
    onSuccess
}: {
    initialData?: any,
    categories?: string[],
    userRole?: string,
    userAssociation?: Association,
    isModal?: boolean,
    onSuccess?: () => void
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null)
    const [isUploading, setIsUploading] = useState(false)
    const [isMediaOpen, setIsMediaOpen] = useState(false)
    const [isAttachmentMediaOpen, setIsAttachmentMediaOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEditing = !!initialData?.id
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData?.category ? initialData.category.split(",").map((c: string) => c.trim()) : []
    )
    const selectedAssociations = useMemo(() => [Association.MORGANA_ORUM], [])

    // Attachments state
    type AttachmentItem = { name: string; url: string }
    const [newAttachments, setNewAttachments] = useState<{ file: File; name: string }[]>([])
    const [existingAttachments, setExistingAttachments] = useState<AttachmentItem[]>(() => {
        if (!initialData?.attachments) return []
        try {
            const parsed = JSON.parse(initialData.attachments)
            if (Array.isArray(parsed)) return parsed
        } catch (e) {
            // Support legacy comma-separated format
            return initialData.attachments.split(',').map((url: string) => ({
                name: url.split('/').pop() || "Documento",
                url: url.trim()
            })).filter((a: any) => a.url)
        }
        return []
    })

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

    // Translation states
    const [isTranslating, setIsTranslating] = useState(false)
    const [titleEn, setTitleEn] = useState(initialData?.titleEn || "")
    const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn || "")
    const [contentEn, setContentEn] = useState(initialData?.contentEn || "")

    // Italian content state (for RichTextEditor)
    const [content, setContent] = useState(initialData?.content || "")

    // Refs for Italian fields to read their current values
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)

    async function handleTranslate() {
        const italianTitle = titleRef.current?.value || ""
        const italianDescription = descriptionRef.current?.value || ""
        const italianContent = content || ""

        if (!italianTitle && !italianDescription && !italianContent) {
            setError("Inserisci almeno un testo in italiano da tradurre.")
            return
        }

        setIsTranslating(true)
        setError(null)

        try {
            const results = await Promise.all([
                italianTitle ? translateText(italianTitle) : Promise.resolve({ success: true, translation: "" }),
                italianDescription ? translateText(italianDescription) : Promise.resolve({ success: true, translation: "" }),
                italianContent ? translateText(italianContent) : Promise.resolve({ success: true, translation: "" })
            ])

            if (results[0].success) setTitleEn(results[0].translation || "")
            if (results[1].success) setDescriptionEn(results[1].translation || "")
            if (results[2].success) setContentEn(results[2].translation || "")

            if (results.some(r => !r.success)) {
                setError("La traduzione automatica ha avuto qualche problema, ma abbiamo tradotto il possibile.")
            }
        } catch (err) {
            setError("Errore durante la traduzione automatica.")
        } finally {
            setIsTranslating(false)
        }
    }

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

        try {
            // Upload new attachments and combine with existing
            const finalAttachmentList: AttachmentItem[] = [...existingAttachments]

            for (const item of newAttachments) {
                const url = await uploadFile(item.file, "attachments")
                finalAttachmentList.push({
                    name: item.name || item.file.name,
                    url
                })
            }

            const toISO = (val: string | null | undefined) => {
                if (!val) return undefined
                const d = toUtcFromRome(val)
                return isNaN(d.getTime()) ? undefined : d.toISOString()
            }

            const rawData = {
                title: formData.get("title") as string,
                titleEn: titleEn || null,
                description: formData.get("description") as string,
                descriptionEn: descriptionEn || null,
                content: content || null,
                contentEn: contentEn || null,
                category: selectedCategories.join(", "),
                tags: formData.get("tags") as string || null,
                image: imageUrl || null,
                attachments: finalAttachmentList.length > 0 ? JSON.stringify(finalAttachmentList) : null,
                date: toISO(combinedDate),
                published: formData.get("published") === "on",
                associations: selectedAssociations,
            }

            const result = isEditing
                ? await updateNews(initialData.id, rawData)
                : await createNews(rawData)

            if (result.success) {
                if (isModal && onSuccess) {
                    onSuccess()
                } else {
                    router.push(`/admin/news`)
                    router.refresh()
                }
            } else {
                setError(result.error || "Errore sconosciuto")
                setIsLoading(false)
            }
        } catch (err: any) {
            setError(err.message || "Errore durante il caricamento dei file")
            setIsLoading(false)
        }
    }

    const initDate = initialData?.date ? new Date(initialData.date) : new Date()
    const parts = getRomeParts(initDate)
    const [dateDay, setDateDay] = useState(String(parts.day).padStart(2, '0'))
    const [dateMonth, setDateMonth] = useState(String(parts.month).padStart(2, '0'))
    const [dateYear, setDateYear] = useState(String(parts.year))
    const [dateHour, setDateHour] = useState(String(parts.hour).padStart(2, '0'))
    const [dateMinute, setDateMinute] = useState(String(parts.minute).padStart(2, '0'))

    // Combine into a date string WITHOUT UTC conversion
    // Format: YYYY-MM-DDTHH:mm (parsed by server as local time)
    const combinedDate = useMemo(() => {
        const y = (dateYear || '2025').padStart(4, '0')
        const m = (dateMonth || '01').padStart(2, '0')
        const d = (dateDay || '01').padStart(2, '0')
        const h = (dateHour || '00').padStart(2, '0')
        const min = (dateMinute || '00').padStart(2, '0')
        return `${y}-${m}-${d}T${h}:${min}:00`
    }, [dateDay, dateMonth, dateYear, dateHour, dateMinute])

    const inputClass = "w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-sm font-semibold transition-all"
    const labelClass = "block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5"

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                {!isModal && (
                    <Link
                        href={`/admin/news`}
                        className="text-zinc-500 hover:text-foreground flex items-center gap-2 text-sm font-medium mb-4"
                    >
                        <ArrowLeft className="size-4" /> Torna alla lista
                    </Link>
                )}
                {!isModal && (
                    <>
                        <h1 className="text-3xl font-bold text-foreground">
                            {isEditing ? "Modifica Notizia" : "Nuova Notizia"}
                        </h1>
                        <p className="text-zinc-500">
                            {isEditing ? "Aggiorna i dettagli" : "Pubblica una nuova notizia"}
                        </p>
                    </>
                )}
            </div>

            <form action={handleSubmit} className={cn("bg-white border border-zinc-100 rounded-xl p-8 shadow-sm space-y-6", isModal && "border-none shadow-none p-0")}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className={labelClass}>Immagine di Copertina</label>
                        <div className="flex items-start gap-6">
                            <div className="relative w-24 h-16 rounded-lg bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                                {imageUrl ? (
                                    <>
                                        <Image src={imageUrl} alt="Preview" fill sizes="(max-width: 768px) 100vw, 96px" className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl(null)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors z-10"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="size-6 text-zinc-400" />
                                )}
                            </div>
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

                    {/* Title */}
                    <div>
                        <label className={labelClass}>Titolo</label>
                        <input
                            ref={titleRef}
                            name="title"
                            defaultValue={initialData?.title}
                            required
                            className={inputClass}
                            placeholder="Titolo della notizia..."
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Descrizione Breve</label>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            defaultValue={initialData?.description}
                            required
                            rows={2}
                            className={cn(inputClass, "resize-y")}
                            placeholder="Breve riassunto che appare nella card..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className={labelClass}>Contenuto Completo (Rich Text)</label>
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                            placeholder="Scrivi il corpo della notizia qui..."
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Traduzione Inglese (EN)</h3>
                            <button
                                type="button"
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
                            >
                                {isTranslating ? (
                                    <Loader2 className="size-3 animate-spin" />
                                ) : (
                                    <Sparkles className="size-3" />
                                )}
                                Traduci in automatico
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Titolo (EN)</label>
                                <input
                                    name="titleEn"
                                    value={titleEn}
                                    onChange={(e) => setTitleEn(e.target.value)}
                                    className={inputClass}
                                    placeholder="English title..."
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Descrizione Breve (EN)</label>
                                <textarea
                                    name="descriptionEn"
                                    value={descriptionEn}
                                    onChange={(e) => setDescriptionEn(e.target.value)}
                                    rows={2}
                                    className={cn(inputClass, "resize-y")}
                                    placeholder="Short English description..."
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Contenuto Completo (EN - Rich Text)</label>
                                <RichTextEditor
                                    value={contentEn}
                                    onChange={setContentEn}
                                    placeholder="Full English content..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categorie (multi) */}
                    <div>
                        <label className={labelClass}>Categorie</label>
                        <input type="hidden" name="category" value={selectedCategories.join(", ")} />
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => {
                                const isSelected = selectedCategories.includes(cat)
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategories(isSelected ? [] : [cat])
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                            isSelected
                                                ? "bg-zinc-900 text-white border-zinc-900"
                                                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                        )}
                                    >
                                        {isSelected && "✓ "}{cat}
                                    </button>
                                )
                            })}
                        </div>
                        {selectedCategories.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">Seleziona almeno una categoria</p>
                        )}
                    </div>



                    {/* Date - Italian format */}
                    <div>
                        <label className={labelClass}>Data di Pubblicazione</label>
                        <input type="hidden" name="date" value={combinedDate} />
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateDay}
                                    onChange={(e) => setDateDay(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="GG"
                                    className="w-12 px-2 py-2 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-center text-sm font-semibold transition-all"
                                />
                                <span className="text-zinc-400 font-bold">/</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateMonth}
                                    onChange={(e) => setDateMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    className="w-12 px-2 py-2 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-center text-sm font-semibold transition-all"
                                />
                                <span className="text-zinc-400 font-bold">/</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={dateYear}
                                    onChange={(e) => setDateYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="AAAA"
                                    className="w-16 px-2 py-2 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-center text-sm font-semibold transition-all"
                                />
                            </div>
                            <span className="text-zinc-400 font-bold">—</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateHour}
                                    onChange={(e) => setDateHour(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="HH"
                                    className="w-12 px-2 py-2 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-center text-sm font-semibold transition-all"
                                />
                                <span className="text-zinc-400 font-bold">:</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateMinute}
                                    onChange={(e) => setDateMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    className="w-12 px-2 py-2 bg-slate-50 border border-slate-200/60 rounded-xl outline-none focus:ring-2 focus:ring-[#c9041a]/10 focus:border-[#c9041a]/50 text-center text-sm font-semibold transition-all"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">GG/MM/AAAA — HH:MM (formato 24h)</p>
                        <p className="text-xs text-amber-600 mt-0.5">⏰ Una data futura = pubblicazione programmata</p>
                    </div>

                    {/* Attachments */}
                    <div className="border-t border-zinc-100 pt-6">
                        <label className={labelClass}>Documenti Allegati</label>
                        <p className="text-xs text-zinc-400 mb-4">Carica e dai un nome ai documenti (es. Programma completo, locandina PDF).</p>

                        <div className="space-y-4">
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const files = Array.from(e.target.files)
                                        setNewAttachments(prev => [
                                            ...prev,
                                            ...files.map(f => ({ file: f, name: f.name.split('.').slice(0, -1).join('.') }))
                                        ])
                                    }
                                    e.target.value = '' // Reset
                                }}
                                className={cn(inputClass, "pt-2")}
                                title="Carica documenti"
                            />
                            <button
                                type="button"
                                onClick={() => setIsAttachmentMediaOpen(true)}
                                className="w-full py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <ImageIcon className="size-3.5 text-zinc-500" />
                                Oppure scegli dalla Libreria Media
                            </button>

                            {/* List Existing */}
                            {existingAttachments.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">File già presenti:</p>
                                    {existingAttachments.map((att, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <File className="size-4 text-zinc-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={att.name}
                                                    onChange={(e) => {
                                                        const next = [...existingAttachments]
                                                        next[i] = { ...next[i], name: e.target.value }
                                                        setExistingAttachments(next)
                                                    }}
                                                    className="bg-transparent border-none focus:ring-2 focus:ring-zinc-900/5 rounded px-2 py-1 text-sm font-medium text-foreground w-full"
                                                    placeholder="Nome allegato..."
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 justify-end shrink-0">
                                                <a href={att.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline font-bold">Visualizza</a>
                                                <button
                                                    type="button"
                                                    onClick={() => setExistingAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* List New */}
                            {newAttachments.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">File da caricare:</p>
                                    {newAttachments.map((item, i) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Upload className="size-4 text-blue-400 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => {
                                                        const next = [...newAttachments]
                                                        next[i] = { ...next[i], name: e.target.value }
                                                        setNewAttachments(next)
                                                    }}
                                                    className="bg-transparent border-none focus:ring-2 focus:ring-blue-900/5 rounded px-2 py-1 text-sm font-medium text-blue-900 w-full"
                                                    placeholder="Nome allegato..."
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 justify-end shrink-0">
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">{item.file.name.split('.').pop()?.toUpperCase()}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className={labelClass}>Tags (separati da virgola)</label>
                        <input
                            name="tags"
                            defaultValue={initialData?.tags ?? ""}
                            className={inputClass}
                            placeholder="#Solidarietà, #UniMe, #Natale2025"
                        />
                    </div>

                    {/* Published */}
                    <div className="flex items-center gap-3">
                        <input
                            name="published"
                            type="checkbox"
                            defaultChecked={initialData?.published ?? true}
                            className="size-4 rounded border-slate-300 text-[#c9041a] focus:ring-[#c9041a]/50 focus:ring-offset-0"
                        />
                        <label className="text-sm font-bold text-slate-700">Pubblica immediatamente</label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-br from-[#c12830] to-[#18182e] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Salvataggio in corso...</span>
                            </>
                        ) : (
                            <>
                                <Save className="size-5" />
                                <span>{isEditing ? "Salva Modifiche" : "Pubblica Notizia"}</span>
                            </>
                        )}
                    </button>
                </div>
            </form >

            <MediaSelector
                isOpen={isMediaOpen}
                onClose={() => setIsMediaOpen(false)}
                onSelect={(url) => setImageUrl(url)}
            />
            <MediaSelector
                isOpen={isAttachmentMediaOpen}
                onClose={() => setIsAttachmentMediaOpen(false)}
                onSelect={(url, name) => {
                    const cleanName = name || url.split('/').pop() || "Documento"
                    setExistingAttachments(prev => [...prev, { name: cleanName, url }])
                }}
            />
        </div >
    )
}
