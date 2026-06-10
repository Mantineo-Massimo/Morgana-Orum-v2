"use client"

import { useState } from "react"
import { FileDown, Image as ImageIcon, Paintbrush, FileText, Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export const dynamic = "force-dynamic"

type BrandColor = {
    name: string
    hex: string
    desc: string
}

type BrandAsset = {
    titleKey: string
    logoUrl: string
    filename: string
    colors: BrandColor[]
}

const BRANDS: BrandAsset[] = [
    {
        titleKey: "morgana_title",
        logoUrl: "/assets/morgana.webp",
        filename: "associazione_morgana",
        colors: [
            { name: "Morgana Red", hex: "#c12830", desc: "Colore primario istituzionale" },
            { name: "Charcoal Black", hex: "#1c1c1e", desc: "Testi e contrasti scuri" },
            { name: "Soft Gray", hex: "#f4f4f5", desc: "Sfondi e bordi neutri" }
        ]
    },
    {
        titleKey: "orum_title",
        logoUrl: "/assets/orum.webp",
        filename: "associazione_orum",
        colors: [
            { name: "Orum Navy", hex: "#18182e", desc: "Colore primario istituzionale" },
            { name: "Morgana Red", hex: "#c12830", desc: "Bordo e dettagli secondari" },
            { name: "Pure White", hex: "#ffffff", desc: "Sfondi e contrasti chiari" }
        ]
    },
    {
        titleKey: "matricole_title",
        logoUrl: "/assets/unimematricole.webp",
        filename: "unime_matricole",
        colors: [
            { name: "Matricole Navy", hex: "#0a3a60", desc: "Colore primario dei testi" },
            { name: "Matricole Yellow", hex: "#f9a620", desc: "Colore secondario del nastro" },
            { name: "Pure White", hex: "#ffffff", desc: "Sfondo del logo circolare" }
        ]
    },
    {
        titleKey: "unimhealth_title",
        logoUrl: "/assets/unimhealth.webp",
        filename: "unimhealth",
        colors: [
            { name: "Unimhealth Red", hex: "#c12830", desc: "Colore primario del cerchio" },
            { name: "Pure White", hex: "#ffffff", desc: "Elemento anatomico interno" },
            { name: "Soft Rose", hex: "#fef2f2", desc: "Tono di sfondo e dettagli" }
        ]
    },
    {
        titleKey: "economia_title",
        logoUrl: "/assets/studentieconomia.webp",
        filename: "studenti_economia",
        colors: [
            { name: "Economia Navy", hex: "#18224b", desc: "Colore primario del cerchio" },
            { name: "Warm Silver", hex: "#e2e8f0", desc: "Dettagli di contrasto neutri" },
            { name: "Pure White", hex: "#ffffff", desc: "Icona ed elementi interni" }
        ]
    },
    {
        titleKey: "scipog_title",
        logoUrl: "/assets/studentiscipog.webp",
        filename: "studenti_scipog",
        colors: [
            { name: "Scipog Gold", hex: "#f4b43b", desc: "Colore primario del cerchio" },
            { name: "Dark Charcoal", hex: "#212529", desc: "Testi ed elemento di contorno" },
            { name: "Pure White", hex: "#ffffff", desc: "Dettagli interni del tocco" }
        ]
    },
    {
        titleKey: "dicam_title",
        logoUrl: "/assets/insidedicam.webp",
        filename: "inside_dicam",
        colors: [
            { name: "Dicam Cyan", hex: "#00b4d8", desc: "Cerchio esterno e testo 'inside'" },
            { name: "Dicam Pink", hex: "#d81b60", desc: "Cerchio interno e testo 'DICAM'" },
            { name: "Pure White", hex: "#ffffff", desc: "Sfondo del cerchio interno" }
        ]
    },
    {
        titleKey: "piazza_title",
        logoUrl: "/assets/piazzadellarte.webp",
        filename: "piazza_dell_arte",
        colors: [
            { name: "Piazza Gold", hex: "#f9a620", desc: "Colore primario 'Piazza'" },
            { name: "Piazza Green", hex: "#27a85d", desc: "Colore secondario 'dell'Arte'" },
            { name: "Piazza Cyan", hex: "#1fbcd3", desc: "Accento ciano dello sfondo" }
        ]
    }
]

export default function MediaKitPage() {
    const t = useTranslations("MediaKitPage")
    const [downloading, setDownloading] = useState<Record<string, boolean>>({})
    const [copiedColor, setCopiedColor] = useState<string | null>(null)

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex)
        setCopiedColor(hex)
        setTimeout(() => setCopiedColor(null), 2000)
    }

    const handleDownload = async (key: string, fn: () => Promise<void> | void) => {
        setDownloading(prev => ({ ...prev, [key]: true }))
        try {
            await fn()
        } catch (e) {
            console.error("Download failed for key:", key, e)
        } finally {
            setTimeout(() => {
                setDownloading(prev => ({ ...prev, [key]: false }))
            }, 1500)
        }
    }

    const downloadAsWebp = (url: string, filename: string) => {
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.webp`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const downloadAsPng = async (url: string, filename: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const objectUrl = URL.createObjectURL(blob)

            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = img.naturalWidth || img.width || 512
                canvas.height = img.naturalHeight || img.height || 512
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(img, 0, 0)
                    const dataUrl = canvas.toDataURL("image/png")
                    const a = document.createElement("a")
                    a.href = dataUrl
                    a.download = `${filename}.png`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                }
                URL.revokeObjectURL(objectUrl)
            }
            img.src = objectUrl
        } catch (err) {
            console.error("Failed to download PNG", err)
        }
    }

    const downloadAsSvg = async (url: string, filename: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.readAsDataURL(blob)
            })
            const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="${base64}" width="512" height="512" />
</svg>`
            const svgBlob = new Blob([svgContent], { type: "image/svg+xml" })
            const objectUrl = URL.createObjectURL(svgBlob)
            const a = document.createElement("a")
            a.href = objectUrl
            a.download = `${filename}.svg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(objectUrl)
        } catch (err) {
            console.error("Failed to download SVG", err)
        }
    }

    const downloadGuidelinesPdf = async () => {
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            // Header Section
            doc.setFillColor(24, 24, 46) // Orum Blue (#18182e)
            doc.rect(0, 0, 210, 50, "F")

            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(22)
            doc.text("BRAND MANUAL & VISUAL IDENTITY", 20, 28)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text("Official Guidelines and Brand Identity Manual", 20, 38)

            // Section 1: Introduction
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(16)
            doc.text("1. INTRODUCTION", 20, 70)
            
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(60, 60, 60)
            const introText = [
                "This document contains the guidelines for the visual representation of our brand network,",
                "including Associazione Morgana, Associazione O.R.U.M., Unime Matricole, and other associated",
                "organizations. Consistency in design, color usage, and logo placement is essential to maintain",
                "our identity's integrity and professional presence across all channels."
            ]
            doc.text(introText, 20, 80)

            // Section 2: Color Palette
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(16)
            doc.text("2. COLOR PALETTE SYSTEM", 20, 115)

            // Draw color boxes and details
            const colors = [
                { name: "Morgana Red", hex: "#C12830", rgb: [193, 40, 48], desc: "Primary color for Associazione Morgana." },
                { name: "Orum Blue", hex: "#18182E", rgb: [24, 24, 46], desc: "Primary color for Associazione O.R.U.M." },
                { name: "Piazza Gold", hex: "#F9A620", rgb: [249, 166, 32], desc: "Primary color for Piazza dell'Arte (Gold)." },
                { name: "Piazza Green", hex: "#27A85D", rgb: [39, 168, 93], desc: "Secondary color for Piazza dell'Arte (Green)." },
                { name: "Piazza Cyan", hex: "#1FBCD3", rgb: [31, 188, 211], desc: "Accent color for Piazza dell'Arte (Cyan)." }
            ]

            let startY = 125
            colors.forEach((c) => {
                // Color preview box
                doc.setFillColor(c.rgb[0], c.rgb[1], c.rgb[2])
                doc.rect(20, startY, 15, 15, "F")
                
                // Color Info
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(11)
                doc.text(c.name, 42, startY + 6)
                doc.setFont("helvetica", "normal")
                doc.setFontSize(10)
                doc.setTextColor(120, 120, 120)
                doc.text(`HEX: ${c.hex} | RGB: (${c.rgb.join(", ")})`, 42, startY + 12)
                
                doc.setTextColor(60, 60, 60)
                doc.setFontSize(9)
                doc.text(c.desc, 110, startY + 9)
                
                startY += 22
            })

            // Section 3: Rules & Guidelines
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(16)
            doc.text("3. LOGO USAGE GUIDELINES", 20, 245)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(60, 60, 60)
            const usageRules = [
                "- Always use the high-resolution vector (SVG) version when scaling or printing logos.",
                "- Do not alter, stretch, skew, or rotate the logotypes under any circumstances.",
                "- Ensure a clear safety margin / exclusion zone around the logos of at least 15% of the logo's width.",
                "- Use the logos on clear backgrounds; use the monochrome versions if the background lacks contrast.",
                "- Never overlay other graphics, texts, or colors directly onto the official brand logos."
            ]
            doc.text(usageRules, 20, 255)

            // Footer
            doc.setFontSize(8)
            doc.setTextColor(150, 150, 150)
            doc.text("Generated automatically by Morgana & O.R.U.M. Brand System", 20, 288)

            doc.save("Brand_Identity_Guidelines.pdf")
        } catch (err) {
            console.error("Failed to generate PDF manual", err)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="size-20 bg-primary/10 text-primary rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-3">
                        <FileDown className="size-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-6 uppercase tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Brands Divided into Sections */}
                <div className="space-y-16">
                    {BRANDS.map((brand, index) => {
                        const isEven = index % 2 === 0
                        return (
                            <section 
                                key={brand.filename} 
                                className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 group"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
                                    {/* Logo Column (Span 5) */}
                                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <div className="h-64 flex items-center justify-center bg-zinc-50 rounded-3xl border border-zinc-100 p-8 relative overflow-hidden group-hover:bg-zinc-100/50 transition-colors">
                                            <div className="relative w-40 h-40 transform group-hover:scale-105 transition-transform duration-300">
                                                <Image
                                                    src={brand.logoUrl}
                                                    alt={t(brand.titleKey)}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Brand Info & Colors Column (Span 7) */}
                                    <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="h-2 w-8 rounded-full bg-primary shrink-0"></span>
                                                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 uppercase tracking-wide font-serif">
                                                    {t(brand.titleKey)}
                                                </h2>
                                            </div>
                                            <p className="text-zinc-500 text-sm leading-relaxed">
                                                {t("logo_desc")}
                                            </p>
                                        </div>

                                        {/* Color Palette Row */}
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                                                <Paintbrush className="size-3.5 text-primary" />
                                                {t("color_palette_label")}
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {brand.colors.map((color) => (
                                                    <div 
                                                        key={color.hex} 
                                                        onClick={() => copyToClipboard(color.hex)}
                                                        className="bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 hover:border-zinc-200 rounded-2xl p-3 flex items-center gap-3 transition-all cursor-pointer relative group/swatch"
                                                        title="Clicca per copiare il codice HEX"
                                                    >
                                                        <div 
                                                            className="size-10 rounded-xl shadow-inner shrink-0" 
                                                            style={{ backgroundColor: color.hex }}
                                                        />
                                                        <div className="overflow-hidden flex-1">
                                                            <span className="font-bold text-zinc-800 text-xs block truncate leading-tight">
                                                                {color.name}
                                                            </span>
                                                            <span className="font-mono text-[10px] text-zinc-400 font-bold block flex items-center gap-1">
                                                                {color.hex}
                                                                <Copy className="size-2.5 opacity-0 group-hover/swatch:opacity-100 transition-opacity" />
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Copied Success Indicator */}
                                                        {copiedColor === color.hex && (
                                                            <span className="absolute inset-0 bg-zinc-900/90 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 animate-fade-in z-10">
                                                                <Check className="size-3 text-emerald-400" />
                                                                {t("copied_label")}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Download Buttons Row */}
                                        <div className="pt-2">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                                                <ImageIcon className="size-3.5 text-primary" />
                                                {t("download_assets_label")}
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                <button 
                                                    onClick={() => handleDownload(`${brand.filename}_svg`, () => downloadAsSvg(brand.logoUrl, brand.filename))}
                                                    disabled={downloading[`${brand.filename}_svg`]}
                                                    className="py-2.5 px-5 bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    {downloading[`${brand.filename}_svg`] ? (
                                                        <>
                                                            <Check className="size-3 text-emerald-400" />
                                                            <span>{t("download_done")} SVG</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileDown className="size-3.5" />
                                                            <span>{t("download_svg")}</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(`${brand.filename}_png`, () => downloadAsPng(brand.logoUrl, brand.filename))}
                                                    disabled={downloading[`${brand.filename}_png`]}
                                                    className="py-2.5 px-5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    {downloading[`${brand.filename}_png`] ? (
                                                        <>
                                                            <Check className="size-3 text-emerald-600" />
                                                            <span>{t("download_done")} PNG</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileDown className="size-3.5" />
                                                            <span>{t("download_png")}</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(`${brand.filename}_webp`, () => downloadAsWebp(brand.logoUrl, brand.filename))}
                                                    disabled={downloading[`${brand.filename}_webp`]}
                                                    className="py-2.5 px-5 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 border border-zinc-200/50 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    {downloading[`${brand.filename}_webp`] ? (
                                                        <>
                                                            <Check className="size-3 text-emerald-600" />
                                                            <span>{t("download_done")} WebP</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileDown className="size-3.5" />
                                                            <span>{t("download_webp")}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )
                    })}
                </div>

                {/* Guidelines Section */}
                <div className="mt-16 bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10 flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
                            <FileText className="size-3.5 text-primary" /> {t("guidelines_title")}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-serif font-black uppercase tracking-tighter leading-none">
                            {t("guidelines_title")}
                        </h3>
                        <p className="text-white/60 text-sm max-w-xl">
                            {t("guidelines_desc")}
                        </p>
                    </div>
                    <button 
                        onClick={() => handleDownload("guidelines_pdf", downloadGuidelinesPdf)}
                        disabled={downloading["guidelines_pdf"]}
                        className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-zinc-900 font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform disabled:opacity-75 shrink-0 cursor-pointer"
                    >
                        {downloading["guidelines_pdf"] ? (
                            <>
                                <Check className="size-4 text-emerald-600 animate-bounce" />
                                <span>{t("download_done")}</span>
                            </>
                        ) : (
                            <>
                                <FileText className="size-4" />
                                <span>{t("download_guidelines")}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
