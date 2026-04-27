import { Link } from "@/i18n/routing"
import { Cookie, ShieldAlert, Settings, Info, MousePointer2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function CookiePage() {
    const t = useTranslations("Cookie")

    const sections = [
        { id: "intro", icon: Info },
        { id: "technical", icon: Cookie },
        { id: "analytics", icon: MousePointer2 },
        { id: "management", icon: Settings },
    ]

    return (

                    <div className="prose prose-zinc max-w-none text-zinc-600 leading-relaxed font-medium">
                        <p className="text-xl text-zinc-500 mb-12 italic border-l-4 border-zinc-200 pl-6">
                            {tp("intro")}
                        </p>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("what_are_title")}</h2>
                            <p>{tp("what_are_desc")}</p>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("types_title")}</h2>
                            <ul className="space-y-4">
                                <li><strong>{tp("t1")}</strong></li>
                                <li><strong>{tp("t2")}</strong></li>
                            </ul>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("how_to_title")}</h2>
                            <p>{tp("how_to_desc")}</p>
                            <ul className="mt-6 space-y-2">
                                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" className="text-primary hover:underline font-bold">Google Chrome</a></li>
                                <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" className="text-primary hover:underline font-bold">Mozilla Firefox</a></li>
                                <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" className="text-primary hover:underline font-bold">Apple Safari</a></li>
                                <li><a href="https://support.microsoft.com/it-it/windows/eliminare-e-gestire-i-cookie-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" className="text-primary hover:underline font-bold">Microsoft Edge</a></li>
                            </ul>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-bold text-foreground mb-6">{tp("rights_title")}</h2>
                            <p>{tp("rights_desc")}</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
