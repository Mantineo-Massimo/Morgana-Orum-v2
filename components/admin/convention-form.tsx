"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, X, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createConvention, updateConvention } from "@/app/actions/conventions"

type ConventionFormProps = {
    initialData?: {
        id: string
        name: string
        category: string
        social: string | null
        logo: string | null
        website: string | null
        location: string
        discounts: string[]
    }
}

const CONVENTION_CATEGORIES = [
    "Bar", "Ristorante", "Palestra", "Abbigliamento", "Benessere",
    "Copisteria", "Libreria", "Sport", "Informatica", "Trasporti", "Altro"
]

const LOCATIONS = ["Messina", "Melilli"]

export default function ConventionForm({ initialData }: ConventionFormProps) {
    const router = useRouter()
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState("")

    // Discounts state (dynamic list)
    const [discounts, setDiscounts] = useState<string[]>(initialData?.discounts || [""])

    // Logo state
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null)

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

    const addDiscount = () => {
        if (discounts.length < 7) {
            setDiscounts([...discounts, ""])
        }
    }

    const removeDiscount = (index: number) => {
        const next = discounts.filter((_, i) => i !== index)
        setDiscounts(next.length ? next : [""])
    }

    const updateDiscount = (index: number, value: string) => {
        const next = [...discounts]
        next[index] = value
        setDiscounts(next)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsPending(true)
        setError("")

        try {
            const formData = new FormData(e.currentTarget)

            // Upload logo if new one selected
            let logoUrl = logoPreview
            if (logoFile) {
                logoUrl = await uploadFile(logoFile, "conventions")
            }

            const cleanDiscounts = discounts.filter(d => d.trim() !== "")

            const rawData = {
                name: formData.get("name") as string,
                category: formData.get("category") as string,
                location: formData.get("location") as string,
                social: (formData.get("social") as string) || undefined,
                website: (formData.get("website") as string) || undefined,
                logo: logoUrl || undefined,
                discounts: cleanDiscounts,
            }

            const result = initialData
                ? await updateConvention(initialData.id, rawData)
                : await createConvention(rawData)

            if (result.success) {
                router.push(`/admin/conventions`)
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
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="mb-8">
                <Link
                    href={`/admin/conventions`}
                    className="text-zinc-500 hover:text-foreground flex items-center gap-2 text-sm font-medium mb-4"
                >
                    <ArrowLeft className="size-4" /> Torna alla lista
                </Link>
                <h1 className="text-3xl font-bold text-foreground">
                    {initialData ? "Modifica Convenzione" : "Nuova Convenzione"}
                </h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                {/* Logo */}
                <div>
                    <label className={labelClass}>Logo Attività</label>
                    <div className="flex items-start gap-4">
                        {logoPreview && (
                            <div className="relative size-24 rounded-full overflow-hidden bg-white shrink-0 border-2 border-zinc-100 shadow-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setLogoPreview(null); setLogoFile(null) }}
                                    className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-zinc-700 hover:text-red-500 hover:bg-white"
                                >
                                    <X className="size-3" />
                                </button>
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        setLogoFile(file)
                                        setLogoPreview(URL.createObjectURL(file))
                                    }
                                }}
                                className={cn(inputClass, "pt-2")}
                            />
                            <p className="text-xs text-zinc-500 mt-2">Logo dell&apos;attività. Max 5MB (PNG/JPG consigliato).</p>
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className={labelClass}>Nome Attività *</label>
                    <input name="name" defaultValue={initialData?.name} required className={inputClass} placeholder="Es: Pasticceria Camarda" />
                </div>

                {/* Location & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Località *</label>
                        <select name="location" defaultValue={initialData?.location || ""} className={cn(inputClass, "bg-white")} required>
                            <option value="" disabled>Seleziona...</option>
                            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClass}>Categoria *</label>
                        <select name="category" defaultValue={initialData?.category || ""} className={cn(inputClass, "bg-white")} required>
                            <option value="" disabled>Seleziona...</option>
                            {CONVENTION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Profilo Social (Instagram/Facebook)</label>
                        <input name="social" defaultValue={initialData?.social || ""} className={inputClass} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                        <label className={labelClass}>Sito Web</label>
                        <input name="website" defaultValue={initialData?.website || ""} className={inputClass} placeholder="https://www.esempio.it" />
                    </div>
                </div>

                {/* Discounts Section */}
                <div className="border-t border-zinc-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">Sconti e Agevolazioni</h3>
                        <button
                            type="button"
                            onClick={addDiscount}
                            disabled={discounts.length >= 7}
                            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Plus className="size-3" /> Aggiungi Riga
                        </button>
                    </div>

                    <div className="space-y-3">
                        {discounts.map((discount, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        value={discount}
                                        onChange={(e) => updateDiscount(index, e.target.value)}
                                        placeholder={`Sconto ${index + 1} (es: 10% di sconto su tutto)`}
                                        className={inputClass}
                                    />
                                </div>
                                {discounts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeDiscount(index)}
                                        className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-zinc-400 mt-3">Inserisci fino a 7 righe di offerta. Verranno salvate solo quelle non vuote.</p>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isPending ? <><Loader2 className="size-4 animate-spin" /> Salvataggio...</> : <><Save className="size-4" /> {initialData ? "Aggiorna Convenzione" : "Crea Convenzione"}</>}
                </button>
            </form>
        </div>
    )
}
