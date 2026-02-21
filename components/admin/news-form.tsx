"use client"

import { createNews, updateNews } from "@/app/actions/news"
import { useState, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ASSOCIATIONS } from "@/lib/associations"


export default function NewsForm({
    initialData,
    categories = []
}: {
    initialData?: any,
    categories?: string[]
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEditing = !!initialData
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialData?.category ? initialData.category.split(",").map((c: string) => c.trim()) : []
    )
    const [selectedAssociations, setSelectedAssociations] = useState<string[]>(
        initialData?.association ? initialData.association.split(",").map((a: string) => a.trim()) : ["morgana-orum"]
    )

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
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            content: formData.get("content") as string || null,
            category: selectedCategories.join(", "),
            tags: formData.get("tags") as string || null,
            image: imageUrl || null,
            date: formData.get("date") as string || undefined,
            published: formData.get("published") === "on",
            association: selectedAssociations.join(", "),
        }

        const result = isEditing
            ? await updateNews(initialData.id, rawData)
            : await createNews(rawData)

        if (result.success) {
            router.push(`/admin/news`)
            router.refresh()
        } else {
            setError(result.error || "Errore sconosciuto")
            setIsLoading(false)
        }
    }

    const initDate = initialData?.date ? new Date(initialData.date) : new Date()
    const [dateDay, setDateDay] = useState(String(initDate.getDate()).padStart(2, '0'))
    const [dateMonth, setDateMonth] = useState(String(initDate.getMonth() + 1).padStart(2, '0'))
    const [dateYear, setDateYear] = useState(String(initDate.getFullYear()))
    const [dateHour, setDateHour] = useState(String(initDate.getHours()).padStart(2, '0'))
    const [dateMinute, setDateMinute] = useState(String(initDate.getMinutes()).padStart(2, '0'))

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

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link
                    href={`/admin/news`}
                    className="text-zinc-500 hover:text-foreground flex items-center gap-2 text-sm font-medium mb-4"
                >
                    <ArrowLeft className="size-4" /> Torna alla lista
                </Link>
                <h1 className="text-3xl font-bold text-foreground">
                    {isEditing ? "Modifica Notizia" : "Nuova Notizia"}
                </h1>
                <p className="text-zinc-500">
                    {isEditing ? "Aggiorna i dettagli" : "Pubblica una nuova notizia"}
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
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Immagine di Copertina</label>
                        <div className="flex items-start gap-6">
                            <div className="relative w-24 h-16 rounded-lg bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                                    <ImageIcon className="size-6 text-zinc-400" />
                                )}
                            </div>
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

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Titolo</label>
                        <input
                            name="title"
                            defaultValue={initialData?.title}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                            placeholder="Titolo della notizia..."
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Descrizione Breve</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            required
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-y"
                            placeholder="Breve riassunto che appare nella card..."
                        />
                    </div>



                    {/* Content */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Contenuto Completo (Opzionale)</label>
                        <textarea
                            name="content"
                            defaultValue={initialData?.content ?? ""}
                            rows={8}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all resize-y"
                            placeholder="Testo completo dell'articolo..."
                        />
                    </div>

                    {/* Categorie (multi) */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Categorie</label>
                        <input type="hidden" name="category" value={selectedCategories.join(", ")} />
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => {
                                const isSelected = selectedCategories.includes(cat)
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategories(prev =>
                                                isSelected
                                                    ? prev.filter(c => c !== cat)
                                                    : [...prev, cat]
                                            )
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
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Data di Pubblicazione</label>
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
                                    className="w-12 px-2 py-2 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                />
                                <span className="text-zinc-400 font-bold">/</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateMonth}
                                    onChange={(e) => setDateMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    className="w-12 px-2 py-2 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                />
                                <span className="text-zinc-400 font-bold">/</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={dateYear}
                                    onChange={(e) => setDateYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="AAAA"
                                    className="w-16 px-2 py-2 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
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
                                    className="w-12 px-2 py-2 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                />
                                <span className="text-zinc-400 font-bold">:</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={2}
                                    value={dateMinute}
                                    onChange={(e) => setDateMinute(e.target.value.replace(/\D/g, '').slice(0, 2))}
                                    placeholder="MM"
                                    className="w-12 px-2 py-2 rounded-lg border border-zinc-200 text-center text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">GG/MM/AAAA — HH:MM (formato 24h)</p>
                        <p className="text-xs text-amber-600 mt-0.5">⏰ Una data futura = pubblicazione programmata</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Tags (separati da virgola)</label>
                        <input
                            name="tags"
                            defaultValue={initialData?.tags ?? ""}
                            className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                            placeholder="#Solidarietà, #UniMe, #Natale2025"
                        />
                    </div>

                    {/* Associazioni (multi) */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">Associazioni (Zone)</label>
                        <div className="flex flex-wrap gap-2">
                            {ASSOCIATIONS.map(assoc => {
                                const isSelected = selectedAssociations.includes(assoc.id)
                                return (
                                    <button
                                        key={assoc.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAssociations(prev =>
                                                isSelected
                                                    ? prev.filter(a => a !== assoc.id)
                                                    : [...prev, assoc.id]
                                            )
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-xs font-bold border transition-all uppercase tracking-wider",
                                            isSelected
                                                ? "bg-zinc-900 text-white border-zinc-900 shadow-md"
                                                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
                                        )}
                                    >
                                        {isSelected && "✓ "}{assoc.name}
                                    </button>
                                )
                            })}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-2 font-medium italic">Seleziona in quali zone/siti web deve comparire la notizia.</p>
                    </div>

                    {/* Published */}
                    <div className="flex items-center gap-3">
                        <input
                            name="published"
                            type="checkbox"
                            defaultChecked={initialData?.published ?? true}
                            className="size-4 rounded border-zinc-300"
                        />
                        <label className="text-sm font-bold text-zinc-700">Pubblica immediatamente</label>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                        {isEditing ? "Salva Modifiche" : "Pubblica Notizia"}
                    </button>
                </div>
            </form>
        </div>
    )
}
