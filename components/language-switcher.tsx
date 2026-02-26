"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/routing"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const switchLocale = (newLocale: string) => {
        router.push(pathname, { locale: newLocale })
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-full border border-white/5">
            <Globe className="size-3 text-zinc-400" />
            <div className="flex gap-0.5">
                <button
                    onClick={() => switchLocale("it")}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${locale === "it"
                            ? "bg-white text-zinc-900 shadow-sm"
                            : "text-zinc-500 hover:text-white"
                        }`}
                >
                    IT
                </button>
                <button
                    onClick={() => switchLocale("en")}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${locale === "en"
                            ? "bg-white text-zinc-900 shadow-sm"
                            : "text-zinc-500 hover:text-white"
                        }`}
                >
                    EN
                </button>
            </div>
        </div>
    )
}
