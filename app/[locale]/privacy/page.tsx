import { Link } from "@/i18n/routing"
import { ArrowLeft, Shield } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PrivacyPage() {
    const t = useTranslations("Footer")
    const tp = useTranslations("Privacy")
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
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="size-6" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-black text-foreground">
                            Privacy Policy
                        </h1>
                    </div>

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            {tp("intro")}
                        </p>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("data_controller_title")}</h2>
                            <p>{tp("data_controller_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("data_processor_title")}</h2>
                            <p>{tp("data_processor_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("data_types_title")}</h2>
                            <p>{tp("data_types_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("purposes_title")}</h2>
                            <p>{tp("purposes_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("recipients_title")}</h2>
                            <p>{tp("recipients_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("retention_title")}</h2>
                            <p>{tp("retention_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("rights_title")}</h2>
                            <p>{tp("rights_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("security_title")}</h2>
                            <p>{tp("security_desc")}</p>
                        </section>

                        <div className="mt-20 pt-10 border-t border-zinc-100 text-sm text-zinc-400">
                            <p>{tp("last_update")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
