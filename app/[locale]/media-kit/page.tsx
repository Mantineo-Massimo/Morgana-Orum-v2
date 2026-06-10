"use client"

import { useState } from "react"
import { FileDown, Image as ImageIcon, Paintbrush, FileText, Check, Copy } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
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
            { name: "Morgana Red", hex: "#c12830", desc: "Rosso istituzionale primario" },
            { name: "Charcoal Black", hex: "#000000", desc: "Nero istituzionale dei testi" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco per sfondi e contrasto" }
        ]
    },
    {
        titleKey: "orum_title",
        logoUrl: "/assets/orum.webp",
        filename: "associazione_orum",
        colors: [
            { name: "Orum Navy", hex: "#18182e", desc: "Blu primario istituzionale" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco istituzionale" },
            { name: "Italian Green", hex: "#009246", desc: "Tricolore bandiera (Verde)" },
            { name: "Italian Red", hex: "#ce2b37", desc: "Tricolore bandiera (Rosso)" }
        ]
    },
    {
        titleKey: "matricole_title",
        logoUrl: "/assets/unimematricole.webp",
        filename: "unime_matricole",
        colors: [
            { name: "Matricole Blue", hex: "#004b87", desc: "Blu scuro principale" },
            { name: "Matricole Light Blue", hex: "#0096da", desc: "Bordo circolare (Azzurrino)" },
            { name: "Matricole Yellow", hex: "#f9a620", desc: "Giallo dei testi e nastro" },
            { name: "Matricole Gray", hex: "#f1f5f9", desc: "Grigetto chiaro dello sfondo" }
        ]
    },
    {
        titleKey: "unimhealth_title",
        logoUrl: "/assets/unimhealth.webp",
        filename: "unimhealth",
        colors: [
            { name: "Unimhealth Red", hex: "#c12830", desc: "Rosso primario del cerchio" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco dell'elemento interno" }
        ]
    },
    {
        titleKey: "economia_title",
        logoUrl: "/assets/studentieconomia.webp",
        filename: "studenti_economia",
        colors: [
            { name: "Economia Navy", hex: "#18224b", desc: "Blu scuro del cerchio esterno" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco per icona e testi" }
        ]
    },
    {
        titleKey: "scipog_title",
        logoUrl: "/assets/studentiscipog.webp",
        filename: "studenti_scipog",
        colors: [
            { name: "Scipog Gold", hex: "#f4b43b", desc: "Giallo primario del cerchio" },
            { name: "Dark Charcoal", hex: "#212529", desc: "Nero scuro dei testi" },
            { name: "Pure White", hex: "#ffffff", desc: "Dettagli chiari del tocco" }
        ]
    },
    {
        titleKey: "dicam_title",
        logoUrl: "/assets/insidedicam.webp",
        filename: "inside_dicam",
        colors: [
            { name: "Dicam Cyan", hex: "#00b4d8", desc: "Azzurrino del cerchio esterno" },
            { name: "Dicam Pink", hex: "#d81b60", desc: "Fucsia del cerchio interno" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco di sfondo" }
        ]
    },
    {
        titleKey: "piazza_title",
        logoUrl: "/assets/piazzadellarte.webp",
        filename: "piazza_dell_arte",
        colors: [
            { name: "Piazza Gold", hex: "#f9a620", desc: "Giallo/Oro artistico primario" },
            { name: "Piazza Green", hex: "#27a85d", desc: "Verde secondario creativo" },
            { name: "Piazza Cyan", hex: "#1fbcd3", desc: "Ciano vivace di accento" },
            { name: "Pure White", hex: "#ffffff", desc: "Bianco per contrasti e sfondi" }
        ]
    }
]

const pdfTranslations = {
    it: {
        title: "GUIDA IDENTITA VISIVA",
        subtitle: "Specifiche e Linee Guida Ufficiali del Brand",
        intro_title: "1. INTRODUZIONE",
        intro_text: (brandName: string) => [
            `Questo manuale contiene le linee guida ufficiali per l'uso del brand "${brandName}".`,
            "L'applicazione coerente di questi elementi grafici e fondamentale per mantenere",
            "la riconoscibilita e la professionalita dell'identita visiva della nostra rete."
        ],
        logo_title: "2. LOGO E DOWNLOAD",
        logo_desc: "Utilizzare sempre la versione ad alta risoluzione del logo. Non deformare,",
        logo_desc_2: "non ruotare e non alterare i colori originali per nessuna ragione.",
        palette_title: "3. TAVOLOZZA COLORI UFFICIALE",
        rules_title: "4. REGOLE DI UTILIZZO",
        rules: [
            "- Mantenere sempre l'area di rispetto intorno al logo (almeno il 15% del diametro).",
            "- Non sovrapporre testi, elementi grafici o sfondi eccessivamente confusi.",
            "- Rispettare rigorosamente i codici colore HEX indicati in questo documento.",
            "- Per la stampa digitale ed offset, utilizzare i formati ad alta fedelta cromatica."
        ],
        footer: "Documento generato automaticamente da Morgana & O.R.U.M. Brand System"
    },
    en: {
        title: "VISUAL IDENTITY GUIDE",
        subtitle: "Official Brand Specifications and Guidelines",
        intro_title: "1. INTRODUCTION",
        intro_text: (brandName: string) => [
            `This manual contains the official guidelines for using the "${brandName}" brand.`,
            "The consistent application of these visual elements is essential to maintain",
            "the recognition and professionalism of our network's visual identity."
        ],
        logo_title: "2. LOGO AND ASSETS",
        logo_desc: "Always use the high-resolution version of the logo. Do not distort, crop,",
        logo_desc_2: "or alter the original colors under any circumstances.",
        palette_title: "3. OFFICIAL COLOR PALETTE",
        rules_title: "4. USAGE RULES",
        rules: [
            "- Always maintain a safety margin around the logo (at least 15% of width).",
            "- Do not overlay texts, graphic elements, or cluttered backgrounds.",
            "- Strictly adhere to the HEX color codes specified in this document.",
            "- For digital and offset printing, use the high-fidelity formats."
        ],
        footer: "Document automatically generated by Morgana & O.R.U.M. Brand System"
    }
}

export default function MediaKitPage() {
    const t = useTranslations("MediaKitPage")
    const locale = useLocale()
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

    const fetchImageAsPngBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url)
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        
        return new Promise<string>((resolve, reject) => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                canvas.width = img.naturalWidth || img.width || 512
                canvas.height = img.naturalHeight || img.height || 512
                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(img, 0, 0)
                    const dataUrl = canvas.toDataURL("image/png")
                    resolve(dataUrl)
                } else {
                    reject(new Error("Canvas context not available"))
                }
                URL.revokeObjectURL(objectUrl)
            }
            img.onerror = () => {
                reject(new Error("Failed to load image"))
                URL.revokeObjectURL(objectUrl)
            }
            img.src = objectUrl
        })
    }

    const hexToRgb = (hex: string): [number, number, number] => {
        const cleanHex = hex.replace("#", "")
        const r = parseInt(cleanHex.substring(0, 2), 16)
        const g = parseInt(cleanHex.substring(2, 4), 16)
        const b = parseInt(cleanHex.substring(4, 6), 16)
        return [r, g, b]
    }

    const downloadSingleBrandPdf = async (brand: BrandAsset) => {
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            const activeLocale = (locale === "it" || locale === "en") ? locale : "it"
            const strings = pdfTranslations[activeLocale]
            const brandName = t(brand.titleKey)

            // Extract primary color RGB for header
            const primaryColorHex = brand.colors[0].hex
            const [pr, pg, pb] = hexToRgb(primaryColorHex)

            // Draw Header Banner with brand primary color
            doc.setFillColor(pr, pg, pb)
            doc.rect(0, 0, 210, 50, "F")

            // Title inside header banner
            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(22)
            doc.text(`${brandName.toUpperCase()}`, 20, 26)
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.text(strings.subtitle, 20, 36)

            // Section 1: Introduction
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text(strings.intro_title, 20, 68)
            
            doc.setFont("helvetica", "normal")
            doc.setFontSize(10)
            doc.setTextColor(60, 60, 60)
            doc.text(strings.intro_text(brandName), 20, 76)

            // Section 2: Logo image integration
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text(strings.logo_title, 20, 105)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.setTextColor(100, 100, 100)
            doc.text(`${strings.logo_desc} ${strings.logo_desc_2}`, 20, 113)

            // Fetch and draw logo on-the-fly
            try {
                const logoPngBase64 = await fetchImageAsPngBase64(brand.logoUrl)
                doc.addImage(logoPngBase64, "PNG", 80, 120, 50, 50)
            } catch (err) {
                console.error("Failed to load logo in PDF", err)
                // Draw a fallback box if image loading fails
                doc.setDrawColor(200, 200, 200)
                doc.rect(80, 120, 50, 50)
                doc.setTextColor(150, 150, 150)
                doc.setFontSize(8)
                doc.text("[Logo Image]", 95, 147)
            }

            // Section 3: Color Palette
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text(strings.palette_title, 20, 185)

            let startY = 195
            brand.colors.forEach((c) => {
                const [cr, cg, cb] = hexToRgb(c.hex)
                
                // Draw color block
                doc.setFillColor(cr, cg, cb)
                doc.rect(20, startY, 12, 12, "F")
                
                // Color text labels
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(10)
                doc.text(c.name, 38, startY + 5)
                
                doc.setFont("helvetica", "normal")
                doc.setFontSize(8)
                doc.setTextColor(120, 120, 120)
                doc.text(`HEX: ${c.hex} | RGB: (${cr}, ${cg}, ${cb})`, 38, startY + 10)
                
                doc.setTextColor(80, 80, 80)
                doc.text(c.desc, 110, startY + 7)

                startY += 17
            })

            // Section 4: Rules
            doc.setTextColor(24, 24, 46)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(14)
            doc.text(strings.rules_title, 20, 253)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.setTextColor(60, 60, 60)
            doc.text(strings.rules, 20, 261)

            // Footer info
            doc.setFontSize(7)
            doc.setTextColor(160, 160, 160)
            doc.text(`${strings.footer} | Locale: ${activeLocale.toUpperCase()}`, 20, 288)

            doc.save(`${brand.filename}_brand_manual.pdf`)
        } catch (err) {
            console.error("Failed to generate PDF guide", err)
        }
    }

    const downloadGlobalGuidelinesPdf = async () => {
        try {
            const { jsPDF } = await import("jspdf")
            const doc = new jsPDF()

            const activeLocale = (locale === "it" || locale === "en") ? locale : "it"
            const strings = pdfTranslations[activeLocale]

            for (let i = 0; i < BRANDS.length; i++) {
                const brand = BRANDS[i]
                const brandName = t(brand.titleKey)

                // If not the first page, add a new page
                if (i > 0) {
                    doc.addPage()
                }

                // Extract primary color RGB for header banner
                const primaryColorHex = brand.colors[0].hex
                const [pr, pg, pb] = hexToRgb(primaryColorHex)

                // Draw Header Banner with brand primary color
                doc.setFillColor(pr, pg, pb)
                doc.rect(0, 0, 210, 50, "F")

                // Title inside header banner
                doc.setTextColor(255, 255, 255)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(20)
                doc.text(`${brandName.toUpperCase()}`, 20, 24)
                doc.setFont("helvetica", "normal")
                doc.setFontSize(10)
                doc.text(strings.subtitle, 20, 35)

                // Page Number / Total Pages
                doc.setFontSize(8)
                doc.text(`${i + 1} / ${BRANDS.length}`, 190, 24, { align: "right" })

                // Section 1: Introduction
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(14)
                doc.text(strings.intro_title, 20, 68)
                
                doc.setFont("helvetica", "normal")
                doc.setFontSize(10)
                doc.setTextColor(60, 60, 60)
                doc.text(strings.intro_text(brandName), 20, 76)

                // Section 2: Logo image integration
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(14)
                doc.text(strings.logo_title, 20, 105)

                doc.setFont("helvetica", "normal")
                doc.setFontSize(9)
                doc.setTextColor(100, 100, 100)
                doc.text(`${strings.logo_desc} ${strings.logo_desc_2}`, 20, 113)

                // Fetch and draw logo on-the-fly
                try {
                    const logoPngBase64 = await fetchImageAsPngBase64(brand.logoUrl)
                    doc.addImage(logoPngBase64, "PNG", 80, 120, 50, 50)
                } catch (err) {
                    console.error("Failed to load logo in PDF", err)
                    // Draw a fallback box if image loading fails
                    doc.setDrawColor(200, 200, 200)
                    doc.rect(80, 120, 50, 50)
                    doc.setTextColor(150, 150, 150)
                    doc.setFontSize(8)
                    doc.text("[Logo Image]", 95, 147)
                }

                // Section 3: Color Palette
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(14)
                doc.text(strings.palette_title, 20, 185)

                let startY = 195
                brand.colors.forEach((c) => {
                    const [cr, cg, cb] = hexToRgb(c.hex)
                    
                    // Draw color block
                    doc.setFillColor(cr, cg, cb)
                    doc.rect(20, startY, 10, 10, "F")
                    
                    // Color text labels
                    doc.setTextColor(24, 24, 46)
                    doc.setFont("helvetica", "bold")
                    doc.setFontSize(9)
                    doc.text(c.name, 35, startY + 4)
                    
                    doc.setFont("helvetica", "normal")
                    doc.setFontSize(8)
                    doc.setTextColor(120, 120, 120)
                    doc.text(`HEX: ${c.hex} | RGB: (${cr}, ${cg}, ${cb})`, 35, startY + 8)
                    
                    doc.setTextColor(80, 80, 80)
                    doc.setFontSize(8)
                    doc.text(c.desc, 110, startY + 6)

                    startY += 13
                })

                // Section 4: Rules
                doc.setTextColor(24, 24, 46)
                doc.setFont("helvetica", "bold")
                doc.setFontSize(14)
                doc.text(strings.rules_title, 20, 253)

                doc.setFont("helvetica", "normal")
                doc.setFontSize(9)
                doc.setTextColor(60, 60, 60)
                doc.text(strings.rules, 20, 261)

                // Footer info
                doc.setFontSize(7)
                doc.setTextColor(160, 160, 160)
                doc.text(`${strings.footer} | Locale: ${activeLocale.toUpperCase()}`, 20, 288)
            }

            doc.save("Brands_Identity_Guidelines.pdf")
        } catch (err) {
            console.error("Failed to generate global PDF manual", err)
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
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
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
                                                {/* Guidelines PDF for this specific brand */}
                                                <button 
                                                    onClick={() => handleDownload(`${brand.filename}_pdf`, () => downloadSingleBrandPdf(brand))}
                                                    disabled={downloading[`${brand.filename}_pdf`]}
                                                    className="py-2.5 px-5 bg-white text-zinc-700 hover:bg-zinc-50 border border-zinc-200 disabled:opacity-75 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    {downloading[`${brand.filename}_pdf`] ? (
                                                        <>
                                                            <Check className="size-3 text-emerald-600" />
                                                            <span>{t("download_done")} PDF</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText className="size-3.5" />
                                                            <span>{t("download_guidelines")}</span>
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

                {/* Global Guidelines Section */}
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
                        onClick={() => handleDownload("guidelines_pdf", downloadGlobalGuidelinesPdf)}
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
