"use client"

import { FileText, Download } from "lucide-react"

export const dynamic = "force-dynamic"

const myDocuments = [
    { id: 1, title: "Guida alle Borse di Studio 2026", size: "1.2 MB", type: "PDF" },
    { id: 2, title: "Regolamento Tasse UniMe", size: "850 KB", type: "PDF" },
    { id: 3, title: "Dispense: Diritto Privato (Parte 1)", size: "4.5 MB", type: "ZIP" },
    { id: 4, title: "Modulo Adesione Associazione", size: "150 KB", type: "DOCX" }
]

export default function DashboardDocumentsPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 mb-2">Documenti</h1>
                <p className="text-zinc-500">Materiale didattico, guide e modulistica.</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
                <div className="grid md:grid-cols-2 gap-4">
                    {myDocuments.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all bg-white group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-colors">
                                    <FileText className="size-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{doc.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                        <span className="font-bold bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">{doc.type}</span>
                                        <span>•</span>
                                        <span>{doc.size}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 hover:bg-zinc-100 rounded-full text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                <Download className="size-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
