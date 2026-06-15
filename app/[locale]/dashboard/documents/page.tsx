"use client"

import { FileText, Download } from "lucide-react"
import { useTranslations } from "next-intl"

export const dynamic = "force-dynamic"

export default function DashboardDocumentsPage() {
    const t = useTranslations("Dashboard")

    const myDocuments = [
        { id: 1, title: t("doc_1_title"), size: "1.2 MB", type: "PDF" },
        { id: 2, title: t("doc_2_title"), size: "850 KB", type: "PDF" },
        { id: 3, title: t("doc_3_title"), size: "4.5 MB", type: "ZIP" },
        { id: 4, title: t("doc_4_title"), size: "150 KB", type: "DOCX" }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-1.5">{t("documents_title")}</h1>
                <p className="text-sm font-medium text-zinc-500 leading-relaxed">{t("documents_desc")}</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <div className="grid md:grid-cols-2 gap-6">
                    {myDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-5 rounded-[1.5rem] border border-slate-100 hover:border-slate-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-all bg-white group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-center text-zinc-400 group-hover:text-violet-600 group-hover:bg-violet-50 group-hover:border-violet-100 transition-all duration-300">
                                    <FileText className="size-6" />
                                </div>
                                <div>
                                    <p className="font-extrabold text-slate-850 group-hover:text-violet-650 transition-colors text-sm sm:text-base tracking-tight leading-snug">{doc.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-medium">
                                        <span className="font-bold bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded text-zinc-550 text-[10px]">{doc.type}</span>
                                        <span>•</span>
                                        <span>{doc.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 hover:border-slate-200 rounded-xl text-zinc-450 hover:text-slate-900 transition-all">
                                <Download className="size-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
