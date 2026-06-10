"use client"

import { useState } from "react"
import { FileDown, Image as ImageIcon, Paintbrush, FileText, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export const dynamic = "force-dynamic"

type BrandAsset = {
    titleKey: string
    logoUrl: string
    filename: string
}

const BRANDS: BrandAsset[] = [
    { titleKey: "morgana_title", logoUrl: "/assets/morgana.webp", filename: "associazione_morgana" },
    { titleKey: "orum_title", logoUrl: "/assets/orum.webp", filename: "associazione_orum" },
    { titleKey: "matricole_title", logoUrl: "/assets/unimematricole.webp", filename: "unime_matricole" },
    { titleKey: "unimhealth_title", logoUrl: "/assets/unimhealth.webp", filename: "unimhealth" },
    { titleKey: "economia_title", logoUrl: "/assets/studentieconomia.webp", filename: "studenti_economia" },
    { titleKey: "scipog_title", logoUrl: "/assets/studentiscipog.webp", filename: "studenti_scipog" },
    { titleKey: "dicam_title", logoUrl: "/assets/insidedicam.webp", filename: "inside_dicam" },
    { titleKey: "piazza_title", logoUrl: "/assets/piazzadellarte.webp", filename: "piazza_dell_arte" }
]

export default function MediaKitPage() {
    const t = useTranslations("MediaKitPage")
    const [downloading, setDownloading] = useState<Record<string, boolean>>({})

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

    const brandColors = [
        { name: "Morgana Red", hex: "#c12830", desc: "Colore primario di Associazione Morgana" },
        { name: "Orum Blue", hex: "#18182e", desc: "Colore primario di Associazione O.R.U.M." },
        { name: "Piazza Gold", hex: "#f9a620", desc: "Colore primario di Piazza dell'Arte (Oro)" },
        { name: "Piazza Green", hex: "#27a85d", desc: "Colore secondario di Piazza dell'Arte" },
        { name: "Piazza Cyan", hex: "#1fbcd3", desc: "Colore d'accento di Piazza dell'Arte" }
    ]

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

                <div className="space-y-16">
                    {/* 1. Assets Downloads */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-wider text-zinc-800 font-serif">
                                Loghi Ufficiali
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {BRANDS.map((brand) => (
                                <div key={brand.filename} className="bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
                                    <div>
                                        <div className="h-44 flex items-center justify-center mb-6 bg-zinc-50 rounded-2xl border border-zinc-100/50 p-6 relative overflow-hidden">
                                            <div className="relative w-28 h-28 transform group-hover:scale-105 transition-transform duration-300">
                                                <Image
                                                    src={brand.logoUrl}
                                                    alt={t(brand.titleKey)}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-zinc-900 mb-2 uppercase tracking-wide">
                                            {t(brand.titleKey)}
                                        </h3>
                                        <p className="text-xs text-zinc-400 mb-6 font-medium">
                                            {t("logo_desc")}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleDownload(`${brand.filename}_svg`, () => downloadAsSvg(brand.logoUrl, brand.filename))}
                                                disabled={downloading[`${brand.filename}_svg`]}
                                                className="flex-1 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                {downloading[`${brand.filename}_svg`] ? (
                                                    <>
                                                        <Check className="size-3 text-emerald-400" />
                                                        <span>Fatto</span>
                                                    </>
                                                ) : (
                                                    t("download_svg")
                                                )}
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(`${brand.filename}_png`, () => downloadAsPng(brand.logoUrl, brand.filename))}
                                                disabled={downloading[`${brand.filename}_png`]}
                                                className="flex-1 py-2.5 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                {downloading[`${brand.filename}_png`] ? (
                                                    <>
                                                        <Check className="size-3 text-emerald-600" />
                                                        <span>Fatto</span>
                                                    </>
                                                ) : (
                                                    t("download_png")
                                                )}
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleDownload(`${brand.filename}_webp`, () => downloadAsWebp(brand.logoUrl, brand.filename))}
                                            disabled={downloading[`${brand.filename}_webp`]}
                                            className="w-full py-2 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-75 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-zinc-200/50 flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            {downloading[`${brand.filename}_webp`] ? (
                                                <>
                                                    <Check className="size-2.5 text-emerald-600" />
                                                    <span>Fatto</span>
                                                </>
                                            ) : (
                                                t("download_webp")
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Color Palette */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Paintbrush className="size-5 text-primary" />
                            <h2 className="text-xl font-black uppercase tracking-wider text-zinc-800 font-serif">
                                {t("colors_title")}
                            </h2>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {brandColors.map((color) => (
                                <div key={color.name} className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-sm text-center">
                                    <div
                                        className="w-full aspect-square rounded-2xl mb-4 shadow-inner"
                                        style={{ backgroundColor: color.hex }}
                                    ></div>
                                    <h3 className="font-bold text-zinc-900 leading-tight mb-1 text-sm">{color.name}</h3>
                                    <span className="font-mono text-xs font-black text-zinc-400 block mb-2">{color.hex}</span>
                                    <p className="text-[10px] text-zinc-400 font-medium leading-tight">{color.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Typography & Guidelines */}
                    <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
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
                                    <span>Scaricato</span>
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
        </div>
    )
}
