import Link from "next/link"
import { ArrowLeft, Cookie } from "lucide-react"
import { useTranslations } from "next-intl"

export default function CookiesPage() {
    const t = useTranslations("Footer")
    const tp = useTranslations("Cookie")
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
                        <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                            <Cookie className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            {t("cookies")}
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            {tp("intro")}
                        </p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("what_are_title")}</h2>
                        <p>{tp("what_are_desc")}</p>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("types_title")}</h2>
                        <ul>
                            <li><strong>{tp("t1")}</strong></li>
                            <li><strong>{tp("t2")}</strong></li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("how_to_title")}</h2>
                        <p>{tp("how_to_desc")}</p>
                        <ul className="mt-4">
                            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" className="text-primary hover:underline">Chrome Settings</a></li>
                            <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" className="text-primary hover:underline">Firefox Settings</a></li>
                            <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" className="text-primary hover:underline">Safari Settings</a></li>
                        </ul>

                        <h2 className="text-2xl font-bold text-foreground mt-12 mb-6">{tp("rights_title")}</h2>
                        <p>
                            {tp("rights_desc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
