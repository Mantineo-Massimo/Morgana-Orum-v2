import Link from "next/link"
import { ArrowLeft, FileText, Download } from "lucide-react"
import { useTranslations } from "next-intl"

export default function StatutoPage() {
    const t = useTranslations("Footer")
    const ts = useTranslations("Statuto")
    return (
        <div className="min-h-screen bg-zinc-50 pt-32 pb-20">
            <div className="container max-w-4xl mx-auto px-6">
                <Link
                    href="/"
                    className="group inline-flex items-center gap-2 text-zinc-500 hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t("back_to_main")}</span>
                </Link>

                <div className="bg-white rounded-[2.5rem] border border-zinc-200 p-8 md:p-16 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                            <FileText className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            {t("statute")}
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            {ts("intro")}
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{ts("principles_title")}</h2>
                        <p>
                            {ts("motto")}
                        </p>
                        <ul>
                            <li>{ts("p1")}</li>
                            <li>{ts("p2")}</li>
                            <li>{ts("p3")}</li>
                        </ul>

                        <div className="my-16 p-8 bg-zinc-50 border border-zinc-200 rounded-3xl flex flex-col items-center text-center">
                            <h3 className="text-xl font-bold text-foreground mb-4">{ts("doc_title")}</h3>
                            <p className="text-sm text-zinc-500 mb-8 max-w-md">
                                {ts("doc_desc")}
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 bg-[#18182e] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all group"
                            >
                                <Download className="size-5 group-hover:translate-y-1 transition-transform" />
                                {ts("download")}
                            </a>
                            <p className="mt-4 text-[10px] text-zinc-400 uppercase tracking-widest">Version: 2024.1.0</p>
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{ts("transparency_title")}</h2>
                        <p>
                            {ts("transparency_desc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
