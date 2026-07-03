"use client"

import { useTranslations } from "next-intl"

export function RestoreChatbotLink() {
    const t = useTranslations("Chatbot")
    
    const handleRestore = (e: React.MouseEvent) => {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent("show-iarmone-chatbot"))
    }

    return (
        <button
            onClick={handleRestore}
            className="text-left text-white/70 hover:text-white transition-colors"
            type="button"
        >
            {t("restore_link") || "Attiva IArmone (IA)"}
        </button>
    )
}
